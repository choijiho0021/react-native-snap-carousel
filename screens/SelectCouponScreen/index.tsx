import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {bindActionCreators} from 'redux';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {RootState} from '@reduxjs/toolkit';
import {connect} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  CartAction,
  CartModelState,
  actions as cartActions,
} from '@/redux/modules/cart';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import {OrderPromo} from '@/redux/api/cartApi';
import AppPrice from '@/components/AppPrice';
import AppButton from '@/components/AppButton';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
    height: 56,
  },
  coupon: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
  },
});

type SelectCouponScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Coupon'
>;

type SelectCouponProps = {
  navigation: SelectCouponScreenNavigationProp;

  cart: CartModelState;

  action: {
    cart: CartAction;
  };
};

const SelectCoupon: React.FC<SelectCouponProps> = ({
  navigation,
  cart,
  action,
}) => {
  const [couponId, setCouponId] = useState<string | undefined>(
    cart.couponToApply,
  );

  const renderCoupon = useCallback(
    ({item}: {item: OrderPromo}) => {
      return (
        <Pressable
          style={styles.coupon}
          onPress={() => setCouponId(item.coupon_id)}>
          <AppText>{item.coupon_id === couponId ? 'Selected' : ''}</AppText>
          <AppText>{item.title}</AppText>
          <AppPrice price={item.adj} />
        </Pressable>
      );
    },
    [couponId],
  );

  const applyCoupon = useCallback(() => {
    action.cart.applyCoupon({couponId});
    navigation.goBack();
  }, [action.cart, couponId, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton title={i18n.t('pym:sel:coupon:title')} />
      </View>
      <FlatList
        style={{flex: 1}}
        data={cart.promo || []}
        keyExtractor={(item) => item.coupon_id}
        renderItem={renderCoupon}
        ListHeaderComponent={
          <AppButton title="No Coupon" onPress={() => setCouponId(undefined)} />
        }
        ItemSeparatorComponent={<View style={styles.separator} />}
        extraData={couponId}
      />
      <AppButton
        title={i18n.t('pym:sel:coupon:apply')}
        titleStyle={appStyles.medium18}
        onPress={applyCoupon}
        style={appStyles.confirm}
        type="primary"
      />
    </SafeAreaView>
  );
};

export default memo(
  connect(
    ({cart}: RootState) => ({cart}),
    (dispatch) => ({
      action: {
        cart: bindActionCreators(cartActions, dispatch),
      },
    }),
  )(SelectCoupon),
);
