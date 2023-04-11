/* eslint-disable no-param-reassign */
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-community/async-storage';
import analytics, {firebase} from '@react-native-firebase/analytics';
import moment from 'moment';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Linking,
  Animated,
  SafeAreaView,
  Image,
  Pressable,
  AppState,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Settings} from 'react-native-fbsdk-next';
import {TabView} from 'react-native-tab-view';
import {getTrackingStatus} from 'react-native-tracking-transparency';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ShortcutBadge from 'react-native-app-badge';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';
import {StackNavigationProp} from '@react-navigation/stack';
import {isFolderOpen} from '@/constants/SliderEntry.style';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import StoreList from '@/components/StoreList';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList, navigate} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {TabViewRoute} from '@/redux/api/productApi';
import {RkbPromotion} from '@/redux/api/promotionApi';
import createHandlePushNoti from '@/redux/models/createHandlePushNoti';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {
  actions as notiActions,
  NotiAction,
  NotiModelState,
} from '@/redux/modules/noti';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
  RkbPriceInfo,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import pushNoti from '@/utils/pushNoti';
import PromotionCarousel from './component/PromotionCarousel';
import NotiModal from './component/NotiModal';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppVerModal from './component/AppVerModal';
import RCTNetworkInfo from '@/components/NativeModule/NetworkInfo';
import AppStyledText from '@/components/AppStyledText';
import {retrieveData, storeData} from '@/utils/utils';
import LocalModal from './component/LocalModal';
import ChatTalk from '../UserGuideScreen/ChatTalk';

const {esimGlobal, isIOS, cachePrefix} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  btnAlarm: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },
  normal16BlueText: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
  },
  modalTitle: {
    ...appStyles.normal20Text,
    marginHorizontal: 20,
  },
  modalBody: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  supportDevTitle: {
    ...appStyles.bold16Text,
    marginTop: 30,
    marginBottom: 10,
  },
  deviceScrollView: {
    backgroundColor: colors.whiteTwo,
    height: 250,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  showSearchBar: {
    marginBottom: 12,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    height: 56,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,

    shadowColor: 'rgb(52, 62, 95)',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    shadowOffset: {
      height: 4,
      width: 1,
    },
  },
  notiBadge: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: 'red',
    right: 15,
  },
  tabHeaderContinaer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  tabHeaderTitle: {
    ...appStyles.normal16Text,
    marginHorizontal: 10,
    marginVertical: 15,
  },
  remainUnderLine: {
    flex: 1,
    height: '100%',
    borderBottomWidth: 2,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
  },
});

type EsimScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Esim'>;

type EsimScreenRouteProp = RouteProp<HomeStackParamList, 'Esim'>;

type EsimProps = {
  navigation: EsimScreenNavigationProp;
  route: EsimScreenRouteProp;
  promotion: RkbPromotion[];
  product: ProductModelState;
  account: AccountModelState;
  noti: NotiModelState;
  action: {
    product: ProductAction;
    account: AccountAction;
    order: OrderAction;
    noti: NotiAction;
    cart: CartAction;
    modal: ModalAction;
  };
};

const POPUP_DIS_DAYS = 7;
const Esim: React.FC<EsimProps> = ({
  navigation,
  route,
  action,
  promotion,
  product,
  account,
  noti,
}) => {
  const [isDevModalVisible, setIsDevModalVisible] = useState<boolean>(true);
  const [index, setIndex] = useState(0);
  const [savedIndex, setSavedIndex] = useState(0);
  const routes = useMemo(
    () =>
      [
        {
          key: API.Product.category.asia,
          title: i18n.t('store:asia'),
          category: '아시아',
        },
        {
          key: API.Product.category.europe,
          title: i18n.t('store:europe'),
          category: '유럽',
        },
        {
          key: API.Product.category.usaAu,
          title: i18n.t('store:usa/au'),
          category: '미주/호주',
        },
        {
          key: API.Product.category.multi,
          title: i18n.t('store:multi'),
          category: '복수 국가',
        },
      ] as TabViewRoute[],
    [],
  );
  const [popUpVisible, setPopUpVisible] = useState();
  const [isClosedPopUp, setIsClosedPopUp] = useState<boolean>(false);
  const [popupDisabled, setPopupDisabled] = useState(true);
  const [appUpdate, setAppUpdate] = useState('');
  const [appUpdateVisible, setAppUpdateVisible] = useState<boolean>();
  const [popUpList, setPopUpList] = useState<RkbPromotion[]>();
  const [isTop, setIsTop] = useState<boolean>(true);
  const initialized = useRef(false);
  const initNoti = useRef(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [bannerHeight, setBannerHeight] = useState<number>(150);
  const appState = useRef('unknown');

  const isSupport = useMemo(() => account.isSupportDev, [account.isSupportDev]);

  const modalType = useMemo(() => {
    if (
      navigation.isFocused() &&
      isSupport !== undefined &&
      popUpVisible !== undefined &&
      appUpdateVisible !== undefined
    ) {
      if (isDevModalVisible && !isSupport) return 'unSupported';
      if (popUpVisible && !popupDisabled) return 'promotion';
      if (appUpdateVisible) return 'update';
    }
    return 'noModal';
  }, [
    appUpdateVisible,
    isDevModalVisible,
    isSupport,
    navigation,
    popUpVisible,
    popupDisabled,
  ]);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (promotion.length > 0 && promotion[0].imageUrl) {
      Image.getSize(
        API.default.httpImageUrl(promotion[0].imageUrl),
        (width, height) => {
          // 배너 높이 = 이미지 높이 * 비율 + 30(여백)
          setBannerHeight(Math.ceil(height * (dimensions.width / width) + 30));
        },
      );
    } else {
      setBannerHeight(0);
    }
  }, [dimensions.width, promotion]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isTop ? bannerHeight : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, bannerHeight, isTop]);

  const setNotiModal = useCallback(() => {
    const popUpPromoList = promotion?.filter(
      (v) =>
        v.rule?.display?.routeName === 'Home' &&
        v?.notice?.image?.noti &&
        v.isPopup,
    );

    if ((popUpPromoList.length || 0) > 0) {
      setPopUpList(popUpPromoList);
      setPopUpVisible(true);
    } else {
      setPopUpVisible(false);
    }
  }, [promotion]);

  const navToCountry = useCallback(
    (info: RkbPriceInfo) => {
      action.product.getProdOfPartner(info.partnerList);
      navigation.navigate('Country', {
        partner: info.partnerList,
      });
    },
    [action.product, navigation],
  );

  const onPressItem = useCallback(
    async (info: RkbPriceInfo) => {
      const localOp = product.localOpList.get(info?.partner || '');

      if (localOp?.warning) {
        const item = await AsyncStorage.getItem(
          `esim.show.local.modal.${localOp?.key}`,
        );
        const tm = moment(item, 'YYYY-MM-DD HH:mm:ss');

        if (!tm.isValid() || tm.add(1, 'day').isBefore(moment())) {
          return action.modal.showModal({
            content: (
              <LocalModal
                onPress={() => navToCountry(info)}
                localOpKey={localOp?.key || ''}
                html={decodeURIComponent(localOp.warning)}
              />
            ),
          });
        }
      }

      return navToCountry(info);
    },
    [action.modal, navToCountry, product.localOpList],
  );

  const onIndexChange = useCallback((idx: number) => setIndex(idx), []);

  // android tabView에서는 같은 stack 화면 이동 시 onIndexChange(0)이 실행되므로 기존 탭을 저장한 후 보여줄 수 있도록 추가함
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isIOS) {
        setIndex(savedIndex);
        setSavedIndex(0);
      }
    });

    return unsubscribe;
  }, [index, navigation, savedIndex]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (!isIOS) {
        setSavedIndex(index);
      }
    });

    return unsubscribe;
  }, [index, navigation, savedIndex]);

  const exitApp = useCallback(
    (v?: string, item?: RkbPromotion) => {
      setPopUpVisible(false);

      switch (v) {
        case 'redirect':
          setIsClosedPopUp(true);
          if (item?.rule?.navigate) {
            if (item?.rule?.navigate?.startsWith('http')) {
              Linking.openURL(item?.rule?.navigate);
            } else if (item?.rule?.stack) {
              navigation.navigate(item?.rule?.stack, {
                screen: item.rule.navigate,
                initial: false,
              });
            } else {
              navigation.navigate(item.rule.navigate);
            }
          } else if (item?.notice) {
            navigation.navigate('SimpleText', {
              key: 'noti',
              title: i18n.t('set:noti'),
              bodyTitle: item.notice.title,
              body: item.notice.body,
              rule: item.rule,
              nid: item.notice.nid,
              image: item.notice.image,
              mode: 'noti',
            });
          }
          break;
        case 'exit':
          if (isIOS) {
            setIsClosedPopUp(true);
            setIsDevModalVisible(false);
          } else {
            Linking.openURL('https://www.rokebi.com');
          }
          break;
        default:
      }
    },
    [navigation],
  );

  useEffect(() => {
    if (route.params?.clickPromotion) exitApp('redirect');
  }, [exitApp, route.params?.clickPromotion]);

  useFocusEffect(
    React.useCallback(() => {
      if (!isClosedPopUp && promotion) setNotiModal();
    }, [isClosedPopUp, promotion, setNotiModal]),
  );

  const folderOpened = useMemo(
    () => isFolderOpen(dimensions.width),
    [dimensions.width],
  );

  const renderScene = useCallback(
    ({route: sceneRoute}: {route: TabViewRoute}) => (
      <StoreList
        key={sceneRoute.key}
        data={product.priceInfo.get(sceneRoute.key, [] as RkbPriceInfo[][])}
        onPress={onPressItem}
        localOpList={product.localOpList}
        width={dimensions.width}
        onScroll={({nativeEvent}) => {
          const {y} = nativeEvent.contentOffset;
          if (isTop && y > bannerHeight) setIsTop(false);
          else if (!isTop && y <= 0) setIsTop(true);
        }}
      />
    ),
    [
      bannerHeight,
      dimensions.width,
      isTop,
      onPressItem,
      product.localOpList,
      product.priceInfo,
    ],
  );

  const renderSearch = useCallback(
    () => (
      <AppButton
        key="search"
        title={i18n.t('home:searchPlaceholder')}
        style={styles.showSearchBar}
        titleStyle={[appStyles.normal16Text, {color: colors.clearBlue}]}
        direction="row"
        onPress={() => navigation.navigate('StoreSearch')}
        iconName="btnSearchBlue"
        iconStyle={{marginHorizontal: 24}}
      />
    ),
    [navigation],
  );

  const renderCarousel = useCallback(() => {
    const promotionBanner = promotion.filter(
      (elm) => elm.imageUrl && elm?.rule?.type !== 'popUp',
    );
    if (promotionBanner.length > 0) {
      return (
        <View>
          {folderOpened ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <View style={{flex: 1}} collapsable={false}>
                <PromotionCarousel
                  width={dimensions.width / 2}
                  promotion={promotionBanner}
                />
              </View>
              <View style={{flex: 1}}>{renderSearch()}</View>
            </View>
          ) : (
            <View>
              <Animated.View
                collapsable={false}
                style={{height: animatedValue, marginTop: 15}}>
                <PromotionCarousel
                  width={dimensions.width}
                  promotion={promotionBanner}
                />
              </Animated.View>
              {renderSearch()}
            </View>
          )}
        </View>
      );
    }

    return renderSearch();
  }, [animatedValue, dimensions.width, folderOpened, promotion, renderSearch]);

  const renderTabHeader = useCallback(() => {
    return (
      <View style={styles.tabHeaderContinaer}>
        {routes.map((elm, idx) => {
          const selected = idx === index;
          return (
            <Fragment key={elm.key}>
              <Pressable
                key={elm.key}
                style={{
                  ...styles.titleContainer,
                  borderBottomColor: selected ? colors.black : colors.whiteTwo,
                }}
                onPress={() => onIndexChange(idx)}>
                <AppText
                  key={elm.title}
                  style={{
                    ...styles.tabHeaderTitle,
                    color: selected ? colors.black : colors.warmGrey,
                  }}>
                  {elm.title}
                </AppText>
              </Pressable>
              {idx !== routes.length - 1 && (
                <Pressable
                  key={`${elm.key}blank`}
                  style={{
                    ...styles.remainUnderLine,
                    borderBottomColor: colors.whiteTwo,
                  }}
                  onPress={() => onIndexChange(idx)}
                />
              )}
            </Fragment>
          );
        })}
      </View>
    );
  }, [index, onIndexChange, routes]);

  const modalBody = useCallback(
    () => (
      <View style={styles.modalBody}>
        {isIOS ? (
          <View>
            <View style={{marginBottom: 10}}>
              <AppStyledText
                text={i18n.t('home:unsupportedBody2')}
                textStyle={appStyles.normal16Text}
                format={{b: styles.normal16BlueText}}
              />
            </View>
            <AppText style={styles.supportDevTitle}>
              {i18n.t('home:supportedDevice')}
            </AppText>

            <ScrollView
              style={styles.deviceScrollView}
              showsVerticalScrollIndicator={false}>
              <AppText style={[appStyles.normal16Text, {lineHeight: 24}]}>
                {product.devList?.join(', ')}
                {i18n.t('home:supportedDeviceBody')}
              </AppText>
            </ScrollView>
          </View>
        ) : (
          <View style={{marginBottom: 10}}>
            <AppStyledText
              text={i18n.t('home:unsupportedBody1')}
              textStyle={appStyles.normal16Text}
              format={{b: styles.normal16BlueText}}
            />
            <AppStyledText
              text={i18n.t('home:unsupportedBody2')}
              textStyle={{...appStyles.normal16Text, marginTop: 30}}
              format={{b: styles.normal16BlueText}}
            />
            <AppText style={[appStyles.normal16Text, {marginVertical: 30}]}>
              {i18n.t('home:unsupportedBody3')}
            </AppText>
            <AppStyledText
              text={i18n.t('home:unsupportedBody4')}
              textStyle={appStyles.normal16Text}
              format={{b: styles.normal16BlueText}}
            />
            <AppText style={[appStyles.normal16Text, {marginTop: 30}]}>
              {i18n.t('home:unsupportedBody5')}
            </AppText>
          </View>
        )}
      </View>
    ),
    [product.devList],
  );

  useEffect(() => {
    navigation?.setOptions({
      title: null,
      headerLeft: () => (
        <AppText style={styles.title}>
          {i18n.t('esim')}
          {esimGlobal ? ' Store' : ''}
        </AppText>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <AppSvgIcon
            key="cnter"
            style={styles.btnCnter}
            onPress={() =>
              navigate(navigation, route, 'HomeStack', {
                tab: 'HomeStack',
                screen: 'Contact',
              })
            }
            name="btnCnter"
          />
          <AppButton
            key="alarm"
            style={styles.btnAlarm}
            onPress={() => navigation?.navigate('Noti', {mode: 'noti'})}
            iconName="btnAlarm"
          />
          {noti.notiList.find((elm) => elm.isRead === 'F') && (
            <View style={styles.notiBadge} />
          )}
        </View>
      ),
    });
  }, [navigation, noti.notiList, route]);

  const notification = useCallback(
    (type: string, payload, isForeground = true) => {
      const {mobile, iccid} = account;

      const pushNotiHandler = createHandlePushNoti(navigation, payload, {
        mobile,
        iccid,
        isForeground,
        isRegister: type === 'register',
        updateAccount: action.account.updateAccount,
        clearCurrentAccount: () => {
          Promise.all([
            action.cart.reset(),
            action.order.reset(),
            action.noti.reset(),
            action.account.logout(),
          ]).then(() => {
            if (Platform.OS === 'ios')
              PushNotificationIOS.setApplicationIconBadgeNumber(0);
            else ShortcutBadge.setCount(0);
          });
        },
      });
      pushNotiHandler.sendLog();
      pushNotiHandler.handleNoti();
    },
    [
      account,
      action.account,
      action.cart,
      action.noti,
      action.order,
      navigation,
    ],
  );

  useEffect(() => {
    navigation.addListener('blur', () => setPopUpVisible(false));

    if (Platform.OS === 'ios') {
      RCTNetworkInfo.supportEsim((v) => console.log('@@@ esim', v));
    }
  }, [navigation]);

  useEffect(() => {
    const now = moment();
    AsyncStorage.getItem('popupDisabled').then((v) => {
      if (v) {
        const disabled =
          moment.duration(now.diff(v)).asDays() <= POPUP_DIS_DAYS;
        if (!disabled) {
          setPopupDisabled(false);
          AsyncStorage.removeItem('popupDisabled');
        }
      } else setPopupDisabled(false);
    });
  }, []);

  useEffect(() => {
    async function getDevList() {
      if (isIOS) {
        const tm = await retrieveData(`${cachePrefix}cache.timestamp.dev`);
        const reload = product.rule.timestamp_dev > tm;
        action.product.getDevList(reload);
        if (reload)
          storeData(
            `${cachePrefix}cache.timestamp.dev`,
            moment().zone(-540).format(),
          );
      }

      const deviceModel = DeviceInfo.getModel();

      if (!isSupport) {
        const status = await getTrackingStatus();
        if (status === 'authorized') {
          await firebase.analytics().setAnalyticsCollectionEnabled(true);
          await Settings.setAdvertiserTrackingEnabled(true);

          analytics().logEvent(
            `${esimGlobal ? 'global' : 'esim'}_disabled_device`,
            {
              item: deviceModel,
              count: 1,
            },
          );
        }
      }
    }
    getDevList();
  }, [action.product, isSupport, product.rule.timestamp_dev]);

  useEffect(() => {
    if (isSupport && !initialized.current) {
      initialized.current = true;
      pushNoti.add(notification);
    }
  }, [isSupport, notification]);

  useEffect(() => {
    if (
      product.localOpList.size > 0 &&
      product.prodByCountry.length > 0 &&
      product.priceInfo.size === 0
    ) {
      action.product.updatePriceInfo();
    }
  }, [
    action.product,
    product.localOpList.size,
    product.priceInfo.size,
    product.prodByCountry.length,
  ]);

  useEffect(() => {
    // check timestamp
    const checkTimestamp = async () => {
      const tm = await retrieveData(`${cachePrefix}cache.timestamp.prod`);
      const reload = !tm || product.rule.timestamp_prod > tm;
      // console.log('@@@ reload all prod', reload, tm);
      // reload data
      action.product.getAllProduct(reload);
      if (reload) {
        storeData(
          `${cachePrefix}cache.timestamp.prod`,
          moment().zone(-540).format(),
        );
      }
    };
    checkTimestamp();
  }, [action.product, product.rule.timestamp_prod]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // 동작 순서용 notice model flag 변수
        console.log(
          'App has come to the active!',
          appState.current,
          nextAppState,
        );
        action.product.refresh();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [action.product]);

  useEffect(() => {
    const {mobile, loggedIn, iccid} = account;
    if (iccid) {
      if (!initNoti.current) {
        initNoti.current = true;

        if (loggedIn) {
          action.noti.init({mobile});
          action.cart.init();
          action.order.init();
        } else {
          action.noti.getNotiList({mobile: account.mobile});
        }
      }
    }
  }, [account, action.cart, action.noti, action.order]);

  useEffect(() => {
    if (appUpdateVisible === undefined) {
      const ver = VersionCheck.getCurrentVersion();
      API.AppVersion.getAppVersion(`${Platform.OS}:${ver}`)
        .then((rsp) => {
          if (rsp.result === 0 && rsp.objects.length > 0) {
            setAppUpdate(rsp.objects[0].updateOption);
            setAppUpdateVisible(true);
          } else setAppUpdateVisible(false);
        })
        .catch(() => setAppUpdateVisible(false));
    }
  }, [appUpdateVisible]);

  const renderModal = useCallback(
    () => (
      <>
        <NotiModal
          visible={modalType === 'promotion'}
          popUpList={popUpList || []}
          onOkClose={exitApp}
          onCancelClose={() => {
            setIsClosedPopUp(true);
            setPopUpVisible(false);
          }}
        />
        <AppModal
          title={i18n.t('home:unsupportedTitle')}
          okButtonTitle={isIOS ? i18n.t('ok') : i18n.t('exitAndOpenLink')}
          titleStyle={styles.modalTitle}
          type="close"
          onOkClose={() => exitApp('exit')}
          visible={modalType === 'unSupported'}>
          {modalBody()}
        </AppModal>
        <AppVerModal
          visible={modalType === 'update'}
          option={appUpdate}
          onOkClose={() => setAppUpdateVisible(false)}
        />
      </>
    ),
    [appUpdate, exitApp, modalBody, modalType, popUpList],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderCarousel()}

      {renderTabHeader()}

      {savedIndex === 0 && (
        <TabView
          lazy
          style={styles.container}
          sceneContainerStyle={{flex: 1}}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={onIndexChange}
          initialLayout={{
            width: dimensions.width,
            height: 10,
          }}
          renderTabBar={() => null}
        />
      )}

      <ChatTalk visible />
      {renderModal()}
    </SafeAreaView>
  );
};

export default connect(
  ({account, product, promotion, noti}: RootState) => ({
    account,
    product,
    promotion: promotion.promotion,
    noti,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(Esim);
