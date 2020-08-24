import React, {Component, PureComponent, createFactory} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  BackHandler,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import TutorialScreen from './TutorialScreen';
import * as productActions from '../redux/modules/product';
import * as accountActions from '../redux/modules/account';
import * as notiActions from '../redux/modules/noti';
import * as cartActions from '../redux/modules/cart';
import _ from 'underscore';
import {bindActionCreators} from 'redux';
import {TabView} from 'react-native-tab-view';
import {colors} from '../constants/Colors';
import AppButton from '../components/AppButton';
import StoreList from '../components/StoreList';
import moment from 'moment';
import {Set} from 'immutable';
import {API, Country} from 'RokebiESIM/submodules/rokebi-utils';
import {sliderWidth, windowHeight} from '../constants/SliderEntry.style';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import withBadge from '../components/withBadge';
import pushNoti from '../utils/pushNoti';
import AsyncStorage from '@react-native-community/async-storage';
import AppModal from '../components/AppModal';
import RNExitApp from 'react-native-exit-app';
import DeviceInfo from 'react-native-device-info';
import {
  requestNotifications,
  PERMISSIONS,
  request,
} from 'react-native-permissions';

const size =
  windowHeight > 810
    ? {
        userInfoHeight: 110,
        userInfoMarginTop: 30,
        userPic: 60,
        carouselHeight: 225,
        carouselMargin: 0,
      }
    : {
        userInfoHeight: 96,
        userInfoMarginTop: 20,
        userPic: 50,
        carouselHeight: 190,
        carouselMargin: 20,
      };

const DOT_MARGIN = 6;
const INACTIVE_DOT_WIDTH = 6;
const ACTIVE_DOT_WIDTH = 20;

const BadgeAppButton = withBadge(
  ({notReadNoti}) => notReadNoti,
  {badgeStyle: {right: -3, top: 0}},
  state => ({
    notReadNoti: state.noti.get('notiList').filter(elm => elm.isRead == 'F')
      .length,
  }),
)(AppButton);

class PromotionImage extends PureComponent {
  render() {
    const {item} = this.props;
    return (
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => this.props.onPress(item)}>
        {_.isEmpty(item.imageUrl) ? (
          <Text style={appStyles.normal16Text}>{item.title}</Text>
        ) : (
          <Image
            source={{uri: API.default.httpImageUrl(item.imageUrl)}}
            style={{height: size.carouselHeight}}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    );
  }
}

class HomeScreenEsim extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSupportDev: true,
      index: 0,
      activeSlide: 0,
      routes: [
        {key: 'asia', title: i18n.t('store:asia'), category: '아시아'},
        {key: 'europe', title: i18n.t('store:europe'), category: '유럽'},
        {key: 'usaAu', title: i18n.t('store:usa/au'), category: '미주/호주'},
        {key: 'multi', title: i18n.t('store:multi'), category: '복수 국가'},
      ],
      allData: [],
      asia: [],
      europe: [],
      usaAu: [],
      multi: [],
    };

    this._refresh = this._refresh.bind(this);
    this._onIndexChange = this._onIndexChange.bind(this);
    this._onPressItem = this._onPressItem.bind(this);
    this._onPressPromotion = this._onPressPromotion.bind(this);
    this._renderPromotion = this._renderPromotion.bind(this);
    this._renderDots = this._renderDots.bind(this);
    this._clickTab = this._clickTab.bind(this);
    this._notification = this._notification.bind(this);
    this._init = this._init.bind(this);
    this._handleNotification = this._handleNotification.bind(this);
    this._modalBody = this._modalBody.bind(this);
    this.requestPermission = this.requestPermission.bind(this);
    this.checkFistLaunch = this.checkFistLaunch.bind(this);
    this.getSupportDev = this.getSupportDev.bind(this);
    this.offset = 0;
    this.controller = new AbortController();
  }

  componentDidMount() {
    const now = moment();

    pushNoti.add(this._notification);

    this.setState({time: now});

    this._refresh();

    this.requestPermission();

    this.checkFistLaunch();

    this.getSupportDev();

    // 로그인 여부에 따라 달라지는 부분
    this._init();
  }

  getSupportDev() {
    API.Device.getDevList().then(resp => {
      if (resp.result == 0) {
        DeviceInfo.getDeviceName().then(deviceName => {
          this.setState({
            deviceList: resp.objects,
            isSupportDev: resp.objects.includes(deviceName),
          });
        });
      }
    });
  }
  checkFistLaunch() {
    // 앱 첫 실행 여부 확인
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        this.setState({firstLaunch: true});
      } else {
        this.setState({firstLaunch: false});
      }
    });
  }

  async requestPermission() {
    if (Platform.OS == 'ios') {
      await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      await requestNotifications(['alert', 'sound', 'badge']);
    } else if (Platform.OS == 'android') {
      await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    }
  }

  componentDidUpdate(prevProps) {
    const focus = this.props.navigation.isFocused();
    const now = moment();
    const diff = moment.duration(now.diff(this.state.time)).asMinutes();

    if (diff > 60 && focus) {
      this.setState({time: now});
      this.props.action.product.getProdList();
    }

    if (prevProps.product.prodList != this.props.product.prodList) {
      this._refresh();
    }

    if (prevProps.account.iccid != this.props.account.iccid) {
      this._init();
    }

    if (this.props.sync.progress) {
      this.props.navigation.navigate('CodePush');
    }
  }

  _notification(type, data, isForeground = true) {
    const {mobile, loggedIn} = this.props.account;

    if (loggedIn) {
      this.props.action.noti.getNotiList(mobile);
    }

    switch (type) {
      case 'register':
        this.props.action.account.updateAccount({
          deviceToken: data,
        });
        break;
      case 'notification':
        this._handleNotification(data, isForeground);
    }
  }

  _handleNotification(payload, isForeground) {
    const type = (payload.data || {}).notiType;
    const target = (payload.data || {}).iccid;
    const {mobile, iccid} = this.props.account;

    if (mobile && _.size(payload) > 0) {
      if (Platform.OS === 'ios') {
        let msg = JSON.stringify(payload);
        this.props.action.noti.sendLog(mobile, msg);
      }
    }

    switch (type) {
      case 'account':
        if (typeof iccid !== 'undefined' && iccid === target) {
          if (!this._isNoticed) {
            this._isNoticed = true;
            AppAlert.info(
              i18n.t('acc:disconnectSim'),
              i18n.t('noti'),
              this._clearAccount,
            );
          }
        } else {
          !isForeground && this.props.navigation.navigate('Noti');
        }

        break;
      default:
        !isForeground && this.props.navigation.navigate('Noti');
    }
  }

  _refresh() {
    const {asia, europe, usaAu, multi} = API.Product.category,
      {prodList, localOpList} = this.props.product,
      list = [];

    for (let item of prodList.values()) {
      if (localOpList.has(item.partnerId)) {
        const localOp = localOpList.get(item.partnerId);
        item.ccodeStr = (localOp.ccode || []).join(',');
        item.cntry = Set(Country.getName(localOp.ccode));
        item.search = [...item.cntry].join(',');
        item.pricePerDay = Math.round(item.price / item.days);

        const idxCcode = list.findIndex(
          elm => elm.length > 0 && elm[0].ccodeStr == item.ccodeStr,
        );

        if (idxCcode < 0) {
          // new item, insert it
          list.push([item]);
        } else {
          // 이미 같은 country code를 갖는 데이터가 존재하면, 그 아래에 추가한다. (2차원 배열)
          list[idxCcode].push(item);
        }
      }
    }

    const getMaxWeight = list =>
      Math.max(...list.map(p => (localOpList.get(p.partnerId) || {}).weight));

    const sorted = list
      .map(item =>
        item.sort((a, b) => {
          // 동일 국가내의 상품을 정렬한다.
          // field_daily == true 인 무제한 상품 우선, 사용 날짜는 오름차순
          if (a.field_daily) return b.field_daily ? a.days - b.days : -1;
          return b.field_daily ? 1 : a.days - b.days;
        }),
      )
      .sort((a, b) => {
        // 국가는 weight 값이 높은 순서가 우선, weight 값이 같으면 이름 순서
        const weightA = getMaxWeight(a),
          weightB = getMaxWeight(b);
        return weightA == weightB
          ? a[0].search < b[0].search
            ? -1
            : 1
          : weightB - weightA;
      });

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <Text style={styles.title}>{i18n.t('esim')}</Text>,
      headerRight: () => (
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <AppButton
            key="search"
            style={styles.btnSearchBar}
            onPress={() => this.props.navigation.navigate('StoreSearch')}
            iconName="btnSearchTop"
          />

          <AppButton
            key="cnter"
            style={styles.btnCnter}
            onPress={() => this.props.navigation.navigate('Contact')}
            iconName="btnCnter"
          />

          {/* //BadgeAppButton을 사용했을 때 위치가 변동됨 수정이 필요함 */}
          <BadgeAppButton
            key="alarm"
            style={styles.btnAlarm}
            onPress={() =>
              this.props.navigation.navigate('Noti', {mode: 'noti'})
            }
            iconName="btnAlarm"
          />
        </View>
      ),
    });

    this.props.action.product.setSortedProdList(sorted);

    this.setState({
      allData: sorted,
      asia: this.filterByCategory(sorted, asia),
      europe: this.filterByCategory(sorted, europe),
      usaAu: this.filterByCategory(sorted, usaAu),
      multi: this.filterByCategory(sorted, multi),
    });
  }

  filterByCategory(list, key) {
    const filtered = list.filter(
      elm => elm.length > 0 && elm[0].categoryId.includes(key),
    );

    return API.Product.toColumnList(filtered);
  }

  _onPressItem = prodOfCountry => {
    this.props.action.product.setProdOfCountry(prodOfCountry);
    this.props.navigation.navigate('Country');
  };

  _init() {
    const {mobile, loggedIn} = this.props.account;

    if (loggedIn) {
      this.props.action.noti.getNotiList(mobile);
      this.props.action.cart.cartFetch();
    }
  }

  renderScene = props => {
    return (
      <StoreList
        data={this.state[props.route.key]}
        onPress={this._onPressItem}
      />
    );
  };

  _onIndexChange(index) {
    this.setState({
      index,
    });
  }

  _renderPromotion({item}) {
    return <PromotionImage item={item} onPress={this._onPressPromotion} />;
  }

  _pagination() {
    const {activeSlide} = this.state,
      {promotion} = this.props;

    return (
      <View style={styles.pagination}>
        <Pagination
          dotsLength={promotion.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          renderDots={this._renderDots}
        />
      </View>
    );
  }

  _renderDots(activeIndex) {
    const {promotion} = this.props,
      duration = 200,
      width = new Animated.Value(INACTIVE_DOT_WIDTH),
      margin = width.interpolate({
        inputRange: [INACTIVE_DOT_WIDTH, ACTIVE_DOT_WIDTH],
        outputRange: [ACTIVE_DOT_WIDTH, INACTIVE_DOT_WIDTH],
      });

    Animated.timing(width, {
      toValue: ACTIVE_DOT_WIDTH,
      duration,
      useNativeDriver: false,
    }).start();

    if (activeIndex == 0) {
      return promotion.map((_, idx) =>
        idx == 0 ? (
          <Animated.View key={idx + ''} style={styles.dot(width, margin)} />
        ) : (
          <View key={idx + ''} style={styles.inactiveDot} />
        ),
      );
    }

    return promotion.map((_, idx) =>
      activeIndex == idx ? (
        <Animated.View
          key={idx + ''}
          style={styles.dot(width, DOT_MARGIN, colors.clearBlue)}
        />
      ) : activeIndex == (idx + 1) % promotion.length ? (
        <Animated.View
          key={idx + ''}
          style={styles.dot(margin, DOT_MARGIN, colors.lightGrey)}
        />
      ) : (
        <View key={idx + ''} style={styles.inactiveDot} />
      ),
    );
  }

  _onPressPromotion(item) {
    if (item.product_uuid) {
      const prodList = this.props.product.prodList,
        prod = prodList.get(item.product_uuid);

      if (prod) {
        const prodOfCountry = prodList
          .filter(item => _.isEqual(item.partnerId, prod.partnerId))
          .toList()
          .toArray();
        this.props.navigation.navigate('Country', {prodOfCountry});
      }
    } else if (item.notice) {
      this.props.navigation.navigate('SimpleText', {
        key: 'noti',
        title: i18n.t('set:noti'),
        bodyTitle: item.notice.title,
        text: item.notice.body,
        mode: 'text',
      });
    }
  }

  _clickTab = idx => () => {
    this.setState({index: idx});
  };

  _modalBody = () => () => {
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

  exitApp = () => {
    if (Platform.OS === 'ios') {
      RNExitApp.exitApp();
    } else {
      BackHandler.exitApp();
    }
  };

  renderCarousel() {
    return (
      <View style={styles.carousel}>
        <Carousel
          data={this.props.promotion}
          renderItem={this._renderPromotion}
          autoplay={true}
          loop={true}
          lockScrollWhileSnapping={true}
          useScrollView={false}
          onSnapToItem={index => this.setState({activeSlide: index})}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
        />
        {this._pagination()}
      </View>
    );
  }
  render() {
    const {index, routes, isSupportDev} = this.state;
    return (
      <ScrollView
        // contentContainerStyle={appStyles.container}
        style={styles.scrollView}
        stickyHeaderIndices={[1]}>
        {this.state.firstLaunch && <TutorialScreen />}
        {this.renderCarousel()}
        {/* ScrollView  stickyHeaderIndices로 상단 탭을 고정하기 위해서 View한번 더 사용*/}
        <View style={styles.whiteTwoBackground}>
          <View style={styles.tabView}>
            {routes.map((elm, idx) => (
              <AppButton
                key={elm.key + idx}
                style={styles.whiteTwoBackground}
                titleStyle={[
                  styles.normal16WarmGrey,
                  idx == index ? styles.boldClearBlue : {},
                ]}
                title={elm.category}
                // title={i18n.t(`prodDetail:${elm}`)}
                onPress={this._clickTab(idx)}
              />
            ))}
          </View>
        </View>
        <TabView
          style={styles.container}
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={this._onIndexChange}
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
          body={this._modalBody()}
          onOkClose={this.exitApp}
          visible={!isSupportDev}
        />
      </ScrollView>
    );
  }
}

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
    alignItems: 'flex-end',
    height: size.carouselHeight,
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
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  paginationContainer: {
    paddingVertical: 5,
    paddingHorizontal: 0,
    justifyContent: 'flex-end',
  },
  dot: (
    width = ACTIVE_DOT_WIDTH,
    marginLeft = DOT_MARGIN,
    backgroundColor = colors.clearBlue,
  ) => ({
    height: 6,
    borderRadius: 3.5,
    width,
    marginLeft,
    backgroundColor,
  }),
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
    flex: 1,
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
});

const mapStateToProps = state => ({
  account: state.account.toJS(),
  product: state.product.toObject(),
  info: state.info.toJS(),
  promotion: state.promotion.get('promotion'),
  sync: state.sync.toJS(),
});

export default connect(
  mapStateToProps,
  dispatch => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(HomeScreenEsim);
