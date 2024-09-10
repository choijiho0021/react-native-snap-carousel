import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {
  Inviter,
  Registerer,
  Session,
  SessionState,
  UserAgent,
  UserAgentOptions,
} from 'sip.js';
import Tooltip from 'react-native-walkthrough-tooltip';
import AppAlert from '@/components/AppAlert';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import {useInterval} from '@/utils/useInterval';
import Keypad, {KeypadRef} from './Keypad';
import RNSessionDescriptionHandler from './RNSessionDescriptionHandler';
import AppSvgIcon from '@/components/AppSvgIcon';
import CallToolTip from './CallToolTip';
import {isDeviceSize} from '@/constants/SliderEntry.style';

const buttonSize = isDeviceSize('medium', true) ? 68 : 80;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  keypad: {
    justifyContent: 'flex-start',
  },
  emergency: {
    flex: 1,
    textAlign: 'right',
    marginRight: 20,
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: -0.16,
    color: colors.clearBlue,
  },
  myPoint: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.16,
  },
  pointBold: {
    marginLeft: 12,
    marginRight: 8,
    color: colors.clearBlue,
    fontWeight: 'bold',
  },
  dest: {
    height: buttonSize / 2,
    fontSize: 36,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: buttonSize / 2,
    letterSpacing: -0.28,
    color: colors.black,
    textAlignVertical: 'bottom',
  },
  input: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
});

const RkbTalk = () => {
  const [userAgent, setUserAgent] = useState<UserAgent | null>(null);
  const [inviter, setInviter] = useState<Inviter | null>(null);
  const keypadRef = useRef<KeypadRef>(null);
  const [sessionState, setSessionState] = useState<SessionState>(
    SessionState.Initial,
  );
  const [speakerPhone, setSpeakerPhone] = useState(false);
  const [dtmfSession, setDtmfSession] = useState<Session>();
  const [duration, setDuration] = useState(1);
  const [maxTime, setMaxTime] = useState<number>(0);
  const [time, setTime] = useState<string>('');
  const [point, setPoint] = useState<number>(0);
  const [visible, setVisible] = useState(true);
  const [dest, setDest] = useState('');

  useEffect(() => {
    API.TalkApi.getTalkPoint({mobile: '01059119737'}).then((rsp) => {
      console.log('@@@ point', rsp);
      if (rsp?.result === 0) {
        setPoint(rsp?.objects?.tpnt);
      }
    });
  }, []);

  const getMaxCallTime = useCallback(() => {
    API.TalkApi.getChannelInfo({mobile: '01059119737'}).then((rsp) => {
      if (rsp?.result === 0) {
        const m =
          rsp?.objects?.channel?.variable?.MAX_CALL_TIME?.match(/^[^:]+/);

        console.log('@@@ max call time', m);
        if (m?.length > 0) setMaxTime(Number(m[0]) / 1000);
      }
      // console.log('@@@ max call time', rsp);
    });
  }, []);

  const makeSeconds = useCallback((num: number) => {
    return (num < 10 ? '0' : '') + num;
  }, []);

  const limit = useCallback(
    (t: number) => {
      if (t < 61) {
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
        setDuration((prev) => prev + 1);
        limit(duration);
      }
    },
    sessionState === SessionState.Established ? 1000 : null,
    // maxTime - duration >= 0 ? 1000 : null,
  );

  useEffect(() => {
    if (inviter && maxTime && maxTime - duration < 0) {
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
    console.log('@@@ cleanup');
    setDuration(1);
    setMaxTime();
    setTime('');
  }, []);

  const makeCall = useCallback(() => {
    const dest = keypadRef.current?.getValue();
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
                break;
              case SessionState.Established:
                setupRemoteMedia(inv);
                break;
              case SessionState.Terminating:
              // fall through
              case SessionState.Terminated:
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
  }, [cleanupMedia, getMaxCallTime, setupRemoteMedia, userAgent]);

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

  const onPressKeypad = useCallback(
    (k: string, d?: string) => {
      switch (k) {
        case 'call':
          makeCall();
          break;
        case 'hangup':
          releaseCall();
          break;
        case 'speaker':
          setSpeakerPhone((prev) => {
            InCallManager.setSpeakerphoneOn(!prev);
            return !prev;
          });
          break;
        case 'keypad':
          const opt = {
            requestOptions: {
              body: {
                contentDisposition: 'render',
                contentType: 'application/dtmf-relay',
                content: `Signal=${d}\r\nDuration=1000`,
              },
            },
          };

          dtmfSession?.info(opt);
          console.log('@@@ send dtmf', d);
          break;
        default:
          break;
      }
    },
    [dtmfSession, makeCall, releaseCall],
  );

  // Options for SimpleUser
  // TODO
  // 1: register 상태 확인하기. register 실패한 경우 AOR이 여러개 생겨서 호가 안됨
  // register 실패하면 deactivate
  // AOR 개수 확인

  useFocusEffect(
    React.useCallback(() => {
      const transportOptions = {
        server: 'wss://talk.rokebi.com:8089/ws',
      };
      const uri = UserAgent.makeURI('sip:01059119737@talk.rokebi.com');
      const userAgentOptions: UserAgentOptions = {
        authorizationPassword: '000000', // 000000
        authorizationUsername: '01059119737',
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

      return () => {
        ua.stop().then((state) => {
          console.log('@@@ UA stopped', state);
        });
      };
    }, []),
  );

  const talkPointBtn = useCallback(() => {
    return (
      <>
        <Pressable
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              justifyContent: 'center',
              height: 40,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              marginHorizontal: 92,
              borderWidth: 1,
              borderColor: colors.lightGrey,
            }}>
            <AppSvgIcon
              key="talkPoint"
              name="talkPoint"
              style={{marginRight: 6}}
            />
            <AppText style={styles.myPoint}>나의 톡포인트</AppText>
            <AppText style={[styles.myPoint, styles.pointBold]}>
              {point}P
            </AppText>
            <AppSvgIcon key="rightArrow10" name="rightArrow10" />
          </View>
        </Pressable>
        <View style={{flex: 1}} />
      </>
    );
  }, [point]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 8,
            height: 40,
            alignItems: 'center',
          }}>
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <View style={{flex: 1}} />
            {/* <AppText style={{flex: 1}}>대한민국</AppText> */}
            {/* <AppText style={[styles.emergency, {color: colors.black}]}>
              대한민국
            </AppText> */}
            <AppText style={styles.emergency}>긴급통화</AppText>
          </View>
          {/* 
          top: 48
          <CallToolTip text="통화가 필요한 긴급 상황이라면!" icon="bell" /> */}
        </View>
        <CallToolTip text="통화가 필요한 긴급 상황이라면!" icon="bell" />
        <AppText
          style={{
            width: 85,
            height: 22,
            fontSize: 14,
            fontWeight: '500',
            fontStyle: 'normal',
            lineHeight: 22,
            letterSpacing: 0,
            textAlign: 'left',
            color: colors.gray,
          }}>
          {time}
        </AppText>

        {/* <AppText style={{marginLeft: 10}}>{`Session: ${sessionState}`}</AppText>
        <AppText style={{marginLeft: 10}}>{time}</AppText> */}
        <View style={[styles.input, {height: 44, marginTop: 16}]}>
          <AppText style={styles.dest} numberOfLines={1} ellipsizeMode="head">
            {dest}
          </AppText>
        </View>
        <View style={{flex: 1}}>{talkPointBtn()}</View>
        <View>
          <Keypad
            style={styles.keypad}
            keypadRef={keypadRef}
            onPress={onPressKeypad}
            onChange={(d) => setDest(d || '')}
            state={sessionState}
          />
          <View style={{height: 40}} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default RkbTalk;
