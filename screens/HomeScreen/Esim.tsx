/* eslint-disable no-param-reassign */
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-community/async-storage';
import analytics, {firebase} from '@react-native-firebase/analytics';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Linking,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Settings} from 'react-native-fbsdk';
import {TabView} from 'react-native-tab-view';
import {getTrackingStatus} from 'react-native-tracking-transparency';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ShortcutBadge from 'react-native-app-badge';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';
import SimCardsManagerModule from 'react-native-sim-cards-manager';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useHeaderHeight} from '@react-navigation/stack';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import StoreList from '@/components/StoreList';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {navigate} from '@/navigation/navigation';
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
import {SyncModelState} from '@/redux/modules/sync';
import i18n from '@/utils/i18n';
import pushNoti from '@/utils/pushNoti';
import {checkFistLaunch, requestPermission} from './component/permission';
import PromotionCarousel from './component/PromotionCarousel';
import {useInterval} from '@/utils/useInterval';
import NotiModal from './component/NotiModal';
import AppTabHeader from '@/components/AppTabHeader';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppVerModal from './component/AppVerModal';
import {isFolderOpen} from '@/constants/SliderEntry.style';
import RCTNetworkInfo from '@/components/NativeModule/NetworkInfo';
import AppStyledText from '@/components/AppStyledText';

const {esimGlobal, isIOS} = Env.get();

const styles = StyleSheet.create({
  container: {
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
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    height: 56,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,

    ...Platform.select({
      ios: {
        shadowColor: 'rgb(52, 62, 95)',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: {
          height: 4,
          width: 1,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  notiBadge: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: 'red',
    right: 15,
  },
});

type EsimProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<ParamListBase, string>;
  promotion: RkbPromotion[];
  product: ProductModelState;
  account: AccountModelState;
  sync: SyncModelState;
  noti: NotiModelState;
  action: {
    product: ProductAction;
    account: AccountAction;
    order: OrderAction;
    noti: NotiAction;
    cart: CartAction;
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
  sync,
  noti,
}) => {
  const [isSupportDev, setIsSupportDev] = useState<boolean>(true);
  const [isDevModalVisible, setIsDevModalVisible] = useState<boolean>(false);
  const [bannerHeight, setBannerHeight] = useState<number>(137);
  const [index, setIndex] = useState(0);
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
  const [firstLaunch, setFirstLaunch] = useState<boolean | undefined>();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [popupDisabled, setPopupDisabled] = useState(true);
  const [appUpdate, setAppUpdate] = useState('');
  const [appUpdateVisible, setAppUpdateVisible] = useState<boolean>();
  const [popUp, setPopUp] = useState<RkbPromotion>();
  const [closeType, setCloseType] = useState<'close' | 'exit' | 'redirect'>();
  const [deviceList, setDeviceList] = useState<string[]>([]);
  const [isTop, setIsTop] = useState<boolean>(true);
  const initialized = useRef(false);
  const initNoti = useRef(false);
  const tabBarHeight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const windowHeight = useMemo(
    () => dimensions.height - tabBarHeight - headerHeight - 20,
    [dimensions.height, headerHeight, tabBarHeight],
  );

  const scrollY = useSharedValue(0);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
      scrollY.value = 0;
    });
    return () => subscription?.remove();
  }, [scrollY]);

  const setNotiModal = useCallback(() => {
    const popUpPromo = promotion?.find((v) => v?.notice?.image?.noti);

    if (popUpPromo) {
      setPopUp(popUpPromo);
      setCloseType(popUpPromo.rule ? 'redirect' : 'close');
      setPopUpVisible(true);
    }
  }, [promotion]);

  const checkSupportIos = useCallback(() => {
    const DeviceId = DeviceInfo.getDeviceId();

    if (DeviceId.startsWith('AppleTV')) return false;

    if (DeviceId.startsWith('iPhone'))
      return DeviceId.length >= 10 && DeviceId.localeCompare('iPhone11,1') >= 0;

    if (DeviceId.startsWith('iPad')) {
      // 가능한 iPad목록
      const enableIpadList = [
        'iPad4,2',
        'iPad4,3',
        'iPad5,4',
        'iPad7,12',
        'iPad8,3',
        'iPad8,4',
        'iPad8,7',
        'iPad8,8',
        'iPad11,2',
        'iPad11,4',
        'iPad13,2',
      ];

      return (
        enableIpadList.includes(DeviceId) ||
        (DeviceId.length >= 8 && DeviceId.localeCompare('iPad13,2') >= 0)
      );
    }

    return true;
  }, []);

  const onPressItem = useCallback(
    (info: RkbPriceInfo) => {
      action.product.getProdOfPartner(info.partnerList);
      navigation.navigate('Country', {partner: info.partnerList});
    },
    [action.product, navigation],
  );

  const onIndexChange = useCallback((idx: number) => setIndex(idx), []);

  const exitApp = useCallback(
    (v?: string) => {
      setPopUpVisible(false);
      setCloseType(undefined);

      switch (v) {
        case 'redirect':
          if (popUp?.rule?.navigate) {
            navigation.navigate(popUp.rule.navigate);
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
          if (isIOS) setIsDevModalVisible(false);
          else {
            Linking.openURL('https://www.rokebi.com');
          }
          break;
        default:
      }
    },
    [navigation, popUp?.notice, popUp?.rule],
  );

  const folderOpened = useMemo(
    () => isFolderOpen(dimensions.width),
    [dimensions.width],
  );

  const renderScene = useCallback(
    ({route}: {route: TabViewRoute}) => (
      <StoreList
        data={product.priceInfo.get(route.key, [] as RkbPriceInfo[][])}
        onPress={onPressItem}
        localOpList={product.localOpList}
        width={dimensions.width}
        onEndReached={() => setIsTop(false)}
        onScroll={({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => {
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

  useEffect(() => {
    scrollY.value = withTiming(isTop ? 0 : bannerHeight, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  }, [isTop, scrollY, bannerHeight]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -scrollY.value}],
    };
  });

  const modalBody = useCallback(
    () => (
      <View style={styles.modalBody}>
        {isIOS ? (
          <View>
            <View style={{marginBottom: 10}}>
              <AppStyledText
                text={i18n.t('home:unsupportedBody1')}
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
            <AppText style={[appStyles.normal16Text, {marginVertical: 30}]}>
              {i18n.t('home:unsupportedBody2')}
            </AppText>
            <AppStyledText
              text={i18n.t('home:unsupportedBody3')}
              textStyle={appStyles.normal16Text}
              format={{b: styles.normal16BlueText}}
            />
            <AppText style={[appStyles.normal16Text, {marginTop: 30}]}>
              {i18n.t('home:unsupportedBody4')}
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
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
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
    API.Device.getDevList().then(async (resp) => {
      if (resp.result === 0) {
        const isSupport =
          Platform.OS === 'android'
            ? await SimCardsManagerModule.isEsimSupported()
            : checkSupportIos();

        setIsDevModalVisible(!isSupport);
        setIsSupportDev(isSupport);
        setDeviceList(resp.objects);

        const deviceModel = DeviceInfo.getModel();

        DeviceInfo.getDeviceName().then((name) => {
          const deviceFullName = `${deviceModel},${name}`;
          action.account.updateAccount({
            isSupportDev: isSupport,
            deviceModel: deviceFullName,
          });
        });

        // 앱 첫 실행 여부 확인
        checkFistLaunch().then((first) => {
          setFirstLaunch(first);
          if (first) {
            navigation.navigate('Tutorial', {
              popUp: setNotiModal,
            });
          } else if (promotion) setNotiModal();
        });

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
    });
  }, [action.account, checkSupportIos, navigation, promotion, setNotiModal]);

  useEffect(() => {
    if (isSupportDev && !initialized.current) {
      initialized.current = true;
      pushNoti.add(notification);

      requestPermission();
    }
  }, [isSupportDev, notification]);

  useEffect(() => {
    const runDeppLink = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();
      const urlSplit = initialUrl?.split('/');

      if (urlSplit && urlSplit.length >= 4) {
        const deepLinkPath = urlSplit[3].split('?')[0];

        if (deepLinkPath === 'PROMOTION') {
          setPopupDisabled(true);
          exitApp('redirect');
        }
      }
    };

    runDeppLink();
  }, [exitApp]);

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
    if (sync.progress) {
      if (firstLaunch) {
        AsyncStorage.removeItem('alreadyLaunched');
        setFirstLaunch(false);
      }
      navigation.navigate('CodePush');
    }
  }, [firstLaunch, navigation, sync.progress]);

  useEffect(() => {
    const {mobile, loggedIn, iccid} = account;
    if (iccid) {
      if (loggedIn && !initNoti.current) {
        initNoti.current = true;
        action.noti.init({mobile});
        action.cart.init();
        action.order.init();
      } else {
        // action.noti.initNotiList();
        action.noti.getNotiList({mobile: account.mobile});
      }
    }
  }, [account, action.cart, action.noti, action.order]);

  useEffect(() => {
    const ver = VersionCheck.getCurrentVersion();
    API.AppVersion.getAppVersion(ver)
      .then((rsp) => {
        if (rsp.result === 0 && rsp.objects.length > 0) {
          setAppUpdate(rsp.objects[0].updateOption);
          setAppUpdateVisible(true);
        } else setAppUpdateVisible(false);
      })
      .catch((err) => setAppUpdateVisible(false));
  }, []);

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

  const onLayout = useCallback(
    (event) => setBannerHeight(event.nativeEvent.layout.height),
    [],
  );

  return (
    <Animated.View
      style={[
        styles.container,
        !folderOpened && animatedStyles,
        {
          height: windowHeight + (folderOpened ? 0 : bannerHeight),
        },
      ]}>
      <StatusBar barStyle="dark-content" />
      {folderOpened ? (
        <View style={{flexDirection: 'row'}} onLayout={onLayout}>
          <View style={{flex: 1}} collapsable={false}>
            <PromotionCarousel width={dimensions.width / 2} />
          </View>
          <View style={{flex: 1}}>{renderSearch()}</View>
        </View>
      ) : (
        <View onLayout={onLayout}>
          <View collapsable={false}>
            <PromotionCarousel width={dimensions.width} />
          </View>
          {renderSearch()}
        </View>
      )}

      <AppTabHeader
        index={index}
        routes={routes}
        onIndexChange={onIndexChange}
        style={{backgroundColor: colors.white, height: 60}}
        tintColor={colors.black}
      />

      <TabView
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

      {
        // eslint-disable-next-line no-nested-ternary
        isDevModalVisible && !isSupportDev ? (
          <AppModal
            title={i18n.t('home:unsupportedTitle')}
            closeButtonTitle={isIOS ? i18n.t('ok') : i18n.t('exitAndOpenLink')}
            titleStyle={styles.modalTitle}
            type="close"
            onOkClose={() => exitApp('exit')}
            visible={isDevModalVisible}>
            {modalBody()}
          </AppModal>
        ) : appUpdateVisible === false ? (
          <NotiModal
            visible={popUpVisible && !popupDisabled}
            popUp={popUp}
            closeType={closeType}
            onOkClose={() => exitApp(closeType)}
            onCancelClose={() => setPopUpVisible(false)}
          />
        ) : (
          <AppVerModal
            visible={appUpdateVisible || false}
            option={appUpdate}
            onOkClose={() => setAppUpdateVisible(false)}
          />
        )
      }
    </Animated.View>
  );
};

export default connect(
  ({account, product, promotion, sync, noti}: RootState) => ({
    account,
    product,
    promotion: promotion.promotion,
    sync,
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
  }),
)(Esim);
