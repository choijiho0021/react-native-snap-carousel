import React, {memo, useCallback} from 'react';
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {Currency} from '@/redux/api/productApi';

const styles = StyleSheet.create({
  label: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  value: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
};
const LabelText = ({
  label,
  value = 0,
  deduct,
  style,
  format,
  color = colors.black,
  labelStyle,
  valueStyle,
}: LabelTextProps) => {
  const isDeduct = label === i18n.t('cart:deductBalance');

  const renderValue = useCallback(() => {
    const val = typeof value === 'object' ? value.value : Number(value);
    const currency = typeof value === 'object' ? value.currency : 'KRW';
    return (
      <View style={styles.value}>
        <Text style={[valueStyle || appStyles.price, {color}]}>
          {isDeduct && '- '}
          {utils.numberToCommaString(isDeduct ? deduct : val) || value}
        </Text>
        <Text style={appStyles.normal14Text}>{` ${i18n.t(currency)}`}</Text>
      </View>
    );
  }, [color, deduct, isDeduct, value, valueStyle]);

  return (
    <View
      style={[
        styles.container,
        style,
        format !== 'shortDistance' && {justifyContent: 'space-between'},
      ]}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[{maxWidth: '70%'}, labelStyle || styles.label]}>
        {label}
      </Text>
      {/* {
          isDeduct &&
          <Text style={[styles.label, {marginLeft: 18}]}>{`(${i18n.t('cart:currentBalance')}:${utils.numberToCommaString(value) + ' ' + i18n.t('won')}) `}</Text>
        } */}
      {format === 'price' ? (
        renderValue()
      ) : (
        <Text style={valueStyle || styles.singleValue}>{value}</Text>
      )}
    </View>
  );
};

export default memo(LabelText);
