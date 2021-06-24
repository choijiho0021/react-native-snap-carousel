/* eslint-disable no-param-reassign */
import AsyncStorage from '@react-native-community/async-storage';
import {Set} from 'immutable';
import moment from 'moment';
import React, {Component, memo} from 'react';
import {
  Animated,
  Appearance,
  BackHandler,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';
import {PERMISSIONS, request} from 'react-native-permissions';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {TabView} from 'react-native-tab-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import messaging from '@react-native-firebase/messaging';
import {RootState} from '@/redux';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import {sliderWidth} from '@/constants/SliderEntry.style';
import StoreList from '@/components/StoreList';
import withBadge from '@/components/withBadge';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import * as cartActions from '@/redux/modules/cart';
import {actions as notiActions} from '@/redux/modules/noti';
import * as productActions from '@/redux/modules/product';
import {API, Country} from '@/submodules/rokebi-utils';
import createHandlePushNoti from '@/submodules/rokebi-utils/models/createHandlePushNoti';
import i18n from '@/utils/i18n';
import pushNoti from '@/utils/pushNoti';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {RkbPromotion} from '@/submodules/rokebi-utils/api/promotionApi';
import {ProductAction, ProductModelState} from '@/redux/modules/product';
import {SyncModelState} from '@/redux/modules/sync';
import {RkbProduct} from '@/submodules/rokebi-utils/api/productApi';
import {NotiAction} from '@/redux/noti/noti';
import TutorialScreen from './TutorialScreen';

const DOT_MARGIN = 6;
const INACTIVE_DOT_WIDTH = 6;
const ACTIVE_DOT_WIDTH = 20;

const BadgeAppButton = withBadge(
  ({noti}: RootState) => ({
    notReadNoti: noti.notiList.filter((elm) => elm.isRead === 'F').length,
  }),
  'notReadNoti',
)(AppButton);

const dotStyle = (
  width: Animated.Value | Animated.AnimatedInterpolation,
  marginLeft: number | Animated.AnimatedInterpolation,
  backgroundColor: string = colors.clearBlue,
) => ({
  height: 6,
  borderRadius: 3.5,
  width,
  marginLeft,
  backgroundColor,
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  pagination: {
    marginRight: 30,
    alignSelf: 'flex-end',
  },
  paginationContainer: {
    paddingVertical: 5,
    paddingHorizontal: 0,
  },
  inactiveDot: {
    width: INACTIVE_DOT_WIDTH,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lightGrey,
    marginLeft: DOT_MARGIN,
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
  whiteBackground: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imgRatio: {
    // figure out your image aspect ratio
    aspectRatio: 335 / 100,
    width: '100%',
  },
});

const PromotionImage0 = ({
  item,
  onPress,
}: {
  item: RkbPromotion;
  onPress: (i: RkbPromotion) => void;
}) => {
  return (
    <TouchableOpacity
      style={{paddingHorizontal: 20}}
      onPress={() => onPress(item)}>
      {_.isEmpty(item.imageUrl) ? (
        <Text style={appStyles.normal16Text}>{item.title}</Text>
      ) : (
        <Image
          source={{uri: API.default.httpImageUrl(item.imageUrl)}}
          style={styles.imgRatio}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};
const PromotionImage = memo(PromotionImage0);

async function requestPermission() {
  if (Platform.OS === 'ios') {
    await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    await messaging().requestPermission();
    await requestTrackingPermission();
  } else if (Platform.OS === 'android') {
    await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    await requestTrackingPermission();
  }
}

function filterByCategory(list: RkbProduct[][], key: string) {
  const filtered = list.filter(
    (elm) => elm.length > 0 && elm[0].categoryId.includes(key),
  );

  return API.Product.toColumnList(filtered);
}

type HomeScreenEsimProps = {
  promotion: RkbPromotion[];
  product: ProductModelState;
  account: AccountModelState;
  sync: SyncModelState;
  action: {
    product: ProductAction;
    account: AccountAction;
    noti: NotiAction;
  };
};

type ProductByCategory = {
  key: string;
  data: RkbProduct[][];
};

const initialState = {
  isSupportDev: true,
  index: 0,
  activeSlide: 0,
  routes: [
    {key: 'asia', title: i18n.t('store:asia'), category: '아시아'},
    {key: 'europe', title: i18n.t('store:europe'), category: '유럽'},
    {key: 'usaAu', title: i18n.t('store:usa/au'), category: '미주/호주'},
    {key: 'multi', title: i18n.t('store:multi'), category: '복수 국가'},
  ],
  allData: [] as RkbProduct[][],
  asia: [] as ProductByCategory[],
  europe: [] as ProductByCategory[],
  usaAu: [] as ProductByCategory[],
  multi: [] as ProductByCategory[],
  firstLaunch: false,
  darkMode: Appearance.getColorScheme(),
  time: moment(),
};

type HomeScreenEsimState = typeof initialState & {
  deviceList?: string[];
  firstLaunch?: boolean;
};

class HomeScreenEsim extends Component<
  HomeScreenEsimProps,
  HomeScreenEsimState
> {
  offset: number;

  controller: AbortController;

  scrollRef: React.RefObject<ScrollView>;

  constructor(props: HomeScreenEsimProps) {
    super(props);

    this.state = initialState;

    this.refresh = this.refresh.bind(this);
    this.renderTitleBtn = this.renderTitleBtn.bind(this);
    this.getProdGroup = this.getProdGroup.bind(this);
    this.sortProdGroup = this.sortProdGroup.bind(this);
    this.onIndexChange = this.onIndexChange.bind(this);
    this.onPressItem = this.onPressItem.bind(this);
    this.onPressPromotion = this.onPressPromotion.bind(this);
    this.renderDots = this.renderDots.bind(this);
    this.notification = this.notification.bind(this);
    this.init = this.init.bind(this);
    this.modalBody = this.modalBody.bind(this);
    this.checkFistLaunch = this.checkFistLaunch.bind(this);
    this.tabHeader = this.tabHeader.bind(this);

    this.offset = 0;
    this.controller = new AbortController();
    this.scrollRef = React.createRef<ScrollView>();
  }

  componentDidMount() {
    this.setState({time: moment()});

    API.Device.getDevList().then((resp) => {
      if (resp.result === 0) {
        const deviceModel = DeviceInfo.getModel();
        const deviceName = DeviceInfo.getDeviceId();

        const isSupportDev =
          resp.objects.includes(deviceModel) || deviceName === 'iPhone12,8'; // (2nd Generation iPhone SE)
        this.setState({
          deviceList: resp.objects,
          isSupportDev,
        });

        this.renderTitleBtn();
        if (isSupportDev) {
          pushNoti.add(this.notification);

          this.refresh();

          requestPermission();

          this.checkFistLaunch();
        }
      }
    });

    // 로그인 여부에 따라 달라지는 부분
    this.init();
  }

  componentDidUpdate(prevProps: HomeScreenEsimProps) {
    const focus = this.props.navigation.isFocused();
    const now = moment();
    const diff = moment.duration(now.diff(this.state.time)).asMinutes();

    if (diff > 60 && focus) {
      this.setState({time: now});
      this.props.action.product.getProdList();
    }

    if (
      prevProps.product.prodList !== this.props.product.prodList ||
      (diff > 0.2 && this.props.product.sortedProdList.length === 0)
    ) {
      this.refresh();
    }

    if (prevProps.account.iccid !== this.props.account.iccid) {
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

  onPressItem = (prodOfCountry: RkbProduct[]) => {
    this.props.action.product.setProdOfCountry(prodOfCountry);
    this.props.navigation.navigate('Country');
  };

  onIndexChange = (index: number) => {
    this.setState({
      index,
    });
    this.scrollRef.current?.scrollTo({x: 0, y: 0, animated: false});
  };

  onPressPromotion(item: RkbPromotion) {
    if (item.product_uuid) {
      const {prodList} = this.props.product;
      const prod = prodList.get(item.product_uuid);

      if (prod) {
        const prodOfCountry = prodList
          .filter((p) => _.isEqual(p.partnerId, prod.partnerId))
          .toList()
          .toArray();
        this.props.navigation.navigate('Country', {prodOfCountry});
      }
    } else if (item.notice) {
      this.props.navigation.navigate('SimpleText', {
        key: 'noti',
        title: i18n.t('set:noti'),
        bodyTitle: item.notice.title,
        body: item.notice.body,
        mode: 'noti',
      });
    } else {
      this.props.navigation.navigate('Faq');
    }
  }

  getProdGroup() {
    const {prodList, localOpList} = this.props.product;
    const list: RkbProduct[][] = [];

    prodList
      .valueSeq()
      .toArray()
      .forEach((item) => {
        if (localOpList.has(item.partnerId)) {
          const localOp = localOpList.get(item.partnerId);
          item.ccodeStr = (localOp?.ccode || []).join(',');
          item.cntry = Set(Country.getName(localOp?.ccode));
          item.search = [...item.cntry].join(',');
          item.pricePerDay =
            item.price && item.days
              ? Math.round(item.price / item.days / 10) * 10
              : 0;

          const idxCcode = list.findIndex(
            (elm) => elm.length > 0 && elm[0].ccodeStr === item.ccodeStr,
          );

          if (idxCcode < 0) {
            // new item, insert it
            list.push([item]);
          } else {
            // 이미 같은 country code를 갖는 데이터가 존재하면, 그 아래에 추가한다. (2차원 배열)
            list[idxCcode].push(item);
          }
        }
      });

    return list;
  }

  exitApp = () => {
    if (Platform.OS === 'ios') {
      RNExitApp.exitApp();
    } else {
      BackHandler.exitApp();
    }
  };

  renderScene = ({route: {key}}) => {
    const {index, routes, activeSlide} = this.state;
    const data = this.state[key];

    if (
      key !== routes[index].key ||
      this.props.product.sortedProdList.length === 0
    ) {
      return <AppActivityIndicator style={{top: 100}} />;
    }

    return (
      <StoreList
        data={data}
        onPress={this.onPressItem}
        refreshTrigger={activeSlide}
      />
    );
  };

  modalBody = () => {
    const {deviceList} = this.state;

    return (
      <View style={styles.modalBody}>
        <View style={{marginBottom: 10}}>
          <Text style={appStyles.normal16Text}>
            {i18n.t('home:unsupportedBody1')}
            <Text style={styles.normal16BlueText}>
              {i18n.t('home:unsupportedBody2')}
            </Text>
            <Text style={appStyles.normal16Text}>
              {i18n.t('home:unsupportedBody3')}
            </Text>
          </Text>
        </View>
        <Text style={appStyles.normal16Text}>
          {i18n.t('home:unsupportedBody4')}
        </Text>
        <Text style={styles.supportDevTitle}>
          {i18n.t('home:supportedDevice')}
        </Text>

        <View
          style={{
            backgroundColor: colors.whiteTwo,
            paddingVertical: 15,
            paddingHorizontal: 15,
          }}>
          <Text style={[appStyles.normal16Text, {lineHeight: 24}]}>
            {deviceList && deviceList.join(', ')}
            {i18n.t('home:supportedDeviceBody')}
          </Text>
        </View>
      </View>
    );
  };

  pagination() {
    const {activeSlide} = this.state;
    const {promotion} = this.props;

    return (
      <View style={styles.pagination}>
        <Pagination
          dotsLength={promotion.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          renderDots={this.renderDots}
        />
      </View>
    );
  }

  sortProdGroup(list: RkbProduct[][]) {
    const {localOpList} = this.props.product;

    const getMaxWeight = (item: RkbProduct[]) =>
      Math.max(...item.map((p) => localOpList.get(p.partnerId)?.weight || 0));

    return list
      .map((item) =>
        item.sort((a, b) => {
          // 동일 국가내의 상품을 정렬한다.
          // field_daily == true 인 무제한 상품 우선, 사용 날짜는 오름차순
          if (a.field_daily) return b.field_daily ? a.days - b.days : -1;
          return b.field_daily ? 1 : a.days - b.days;
        }),
      )
      .sort((a, b) => {
        // 국가는 weight 값이 높은 순서가 우선, weight 값이 같으면 이름 순서
        const weightA = getMaxWeight(a);
        const weightB = getMaxWeight(b);
        if (weightA === weightB) {
          return a[0].search < b[0].search ? -1 : 1;
        }
        return weightB - weightA;
      });
  }

  init() {
    const {mobile, loggedIn} = this.props.account;

    if (loggedIn) {
      this.props.action.noti.getNotiList(mobile);
      this.props.action.cart.cartFetch();
    } else {
      this.props.action.noti.init();
    }
  }

  refresh() {
    const {asia, europe, usaAu, multi} = API.Product.category;

    const list = this.getProdGroup();

    const sorted = this.sortProdGroup(list);

    this.renderTitleBtn();

    this.props.action.product.setSortedProdList(sorted);

    this.setState({
      allData: sorted,
      asia: filterByCategory(sorted, asia),
      europe: filterByCategory(sorted, europe),
      usaAu: filterByCategory(sorted, usaAu),
      multi: filterByCategory(sorted, multi),
    });
  }

  checkFistLaunch() {
    // 앱 첫 실행 여부 확인
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        this.setState({firstLaunch: true});
      } else {
        this.setState({firstLaunch: false});
      }
    });
  }

  notification(type: string, payload, isForeground = true) {
    const {mobile, iccid, loggedIn} = this.props.account;
    const {navigation} = this.props;

    if (loggedIn) {
      this.props.action.noti.getNotiList(mobile);
    }

    const pushNotiHandler = createHandlePushNoti(navigation, payload, {
      mobile,
      iccid,
      isForeground,
      isRegister: type === 'register',
      updateAccount: this.props.action.account.updateAccount,
      clearCurrentAccount: this.props.action.account.clearCurrentAccount,
    });
    pushNotiHandler.sendLog();
    pushNotiHandler.handleNoti();
  }

  tabHeader() {
    const {index, routes} = this.state;
    return (
      <View style={styles.whiteTwoBackground}>
        <View style={styles.tabView}>
          {routes.map((elm, idx) => (
            <AppButton
              key={elm.key + idx}
              style={styles.whiteTwoBackground}
              titleStyle={[
                styles.normal16WarmGrey,
                idx === index ? styles.boldClearBlue : {},
              ]}
              title={elm.category}
              // title={i18n.t(`prodDetail:${elm}`)}
              onPress={() => this.onIndexChange(idx)}
            />
          ))}
        </View>
      </View>
    );
  }

  renderDots(activeIndex: number) {
    const {promotion} = this.props;
    const duration = 200;
    const width = new Animated.Value(INACTIVE_DOT_WIDTH);
    const margin = width.interpolate({
      inputRange: [INACTIVE_DOT_WIDTH, ACTIVE_DOT_WIDTH],
      outputRange: [ACTIVE_DOT_WIDTH, INACTIVE_DOT_WIDTH],
    });

    Animated.timing(width, {
      toValue: ACTIVE_DOT_WIDTH,
      duration,
      useNativeDriver: false,
    }).start();

    if (activeIndex === 0) {
      return promotion.map((_, idx) =>
        idx === 0 ? (
          <Animated.View key={idx.toString()} style={dotStyle(width, margin)} />
        ) : (
          <View key={idx.toString()} style={styles.inactiveDot} />
        ),
      );
    }

    return promotion.map((_, idx) => {
      if (activeIndex === idx)
        return (
          <Animated.View
            key={idx.toString()}
            style={dotStyle(width, DOT_MARGIN, colors.clearBlue)}
          />
        );

      return activeIndex === (idx + 1) % promotion.length ? (
        <Animated.View
          key={idx.toString()}
          style={dotStyle(margin, DOT_MARGIN, colors.lightGrey)}
        />
      ) : (
        <View key={idx.toString()} style={styles.inactiveDot} />
      );
    });
  }

  renderTitleBtn() {
    const {navigation} = this.props;
    navigation?.setOptions({
      title: null,
      headerLeft: () => <Text style={styles.title}>{i18n.t('esim')}</Text>,
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

  renderCarousel() {
    return (
      <View style={styles.carousel}>
        <Carousel
          data={this.props.promotion}
          renderItem={({item}) => (
            <PromotionImage item={item} onPress={this.onPressPromotion} />
          )}
          autoplay
          loop
          lockScrollWhileSnapping
          useScrollView={false}
          onSnapToItem={(index) => this.setState({activeSlide: index})}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
        />
        {this.pagination()}
      </View>
    );
  }

  render() {
    const {isSupportDev, firstLaunch, darkMode} = this.state;
    return (
      <View style={styles.whiteBackground}>
        <TutorialScreen
          visible={firstLaunch}
          onOkClose={() => this.setState({firstLaunch: false})}
        />
        {this.renderCarousel()}
        <ScrollView
          ref={this.scrollRef}
          // contentContainerStyle={appStyles.container}
          style={styles.scrollView}
          stickyHeaderIndices={[1]}>
          <StatusBar barStyle={darkMode ? 'dark-content' : 'light-content'} />
          {/* ScrollView  stickyHeaderIndices로 상단 탭을 고정하기 위해서 View한번 더 사용 */}
          {this.tabHeader()}
          <TabView
            style={styles.container}
            navigationState={this.state}
            renderScene={this.renderScene}
            onIndexChange={this.onIndexChange}
            initialLayout={{width: Dimensions.get('window').width, height: 10}}
            titleStyle={appStyles.normal16Text}
            indicatorStyle={{backgroundColor: 'white'}}
            renderTabBar={() => null}
          />

          <AppModal
            title={i18n.t('home:unsupportedTitle')}
            closeButtonTitle={i18n.t('home:exitApp')}
            titleStyle={styles.modalTitle}
            type="close"
            onOkClose={this.exitApp}
            visible={!isSupportDev}>
            {this.modalBody()}
          </AppModal>
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  ({account, product, info, promotion, sync}: RootState) => ({
    account,
    product,
    info,
    promotion: promotion.promotion,
    sync,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(HomeScreenEsim);
