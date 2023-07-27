import {Pressable, StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
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
}: {
  value: number;
  minValue?: number;
  maxValue?: number;
  onChange: (v: number) => void;
}) => {
  const [inputValue, setInputValue] = useState(value);

  const addValue = useCallback(
    (v: number) => {
      if (v <= maxValue) {
        setInputValue(v);
        onChange(v);
      }
    },
    [maxValue, onChange],
  );

  const delValue = useCallback(
    (v: number) => {
      if (v >= minValue) {
        setInputValue(v);
        onChange(v);
      }
    },
    [minValue, onChange],
  );

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => delValue(inputValue - 1)}
        disabled={inputValue <= minValue}>
        <View style={styles.box}>
          <AppSvgIcon name="minus" disabled={inputValue <= minValue} />
        </View>
      </Pressable>
      <View style={styles.boxCenter}>
        <AppText style={styles.text}>{inputValue}</AppText>
      </View>
      <Pressable
        onPress={() => addValue(inputValue + 1)}
        disabled={inputValue >= maxValue}>
        <View style={styles.box}>
          <AppSvgIcon name="plus" disabled={inputValue >= maxValue} />
        </View>
      </Pressable>
    </View>
  );
};

export default memo(InputNumber);
