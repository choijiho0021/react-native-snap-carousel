import React, {Fragment, memo, useMemo} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {Currency} from '@/redux/api/productApi';
import utils from '@/redux/api/utils';
import i18n from '@/utils/i18n';
import AppText from './AppText';
import {colors} from '@/constants/Colors';

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
});

const AppPrice = ({
  style,
  balanceStyle,
  currencyStyle,
  showPlus = false,
  price,
  isDiscounted = false,
}: {
  style?: StyleProp<ViewStyle>;
  balanceStyle?: StyleProp<TextStyle>;
  currencyStyle?: StyleProp<TextStyle>;
  showPlus?: boolean;
  price: Currency;
  isDiscounted?: boolean;
}) => {
  const textStyle: StyleProp<TextStyle> = useMemo(
    () => ({
      color: colors.black,
      textDecorationLine: isDiscounted ? 'line-through' : 'none',
    }),
    [isDiscounted],
  );

  return (
    <View>
      {esimGlobal || i18n.locale !== 'ko' ? (
        <View style={style || styles.container}>
          <AppText key="won" style={[textStyle, currencyStyle || styles.price]}>
            {showPlus && price.value > 0 ? '+' : ''}
            {`${i18n.t(price.currency)}`}
          </AppText>

          <AppText
            key="balance"
            style={[textStyle, balanceStyle || styles.price]}>
            {utils.currencyString(price.value)}
          </AppText>
        </View>
      ) : (
        <View style={style || styles.container}>
          <AppText
            key="balance"
            style={[textStyle, balanceStyle || styles.price]}>
            {showPlus && price.value > 0 ? '+' : ''}
            {utils.currencyString(price.value)}
          </AppText>

          <AppText key="won" style={[textStyle, currencyStyle || styles.price]}>
            {i18n.t(price.currency)}
          </AppText>
        </View>
      )}
    </View>
  );
};

export default memo(AppPrice);
