/* eslint-disable no-plusplus */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useEffect, useCallback} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import analytics, {firebase} from '@react-native-firebase/analytics';
import Analytics from 'appcenter-analytics';
import {Settings} from 'react-native-fbsdk-next';
import {
  getTrackingStatus,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {actions as infoActions, InfoAction} from '@/redux/modules/info';
import {AccountModelState} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import AppSnackBar from '@/components/AppSnackBar';
import AppButton from '@/components/AppButton';
import api, {ApiResult} from '@/redux/api/api';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import AppCartButton from '@/components/AppCartButton';
import ChatTalk from '@/components/ChatTalk';
import {CartModelState} from '../../redux/modules/cart';

const {esimGlobal, webViewHost, isIOS} = Env.get();
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
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
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

  account: AccountModelState;
  cart: CartModelState;
  action: {
    cart: CartAction;
    info: InfoAction;
  };
};

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
  action,
  account,
  cart,
}) => {
  const [showSnackBar, setShowSnackBar] = useState<{
    text: string;
    visible: boolean;
  }>({text: '', visible: false});
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState<TrackingStatus>();
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    setPurchaseItems(route.params.item ? [route.params.item] : []);
    getTrackingStatus().then((elm) => setStatus(elm));
  }, [route.params.item]);

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
              key: `${moveTo[0]}.${Platform.OS}`,
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
    (uuid?: string) => {
      if (!uuid) return null;

      const uri = `${webViewHost}/product/${uuid}`;

      return (
        <WebView
          // automaticallyAdjustContentInsets={true}
          javaScriptEnabled
          domStorageEnabled
          // scalesPageToFit
          startInLoadingState
          decelerationRate="normal"
          scrollEnabled
          onMessage={onMessage}
          source={{uri}}
        />
      );
    },
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
    setIsButtonDisabled(true);

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

    const existInCart = cart.orderItems
      ?.map((elm) => elm.key)
      .includes(purchaseItems[0].key);

    if (existInCart) {
      setShowSnackBar({text: i18n.t('country:existInCart'), visible: true});
    } else if (!isButtonDisabled) {
      action.cart.cartAddAndGet({purchaseItems}).then(({payload: resp}) => {
        if (resp.result === 0) {
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
    }
    return setTimeout(() => {
      setIsButtonDisabled(false);
    }, 3000);
  }, [
    account,
    action.cart,
    cart.orderItems,
    isButtonDisabled,
    navigation,
    purchaseItems,
    route.params.item?.key,
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
  }, [account, action.cart, navigation, purchaseItems, soldOut]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <AppBackButton
          title={route.params?.title}
          style={{width: '70%', height: 56}}
        />
        {account.loggedIn && (
          <AppCartButton
            onPress={() => navigation.navigate('Cart')}
            iconName="btnHeaderCart"
          />
        )}
      </View>

      {renderWebView(route.params?.uuid)}
      {/* useNativeDriver 사용 여부가 아직 추가 되지 않아 warning 발생중 */}
      <AppSnackBar
        visible={showSnackBar.visible}
        onClose={() =>
          setShowSnackBar((pre) => ({text: pre.text, visible: false}))
        }
        textMessage={showSnackBar.text}
        bottom={10}
      />
      {account.loggedIn ? (
        <View style={styles.buttonBox}>
          <AppButton
            style={styles.btnCart}
            title={i18n.t('cart:toCart')}
            titleStyle={styles.btnCartText}
            disabled={disabled}
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
      <ChatTalk visible bottom={isIOS ? 100 : 70} />
    </SafeAreaView>
  );
};

export default connect(
  ({account, cart}: RootState) => ({account, cart}),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(ProductDetailScreen);
