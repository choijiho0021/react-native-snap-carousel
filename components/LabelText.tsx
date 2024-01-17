import React, {memo, useCallback} from 'react';
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {Currency} from '@/redux/api/productApi';
import utils from '@/redux/api/utils';
import AppPrice from './AppPrice';
import AppText from './AppText';

const {esimCurrency} = Env.get();
const styles = StyleSheet.create({
  label: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  singleValue: {
    flex: 1,
    textAlign: 'right',
  },
});

export type LabelTextProps = {
  label: string;
  value?: string | number | Currency;
  deduct?: number;
  style?: StyleProp<ViewStyle>;
  format?: 'price' | 'shortDistance';
  color?: ColorValue;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  balanceStyle?: StyleProp<TextStyle>;
  currencyStyle?: StyleProp<TextStyle>;
};
const LabelText = ({
  label,
  value,
  style,
  format,
  color = colors.black,
  labelStyle,
  valueStyle,
  balanceStyle,
  currencyStyle,
}: LabelTextProps) => {
  const renderValue = useCallback(() => {
    const [val, currency] =
      typeof value === 'object'
        ? [value.value, value.currency]
        : [Number(value), esimCurrency];

    return (
      <AppPrice
        price={utils.toCurrency(val, currency)}
        balanceStyle={[balanceStyle, {color}]}
        currencyStyle={[currencyStyle, {color}]}
      />
    );
  }, [balanceStyle, color, currencyStyle, value]);

  return (
    <View
      style={[
        styles.container,
        style,
        format !== 'shortDistance' && {justifyContent: 'space-between'},
      ]}>
      <AppText
        key="label"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[{maxWidth: '70%'}, labelStyle || styles.label]}>
        {label}
      </AppText>
      {format === 'price' ? (
        renderValue()
      ) : (
        <AppText key="value" style={valueStyle || styles.singleValue}>
          {value}
        </AppText>
      )}
    </View>
  );
};

export default memo(LabelText);
