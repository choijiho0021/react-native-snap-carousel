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
import {
  actions as toastActions,
  Toast,
  ToastAction,
} from '@/redux/modules/toast';
import AppText from '@/components/AppText';
import {
  CartAction,
  actions as cartActions,
  CartModelState,
} from '@/redux/modules/cart';
import Svg, {Line} from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: colors.backGrey,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 38,
  },
  coupon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.lightGrey,
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
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.gray4,
    borderRadius: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    marginTop: '30%',
  },
});

type SelectCouponProps = {
  cart: CartModelState;
  account: AccountModelState;

  action: {
    cart: CartAction;
    toast: ToastAction;
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
        ?.map((p) => {
          return {
            ...myCoupon.find((c) => c.id === p.coupon_id),
            adj: p?.adj?.value || 0,
          };
        })
        .filter((c) => !!c)
        .sort((a, b) => {
          return a?.adj > b?.adj ? 1 : -1;
        }) || [],
    [myCoupon, promo],
  );

  const dotLine = useCallback(
    () => (
      <Svg height="100%" width="2" style={{marginHorizontal: 16}}>
        <Line
          x1="1"
          y1="0"
          x2="1"
          y2="100%"
          stroke={colors.gray4}
          strokeWidth="2"
          strokeDasharray="4, 2"
        />
      </Svg>
    ),
    [],
  );
  const renderCoupon = useCallback(
    ({item}: {item: RkbCoupon}) => (
      <Pressable
        style={[
          styles.coupon,
          {
            borderColor:
              item.id === couponId ? colors.clearBlue : colors.lightGrey,
          },
        ]}
        onPress={() => setCouponId(item.id)}>
        <AppSvgIcon name="btnCheck" focused={item.id === couponId} />
        {dotLine()}
        <CouponItem item={item} />
      </Pressable>
    ),
    [couponId, dotLine],
  );
  const renderListHeader = useCallback(
    () => (
      <View style={styles.header}>
        <AppSvgIcon name="couponColor" style={{marginRight: 8}} />
        <AppStyledText
          key="noti"
          text={i18n.t('pym:sel:coupon:noti')}
          textStyle={appStyles.medium14}
          format={{b: styles.noti}}
        />
      </View>
    ),
    [],
  );

  const renderListFooter = useCallback(
    (id?: string) => (
      <Pressable style={styles.coupon} onPress={() => setCouponId('')}>
        <AppSvgIcon name="btnCheck" focused={!id} />
        <View style={styles.line} />
        <AppText style={appStyles.bold16Text}>
          {i18n.t('pym:coupon:none:sel')}
        </AppText>
      </Pressable>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        isStackTop
        title={i18n.t('pym:sel:coupon:title')}
        titleStyle={appStyles.bold18Text}
        headerStyle={{paddingVertical: 30, height: 74}}
        renderRight={
          <AppSvgIcon
            name="closeModal"
            style={styles.btnCnter}
            onPress={() => navigation.goBack()}
          />
        }
      />
      <View style={styles.container}>
        <FlatList
          style={{flex: 1}}
          data={couponList}
          keyExtractor={(item) => item.id}
          renderItem={renderCoupon}
          extraData={couponToApply}
          ListEmptyComponent={
            <View style={styles.empty}>
              <AppSvgIcon name="imgCoupon" />
              <AppText style={[appStyles.bold14Text, {color: colors.warmGrey}]}>
                {i18n.t('coupon:none')}
              </AppText>
            </View>
          }
          ListHeaderComponent={renderListHeader()}
          ListFooterComponent={
            couponList?.length > 0 ? renderListFooter(couponId) : null
          }
        />
      </View>
      <AppButton
        title={`${Math.abs(
          promo?.find((p) => p.coupon_id === couponId)?.adj?.value || '0',
        )}${i18n.t('pym:sel:coupon:apply')}`}
        titleStyle={[appStyles.medium18, {color: colors.white}]}
        onPress={() => {
          if (couponId) {
            action.toast.push('pym:coupon:select');
          }

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
        toast: bindActionCreators(toastActions, dispatch),
      },
    }),
  )(SelectCoupon),
);
