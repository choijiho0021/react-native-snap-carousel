import {RootState} from '@reduxjs/toolkit';
import {bindActionCreators} from 'redux';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
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
import AppIcon from '../AppIcon';

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
    flexDirection: 'row',
    alignItems: 'center',
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
  const [checked, setChecked] = useState(true);
  const updateRokebiCash = useCallback(
    (v: string) => {
      const min = Math.min(account.balance || 0, utils.stringToNumber(v) || 0);
      action.cart.deductRokebiCash(min);
    },
    [account.balance, action.cart],
  );

  const toggleMaxPromo = useCallback(
    (check: boolean) => {
      // check - current status
      setChecked(!check);
      if (!check) {
        // 최대 할인 적용
        action.cart.applyCoupon({maxDiscount: true});
      } else {
        // unselect coupon
        action.cart.applyCoupon({couponId: undefined});
      }
    },
    [action.cart],
  );

  useEffect(() => {
    setRokebiCash(utils.numberToCommaString(cart.pymReq?.rkbcash?.value || 0));
  }, [cart.pymReq?.rkbcash]);

  console.log('@@@ apply coupon', discount, cart.pymReq);

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>{i18n.t('pym:discount')}</AppText>
      <View
        key="coupon"
        style={[
          styles.row,
          {
            marginVertical: 10,
            marginHorizontal: 20,
            justifyContent: 'space-between',
          },
        ]}>
        <AppText style={{flex: 1}}>{i18n.t('pym:coupon')}</AppText>
        {cart.promo?.length > 0 ? (
          <Pressable style={styles.row} onPress={() => toggleMaxPromo(checked)}>
            <AppIcon name="btnCheck2" checked={checked} size={22} />
            <AppText style={{marginLeft: 8}}>
              {i18n.t('pym:coupon:max')}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      <View key="select" style={[styles.row, {marginHorizontal: 20}]}>
        <View style={{flex: 1}}>
          {discount ? (
            <AppPrice price={discount} />
          ) : (
            <AppText>
              {i18n.t(
                cart.promo?.length > 0
                  ? 'pym:coupon:none:sel'
                  : 'pym:no:coupon',
              )}
            </AppText>
          )}
        </View>
        {onPress ? (
          <AppButton title={i18n.t('pym:selectCoupon')} onPress={onPress} />
        ) : null}
      </View>
      <View
        key="cash"
        style={[styles.row, {marginHorizontal: 20, marginTop: 20}]}>
        <View style={{flex: 1}}>
          <AppText>{i18n.t('acc:balance')}</AppText>
        </View>
        {onPress ? (
          <View style={styles.row}>
            <AppPrice
              price={{value: account.balance || 0, currency: esimCurrency}}
            />
            <AppText>{i18n.t('acc:balance:hold')}</AppText>
          </View>
        ) : null}
      </View>
      <View key="selcash" style={[styles.row, {marginHorizontal: 20}]}>
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
