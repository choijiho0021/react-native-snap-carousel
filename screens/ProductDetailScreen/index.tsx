/* eslint-disable no-plusplus */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {
  AppState,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import analytics, {firebase} from '@react-native-firebase/analytics';
import Analytics from 'appcenter-analytics';
import {Settings} from 'react-native-fbsdk-next';
import {
  getTrackingStatus,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import {ScrollView} from 'react-native-gesture-handler';
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
import {Currency, DescData} from '@/redux/api/productApi';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import InputNumber from '@/components/InputNumber';
import utils from '@/redux/api/utils';
import AppPrice from '@/components/AppPrice';
import {
  actions as productAction,
  ProductModelState,
} from '@/redux/modules/product';
import ShareLinkModal from './components/ShareLinkModal';
import ChargeInfoModal from './components/ChargeInfoModal';
import TextWithDot from '../EsimScreen/components/TextWithDot';
import TextWithCheck from '../HomeScreen/component/TextWithCheck';
import BackbuttonHandler from '@/components/BackbuttonHandler';
import ProductDetailBody from './components/ProductDetailBody';
import ProductDetailTopInfo from './components/ProductDetailTopInfo';
import ProductDetailSixIcon from './components/ProductDetailSixIcon';
import ProductDetailNotice from './components/ProductDetailNotice';
import ProductDetailCallMethod from './components/ProductDetailCallMethod';
import AppActivityIndicator from '@/components/AppActivityIndicator';

const {esimGlobal, isIOS} = Env.get();
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
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    width: '100%',
    height: 72,
    flexDirection: 'row',
    backgroundColor: '#f7f8fa',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  priceBoxFrame: {
    width: '100%',
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
    ...appStyles.bold18Text,
    lineHeight: 30,
    color: colors.clearBlue,
  },
});

export type ProductDetailScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ProductDetail'
>;

export type ProductDetailScreenRouteProp = RouteProp<
  HomeStackParamList,
  'ProductDetail'
>;

type ProductDetailScreenProps = {
  navigation: ProductDetailScreenNavigationProp;
  route: ProductDetailScreenRouteProp;

  account: AccountModelState;
  cart: CartModelState;
  product: ProductModelState;
  action: {
    cart: CartAction;
    info: InfoAction;
  };
};

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
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
  const [status, setStatus] = useState<TrackingStatus>();
  const purchaseItems = useMemo(
    () => (route.params?.item ? [route.params.item] : []),
    [route.params?.item],
  );

  const prod = useMemo(() => {
    return route.params?.prod || product.prodList.get(route.params?.uuid || '');
  }, [product.prodList, route.params?.prod, route.params?.uuid]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [qty, setQty] = useState(1);
  const appState = useRef('unknown');
  const [price, setPrice] = useState<Currency>();
  const [showChargeInfoModal, setShowChargeInfoModal] = useState(false);
  const dispatch = useDispatch();
  const descData: DescData = useMemo(
    () => product.descData.get(prod?.key || route.params?.uuid),
    [prod?.key, product.descData, route.params?.uuid],
  );

  const isht = useMemo(
    () => route?.params?.partner === 'ht',
    [route?.params?.partner],
  );

  BackbuttonHandler({
    navigation,
    route,
    onBack: () => {
      navigation.goBack();
      return true;
    },
  });

  useEffect(() => {
    if (!product.descData.get(prod?.key || route.params?.uuid)) {
      dispatch(productAction.getProdDesc(prod?.key || route.params?.uuid));
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [dispatch, prod, product.descData, route.params?.uuid]);

  useEffect(() => {
    getTrackingStatus().then((elm) => setStatus(elm));
  }, []);

  useEffect(() => {
    if (purchaseItems) {
      setQty(purchaseItems[0]?.qty);
      setPrice(purchaseItems[0]?.price);
    }
  }, [purchaseItems]);

  const onChangeQty = useCallback(
    (cnt: number, showSnackbar: boolean = true) => {
      if (isht && showSnackbar) {
        setShowSnackBar({text: i18n.t('prodDetail:qtyLimit'), visible: true});
      } else {
        setQty(cnt);
        setPrice({
          value: Math.round(cnt * purchaseItems[0]?.price?.value * 100) / 100,
          currency: purchaseItems[0]?.price?.currency,
        });
      }
    },
    [isht, purchaseItems],
  );

  const resetModalInfo = useCallback(() => {
    onChangeQty(1, false);
  }, [onChangeQty]);

  useEffect(() => {
    // EsimScreen 에서만 getSubs 초기화
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (['inactive', 'background'].includes(nextAppState)) {
        console.log('App has background');
        setShowShareModal(false);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onMessage = useCallback(
    (key: string, value?: string) => {
      switch (key) {
        case 'moveToFaq':
          navigation.navigate('Faq', {
            key: `general.${Platform.OS}`,
            num: '02',
          });
          break;
        case 'copy':
          if (value) {
            Clipboard.setString(value);
            setShowSnackBar({text: i18n.t('prodDetail:copy'), visible: true});
          }

          break;
        case 'apn':
          if (descData?.desc?.apn)
            navigation.navigate('ProductDetailOp', {
              title: route.params?.title,
              apn: descData?.desc?.apn,
            });

          break;
        // 기본적으로 화면 크기 가져오도록 함
        default:
          console.log('@@@ Please check key');
          break;
      }
    },
    [descData?.desc?.apn, navigation, route.params?.title],
  );

  const renderProdDetail = useCallback(() => {
    const isDaily = prod?.field_daily === 'daily';
    const volume =
      Number(prod?.volume) > 500
        ? (Number(prod?.volume) / 1024).toString()
        : prod?.volume || '';
    const volumeUnit = Number(prod?.volume) > 500 ? 'GB' : 'MB';

    const clMtd = descData?.desc?.clMtd;
    const ftr = descData?.desc?.ftr;
    const prodDays = prod?.days;

    const fieldNoticeOption = descData?.fieldNoticeOption || [];
    const fieldCautionList = descData?.fieldCautionList || [];

    return (
      prod &&
      descData && (
        <View>
          <ProductDetailTopInfo
            isDaily={isDaily}
            volume={volume}
            volumeUnit={volumeUnit}
            desc1={descData?.desc?.desc1 || ''}
            desc2={descData?.desc?.desc2 || ''}
            prodName={prod?.name || ''}
            prodDays={prodDays || ''}
          />
          <ProductDetailSixIcon
            isDaily={isDaily}
            volume={volume}
            volumeUnit={volumeUnit}
            ftr={ftr || ''}
            prodDays={prodDays || ''}
            fup={prod?.fup || ''}
            network={prod?.network || ''}
            hotspot={prod?.hotspot || ''}
            addonOption={descData.addonOption || ''}
            setShowChargeInfoModal={setShowChargeInfoModal}
          />
          {(fieldNoticeOption.length > 0 || fieldCautionList.length > 0) && (
            <ProductDetailNotice
              fieldNoticeOption={fieldNoticeOption}
              fieldCautionList={fieldCautionList}
            />
          )}
          {clMtd &&
            ['ustotal', 'usdaily', 'ais', 'dtac', 'mvtotal'].includes(clMtd) &&
            ftr && <ProductDetailCallMethod clMtd={clMtd} ftr={ftr} />}
        </View>
      )
    );
  }, [descData, prod]);

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

    const cartNumber =
      cart.cartItems.find((elm) => elm.key === purchaseItems[0].key)?.qty || 0;

    resetModalInfo();
    setShowModal(false);

    if (!isButtonDisabled) {
      const isOverCart = cartNumber + qty > PURCHASE_LIMIT;

      // 10개 초과 시 카트에 10개 담는 추가 요청사항
      const item = isOverCart
        ? {...purchaseItems[0], qty: PURCHASE_LIMIT - cartNumber}
        : {...purchaseItems[0], qty};

      // qty 0 인 경우도 1개 담게 되어 있어서 예외처리 추가
      if (isOverCart && PURCHASE_LIMIT - cartNumber === 0) {
        setShowSnackBar({
          text: i18n.t('country:overInCart'),
          visible: true,
        });
      } else {
        action.cart
          .cartAddAndGet({
            // purchaseItems: {...purchaseItems, qty: qty.get(purchaseItems[0].key)},
            // purchaseItems: {...purchaseItems},
            purchaseItems: [item],
          })
          .then(({payload: resp}) => {
            if (resp.result === 0) {
              if (isOverCart) {
                setShowSnackBar({
                  text: i18n.t('country:overInCart'),
                  visible: true,
                });
              } else
                setShowSnackBar({
                  text: i18n.t('country:addCart'),
                  visible: true,
                });
            } else {
              soldOut(resp, 'cart:notToCart');
            }
          });
      }
    }
    return setTimeout(() => {
      setIsButtonDisabled(false);
    }, 3000);
  }, [
    account,
    action.cart,
    cart.cartItems,
    isButtonDisabled,
    navigation,
    purchaseItems,
    qty,
    resetModalInfo,
    soldOut,
    status,
  ]);

  const onPressBtnPurchase = useCallback(() => {
    Analytics.trackEvent('Click_purchase');
    setShowModal(false);

    if (!account.loggedIn) {
      navigation.navigate('RegisterMobile', {
        goBack: () => navigation.goBack(),
      });
    }

    const item: PurchaseItem = {...purchaseItems[0], qty};

    // 구매 품목을 갱신한다.
    return action.cart
      .checkStockAndPurchase({purchaseItems: [item], isCart: false})
      .then(({payload: resp}) => {
        resetModalInfo();
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
  }, [
    account.loggedIn,
    action.cart,
    navigation,
    purchaseItems,
    qty,
    resetModalInfo,
    soldOut,
  ]);

  const onPressBtnRegCard = useCallback(() => {
    setShowModal(false);
    resetModalInfo();
    Analytics.trackEvent('Click_regCard');

    navigation.navigate('RegisterMobile', {goBack: () => navigation.goBack()});
  }, [navigation, resetModalInfo]);

  const purchaseButtonTab = useCallback(() => {
    if (showModal) return <></>;

    return (
      <View style={styles.buttonBox}>
        <Pressable
          onPress={() => {
            setShowShareModal(true);
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
  }, [showModal]);

  const purchaseNumberTab = useCallback(() => {
    return (
      <View style={styles.bottomButtonContainer}>
        <View style={styles.bottomButtonFrame}>
          {!isht && (
            <AppButton
              style={[styles.secondaryButton, {marginRight: 12}]}
              title={i18n.t('cart:saveCart')}
              onPress={!account.loggedIn ? onPressBtnRegCard : onPressBtnCart}
              titleStyle={[appStyles.medium18, {color: colors.black}]}
            />
          )}
          <AppButton
            style={styles.mainButton}
            title={i18n.t('cart:purchaseNow')}
            onPress={!account.loggedIn ? onPressBtnRegCard : onPressBtnPurchase}
            titleStyle={appStyles.medium18}
          />
        </View>
      </View>
    );
  }, [
    isht,
    account.loggedIn,
    onPressBtnRegCard,
    onPressBtnCart,
    onPressBtnPurchase,
  ]);

  return (
    <SafeAreaView style={styles.screen}>
      <AppActivityIndicator visible={loading} />
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

      <ScrollView style={{flex: 1}}>
        {renderProdDetail()}
        {descData?.body && (
          <ProductDetailBody
            body={descData?.body}
            onMessage={onMessage}
            descApn={descData?.desc?.apn || ''}
            prodName={prod?.name || ''}
            isDaily={prod?.field_daily === 'daily'}
          />
        )}
      </ScrollView>

      {/* useNativeDriver 사용 여부가 아직 추가 되지 않아 warning 발생중 */}
      {purchaseButtonTab()}

      {showModal && (
        <Modal
          transparent
          animationType="fade"
          visible={showModal}
          onRequestClose={() => setShowModal(false)}>
          <Pressable
            onPress={() => {
              resetModalInfo();
              setShowModal(false);
            }}
            style={{flex: 1}}>
            <View style={styles.modalContainer}>
              <Pressable style={{backgroundColor: colors.white}}>
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
                        fontStyle={appStyles.bold16Text}
                        boxStyle={{width: 60}}
                        boldIcon
                        onChange={(value) => onChangeQty(value)}
                        disabled={isht}
                      />
                    </View>
                  </View>
                  <View style={styles.priceBoxFrame}>
                    <AppText style={styles.priceText}>
                      {i18n.t('cart:proudctTotalPrice')}
                    </AppText>
                    <AppPrice
                      price={utils.toCurrency(
                        price?.value || 0,
                        price?.currency,
                      )}
                      balanceStyle={styles.priceValueText}
                      currencyStyle={styles.priceValueText}
                      // style={styles.priceValueText}
                    />

                    {/* <AppText
                    style={
                      styles.priceValueText
                      // eslint-disable-next-line react-native/no-raw-text
                    }>
                      {`${price?.value} ${i18n.t(price?.currency)}`}
                      </AppText> */}
                  </View>
                </View>
                {purchaseNumberTab()}
              </Pressable>
            </View>
          </Pressable>
          <AppSnackBar
            visible={showSnackBar.visible}
            onClose={() =>
              setShowSnackBar((pre) => ({text: pre.text, visible: false}))
            }
            textMessage={showSnackBar.text}
            bottom={86}
          />
          <SafeAreaView style={{backgroundColor: 'white'}} />
        </Modal>
      )}
      <ChargeInfoModal
        visible={showChargeInfoModal}
        onClose={() => {
          setShowChargeInfoModal(false);
        }}
      />

      <ShareLinkModal
        visible={showShareModal}
        onClose={() => {
          setShowShareModal(false);
        }}
        purchaseItem={purchaseItems[0]}
        params={{
          partnerId: route?.params?.partnerId,
          uuid: route?.params?.uuid,
          img: route?.params?.img,
          listPrice: route.params?.listPrice,
          price: route.params?.price,
        }}
      />

      <ChatTalk visible bottom={isIOS ? 100 : 70} />
      <AppSnackBar
        visible={showSnackBar.visible}
        onClose={() =>
          setShowSnackBar((pre) => ({text: pre.text, visible: false}))
        }
        textMessage={showSnackBar.text}
        bottom={86}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({product, account, cart}: RootState) => ({
    product,
    account,
    cart,
  }),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(ProductDetailScreen);
