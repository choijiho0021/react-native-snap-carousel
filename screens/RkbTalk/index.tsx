import React, {useState, useCallback, useRef} from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {
  SessionState,
  UserAgent,
  Inviter,
  UserAgentOptions,
  Registerer,
  Session,
} from 'sip.js';
import {useFocusEffect} from '@react-navigation/native';
import InCallManager from 'react-native-incall-manager';
import Keypad, {KeypadRef} from './Keypad';
import RNSessionDescriptionHandler from './RNSessionDescriptionHandler';
import AppAlert from '@/components/AppAlert';
import AppText from '@/components/AppText';

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

const RkbTalk = () => {
  const [userAgent, setUserAgent] = useState<UserAgent | null>(null);
  const [inviter, setInviter] = useState<Inviter | null>(null);
  const keypadRef = useRef<KeypadRef>(null);
  const [sessionState, setSessionState] = useState<SessionState>(
    SessionState.Initial,
  );
  const [speakerPhone, setSpeakerPhone] = useState(false);

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
          return new RNSessionDescriptionHandler(session, options);
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

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body}>
        <AppText style={{marginLeft: 10}}>{`Session: ${sessionState}`}</AppText>
        <Keypad
          style={styles.keypad}
          keypadRef={keypadRef}
          onPress={onPressKeypad}
          state={sessionState}
        />
      </SafeAreaView>
    </>
  );
};

export default RkbTalk;
