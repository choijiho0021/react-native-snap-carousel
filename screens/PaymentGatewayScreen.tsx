import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import Video from 'react-native-video';
import moment from 'moment';
import AppAlert from '@/components/AppAlert';
import {HomeStackParamList} from '@/navigation/navigation';
import api, {ApiResult} from '@/redux/api/api';
import {
  actions as cartActions,
  CartAction,
  CartModelState,
} from '@/redux/modules/cart';
import {
  ProductAction,
  actions as productActions,
} from '@/redux/modules/product';
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
import Env from '@/environment';
import {storeData} from '@/utils/utils';

const loading = require('../assets/images/loading_1.mp4');

const {cachePrefix, isIOS} = Env.get();

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
  cart: CartModelState;

  action: {
    cart: CartAction;
    product: ProductAction;
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
  loadingShadowBox: {
    elevation: 32,
    shadowColor: 'rgba(166, 168, 172, 0.24)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
  },
  loadingContainer: {
    backgroundColor: 'white',

    height: 200,
    marginTop: 10,
  },
  head: {
    height: 74,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 6,
  },
});

const PaymentGatewayScreen: React.FC<PaymentGatewayScreenProps> = ({
  route: {params},
  navigation,
  account,
  action,
  cart,
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
        if (params.isSave)
          storeData(`${cachePrefix}cache.pym.method`, params.pymMethod);

        await navigation.setParams({isPaid: true});
        action.cart.updateOrder(pymInfo);
      }

      if (status !== 'check' || pymResult) {
        console.log('@@@ pym method', params.pymMethod);

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
          installmentMonths: params?.installmentMonths || '0',
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
      params?.installmentMonths,
      params.isSave,
      params.mode,
      params.pay_method,
      params.paymentRule,
      params.pymMethod,
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
        .makeOrderAndPurchase(pymInfo)
        .then(({payload: resp}) => {
          // 카드결제 탭이랑 같은 응답처리, 함수로 따로 뺴기.
          if (!resp || resp.result < 0) {
            let text = 'cart:systemError';
            if (resp?.result === api.E_RESOURCE_NOT_FOUND)
              text = 'cart:soldOut';
            else if (resp?.result === api.E_STATUS_EXPIRED) {
              text = 'cart:unpublishedError';

              // product status is changed.
              const skuList = resp?.message.split(',');
              if (skuList?.length > 0 && cart.cartId) {
                cart?.cartItems
                  .filter((elm) => skuList.includes(elm.prod.sku))
                  .forEach((elm) => {
                    // remove it from the cart
                    if (elm.orderItemId) {
                      action.cart.cartRemove({
                        orderId: cart.cartId,
                        orderItemId: elm.orderItemId,
                      });
                    }
                  });
              }

              action.product.getAllProduct(true);
            } else if (resp?.status === api.API_STATUS_PREFAILED)
              text = 'cart:cashChanged';
            AppAlert.info(i18n.t(text));
            navigation.popToTop();
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
          AppAlert.info(i18n.t('cart:systemError'), '', () =>
            navigation.popToTop(),
          );
        });
    }
  }, [
    account.token,
    action.cart,
    action.product,
    callback,
    cart.cartId,
    cart?.cartItems,
    navigation,
    params,
    params.isPaid,
    pymInfo,
    vbank,
  ]);

  const renderLoading = useCallback(() => {
    const isKST = moment().format().includes('+09:00');

    return (
      <>
        <View style={{flex: 1, alignItems: 'stretch'}}>
          <Video
            source={loading}
            repeat
            style={styles.backgroundVideo}
            resizeMode="cover"
            mixWithOthers="mix"
          />
          {/* <AppText style={styles.infoText}>{i18n.t('pym:loadingInfo')}</AppText> */}
        </View>
        {true && (
          <View
            style={[
              styles.loadingShadowBox,
              !isIOS && {shadowColor: 'rgb(52, 62, 95)'},
            ]}>
            <View style={styles.loadingContainer}>
              <View style={styles.head}>
                <AppText style={appStyles.bold18Text}>
                  {i18n.t('pym:wait:title')}
                </AppText>
              </View>
              <View>
                <AppText
                  style={{
                    ...appStyles.normal16Text,
                    paddingHorizontal: 20,
                  }}>
                  {i18n.t(isKST ? 'pym:wait:kst' : 'pym:wait:another')}
                </AppText>
              </View>
            </View>
          </View>
        )}
      </>
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

      {/* {renderLoading()} */}
      {isOrderReady && !params.pay_method.startsWith('vbank') ? (
        <AppPaymentGateway info={params} callback={callback} />
      ) : (
        renderLoading()
      )}
    </SafeAreaView>
  );
};

export default connect(
  ({account, cart}: RootState) => ({account, cart}),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(PaymentGatewayScreen);
