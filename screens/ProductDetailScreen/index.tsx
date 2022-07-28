/* eslint-disable no-plusplus */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useEffect, useCallback} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import analytics, {firebase} from '@react-native-firebase/analytics';
import Analytics from 'appcenter-analytics';
import {Settings} from 'react-native-fbsdk';
import {
  getTrackingStatus,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {actions as infoActions, InfoAction} from '@/redux/modules/info';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import AppSnackBar from '@/components/AppSnackBar';
import AppButton from '@/components/AppButton';
import api, {ApiResult} from '@/redux/api/api';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import AppCartButton from '@/components/AppCartButton';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {utils} from '@/utils/utils';
import {eventToken} from '@/constants/Adjust';

const {esimApp, esimGlobal, webViewHost} = Env.get();
const PURCHASE_LIMIT = 10;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
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
  account: AccountModelState;

  action: {
    product: ProductAction;
    cart: CartAction;
    info: InfoAction;
  };
};

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
  pending,
  product,
  action,
  account,
}) => {
  const [showSnackBar, setShowSnackBar] = useState<{
    text: string;
    visible: boolean;
  }>({text: '', visible: false});
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState<TrackingStatus>();
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    const {partnerId} = product;
    const {params = {}} = route;

    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={route.params?.title} />,
      headerRight: () => (
        <AppCartButton onPress={() => navigation.navigate('Cart')} />
      ),
    });

    if (partnerId !== route.params?.partnerId) {
      action.product.getProdDetailInfo(params?.partnerId || '');
    }

    setPurchaseItems(params.item ? [params.item] : []);
    getTrackingStatus().then((elm) => setStatus(elm));
  }, [action.product, navigation, product, route]);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const [key, value] = event.nativeEvent.data.split(',');
      switch (key) {
        case 'moveToPage':
          if (value) {
            action.info.getItem(value).then(({payload: item}) => {
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
          if (value) {
            const moveTo = value.split('/');
            navigation.navigate('Faq', {
              key: moveTo[0],
              num: moveTo[1],
            });
          }
          break;
        case 'copy':
          Clipboard.setString(value);
          setShowSnackBar({text: i18n.t('prodDetail:copy'), visible: true});
          break;
        case 'apn':
          navigation.navigate('ProductDetailOp', {
            title: route.params?.title,
            ...route.params.desc,
          });
          break;
        // 기본적으로 화면 크기 가져오도록 함
        default:
          console.log('@@@ Please check key');
          break;
      }
    },
    [action.info, navigation, route.params.desc, route.params?.title],
  );

  const renderWebView = useCallback(
    (uuid?: string) =>
      uuid ? (
        <WebView
          // automaticallyAdjustContentInsets={true}
          javaScriptEnabled
          domStorageEnabled
          // injectedJavaScript={injectedScript}
          // scalesPageToFit
          startInLoadingState
          decelerationRate="normal"
          scrollEnabled
          onMessage={onMessage}
          source={{uri: `${webViewHost}/#/product/${uuid}`}}
          // source={{uri: `http://localhost:8000/#/product/${sku}`}}
        />
      ) : null,
    [onMessage],
  );

  const soldOut = useCallback((payload: ApiResult<any>, message: string) => {
    if (payload.result === api.E_RESOURCE_NOT_FOUND) {
      AppAlert.info(i18n.t(message));
    } else {
      AppAlert.info(i18n.t('cart:systemError'));
    }
  }, []);

  const onPressBtnCart = useCallback(async () => {
    const {loggedIn} = account;

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

    action.cart.cartAddAndGet({purchaseItems}).then(({payload: resp}) => {
      console.log('@@@ add and get', resp);
      if (resp.result === 0) {
        utils.adjustEventadd(eventToken.Add_Cart);
        setShowSnackBar({text: i18n.t('country:addCart'), visible: true});
        if (
          resp.objects[0].orderItems.find(
            (v) => v.key === route.params.item?.key,
          ).qty >= PURCHASE_LIMIT
        ) {
          setDisabled(true);
        }
      } else {
        soldOut(resp, 'cart:notToCart');
      }
    });
  }, [
    account,
    action.cart,
    navigation,
    purchaseItems,
    route.params.item,
    soldOut,
    status,
  ]);

  const onPressBtnRegCard = useCallback(() => {
    Analytics.trackEvent('Click_regCard');

    navigation.navigate('Auth');
  }, [navigation]);

  const onPressBtnPurchase = useCallback(() => {
    const {loggedIn, balance} = account;
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
      {renderWebView(route.params?.uuid)}
      {/* useNativeDriver 사용 여부가 아직 추가 되지 않아 warning 발생중 */}
      <AppSnackBar
        visible={showSnackBar.visible}
        onClose={() =>
          setShowSnackBar((pre) => ({text: pre.text, visible: false}))
        }
        textMessage={showSnackBar.text}
        bottom={isDeviceSize('medium') ? 60 : 100}
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
            type="secondary"
          />
          <AppButton
            style={styles.btnBuy}
            title={i18n.t('cart:buy')}
            titleStyle={styles.btnBuyText}
            onPress={onPressBtnPurchase}
            type="primary"
          />
        </View>
      ) : (
        <View style={styles.buttonBox}>
          <AppButton
            style={styles.regCardView}
            title={i18n.t('err:login')}
            titleStyle={styles.regCard}
            onPress={onPressBtnRegCard}
            type="secondary"
          />
        </View>
      )}
      <AppActivityIndicator visible={pending} />
    </SafeAreaView>
  );
};

export default connect(
  ({product, account, status}: RootState) => ({
    product,
    account,
    pending:
      status.pending[productActions.getProdDetailCommon.typePrefix] ||
      status.pending[productActions.getProdDetailInfo.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(ProductDetailScreen);
