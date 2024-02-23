import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import AppText from './AppText';
import AppSvgIcon from './AppSvgIcon';

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 32,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  box: {
    width: isDeviceSize('small') ? 28 : 32,
    height: isDeviceSize('small') ? 28 : 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  boxCenter: {
    width: isDeviceSize('small') ? 28 : 32,
    height: isDeviceSize('small') ? 28 : 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
  },
  text: {
    ...appStyles.normal16Text,
    textAlign: 'center',
  },
});

const InputNumber = ({
  value,
  onChange,
  minValue = 1,
  maxValue = 10,
  boldIcon = false,
  disabled = false,
  fontStyle,
  boxStyle,
}: {
  value: number;
  minValue?: number;
  maxValue?: number;
  onChange: (v: number) => void;
  boldIcon?: boolean;
  disabled?: boolean;
  fontStyle?: StyleProp<TextStyle>;
  boxStyle?: StyleProp<ViewStyle>;
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const addValue = useCallback(
    (v: number) => {
      if (v <= maxValue && !disabled) {
        setInputValue(v);
        onChange(v);
      } else {
        onChange(v);
      }
    },
    [disabled, maxValue, onChange],
  );

  const delValue = useCallback(
    (v: number) => {
      if (v >= minValue && !disabled) {
        setInputValue(v);
        onChange(v);
      } else {
        onChange(v);
      }
    },
    [disabled, minValue, onChange],
  );

  return (
    <View style={styles.container}>
      <Pressable onPress={() => delValue(inputValue - 1)}>
        <View style={[styles.box, fontStyle]}>
          <AppSvgIcon
            name={boldIcon ? 'boldMinus' : 'minus'}
            disabled={inputValue <= minValue}
            style={{opacity: disabled || inputValue === minValue ? 0.4 : 1}}
          />
        </View>
      </Pressable>
      <View style={[styles.boxCenter, boxStyle]}>
        <AppText style={[styles.text, fontStyle]}>{inputValue}</AppText>
      </View>
      <Pressable onPress={() => addValue(inputValue + 1)}>
        <View style={[styles.box, fontStyle]}>
          <AppSvgIcon
            name={boldIcon ? 'boldPlus' : 'plus'}
            disabled={inputValue >= maxValue}
            style={{opacity: disabled || inputValue === maxValue ? 0.4 : 1}}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default memo(InputNumber);
