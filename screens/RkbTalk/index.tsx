import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {
  Inviter,
  Registerer,
  Session,
  SessionState,
  UserAgent,
  UserAgentOptions,
} from 'sip.js';
import AppText from '@/components/AppText';
import AppAlert from '@/components/AppAlert';
import Keypad, {KeypadRef} from './Keypad';

import WebView from 'react-native-webview';
import {inicisButton} from '@/components/AppPaymentGateway/ConfigInicis';
import {bindActionCreators} from 'redux';
import {RootState} from '@/redux';
import {connect} from 'react-redux';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import PhoneCertBox from './component/PhoneCertBox';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  keypad: {
    flex: 1,
    justifyContent: 'center',
  },
});

type RkbScreenProps = {
  account: AccountModelState;
  action: {
    account: AccountAction;
  };
};

const RkbTalk: React.FC<RkbScreenProps> = ({account: {mobile}}) => {
  const [userAgent, setUserAgent] = useState<UserAgent | null>(null);
  const [inviter, setInviter] = useState<Inviter | null>(null);
  const keypadRef = useRef<KeypadRef>(null);
  const [sessionState, setSessionState] = useState<SessionState>(
    SessionState.Initial,
  );
  const [speakerPhone, setSpeakerPhone] = useState(false);
  const [rnSession, setRnSession] = useState<RNSessionDescriptionHandler>();
  const [modal, setModal] = useState(false);
  const navigation = useNavigation();

  const injected = useRef(false);
  const ref = useRef<WebView>(null);

  const [isSuccessAuth, setIsSuccessAuth] = useState(false);

  const [html, setHtml] = useState(inicisButton(''));

  useEffect(() => {
    if (mobile) setHtml(inicisButton(mobile));
  }, [mobile]);

  useFocusEffect(
    React.useCallback(() => {
      // 인증된건지 확인, 로그아웃 -> account 에 값 지우는 명령 호출해야함.
      // console.log('@@@@ account : ', );s
      setModal(true);
    }, []),
  );

  // Options for SimpleUser
  useFocusEffect(
    React.useCallback(() => {
      const transportOptions = {
        server: 'wss://talk.rokebi.com:8089/ws',
      };
      const uri = UserAgent.makeURI('sip:07079190190@talk.rokebi.com');
      const userAgentOptions: UserAgentOptions = {
        authorizationPassword: 'ua123123',
        authorizationUsername: '07079190190',
        transportOptions,
        uri,
        sessionDescriptionHandlerFactory: (session, options) => {
          const s = new RNSessionDescriptionHandler(session, options);
          setRnSession(s);
          return s;
        },
        sessionDescriptionHandlerFactoryOptions: {
          iceServers: [{urls: 'stun:talk.rokebi.com:3478'}],
          iceGatheringTimeout: 3,
        },
      };
      const ua = new UserAgent(userAgentOptions);
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

    console.log('@@@ setup');
  }, []);

  const cleanupMedia = useCallback(() => {
    console.log('@@@ cleanup');
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

          /*
          inv.sessionDescriptionHandler?.peerConnectionDelegate({
            onconnectionstatechange: (event) => {
              console.log('@@@ connection state change', event);
            },
            ondatachannel: (event) => {
              console.log('@@@ data channel', event);
            },
            onicecandidate: (event) => {
              console.log('@@@ ice candidate', event);
            },
            onicecandidateerror: (event) => {
              console.log('@@@ ice candidate error', event);
            },
            oniceconnectionstatechange: (event) => {
              console.log('@@@ ice connection state change', event);
            },
            onicegatheringstatechange: (event) => {
              console.log('@@@ ice gathering state change', event);
            },
            onnegotiationneeded: (event) => {
              console.log('@@@ negotiation needed', event);
            },
            onsignalingstatechange: (event) => {
              console.log('@@@ signaling state change', event);
            },
            ontrack: (event) => {
              console.log('@@@ track', event);
            },
          });
          */

          inv.stateChange.addListener((state: SessionState) => {
            console.log(`Session state changed to ${state}`);

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

          await inv.invite();
          setInviter(inv);
        })
        .catch((err) => {
          AppAlert.error(`Failed to make call:${err}`);
          console.log('@@@', err);
        });
    } else {
      AppAlert.error('User agent not found', '');
      console.log('@@@ user agent not found');
    }
  }, [cleanupMedia, setupRemoteMedia, userAgent]);

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
    }
  }, [inviter]);

  useEffect(() => {
    if (rnSession)
      rnSession?._eventEmitter.on('onconnectionstatechange', (e) => {
        console.log('onconnectionstatechange: ', e);
        switch (e) {
          case 'disconnected':
          case 'failed':
            releaseCall();
            break;
          default:
            break;
        }
      });
  }, [releaseCall, rnSession]);

  const onPressKeypad = useCallback(
    (k) => {
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
        default:
          break;
      }
    },
    [makeCall, releaseCall],
  );

  const onLoadEnd = useCallback(({nativeEvent: event}) => {
    if (event.url.startsWith('about') && !injected.current) {
      setTimeout(() => {
        ref.current?.injectJavaScript('start_script();');
        injected.current = true;
      }, 500);
    }
  }, []);

  const renderBody = useMemo(() => {
    return isSuccessAuth ? (
      <>
        <AppText style={{marginLeft: 10}}>{`Session: ${sessionState}`}</AppText>

        <Keypad
          style={styles.keypad}
          keypadRef={keypadRef}
          onPress={onPressKeypad}
          state={sessionState}
        />
      </>
    ) : (
      <PhoneCertBox />
    );
  }, [isSuccessAuth, onPressKeypad, sessionState]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={[
          styles.body,
          {backgroundColor: isSuccessAuth ? 'white' : 'rgba(0, 0, 0, 0.3)'},
        ]}>
        {renderBody}
      </SafeAreaView>
    </>
  );
};

export default connect(
  ({account}: RootState) => ({
    account,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(RkbTalk);
