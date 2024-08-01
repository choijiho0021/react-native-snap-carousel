import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Pressable,
  Text,
} from 'react-native';
import {MediaStream, RTCView} from 'react-native-webrtc';
import {
  SessionState,
  UserAgent,
  Inviter,
  UserAgentOptions,
  Registerer,
  Session,
} from 'sip.js';
import RNSessionDescriptionHandler from './RNSessionDescriptionHandler';
import AppTextInput from '@/components/AppTextInput';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
  },
  stream: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    height: 44,
    margin: 4,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  input: {
    marginTop: 20,
    height: 44,
    marginHorizontal: 20,
    borderColor: colors.warmGrey,
    color: colors.black,
  },
});

const RkbTalk = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [userAgent, setUserAgent] = useState<UserAgent | null>(null);
  const [inviter, setInviter] = useState<Inviter | null>(null);
  const [destination, setDestination] = useState('');

  // Options for SimpleUser
  const register = useCallback(() => {
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
        iceGatheringTimeout: 1,
      },
    };
    const ua = new UserAgent(userAgentOptions);
    const registerer = new Registerer(ua);
    ua.start().then(() => {
      console.log('@@@ register');
      registerer.register();
    });
    setUserAgent(ua);
  }, []);

  const setupRemoteMedia = useCallback((session: Session) => {
    /*
    const remoteStream = new MediaStream();
    session.sessionDescriptionHandler?.peerConnection
      .getReceivers()
      .forEach((receiver) => {
        if (receiver.track) {
          remoteStream.addTrack(receiver.track);
        }
      });

    if (refAudio.current) {
      refAudio.current.srcObject = remoteStream;
      refAudio.current.play();
    }
      */
    console.log('@@@ setup');
  }, []);

  const cleanupMedia = useCallback(() => {
    console.log('@@@ cleanup');
  }, []);

  const makeCall = useCallback(
    (dest: string) => {
      if (userAgent) {
        userAgent.start().then(async () => {
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
            console.log(`Session state changed to ${state}`);
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
        });
      } else {
        console.log('@@@ user agent not found');
      }
    },
    [cleanupMedia, setupRemoteMedia, userAgent],
  );

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

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body}>
        <View style={styles.footer}>
          <Pressable onPress={register} style={styles.button}>
            <Text>Register</Text>
          </Pressable>
          <Pressable
            onPress={() => makeCall(destination)}
            style={styles.button}>
            <Text>Call</Text>
          </Pressable>
          <Pressable onPress={releaseCall} style={styles.button}>
            <Text>Stop</Text>
          </Pressable>
        </View>
        <AppTextInput
          style={styles.input}
          placeholder="Destination"
          placeholderTextColor={colors.greyish}
          keyboardType="numeric"
          returnKeyType="done"
          enablesReturnKeyAutomatically
          onChangeText={(v) => setDestination(v)}
          value={destination}
        />
        {stream && <RTCView streamURL={stream.toURL()} style={styles.stream} />}
      </SafeAreaView>
    </>
  );
};

export default RkbTalk;
