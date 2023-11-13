/* eslint-disable no-plusplus */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useEffect, useCallback} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {Map as ImmutableMap} from 'immutable';
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
import {
  actions as cartActions,
  CartAction,
  CartModelState,
} from '@/redux/modules/cart';
import AppCartButton from '@/components/AppCartButton';
import ChatTalk from '@/components/ChatTalk';
import {API} from '@/redux/api';
import {PromotionModelState} from '@/redux/modules/promotion';
import {Currency, RkbProdByCountry} from '@/redux/api/productApi';
import AppIcon from '@/components/AppIcon';
import {MAX_WIDTH} from '@/constants/SliderEntry.style';
import AppText from '@/components/AppText';
import InputNumber from '@/components/InputNumber';
import Share from 'react-native-share';

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
  btnBuy: {
    flex: 1,
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
  shareIconBox: {
    width: 68,
    height: 52,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.lightGrey,
  },
  bottomButtonContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomButtonFrame: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  secondaryButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  mainButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
    borderStyle: 'solid',
  },
  modalContainer: {
    marginHorizontal: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: 'white',
    maxWidth: MAX_WIDTH, // MAX WIDTH는 왜 있는거지?
    width: '100%',
  },
  modalFrame: {
    marginHorizontal: 20,
  },
  headerFrame: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    paddingTop: 10,
    marginBottom: 10,
  },
  countBoxFrame: {
    width: 335,
    height: 72,
    flexDirection: 'row',
    backgroundColor: '#f7f8fa',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  priceBoxFrame: {
    width: 335,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    marginTop: 16,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  priceText: {
    ...appStyles.normal16Text,
    lineHeight: 30,
  },
  priceValueText: {
    ...appStyles.bold16Text,
    lineHeight: 30,
    color: colors.clearBlue,
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
  promotion: PromotionModelState;
  product: ProductModelState;
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
  promotion,
  product,
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
  const [showButton, setShowButton] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState<Currency>();

  useEffect(() => {
    setPurchaseItems(route.params.item ? [route.params.item] : []);
    getTrackingStatus().then((elm) => setStatus(elm));
  }, [route.params.item]);

  useEffect(() => {
    if (purchaseItems) {
      setQty(purchaseItems[0]?.qty);

      setPrice(purchaseItems[0]?.price);
    }
  }, [purchaseItems]);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const [key, value] = event.nativeEvent.data.split(',');
      const k = route.params.item?.key;

      switch (key) {
        case 'showButton':
          setShowButton(true);
          break;
        case 'hideButton':
          setShowButton(false);
          setShowModal(false);
          break;

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
          if (k)
            API.Product.getProductDesc(k).then((desc) => {
              navigation.navigate('ProductDetailOp', {
                title: route.params?.title,
                ...desc.objects,
              });
            });
          break;
        // 기본적으로 화면 크기 가져오도록 함
        default:
          console.log('@@@ Please check key');
          break;
      }
    },
    [action.info, navigation, route.params.item?.key, route.params?.title],
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
      // 이미 카트에 있는 경우엔 어떻게 해야할까?
      setShowSnackBar({text: i18n.t('country:existInCart'), visible: true});
    } else if (!isButtonDisabled) {
      console.log('qty  :', qty);

      const item = {...purchaseItems[0], qty};

      action.cart
        .cartAddAndGet({
          // purchaseItems: {...purchaseItems, qty: qty.get(purchaseItems[0].key)},
          // purchaseItems: {...purchaseItems},
          purchaseItems: [item],
        })
        .then(({payload: resp}) => {
          console.log('stock check는 한건가??  : ', resp);

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
    qty,
    route.params.item?.key,
    soldOut,
    status,
  ]);

  const onPressBtnPurchase = useCallback(() => {
    const {loggedIn, balance} = account;
    Analytics.trackEvent('Click_purchase');
    setShowModal(false);

    if (!loggedIn) {
      navigation.navigate('RegisterMobile', {
        goBack: () => navigation.goBack(),
      });
    }

    const item: PurchaseItem = {...purchaseItems[0], qty};

    // 구매 품목을 갱신한다.
    return action.cart
      .checkStockAndPurchase({
        purchaseItems: [item],
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
  }, [account, action.cart, navigation, purchaseItems, qty, soldOut]);

  const onPressBtnRegCard = useCallback(() => {
    Analytics.trackEvent('Click_regCard');

    navigation.navigate('RegisterMobile', {goBack: () => navigation.goBack()});
  }, [navigation]);

  useEffect(() => {
    console.log('price : ', price);
  }, [price]);

  const onChangeQty = useCallback(
    (key: string, orderItemId: number, cnt: number) => {
      setQty(cnt);
      setPrice({
        value: Math.round(cnt * purchaseItems[0].price?.value * 100) / 100,
        currency: purchaseItems[0].price?.currency,
      });
    },
    [purchaseItems],
  );

  const onShare = useCallback(async (link) => {
    await Share.open({
      title: i18n.t('rcpt:title'),
      url: link,
    });
  }, []);

  const purchaseButtonTab = useCallback(() => {
    if (!showButton || showModal) return <></>;

    return (
      <View style={styles.buttonBox}>
        <Pressable
          onPress={() => {
            const selectedCountryData: RkbProdByCountry =
              product.prodByCountry.find(
                (r) => r.partner === route?.params?.partnerId,
              );
            const {invite} = promotion;

            API.Promotion.buildShareLink({
              uuid: route.params?.uuid,
              prodName: purchaseItems[0]?.title,
              imageUrl: invite?.rule?.share, // ? rule은 뭐지
              promoFlag: purchaseItems[0]?.promoFlag,
              country: selectedCountryData,
              isShort: true,
            }).then((url) => {
              if (url) {
                setShowSnackBar({
                  text: i18n.t('prodDetail:copy:product'),
                  visible: true,
                });
                // Clipboard.setString(url);
                onShare(url);
              }
            });
          }}>
          <AppIcon name="iconShare2" style={styles.shareIconBox} />
        </Pressable>
        <AppButton
          style={styles.btnBuy}
          title={i18n.t('cart:buy')}
          titleStyle={styles.btnBuyText}
          onPress={() => {
            setShowModal(true);
          }}
          // onPress={onPressBtnPurchase}
          type="primary"
        />
      </View>
    );
  }, [
    onShare,
    product.prodByCountry,
    promotion,
    purchaseItems,
    route.params?.partnerId,
    route.params?.uuid,
    showButton,
    showModal,
  ]);

  const purchaseNumberTab = useCallback(() => {
    if (!showButton) return <></>;

    return (
      <View style={styles.bottomButtonContainer}>
        <View style={styles.bottomButtonFrame}>
          <AppButton
            style={[styles.secondaryButton, {marginRight: 12}]}
            title={i18n.t('cart:saveCart')}
            onPress={onPressBtnCart}
            titleStyle={[appStyles.medium18, {color: colors.black}]}
          />
          <AppButton
            style={styles.mainButton}
            title={i18n.t('cart:purchaseNow')}
            onPress={onPressBtnPurchase}
            titleStyle={appStyles.medium18}
          />
        </View>
      </View>
    );
  }, [showButton, onPressBtnCart, onPressBtnPurchase]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <AppBackButton
          title={route.params?.title}
          style={{width: '70%', height: 56}}
        />
        {account.loggedIn && (
          <AppCartButton
            onPress={() => navigation.navigate('Cart', {showHeader: true})}
            iconName="btnHeaderCart"
          />
        )}
      </View>

      {renderWebView(route.params?.uuid)}
      {/* useNativeDriver 사용 여부가 아직 추가 되지 않아 warning 발생중 */}

      {account.loggedIn ? (
        purchaseButtonTab()
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

      {showModal && (
        <View justifyContent="flex-end" contentStyle={styles.modalContainer}>
          <View style={styles.modalFrame}>
            <Pressable
              onPress={() => {
                setShowModal(false);
              }}>
              <View style={styles.headerFrame}>
                <Image
                  style={{width: 46, height: 10}}
                  source={require('@/assets/images/esim/grabber.png')}
                  resizeMode="stretch"
                />
              </View>
            </Pressable>
            <View style={styles.countBoxFrame}>
              <AppText style={appStyles.medium16}>
                {i18n.t('cart:count')}
              </AppText>
              <View>
                <InputNumber
                  value={qty}
                  onChange={(value) =>
                    onChangeQty(
                      purchaseItems[0]?.key,
                      purchaseItems[0]?.orderItemId,
                      value,
                    )
                  }
                />
              </View>
            </View>
            <View style={styles.priceBoxFrame}>
              <AppText style={styles.priceText}>
                {i18n.t('cart:proudctTotalPrice')}
              </AppText>
              <AppText
                style={
                  styles.priceValueText
                  // eslint-disable-next-line react-native/no-raw-text
                }>{`${price?.value} ${price?.currency}`}</AppText>
            </View>
          </View>
          {purchaseNumberTab()}
        </View>
      )}
      <ChatTalk visible bottom={isIOS ? 100 : 70} />
      <AppSnackBar
        visible={showSnackBar.visible}
        onClose={() =>
          setShowSnackBar((pre) => ({text: pre.text, visible: false}))
        }
        textMessage={showSnackBar.text}
        bottom={showModal ? 86 : 10}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({account, cart, promotion, product}: RootState) => ({
    account,
    cart,
    promotion,
    product,
  }),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(ProductDetailScreen);
