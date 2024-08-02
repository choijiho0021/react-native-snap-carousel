import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {SessionState} from 'sip.js';
import {colors} from '@/constants/Colors';
import AppSvgIcon from '@/components/AppSvgIcon';
import {isDeviceSize, windowWidth} from '@/constants/SliderEntry.style';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';

const buttonSize = isDeviceSize('medium', true) ? 70 : 80;
console.log('@@@ buton size', buttonSize, windowWidth);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  key: {
    width: buttonSize,
    height: buttonSize,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.whiteFive,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: buttonSize / 2,
    marginBottom: 20,
  },
  keyText: {
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0.49,
    textAlign: 'center',
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
  onPress?: (k: KeyType) => void;
  style: StyleProp<ViewStyle>;
  keypadRef?: React.MutableRefObject<KeypadRef | null>;
  state?: SessionState;
};

const Keypad: React.FC<KeypadProps> = ({keypadRef, style, onPress, state}) => {
  const [dest, setDest] = useState('');

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
          onPress={() => onPress?.(key)}
        />
        <AppText>{i18n.t(`talk:${key}`)}</AppText>
      </View>
    ),
    [onPress],
  );

  const renderKey = useCallback(
    (st?: SessionState) => {
      if (
        !st ||
        st === SessionState.Initial ||
        st === SessionState.Terminated
      ) {
        return (
          <>
            {keys.map((row, i) => (
              <View style={styles.row} key={i}>
                {row.map((d) => (
                  <Pressable
                    style={styles.key}
                    key={d}
                    onPress={() => setDest((prev) => prev + d)}>
                    <Text style={styles.keyText}>{d}</Text>
                  </Pressable>
                ))}
              </View>
            ))}
            <View style={styles.row}>
              <View style={styles.empty} />
              <AppSvgIcon
                key="call"
                name="keyCall"
                style={[styles.call, {backgroundColor: colors.green}]}
                onPress={() => onPress?.('call')}
              />
              <AppSvgIcon
                key="del"
                name="keyDel"
                style={styles.empty}
                onPress={() =>
                  setDest((prev) =>
                    prev.length > 0 ? prev.substring(0, prev.length - 1) : prev,
                  )
                }
              />
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
              onPress={() => onPress?.('hangup')}
            />
          </View>
        </>
      );
    },
    [onPress, renderKeyButton],
  );

  return (
    <View style={style}>
      <View style={styles.input}>
        <Text style={styles.dest}>{dest}</Text>
      </View>
      {renderKey(state)}
    </View>
  );
};

export default memo(Keypad);
