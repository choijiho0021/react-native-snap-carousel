import {useFocusEffect} from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import SoundPlayer from 'react-native-sound-player';
import {useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SessionState} from 'sip.js';
import i18n from '@/utils/i18n';
import {actions as talkActions} from '@/redux/modules/talk';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {colors} from '@/constants/Colors';
import AppSvgIcon from '@/components/AppSvgIcon';
import {RkbTalkNavigationProp} from '.';
import KeyPadButton from './component/KeyPadButton';

const buttonSize = isDeviceSize('medium', true) ? 68 : 80;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  key: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  textCallHist: {
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 24,
    color: colors.black,
  },
  call: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
  },
  keypad: {
    height: buttonSize * 4 + 80,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  keyButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyButtonRow: {
    width: '100%',
    paddingHorizontal: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const keys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['keyNation', '0', 'keyDel'],
];

const callKeys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

export type KeyType = 'call' | 'hangup' | 'speaker' | 'keypad' | 'mute';

type KeypadProps = {
  navigation: RkbTalkNavigationProp;
  onPress?: (k: KeyType, d?: string) => void;
  onChange?: (d?: string) => void;
  style: StyleProp<ViewStyle>;
  state?: SessionState;
  showWarning: boolean;
};

const Keypad: React.FC<KeypadProps> = ({
  navigation,
  style,
  onPress,
  onChange,
  state,
  showWarning = false,
}) => {
  const [dtmf, setDtmf] = useState('');
  const [showKeypad, setShowKeypad] = useState(true);
  const [pressed, setPressed] = useState<string>();
  const dispatch = useDispatch();
  const [ringSpeaker, setRingSpeaker] = useState<boolean>(false);
  const {updateCalledPty, appendCalledPty, delCalledPty} = bindActionCreators(
    talkActions,
    dispatch,
  );

  useEffect(() => {
    onChange?.(showKeypad ? dtmf : '');
  }, [dtmf, onChange, showKeypad]);

  const renderKeyButton = useCallback(
    (key: KeyType) => (
      <View style={styles.keyButton}>
        <AppSvgIcon
          key={key}
          name={key}
          focused={key === pressed}
          style={styles.key}
          onPress={() => {
            setPressed((prev) => (prev === key ? undefined : key));
            if (key === 'keypad') setShowKeypad((prev) => !prev);
            else if (key === 'speaker' && SessionState.Establishing === state) {
              // ringback speaker 적용
              setRingSpeaker((prev) => {
                SoundPlayer.setSpeaker(!prev);
                return !prev;
              });
              onPress?.(key);
            } else onPress?.(key);
          }}
        />
      </View>
    ),
    [onPress, pressed, state],
  );

  const initDtmf = useCallback(() => setDtmf(''), []);

  // dtmf는 keypad를 닫았다가 다시 열 경우에도 이전 이력 남아있어야 하는지 확인 필요
  const closeKeypad = useCallback(() => {
    setPressed('');
    setShowKeypad(false);
    setRingSpeaker(false);
  }, []);

  const terminated = useCallback(() => {
    closeKeypad();
    initDtmf();
    // ringback 종료시에 stop할 경우, ios 통화시 소리 낼 수 없음
    SoundPlayer.stop();
    // InCallManager.stop();
  }, [closeKeypad, initDtmf]);

  useEffect(() => {
    if (state === SessionState.Terminated) {
      terminated();
    }
  }, [state, terminated]);

  useFocusEffect(
    React.useCallback(() => {
      closeKeypad();
    }, [closeKeypad]),
  );

  const playSound = useCallback(() => {
    try {
      InCallManager.start({media: 'audio'});
      SoundPlayer.playSoundFile('ringback', 'mp3');

      // ringback 반복 재생
      if (Platform.OS === 'android') {
        // aos 재생 완료 이벤트로 반복 재생
        SoundPlayer.addEventListener('FinishedPlaying', () => {
          SoundPlayer.playSoundFile('ringback', 'mp3');
        });
      } else SoundPlayer.setNumberOfLoops(-1);
    } catch (e) {
      console.log('cannot play the sound file', e);
    }
  }, []);

  const stopSound = useCallback(() => {
    try {
      SoundPlayer.stop();
    } catch (e) {
      console.log('Error stopping sound', e);
    }
  }, []);

  // ringback
  useEffect(() => {
    if (SessionState.Establishing === state) playSound();

    if (
      state &&
      [SessionState.Terminated, SessionState.Established].includes(state)
    ) {
      stopSound();
    }
    return () => {
      terminated();
    };
  }, [playSound, state, stopSound, terminated]);

  const renderKey = useCallback(
    (st?: SessionState) => {
      const calling =
        st &&
        ![
          SessionState.Initial,
          SessionState.Established,
          SessionState.Terminated,
        ].includes(st);

      const motion = showWarning
        ? require('@/assets/images/lottie/imminent_Red.json')
        : require('@/assets/images/lottie/call_blue.json');

      const connected = SessionState.Established === st;

      if (
        !st ||
        [SessionState.Initial, SessionState.Terminated].includes(st) ||
        (showKeypad &&
          [SessionState.Established, SessionState.Establishing].includes(st))
      ) {
        // 기본 화면
        return (
          <>
            {(showKeypad ? callKeys : keys).map((row, i) => (
              <View style={styles.row} key={i}>
                {row.map((d) => (
                  <KeyPadButton
                    key={d}
                    name={d}
                    onLongPress={(v: string) => {
                      if (v === 'keyDel') updateCalledPty('');
                    }}
                    onPress={(v: string) => {
                      if (v === 'keyNation') {
                        navigation.navigate('TalkTariff');
                      } else if (v === 'keyDel') {
                        delCalledPty();
                      } else if (showKeypad) {
                        setDtmf((prev) => prev + v);
                        onPress?.('keypad', v);
                      } else appendCalledPty(v);
                    }}
                  />
                ))}
              </View>
            ))}
            <View style={styles.row}>
              {showKeypad ? (
                <View style={styles.key} />
              ) : (
                <Pressable
                  style={[styles.key, {marginBottom: 0}]}
                  key="contacts"
                  onPress={() => navigation.navigate('TalkContact')}>
                  <Text style={styles.textCallHist}>
                    {i18n.t('talk:contact')}
                  </Text>
                </Pressable>
              )}
              <AppSvgIcon
                key="call"
                name={showKeypad ? 'keyHangup' : 'keyCall'}
                style={styles.call}
                onPress={() => {
                  onPress?.(showKeypad ? 'hangup' : 'call');
                  closeKeypad();
                }}
              />
              <Pressable
                style={[styles.key, {marginBottom: 0}]}
                key="hist"
                onPress={() => {
                  if (showKeypad) closeKeypad();
                  else navigation.navigate('CallHistory');
                }}>
                <Text style={styles.textCallHist}>
                  {showKeypad ? i18n.t('close') : i18n.t('talk:callHistory')}
                </Text>
              </Pressable>
            </View>
          </>
        );
      }

      // while talking
      return (
        <>
          {/* TODO:// 통화 2분이내일 경우 motion적용 필요 */}
          <View
            style={[
              styles.keypad,
              ((connected && !showWarning) || showKeypad) && {
                justifyContent: 'flex-end',
              },
            ]}>
            {(calling || showWarning) && (
              <>
                <View />
                <Lottie
                  style={[
                    {width: 100, height: 100},
                    showWarning && {justifyContent: 'center'},
                  ]}
                  autoPlay
                  loop
                  source={motion}
                />
                {showWarning && <View />}
              </>
            )}
            <View style={styles.keyButtonRow}>
              {renderKeyButton('mute')}
              {renderKeyButton('keypad')}
              {renderKeyButton('speaker')}
            </View>
          </View>
          <View style={styles.row}>
            <AppSvgIcon
              key="call"
              name="keyHangup"
              style={styles.call}
              onPress={() => {
                onPress?.('hangup');
                closeKeypad();
              }}
            />
          </View>
        </>
      );
    },
    [
      appendCalledPty,
      closeKeypad,
      delCalledPty,
      navigation,
      onPress,
      renderKeyButton,
      showKeypad,
      showWarning,
      updateCalledPty,
    ],
  );

  return <View style={style}>{renderKey(state)}</View>;
};

export default memo(Keypad);
