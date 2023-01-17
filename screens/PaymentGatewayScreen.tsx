import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo} from 'react';
import {SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppAlert from '@/components/AppAlert';
import {HomeStackParamList} from '@/navigation/navigation';
import api from '@/redux/api/api';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import i18n from '@/utils/i18n';
import {PaymentInfo} from '@/redux/api/cartApi';
import AppPaymentGateway from '@/components/AppPaymentGateway';

type PaymentGatewayScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Payment'
>;

type PaymentGatewayScreenRouteProp = RouteProp<HomeStackParamList, 'Payment'>;

type PaymentGatewayScreenProps = {
  navigation: PaymentGatewayScreenNavigationProp;
  route: PaymentGatewayScreenRouteProp;

  action: {
    cart: CartAction;
  };
};

const PaymentGatewayScreen: React.FC<PaymentGatewayScreenProps> = ({
  route: {params},
  navigation,
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
  }, [navigation, params.isPaid]);

  const callback = useCallback(
    async (result) => {
      if (result.success) {
        await navigation.setParams({isPaid: true});

        action.cart.updateOrder(pymInfo);
      }

      navigation.replace('PaymentResult', {
        pymResult: result.success,
      });
    },
    [action.cart, navigation, pymInfo],
  );

  //  }, [callback, navigation, params]);

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

export default connect(undefined, (dispatch) => ({
  action: {
    cart: bindActionCreators(cartActions, dispatch),
  },
}))(PaymentGatewayScreen);
