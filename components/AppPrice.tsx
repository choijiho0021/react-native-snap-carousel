import React, {Fragment, memo} from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {Currency} from '@/redux/api/productApi';
import utils from '@/redux/api/utils';
import i18n from '@/utils/i18n';
import AppText from './AppText';

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
    marginLeft: 0,
  },
});

const AppPrice = ({
  style,
  balanceStyle,
  currencyStyle,
  showPlus = false,
  price,
}: {
  style?: StyleProp<ViewStyle>;
  balanceStyle?: StyleProp<TextStyle>;
  currencyStyle?: StyleProp<TextStyle>;
  showPlus?: boolean;
  price: Currency;
}) => {
  return (
    <View style={style || styles.container}>
      {esimGlobal || i18n.locale !== 'ko' ? (
        <Fragment>
          <AppText key="won" style={currencyStyle || styles.price}>
            {showPlus && price.value > 0 ? '+' : ''}
            {`${i18n.t(price.currency)}`}
          </AppText>

          <AppText key="balance" style={balanceStyle || styles.price}>
            {utils.currencyString(price.value)}
          </AppText>
        </Fragment>
      ) : (
        <Fragment>
          <AppText key="balance" style={balanceStyle || styles.price}>
            {showPlus && price.value > 0 ? '+' : ''}
            {utils.currencyString(price.value)}
          </AppText>

          <AppText key="won" style={currencyStyle || styles.price}>
            {i18n.t(price.currency)}
          </AppText>
        </Fragment>
      )}
    </View>
  );
};

export default memo(AppPrice);
