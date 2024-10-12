import {useFocusEffect} from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import SoundPlayer from 'react-native-sound-player';
import {SessionState} from 'sip.js';
import {isDeviceSize, windowWidth} from '@/constants/SliderEntry.style';
import {colors} from '@/constants/Colors';
import AppSvgIcon from '@/components/AppSvgIcon';
import {RkbTalkNavigationProp} from '.';
import KeyPadButton from './component/KeyPadButton';
import i18n from '@/utils/i18n';

const buttonSize = isDeviceSize('medium', true) ? 68 : 80;
console.log('@@@ buton size', buttonSize, windowWidth);

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

export type KeypadRef = {
  getValue: () => string;
  setValue: (v: string) => void;
};

export type KeyType = 'call' | 'hangup' | 'speaker' | 'keypad' | 'mute';

type KeypadProps = {
  navigation: RkbTalkNavigationProp;
  onPress?: (k: KeyType, d?: string) => void;
  onChange: (d?: string) => void;
  style: StyleProp<ViewStyle>;
  keypadRef?: React.MutableRefObject<KeypadRef | null>;
  state?: SessionState;
  showWarning: boolean;
};

const Keypad: React.FC<KeypadProps> = ({
  navigation,
  keypadRef,
  style,
  onPress,
  onChange,
  state,
  showWarning = false,
}) => {
  const [dest, setDest] = useState('');
  const [dtmf, setDtmf] = useState('');
  const [showKeypad, setShowKeypad] = useState(true);
  const [pressed, setPressed] = useState<string>();

  useEffect(() => {
    onChange(showKeypad ? dtmf : dest);
  }, [dest, dtmf, onChange, showKeypad]);

  useEffect(() => {
    if (keypadRef) {
      keypadRef.current = {
        getValue: () => dest,
        setValue: (v: string) => {
          if (keypadRef.current) {
            keypadRef.current.value = v;
          }
          setDest(v);
        },
      };
    }
  }, [dest, keypadRef]);

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
            else onPress?.(key);
          }}
        />
      </View>
    ),
    [onPress, pressed],
  );

  // dtmf는 keypad를 닫았다가 다시 열 경우에도 이전 이력 남아있어야 하는지 확인 필요
  const closeKeypad = useCallback(() => {
    setPressed('');
    setShowKeypad(false);
  }, []);

  useEffect(() => {
    if (state === SessionState.Terminated) closeKeypad();
  }, [closeKeypad, state]);

  useFocusEffect(
    React.useCallback(() => {
      closeKeypad();
    }, [closeKeypad]),
  );

  // ringback
  useEffect(() => {
    if ([SessionState.Establishing].includes(state)) {
      InCallManager.start({media: 'audio'});
      try {
        SoundPlayer.playSoundFile('ringback', 'mp3');
        SoundPlayer.setNumberOfLoops(-1);
      } catch (e) {
        console.log(`cannot play the sound file`, e);
      }
    }
    if ([SessionState.Terminated, SessionState.Established].includes(state)) {
      InCallManager.stop();
      try {
        SoundPlayer.stop();
      } catch (e) {
        console.log('Error stopping sound', e);
      }
    }
  }, [state]);

  const renderKey = useCallback(
    (st?: SessionState) => {
      const calling = ![
        SessionState.Initial,
        SessionState.Established,
        SessionState.Terminated,
      ].includes(st);

      const connected = [SessionState.Established].includes(st);

      if (
        !st ||
        st === SessionState.Initial ||
        st === SessionState.Terminated ||
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
                      if (v === 'keyDel') setDest('');
                    }}
                    onPress={(v: string) => {
                      if (v === 'keyNation') {
                        navigation.navigate('TalkTariff');
                      } else if (v === 'keyDel') {
                        setDest((prev) =>
                          prev.length > 0
                            ? prev.substring(0, prev.length - 1)
                            : prev,
                        );
                      } else if (showKeypad) {
                        setDtmf((prev) => prev + v);
                        onPress?.('keypad', v);
                      } else setDest((prev) => prev + v);
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
                  onPress={() => {
                    navigation.navigate('TalkContact');
                  }}>
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
              {/* {showKeypad ? (
                <Pressable
                  style={[
                    styles.empty,
                    {alignItems: 'center', justifyContent: 'center'},
                  ]}
                  onPress={() => closeKeypad()}>
                  <AppText style={appStyles.bold14Text}>가리기</AppText>
                </Pressable>
              ) : (
                <AppSvgIcon
                  key="del"
                  name="keyDel"
                  style={styles.empty}
                  onPress={() =>
                    setDest((prev) =>
                      prev.length > 0
                        ? prev.substring(0, prev.length - 1)
                        : prev,
                    )
                  }
                  onLongPress={() => setDest('')}
                />
              )} */}
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
                  source={require('@/assets/images/lottie/call_blue.json')}
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
      closeKeypad,
      navigation,
      onPress,
      renderKeyButton,
      showKeypad,
      showWarning,
    ],
  );

  return (
    <View style={style}>
      {/* <View style={styles.input}>
        <Text style={styles.dest}>{showKeypad ? dtmf : dest}</Text>
      </View> */}
      {renderKey(state)}
    </View>
  );
};

export default memo(Keypad);
