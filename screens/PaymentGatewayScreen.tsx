import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo} from 'react';
import {SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import AppAlert from '@/components/AppAlert';
import {HomeStackParamList} from '@/navigation/navigation';
import api from '@/redux/api/api';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import i18n from '@/utils/i18n';
import {PaymentInfo} from '@/redux/api/cartApi';
import AppPaymentGateway, {
  PaymentResultCallbackParam,
} from '@/components/AppPaymentGateway';
import {API} from '@/redux/api';
import {AccountModelState} from '@/redux/modules/account';

type PaymentGatewayScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Payment'
>;

type PaymentGatewayScreenRouteProp = RouteProp<HomeStackParamList, 'Payment'>;

type PaymentGatewayScreenProps = {
  navigation: PaymentGatewayScreenNavigationProp;
  route: PaymentGatewayScreenRouteProp;
  account: AccountModelState;

  action: {
    cart: CartAction;
  };
};

const PaymentGatewayScreen: React.FC<PaymentGatewayScreenProps> = ({
  route: {params},
  navigation,
  account,
  action,
}) => {
  const pymInfo = useMemo(
    () =>
      ({
        payment_type: params.pay_method,
        merchant_uid: params.merchant_uid,
        amount: params.amount,
        rokebi_cash: params.rokebi_cash,
        dlvCost: params.dlvCost,
        profile_uuid: params.profile_uuid,
        memo: params.memo,
        captured: false,
      } as PaymentInfo),
    [params],
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const callback = useCallback(
    async (status: PaymentResultCallbackParam) => {
      let pymResult = false;

      if (status !== 'cancel') {
        const resp = await API.Payment.getRokebiPayment({
          key: pymInfo.merchant_uid,
          token: account.token,
        });

        if (resp.result === 0 && resp.objects?.[0]?.status === '00')
          pymResult = true;
      }

      if (pymResult) {
        await navigation.setParams({isPaid: true});
        action.cart.updateOrder(pymInfo);
      }

      if (status !== 'check' || pymResult) {
        // status = 'next', 'cancel' 이거나, pymResult = true인 경우 다음 페이지로 이동
        navigation.replace('PaymentResult', {pymResult});
      }
    },
    [account, action.cart, navigation, pymInfo],
  );

  useEffect(() => {
    if (!params.isPaid) {
      action.cart
        .checkStockAndMakeOrder(pymInfo)
        .then(({payload: resp}) => {
          if (!resp || resp.result < 0) {
            let text = 'cart:systemError';
            if (resp?.result === api.E_RESOURCE_NOT_FOUND)
              text = 'cart:soldOut';
            else if (resp?.status === api.API_STATUS_PREFAILED)
              text = 'cart:cashChanged';

            AppAlert.info(i18n.t(text));
            navigation.goBack();
          }
        })
        .catch(() => {
          AppAlert.info(i18n.t('cart:systemError'));
          navigation.goBack();
        });
    }
  }, [action.cart, navigation, params.isPaid, pymInfo]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <AppPaymentGateway info={params} callback={callback} />
    </SafeAreaView>
  );
};

export default connect(
  ({account}: RootState) => ({account}),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(PaymentGatewayScreen);
