import {useFocusEffect} from '@react-navigation/native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {SessionState} from 'sip.js';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize, windowWidth} from '@/constants/SliderEntry.style';
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
  keyText: {
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 36,
    letterSpacing: -0.6,
    textAlign: 'center',
    color: colors.black,
  },
  textCallHist: {
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 24,
    color: colors.black,
  },
  dest: {
    height: buttonSize / 2,
    fontSize: 36,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: buttonSize / 2,
    letterSpacing: -0.28,
    color: colors.black,
  },
  input: {
    marginBottom: isDeviceSize('medium') ? 66 : 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    width: buttonSize,
    height: buttonSize,
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
    marginBottom: 50,
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

const desc = [
  ['', 'ABC', 'DEF'],
  ['GHI', 'JKL', 'MNO'],
  ['PQRS', 'TUV', 'WXYZ'],
  ['', '+', ''],
];

export type KeypadRef = {
  getValue: () => string;
};

type KeyType = 'call' | 'hangup' | 'speaker' | 'keypad';

type KeypadProps = {
  onPress?: (k: KeyType, d?: string) => void;
  onChange: (d?: string) => void;
  style: StyleProp<ViewStyle>;
  keypadRef?: React.MutableRefObject<KeypadRef | null>;
  state?: SessionState;
  talkPoint?: React.JSX.Element;
};

const Keypad: React.FC<KeypadProps> = ({
  keypadRef,
  style,
  onPress,
  onChange,
  talkPoint,
  state,
}) => {
  const [dest, setDest] = useState('');
  const [dtmf, setDtmf] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);

  useEffect(() => {
    onChange(dest);
  }, [dest, onChange]);

  useEffect(() => {
    if (keypadRef) {
      keypadRef.current = {
        getValue: () => dest,
      };
    }
  });

  const renderKeyButton = useCallback(
    (key: KeyType) => (
      <View style={styles.keyButton}>
        <AppSvgIcon
          key={key}
          name={key}
          style={styles.key}
          onPress={() => {
            if (key === 'keypad') setShowKeypad((prev) => !prev);
            else onPress?.(key);
          }}
        />
        <AppText>{i18n.t(`talk:${key}`)}</AppText>
      </View>
    ),
    [onPress],
  );

  const closeKeypad = useCallback(() => {
    setShowKeypad(false);
    setDtmf('');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      closeKeypad();
    }, [closeKeypad]),
  );

  const renderKey = useCallback(
    (st?: SessionState) => {
      if (
        !st ||
        st === SessionState.Initial ||
        st === SessionState.Terminated ||
        (showKeypad &&
          [SessionState.Established, SessionState.Establishing].includes(st))
      ) {
        return (
          <>
            {keys.map((row, i) => (
              <View style={styles.row} key={i}>
                {row.map((d) => {
                  switch (d) {
                    case 'keyNation':
                      return <AppSvgIcon key={d} name={d} style={styles.key} />;
                    case 'keyDel':
                      return (
                        <AppSvgIcon
                          key={d}
                          name={d}
                          style={styles.key}
                          onPress={() =>
                            setDest((prev) =>
                              prev.length > 0
                                ? prev.substring(0, prev.length - 1)
                                : prev,
                            )
                          }
                          onLongPress={() => setDest('')}
                        />
                      );
                    default:
                      return (
                        <Pressable
                          style={styles.key}
                          key={d}
                          onPress={() => {
                            if (showKeypad) {
                              setDtmf((prev) => prev + d);
                              onPress?.('keypad', d);
                            } else setDest((prev) => prev + d);
                          }}>
                          <Text style={styles.keyText}>{d}</Text>
                        </Pressable>
                      );
                  }
                })}
              </View>
            ))}
            <View style={styles.row}>
              <Pressable
                style={[styles.key, {marginBottom: 0}]}
                key="contacts"
                onPress={() => {}}>
                <Text style={styles.textCallHist}>연락처</Text>
              </Pressable>
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
                onPress={() => {}}>
                <Text style={styles.textCallHist}>통화기록</Text>
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
          <View style={styles.keypad}>
            <View
              style={{width: 150, height: 150, backgroundColor: 'yellow'}}
            />
            <View style={styles.keyButtonRow}>
              {renderKeyButton('speaker')}
              {renderKeyButton('keypad')}
            </View>
          </View>
          <View style={styles.row}>
            <AppSvgIcon
              key="call"
              name="keyHangup"
              style={[styles.call, {backgroundColor: colors.tomato}]}
              onPress={() => {
                onPress?.('hangup');
                closeKeypad();
              }}
            />
          </View>
        </>
      );
    },
    [closeKeypad, onPress, renderKeyButton, showKeypad],
  );

  return (
    <View style={style}>
      {/* <View style={styles.input}>
        <Text style={styles.dest}>{showKeypad ? dtmf : dest}</Text>
      </View> */}
      {talkPoint}
      {renderKey(state)}
    </View>
  );
};

export default memo(Keypad);
