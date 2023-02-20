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
import {useInterval} from '@/utils/useInterval';
import NotiModal from './component/NotiModal';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppVerModal from './component/AppVerModal';
import {isFolderOpen} from '@/constants/SliderEntry.style';
import RCTNetworkInfo from '@/components/NativeModule/NetworkInfo';
import AppStyledText from '@/components/AppStyledText';

const {esimGlobal, isIOS} = Env.get();

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
  localModal: {
    backgroundColor: 'white',
  },
  okBtnContainer: {
    backgroundColor: colors.white,
    paddingBottom: 20,
    marginTop: 20,
  },
  okButton: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
  localModalTitle: {
    marginBottom: 24,
  },
  localModalTitleText: {
    ...appStyles.bold24Text,
    lineHeight: 34,
  },
  localModalBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.backGrey,
    marginBottom: 12,
    flexDirection: 'row',
  },
  localModalBodyIcon: {
    marginRight: 16,
    alignSelf: 'center',
  },
  localModalBodyTitle: {
    ...appStyles.bold18Text,
    lineHeight: 22,
    marginBottom: 2,
  },
  localModalBodyText: {
    ...appStyles.medium16,
    lineHeight: 22,
    color: colors.warmGrey,
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
  };
  actions: {
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
  actions,
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
  const [popUp, setPopUp] = useState<RkbPromotion>();
  const [closeType, setCloseType] = useState<'close' | 'exit' | 'redirect'>();
  const [deviceList, setDeviceList] = useState<string[]>([]);
  const [isTop, setIsTop] = useState<boolean>(true);
  const initialized = useRef(false);
  const initNoti = useRef(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [bannerHeight, setBannerHeight] = useState<number>(150);

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
    const popUpPromo = promotion?.find(
      (v) => v.rule?.display?.routeName === 'Home' && v?.notice?.image?.noti,
    );

    if (popUpPromo) {
      setPopUp(popUpPromo);
      setCloseType(popUpPromo.rule ? 'redirect' : 'close');
      setPopUpVisible(true);
    }
  }, [promotion]);

  const navToCountry = useCallback(
    (info: RkbPriceInfo) => {
      action.product.getProdOfPartner(info.partnerList);
      navigation.navigate('Country', {partner: info.partnerList});
    },
    [action.product, navigation],
  );

  const localModal = useCallback(
    (info: RkbPriceInfo) => {
      return (
        <SafeAreaView style={{flex: 1}}>
          <Pressable
            style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}
            onPress={() => actions.modal.closeModal()}>
            <Pressable
              onPress={() => {}}
              style={{
                marginTop: 'auto',
                paddingTop: 32,
                paddingHorizontal: 20,
                backgroundColor: 'white',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}>
              <View style={styles.localModalTitle}>
                <AppText style={styles.localModalTitleText}>
                  {i18n.t('local:modal:title')}
                </AppText>
              </View>
              {[1, 2].map((k) => (
                <View style={styles.localModalBody}>
                  <AppSvgIcon
                    style={styles.localModalBodyIcon}
                    name={k === 1 ? 'localNotice1' : 'localNotice2'}
                  />
                  <View style={{flex: 1}}>
                    <AppText style={styles.localModalBodyTitle}>
                      {i18n.t(`local:modal:notice${k}:title`)}
                    </AppText>
                    <AppText style={styles.localModalBodyText}>
                      {i18n.t(`local:modal:notice${k}:body`)}
                    </AppText>
                  </View>
                </View>
              ))}
              <View style={styles.okBtnContainer}>
                <AppButton
                  style={styles.okButton}
                  title={i18n.t('local:ok')}
                  type="primary"
                  onPress={() => {
                    actions.modal.closeModal();
                    navToCountry(info);
                  }}
                />
              </View>
            </Pressable>
          </Pressable>
        </SafeAreaView>
      );
    },
    [actions.modal],
  );

  const onPressItem = useCallback(
    (info: RkbPriceInfo) => {
      const localOp = product.localOpList.get(info?.partner || '');
      const prodName = API.Product.getTitle(localOp);

      if (prodName.includes('(로컬망)') || prodName.includes('(local)'))
        actions.modal.showModal({content: localModal(info)});
      else {
        navToCountry(info);
      }
    },
    [product.localOpList, actions.modal],
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
    (v?: string) => {
      setPopUpVisible(false);
      setCloseType(undefined);

      switch (v) {
        case 'redirect':
          if (popUp?.rule?.navigate) {
            if (popUp?.rule?.navigate?.startsWith('http')) {
              Linking.openURL(popUp?.rule?.navigate);
            } else if (popUp?.rule?.stack) {
              navigation.navigate(popUp?.rule?.stack, {
                screen: popUp.rule.navigate,
                initial: false,
              });
            } else {
              navigation.navigate(popUp.rule.navigate);
            }
          } else if (popUp?.notice) {
            navigation.navigate('SimpleText', {
              key: 'noti',
              title: i18n.t('set:noti'),
              bodyTitle: popUp.notice.title,
              body: popUp.notice.body,
              rule: popUp.rule,
              nid: popUp.notice.nid,
              image: popUp.notice.image,
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
    [navigation, popUp?.notice, popUp?.rule],
  );

  useEffect(() => {
    if (route.params?.clickPromotion) exitApp('redirect');
  }, [exitApp, route.params?.clickPromotion]);

  useFocusEffect(() => {
    if (!isClosedPopUp && promotion) setNotiModal();
  });

  const folderOpened = useMemo(
    () => isFolderOpen(dimensions.width),
    [dimensions.width],
  );

  const renderScene = useCallback(
    ({route: sceneRoute}: {route: TabViewRoute}) => {
      return (
        <StoreList
          key={sceneRoute.key}
          data={product.priceInfo.get(sceneRoute.key, [] as RkbPriceInfo[][])}
          onPress={onPressItem}
          localOpList={product.localOpList}
          width={dimensions.width}
          onScroll={({
            nativeEvent: {
              contentOffset: {y},
            },
          }) => {
            if (isTop && y > bannerHeight) setIsTop(false);
            else if (!isTop && y <= 0) setIsTop(true);
          }}
        />
      );
    },
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
                {deviceList && deviceList.join(', ')}
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
    [deviceList],
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
        const resp = await API.Device.getDevList();
        if (resp.result === 0) {
          setDeviceList(resp.objects);
        }
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
  }, [action.account, isSupport, navigation, promotion, setNotiModal]);

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
      action.product.updatePriceInfo({});
    }
  }, [
    action.product,
    product.localOpList.size,
    product.priceInfo.size,
    product.prodByCountry.length,
  ]);

  useInterval(() => {
    // update product for every 1 hour
    if (navigation.isFocused()) action.product.getProd();
  }, 3600 * 1000);

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
          popUp={popUp}
          closeType={closeType}
          onOkClose={() => exitApp(closeType)}
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
    [appUpdate, closeType, exitApp, modalBody, modalType, popUp],
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
    },
    actions: {
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(Esim);
