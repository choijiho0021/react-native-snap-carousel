/* eslint-disable no-param-reassign */
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-community/async-storage';
import analytics, {firebase} from '@react-native-firebase/analytics';
import {StackNavigationProp} from '@react-navigation/stack';
import moment, {Moment} from 'moment';
import React, {Component, memo} from 'react';
import {
  Appearance,
  Dimensions,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Settings} from 'react-native-fbsdk';
import {TabView} from 'react-native-tab-view';
import {getTrackingStatus} from 'react-native-tracking-transparency';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ShortcutBadge from 'react-native-app-badge';
import {ScrollView} from 'react-native';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import AppUserPic from '@/components/AppUserPic';
import StoreList, {StoreListRef} from '@/components/StoreList';
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
  TabViewRouteKey,
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
  infoModalTitle: {
    ...appStyles.normal20Text,
    marginHorizontal: 20,
  },
  popupImg: {
    width: 333,
    height: 444,
    marginVertical: 20,
  },
  deviceScrollView: {
    backgroundColor: colors.whiteTwo,
    height: 250,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  showSearchBar: {
    margin: 20,
    height: 56,
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,
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

type EsimState = {
  isSupportDev: boolean;
  index: number;
  routes: TabViewRoute[];
  scene: Record<TabViewRouteKey, ProductByCategory[]>;
  time: Moment;
  deviceList?: string[];
  firstLaunch?: boolean;
  popUp?: RkbPromotion;
  closeType?: 'close' | 'exit' | 'redirect';
  popUpVisible: boolean;
  checked: boolean;
  popupDisabled: boolean;
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
class Esim extends Component<EsimProps, EsimState> {
  offset: number;

  controller: AbortController;

  tabViewRef: Record<TabViewRouteKey, React.RefObject<StoreListRef>>;

  constructor(props: EsimProps) {
    super(props);

    this.state = {
      isSupportDev: true,
      index: 0,
      routes: [
        {key: 'asia', title: i18n.t('store:asia'), category: '아시아'},
        {key: 'europe', title: i18n.t('store:europe'), category: '유럽'},
        {key: 'usaAu', title: i18n.t('store:usa/au'), category: '미주/호주'},
        {key: 'multi', title: i18n.t('store:multi'), category: '복수 국가'},
      ] as TabViewRoute[],
      scene: {
        asia: [] as ProductByCategory[],
        europe: [] as ProductByCategory[],
        usaAu: [] as ProductByCategory[],
        multi: [] as ProductByCategory[],
      },
      firstLaunch: false,
      time: moment(),
      popUpVisible: false,
      checked: false,
      popupDisabled: false,
    };

    this.refresh = this.refresh.bind(this);
    this.renderTitleBtn = this.renderTitleBtn.bind(this);
    this.onIndexChange = this.onIndexChange.bind(this);
    this.onPressItem = this.onPressItem.bind(this);
    this.notification = this.notification.bind(this);
    this.init = this.init.bind(this);
    this.modalBody = this.modalBody.bind(this);
    this.renderNotiModal = this.renderNotiModal.bind(this);
    this.setNotiModal = this.setNotiModal.bind(this);
    this.exitApp = this.exitApp.bind(this);
    this.checkSupportIos = this.checkSupportIos.bind(this);

    this.offset = 0;
    this.controller = new AbortController();
    this.tabViewRef = {
      asia: React.createRef(),
      europe: React.createRef(),
      usaAu: React.createRef(),
      multi: React.createRef(),
    };
  }

  componentDidMount() {
    const now = moment();
    this.setState({time: now});

    this.props.navigation.addListener('blur', () => {
      this.setState({popUpVisible: false});
    });

    AsyncStorage.getItem('popupDisabled').then((v) => {
      if (v) {
        const popupDisabled =
          moment.duration(now.diff(v)).asDays() <= POPUP_DIS_DAYS;

        if (popupDisabled) this.setState({popupDisabled});
        else AsyncStorage.removeItem('popupDisabled');
      }
    });

    API.Device.getDevList().then(async (resp) => {
      if (resp.result === 0) {
        const deviceModel = DeviceInfo.getModel();

        const isSupportDev =
          Platform.OS === 'android'
            ? await AndroidEuccidModule.isEnableEsim()
            : this.checkSupportIos();

        this.setState({
          deviceList: resp.objects,
          isSupportDev,
        });

        DeviceInfo.getDeviceName().then((name) => {
          const deviceFullName = `${deviceModel},${name}`;
          this.props.action.account.updateAccount({
            isSupportDev,
            deviceModel: deviceFullName,
          });
        });

        this.renderTitleBtn();

        pushNoti.add(this.notification);

        this.refresh();

        requestPermission();

        // 앱 첫 실행 여부 확인
        const firstLaunch = await checkFistLaunch();
        this.setState({firstLaunch});
        if (firstLaunch) {
          this.props.navigation.navigate('Tutorial', {
            popUp: this.setNotiModal,
          });
        } else if (this.props.promotion) this.setNotiModal();
        if (!isSupportDev) {
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

    // 로그인 여부에 따라 달라지는 부분
    this.init();
  }

  componentDidUpdate(prevProps: EsimProps) {
    const {product, account, promotion} = this.props;
    const focus = this.props.navigation.isFocused();
    const now = moment();
    const diff = moment.duration(now.diff(this.state.time)).asMinutes();

    if (diff > 60 && focus) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({time: now});
      this.props.action.product.getProd();
    }

    if (prevProps.promotion !== promotion) this.setNotiModal();

    if (
      prevProps.product.prodList !== product.prodList
      // || (diff > 0.2 && this.props.product.sortedProdList.length === 0
    ) {
      this.refresh();
    }

    if (
      prevProps.account.iccid !== account.iccid ||
      (prevProps.account.loggedIn !== account.loggedIn && !account.loggedIn)
    ) {
      this.init();
    }

    if (this.props.sync.progress) {
      if (this.state.firstLaunch) {
        AsyncStorage.removeItem('alreadyLaunched');
        this.setState({firstLaunch: false});
      }
      this.props.navigation.navigate('CodePush');
    }
  }

  checkSupportIos = () => {
    const DeviceId = DeviceInfo.getDeviceId();

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

    if (DeviceId.startsWith('AppleTV')) return false;

    if (DeviceId.startsWith('iPhone'))
      return DeviceId.length >= 10 && DeviceId.localeCompare('iPhone11,1') >= 0;
    if (DeviceId.startsWith('iPad'))
      return (
        enableIpadList.includes(DeviceId) ||
        (DeviceId.length >= 8 && DeviceId.localeCompare('iPad13,2') >= 0)
      );

    return true;
  };

  setNotiModal = () => {
    const popUp = this.props.promotion?.find((v) => v?.notice?.image?.noti);

    if (popUp) {
      this.setState({
        popUp,
        closeType: popUp.notice?.rule ? 'redirect' : 'close',
        popUpVisible: true,
      });
    }
  };

  onPressItem = (prodOfCountry: RkbProduct[]) => {
    this.props.action.product.setProdOfCountry(prodOfCountry);
    this.props.navigation.navigate('Country');
  };

  onIndexChange = (index: number) => {
    this.setState({
      index,
    });
    const {key} = this.state.routes[index];
    this.tabViewRef[key].current?.scrollToIndex({index: 0});
  };

  exitApp = (v?: string) => {
    const {popUp} = this.state;

    this.setState({popUpVisible: false, closeType: undefined});

    switch (v) {
      case 'redirect':
        if (popUp?.notice?.rule?.invitation) {
          this.props.navigation.navigate('Invite');
        } else if (popUp?.notice) {
          this.props.navigation.navigate('SimpleText', {
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
        this.setState({isSupportDev: true});
        break;
      default:
    }
  };

  renderScene = ({route}: {route: TabViewRoute}) => {
    const data = this.state.scene[route.key];
    return (
      <StoreList
        data={data}
        onPress={this.onPressItem}
        storeListRef={this.tabViewRef[route.key]}
      />
    );
  };

  modalBody = () => {
    const {deviceList} = this.state;

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
  };

  init() {
    const {mobile, loggedIn} = this.props.account;

    if (loggedIn) {
      this.props.action.noti.init({mobile});
      this.props.action.cart.init();
      this.props.action.order.init();
    } else {
      this.props.action.noti.initNotiList();
    }
  }

  refresh() {
    const {asia, europe, usaAu, multi} = API.Product.category;
    const {prodList, localOpList} = this.props.product;

    const list = API.Product.getProdGroup({prodList, localOpList});

    const sorted = API.Product.sortProdGroup(localOpList, list);

    this.renderTitleBtn();

    this.props.action.product.setSortedProdList(sorted);

    this.setState({
      scene: {
        asia: API.Product.filterByCategory(sorted, asia),
        europe: API.Product.filterByCategory(sorted, europe),
        usaAu: API.Product.filterByCategory(sorted, usaAu),
        multi: API.Product.filterByCategory(sorted, multi),
      },
    });
  }

  notification(type: string, payload, isForeground = true) {
    const {mobile, iccid, loggedIn} = this.props.account;
    const {navigation} = this.props;

    if (loggedIn) {
      this.props.action.noti.getNotiList({mobile});
    }

    const pushNotiHandler = createHandlePushNoti(navigation, payload, {
      mobile,
      iccid,
      isForeground,
      isRegister: type === 'register',
      updateAccount: this.props.action.account.updateAccount,
      clearCurrentAccount: () => {
        Promise.all([
          this.props.action.cart.reset(),
          this.props.action.order.reset(),
          this.props.action.noti.reset(),
          this.props.action.account.logout(),
        ]).then(() => {
          if (Platform.OS === 'ios')
            PushNotificationIOS.setApplicationIconBadgeNumber(0);
          else ShortcutBadge.setCount(0);
        });
      },
    });
    pushNotiHandler.sendLog();
    pushNotiHandler.handleNoti();
  }

  renderTitleBtn() {
    const {navigation} = this.props;
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
            key="cnter"
            style={styles.btnCnter}
            onPress={() => navigation?.navigate('Contact')}
            iconName="btnCnter"
          />

          {/* //BadgeAppButton을 사용했을 때 위치가 변동됨 수정이 필요함 */}
          <BadgeAppButton
            key="alarm"
            style={styles.btnAlarm}
            onPress={() => navigation?.navigate('Noti', {mode: 'noti'})}
            iconName="btnAlarm"
          />
        </View>
      ),
    });
  }

  renderNotiModal() {
    const {popUp, closeType, popUpVisible, checked} = this.state;

    return (
      <AppModal
        titleStyle={styles.infoModalTitle}
        title={popUp?.title}
        closeButtonTitle={i18n.t(closeType || 'close')}
        type={closeType === 'redirect' ? closeType : 'close'}
        closeButtonStyle={
          closeType === 'redirect' ? {flex: 1, margin: 20} : {margin: 20}
        }
        onOkClose={() => {
          this.exitApp(closeType);
          if (checked)
            AsyncStorage.setItem(
              'popupDisabled',
              moment().format('YYYY-MM-DD HH:mm'),
            );
        }}
        onCancelClose={() => {
          this.setState({popUpVisible: false});
          if (checked)
            AsyncStorage.setItem(
              'popupDisabled',
              moment().format('YYYY-MM-DD HH:mm'),
            );
        }}
        visible={popUpVisible}>
        <View style={{marginHorizontal: 20}}>
          <AppUserPic
            url={popUp?.notice?.image?.noti}
            crop={false}
            style={styles.popupImg}
            onPress={() => {
              if (closeType === 'redirect') {
                this.exitApp(closeType);
              }
            }}
          />
          <Pressable
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => this.setState({checked: !checked})}>
            <AppButton
              iconName="btnCheck"
              style={{marginRight: 10}}
              checked={checked}
              onPress={() => this.setState({checked: !checked})}
            />
            <AppText>{i18n.t('home:disablePopup')}</AppText>
          </Pressable>
        </View>
      </AppModal>
    );
  }

  render() {
    const {isSupportDev, index, routes, popupDisabled} = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <PromotionCarousel />

        <AppButton
          key="search"
          title={i18n.t('home:searchPlaceholder')}
          style={styles.showSearchBar}
          titleStyle={[appStyles.normal16Text, {color: colors.clearBlue}]}
          direction="row"
          onPress={() => this.props.navigation.navigate('StoreSearch')}
          iconName="btnSearchBlue"
          iconStyle={{marginHorizontal: 24}}
        />

        <TabHeader
          index={index}
          routes={routes}
          onIndexChange={this.onIndexChange}
        />

        <TabView
          style={styles.container}
          sceneContainerStyle={{flex: 1}}
          navigationState={{index, routes}}
          renderScene={this.renderScene}
          onIndexChange={this.onIndexChange}
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
          onOkClose={() => this.exitApp('exit')}
          visible={!isSupportDev}>
          {this.modalBody()}
        </AppModal>
        {!popupDisabled && this.renderNotiModal()}
      </View>
    );
  }
}

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
