import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
  Appearance,
  Animated,
  ColorSchemeName,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {
  requestNotifications,
  PERMISSIONS,
  request,
} from 'react-native-permissions';
import Analytics from 'appcenter-analytics';
import _ from 'underscore';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {actions as simActions} from '@/redux/modules/sim';
import {actions as accountActions} from '@/redux/modules/account';
import {actions as notiActions, NotiAction} from '@/redux/modules/noti';
import {actions as infoActions} from '@/redux/modules/info';
import {actions as cartActions} from '@/redux/modules/cart';
import {actions as productActions} from '@/redux/modules/product';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppButton from '@/components/AppButton';
import {sliderWidth, windowHeight} from '@/constants/SliderEntry.style';
import {colors} from '@/constants/Colors';
import AppIcon from '@/components/AppIcon';
import AppUserPic from '@/components/AppUserPic';
import withBadge from '@/components/withBadge';
import AppPrice from '@/components/AppPrice';
import pushNoti from '@/utils/pushNoti';
import AppAlert from '@/components/AppAlert';
import appStateHandler from '@/utils/appState';
import PromotionImage from '@/components/PromotionImage';
import {RootState} from '@/redux';
import TutorialScreen from './TutorialScreen';

// windowHeight
// iphone 8 - 375x667
// iphone 11 pro  - 375x812, 2436×1125
// iphone 11 pro max - 414x896, 2688×1242
// 190 ~ 210 사이의 크기로 정리됨
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  infoText: {
    ...appStyles.normal14Text,
    color: colors.black,
    marginLeft: 8,
  },
  info: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  divider: {
    marginTop: 40,
    marginHorizontal: 20,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
  },
  userPicture: {
    width: size.userPic,
    height: size.userPic,
  },
  bar: {
    width: 1,
    height: 20,
    borderRadius: 2,
    backgroundColor: colors.lightGrey,
  },
  rightArrow1: {
    width: 15,
    height: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.clearBlue,
    alignSelf: 'center',
  },
  rightArrow2: {
    width: 0,
    height: 0,
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderBottomWidth: 6,
    borderBottomColor: colors.clearBlue,
    alignSelf: 'center',
  },
  checkGuide: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    textAlign: 'left',
  },
  roundBox: {
    width: 128,
    height: 40,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    paddingVertical: 13,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  guide: {
    marginTop: 40,
    marginHorizontal: 20,
    height: 100,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  menu: {
    marginHorizontal: 20,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  menuBox: {
    height: 70,
    width: 70,
    justifyContent: 'center',
  },
  menuText: {
    ...appStyles.normal15Text,
    marginTop: 8,
    textAlign: 'center',
    color: colors.black,
  },
  userInfo: {
    height: size.userInfoHeight,
    borderRadius: 5,
    backgroundColor: colors.white,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 3,
    shadowRadius: 14,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ebebeb',
    marginHorizontal: 20,
    marginTop: size.userInfoMarginTop,
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 23,
  },
  overlay: {
    marginLeft: size.carouselMargin,
  },
  carousel: {
    alignItems: 'flex-end',
  },
  inactiveDot: {
    width: INACTIVE_DOT_WIDTH,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lightGrey,
    marginLeft: DOT_MARGIN,
  },
  pagination: {
    marginRight: 30,
    marginTop: 10,
  },
  paginationContainer: {
    paddingVertical: 5,
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
  },
  cardLayer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    ...appStyles.button,
  },
  image: {
    width: 60,
    height: 60,
    margin: 10,
  },
  text: {
    fontSize: 18,
    padding: 12,
    color: 'white',
    textAlign: 'center',
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
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
const dotStyle = (
  width: number = ACTIVE_DOT_WIDTH,
  marginLeft: number = DOT_MARGIN,
  backgroundColor: string = colors.clearBlue,
) => ({
  height: 6,
  borderRadius: 3.5,
  width,
  marginLeft,
  backgroundColor,
});

const BadgeAppButton = withBadge(
  ({noti}: RootState) => ({
    notReadNoti: noti.notiList.filter((elm) => elm.isRead === 'F').length,
  }),
  'notReadNoti',
)(AppButton);

type HomeScreenProps = {
  navigation: any;
  action: {
    noti: NotiAction;
  };
};
type HomeScreenState = {
  darkMode: ColorSchemeName;
  activeSlide: number;
  firstLaunch?: boolean;
};
class HomeScreen extends Component<HomeScreenProps, HomeScreenState> {
  constructor(props) {
    super(props);

    this.state = {
      darkMode: Appearance.getColorScheme(),
      activeSlide: 0,
      firstLaunch: undefined,
    };

    this.login = this.login.bind(this);
    this.init = this.init.bind(this);
    this.renderPromotion = this.renderPromotion.bind(this);
    this.navigate = this.navigate.bind(this);
    this.userInfo = this.userInfo.bind(this);
    this.notification = this.notification.bind(this);
    this.handleNotification = this.handleNotification.bind(this);
    this.clearAccount = this.clearAccount.bind(this);
    this.appStateHandler = this.appStateHandler.bind(this);
    this.onPressPromotion = this.onPressPromotion.bind(this);
    this.renderDots = this.renderDots.bind(this);
    this.renderInfo = this.renderInfo.bind(this);

    this.isNoticed = null;
  }

  async componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <Text style={styles.title}>{i18n.t('appTitle')}</Text>,
      headerRight: () => (
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
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

    Analytics.trackEvent('Page_View_Count', {page: 'Home'});
    // 로그인 여부와 관련 없이 항상 처리할 부분
    if (Platform.OS === 'ios') {
      await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      await request(PERMISSIONS.IOS.CAMERA);
      await requestNotifications(['alert', 'sound', 'badge']);
    } else if (Platform.OS === 'android') {
      await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      await request(PERMISSIONS.ANDROID.CAMERA);
    }

    // 앱 첫 실행 여부 확인
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        this.setState({firstLaunch: true});
      } else {
        this.setState({firstLaunch: false});
      }
    });
    // AsyncStorage.removeItem('alreadyLaunched')

    // config push notification
    pushNoti.add(this.notification);
    appStateHandler.add(this.appStateHandler);

    // 로그인 여부에 따라 달라지는 부분
    this.init();
  }

  componentDidUpdate(prevProps) {
    const {
      mobile,
      pin,
      iccid,
      loggedIn,
      deviceToken,
      isUsedByOther,
    } = this.props.account;

    if (mobile !== prevProps.account.mobile || pin !== prevProps.account.pin) {
      if (!_.isEmpty(mobile) && !loggedIn) {
        this.login(mobile, pin, iccid);
      }
    }

    //  자동로그인의 경우 device token update
    if (prevProps.account.deviceToken !== deviceToken && loggedIn) {
      this.props.action.account.changeNotiToken();
    }

    if (prevProps.account.loggedIn !== loggedIn) {
      this.init();
    }

    if (this.props.sync.progress) {
      this.props.navigation.navigate('CodePush');
    }

    if (
      isUsedByOther &&
      prevProps.account.isUsedByOther !== isUsedByOther &&
      !this.isNoticed
    ) {
      this.isNoticed = true;
      AppAlert.info(
        i18n.t('acc:disconnectSim'),
        i18n.t('noti'),
        this.clearAccount,
      );
    }
  }

  componentWillUnmount() {
    appStateHandler.remove();
  }

  handleNotification(payload, isForeground) {
    const type = (payload.data || {}).notiType;
    const target = (payload.data || {}).iccid;
    const {mobile, iccid} = this.props.account;

    //  무슨코드인지 확인필요
    if (mobile && _.size(payload) > 0) {
      if (Platform.OS === 'ios') {
        const msg = JSON.stringify(payload._data);
        this.props.action.noti.sendLog(mobile, msg);
      }
    }

    switch (type) {
      case 'account':
        if (typeof iccid !== 'undefined' && iccid === target) {
          if (!this.isNoticed) {
            this.isNoticed = true;
            AppAlert.info(
              i18n.t('acc:disconnectSim'),
              i18n.t('noti'),
              this.clearAccount,
            );
          }
        } else {
          // eslint-disable-next-line no-unused-expressions
          !isForeground && this.props.navigation.navigate('Noti');
        }
        break;
      default:
        // eslint-disable-next-line no-unused-expressions
        !isForeground && this.props.navigation.navigate('Noti');
    }
  }

  // 공지 사항 상세 페이지로 이동
  onPressInfo = ({title, body}) => () => {
    this.props.navigation.navigate('SimpleText', {
      key: 'noti',
      title: i18n.t('contact:noticeDetail'),
      bodyTitle: title,
      text: body,
      mode: 'text',
    });
  };

  onPressPromotion(item) {
    if (item.product_uuid) {
      const {prodList} = this.props.product;
      const prod = prodList.get(item.product_uuid);

      if (prod) {
        const prodOfCountry = prodList
          .filter((product) => _.isEqual(product.partnerId, prod.partnerId))
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

  navigate = (key, params = {}) => () => {
    const {mobile, iccid} = this.props.account;
    let naviTarget = '';

    if (key.includes('RegisterSim')) {
      if (_.isEmpty(mobile)) naviTarget = 'Auth';
      else if (_.isEmpty(iccid)) naviTarget = 'RegisterSim';
      else naviTarget = key.indexOf('_') > 0 ? 'Recharge' : 'RegisterSim';
    }

    this.props.navigation.navigate(naviTarget, params);
  };

  appStateHandler(state) {
    const {iccid, token} = this.props.account;
    switch (state) {
      case 'active':
        if (!_.isEmpty(iccid) && !this.isNoticed) {
          this.props.action.account.getAccount(iccid, {token});
        }
        break;

      default:
    }
  }

  clearAccount() {
    this.props.action.account.clearCurrentAccount();
    this.isNoticed = null;
  }

  login(mobile, pin, iccid) {
    this.props.action.account.logInAndGetAccount(mobile, pin, iccid);
    this.props.action.sim.getSimCardList();
    this.props.action.noti.getNotiList(mobile);
  }

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

  userInfo() {
    const {loggedIn, iccid, balance = 0, userPictureUrl} = this.props.account;

    return (
      <TouchableOpacity
        style={styles.userInfo}
        onPress={this.navigate('RegisterSim_user', {mode: 'Home'})}>
        <AppUserPic
          url={userPictureUrl}
          icon="imgPeople"
          style={styles.userPicture}
          onPress={this.navigate('RegisterSim_user', {mode: 'Home'})}
        />
        <View style={{marginLeft: 20, justifyContent: 'space-around', flex: 1}}>
          {loggedIn ? (
            [
              <Text key="mobile" style={appStyles.mobileNo}>
                {i18n.t('acc:remain')}
              </Text>,
              iccid ? (
                <AppPrice key="price" price={balance} />
              ) : (
                <Text
                  key="sim"
                  style={[appStyles.normal14Text, {color: colors.warmGrey}]}>
                  {i18n.t('reg:card')}
                </Text>
              ),
            ]
          ) : (
            <Text key="reg" style={appStyles.normal14Text}>
              {i18n.t('reg:guide')}
            </Text>
          )}
        </View>
        <AppIcon style={{alignSelf: 'center'}} name="iconArrowRight" />
      </TouchableOpacity>
    );
  }

  menu() {
    const {iccid} = this.props.account;
    const title = iccid ? i18n.t('menu:change') : i18n.t('menu:card');

    return (
      <View style={styles.menu}>
        <AppButton
          iconName="imgCard1"
          style={styles.menuBox}
          title={i18n.t('menu:purchase')}
          onPress={this.navigate('NewSim')}
          titleStyle={styles.menuText}
        />

        <View style={styles.bar} />

        <AppButton
          iconName="imgCard2"
          style={styles.menuBox}
          title={title}
          onPress={this.navigate('RegisterSim', {title})}
          titleStyle={styles.menuText}
        />

        <View style={styles.bar} />

        <AppButton
          iconName="imgCard3"
          style={styles.menuBox}
          title={i18n.t('store')}
          onPress={this.navigate('StoreStack')}
          titleStyle={styles.menuText}
        />
      </View>
    );
  }

  guide() {
    return (
      <TouchableOpacity style={styles.guide} onPress={this.navigate('Guide')}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <Text style={[appStyles.normal16Text, {marginLeft: 30}]}>
            {i18n.t('home:guide')}
          </Text>
          <View style={{flexDirection: 'row', marginTop: 9, marginLeft: 30}}>
            <Text style={styles.checkGuide}>{i18n.t('home:checkGuide')}</Text>
            <AppIcon name="iconArrowRightBlue" />
          </View>
        </View>
        <AppButton
          iconName="imgDokebi"
          style={{marginRight: 30}}
          iconStyle={{height: '100%', justifyContent: 'flex-end'}}
          onPress={this.navigate('Guide')}
        />
      </TouchableOpacity>
    );
  }

  info() {
    return (
      <View style={{flexDirection: 'row', marginHorizontal: 20}}>
        <AppIcon name="iconNotice" size={36} />
        <Carousel
          data={this.props.info.homeInfoList}
          renderItem={this.renderInfo}
          autoplay
          vertical
          loop
          useScrollView
          lockScrollWhileSnapping
          sliderHeight={60}
          itemHeight={60}
        />
      </View>
    );
  }

  init() {
    const {mobile, loggedIn} = this.props.account;

    if (loggedIn) {
      this.props.action.noti.getNotiList(mobile);
      this.props.action.cart.cartFetch();
    }
  }

  notification(type, data, isForeground = true) {
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
        this.handleNotification(data, isForeground);
        break;
      default:
        console.log('default notification');
    }
  }

  renderInfo({item}) {
    return (
      <TouchableOpacity onPress={this.onPressInfo(item)}>
        <View style={styles.info}>
          <Text style={styles.infoText}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderDots(activeIndex) {
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
          <Animated.View key={`${idx}`} style={dotStyle(width, margin)} />
        ) : (
          <View key={`${idx}`} style={styles.inactiveDot} />
        ),
      );
    }

    return promotion.map((_, idx) => {
      if (activeIndex === idx) {
        return (
          <Animated.View
            key={`${idx}`}
            style={dotStyle(width, DOT_MARGIN, colors.clearBlue)}
          />
        );
      }
      if (activeIndex === (idx + 1) % promotion.length) {
        return (
          <Animated.View
            key={`${idx}`}
            style={dotStyle(margin, DOT_MARGIN, colors.lightGrey)}
          />
        );
      }
      return <View key={`${idx}`} style={styles.inactiveDot} />;
    });
  }

  renderPromotion({item}) {
    return <PromotionImage item={item} onPress={this.onPressPromotion} />;
  }

  render() {
    const {darkMode} = this.state;

    return (
      <ScrollView style={styles.container}>
        {this.state.firstLaunch && <TutorialScreen />}
        <StatusBar barStyle={darkMode ? 'dark-content' : 'light-content'} />
        <AppActivityIndicator visible={this.props.loginPending} />
        <View style={styles.carousel}>
          <Carousel
            data={this.props.promotion}
            renderItem={this.renderPromotion}
            autoplay
            loop
            lockScrollWhileSnapping
            onSnapToItem={(index) => this.setState({activeSlide: index})}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
          />
          {this.pagination()}
        </View>
        {this.userInfo()}
        {this.menu()}
        {this.guide()}
        <View style={styles.divider} />
        {this.info()}
      </ScrollView>
    );
  }
}

export default connect(
  ({account, noti, info, pender, product, sync, promotion}: RootState) => ({
    account,
    auth: accountActions.auth(account),
    noti,
    info,
    loginPending: pender.pending[accountActions.LOGIN] || false,
    product,
    sync,
    promotion: promotion.promotion,
  }),
  (dispatch) => ({
    action: {
      sim: bindActionCreators(simActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(HomeScreen);
