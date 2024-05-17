import {RouteProp} from '@react-navigation/native';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {bindActionCreators} from 'redux';
import React, {memo, useEffect} from 'react';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {StackNavigationProp} from '@react-navigation/stack';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import ScreenHeader from '@/components/ScreenHeader';
import i18n from '@/utils/i18n';
import AppSvgIcon from '@/components/AppSvgIcon';
import {actions as toastActions} from '@/redux/modules/toast';
import AppText from '@/components/AppText';
import {actions as cartActions} from '@/redux/modules/cart';
import {HomeStackParamList} from '@/navigation/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyish,
    justifyContent: 'center',
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },
});

type LotteryCouponScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'LotteryCoupon'
>;

type LotteryCouponScreenRouteProp = RouteProp<
  HomeStackParamList,
  'LotteryCoupon'
>;

type LotteryCouponScreenProps = {
  navigation: LotteryCouponScreenNavigationProp;
  route: LotteryCouponScreenRouteProp;
};

const LotteryCouponScreen: React.FC<LotteryCouponScreenProps> = ({
  route,
  navigation,
}) => {
  const {coupon} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        isStackTop
        headerStyle={{backgroundColor: colors.greyish}}
        titleStyle={appStyles.bold18Text}
        renderRight={
          <AppSvgIcon
            name="closeModal"
            style={styles.btnCnter}
            onPress={() => navigation.goBack()}
          />
        }
      />
      <View style={styles.container}>
        <View
          style={{
            marginHorizontal: 20,
          }}>
          <AppText
            style={[
              appStyles.bold18Text,
              {
                alignSelf: 'center',
                marginBottom: 40,
                color: colors.white,
              },
            ]}>
            {i18n.t('esim:lottery:modal:win')}
          </AppText>

          <View style={{alignItems: 'flex-end'}}>
            {coupon?.cnt > 1 && (
              <AppText style={appStyles.bold18Text}>{`*${coupon.cnt}`}</AppText>
            )}
          </View>
          <View
            style={{
              backgroundColor: colors.white,
              alignItems: 'center',
              gap: 10,
              padding: 20,
            }}>
            <AppText style={[appStyles.bold16Text]}>{coupon.title}</AppText>
            <AppText style={appStyles.normal12Text}>{coupon.desc}</AppText>
          </View>
          <AppText
            style={[
              appStyles.normal12Text,
              {color: colors.white, marginTop: 20},
            ]}>
            {i18n.t('esim:lottery:modal:notice')}
          </AppText>
        </View>
      </View>
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
  )(LotteryCouponScreen),
);
