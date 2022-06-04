/* eslint-disable no-param-reassign */
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-community/async-storage';
import analytics, {firebase} from '@react-native-firebase/analytics';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Settings} from 'react-native-fbsdk';
import {TabView} from 'react-native-tab-view';
import {getTrackingStatus} from 'react-native-tracking-transparency';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ShortcutBadge from 'react-native-app-badge';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import StoreList from '@/components/StoreList';
import withBadge from '@/components/withBadge';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {
  ProductByCategory,
  RkbProduct,
  TabViewRoute,
} from '@/redux/api/productApi';
import {RkbPromotion} from '@/redux/api/promotionApi';
import createHandlePushNoti from '@/redux/models/createHandlePushNoti';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {actions as notiActions, NotiAction} from '@/redux/modules/noti';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import {SyncModelState} from '@/redux/modules/sync';
import i18n from '@/utils/i18n';
import pushNoti from '@/utils/pushNoti';
import {checkFistLaunch, requestPermission} from './component/permission';
import PromotionCarousel from './component/PromotionCarousel';
import AndroidEuccidModule from '@/components/NativeModule/AndroidEuccidModule';
import {useInterval} from '@/utils/useInterval';
import NotiModal from './component/NotiModal';

const {esimGlobal} = Env.get();

const BadgeAppButton = withBadge(
  ({noti}: RootState) => ({
    notReadNoti: noti.notiList.filter((elm) => elm.isRead === 'F').length,
  }),
  'notReadNoti',
)(AppButton);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  btnSearchBar: {
    width: 40,
    height: 40,
    backgroundColor: colors.white,
  },
  carousel: {
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.white,
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
  whiteTwoBackground: {
    backgroundColor: colors.whiteTwo,
  },
  tabView: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  normal16WarmGrey: {
    ...appStyles.normal16Text,
    color: colors.warmGrey,
  },
  boldClearBlue: {
    color: colors.clearBlue,
    fontWeight: 'bold',
  },
  scrollView: {
    backgroundColor: colors.white,
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
  imgRatio: {
    // figure out your image aspect ratio
    aspectRatio: 335 / 100,
    width: '100%',
  },
  deviceScrollView: {
    backgroundColor: colors.whiteTwo,
    height: 250,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
});

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

type EsimProps = {
  navigation: HomeScreenNavigationProp;
  promotion: RkbPromotion[];
  product: ProductModelState;
  account: AccountModelState;
  sync: SyncModelState;
  action: {
    product: ProductAction;
    account: AccountAction;
    order: OrderAction;
    noti: NotiAction;
    cart: CartAction;
  };
};

const TabHeader0 = ({
  index,
  routes,
  onIndexChange,
}: {
  index: number;
  routes: TabViewRoute[];
  onIndexChange: (n: number) => void;
}) => {
  return (
    <View style={styles.whiteTwoBackground}>
      <View style={styles.tabView}>
        {routes.map((elm, idx) => (
          <AppButton
            key={elm.key}
            style={styles.whiteTwoBackground}
            titleStyle={[
              styles.normal16WarmGrey,
              idx === index ? styles.boldClearBlue : {},
            ]}
            title={elm.title}
            // title={i18n.t(`prodDetail:${elm}`)}
            onPress={() => onIndexChange(idx)}
          />
        ))}
      </View>
    </View>
  );
};
const TabHeader = memo(TabHeader0);

const POPUP_DIS_DAYS = 7;
const HEADER_HEIGHT = 137;

const Esim: React.FC<EsimProps> = ({
  navigation,
  action,
  promotion,
  product,
  account,
  sync,
}) => {
  const [isSupportDev, setIsSupportDev] = useState<boolean | undefined>();
  const [index, setIndex] = useState(0);
  const routes = useMemo(
    () =>
      [
        {key: 'asia', title: i18n.t('store:asia'), category: '아시아'},
        {key: 'europe', title: i18n.t('store:europe'), category: '유럽'},
        {key: 'usaAu', title: i18n.t('store:usa/au'), category: '미주/호주'},
        {key: 'multi', title: i18n.t('store:multi'), category: '복수 국가'},
      ] as TabViewRoute[],
    [],
  );
  const [scene, setScene] = useState({
    asia: [] as ProductByCategory[],
    europe: [] as ProductByCategory[],
    usaAu: [] as ProductByCategory[],
    multi: [] as ProductByCategory[],
  });
  const [firstLaunch, setFirstLaunch] = useState<boolean | undefined>();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [popupDisabled, setPopupDisabled] = useState(false);
  const [popUp, setPopUp] = useState<RkbPromotion>();
  const [closeType, setCloseType] = useState<'close' | 'exit' | 'redirect'>();
  const [deviceList, setDeviceList] = useState<string[]>([]);
  const initialized = useRef(false);
  const initNoti = useRef(false);
  const setNotiModal = useCallback(() => {
    const popUpPromo = promotion?.find((v) => v?.notice?.image?.noti);

    if (popUpPromo) {
      setPopUp(popUpPromo);
      setCloseType(popUpPromo.notice?.rule ? 'redirect' : 'close');
      setPopUpVisible(true);
    }
  }, [promotion]);

  const checkSupportIos = useCallback(() => {
    const DeviceId = DeviceInfo.getDeviceId();

    if (DeviceId.startsWith('AppleTV')) return false;

    if (DeviceId.startsWith('iPhone'))
      return !!DeviceId.localeCompare('iPhone11.1');

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
    (prodOfCountry: RkbProduct[]) => {
      action.product.setProdOfCountry(prodOfCountry);
      navigation.navigate('Country');
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
          if (popUp?.notice?.rule?.invitation) {
            navigation.navigate('Invite');
          } else if (popUp?.notice) {
            navigation.navigate('SimpleText', {
              key: 'noti',
              title: i18n.t('set:noti'),
              bodyTitle: popUp.notice.title,
              body: popUp.notice.body,
              rule: popUp.notice.rule,
              image: popUp.notice.image,
              mode: 'noti',
            });
          }
          break;
        case 'exit':
          setIsSupportDev(true);
          break;
        default:
      }
    },
    [navigation, popUp?.notice],
  );

  const scrollY = useRef(new Animated.Value(0)).current;
  const clampedScrollY = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolateLeft: 'clamp',
  });
  const height = Animated.diffClamp(
    Animated.subtract(HEADER_HEIGHT, clampedScrollY),
    0,
    HEADER_HEIGHT,
  );

  const ref = useRef<View>();
  const renderScene = useCallback(
    ({route}: {route: TabViewRoute}) => {
      const data = scene[route.key];
      return (
        <StoreList
          data={data}
          onPress={onPressItem}
          localOpList={product.localOpList}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: false,
            },
          )}
        />
      );
    },
    [onPressItem, product.localOpList, scene, scrollY],
  );

  const modalBody = useCallback(() => {
    return (
      <View style={styles.modalBody}>
        <View style={{marginBottom: 10}}>
          <AppText style={appStyles.normal16Text}>
            {i18n.t('home:unsupportedBody1')}
            <AppText style={styles.normal16BlueText}>
              {i18n.t('home:unsupportedBody2')}
            </AppText>
            <AppText style={appStyles.normal16Text}>
              {i18n.t('home:unsupportedBody3')}
            </AppText>
          </AppText>
        </View>
        <AppText style={appStyles.normal16Text}>
          {i18n.t('home:unsupportedBody4')}
        </AppText>
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
    );
  }, [deviceList]);

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
          <AppButton
            key="search"
            style={styles.btnSearchBar}
            onPress={() => navigation?.navigate('StoreSearch')}
            iconName="btnSearchTop"
          />

          <AppButton
            key="cnter"
            style={styles.btnCnter}
            onPress={() => navigation?.navigate('Contact')}
            iconName="btnCnter"
          />

          {/* BadgeAppButton을 사용했을 때 위치가 변동됨 수정이 필요함 */}
          <BadgeAppButton
            key="alarm"
            style={styles.btnAlarm}
            onPress={() => navigation?.navigate('Noti', {mode: 'noti'})}
            iconName="btnAlarm"
          />
        </View>
      ),
    });
  }, [navigation]);

  const refresh = useCallback(() => {
    const {asia, europe, usaAu, multi} = API.Product.category;
    const {prodList, localOpList} = product;

    const list = API.Product.getProdGroup({prodList, localOpList});

    const sorted = API.Product.sortProdGroup(localOpList, list);

    action.product.setSortedProdList(sorted);

    setScene({
      asia: API.Product.filterByCategory(sorted, asia),
      europe: API.Product.filterByCategory(sorted, europe),
      usaAu: API.Product.filterByCategory(sorted, usaAu),
      multi: API.Product.filterByCategory(sorted, multi),
    });
  }, [action.product, product]);

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
  }, [navigation]);

  useEffect(() => {
    const now = moment();
    AsyncStorage.getItem('popupDisabled').then((v) => {
      if (v) {
        const disabled =
          moment.duration(now.diff(v)).asDays() <= POPUP_DIS_DAYS;

        if (disabled) setPopupDisabled(disabled);
        else AsyncStorage.removeItem('popupDisabled');
      }
    });
  }, []);

  useEffect(() => {
    API.Device.getDevList().then(async (resp) => {
      if (resp.result === 0) {
        const isSupport =
          Platform.OS === 'android'
            ? await AndroidEuccidModule.isEnableEsim()
            : checkSupportIos();

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
    // isSupportDev 값이 undefined가 아니면, 지원하는 단말 목록 확인이 끝난 것으로 간주한다
    if (isSupportDev !== undefined && !initialized.current) {
      initialized.current = true;
      pushNoti.add(notification);

      refresh();

      requestPermission();
    }
  }, [isSupportDev, notification, refresh]);

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
        action.noti.initNotiList();
      }
    }
  }, [account, action.cart, action.noti, action.order]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Animated.View
        style={{height}}
        ref={ref}
        // onLayout={(event) => {
        //   const {height} = event.nativeEvent.layout;
        //   bannerHeight.setValue(height);
        //   console.log('@@@ init height', height);
        // }}
        // android에서는 optimization을 위해서 불필요한 view를 제거할 수 있다. collapsable=false로 설정하여, view가 제거되지 않도록 처리한다.
        collapsable={false}>
        <PromotionCarousel />
      </Animated.View>
      <TabHeader index={index} routes={routes} onIndexChange={onIndexChange} />

      <TabView
        style={styles.container}
        sceneContainerStyle={{flex: 1}}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        initialLayout={{
          width: Dimensions.get('window').width,
          height: 10,
        }}
        renderTabBar={() => null}
      />

      <AppModal
        title={i18n.t('home:unsupportedTitle')}
        closeButtonTitle={i18n.t('ok')}
        titleStyle={styles.modalTitle}
        type="close"
        onOkClose={() => exitApp('exit')}
        visible={isSupportDev === false}>
        {modalBody()}
      </AppModal>
      {!popupDisabled && (
        <NotiModal
          visible={popUpVisible}
          popUp={popUp}
          closeType={closeType}
          onOkClose={() => exitApp(closeType)}
          onCancelClose={() => setPopUpVisible(false)}
        />
      )}
    </View>
  );
};

export default connect(
  ({account, product, promotion, sync}: RootState) => ({
    account,
    product,
    promotion: promotion.promotion,
    sync,
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
