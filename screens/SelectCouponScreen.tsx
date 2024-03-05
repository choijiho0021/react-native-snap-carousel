import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {bindActionCreators} from 'redux';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import {appStyles} from '@/constants/Styles';
import ScreenHeader from '@/components/ScreenHeader';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';
import CouponItem from './CouponScreen/CouponItem';
import {AccountModelState} from '@/redux/modules/account';
import {RkbCoupon} from '@/redux/api/accountApi';
import AppText from '@/components/AppText';
import {
  CartAction,
  actions as cartActions,
  CartModelState,
} from '@/redux/modules/cart';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: colors.backGrey,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 38,
  },
  coupon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.gray4,
    borderWidth: 1,
    borderRadius: 3,
    marginHorizontal: 20,
    marginVertical: 4,
    padding: 16,
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },
  noti: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
  },
  line: {
    width: 1,
    height: '100%',
    backgroundColor: colors.gray4,
    marginHorizontal: 16,
  },
});

type SelectCouponProps = {
  cart: CartModelState;
  account: AccountModelState;

  action: {
    cart: CartAction;
  };
};

const SelectCoupon: React.FC<SelectCouponProps> = ({
  cart: {promo, couponToApply},
  account: {coupon: myCoupon, balance},
  action,
}) => {
  const navigation = useNavigation();
  const [couponId, setCouponId] = useState(couponToApply);
  const couponList = useMemo(
    () =>
      promo
        ?.map((p) => myCoupon.find((c) => c.id === p.coupon_id))
        .filter((c) => !!c) || [],
    [myCoupon, promo],
  );

  const renderCoupon = useCallback(
    ({item}: {item: RkbCoupon}) => (
      <Pressable style={styles.coupon} onPress={() => setCouponId(item.id)}>
        <AppSvgIcon name="btnCheck" focused={item.id === couponId} />
        <View style={styles.line} />
        <CouponItem item={item} />
      </Pressable>
    ),
    [couponId],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        isStackTop
        title={i18n.t('pym:sel:coupon:title')}
        renderRight={
          <AppSvgIcon
            name="closeModal"
            style={styles.btnCnter}
            onPress={() => navigation.goBack()}
          />
        }
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <AppSvgIcon name="couponColor" style={{marginRight: 8}} />
          <AppStyledText
            key="noti"
            text={i18n.t('pym:sel:coupon:noti')}
            textStyle={appStyles.medium14}
            format={{b: styles.noti}}
          />
        </View>
        <FlatList
          style={{flex: 1}}
          data={couponList}
          keyExtractor={(item) => item.id}
          renderItem={renderCoupon}
          extraData={couponToApply}
          ListFooterComponent={
            <Pressable style={styles.coupon} onPress={() => setCouponId('')}>
              <AppSvgIcon name="btnCheck" focused={!couponId} />
              <View style={styles.line} />
              <AppText style={appStyles.bold16Text}>
                {i18n.t('pym:coupon:none:sel')}
              </AppText>
            </Pressable>
          }
        />
      </View>
      <AppButton
        title={`${
          promo?.find((p) => p.coupon_id === couponId)?.adj?.value || '0'
        } ${i18n.t('pym:sel:coupon:apply')}`}
        titleStyle={[appStyles.medium18, {color: colors.white}]}
        onPress={() => {
          action.cart.applyCoupon({couponId, accountCash: balance});
          navigation.goBack();
        }}
        style={appStyles.confirm}
        type="primary"
      />
    </SafeAreaView>
  );
};

export default memo(
  connect(
    ({cart, account}: RootState) => ({cart, account}),
    (dispatch) => ({
      action: {
        cart: bindActionCreators(cartActions, dispatch),
      },
    }),
  )(SelectCoupon),
);
