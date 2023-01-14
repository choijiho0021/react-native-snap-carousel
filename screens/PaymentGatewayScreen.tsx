import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Video from 'react-native-video';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// import {Adjust, AdjustEvent} from 'react-native-adjust';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {API} from '@/redux/api';
import api from '@/redux/api/api';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import i18n from '@/utils/i18n';
import {PaymentInfo} from '@/redux/api/cartApi';
import AppPaymentGateway from '@/components/AppPaymentGateway';

// const IMP = require('iamport-react-native').default;
const loading = require('../assets/images/loading_1.mp4');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    height: '100%',
    width: '100%',
    backgroundColor: colors.white,
  },
  webview: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'yellow',
    height: '100%',
    width: '100%',
    borderWidth: 1,
  },
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

const {impId} = Env.get();
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
  const [stockChecked, setStockChecked] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          title={i18n.t(params?.isPaid ? 'his:paymentCompleted' : 'payment')}
          isPaid={params.isPaid}
        />
      ),
    });
  }, [navigation, params.isPaid]);

  const callback = useCallback(
    (response) => {
      API.Payment.getImpToken().then((resp) => {
        if (resp.code === 0) {
          const token = resp.response.access_token;

          API.Payment.getUid({
            uid: response.imp_uid,
            token,
          }).then(async (rsp) => {
            if (rsp[0]?.success) {
              // 결제완료시 '다음' 버튼 연속클릭 방지 - 연속클릭시 추가 결제 없이 order 계속 생성
              if (!params.isPaid) {
                // adjust 결제 이벤트 추척
                // const adjustPaymentEvent = new AdjustEvent(adjustPayment);
                // adjustPaymentEvent.setRevenue(pymInfo.amount, 'KRW');
                // Adjust.trackEvent(adjustPaymentEvent);

                // const adjustRokebiCashEvent = new AdjustEvent(adjustRokebiCash);
                // adjustRokebiCashEvent.setRevenue(pymInfo.rokebi_cash, 'KRW');
                // Adjust.trackEvent(adjustRokebiCashEvent);

                await navigation.setParams({isPaid: true});

                action.cart.updateOrder(pymInfo);
              }
            }
            navigation.replace('PaymentResult', {
              pymResult: rsp[0]?.success,
            });
          });
        }
      });
    },
    [action.cart, navigation, params.isPaid, pymInfo],
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
          } else setStockChecked(true);
        })
        .catch(() => {
          AppAlert.info(i18n.t('cart:systemError'));
          navigation.goBack();
        });
    }
  }, [action.cart, navigation, params.isPaid, pymInfo]);

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

  return <AppPaymentGateway pg="hecto" info={pymInfo} />;
};

export default connect(undefined, (dispatch) => ({
  action: {
    cart: bindActionCreators(cartActions, dispatch),
  },
}))(PaymentGatewayScreen);
