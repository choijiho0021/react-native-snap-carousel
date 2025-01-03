import AsyncStorage from '@react-native-community/async-storage';
import {
  RouteProp,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
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
import PhoneCertBox from './component/PhoneCertBox';
import TalkMain from './component/TalkMain';
import RNSessionDescriptionHandler from './RNSessionDescriptionHandler';

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
  action: {
    account: AccountAction;
    talk: TalkAction;
    toast: ToastAction;
  };
};

type RkbTalkBetaType = {
  isBeta: 0 | 1;
  amount: number;
};

const RkbTalk: React.FC<RkbTalkProps> = ({
  account: {realMobile, iccid, token},
  talk: {called, tariff, emg, tooltip, ccode, terminateCall, beta},
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
  // const testNumber = '07079190190';
  const emgOn = useMemo(
    () => Object.entries(emg || {})?.filter(([k, v]) => v === '1'),
    [emg],
  );

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

  const isSuccessAuth = useMemo(() => (realMobile || '') !== '', [realMobile]);

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
          inviter.bye();
          break;
        case SessionState.Terminating:
        case SessionState.Terminated:
          console.log(
            '@@@ Cannot terminate a session that is already terminated',
          );
          break;
        default:
          console.log('unknown state');
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

  useEffect(() => {
    if (
      inviter &&
      ((maxTime && maxTime - duration < 0) ||
        (inviter?.state === SessionState.Established && !maxTime))
    ) {
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

    setDtmfSession(session);
    console.log('@@@ setup');
  }, []);

  const cleanupMedia = useCallback(() => {
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
    setSpeakerPhone(() => {
      InCallManager.setSpeakerphoneOn(false);
      InCallManager.setForceSpeakerphoneOn(false);
      return false;
    });

    // InCallManager.stop();
    // 저장했던 번호 삭제
    action.talk.updateNumberClicked({});

    setRefreshing(false);
  }, [action.talk, getPoint]);

  useEffect(() => {
    if (terminateCall && called) {
      action.talk.setTerminateCall(false);
      if (inviter && inviter.state === SessionState.Established) {
        // 종료 로직 실행
        action.talk.callChanged({
          key: inviter?.request?.callId,
          destination: called,
        });
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
            const target = UserAgent.makeURI(`sip:${dest}@talk.rokebi.com`);
            console.log('@@@ target', dest, target);

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
                    if (inv.state === SessionState.Established) {
                      switch (state) {
                        case 'disconnected':
                        case 'failed':
                        case 'closed':
                        case 'completed':
                          cleanupMedia();
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
          });
      } else {
        AppAlert.error('User agent not found', '');
        console.log('@@@ user agent not found');
      }
    },
    [action.talk, cleanupMedia, getMaxCallTime, setupRemoteMedia, userAgent],
  );

  // ios speaker on인채로 통화연결시 통화 speaker 동작안되는 이슈 수정
  useEffect(() => {
    if (speakerPhone) {
      if (sessionState === SessionState.Established) {
        InCallManager.setSpeakerphoneOn(true);
      }
    }
  }, [sessionState, speakerPhone]);

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
              }
            }
          });
          break;
        case 'hangup':
          releaseCall();
          break;
        case 'mute':
          setMute((prev) => {
            inviter?.sessionDescriptionHandler?.setMute(!prev);
            return !prev;
          });
          break;
        case 'speaker':
          setSpeakerPhone((prev) => {
            // incallmanager speaker는 ringback일때도 켜져야함.
            InCallManager.setSpeakerphoneOn(!prev);
            return !prev;
          });
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
      called,
      ccode,
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

  // Options for SimpleUser
  // TODO
  // 1: register 상태 확인하기. register 실패한 경우 AOR이 여러개 생겨서 호가 안됨
  // register 실패하면 deactivate
  // AOR 개수 확인

  const register = useCallback(() => {
    if (realMobile) {
      const transportOptions = {
        server: 'wss://talk.rokebi.com:8089/ws',
        keepAliveInterval: 30,
      };
      const uri = UserAgent.makeURI(`sip:${realMobile}@talk.rokebi.com`);
      const userAgentOptions: UserAgentOptions = {
        authorizationPassword: '000000', // 000000
        authorizationUsername: realMobile,
        transportOptions,
        uri,
        sessionDescriptionHandlerFactory: (session, options) => {
          return new RNSessionDescriptionHandler(session, options);
        },
        sessionDescriptionHandlerFactoryOptions: {
          iceServers: [{urls: 'stun:talk.rokebi.com:3478'}],
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
        console.log('@@@ register');
        registerer.register();
      });
      setUserAgent(ua);

      getPoint();

      return () => {
        ua.stop().then((state) => {
          console.log('@@@ UA stopped', state);
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
        ) : beta?.isReceivedBeta == 0 ? (
          <BetaModalBox
            amount={beta?.amount || 1000}
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
  ({account, talk}: RootState) => ({
    account,
    talk,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      talk: bindActionCreators(talkActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(RkbTalk);
