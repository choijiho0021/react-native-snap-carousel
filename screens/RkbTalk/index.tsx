import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment-timezone';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Inviter,
  Registerer,
  Session,
  SessionState,
  UserAgent,
  UserAgentOptions,
} from 'sip.js';
import {isNumber} from 'underscore';
import AppAlert from '@/components/AppAlert';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {API} from '@/redux/api';
import i18n from '@/utils/i18n';
import {useInterval} from '@/utils/useInterval';
import CallToolTip from './CallToolTip';
import Keypad, {KeypadRef} from './Keypad';
import RNSessionDescriptionHandler from './RNSessionDescriptionHandler';

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
  const [maxTime, setMaxTime] = useState<number>();
  const [time, setTime] = useState<string>('');
  const [point, setPoint] = useState<number>(0);
  const [digit, setDigit] = useState('');
  const min = useMemo(() => {
    const checkRemain = (maxTime || 0) - duration;
    return maxTime
      ? Math.floor((checkRemain <= 0 ? 0 : checkRemain) / 60)
      : undefined;
  }, [duration, maxTime]);

  const {top} = useSafeAreaInsets();
  const showWarning = useMemo(() => {
    return (min && min <= 2) || false;
  }, [min]);

  const initial = useMemo(
    () =>
      !sessionState ||
      [SessionState.Initial, SessionState.Terminated].includes(sessionState),
    [sessionState],
  );
  const calling = useMemo(
    () => [SessionState.Establishing].includes(sessionState),
    [sessionState],
  );
  const connected = useMemo(
    () => [SessionState.Established].includes(sessionState),
    [sessionState],
  );
  // const end = useMemo(
  //   () => [SessionState.Terminated].includes(sessionState),
  //   [sessionState],
  // );

  // 국가번호
  // api로 데이터 가져오도록 변경 필요
  // 영어, 한국어 국가명 필요
  const splitCC = useMemo(
    () =>
      ['82', '20'].includes(digit?.slice(0, 2))
        ? [digit?.slice(0, 2), digit?.slice(2)]
        : [],
    [digit],
  );

  const printCCInfo = useMemo(
    () => splitCC?.length > 0 && (initial || calling),
    [calling, initial, splitCC?.length],
  );

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
            <AppText style={styles.myPoint}>{i18n.t('talk:mypoint')}</AppText>
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

  const info = useCallback(() => {
    if (initial) return talkPointBtn();
    if (connected)
      return (
        <AppText
          style={{
            height: 22,
            fontSize: 14,
            fontWeight: '500',
            fontStyle: 'normal',
            lineHeight: 22,
            letterSpacing: 0,
            textAlign: 'center',
            color: colors.clearBlue,
            marginTop: 24,
          }}>
          {time}
        </AppText>
      );
    return (
      <AppText
        style={{
          color: colors.warmGrey,
          fontSize: 16,
          fontWeight: 'normal',
          fontStyle: 'normal',
          lineHeight: 40,
          height: 40,
          marginTop: 24,
          letterSpacing: -0.16,
          textAlign: 'center',
        }}>
        통화 연결 중...
      </AppText>
    );
  }, [connected, initial, talkPointBtn, time]);

  return (
    <>
      <StatusBar
        backgroundColor={showWarning ? colors.redError : colors.white}
        barStyle="dark-content" // default
      />
      {showWarning && (
        <View style={{backgroundColor: colors.redError, height: top}} />
      )}
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
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginHorizontal: 20,
            }}>
            <View style={{flex: 1}} />
            {/* <AppText style={{flex: 1}}>대한민국</AppText> */}
            {printCCInfo && (
              <>
                <AppSvgIcon
                  style={{
                    width: 9.4,
                    alignContent: 'flex-end',
                    justifyContent: 'flex-end',
                  }}
                  name="KR"
                />
                <AppText
                  style={[
                    styles.emergency,
                    {
                      marginLeft: 6,
                      justifyContent: 'flex-start',
                      color: colors.black,
                      textAlign: 'center',
                    },
                  ]}>
                  대한민국
                </AppText>
              </>
            )}
            <AppText style={styles.emergency}>
              {initial ? '긴급통화' : ''}
            </AppText>
          </View>
        </View>
        {printCCInfo && (
          <AppText style={{textAlign: 'center', color: colors.warmGrey}}>
            {`현지시간 ${moment()
              .tz(moment.tz.zonesForCountry('KR')[0])
              .format('HH:mm')}`}
          </AppText>
        )}
        <CallToolTip text="통화가 필요한 긴급 상황이라면!" icon="bell" />
        {connected && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {showWarning && (
              <AppSvgIcon
                style={{justifyContent: 'center', alignItems: 'center'}}
                name="callWarning"
              />
            )}
            <AppText
              style={[
                {
                  textAlign: 'center',
                  color: colors.warmGrey,
                },
                showWarning && {color: colors.redError, marginLeft: 6},
              ]}>
              {maxTime && isNumber(min || 0) ? `남은 통화 ${min}분` : ''}
            </AppText>
          </View>
        )}

        {/* <AppText style={{marginLeft: 10}}>{`Session: ${sessionState}`}</AppText>
        <AppText style={{marginLeft: 10}}>{time}</AppText> */}
        <View style={[styles.input, {height: 44, marginTop: 16}]}>
          <AppText style={styles.dest} numberOfLines={1} ellipsizeMode="head">
            <AppText style={[styles.dest, {color: colors.clearBlue}]}>
              {splitCC?.length > 0 ? splitCC[0] : ''}
            </AppText>
            {splitCC?.length > 0 ? splitCC[1] : digit}
          </AppText>
        </View>
        <View style={{flex: 1}}>{info()}</View>
        <View>
          <Keypad
            style={styles.keypad}
            keypadRef={keypadRef}
            onPress={onPressKeypad}
            onChange={(d) => setDigit(d || '')}
            state={sessionState}
            showWarning={showWarning}
          />
          <View style={{height: 40}} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default RkbTalk;
