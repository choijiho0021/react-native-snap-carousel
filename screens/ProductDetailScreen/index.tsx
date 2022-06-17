/* eslint-disable no-plusplus */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useEffect, useCallback} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {
  PixelRatio,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
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
import {appStyles, htmlDetailWithCss} from '@/constants/Styles';
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
import {
  actions as toastActions,
  Toast,
  ToastAction,
} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import AppSnackBar from '@/components/AppSnackBar';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {API} from '@/redux/api';
import api, {ApiResult} from '@/redux/api/api';
import {PurchaseItem} from '../redux/models/purchaseItem';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import AppCartButton from '@/components/AppCartButton';

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
  account: AccountModelState;

  action: {
    toast: ToastAction;
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
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState<TrackingStatus>();
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);

  const [webViewHeight, setWebViewHeight] = useState<number>(500);

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

    const item = API.Product.toPurchaseItem(route.params.item);
    setPurchaseItems(item ? [item] : []);
    getTrackingStatus().then((elm) => setStatus(elm));
  }, [action.product, navigation, product, route, route.params?.partnerId]);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const {
        key,
        value,
        screen,
        params,
      }: {key: string; value: string; screen: string; params: object} =
        JSON.parse(event.nativeEvent.data);

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
          action.toast.push(Toast.COPY_SUCCESS);
          break;
        case 'navigate':
          navigation.navigate(screen, params);
          break;
        case 'apn':
          navigation.navigate('ProductDetailOp', {
            title: route.params?.title,
            ...route.params.item?.desc,
          });
          break;
        // 기본적으로 화면 크기 가져오도록 함
        default:
          setWebViewHeight(event.nativeEvent.data / PixelRatio.get());
          break;
      }
    },
    [
      action.info,
      action.toast,
      navigation,
      route.params.item?.body,
      route.params?.title,
    ],
  );

  const renderWebView = useCallback(() => {
    const {category} = API.Product;

    const localOpDetails = route.params?.localOpDetails;
    // const detail = _.isEmpty(localOpDetails)
    //   ? product.detailInfo + product.detailCommon
    //   : localOpDetails + product.detailCommon;

    const isMulti = route.params.item?.categoryId[0] === category.multi ? 2 : 1;

    return (
      <View style={{flex: 1}}>
        <WebView
          // automaticallyAdjustContentInsets={true}
          javaScriptEnabled
          domStorageEnabled
          // scalesPageToFit
          startInLoadingState
          decelerationRate="normal"
          // onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}
          scrollEnabled
          onMessage={onMessage}
          source={{uri: `http://146.56.139.208/#/product/desc/${isMulti}`}}
          // source={{uri: 'http://localhost:8000/#/product/desc/2'}}
          // source={{html: detail}}
          style={{height: webViewHeight}}
        />
      </View>
    );
  }, [
    onMessage,
    route.params.item?.categoryId,
    route.params?.localOpDetails,
    webViewHeight,
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
  }, [account, action.cart, navigation, purchaseItems, soldOut, status]);

  const onPressBtnRegCard = useCallback(() => {
    Analytics.trackEvent('Click_regCard');

    if (!account.loggedIn) navigation.navigate('Auth');
    else navigation.navigate('RegisterSim');
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
      <View style={{backgroundColor: colors.whiteTwo, flex: 1}}>
        {renderWebView()}
      </View>
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
      toast: bindActionCreators(toastActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(ProductDetailScreen);
