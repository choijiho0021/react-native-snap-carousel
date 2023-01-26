import {Pressable, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
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
  const min = value <= minValue;
  const max = value >= maxValue;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => onChange(value - 1)} disabled={min}>
        <View style={styles.box}>
          <AppSvgIcon name="minus" disabled={min} />
        </View>
      </Pressable>
      <View style={styles.boxCenter}>
        <AppText style={styles.text}>{value}</AppText>
      </View>
      <Pressable onPress={() => onChange(value + 1)} disabled={max}>
        <View style={styles.box}>
          <AppSvgIcon name="plus" disabled={max} />
        </View>
      </Pressable>
    </View>
  );
};

export default memo(InputNumber);
