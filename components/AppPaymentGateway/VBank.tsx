import React, {useCallback} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RootState} from '@reduxjs/toolkit';
import {API} from '@/redux/api';
import {PaymentParams} from '@/navigation/navigation';
import {colors} from '@/constants/Colors';
import PaymentItemInfo from '../PaymentItemInfo';
import {CartModelState} from '@/redux/modules/cart';
import DiscountInfo from '@/components/AppPaymentGateway/DiscountInfo';
import ConfirmEmail from './ConfirmEmail';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
});

type VBankProps = {
  cart: CartModelState;
  info: PaymentParams;
  token?: string;
};

const VBank: React.FC<VBankProps> = ({cart, info, token}) => {
  const submit = useCallback(() => {
    API.Payment.reqRokebiPaymentVBank({
      params: {
        ...info,
        pg: 'hecto',
      },
      token,
    }).then((resp) => console.log('@@@ resp', resp));
  }, [info, token]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{minHeight: '100%'}}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        enableResetScrollToCoords={false}>
        <PaymentItemInfo purchaseItems={cart.purchaseItems} mode="method" />

        <ConfirmEmail />

        <DiscountInfo />
        <View style={{flex: 1}} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connect(({account, cart}: RootState) => ({
  cart,
  token: account.token,
}))(VBank);
