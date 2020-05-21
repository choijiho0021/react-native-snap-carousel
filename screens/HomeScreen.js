import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import i18n from '../utils/i18n'
import {appStyles} from '../constants/Styles'
import * as simActions from '../redux/modules/sim'
import * as accountActions from '../redux/modules/account'
import * as notiActions from '../redux/modules/noti'
import * as infoActions from '../redux/modules/info'
import * as cartActions from '../redux/modules/cart'
import * as productActions from '../redux/modules/product'
import _ from 'underscore'
import utils from '../utils/utils';
import AppActivityIndicator from '../components/AppActivityIndicator'
import AppButton from '../components/AppButton';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { sliderWidth, windowHeight } from '../constants/SliderEntry.style'
import api from '../utils/api/api';
import promotionApi from '../utils/api/promotionApi';
import { colors } from '../constants/Colors';
import AppIcon from '../components/AppIcon';
import AppUserPic from '../components/AppUserPic';
import withBadge from '../components/withBadge';
import AppPrice from '../components/AppPrice';
import pushNoti from '../utils/pushNoti'
import { initialMode } from 'react-native-dark-mode'
import { Animated } from 'react-native';
import TutorialScreen from './TutorialScreen';
import AsyncStorage from '@react-native-community/async-storage';
import { PERMISSIONS, request } from 'react-native-permissions';
import AppAlert from './../components/AppAlert';
import appStateHandler from '../utils/appState'
import Analytics from 'appcenter-analytics'
import productApi from '../utils/api/productApi';

const BadgeAppButton = withBadge(({notReadNoti}) => notReadNoti, 
  {badgeStyle:{right:-3,top:0}},
  (state) => ({notReadNoti: state.noti.get('notiList').filter(elm=> elm.isRead == 'F').length }))(AppButton)

// windowHeight
// iphone 8 - 375x667
// iphone 11 pro  - 375x812, 2436×1125
// iphone 11 pro max - 414x896, 2688×1242
// 190 ~ 210 사이의 크기로 정리됨 
const size = windowHeight > 810 ? {
  userInfoHeight : 110,
  userInfoMarginTop: 30,
  userPic: 60,
  carouselHeight : 225,
  carouselMargin : 0
} : {
  userInfoHeight : 96,
  userInfoMarginTop: 20,
  userPic: 50,
  carouselHeight : 190,
  carouselMargin : 20
}

class PromotionImage extends PureComponent {

  render() {
  const {item} = this.props
    return (
      <TouchableOpacity style={styles.overlay} onPress={() => this.props.onPress(item)}>
        {
          _.isEmpty(item.imageUrl) ?
            <Text style={styles.text}>{item.title}</Text> :
            <Image source={{uri:api.httpImageUrl(item.imageUrl)}} style={{height:size.carouselHeight}} resizeMode='contain'/>
        }
      </TouchableOpacity>
    )
  }
} 

class HomeScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <Text style={styles.title}>{i18n.t('appTitle')}</Text>
    ),
    headerRight: (
      [
        <AppButton key="cnter" style={styles.btnCnter} 
          onPress={() => navigation.navigate('Contact')} 
          iconName="btnCnter" />,

        //BadgeAppButton을 사용했을 때 위치가 변동됨 수정이 필요함
        <BadgeAppButton key="alarm" style={styles.btnAlarm} 
          onPress={() => navigation.navigate('Noti', {mode:'noti'})} 
          iconName="btnAlarm" />
      ]
    ),
  })

  constructor(props) {
    super(props)

    this.state = {
      darkMode: initialMode,
      activeSlide: 0,
      promotions: [],
      firstLaunch: undefined
    }

    this._login = this._login.bind(this)
    this._init = this._init.bind(this)
    this._renderPromotion = this._renderPromotion.bind(this)
    this._navigate = this._navigate.bind(this)
    this._userInfo = this._userInfo.bind(this)
    this._notification = this._notification.bind(this)
    this._handleNotification = this._handleNotification.bind(this)
    this._clearAccount = this._clearAccount.bind(this)
    this._appStateHandler = this._appStateHandler.bind(this)
    this._onPressPromotion = this._onPressPromotion.bind(this)

    this._isNoticed = null

 }

  async componentDidMount() {
    Analytics.trackEvent('Page_View_Count', {page : 'Home'})
    // 로그인 여부와 관련 없이 항상 처리할 부분
      if(Platform.OS == 'ios'){
        await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
        await request(PERMISSIONS.IOS.CAMERA)
      }
      else if(Platform.OS == 'android'){
        await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
        await request(PERMISSIONS.ANDROID.CAMERA)
      }

    // 앱 첫 실행 여부 확인
    AsyncStorage.getItem("alreadyLaunched").then(value => {
      if(value == null){
        AsyncStorage.setItem('alreadyLaunched', 'true')
        this.setState({firstLaunch: true})        
      }
      else{
        this.setState({firstLaunch: false})
      }
    })
    // AsyncStorage.removeItem('alreadyLaunched')

    // config push notification
    pushNoti.add(this._notification)
    appStateHandler.add(this._appStateHandler)
    
    // get promotion list
    promotionApi.getPromotion().then(resp => {
      if (resp.result == 0) {
        this.setState({
          promotions: resp.objects
        })
      }
    }).catch(err => {
      console.log('failed to load promotion list', err)
    })

    // 공지 사항 가져오기 
    this.props.action.info.getInfoList('Info')

    // 로그인 여부에 따라 달라지는 부분
    this._init()
  }

  componentWillUnmount() {
    pushNoti.remove()
    appStateHandler.remove()
  }

  componentDidUpdate( prevProps) {
    const {mobile, pin, iccid, loggedIn, deviceToken, isUsedByOther} = this.props.account

    if ( mobile != prevProps.account.mobile || pin != prevProps.account.pin) {

      if ( ! _.isEmpty(mobile) && ! loggedIn) {
        this._login(mobile, pin, iccid)
      }
    }
    //자동로그인의 경우 device token update
    if(prevProps.account.deviceToken != deviceToken && loggedIn){
      this.props.action.account.changeNotiToken()
    }

    if (prevProps.account.loggedIn != loggedIn) {
      this._init()
    }

    if ( this.props.sync.progress ) {
      this.props.navigation.navigate('CodePush')
    }

    if ( isUsedByOther && prevProps.account.isUsedByOther != isUsedByOther && ! this._isNoticed) {
      this._isNoticed = true
      AppAlert.info( i18n.t('acc:disconnectSim'), i18n.t('noti'), this._clearAccount )
    }
  }

  _init() {
    const {mobile, loggedIn} = this.props.account

    if ( loggedIn ) {
      this.props.action.noti.getNotiList(mobile)
      this.props.action.cart.cartFetch()
    }
    else {
      this.props.action.noti.init()
    }
  }

  _notification(type, data) {
    const {mobile, loggedIn} = this.props.account

    if ( loggedIn ) {
      this.props.action.noti.getNotiList(mobile)
    }

    switch(type) {
      case 'register' :
        this.props.action.account.updateAccount({
          deviceToken: data
        })
        break;
      case 'notification':
        this._handleNotification( data )
    }
  }

  _handleNotification( payload ) {
    const type = (payload.data || {}).notiType
    const target = (payload.data || {}).iccid
    const { mobile, iccid } = this.props.account

    if (mobile && _.size(payload) > 0) {
      if(Platform.OS === 'ios') {
        let msg = JSON.stringify(payload)
        this.props.action.noti.sendLog(mobile, msg)
      }
    }
    
    switch(type) {
      case 'account':
        if ( typeof iccid !== 'undefined' && iccid === target ) {
          if (! this._isNoticed) {
            this._isNoticed = true
            AppAlert.info( i18n.t('acc:disconnectSim'), i18n.t('noti'), this._clearAccount )
          }
        }
        else {
          this.props.navigation.navigate('Noti')
        }

        break;
      default:
        this.props.navigation.navigate('Noti')
    }
  }

  _appStateHandler(state) {
    const { iccid, token } = this.props.account
    switch(state) {
      case 'active': 
        if ( ! _.isEmpty(iccid) && ! this._isNoticed ) {
          this.props.action.account.getAccount( iccid, {token} )
        }
        break;

      default:
    }
  }

  _clearAccount() {
    this.props.action.account.clearCurrentAccount()
    this._isNoticed = null
  }

  _login(mobile, pin, iccid) {
    this.props.action.account.logInAndGetAccount( mobile, pin, iccid)
    this.props.action.sim.getSimCardList()
    this.props.action.noti.getNotiList(mobile)
  }

  _pagination () {
    const { promotions, activeSlide } = this.state,
      activeDotWidth = new Animated.Value(6),
      inactiveDotWidth = new Animated.Value(20)

    Animated.parallel([
      Animated.timing (
        activeDotWidth, {
          toValue : 20,
          duration : 500,
      }),
      Animated.timing (
        inactiveDotWidth, {
          toValue : 6,
          duration : 500,
      }),
    ]).start()

    return (
      <View style={styles.pagination}>
        <Pagination 
          dotsLength={promotions.length}
          activeDotIndex={activeSlide}
          containerStyle={{paddingVertical:5, paddingRight:0}}
          renderDots={ activeIndex => (
            promotions.map((promo, i) => (
              <View key={i+""} style={styles.dotContainer}>
              {
                activeIndex == i ?
                  <Animated.View style={[styles.dot, {width:activeDotWidth, backgroundColor:colors.clearBlue}]}/> :
                (activeIndex == (i+1)%promotions.length) ?
                  <Animated.View style={[styles.dot, {width:inactiveDotWidth, backgroundColor:colors.lightGrey}]}/> :
                  <View style={styles.inactiveDot}/>
              }
              </View>
            ))
          )}
        />
      </View>
    )
  }


  _navigate = (key,params = {}) => () => {

    const { mobile, iccid } = this.props.account

    if ( key.includes('RegisterSim') ) {
      if ( _.isEmpty(mobile)) key = 'Auth' 
      else if ( _.isEmpty(iccid)) key = 'RegisterSim'
      else key.indexOf('_') > 0 ? key = 'Recharge' : 'RegisterSim'
    }

    this.props.navigation.navigate(key,params)
  }

  _userInfo() {
    const { mobile, loggedIn, iccid, balance = 0, userPictureUrl } = this.props.account

    return (
      <TouchableOpacity style={styles.userInfo} onPress={this._navigate('RegisterSim_user',{mode:'Home'})}>
        <AppUserPic url={userPictureUrl} icon="imgPeople" style={styles.userPicture} onPress={this._navigate('RegisterSim_user',{mode:'Home'})}/>
        <View style={{marginLeft:20, justifyContent:'space-around', flex:1}}>
          {
            loggedIn ? [
              <Text key="mobile" style={appStyles.mobileNo}>{i18n.t('acc:remain')}</Text>,
              iccid ? <AppPrice key="price" price={balance} /> :
                <Text key="sim" style={[appStyles.normal14Text, {color:colors.warmGrey}]}>{i18n.t('reg:card')}</Text>
            ] : 
            <Text key="reg" style={appStyles.normal14Text}>{i18n.t('reg:guide')}</Text>
          }
        </View>
        <AppIcon style={{alignSelf:'center'}} name="iconArrowRight"/>
      </TouchableOpacity>
    )
  }

  _menu() {

    const { mobile, iccid } = this.props.account
    const title = iccid ? i18n.t('menu:change') : i18n.t('menu:card')

    return (
      <View style={styles.menu}>
        <AppButton iconName="imgCard1" 
          style={styles.menuBox}
          title={i18n.t('menu:purchase')} 
          onPress={this._navigate('NewSim')}
          titleStyle={styles.menuText} />

        <View style={styles.bar}/>

        <AppButton iconName="imgCard2"
          style={styles.menuBox}
          title={title}
          onPress={this._navigate('RegisterSim',{title: title})}
          titleStyle={styles.menuText} />  

        <View style={styles.bar}/>

        <AppButton iconName="imgCard3"
          style={styles.menuBox}
          title={i18n.t('store')}
          onPress={this._navigate('Store')}
          titleStyle={styles.menuText} />
      </View>
    )
  }

  _guide() {
    return (
      <TouchableOpacity style={styles.guide} onPress={this._navigate('Guide')}>
        <View style={{flex:1, justifyContent: 'space-between'}}>
          <Text style={[appStyles.normal16Text, {marginLeft:30}]}>{i18n.t('home:guide')}</Text> 
          <View style={{flexDirection:'row', marginTop:9, marginLeft:30}}>
            <Text style={styles.checkGuide}>{i18n.t('home:checkGuide')}</Text> 
            <AppIcon name="iconArrowRightBlue"/>
          </View>
        </View>
        <AppButton iconName="imgDokebi" style={{marginRight:30}} iconStyle={{height:'100%', justifyContent:'flex-end'}}
          onPress={this._navigate('Guide')}/>
      </TouchableOpacity>
    )
  }

  _renderInfo({item}) {
    return (
      <View style={styles.info}>
        <Text style={styles.infoText}>{item.title}</Text>
      </View>
    )

  }

  _info() {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Noti', {mode: 'info', title:i18n.t('notice'), info: this.props.info.infoList})}>
        <View style={{flexDirection: 'row', marginHorizontal: 20}}>
          <AppIcon name="iconNotice" size={36} />
          <Carousel
            data={this.props.info.infoList}
            renderItem={this._renderInfo}
            autoplay={true}
            vertical={true}
            loop={true}
            useScrollView={true}
            lockScrollWhileSnapping={true}
            sliderHeight={60}
            itemHeight={60} />
        </View>
      </TouchableOpacity>
    )
  }

  _onPressPromotion(item) {
    if ( item.product_uuid) {
      const prodList = this.props.product.get('prodList'),
        prod = prodList.get(item.product_uuid)

      if ( prod) {
        const prodOfCountry = prodList.filter( item => _.isEqual(item.ccode, prod.ccode)).toList().toArray()
        this.props.navigation.navigate('Country', {prodOfCountry})
      }
    }
    else if ( item.notice) {
      this.props.navigation.navigate('SimpleText', {key:'noti', title:i18n.t('set:noti'), bodyTitle:item.notice.title, text:item.notice.body, mode:'text'})
    }
  }

  _renderPromotion({item}) {
    return <PromotionImage item={item} onPress={this._onPressPromotion}/>
  }

  render() {
    const { darkMode } = this.state

    return(
      <ScrollView style={styles.container}>
        {
          this.state.firstLaunch && <TutorialScreen/>
        }
        <StatusBar barStyle={darkMode ? "dark-content" : 'light-content'} />
        <AppActivityIndicator visible={this.props.loginPending}/>
        <View style={styles.carousel}>
          <Carousel
            data={this.state.promotions}
            renderItem={this._renderPromotion}
            autoplay={true}
            loop={true}
            loopClonesPerSide={5}
            lockScrollWhileSnapping={true}
            onSnapToItem={(index) => this.setState({ activeSlide: index }) }
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth} />
          { this._pagination() }
        </View>
        {
          this._userInfo()
        }
        {
          this._menu()
        }
        {
          this._guide()
        }
        <View style={styles.divider}/>
        {
          this._info()
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  infoText: {
    ... appStyles.normal14Text,
    color: colors.black,
    marginLeft: 8,
  },
  info: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  divider: {
    marginTop: 40,
    marginHorizontal: 20,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1
  },
  userPicture: {
    width: size.userPic,
    height: size.userPic
  },
  bar: {
    width: 1,
    height: 20,
    borderRadius: 2,
    backgroundColor: colors.lightGrey
  },
  rightArrow1: {
    width: 15,
    height: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.clearBlue,
    alignSelf: 'center'
  },
  rightArrow2: {
    width: 0,
    height: 0,
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderBottomWidth: 6,
    borderBottomColor: colors.clearBlue,
    alignSelf: 'center'
  },
  checkGuide: {
    ... appStyles.normal14Text,
    color:colors.clearBlue,
    textAlign: 'left'
  },
  roundBox: {
    width: 128,
    height: 40,
    borderRadius: 26,
    backgroundColor: "#ffffff",
    paddingVertical: 13,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  guide: {
    marginTop: 40,
    marginHorizontal: 20,
    height: 100,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5
  },
  menu: {
    marginHorizontal: 20,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: 'space-around',
    alignItems:'center',
  },
  menuBox: {
    height: 70,
    width: 70,
    justifyContent: 'center'
  },
  menuText: {
    ... appStyles.normal15Text,
    marginTop: 8,
    textAlign: 'center',
    color: colors.black
  },
  userInfo: {
    height: size.userInfoHeight,
    borderRadius: 5,
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 5
    },
    elevation: 3,
    shadowRadius: 14,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ebebeb",
    marginHorizontal: 20,
    marginTop: size.userInfoMarginTop,
    flexDirection: "row",
    paddingHorizontal: 30,
    paddingVertical: 23
  },
  container: {
    backgroundColor: colors.white,
    flex: 1
  },
  overlay: {
    marginLeft: size.carouselMargin,
  },
  carousel: {
    alignItems: 'flex-end',
  },
  dot: {
    width: 20,
    height: 6,
    borderRadius: 3.5,
    backgroundColor: colors.clearBlue,
  },
  dotContainer: {
    marginLeft: 5,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lightGrey
  },
  pagination: {
    alignSelf: 'flex-end',
    marginRight: 30,
    marginTop: 20
  },
  cardLayer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    ... appStyles.button
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
    textAlign: "center",
  },
  btnAlarm: {
    width: 40, 
    height: 40,
    marginRight: 10,
  },
  btnCnter: {
    width:40,
    height: 40,
    marginHorizontal: 18
  },
  title: {
    ... appStyles.title,
    marginLeft: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

const mapStateToProps = (state) => ({
  account : state.account.toJS(),
  auth: accountActions.auth(state.account),
  noti : state.noti.toJS(),
  info : state.info.toJS(),
  loginPending: state.pender.pending[accountActions.LOGIN] || false,
  sync : state.sync.toJS(),
  product: state.product
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      sim: bindActionCreators(simActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
      product: bindActionCreators(productActions, dispatch)
    }
  })
)(HomeScreen)