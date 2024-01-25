import {RootState} from '@reduxjs/toolkit';
import {bindActionCreators} from 'redux';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {AccountModelState} from '@/redux/modules/account';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppButton from '@/components/AppButton';
import AppPrice from '@/components/AppPrice';
import {
  CartAction,
  CartModelState,
  actions as cartActions,
} from '@/redux/modules/cart';
import Env from '@/environment';
import AppTextInput from '@/components/AppTextInput';
import {utils} from '@/utils/utils';

const {esimCurrency} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  title: {
    ...appStyles.bold18Text,
    marginTop: 20,
    marginBottom: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});

type DiscountProps = {
  account: AccountModelState;
  cart: CartModelState;
  onPress?: () => void;

  action: {
    cart: CartAction;
  };
};

const DiscountInfo: React.FC<DiscountProps> = ({
  account,
  cart,
  onPress,
  action,
}) => {
  const discount = useMemo(() => cart.pymReq?.discount, [cart.pymReq]);
  const [rokebiCash, setRokebiCash] = useState('');
  const updateRokebiCash = useCallback(
    (v: string) => {
      const min = Math.min(account.balance || 0, utils.stringToNumber(v) || 0);
      action.cart.deductRokebiCash(min);
    },
    [account.balance, action.cart],
  );
  useEffect(() => {
    setRokebiCash(utils.numberToCommaString(cart.pymReq?.rkbcash?.value || 0));
  }, [cart.pymReq?.rkbcash]);

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>{i18n.t('pym:discount')}</AppText>
      <View key="coupon" style={styles.row}>
        <AppText>{i18n.t('pym:coupon')}</AppText>
        {onPress ? (
          <AppText>
            {i18n.t('unit', {unit: account.coupon?.length || 0})}
          </AppText>
        ) : null}
      </View>
      <View key="select" style={styles.row}>
        <AppPrice price={discount} />
        {onPress ? (
          <AppButton title={i18n.t('pym:selectCoupon')} onPress={onPress} />
        ) : null}
      </View>
      <View key="cash" style={styles.row}>
        <AppText>{i18n.t('acc:balance')}</AppText>
        {onPress ? (
          <AppPrice
            price={{value: account.balance || 0, currency: esimCurrency}}
          />
        ) : null}
      </View>
      <View key="selcash" style={styles.row}>
        {onPress ? (
          <AppTextInput
            style={{flex: 1}}
            keyboardType="numeric"
            returnKeyType="done"
            enablesReturnKeyAutomatically
            onChangeText={setRokebiCash}
            value={rokebiCash}
            onSubmitEditing={() => updateRokebiCash(rokebiCash)}
          />
        ) : (
          <AppText>{rokebiCash}</AppText>
        )}
        {onPress ? (
          <AppButton
            title={i18n.t('pym:deductAll')}
            onPress={() => action.cart.deductRokebiCash(account.balance)}
          />
        ) : null}
      </View>
    </View>
  );
};

export default memo(
  connect(
    ({account, cart}: RootState) => ({account, cart}),
    (dispatch) => ({
      action: {
        cart: bindActionCreators(cartActions, dispatch),
      },
    }),
  )(DiscountInfo),
);
