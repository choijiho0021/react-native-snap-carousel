import React, {useEffect} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import AppText from '../AppText';
import {API} from '@/redux/api';
import {PaymentParams} from '@/navigation/navigation';

type VBankProps = {
  info: PaymentParams;
  token?: string;
};

const VBank: React.FC<VBankProps> = ({info, token}) => {
  useEffect(() => {
    API.Payment.reqRokebiPaymentVBank({
      params: {
        ...info,
        pg: 'hecto',
      },
      token,
    }).then((resp) => console.log('@@@ resp', resp));
  });

  return (
    <>
      <View>
        <AppText>XXX</AppText>
      </View>
    </>
  );
};

export default connect(({account}: RootState) => ({token: account.token}))(
  VBank,
);
