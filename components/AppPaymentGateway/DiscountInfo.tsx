import {RootState} from '@reduxjs/toolkit';
import {bindActionCreators} from 'redux';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
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
import AppSvgIcon from '../AppSvgIcon';
import {navigate} from '@/navigation/navigation';
import {useNavigation, useRoute} from '@react-navigation/native';

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
    color: colors.black,
    lineHeight: undefined,
    flex: 1,
  },
  buttonTitle: {
    ...appStyles.medium16,
    color: colors.clearBlue,
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
    paddingLeft: 16,
    marginRight: 8,
    height: 50,
  },
  button: {
    marginTop: 12,
    height: 50,
    width: 96,
    borderColor: colors.clearBlue,
    borderWidth: 1,
    borderRadius: 3,
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
    marginTop: 24,
  },
  nobal: {
    color: colors.greyish,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 3,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 13,
    marginRight: 8,
    height: 50,
  },
  inviteRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteButtonContainer: {
    marginTop: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backGrey,
    borderColor: colors.whiteFive,
    borderWidth: 1,
    borderRadius: 100,
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  inviteButtonText: {
    ...appStyles.bold14Text,
    marginRight: 4,
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

export const availableRokebiCash = (balance: number, productPrice: number) => {
  return Math.min(balance, productPrice);
};

const DiscountInfo: React.FC<DiscountProps> = ({
  account,
  cart,
  onPress,
  action,
}) => {
  const discount = useMemo(() => cart.pymReq?.discount, [cart.pymReq]);
  const [rokebiCash, setRokebiCash] = useState('');
  const [checked, setChecked] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const disabledDeductAll = useMemo(
    () =>
      (account?.balance || 0) === utils.stringToNumber(rokebiCash) ||
      utils.stringToNumber(rokebiCash) ===
        (cart.pymReq?.subtotal?.value || 0) +
          (cart.pymReq?.discount?.value || 0),
    [
      account?.balance,
      cart.pymReq?.discount?.value,
      cart.pymReq?.subtotal?.value,
      rokebiCash,
    ],
  );

  const isCashNotEmpty = useMemo(
    () => (account?.balance || 0) !== 0,
    [account?.balance],
  );

  useEffect(() => {
    if (cart.maxCouponId === cart.couponToApply) setChecked(true);
    else setChecked(false);
  }, [cart.couponToApply, cart.maxCouponId]);

  const updateRokebiCash = useCallback(
    (v: string) => {
      const min = availableRokebiCash(
        account.balance || 0,
        utils.stringToNumber(v) || 0,
      );

      action.cart.deductRokebiCash(min);
    },
    [account.balance, action.cart],
  );

  useEffect(() => {
    if (rokebiCash !== '') {
      updateRokebiCash(rokebiCash);
    }
  }, [rokebiCash, updateRokebiCash]);

  const toggleMaxPromo = useCallback(
    (check: boolean) => {
      if (!check) {
        // 최대 할인 적용
        action.cart.applyCoupon({
          maxDiscount: true,
          accountCash: utils.stringToNumber(rokebiCash),
        });
      } else {
        // unselect coupon
        action.cart.applyCoupon({couponId: undefined});
      }
    },
    [action.cart, rokebiCash],
  );

  useEffect(() => {
    setRokebiCash(utils.numberToCommaString(cart.pymReq?.rkbcash?.value || 0));
  }, [cart.pymReq?.rkbcash]);

  return (
    <>
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
            style={[
              styles.row,
              {
                justifyContent: 'space-between',
                marginBottom: 12,
              },
            ]}>
            <AppText style={styles.title}>{i18n.t('pym:coupon')}</AppText>
            {(cart.promo?.length || 0) > 0 ? (
              <Pressable
                style={styles.row}
                onPress={() => toggleMaxPromo(checked)}>
                <AppIcon name="btnCheck3" checked={checked} size={22} />
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
            titleStyle={[
              appStyles.robotoBold16Text,
              {
                color:
                  (cart.promo?.length || 0) > 0
                    ? colors.clearBlue
                    : colors.greyish,
                lineHeight: undefined,
              },
            ]}
            buttonTitle={i18n.t('pym:sel:coupon:title')}
            onPress={() => {
              onPress?.();
            }}
          />
        </View>
      </DropDownHeader>
      <View key="div" style={styles.divider} />

      <View style={{marginHorizontal: 20}}>
        <View key="cash" style={[styles.row, {marginTop: 24}]}>
          <AppSvgIcon name="rokebiLogo" />
          <AppText style={[styles.title, {marginLeft: 8}]}>
            {i18n.t('acc:balance')}
          </AppText>
          {isCashNotEmpty ? (
            <AppStyledText
              text={i18n.t('acc:balance:hold')}
              textStyle={{...appStyles.bold16Text, color: colors.clearBlue}}
              data={{cash: utils.numberToCommaString(account.balance || 0)}}
            />
          ) : null}
        </View>
        <View key="selcash" style={styles.row}>
          {onPress && isCashNotEmpty ? (
            <AppTextInput
              showCancel={(utils.stringToNumber(rokebiCash) || 0) > 0}
              containerStyle={styles.input}
              onCancel={() => setRokebiCash('0')}
              style={{
                ...styles.title,
                color: isCashNotEmpty ? colors.clearBlue : colors.greyish,
              }}
              allowFontScaling={false}
              keyboardType="numeric"
              returnKeyType="done"
              enablesReturnKeyAutomatically
              onChangeText={setRokebiCash}
              value={
                editing
                  ? rokebiCash
                  : utils.numberToCommaString(rokebiCash) + i18n.t('rkbCash')
              }
              onSubmitEditing={() => updateRokebiCash(rokebiCash)}
              onFocus={() => setEditing(true)}
              onBlur={() => setEditing(false)}
            />
          ) : (
            <AppText style={[styles.title, styles.nobal]}>
              {i18n.t('acc:balance:none')}
            </AppText>
          )}
          {onPress ? (
            <AppButton
              style={styles.button}
              titleStyle={[styles.buttonTitle]}
              title={i18n.t('pym:deductAll')}
              // 보유캐시와 사용할 캐시가 같거나, 상품 결제 금액과 사용할 캐시가 같을 때 비활성화
              disabled={disabledDeductAll}
              disableStyle={{
                backgroundColor: colors.whiteTwo,
                borderColor: colors.lightGrey,
              }}
              disableColor={colors.greyish}
              onPress={() => action.cart.deductRokebiCash(account.balance)}
            />
          ) : null}
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate('HomeStack', {screen: 'Invite'});
          }}
          style={styles.inviteButtonContainer}>
          <View style={[styles.inviteRow, {gap: 2}]}>
            <AppText
              style={[
                appStyles.semiBold16Text,
                {color: colors.clearBlue, lineHeight: 24},
              ]}>
              {i18n.t('pym:invite:title')}
            </AppText>
            <Image
              source={require('@/assets/images/esim/emojiMoney.png')}
              style={{width: 22, height: 22}}
              resizeMode="contain"
            />
          </View>
          <View style={styles.inviteRow}>
            <AppText style={styles.inviteButtonText}>
              {i18n.t('pym:invite')}
            </AppText>
            <AppSvgIcon name="rightArrow10" />
          </View>
        </Pressable>
      </View>
    </>
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
