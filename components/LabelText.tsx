import React, {memo} from 'react';
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
import utils from '@/submodules/rokebi-utils/utils';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';

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
  value?: string | number;
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
        <View style={styles.value}>
          <Text style={[valueStyle || appStyles.price, {color}]}>
            {isDeduct && '- '}
            {utils.numberToCommaString(isDeduct ? deduct : Number(value)) ||
              value}
          </Text>
          <Text style={appStyles.normal14Text}>{` ${i18n.t('won')}`}</Text>
        </View>
      ) : (
        <Text style={valueStyle || styles.singleValue}>{value}</Text>
      )}
    </View>
  );
};

export default memo(LabelText);
