import {RouteProp, useFocusEffect} from '@react-navigation/native';
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
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
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
import {useInterval} from '@/utils/useInterval';
import {
  actions as talkActions,
  TalkAction,
  TalkModelState,
} from '@/redux/modules/talk';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {API} from '@/redux/api';
import {RootState} from '@/redux';
import {HomeStackParamList} from '@/navigation/navigation';
import {colors} from '@/constants/Colors';
import AppAlert from '@/components/AppAlert';
import AppActivityIndicator from '@/components/AppActivityIndicator';
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
  };
};

const RkbTalk: React.FC<RkbTalkProps> = ({
  account: {mobile, realMobile, iccid, token},
  talk: {called, tariff},
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
  const [maxTime, setMaxTime] = useState<number>();
  const [time, setTime] = useState<string>('');
  const [point, setPoint] = useState<number>(0);
  const [pntError, setPntError] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState<boolean>(true);
  const testNumber = realMobile;
  // const testNumber = '07079190216';

  const {top} = useSafeAreaInsets();
  const [min, showWarning] = useMemo(() => {
    const checkRemain = (maxTime || 0) - duration;
    const m = maxTime
      ? Math.floor((checkRemain <= 0 ? 0 : checkRemain) / 60)
      : undefined;
    return [m, (m && m <= 2) || false];
  }, [duration, maxTime]);

  const isSuccessAuth = useMemo(() => (realMobile || '') !== '', [realMobile]);

  useEffect(() => {
    if (_.isEmpty(tariff)) {
      action.talk.getTariff();
    }
  }, [action.talk, tariff]);

  const getPoint = useCallback(() => {
    if (realMobile) {
      setRefreshing(true);
      API.TalkApi.getTalkPoint({mobile: realMobile})
        .then((rsp) => {
          console.log('@@@ point', rsp, realMobile);
          if (rsp?.result === 0) {
            setPoint(rsp?.objects?.tpnt);
          }
          if (!_.isNumber(rsp?.objects?.tpnt)) setPntError(true);
        })
        .finally(() => setRefreshing(false));
    }
  }, [realMobile]);

  // 권한없는 경우, 통화시에 권한확인 로직 필요
  useEffect(() => {
    const checkPermission = async () => {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CONTACTS
          : PERMISSIONS.ANDROID.READ_CONTACTS;
      const result = await check(permission);

      return result === RESULTS.GRANTED || result === RESULTS.UNAVAILABLE;
    };

    Promise.resolve(checkPermission()).then((r) => {
      if (r) action.talk.getContacts();
    });
  }, [action.talk]);

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
    API.TalkApi.getChannelInfo({mobile: testNumber}).then((rsp) => {
      if (rsp?.result === 0) {
        const m =
          rsp?.objects?.channel?.variable?.MAX_CALL_TIME?.match(/^[^:]+/);

        console.log('@@@ max call time', m);
        if (m?.length > 0) setMaxTime(Number(m[0]) / 1000);
        else releaseCall();
      }
      // console.log('@@@ max call time', rsp);
    });
  }, [releaseCall, testNumber]);

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

    setInviter();

    setDuration(0);
    setMaxTime();
    setTime('');
    setTimeout(() => {
      getPoint();
    }, 1000);

    // 저장했던 번호 삭제
    action.talk.updateNumberClicked();

    setRefreshing(false);
  }, [action.talk, getPoint]);

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

  const onPressKeypad = useCallback(
    (k: string, d?: string) => {
      switch (k) {
        case 'call':
          if (called) makeCall(called);
          break;
        case 'hangup':
          releaseCall();
          break;
        case 'mute':
          setMute((prev) => {
            InCallManager.setMicrophoneMute(!prev);
            return !prev;
          });
          break;
        case 'speaker':
          setSpeakerPhone((prev) => {
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
                content: `Signal=${d}\r\nDuration=1000`,
              },
            },
          });
          console.log('@@@ send dtmf', d);
          break;
        default:
          break;
      }
    },
    [called, dtmfSession, makeCall, releaseCall],
  );

  // Options for SimpleUser
  // TODO
  // 1: register 상태 확인하기. register 실패한 경우 AOR이 여러개 생겨서 호가 안됨
  // register 실패하면 deactivate
  // AOR 개수 확인

  // const renderModal = useMemo(() => {
  //   <AppModal
  //     type="close"
  //     justifyContent="flex-end"
  //     titleViewStyle={{justifyContent: 'flex-start'}}
  //     contentStyle={styles.modalContent}
  //     onOkClose={() => setShowCheckModal(false)}
  //     visible={showCheckModal}>
  //     <View
  //       style={[styles.row, {justifyContent: 'flex-start', marginBottom: 16}]}>
  //       <AppSvgIcon name="cautionIcon" />
  //       <AppText style={styles.modalTitleText}>
  //         {'test'}
  //       </AppText>
  //     </View>
  //     <AppText style={styles.modalBodyText}>
  //       {'test'}
  //     </AppText>
  //   </AppModal>;
  // }, [showCheckModal]);

  useFocusEffect(
    React.useCallback(() => {
      const transportOptions = {
        server: 'wss://talk.rokebi.com:8089/ws',
      };
      const uri = UserAgent.makeURI(`sip:${testNumber}@talk.rokebi.com`);
      const userAgentOptions: UserAgentOptions = {
        authorizationPassword: '000000', // 000000
        authorizationUsername: testNumber,
        transportOptions,
        uri,
        sessionDescriptionHandlerFactory: (session, options) => {
          return new RNSessionDescriptionHandler(session, options);
        },
        sessionDescriptionHandlerFactoryOptions: {
          iceServers: [{urls: 'stun:talk.rokebi.com:3478'}],
          iceGatheringTimeout: 3,
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
    }, [getPoint, testNumber]),
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
            navigation={navigation}
            sessionState={sessionState}
            min={min}
            time={time}
            point={point}
            showWarning={showWarning}
            onPressKeypad={onPressKeypad}
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
    },
  }),
)(RkbTalk);
