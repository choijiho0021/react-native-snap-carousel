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
import AppButton from '@/components/AppButton';
import {
  CartAction,
  CartModelState,
  actions as cartActions,
} from '@/redux/modules/cart';
import AppTextInput from '@/components/AppTextInput';
import {utils} from '@/utils/utils';
import AppIcon from '../AppIcon';
import DropDownHeader from '@/screens/PymMethodScreen/DropDownHeader';
import ConfirmButton from './ConfirmButton';
import AppStyledText from '../AppStyledText';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  title: {
    ...appStyles.bold16Text,
    color: colors.warmGrey,
    flex: 1,
  },
  buttonTitle: {
    ...appStyles.medium16,
    color: colors.warmGrey,
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  button: {
    marginTop: 12,
    height: 48,
    width: 96,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 3,
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

  console.log('@@@ discount', discount);

  return (
    <DropDownHeader
      title={i18n.t('pym:discount')}
      summary={
        i18n.t('total') +
        utils.price(
          utils.toCurrency(
            Math.abs(discount?.value || 0) +
              (utils.stringToNumber(rokebiCash) || 0),
          ),
        )
      }>
      <View style={styles.container}>
        <View
          key="coupon"
          style={[styles.row, {justifyContent: 'space-between'}]}>
          <AppText style={styles.title}>{i18n.t('pym:coupon')}</AppText>
          {(cart.promo?.length || 0) > 0 ? (
            <Pressable
              style={styles.row}
              onPress={() => toggleMaxPromo(checked)}>
              <AppIcon name="btnCheck2" checked={checked} size={22} />
              <AppText style={{...appStyles.medium16, marginLeft: 8}}>
                {i18n.t('pym:coupon:max')}
              </AppText>
            </Pressable>
          ) : null}
        </View>
        <ConfirmButton
          title={
            discount
              ? utils.numberToCommaString(Math.abs(discount.value)) +
                i18n.t('won')
              : i18n.t(
                  (cart.promo?.length || 0) > 0
                    ? 'pym:coupon:none:sel'
                    : 'pym:no:coupon',
                )
          }
          titleStyle={appStyles.robotoBold16Text}
          buttonTitle={i18n.t('pym:sel:coupon:title')}
          onPress={onPress}
        />
        <View key="cash" style={[styles.row, {marginTop: 24}]}>
          <AppText style={styles.title}>{i18n.t('acc:balance')}</AppText>
          {onPress ? (
            <AppStyledText
              text={i18n.t('acc:balance:hold')}
              textStyle={{...appStyles.bold14Text, color: colors.clearBlue}}
              data={{cash: utils.numberToCommaString(account.balance || 0)}}
            />
          ) : null}
        </View>
        <View key="selcash" style={styles.row}>
          <View style={styles.input}>
            {onPress ? (
              <AppTextInput
                style={{
                  ...styles.title,
                  color: colors.clearBlue,
                }}
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
            {rokebiCash?.length > 0 && (
              <AppButton
                style={{justifyContent: 'flex-end', marginLeft: 10}}
                iconName="btnSearchCancel"
                // onPress={() => setCode('')}
              />
            )}
          </View>
          {onPress ? (
            <AppButton
              style={styles.button}
              titleStyle={styles.buttonTitle}
              title={i18n.t('pym:deductAll')}
              onPress={() => action.cart.deductRokebiCash(account.balance)}
            />
          ) : null}
        </View>
      </View>
    </DropDownHeader>
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
