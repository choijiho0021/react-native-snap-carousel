import AsyncStorage from '@react-native-community/async-storage';
import {
  RouteProp,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  AppState,
  NativeEventEmitter,
  NativeModules,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  Inviter,
  Registerer,
  Session,
  SessionState,
  UserAgent,
  UserAgentOptions,
} from 'sip.js';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import {colors} from '@/constants/Colors';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import api from '@/redux/api/api';
import utils from '@/redux/api/utils';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {
  actions as logActions,
  LogAction,
  LogModelState,
} from '@/redux/modules/log';
import {ProductModelState} from '@/redux/modules/product';
import {
  actions as talkActions,
  TalkAction,
  TalkModelState,
} from '@/redux/modules/talk';
import {
  actions as toastActions,
  Toast,
  ToastAction,
} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import {useInterval} from '@/utils/useInterval';
import BetaModalBox from './component/BetaModalBox';
import CallReviewModal from './component/CallReviewModal';
import PhoneCertBox from './component/PhoneCertBox';
import TalkMain from './component/TalkMain';
import RNSessionDescriptionHandler from './RNSessionDescriptionHandler';

const {talkServer, talkPort, turnServer} = Env.get();

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
});

export type RkbTalkNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Talk'
>;
type RkbTalkRouteProp = RouteProp<HomeStackParamList, 'Talk'>;

type RkbTalkProps = {
  navigation: RkbTalkNavigationProp;
  route: RkbTalkRouteProp;

  account: AccountModelState;
  talk: TalkModelState;
  product: ProductModelState;
  log: LogModelState;
  action: {
    account: AccountAction;
    talk: TalkAction;
    log: LogAction;
    toast: ToastAction;
  };
};

const RkbTalk: React.FC<RkbTalkProps> = ({
  route,
  account: {realMobile, iccid, token},
  talk: {
    called,
    tariff,
    emg,
    tooltip,
    ccode,
    terminateCall,
    isReceivedBeta,
    beta,
    totalCall,
  },
  product: {rule},
  log: {talkLog},
  navigation,
  action,
}) => {
  const [userAgent, setUserAgent] = useState<UserAgent | null>(null);
  const [inviter, setInviter] = useState<Inviter | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>(
    SessionState.Initial,
  );
  const [speakerPhone, setSpeakerPhone] = useState(false);
  const [mute, setMute] = useState(false);
  const [dtmfSession, setDtmfSession] = useState<Session>();
  const [duration, setDuration] = useState(0);
  const [maxTime, setMaxTime] = useState<number>(60);
  const [time, setTime] = useState<string>('');
  const [point, setPoint] = useState<number>(0);
  const [dtmf, setDtmf] = useState<string>();
  const [pressed, setPressed] = useState<string>();
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [callUUID, setCallUUID] = useState();
  const emgOn = useMemo(
    () => Object.entries(emg || {})?.filter(([k, v]) => v === '1'),
    [emg],
  );
  const appState = useRef('unknown');
  const {top} = useSafeAreaInsets();
  // showWarning이 전화연결되면 바로 나오는 이슈 있음.
  const [min, showWarning] = useMemo(() => {
    const checkRemain = (maxTime || 0) - duration;
    const m =
      maxTime && sessionState === SessionState.Established
        ? Math.floor((checkRemain <= 0 ? 0 : checkRemain) / 60)
        : undefined;
    return [m, (m && m <= 2 && duration > 3) || false];
  }, [duration, maxTime, sessionState]);

  const {CallKitModule} = NativeModules;
  const callKitEmitter = new NativeEventEmitter(CallKitModule);
  const isSuccessAuth = useMemo(() => (realMobile || '') !== '', [realMobile]);

  useEffect(() => {
    console.log('@@@ actionStr: reload ');
  }, []);
 
  useFocusEffect(
    React.useCallback(() => {
      const { actionStr } = route?.params || {};
      if (actionStr === 'reload') {
        navigation.setParams({
          actionStr: undefined,
        });
        if (iccid && token) action.account.getAccount({ iccid, token });
      }
    }, [action.account, iccid, navigation, route, token])
  );

  // beta service on, 통화 종료시, 1/3 확률로 통화품질모달 출력
  useEffect(() => {
    if (
      rule?.talk?.beta === '0' &&
      sessionState === SessionState.Terminated &&
      totalCall % 3 === 0
    ) {
      setVisible(true);
    }
  }, [rule?.talk?.beta, sessionState, totalCall]);

  useFocusEffect(
    React.useCallback(() => {
      // account 리프레시
      if (token && iccid) {
        action.account.getAccount({iccid, token});
      }
    }, [action.account, iccid, token]),
  );

  useEffect(() => {
    if (_.isEmpty(tariff)) {
      action.talk.getTariff();
    }
  }, [action.talk, tariff]);

  useFocusEffect(
    React.useCallback(() => {
      action.talk.getEmgInfo();
    }, [action.talk]),
  );

  const isFocused = useIsFocused();
  useEffect(() => {
    // 앱 첫 실행 여부 확인
    if (realMobile && isFocused) {
      AsyncStorage.getItem('alreadyRkbLaunched').then((result) => {
        if (result == null) {
          navigation.navigate('TalkPermission');
          AsyncStorage.setItem('alreadyRkbLaunched', 'true');
        } else {
          // 권한 확인 이후
          AsyncStorage.getItem('talkTooltip').then((r) => {
            if (r == null) {
              action.talk.updateTooltip(true);
              AsyncStorage.setItem('talkTooltip', 'true');
            }
          });
        }
      });
    }
  }, [action.talk, isFocused, navigation, realMobile]);

  const getPoint = useCallback(() => {
    if (iccid) {
      setRefreshing(true);
      API.TalkApi.getTalkPoint({iccid})
        .then((rsp) => {
          console.log('@@@ point', rsp);
          utils.tlog(`@@@ point, ${JSON.stringify(rsp)}`);
          if (rsp?.result === 0) {
            setPoint(rsp?.objects?.tpnt);
          }

          if (!_.isNumber(rsp?.objects?.tpnt)) {
            AppAlert.confirm(
              i18n.t('talk:point:error:title'),
              i18n.t('talk:point:error:cont'),
              {
                ok: () => getPoint(),
                cancel: () =>
                  navigation.navigate('HomeStack', {screen: 'Home'}),
              },
            );
          }
        })
        .finally(() => setRefreshing(false));
    }
  }, [iccid, navigation]);

  const checkPermission = useCallback(async (type: string) => {
    const cont =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CONTACTS
        : PERMISSIONS.ANDROID.READ_CONTACTS;
    const mic =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO;

    const result = await check(type === 'cont' ? cont : mic);

    return result === RESULTS.GRANTED || result === RESULTS.UNAVAILABLE;
  }, []);

  const releaseCall = useCallback(() => {
    if (inviter) {
      switch (inviter.state) {
        case SessionState.Initial:
        case SessionState.Establishing:
          inviter.cancel();
          break;
        case SessionState.Established:
          // An established session
          console.log('@@@ bye1');
          utils.tlog(`@@@ bye1`);
          inviter.bye();
          break;
        case SessionState.Terminating:
        case SessionState.Terminated:
          console.log(
            '@@@ Cannot terminate a session that is already terminated',
          );
          utils.tlog(`@@@ Cannot terminate a session`);
          break;
        default:
          console.log('unknown state');
          utils.tlog(`@@@ unknown state`);
          break;
      }
      setSessionState(inviter.state);
    }
  }, [inviter]);

  const getMaxCallTime = useCallback(() => {
    // 07079190190, 07079190216
    API.TalkApi.getChannelInfo({mobile: realMobile}).then((rsp) => {
      if (rsp?.result === 0) {
        const m =
          rsp?.objects?.channel?.variable?.MAX_CALL_TIME?.match(/^[^:]+/);

        console.log('@@@ max call time', m);
        utils.tlog(`@@@ max call time, ${JSON.stringify(m)}`);
        if (m?.length > 0) setMaxTime(Number(m[0]) / 1000);
        else releaseCall();
      }
      // console.log('@@@ max call time', rsp);
    });
  }, [releaseCall, realMobile]);

  const makeSeconds = useCallback((num: number) => {
    return (num < 10 ? '0' : '') + num;
  }, []);

  const renderTime = useCallback(
    (t: number) => {
      if (t < 60) {
        setTime(`00:${makeSeconds(t)}`);
      } else {
        const mins = Math.floor(t / 60);
        const secs = t - mins * 60;

        setTime(`${makeSeconds(mins)}:${makeSeconds(secs)}`);
      }
    },
    [makeSeconds],
  );

  useInterval(
    () => {
      if (sessionState === SessionState.Established) {
        setDuration((prev) => {
          action.talk.updateDuration(prev + 1);
          return prev + 1;
        });
        renderTime(duration);
      }
    },
    sessionState === SessionState.Established ? 1000 : null,
    // maxTime - duration >= 0 ? 1000 : null,
  );

  // 최초 기본값으로 60초를 넣어줘서 전화 기본적으로 연결되도록 적용
  useEffect(() => {
    if (
      inviter &&
      ((maxTime && maxTime - duration < 0) ||
        (inviter?.state === SessionState.Established && !maxTime))
    ) {
      console.log('@@@ bye2', maxTime, duration);
      utils.tlog(`@@@ bye2 ${maxTime}, ${duration}`);
      inviter?.bye();
      setSessionState(inviter?.state);
    }
  }, [duration, inviter, maxTime]);

  const setupRemoteMedia = useCallback((session: Session) => {
    /*
    const remoteStream = new MediaStream();
    session.sessionDescriptionHandler?.peerConnection
      ?.getReceivers()
      .forEach((receiver) => {
        if (receiver.track) {
          console.log('@@@ add track');
          remoteStream.addTrack(receiver.track);
        }
      });
      */

    console.log('@@@ setup', session);
    utils.tlog(`@@@ setup`);
    setDtmfSession(session);
  }, []);

  const cleanupMedia = useCallback(() => {
    NativeModules?.CallKitModule?.toggleSpeaker(callUUID, false).then(() =>
      setCallUUID(),
    );
    setSpeakerPhone(false);
    NativeModules?.CallKitModule?.endCalls();
    setRefreshing(true);

    setInviter(null);

    setDuration(0);
    setMaxTime(60);
    setTime('');
    setTimeout(() => {
      getPoint();
    }, 1000);
    setDtmf('');
    setPressed('');
    setMute(() => {
      InCallManager.setMicrophoneMute(false);
      return false;
    });
    // Terminated 될 때 callReview Modal 출력 목적
    setSessionState(SessionState.Initial);

    // InCallManager.stop();
    // 저장했던 번호 삭제
    action.talk.updateNumberClicked({});

    setRefreshing(false);
  }, [action.talk, callUUID, getPoint]);

  useEffect(() => {
    if (terminateCall && called) {
      action.talk.setTerminateCall(false);
      if (inviter && inviter.state === SessionState.Established) {
        // 종료 로직 실행
        action.talk.callChanged({
          key: inviter?.request?.callId,
          destination: called,
        });
        console.log('@@@ bye3');
        utils.tlog(`@@@ bye3 ${called}`);
        inviter.bye();
        cleanupMedia();

        action.account.getAccount({iccid, token});
        // 모달창 띄우기
      }
    }
  }, [
    action.account,
    action.talk,
    called,
    cleanupMedia,
    iccid,
    inviter,
    terminateCall,
    token,
  ]);

  // 마이크 권한, 통화시에 권한확인
  const checkMic = useCallback(() => {
    return Promise.resolve(checkPermission('mic')).then((r) => {
      if (!r) {
        AppAlert.confirm(
          i18n.t('talk:permission:home:mic:title'),
          i18n.t('talk:permission:home:mic:cont'),
          {
            ok: () => {
              openSettings();
            },
            cancel: () => {},
          },
          i18n.t('cancel'),
          i18n.t('settings'),
        );
      }

      return r;
    });
  }, [checkPermission]);

  const makeCall = useCallback(
    (dest: string) => {
      if (userAgent && dest) {
        userAgent
          .start()
          .then(async () => {
            // try {
            // const target = UserAgent.makeURI('sip:9000@talk.rokebi.com');
            const target = UserAgent.makeURI(`sip:${dest}@${talkServer}`);
            console.log('@@@ target', dest, target);
            utils.tlog(`@@@ target, ${dest}, ${target}`);

            const inv = new Inviter(userAgent, target, {
              sessionDescriptionHandlerOptions: {
                constraints: {
                  audio: true,
                  video: false,
                },
              },
            });

            inv.stateChange.addListener((state: SessionState) => {
              console.log(`@@@ inviter session state changed to ${state}`);
              utils.tlog(`@@@ inviter session state changed to, ${state}`);

              setSessionState(state);

              switch (state) {
                case SessionState.Initial:
                  break;
                case SessionState.Establishing:
                  action.talk.callInitiated({
                    key: inv?.request?.callId,
                    destination: dest,
                    duration: 0,
                    stime: moment().toString(),
                  });
                  break;
                case SessionState.Established:
                  setupRemoteMedia(inv);
                  break;
                case SessionState.Terminating:
                // fall through
                case SessionState.Terminated:
                  action.talk.callChanged({
                    key: inv?.request?.callId,
                    destination: dest,
                  });

                  cleanupMedia();
                  break;
                default:
                  throw new Error('Unknown session state.');
              }
            });

            inv.invite().then(() => {
              const {sessionDescriptionHandler} = inv;

              if (sessionDescriptionHandler) {
                sessionDescriptionHandler.peerConnectionDelegate = {
                  onconnectionstatechange: (state) => {
                    console.log('@@@ conn state changed', state, inv.state);
                    utils.tlog(
                      `@@@ conn state changed, ${state}, ${inv.state}`,
                    );
                    if (inv.state === SessionState.Established) {
                      switch (state) {
                        case 'disconnected':
                        case 'failed':
                        case 'closed':
                        case 'completed':
                          cleanupMedia();
                          console.log('@@@ bye4');
                          utils.tlog(`@@@ bye4, ${dest}`);
                          inv.bye();
                          break;
                        case 'connecting':
                          getMaxCallTime();
                          break;
                        default:
                          break;
                      }
                    }
                  },
                };
              }
              console.log('@@@@@@@@@@@@@@@@@@@@@@@@ setIniviter ');
              setInviter(inv);
            });
          })
          .catch((err) => {
            AppAlert.error(`Failed to make call:${err}`);
            console.log('@@@', err);
            utils.tlog(`Failed to make call:${err}`);
          });
      } else {
        AppAlert.error('User agent not found', '');
        console.log('@@@ user agent not found');
        utils.tlog(`@@@ user agent not found`);
      }
    },
    [action.talk, cleanupMedia, getMaxCallTime, setupRemoteMedia, userAgent],
  );

  const checkAndChangeSpeaker = useCallback(() => {
    Promise.resolve(NativeModules?.CallKitModule?.getSpeakerStatus()).then(
      (r) => {
        console.log(`@@ current speaker from ${r} to ${!r}`);
        NativeModules?.CallKitModule?.toggleSpeaker(callUUID, !r);
        setPressed((prev) => (!r ? 'speaker' : prev));
        setSpeakerPhone(!r);
      },
    );
  }, [callUUID]);

  // ios speaker on인채로 통화연결시 통화 speaker 동작안되는 이슈 수정
  useEffect(() => {
    if (sessionState === SessionState.Established) {
      Promise.resolve(NativeModules?.CallKitModule?.getSpeakerStatus()).then(
        (r) => {
          if (r !== speakerPhone) {
            console.log(
              '@@ is speaker on1 different established',
              r,
              speakerPhone,
            );
            NativeModules?.CallKitModule?.toggleSpeaker(callUUID, speakerPhone);
            setPressed((prev) => (speakerPhone ? 'speaker' : prev));
            setSpeakerPhone(speakerPhone);
          }
        },
      );
    }
  }, [callUUID, sessionState, speakerPhone]);

  const onPressKeypad = useCallback(
    (k: string, d?: string) => {
      switch (k) {
        case 'call':
          Promise.resolve(checkMic()).then((r) => {
            if (r) {
              if (!called || (called && !ccode))
                navigation.navigate('TalkTariff');
              else if (called?.length <= ccode?.length + 2 || called === ccode)
                AppAlert.info(i18n.t('talk:call:minLength'));
              else if (called) {
                API.TalkApi.getRatePerMinute({mobile: realMobile, called}).then(
                  (rsp) => {
                    utils.tlog(`@@ rate ${rsp}`);
                    const {rate, unit} = rsp?.tariff || {};
                    const r = rate / 100;

                    if (rsp?.result?.code === 0) {
                      // rate === 0 일 경우, 무료 통화 | 60초 통화 가능
                      if (r === 0 || (60 * r) / unit <= point) makeCall(called);
                      else AppAlert.info(i18n.t('talk:call:checkPoint')); // 톡포인트 부족시
                    } else if (rsp?.result === api.E_INVALID_STATUS)
                      // 로깨비톡 서비스 OFF
                      AppAlert.info(rsp?.desc, '', () =>
                        navigation.navigate('HomeStack', {screen: 'Home'}),
                      );
                    else if (rsp?.result?.code === api.E_INVALID_ARGUMENT)
                      AppAlert.info(i18n.t('talk:call:minLength'));
                    // 지역코드가 요율에 정의도지 않은 경우
                    else
                      action.toast.push({
                        msg: Toast.FAIL_NETWORK,
                        toastIcon: 'bannerMarkToastError',
                      }); // 나머지 경우의 예외 케이스
                  },
                );
                // 통화 연결시 uuid 저장
                Promise.resolve(
                  NativeModules?.CallKitModule?.startCall(called),
                ).then((u) => {
                  setCallUUID(u);
                  // 초기 speaker off 적용
                  NativeModules?.CallKitModule?.toggleSpeaker(u, false);
                });
              }
            }
          });
          break;
        case 'hangup':
          releaseCall();
          break;
        case 'mute':
          setMute((prev) => {
            if (Platform.OS === 'ios')
              NativeModules?.CallKitModule?.setMutedCall(callUUID, !prev);
            else inviter?.sessionDescriptionHandler?.setMute(!prev);
            return !prev;
          });
          break;
        case 'speaker':
          checkAndChangeSpeaker();
          break;
        case 'keypad':
          dtmfSession?.info({
            requestOptions: {
              body: {
                contentDisposition: 'render',
                contentType: 'application/dtmf-relay',
                content: `Signal=${d}\r\nDuration=100`,
              },
            },
          });
          console.log('@@@ send dtmf', d);
          break;
        default:
          break;
      }
    },
    [
      action.toast,
      callUUID,
      called,
      ccode,
      checkAndChangeSpeaker,
      checkMic,
      dtmfSession,
      inviter?.sessionDescriptionHandler,
      makeCall,
      navigation,
      point,
      realMobile,
      releaseCall,
    ],
  );

  // ios만
  useFocusEffect(
    React.useCallback(() => {
      const subscription = callKitEmitter.addListener(
        'CallStatusUpdate',
        (event) => {
          console.log('[CallKitModule] Call Status:', event.status);
          switch (event.status) {
            case 'Muted':
              setMute(true);
              setPressed('mute');
              break;
            case 'Unmuted':
              setMute(false);
              setPressed('');
              break;
            case 'Ended':
              releaseCall();
              break;
            default:
              break;
          }
        },
      );

      return () => subscription.remove();
    }, [callKitEmitter, releaseCall]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('@@back to the active!', appState.current, nextAppState);
        Promise.resolve(NativeModules?.CallKitModule?.getSpeakerStatus()).then(
          (r) => {
            setPressed(r ? 'speaker' : '');
            setSpeakerPhone(r);
          },
        );
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = callKitEmitter.addListener(
        'DTMFCallAction',
        (event) => {
          //         { digits: '0',
          // callUUID: '7dfda9b8-7c40-4e06-bda3-6f79f1c59edc' }
          onPressKeypad('keypad', event?.digits);
        },
      );

      return () => subscription.remove();
    }, [callKitEmitter, onPressKeypad]),
  );

  // Options for SimpleUser
  // TODO
  // 1: register 상태 확인하기. register 실패한 경우 AOR이 여러개 생겨서 호가 안됨
  // register 실패하면 deactivate
  // AOR 개수 확인

  const register = useCallback(() => {
    if (realMobile) {
      const transportOptions = {
        server: `wss://${talkServer}:${talkPort}/ws`,
        keepAliveInterval: 30,
      };
      const uri = UserAgent.makeURI(`sip:${realMobile}@${talkServer}`);
      const userAgentOptions: UserAgentOptions = {
        authorizationPassword: '000000', // 000000
        authorizationUsername: realMobile,
        transportOptions,
        uri,
        sessionDescriptionHandlerFactory: (session, options) => {
          return new RNSessionDescriptionHandler(session, options);
        },
        sessionDescriptionHandlerFactoryOptions: {
          iceServers: [{urls: `stun:${turnServer}`}],
          iceGatheringTimeout: 30,
          callTimeout: 60,
        },
      };
      const ua = new UserAgent(userAgentOptions);
      ua.delegate = {
        onInvite: () => {
          console.log('@@@ recv invite');
        },
        onMessage: (message) => {
          console.log('@@@ recv message');
          console.log('Received a SIP MESSAGE:', message);

          // Extract the body of the SIP MESSAGE
          const {body} = message;

          // Process the received message
          if (body) {
            console.log('Message Content:', body);
          }
          // Automatically respond with a 200 OK
          message.accept();
        },
      };

      const registerer = new Registerer(ua);
      ua.start().then(() => {
        console.log('@@@ register 1');
        utils.tlog(`@@@ register 1`);
        registerer.register();
      });
      setUserAgent(ua);

      getPoint();

      return () => {
        ua.stop().then((state) => {
          console.log('@@@ UA stopped', state);
          utils.tlog(`@@@ UA stopped`);
        });
      };
    }

    return () => {};
  }, [getPoint, realMobile]);

  useFocusEffect(
    React.useCallback(() => {
      register();
    }, [register]),
  );

  const updateTooltip = useCallback(
    (t: boolean) => action.talk.updateTooltip(t),
    [action.talk],
  );

  const onChange = useCallback((d?: string) => setDtmf(d), []);

  useFocusEffect(
    React.useCallback(() => {
      if (iccid) action.talk.getCheckBetaReward({iccid});
    }, [action.talk, iccid]),
  );

  const reviewBtnPressed = useCallback(
    ({k, star, cont}: {k: 'ok' | 'next'; star?: number; cont?: string}) => {
      if (k === 'ok') {
        if (token) {
          Promise.resolve(
            API.TalkApi.addTalkReview({
              mobile: realMobile || '',
              star,
              cont: cont || '',
              log: talkLog,
              token,
            }),
          ).then((r) => {
            if (r?.result === 0) action.log.clear('talkLog');

            setVisible(false);
          });
        }
      } else setVisible(false);
    },
    [action.log, realMobile, talkLog, token],
  );

  return (
    <>
      <StatusBar
        backgroundColor={showWarning ? colors.redError : colors.white}
        barStyle="dark-content" // default
      />
      {showWarning && (
        <View style={{backgroundColor: colors.redError, height: top}} />
      )}
      <SafeAreaView
        style={[
          styles.body,
          {backgroundColor: isSuccessAuth ? 'white' : 'rgba(0, 0, 0, 0.3)'},
        ]}>
        <AppActivityIndicator visible={refreshing || false} />
        <CallReviewModal visible={visible} onPress={reviewBtnPressed} />
        {isSuccessAuth ? (
          <TalkMain
            terminateCall={terminateCall}
            navigation={navigation}
            sessionState={sessionState}
            min={min}
            time={time}
            dtmf={dtmf}
            point={point}
            showWarning={showWarning}
            onChange={onChange}
            onPressKeypad={onPressKeypad}
            setPress={(k) => setPressed((prev) => (prev === k ? undefined : k))}
            tooltip={tooltip}
            emgOn={emgOn}
            updateTooltip={updateTooltip}
            pressed={pressed}
          />
        ) : isReceivedBeta == 0 ? (
          <BetaModalBox
            amount={rule?.talk?.point || 1000}
            onPress={() => {
              if (token && iccid) {
                API.TalkApi.patchTalkPoint({
                  iccid,
                  token,
                  sign: 'beta',
                }).then((rsp) => {
                  if (rsp?.result === 0) {
                    action.talk.getCheckBetaReward({iccid});
                  }
                });
              }
            }}
          />
        ) : (
          <PhoneCertBox />
        )}
      </SafeAreaView>
    </>
  );
};

export default connect(
  ({account, talk, product, log}: RootState) => ({
    account,
    talk,
    product,
    log,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      talk: bindActionCreators(talkActions, dispatch),
      log: bindActionCreators(logActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(RkbTalk);
