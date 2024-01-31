/* eslint-disable no-plusplus */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {
  AppState,
  Image,
  ImageBackground,
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
import BeautifulSoup from 'beautiful-soup-js';
import {SoupElement} from 'beautiful-soup-js/build/es/main/SoupElement';
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
import AppStyledText from '@/components/AppStyledText';
import ChargeInfoModal from './components/ChargeInfoModal';
import TextWithDot from '../EsimScreen/components/TextWithDot';
import TextWithCheck from '../HomeScreen/component/TextWithCheck';
import BackbuttonHandler from '@/components/BackbuttonHandler';
import AppCopyBtn from '@/components/AppCopyBtn';

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
  bg: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 288,
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  titleTop: {
    display: 'flex',
    gap: 8,
  },
  prodTitle: {
    ...appStyles.semiBold24Text,
    lineHeight: 42,
    color: colors.white,
  },
  prodTitleBold: {
    ...appStyles.bold32Text,
    lineHeight: 42,
    color: colors.white,
  },
  prodBody: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    color: colors.white,
  },
  locaTag: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.white,
    marginBottom: 4,
  },
  bottomText: {
    ...appStyles.normal16Text,
    color: colors.white,
    lineHeight: 24,
  },
  iconBox: {
    backgroundColor: colors.paleBlue2,
    paddingTop: 48,
    paddingBottom: 10,
    paddingHorizontal: 20,
    gap: 32,
  },
  iconBoxLine: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  iconWithText: {
    width: 110,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  iconText: {
    ...appStyles.semiBold14Text,
    lineHeight: 18,
    textAlign: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chargeBoxFrame: {
    height: 48,
    width: 79,
  },
  chargeBox: {
    borderWidth: 1,
    borderColor: colors.veryLightBlue,
    borderRadius: 3,
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  chargeBoxText: {
    ...appStyles.bold12Text,
    lineHeight: 16,
    color: colors.black,
  },
  noticeBox: {
    paddingVertical: 17,
    paddingHorizontal: 20,
    backgroundColor: colors.darkNavy,
  },
  noticeHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  noticeHeaderText: {
    ...appStyles.normal16Text,
    lineHeight: 20,
    color: colors.white,
  },
  dot: {
    ...appStyles.bold14Text,
    marginHorizontal: 5,
    lineHeight: 20,
    color: colors.white,
  },
  dotBlack: {
    ...appStyles.bold14Text,
    marginHorizontal: 5,
    lineHeight: 18,
    color: colors.black,
  },
  noticeTextBlackWithDot: {
    ...appStyles.normal14Text,
    lineHeight: 18,
    color: colors.warmGrey,
  },
  noticeTextBlack: {
    ...appStyles.normal14Text,
    lineHeight: 18,
    color: colors.warmGrey,
  },
  noticeTextBlackBold: {
    ...appStyles.semiBold14Text,
    lineHeight: 18,
    color: colors.black,
  },
  noticeTextBlueBold: {
    ...appStyles.semiBold14Text,
    lineHeight: 18,
    color: colors.clearBlue,
  },
  noticeText: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    color: colors.white,
  },
  noticeTextBold: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.white,
  },
  callMethod: {
    paddingHorizontal: 20,
    paddingTop: 42,
  },
  callMethodTitle: {
    ...appStyles.medium20,
    lineHeight: 22,
    color: colors.black,
    marginBottom: 16,
  },
  callMethodBox: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    backgroundColor: colors.white,
    borderRadius: 3,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  callMethodBoxTop: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: colors.whiteFive,
    display: 'flex',
    flexDirection: 'row',
  },
  callMethodContents: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginTop: 8,
    paddingVertical: 12,
  },
  callMethodBoxBottom: {
    paddingTop: 9,
    paddingBottom: 6,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  featureWithText: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    width: '50%',
  },
  featureText: {
    ...appStyles.semiBold18Text,
    lineHeight: 22,
    color: colors.black,
  },
  callMethodBoxBold: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    color: colors.black,
  },
  callMethodBoxText: {
    ...appStyles.normal16Text,
    lineHeight: 24,
    color: colors.black,
  },
  showDetail: {
    ...appStyles.bold14Text,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: colors.warmGrey,
  },
  ustotalDetailBox: {
    marginLeft: 24,
  },
  countryBox: {
    padding: 8,
    backgroundColor: colors.backGrey,
    borderRadius: 3,
    marginVertical: 2,
  },
  countryBoxText: {
    ...appStyles.semiBold14Text,
    lineHeight: 22,
    color: colors.black,
  },
  countryBoxNotice: {
    ...appStyles.semiBold14Text,
    lineHeight: 22,
    color: colors.warmGrey,
  },
  bodyTop: {
    paddingVertical: 56,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  bodyTopTitle: {
    ...appStyles.medium20,
    lineHeight: 22,
    color: colors.black,
  },
  bodyTopBox: {
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 3,
    padding: 20,
    marginVertical: 16,
  },
  bodyTopBoxCountry: {
    ...appStyles.semiBold16Text,
    lineHeight: 22,
    color: colors.black,
    marginBottom: 4,
  },
  bodyTopBoxTel: {
    ...appStyles.semiBold16Text,
    lineHeight: 22,
    color: colors.clearBlue,
  },
  multiApn: {
    paddingVertical: 9,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apnButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  apnButtonText: {
    ...appStyles.medium14,
    letterSpacing: 0.23,
    color: colors.clearBlue,
  },
  tplInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  apnSetBox: {
    marginTop: 40,
    marginBottom: 16,
  },
  apnSetBoxTop: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    paddingVertical: 14,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  apnCopy: {
    padding: 20,
    backgroundColor: colors.whiteTwo,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    borderRightColor: colors.lightGrey,
    borderLeftColor: colors.lightGrey,
    display: 'flex',
    flexDirection: 'row',
  },
  apn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  apnBoxTitle: {
    ...appStyles.normal18Text,
    lineHeight: 22,
    color: colors.white,
  },
  apnInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
  underline: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    paddingBottom: 1,
  },
  apnPrefix: {
    ...appStyles.normal16Text,
    lineHeight: 24,
    color: colors.warmGrey,
    paddingBottom: 1,
  },
  apnInfoText: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.black,
  },
  goToApnText: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    color: colors.black,
  },
  bodyBottom: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 20,
    backgroundColor: colors.whiteTwo,
  },
  bodyNoticeContents: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 26,
  },
  noticeTitle: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.black,
    marginBottom: 2,
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
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState<TrackingStatus>();
  const purchaseItems = useMemo(
    () => (route.params?.item ? [route.params.item] : []),
    [route.params?.item],
  );

  const prod = useMemo(() => {
    return route.params?.prod || product.prodList.get(route.params?.uuid || '');
  }, [product.prodList, route.params?.prod, route.params?.uuid]);
  const noFup = useMemo(
    () => prod?.fup === 'N/A' || prod?.fup === '0',
    [prod?.fup],
  );

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [qty, setQty] = useState(1);
  const appState = useRef('unknown');
  const [price, setPrice] = useState<Currency>();
  const [showChargeInfoModal, setShowChargeInfoModal] = useState(false);
  const [showCallDetail, setShowCallDetail] = useState(false);
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
    if (!product.descData.get(prod?.key || route.params?.uuid))
      dispatch(productAction.getProdDesc(prod?.key || route.params?.uuid));
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

  const renderTopInfo = useCallback(
    (isDaily: boolean, volume: string, volumeUnit: string) => (
      <ImageBackground
        source={
          isDaily
            ? require('@/assets/images/esim/img_bg_1.png')
            : require('@/assets/images/esim/img_bg_2.png')
        }
        style={styles.bg}>
        <View style={styles.titleTop}>
          <AppStyledText
            text={i18n.t(`prodDetail:title:${isDaily ? 'daily' : 'total'}`)}
            textStyle={styles.prodTitle}
            format={{b: styles.prodTitleBold}}
            data={{
              data: isDaily ? prod?.days?.toString() || '' : volume || '',
              unit: volumeUnit,
            }}
          />

          <AppText style={styles.prodBody}>{descData?.desc?.desc1}</AppText>
        </View>
        <View>
          <AppText style={styles.locaTag}>
            {i18n.t(
              `prodDetail:${
                ['로컬', 'local'].find((i) => prod?.name.includes(i))
                  ? 'local'
                  : 'roaming'
              }`,
            )}
          </AppText>
          <AppText style={styles.bottomText}>
            {descData?.desc?.desc2?.replace(/&amp;/g, '&')}
          </AppText>
        </View>
      </ImageBackground>
    ),
    [descData, prod],
  );

  const renderIconWithText = useCallback(
    (icon: string, text: string) => (
      <View style={styles.iconWithText} key={`${icon}${text}`}>
        <AppIcon name={icon} />
        <AppText style={styles.iconText}>{text}</AppText>
      </View>
    ),
    [],
  );

  const renderChargeDetail = useCallback(
    (icon: string, text: string) => (
      <View style={styles.row} key={`${icon}${text}`}>
        <AppText style={styles.chargeBoxText}>{text}</AppText>
        <AppIcon name={icon} />
      </View>
    ),
    [],
  );

  const renderChargeIcon = useCallback(() => {
    const isChargeOff = descData?.addonOption === 'N' || !descData?.addonOption;
    return (
      <Pressable
        style={styles.iconWithText}
        onPress={() => setShowChargeInfoModal((prev) => !prev)}>
        <AppIcon name={isChargeOff ? 'iconChargeOff' : 'iconCharge'} />
        <View style={styles.row}>
          <AppText style={styles.iconText}>
            {i18n.t(`prodDetail:icon:charge${isChargeOff ? 'Off' : ''}`)}
          </AppText>
          <AppIcon name="iconChargeInfo" />
        </View>
        <View style={styles.chargeBoxFrame}>
          {!isChargeOff && (
            <View style={styles.chargeBox}>
              {[
                {
                  icon: descData?.addonOption === 'E' ? 'iconX' : 'iconOk',
                  text: i18n.t('prodDetail:icon:charge:addOn'),
                },
                {
                  icon: descData?.addonOption === 'A' ? 'iconX' : 'iconOk',
                  text: i18n.t('prodDetail:icon:charge:extension'),
                },
              ].map((i) => renderChargeDetail(i.icon, i.text))}
            </View>
          )}
        </View>
      </Pressable>
    );
  }, [descData?.addonOption, renderChargeDetail]);

  const renderSixIcon = useCallback(
    (isDaily: boolean, volume: string, volumeUnit: string) => {
      const feature = descData?.desc?.ftr?.toUpperCase() || 'Only';

      return (
        <View style={styles.iconBox}>
          <View style={styles.iconBoxLine}>
            {[
              {
                icon: `iconData${feature}`,
                text: i18n.t(`prodDetail:icon:data${feature}`),
              },
              {
                icon: 'iconClock',
                text: i18n.t('prodDetail:icon:clock', {
                  days: prod?.days,
                }),
              },
              {
                icon:
                  prod?.network === '5G/LTE/3G'
                    ? 'icon5G'
                    : prod?.network === '3G'
                    ? 'icon3G'
                    : 'iconLTE',
                text: prod?.network || '',
              },
            ].map((i) => renderIconWithText(i?.icon, i?.text))}
          </View>
          <View style={styles.iconBoxLine}>
            {[
              {
                icon: noFup
                  ? volume === '1000'
                    ? 'iconAllday'
                    : 'iconTimer'
                  : 'iconSpeed',
                text: i18n.t(
                  `prodDetail:icon:${
                    noFup ? (volume === '1000' ? 'allday' : 'timer') : 'speed'
                  }${
                    noFup && volume === '1000'
                      ? ''
                      : isDaily
                      ? ':daily'
                      : ':total'
                  }`,
                  {
                    data: `${volume}${volumeUnit}`,
                  },
                ),
              },
              {
                icon: prod?.hotspot ? 'iconWifi' : 'iconWifiOff',
                text: i18n.t(
                  `prodDetail:icon:${prod?.hotspot ? 'wifi' : 'wifiOff'}`,
                ),
              },
            ].map((i) => renderIconWithText(i.icon, i.text))}
            {descData?.addonOption && renderChargeIcon()}
          </View>
        </View>
      );
    },
    [descData, noFup, prod, renderChargeIcon, renderIconWithText],
  );

  const renderNoticeOption = useCallback(
    (noticeOption: string) => (
      <TextWithDot
        key={noticeOption}
        dotStyle={styles.dot}
        textStyle={styles.noticeText}
        boldStyle={styles.noticeTextBold}
        text={i18n.t(`prodDetail:noticeOption:${noticeOption}`)}
        marginRight={20}
      />
    ),
    [],
  );

  const renderCautionList = useCallback((caution: string) => {
    const cautionText = caution.substring(
      caution.startsWith('ios:') ? 4 : caution.startsWith('android:') ? 8 : 0,
    );
    return (
      <TextWithDot
        key={caution}
        dotStyle={styles.dot}
        textStyle={styles.noticeText}
        boldStyle={styles.noticeTextBold}
        text={cautionText}
        marginRight={20}
      />
    );
  }, []);

  const renderNotice = useCallback(
    (noticeList: string[], cautionList: string[]) => {
      return (
        <View style={styles.noticeBox}>
          <View style={styles.noticeHeader}>
            <AppIcon name="iconNoticeRed24" />
            <AppText style={styles.noticeHeaderText}>
              {i18n.t('prodDetail:Caution')}
            </AppText>
          </View>
          {noticeList.map((i) => renderNoticeOption(i))}
          {cautionList.map((i) => renderCautionList(i))}
        </View>
      );
    },
    [renderCautionList, renderNoticeOption],
  );

  const renderFeature = useCallback((feature: string) => {
    const key = `icon${feature}`;
    return (
      <View style={styles.featureWithText} key={key}>
        {feature === 'M' && <View style={{width: 20}} />}
        <AppIcon name={key} />
        <AppText style={styles.featureText}>
          {i18n.t(`prodDetail:callMethod:box:feature:${feature}`)}
        </AppText>
      </View>
    );
  }, []);

  const renderUsTotalCountryBox = useCallback(
    () => (
      <View style={styles.ustotalDetailBox}>
        <View style={styles.countryBox}>
          <AppText style={styles.countryBoxText}>
            {i18n.t('prodDetail:callMethod:box:detail:ustotal:country')}
          </AppText>
        </View>
        <AppText style={styles.countryBoxNotice}>
          {i18n.t('prodDetail:callMethod:box:detail:ustotal:notice')}
        </AppText>
      </View>
    ),
    [],
  );

  const getDetailList = useCallback((clMtd: string) => {
    switch (clMtd) {
      case 'usdaily':
      case 'mvtotal':
        return [1];
      case 'ustotal':
      case 'ais':
        return [1, 2];
      case 'dtac':
        return [1, 2, 3, 4];
      default:
        return [];
    }
  }, []);

  const renderCallMethod = useCallback(
    (clMtd: string) => {
      const ftrList =
        descData?.desc?.ftr?.toLowerCase() === 'm' ? ['V', 'M'] : ['V'];
      const isUS = clMtd.includes('us');
      const defaultList = ['ustotal', 'mvtotal'].includes(clMtd) ? [1, 2] : [1];
      const detailList = getDetailList(clMtd);

      return (
        <View style={styles.callMethod}>
          <AppText style={styles.callMethodTitle}>
            {i18n.t('prodDetail:callMethod:title')}
          </AppText>
          <View style={styles.callMethodBox}>
            <View style={styles.callMethodBoxTop}>
              {ftrList.map((f) => renderFeature(f))}
            </View>
            <View style={styles.callMethodContents}>
              {defaultList.map((i) => (
                <View key={`default${clMtd}${i}`}>
                  <TextWithCheck
                    text={i18n.t(
                      `prodDetail:callMethod:box:contents:default${i}:${
                        isUS ? 'us' : clMtd
                      }`,
                    )}
                    textStyle={styles.callMethodBoxBold}
                  />
                </View>
              ))}
              {showCallDetail &&
                detailList.length > 0 &&
                detailList.map((i) => (
                  <View key={`detail${clMtd}${i}`}>
                    <TextWithCheck
                      text={i18n.t(
                        `prodDetail:callMethod:box:contents:detail${i}:${clMtd}`,
                      )}
                      textStyle={styles.callMethodBoxText}
                    />
                    {clMtd === 'ustotal' &&
                      i === 1 &&
                      renderUsTotalCountryBox()}
                  </View>
                ))}
            </View>
            <Pressable
              style={styles.callMethodBoxBottom}
              onPress={() => setShowCallDetail((prev) => !prev)}>
              <AppText style={styles.showDetail}>
                {i18n.t(showCallDetail ? 'close' : 'pym:detail')}
              </AppText>
              <AppIcon
                name={showCallDetail ? 'iconArrowUp11' : 'iconArrowDown11'}
              />
            </Pressable>
          </View>
        </View>
      );
    },
    [
      descData?.desc?.ftr,
      getDetailList,
      renderFeature,
      renderUsTotalCountryBox,
      showCallDetail,
    ],
  );

  const renderProdDetail = useCallback(() => {
    const isDaily = prod?.field_daily === 'daily';
    const volume =
      Number(prod?.volume) > 500
        ? (Number(prod?.volume) / 1024).toString()
        : prod?.volume || '';
    const volumeUnit = Number(prod?.volume) > 500 ? 'GB' : 'MB';

    const noticeOption = descData?.fieldNoticeOption || [];
    let noticeOptionList: string[] = [];
    if (typeof noticeOption === 'string') {
      noticeOptionList = noticeOption.replace(' ', '').split(',');
    } else {
      noticeOptionList = noticeOption;
    }

    const drupalList = ['I', 'A', 'K', 'N', 'H'];

    const noticeList: string[] = drupalList.reduce(
      (acc: string[], curr: string) => {
        if (noticeOptionList.includes(curr)) {
          acc.push(curr);
        }
        return acc;
      },
      [],
    );

    const cautionList: string[] =
      descData?.fieldCautionList?.filter((c) =>
        isIOS ? !c.includes('android:') : !c.includes('ios:'),
      ) || [];

    const clMtd = descData?.desc?.clMtd;
    const ftr = descData?.desc?.ftr;
    return (
      prod &&
      descData && (
        <View>
          {renderTopInfo(isDaily, volume, volumeUnit)}
          {renderSixIcon(isDaily, volume, volumeUnit)}
          {(noticeList.length > 0 || cautionList.length > 0) &&
            renderNotice(noticeList, cautionList)}
          {clMtd &&
            ftr &&
            ['ustotal', 'usdaily', 'ais', 'dtac', 'mvtotal'].includes(clMtd) &&
            renderCallMethod(clMtd)}
        </View>
      )
    );
  }, [
    descData,
    prod,
    renderCallMethod,
    renderNotice,
    renderSixIcon,
    renderTopInfo,
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
      cart.orderItems.find((elm) => elm.key === purchaseItems[0].key)?.qty || 0;

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
    resetModalInfo,
    route.params?.item?.key,
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
    account,
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

  const renderTplInfo = useCallback(
    (t: {class: string; tag: string; text: string}, lineHeight?: number) => {
      const regex = /►.*◄/;
      const text = t.text.replace(/\t|&nbsp;/g, '');
      // console.log('@@@@ text', text);
      return (
        <Pressable
          onPress={() => regex.test(text) && onMessage('moveToFaq')}
          key={text}>
          {t.class === 'txt_dot' ? (
            <TextWithDot
              key={text}
              text={text}
              boldStyle={{...styles.noticeTextBlackBold, lineHeight}}
              secondBoldStyle={{...styles.noticeTextBlueBold, lineHeight}}
              textStyle={{...styles.noticeTextBlackWithDot, lineHeight}}
              dotStyle={{...styles.dotBlack, lineHeight}}
              marginRight={20}
            />
          ) : (
            <AppStyledText
              text={text}
              textStyle={{...styles.noticeTextBlack, lineHeight}}
              format={{
                b: {...styles.noticeTextBlackBold, lineHeight},
                s: {...styles.noticeTextBlueBold, lineHeight},
              }}
            />
          )}
        </Pressable>
      );
    },
    [onMessage],
  );

  const renderAPN = useCallback(
    (apn: string) => (
      <View style={styles.apn}>
        <View style={styles.apnInfo}>
          <AppText style={styles.apnPrefix}>
            {i18n.t('prodDetail:body:top:apn')}
          </AppText>
          <View style={styles.underline}>
            <AppText style={styles.apnInfoText}>{apn}</AppText>
          </View>
        </View>
        <AppCopyBtn
          title={i18n.t('copy')}
          onPress={() => onMessage('copy', apn)}
        />
      </View>
    ),
    [onMessage],
  );

  const attachBTag = useCallback((el: SoupElement, orgText: string) => {
    const boldList = el?.contents
      ?.reduce((acc: {text: string; tag: string}[], cur) => {
        const text = cur?.getText();
        if (text !== '') {
          acc?.push({text, tag: cur?.name});
        }
        return acc;
      }, [])
      ?.filter((b) => b.text !== '.');

    return boldList && boldList?.length > 0
      ? boldList?.reduce((acc, cur) => {
          const regex = new RegExp(`(${cur?.text})`, 'g');
          return cur?.tag === 'a'
            ? acc?.replace(regex, '<s>$1</s>')
            : acc?.replace(regex, '<b>$1</b>');
        }, orgText)
      : orgText;
  }, []);

  const renderBodyTop = useCallback(
    (soup: BeautifulSoup) => {
      const tplInfoTags = soup?.find({attrs: {class: 'tpl_info'}});
      const tplList =
        tplInfoTags?.contents.length > 1
          ? tplInfoTags?.contents.map((c) => ({
              class: c?.attrs?.class,
              tag: c?.name,
              text: attachBTag(c, c.getText()),
            }))
          : [
              {
                class: tplInfoTags?.contents[0]?.attrs?.class,
                tag: tplInfoTags?.name,
                text: attachBTag(
                  tplInfoTags?.contents[0],
                  tplInfoTags?.getText(),
                ),
              },
            ];

      const apnList = descData?.desc?.apn?.split(',');
      const apnInfo = apnList?.[0]?.split('/');
      const tel = apnInfo?.[1]?.replace(/&amp;/g, ' • ');
      const apn = apnInfo?.[2].replace(/&amp;/g, '&');

      return (
        <View style={styles.bodyTop}>
          <AppText style={styles.bodyTopTitle}>
            {i18n.t('prodDetail:body:top:title')}
          </AppText>
          {apnList &&
            apnInfo &&
            (apnList?.length > 1 ? (
              <Pressable
                style={styles.bodyTopBox}
                onPress={() => onMessage('apn')}>
                <View style={styles.multiApn}>
                  <AppText style={styles.bodyTopBoxCountry}>
                    {prod?.name
                      .split(' ')
                      .filter((item) => !/(무제한|종량제|\d+일)/.test(item))
                      .join(' ')}
                  </AppText>
                  <View style={styles.apnButton}>
                    <AppText style={styles.apnButtonText}>
                      {i18n.t('pym:detail')}
                    </AppText>
                    <AppIcon name="arrowRightBlue10" />
                  </View>
                </View>
              </Pressable>
            ) : (
              <View style={styles.bodyTopBox}>
                <AppText style={styles.bodyTopBoxCountry}>{apnInfo[0]}</AppText>
                <AppText style={styles.bodyTopBoxTel}>{tel}</AppText>
              </View>
            ))}
          {tplList && tplList.length > 0 && !!tplList[0]?.text && (
            <View style={styles.tplInfo}>
              {tplList.map((t) => renderTplInfo(t))}
            </View>
          )}
          <View style={styles.apnSetBox}>
            <View
              style={[
                styles.apnSetBoxTop,
                {
                  backgroundColor:
                    prod?.field_daily === 'daily'
                      ? colors.purpleishBlue
                      : colors.violet,
                },
              ]}>
              <AppIcon name="apn" />
              <AppText style={styles.apnBoxTitle}>
                {i18n.t('store:apn')}
              </AppText>
            </View>

            {apnList &&
              apnInfo &&
              (apnList?.length > 1 ? (
                <Pressable
                  style={[
                    styles.apnCopy,
                    {
                      backgroundColor: colors.white,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => onMessage('apn')}>
                  <AppText style={styles.goToApnText}>
                    {i18n.t('prodDetail:body:top:go:apn')}
                  </AppText>
                  <AppIcon name="iconArrowRightBlack10" />
                </Pressable>
              ) : (
                <View
                  style={[styles.apnCopy, {flexDirection: 'column', gap: 16}]}>
                  {apn?.split('&').map((a) => renderAPN(a))}
                </View>
              ))}
          </View>
          {[1, 2].map((i) => (
            <TextWithDot
              key={`prodDetail:body:top:apn:notice${i}`}
              text={i18n.t(`prodDetail:body:top:apn:notice${i}`)}
              boldStyle={styles.noticeTextBlackBold}
              textStyle={styles.noticeTextBlackWithDot}
              dotStyle={styles.dotBlack}
              marginRight={20}
            />
          ))}
        </View>
      );
    },
    [
      attachBTag,
      descData?.desc?.apn,
      onMessage,
      prod?.field_daily,
      prod?.name,
      renderAPN,
      renderTplInfo,
    ],
  );

  const renderBodyNotice = useCallback(
    (t: {class: string; tag: string; text: string}) => {
      return t.tag === 'dt' ? (
        <AppText style={styles.noticeTitle}>{t.text}</AppText>
      ) : (
        renderTplInfo(t, 20)
      );
    },
    [renderTplInfo],
  );

  const renderBodyBottom = useCallback(
    (soup: BeautifulSoup) => {
      const tplCautionTags = soup?.find({attrs: {class: 'box_notandum'}});

      const tplClist = tplCautionTags?.contents?.filter(
        (c) => c?.name === 'dl',
      );

      const textList = tplClist?.map((c) => {
        return c?.contents.map((c) => ({
          class: c?.attrs?.class,
          tag: c?.name,
          text: attachBTag(c, c.getText()),
        }));
      });

      return (
        <View style={styles.bodyBottom}>
          <AppText style={{...styles.bodyTopTitle, fontWeight: 'bold'}}>
            {i18n.t('prodDetail:Caution')}
          </AppText>
          <View style={styles.bodyNoticeContents}>
            {textList &&
              textList.length > 0 &&
              textList.map((t) => (
                <View key={t[0].text}>{t.map((c) => renderBodyNotice(c))}</View>
              ))}
          </View>
        </View>
      );
    },
    [attachBTag, renderBodyNotice],
  );

  const renderBody = useCallback(() => {
    const soup = new BeautifulSoup(
      `<html><body>${descData?.body}</body></html>`,
    );
    return (
      <View>
        {renderBodyTop(soup)}
        {renderBodyBottom(soup)}
      </View>
    );
  }, [descData?.body, renderBodyBottom, renderBodyTop]);

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

      <ScrollView style={{flex: 1}}>
        {renderProdDetail()}
        {descData?.body && renderBody()}
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
