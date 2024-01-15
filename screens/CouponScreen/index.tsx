import React, {memo, useCallback, useEffect} from 'react';
import {bindActionCreators} from 'redux';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import AppBackButton from '@/components/AppBackButton';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import AppText from '@/components/AppText';
import {RkbCoupon} from '@/redux/api/accountApi';

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
    height: 56,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
  },
});

type CouponScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Coupon'
>;

type CouponProps = {
  navigation: CouponScreenNavigationProp;

  account: AccountModelState;

  action: {
    account: AccountAction;
  };
};

const CouponScreen: React.FC<CouponProps> = ({
  navigation,
  action,
  account: {token, coupon},
}) => {
  useEffect(() => {
    action.account.getMyCoupon({token});
  }, [action.account, token]);

  const renderCoupon = useCallback(({item}: {item: RkbCoupon}) => {
    return (
      <View style={styles.coupon}>
        <AppText>{item.promo}</AppText>
        <AppText>{item.startDate.toString()}</AppText>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton title={i18n.t('mypage:coupon')} />
      </View>
      <FlatList
        style={{flex: 1}}
        data={coupon}
        keyExtractor={(item) => item.id}
        renderItem={renderCoupon}
        ItemSeparatorComponent={<View style={styles.separator} />}
        // onEndReachedThreshold={0.4}
        // onEndReached={getNextOrder}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={onRefresh}
        //     colors={[colors.clearBlue]} // android 전용
        //     tintColor={colors.clearBlue} // ios 전용
        //   />
        // }
      />
    </SafeAreaView>
  );
};

export default memo(
  connect(
    ({account}: RootState) => ({account}),
    (dispatch) => ({
      action: {
        account: bindActionCreators(accountActions, dispatch),
      },
    }),
  )(CouponScreen),
);
