/* eslint-disable no-plusplus */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component, useState} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {windowWidth} from '@/constants/SliderEntry.style';
import {appStyles, htmlDetailWithCss} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {actions as infoActions, InfoModelState} from '@/redux/modules/info';
import {
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import {
  actions as toastActions,
  Toast,
  ToastAction,
} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import AppSnackBar from '@/components/AppSnackBar';
import {useCallback, useEffect} from 'react';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import analytics, {firebase} from '@react-native-firebase/analytics';
import Analytics from 'appcenter-analytics';
import {Settings} from 'react-native-fbsdk';

import {
  getTrackingStatus,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import {API} from '@/redux/api';
import {ApiResult} from '@/redux/api/api';
import {RkbProduct} from '../redux/api/productApi';
import {PurchaseItem} from '../redux/models/purchaseItem';
import {
  actions as cartActions,
  CartAction,
  CartModelState,
} from '@/redux/modules/cart';

const {baseUrl, esimApp, esimGlobal} = Env.get();
const PURCHASE_LIMIT = 10;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  buttonBox: {
    flexDirection: 'row',
  },
  btnCart: {
    width: '50%',
    height: 52,
    backgroundColor: '#ffffff',
    borderColor: colors.lightGrey,
    borderTopWidth: 1,
  },
  btnCartText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.black,
  },
  btnBuy: {
    width: '50%',
    height: 52,
    backgroundColor: colors.clearBlue,
  },
  btnBuyText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.white,
  },
  regCard: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    textAlignVertical: 'bottom',
    width: '100%',
  },
  regCardView: {
    width: '100%',
    height: 52,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: colors.lightGrey,
  },
});

type ProductDetailScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ProductDetail'
>;

type ProductDetailScreenRouteProp = RouteProp<
  HomeStackParamList,
  'ProductDetail'
>;

type ProductDetailScreenProps = {
  navigation: ProductDetailScreenNavigationProp;
  route: ProductDetailScreenRouteProp;

  pending: boolean;
  product: ProductModelState;
  info: InfoModelState;
  account: AccountModelState;
  cart: CartModelState;

  action: {
    toast: ToastAction;
    product: ProductAction;
    cart: CartAction;
  };
};

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
  pending,
  product,
  cart,
  info,
  action,
  account,
}) => {
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState<TrackingStatus>();
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    const {detailCommon, partnerId} = product;
    const {params = {}} = route;

    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={route.params?.title} />,
    });

    // if (!detailCommon) {
    //   action.product.getProdDetailCommon(this.controller);
    // }

    if (partnerId !== route.params?.partnerId) {
      action.product.getProdDetailInfo(params?.partnerId || '');
    }

    const item = API.Product.toPurchaseItem(route.params.item);
    setPurchaseItems(item ? [item] : []);
    getTrackingStatus().then((elm) => setStatus(elm));
  }, [action.product, navigation, product, route, route.params?.partnerId]);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const cmd = JSON.parse(event.nativeEvent.data);

      switch (cmd.key) {
        case 'moveToPage':
          if (cmd.value) {
            action.info.getItem(cmd.value).then(({payload: item}) => {
              if (item?.title && item?.body) {
                navigation.navigate('SimpleText', {
                  key: 'noti',
                  title: i18n.t('set:noti'),
                  bodyTitle: item?.title,
                  body: item?.body,
                  mode: 'html',
                });
              } else {
                AppAlert.error(i18n.t('info:init:err'));
              }
            });
          }
          break;
        case 'moveToFaq':
          if (cmd.value) {
            const moveTo = cmd.value.split('/');
            navigation.navigate('Faq', {
              key: moveTo[0],
              num: moveTo[1],
            });
          }
          break;
        case 'copy':
          action.toast.push(Toast.COPY_SUCCESS);
          break;
        default:
          Clipboard.setString(cmd.value);
          break;
      }
    },
    [action, navigation],
  );

  const renderWebView = useCallback(() => {
    const localOpDetails = route.params?.localOpDetails;
    const detail = _.isEmpty(localOpDetails)
      ? product.detailInfo + product.detailCommon
      : localOpDetails + product.detailCommon;

    return (
      <View style={{flex: 1}}>
        <WebView
          automaticallyAdjustContentInsets={false}
          javaScriptEnabled
          domStorageEnabled
          scalesPageToFit
          startInLoadingState
          // injectedJavaScript={script}
          decelerationRate="normal"
          // onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}
          scrollEnabled
          // source={{html: body + html + script} }
          onMessage={onMessage}
          source={{html: htmlDetailWithCss(detail), baseUrl}}
          style={{height: 2000}}
        />
      </View>
    );
  }, [
    onMessage,
    product.detailCommon,
    product.detailInfo,
    route.params?.localOpDetails,
  ]);

  const soldOut = useCallback((payload: ApiResult<any>, message: string) => {
    if (payload.result === api.E_RESOURCE_NOT_FOUND) {
      AppAlert.info(i18n.t(message));
    } else {
      AppAlert.info(i18n.t('cart:systemError'));
    }
  }, []);

  const onPressBtnCart = useCallback(async () => {
    const {loggedIn} = account;
    const {params = {}} = route;
    // 다른 버튼 클릭으로 스낵바 종료될 경우, 재출력 안되는 부분이 있어 추가
    setShowSnackBar(false);

    if (status === 'authorized') {
      Analytics.trackEvent('Click_cart');
      await firebase.analytics().setAnalyticsCollectionEnabled(true);
      await Settings.setAdvertiserTrackingEnabled(true);

      analytics().logEvent(`${esimGlobal ? 'global' : 'esim'}_to_cart`, {
        item: purchaseItems[0].title,
        count: 1,
      });
    }

    if (!loggedIn) {
      return navigation.navigate('Auth');
    }

    // if (selected) {
    action.cart.cartAddAndGet({purchaseItems}).then(({payload: resp}) => {
      console.log('@@@ add and get', resp);
      if (resp.result === 0) {
        setShowSnackBar(true);
        if (
          resp.objects[0].orderItems.find((v) => v.key === selected).qty >=
          PURCHASE_LIMIT
        ) {
          setDisabled(true);
        }
      } else {
        soldOut(resp, 'cart:notToCart');
      }
    });
    // }
  }, [account, action.cart, navigation, purchaseItems, route, soldOut, status]);

  const onPressBtnRegCard = useCallback(() => {
    Analytics.trackEvent('Click_regCard');

    if (!account.loggedIn) {
      return navigation.navigate('Auth');
    }

    navigation.navigate('RegisterSim');
  }, [account.loggedIn, navigation]);

  const onPressBtnPurchase = useCallback(() => {
    const {loggedIn, balance} = account;

    // 다른 버튼 클릭으로 스낵바 종료될 경우, 재출력 안되는 부분이 있어 추가
    setShowSnackBar(false);

    Analytics.trackEvent('Click_purchase');

    if (!loggedIn) {
      return navigation.navigate('Auth');
    }

    // if (selected) {
    // 구매 품목을 갱신한다.
    return action.cart
      .checkStockAndPurchase({
        purchaseItems,
        balance,
      })
      .then(({payload: resp}) => {
        if (resp.result === 0) {
          navigation.navigate('PymMethod', {
            mode: 'roaming_product',
          });
        } else {
          soldOut(resp, 'cart:soldOut');
        }
      })
      .catch((err) => {
        console.log('failed to check stock', err);
      });
    // }
  }, [account, action.cart, navigation, purchaseItems, soldOut]);

  return (
    <SafeAreaView style={styles.screen}>
      <AppActivityIndicator visible={pending} />
      <ScrollView
        style={{backgroundColor: colors.whiteTwo, flex: 1}}
        // ref={scrollView}
        // stickyHeaderIndices={[1]} // 탭 버튼 고정
        // showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}>
        {renderWebView()}
      </ScrollView>
      {/* useNativeDriver 사용 여부가 아직 추가 되지 않아 warning 발생중 */}
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('country:addCart')}
      />
      {account.iccid || (esimApp && account.loggedIn) ? (
        <View style={styles.buttonBox}>
          <AppButton
            style={styles.btnCart}
            title={i18n.t('cart:toCart')}
            titleStyle={styles.btnCartText}
            disabled={pending || disabled}
            disableColor={colors.black}
            disableBackgroundColor={colors.whiteTwo}
            onPress={onPressBtnCart}
          />
          <AppButton
            style={styles.btnBuy}
            title={i18n.t('cart:buy')}
            titleStyle={styles.btnBuyText}
            onPress={onPressBtnPurchase}
          />
        </View>
      ) : (
        <View style={styles.buttonBox}>
          <AppButton
            style={styles.regCardView}
            title={account.loggedIn ? i18n.t('reg:card') : i18n.t('err:login')}
            titleStyle={styles.regCard}
            onPress={onPressBtnRegCard}
          />
          <AppText style={styles.regCard}>{i18n.t('reg:card')}</AppText>
        </View>
      )}
    </SafeAreaView>
  );
};

export default connect(
  ({product, account, cart, status, info}: RootState) => ({
    product,
    account,
    cart,
    pending:
      status.pending[productActions.getProdDetailCommon.typePrefix] ||
      status.pending[productActions.getProdDetailInfo.typePrefix] ||
      false,
    info,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(ProductDetailScreen);
