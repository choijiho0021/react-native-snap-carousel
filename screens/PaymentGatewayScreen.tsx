import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import Video from 'react-native-video';
import AppAlert from '@/components/AppAlert';
import {HomeStackParamList} from '@/navigation/navigation';
import api, {ApiResult} from '@/redux/api/api';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import i18n from '@/utils/i18n';
import {PaymentInfo} from '@/redux/api/cartApi';
import AppPaymentGateway, {
  PaymentResultCallbackParam,
} from '@/components/AppPaymentGateway';
import {API} from '@/redux/api';
import {AccountModelState} from '@/redux/modules/account';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RkbPaymentVBankResult} from '@/redux/api/paymentApi';

const loading = require('../assets/images/loading_1.mp4');

type PaymentGatewayScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PaymentGateway'
>;

type PaymentGatewayScreenRouteProp = RouteProp<
  HomeStackParamList,
  'PaymentGateway'
>;

type PaymentGatewayScreenProps = {
  navigation: PaymentGatewayScreenNavigationProp;
  route: PaymentGatewayScreenRouteProp;
  account: AccountModelState;

  action: {
    cart: CartAction;
  };
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 80,
    right: 0,
  },
  infoText: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    marginBottom: 30,
    color: colors.clearBlue,
    textAlign: 'center',
    fontSize: 14,
  },
});

const PaymentGatewayScreen: React.FC<PaymentGatewayScreenProps> = ({
  route: {params},
  navigation,
  account,
  action,
}) => {
  const [isOrderReady, setIsOrderReady] = useState(false);
  const pymInfo = useMemo(
    () =>
      ({
        payment_type: params.pay_method,
        merchant_uid: params.merchant_uid,
        amount: params.amount,
        rokebi_cash: params.rokebi_cash,
        memo: params.memo,
        captured: false,
      } as PaymentInfo),
    [params],
  );

  const callback = useCallback(
    async (status: PaymentResultCallbackParam, errorMsg?: string) => {
      let pymResult = false;

      if (status !== 'cancel') {
        const resp = await API.Payment.getRokebiPayment({
          key: pymInfo.merchant_uid,
          pg: params.paymentRule?.[params.card || params.pay_method] || '',
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
        navigation.replace('PaymentResult', {
          pymResult,
          status,
          errorMsg,
          paymentParams: {
            key: pymInfo.merchant_uid,
            pg: params.paymentRule?.[params.card || params.pay_method] || '',
            token: account.token,
          },
          pay_method: params.pay_method,
          card: params.card,
          mode: params.mode,
        });
      }
    },
    [
      account.token,
      action.cart,
      navigation,
      params.card,
      params.mode,
      params.pay_method,
      params.paymentRule,
      pymInfo,
    ],
  );

  const vbank = useCallback(
    (resp: ApiResult<RkbPaymentVBankResult>) => {
      if (resp.result === 0)
        navigation.replace('PaymentVBank', {info: resp.objects[0]});
      else
        navigation.replace('PaymentResult', {
          pymResult: false,
          mode: params?.mode,
        });
    },
    [navigation, params?.mode],
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
          } else {
            setIsOrderReady(true);

            if (params.pay_method.startsWith('vbank')) {
              API.Payment.reqRokebiPaymentVBank({
                params: {
                  ...params,
                  pg: 'hecto',
                },
                token: account.token,
              })
                .then(vbank)
                .catch((ex) =>
                  vbank(api.failure(api.E_INVALID_STATUS, ex.message)),
                );
            }
          }
        })
        .catch(() => {
          AppAlert.info(i18n.t('cart:systemError'));
          navigation.goBack();
        });
    }
  }, [
    account.token,
    action.cart,
    callback,
    navigation,
    params,
    params.isPaid,
    pymInfo,
    vbank,
  ]);

  const renderLoading = useCallback(() => {
    return (
      <View style={{flex: 1, alignItems: 'stretch'}}>
        <Video
          source={loading}
          repeat
          style={styles.backgroundVideo}
          resizeMode="cover"
          mixWithOthers="mix"
        />
        <AppText style={styles.infoText}>{i18n.t('pym:loadingInfo')}</AppText>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={appStyles.header}>
        <AppBackButton
          title={i18n.t(params?.isPaid ? 'his:paymentCompleted' : 'payment')}
          disabled={params.isPaid}
          showIcon={!params.isPaid}
        />
      </View>
      {isOrderReady && !params.pay_method.startsWith('vbank') ? (
        <AppPaymentGateway info={params} callback={callback} />
      ) : (
        renderLoading()
      )}
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
