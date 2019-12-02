import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import i18n from '../utils/i18n'
import {appStyles} from '../constants/Styles'
import * as simActions from '../redux/modules/sim'
import * as accountActions from '../redux/modules/account'
import * as notiActions from '../redux/modules/noti'
import _ from 'underscore'
import utils from '../utils/utils';
import AppActivityIndicator from '../components/AppActivityIndicator'
import AppButton from '../components/AppButton';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../constants/SliderEntry.style'
import api from '../utils/api/api';
import promotionApi from '../utils/api/promotionApi';
import { colors } from '../constants/Colors';
import AppIcon from '../components/AppIcon';
import AppUserPic from '../components/AppUserPic';
import withBadge from '../components/withBadge';
import AppPrice from '../components/AppPrice';
import pushNoti from '../utils/pushNoti'
import { initialMode } from 'react-native-dark-mode'

const BadgeAppButton = withBadge(({notReadNoti}) => notReadNoti, 
  {badgeStyle:{left:5,bottom:10}},
  (state) => ({notReadNoti: state.noti.get('notiList').filter(elm=> elm.isRead == 'F').length }))(AppButton)

class HomeScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <Text style={styles.title}>{i18n.t('appTitle')}</Text>
    ),
    headerRight: (
      [
        <AppButton key="cnter" style={styles.btnCnter} onPress={navigation.getParam('Contact')} iconName="btnCnter" />,
        //BadgeAppButton을 사용했을 때 위치가 변동됨 수정이 필요함
        <BadgeAppButton key="alarm" style={styles.btnAlarm} onPress={navigation.getParam('Noti')} iconName="btnAlarm" />
      ]
    ),
  })

  constructor(props) {
    super(props)

    this.state = {
      darkMode: initialMode,
      activeSlide: 0,
      promotions: []
    }

    this._login = this._login.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._navigate = this._navigate.bind(this)
    this._userInfo = this._userInfo.bind(this)
    this._notification = this._notification.bind(this)
  }

  async componentDidMount() {

    this.props.navigation.setParams({
      Noti: this._navigate('Noti'),
      Contact: this._navigate('Contact')
    })

    // config push notification
    pushNoti.add(this._notification)

    // get promotion list
    promotionApi.getPromotion().then(resp => {
      if (resp.result == 0) {
        this.setState({
          promotions: resp.objects
        })
      }
    }).catch(err => {
      console.log('failed to load promotion list')
    })
  }

  componentWillUnmount() {
    pushNoti.remove()
  }

  _onRegistered(deviceToken) {
    console.log('APN token', deviceToken)
  }


  componentDidUpdate( prevProps) {
    const {mobile, pin, iccid, loggedIn} = this.props.account

    if ( mobile != prevProps.account.mobile || pin != prevProps.account.pin) {

      if ( ! _.isEmpty(mobile) && ! loggedIn) {
        this._login(mobile, pin, iccid)
      }
    
      if (prevProps.account.loggedIn != loggedIn) {
        loggedIn ? this.props.action.noti.getNotiList(mobile) : this.props.action.noti.init()
      }
    }
  }

  _notification(type, data) {
    console.log('notification', type, data)
    switch(type) {
      case 'register' :
        console.log('device token', data)
        this.props.action.account.updateAccount({
          deviceToken: data
        })
        break;
      case 'notification':
        console.log('notification', data)
    }
  }

  _login(mobile, pin, iccid) {

    this.props.action.account.logInAndGetUserId( mobile, pin)
    this.props.action.sim.getSimCardList()
    this.props.action.noti.getNotiList(mobile)

    if ( iccid) this.props.action.account.getAccount( iccid)
  }

  _pagination () {
    const { promotions, activeSlide } = this.state;
    return (
      <View style={styles.pagination}>
        <Pagination 
          dotsLength={promotions.length}
          activeDotIndex={activeSlide}
          containerStyle={{paddingVertical:5}}
          dotStyle={styles.dot}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
          inactiveDotStyle={styles.inactiveDot}
        />
      </View>
    )
  }

  _renderItem ({item}) {
    return (
      _.isEmpty(item.imageUrl) ?
        <View style={styles.overlay}>
          <Text style={styles.text}>{item.title}</Text>
        </View> :
        <Image source={{uri:api.httpImageUrl(item.imageUrl)}} style={styles.slide}/>
    )
  }
  
  _navigate = (key) => () => {
    const { mobile, iccid } = this.props.account
    if ( key == 'RegisterSim' ) {
      if ( _.isEmpty(mobile)) key = 'RegisterMobile' 
      else if ( _.isEmpty(iccid)) key = 'RegisterSim'
      else key = 'Recharge'
    }

    this.props.navigation.navigate(key)
  }

  _userInfo() {
    const { mobile, loggedIn, iccid, balance = 0, userPictureUrl } = this.props.account,
      phone = mobile ? utils.toPhoneNumber(mobile) : 'unknown'

    return (
      <TouchableOpacity style={styles.userInfo} onPress={this._navigate('RegisterSim')}>
        <AppUserPic url={userPictureUrl} icon="imgPeople" style={styles.userPicture}/>
        <View style={{marginLeft:20, justifyContent:'space-around', flex:1}}>
          {
            loggedIn ? [
              <Text key="mobile" style={appStyles.mobileNo}>{phone}</Text>,
              iccid ? <AppPrice key="price" price={balance} /> :
                <Text key="sim" style={appStyles.normal14Text}>{i18n.t('reg:card')}</Text>
            ] : 
            <Text key="reg" style={appStyles.normal14Text}>{i18n.t('reg:guide')}</Text>
          }
        </View>
        <AppIcon style={{alignSelf:'center'}} name="iconArrowRight"/>
      </TouchableOpacity>
    )
  }

  _menu() {
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
          title={i18n.t('menu:card')}
          // onPress={this._navigate('AddProfile')}
          onPress={this._navigate('RegisterSim')}
          titleStyle={styles.menuText} />

        <View style={styles.bar}/>

        <AppButton iconName="imgCard3"
          style={styles.menuBox}
          title={i18n.t('store')}
          titleStyle={styles.menuText} />
      </View>
    )
  }

  _guide() {
    return (
      <View style={styles.guide}>
        <AppIcon name="imgGuid1"/>
        <Text style={[appStyles.normal14Text, {marginLeft:10, flex:1}]}>{i18n.t('home:guide')}</Text> 
        <TouchableOpacity style={styles.roundBox} onPress={this._navigate('Guide')}>
          <Text style={styles.checkGuide}>{i18n.t('home:checkGuide')}</Text> 
          <AppIcon name="btnArrowRight2Blue" style={{marginLeft:14}}/>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { darkMode } = this.state
    console.log('carousel', sliderWidth, itemWidth, Dimensions.get('window'))

    return (
      <View style={styles.container}>
        <StatusBar barStyle={darkMode ? "dark-content" : 'light-content'} />
        <AppActivityIndicator visible={this.props.loginPending}/>
        <View style={styles.carousel}>
          <Carousel
            data={this.state.promotions}
            renderItem={this._renderItem}
            autoplay={true}
            loop={true}
            decelerationRate={true}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userPicture: {
    width: 50,
    height: 50
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
    paddingHorizontal: 30,
    height: 84,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: 'center',
  },
  menu: {
    marginHorizontal: 20,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: 'space-around',
    alignItems:'center',
    flex:1
  },
  menuBox: {
    height: 70,
    width: 70,
    justifyContent: 'center'
  },
  menuText: {
    ... appStyles.normal14Text,
    marginTop: 8,
    textAlign: 'center',
    color: colors.black
  },
  userInfo: {
    height: 96,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 14,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ebebeb",
    marginHorizontal: 20,
    marginTop: 30,
    flexDirection: "row",
    paddingHorizontal: 30,
    paddingVertical: 23
  },
  container: {
    backgroundColor: colors.white,
    flex: 1
  },
  slide: {
    height: 180,
    marginLeft: 20,
  },
  overlay: {
    backgroundColor:'rgba(0,0,0,0.3)',
    height: 180,
    marginLeft: 20,
  },
  carousel: {
    alignItems: 'flex-end',
  },
  dot: {
    width: 20,
    height: 6,
    borderRadius: 3.5,
    backgroundColor: colors.clearBlue
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
    marginTop: 19
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
    marginLeft: 16,
    marginRight: 20,
    bottom:10
  },
  btnCnter: {
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
  loginPending: state.pender.pending[accountActions.LOGIN] || false,
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      sim: bindActionCreators(simActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
    }
  })
)(HomeScreen)