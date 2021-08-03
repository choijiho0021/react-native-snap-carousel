import React, {memo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import utils from '@/redux/api/utils';
import {Currency} from '@/redux/api/productApi';
import Env from '@/environment';

const {esimGlobal} = Env.get();

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    ...appStyles.price,
    textAlign: 'left',
  },
  won: {
    ...appStyles.normal14Text,
    marginLeft: 5,
  },
});

const AppPrice = ({
  style,
  balanceStyle,
  currencyStyle,
  price,
}: {
  style?: StyleProp<ViewStyle>;
  balanceStyle?: StyleProp<TextStyle>;
  currencyStyle?: StyleProp<TextStyle>;
  price: Currency;
}) => {
  return (
    <View style={style || styles.container}>
      {esimGlobal || i18n.locale !== 'ko'
        ? [
            <Text key="won" style={[styles.won, currencyStyle]}>
              {`${i18n.t(price.currency)} `}
            </Text>,
            <Text key="balance" style={[styles.price, balanceStyle]}>
              {utils.currencyString(price.value)}
            </Text>,
          ]
        : [
            <Text key="balance" style={[styles.price, balanceStyle]}>
              {utils.currencyString(price.value)}
            </Text>,
            <Text key="won" style={[styles.won, currencyStyle]}>
              {` ${i18n.t(price.currency)}`}
            </Text>,
          ]}
    </View>
  );
};

export default memo(AppPrice);
