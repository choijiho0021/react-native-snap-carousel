import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';

import SnackBar from 'react-native-snackbar-component';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import i18n from '../utils/i18n'
import utils from '../utils/utils';
import {appStyles} from '../constants/Styles'
import { colors } from '../constants/Colors';
import * as simActions from '../redux/modules/sim'
import * as accountActions from '../redux/modules/account'
import * as notiActions from '../redux/modules/noti'
import * as infoActions from '../redux/modules/info'
import * as cartActions from '../redux/modules/cart'
import * as orderActions from '../redux/modules/order'
import _ from 'underscore'
import AppButton from '../components/AppButton';
import subscriptionApi from '../utils/api/subscriptionApi';
import LabelText from '../components/LabelText';
import { isDeviceSize } from '../constants/SliderEntry.style';
import AppActivityIndicator from '../components/AppActivityIndicator';
import Analytics from 'appcenter-analytics'
import Svg, {Line} from 'react-native-svg';

const STATUS_ACTIVE = 'A'     //사용중
const STATUS_INACTIVE = 'I'   //미사용
const STATUS_RESERVED = 'R'   //사용 대기중
const STATUS_CANCELED = 'C'   //취소
const STATUS_EXPIRED = 'E'    //사용 기간 종료
const STATUS_USED = 'U'       //사용 완료

class CardInfo extends Component {

  constructor(props) {
    super(props)

    this._onPress = this._onPress.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    const {iccid, balance} = nextProps

    return (iccid != this.props.iccid || balance != this.props.balance) 
  }

  _onPress() {
    Analytics.trackEvent('Page_View_Count', {page : 'Change Usim'})
    this.props.navigation.navigate('RegisterSim')
  }

  render () {
    const { iccid, balance, expDate } = this.props

    return (
      <View>
        <View style={styles.headerBox}>
          <View style={{flexDirection: 'row', marginTop: 30, marginBottom:10, justifyContent: 'space-between'}}>
            <Text style={[appStyles.bold16Text, {color: colors.white, height: 16, alignSelf: 'center'}]}>{i18n.t('acc:balance')}</Text>
            <AppButton title={i18n.t('menu:change')} 
              titleStyle={[appStyles.normal12Text, {color: colors.white}]}
              style={styles.changeBorder}
              onPress={this._onPress}
              iconName={'iconRefresh'} direction={'row'}
              size={16}
              iconStyle={{margin:3}}
              />
          </View>
          {
            iccid &&
            <View>
              <View style={{flexDirection: 'row', marginBottom: 25}}>
                <Text style={[appStyles.bold30Text, {color: colors.white}]}>{utils.numberToCommaString(balance)}</Text>
                <Text style={[appStyles.normal22Text, {color: colors.white}]}>{i18n.t('won')}</Text>
              </View>

              <LabelText key='iccid'
                style={styles.box}
                format={'shortDistance'}
                label={'ICCID'} labelStyle={[styles.normal14White, {fontWeight: 'bold', marginRight: 10}]} 
                value={iccid ? utils.toICCID(iccid) : i18n.t('reg:card')} valueStyle={styles.normal14White}/>

              <LabelText key='expDate'
                style={styles.box}
                format={'shortDistance'}
                label={i18n.t('acc:expDate')} labelStyle={[styles.normal12White, {fontWeight: 'bold', marginRight: 10}]} 
                value={expDate} valueStyle={styles.normal12White}/>
            </View>
          } 
          <AppButton
            style={styles.rechargeBtn}
            onPress={()=>this.props.navigation.navigate('Recharge')}
            title={i18n.t('recharge')}
            titleStyle={styles.rechargeBtnTitle}/>
        </View>
        <View style={{backgroundColor:colors.whiteTwo, margin:20, marginTop:30}}>
          <Text style={{... appStyles.bold18Text}} >{i18n.t('usim:dataUsageList')}</Text>
        </View>
      </View>
    )
  }
}

class UsageItem extends Component {

  constructor(props) {
    super(props)

    this.state = {
      statusColor : colors.warmGrey,
      isActive : false,
      isShowUsage : false,
      disableBtn : false
    }
    this.setStatusColor = this.setStatusColor.bind(this)
    this.usageRender = this.usageRender.bind(this)
    this.getUsage = this.getUsage.bind(this)

    this.circularProgress = React.createRef()
  }

  shouldComponentUpdate(nextProps, nextState){

    return (!_.isEqual(nextProps.item,this.props.item) || this.state.disableBtn != nextState.disableBtn)
  }


  componentDidMount() {
    this.setStatusColor()
  }

  componentDidUpdate() {

    if(this.state.disableBtn){
      setTimeout(()=>{
        this.setState({
          disableBtn: false
        })
      }, 5000)
    }

    this.setStatusColor()
  }

  setStatusColor() {
    const {item} = this.props
    let statusColor = colors.warmGrey
    let isActive = false

    switch(item.statusCd) {
      case STATUS_ACTIVE : 
        statusColor = colors.tomato
        isActive = true
        break
      case STATUS_RESERVED :
        statusColor = colors.clearBlue
        break
      case STATUS_INACTIVE :
        statusColor = colors.black
        break
      default :
        statusColor = colors.warmGrey
        break
    }
    return {statusColor : statusColor, isActive : isActive}
  }

  getUsage() {
    const {item, auth, showSnackBar} = this.props

    //그래프 테스트 nid = 1616
    if(item.statusCd == 'A') {
      subscriptionApi.getSubsUsage(item.nid, auth).then(
        resp => {
          this.setState({disableBtn: true})
          if(resp.result == 0){
            console.log("getSubsUsage progress",resp.objects, item.nid)
            const {activated, quota, used, unit} = resp.objects
            const progress = used > 0 ? 100 - Math.floor(used / quota * 100) : 0

            this.setState({activated, quota, used, unit, isShowUsage:true})

            if ( this.circularProgress.current) this.circularProgress.current.animate(progress, 3000, null)

            Analytics.trackEvent('Page_View_Count', {page : 'Get Detail Data'})
          }
          else {
            showSnackBar()
            console.log("Get Usage failed", resp)
          }
        }
      )
    }
  }
  toMb(kb){
    if(kb == 0) return 0
    return utils.numberToCommaString(kb/1024)
  }

  toGb(kb){
    if(kb == 0) return 0
    return (kb/1024/1024).toFixed(2)
  }

  usageRender() {
    const {quota = 0, used = 0} = this.state 

    return <View style={styles.activeContainer}>
      <AnimatedCircularProgress
        ref={this.circularProgress}
        style={styles.circular}
        size={130}
        width={25}
        fill={0}
        rotation={0}
        backgroundWidth={25}
        tintColor={colors.clearBlue}
        // onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor={colors.whiteTwo} >
      {
        (fill) => (
          <View style={{alignItems:'center'}}>
            <Text style={styles.normal12WarmGrey}>{i18n.t('usim:remainAmount')}</Text>
            <Text style={styles.bold18ClearBlue}> { Math.floor(fill) + "%"} </Text>
          </View>
        )
      } 
      </AnimatedCircularProgress>
      <View style={{marginLeft:20,flex:1}}>
        <Text style={styles.normal14WarmGrey}>{i18n.t('usim:remainData')}</Text>
        <Text style={appStyles.bold18Text}>{`${this.toGb(quota-used)}GB ` + i18n.t('usim:remain')}</Text>
        <Text style={styles.normal12WarmGrey}>{`(${this.toMb(quota-used)}MB)`}</Text>
        <Text style={[styles.normal14WarmGrey,{marginTop:10}]}>{i18n.t('usim:usageAmount')}</Text>
        <Text style={styles.bold16WarmGrey}>{`${this.toGb(used)}GB ` + i18n.t('usim:used')}</Text>
        <Text style={styles.normal12WarmGrey}>{`(${this.toMb(used)}MB)`}</Text>
      </View>
    </View>
  }

  checkUsageButton() {
    return(
    <View style={styles.checkUsageBtnContainer}>
      <AppButton
            style={styles.checkUsageBtn}
            disabled={this.state.disableBtn}
            onPress={() => this.getUsage()}
            title={i18n.t('usim:checkUsage')}
            titleStyle={styles.checkUsageBtnTitle}/>
    </View>)
  }

  render () {
    const {item, onPress} = this.props
    const {isShowUsage = false} = this.state 
    const {statusColor = colors.warmGrey, isActive = false} = this.setStatusColor()

    return (
      <TouchableOpacity onPress={onPress}> 
        <View style ={styles.usageListContainer}>
          <View style={{backgroundColor: colors.white}}>
            <View style={styles.titleAndStatus}>
              <Text style={[styles.usageTitleNormal, { fontWeight: isActive ? "bold" : "normal" }]}>{item.prodName}</Text>
              <Text style={[styles.usageStatus,{color:statusColor}]}> • {item.status}</Text>
            </View>
          </View>
          {
            item.statusCd == 'A' ?
            <View>
              <View style={styles.topOfActiveContainer}>
                {isShowUsage ? this.usageRender() : this.checkUsageButton()}
                <Text style={styles.warning}>{i18n.t('usim:warning')}</Text>
              </View>
              <View style={styles.bottomOfActiveContainer}>
              <Svg height={2} width={'100%'}>
                <Line
                  style={{marginLeft:2}}
                  stroke={colors.warmGrey}
                  strokeWidth="2"
                  strokeDasharray="5, 5"
                  x1={'2%'}
                  y1={'0'}
                  x2={'98%'}
                  y2={'0'}
                />
              </Svg>
                <View style={styles.endDateContainer}>
                  <Text style={appStyles.normal12Text}>{i18n.t('usim:usingTime')}</Text>
                  <Text style={styles.usageUntil}>{`${utils.toDateString(item.endDate,'YYYY-MM-DD h:mm')} ${i18n.t('usim:until')}`}</Text>
                </View>
              </View>
            </View> :
            <View style={styles.inactiveContainer}>
              <Text style={appStyles.normal12Text}>{i18n.t('usim:usablePeriod')}</Text>
              <Text style={styles.usagePeriod}>{`${utils.toDateString(item.purchaseDate,'YYYY-MM-DD')} ~ ${item.expireDate}`}</Text>
            </View> 
          }
        </View>
      </TouchableOpacity>
    )
  }
}

class UsimScreen extends Component {
  constructor(props) {
    super(props)

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (<Text style={styles.title}>{i18n.t('usim')}</Text>)
    })

    this.state = {
      refreshing: false,
      cancelPressed: false,
      isFocused: false,
      // afterLogin: false,
    }
    
    this._init = this._init.bind(this)
    this._renderUsage = this._renderUsage.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    this._info = this._info.bind(this)
    this.showSnackBar = this.showSnackBar.bind(this)
  }

  componentDidMount() {
    const { account: {iccid, loggedIn}, auth } = this.props

    this._init(loggedIn, iccid, auth)

  }

  componentDidUpdate(prevProps) {
    const focus = this.props.navigation.isFocused()
    const { account: {iccid, loggedIn}, auth, lastTab, loginPending } = this.props,
      routeName = this.props.route.name,
      isFocusedToUsimTab = (lastTab[0] || '').startsWith( routeName ) && lastTab[0] !== prevProps.lastTab[0]

    if ( (isFocusedToUsimTab && ! loginPending )
      || (prevProps.account.iccid && iccid !== prevProps.account.iccid) ) {
      if(lastTab[0] != this.props.route.name ) this.props.navigation.popToTop()
      
      this._init(loggedIn, iccid, auth)
    }

  }

  _init(loggedIn, iccid, auth){
    if(!loggedIn){
      this.props.navigation.navigate('Auth')
    }else{
      if (iccid && auth) {
        this.props.action.order.getSubsWithToast(iccid, auth)
      }else{
        this.props.navigation.navigate('RegisterSim',{back:'Home'})
      }
    }
  }

  _empty = () => {

    if ( this.props.pending) return null

    return (
      <Text style={styles.nolist}>{i18n.t('his:noUsage')}</Text>
    )
  }
  
  _onPressUsageDetail = (key) => () => {
    const { usage } = this.props.order
    this.props.navigation.navigate('UsageDetail', {detail: usage.find(item => item.key == key)})
  }
  
  showSnackBar () {
    this.setState({
      cancelPressed:true
    })
  }

  _renderUsage({item}) {
    return (<UsageItem key={item.key} item={item} auth={this.props.auth} showSnackBar={this.showSnackBar} onPress={this._onPressUsageDetail(item.key)}/>)
  }

  _onRefresh() {

    this.setState({
      refreshing: true
    })

    const { account: {iccid}, auth } = this.props
    if (iccid) {
      this.props.action.order.getSubsWithToast( iccid, auth).then(resp =>{
        this.props.action.account.getAccount(iccid, auth).then(res => {

          if(resp.result == 0 && res.result == 0){
            this.setState({
              refreshing: false
            })
          }

        })
      })
    }
  }

  _info () {
    const { account: {iccid, balance, expDate}, navigation} = this.props
    return <CardInfo iccid={iccid} balance={balance} expDate={expDate} navigation={navigation}/>
  }

  render() {
    const { usage } = this.props.order
    const {refreshing, cancelPressed} = this.state

    return(
      <View style={styles.container}>
        <View style={{backgroundColor:colors.whiteTwo}}>
          <FlatList 
            data={usage}
            keyExtractor={(item)=> item.key.toString()}
            ListHeaderComponent={this._info}
            ListEmptyComponent={this._empty}
            renderItem={this._renderUsage}
            // onRefresh={this._onRefresh}
            // refreshing={refreshing}
            extraData={usage}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this._onRefresh}
                colors={[colors.clearBlue]} //android 전용
                tintColor={colors.clearBlue} //ios 전용
              />
            }
            />
          <AppActivityIndicator visible={this.props.pending || this.props.loginPending}/>
        </View>
        <SnackBar visible={cancelPressed} backgroundColor={colors.clearBlue} messageColor={colors.white}
                  position={'bottom'}
                  top={0}
                  containerStyle={{borderRadius: 3, height: 48, marginHorizontal: 0}}
                  autoHidingTime={3000}
                  onClose={() => this.setState({cancelPressed: false})}
                  textMessage={i18n.t("usim:failSnackBar")}/>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerBox: {
    backgroundColor: colors.clearBlue,
    paddingHorizontal: 20
  },
  title: {
    ... appStyles.title,
    marginLeft: 20,
  },
  nolist: {
    marginVertical: '40%',
    textAlign: 'center',
    marginHorizontal:20
  },
  activeBottomBox: {
    height: 50,
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  borderBottomRadius8: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  usageListContainer: {
    marginHorizontal: 20,
    marginBottom:20, 
  },
  titleAndStatus: {
    flexDirection:'row', 
    marginHorizontal: 20, 
    marginVertical: 20, 
    alignItems:'center', 
    justifyContent:'space-between',
    backgroundColor: colors.white
  },
  activeContainer: {
    flexDirection:'row', 
    marginHorizontal: 20, 
    marginVertical: 20
  },
  inactiveContainer: {
    paddingHorizontal: 20,
    paddingBottom:20,
    flexDirection:'row', 
    marginBottom: 20, 
    alignItems:'center', 
    backgroundColor:colors.white,
    width:'100%',
    justifyContent:'space-between'
  },
  endDateContainer: {
    paddingHorizontal: 20,
    paddingVertical:20,
    flexDirection:'row',
    alignItems:'center', 
    backgroundColor:colors.white,
    width:'100%',
    justifyContent:'space-between',
    borderTopRightRadius:8, 
    borderTopLeftRadius : 8
  },
  topOfActiveContainer : {
    backgroundColor: colors.white, 
    borderBottomLeftRadius: 8, 
    borderBottomRightRadius : 8
  },
  bottomOfActiveContainer : {
    alignItems:'center',
    backgroundColor:colors.white, 
    borderTopRightRadius:8, 
    borderTopLeftRadius : 8
  },
  changeBorder: {
    borderWidth:1,
    borderColor: colors.white,
    paddingRight: 9,
    paddingLeft:7,
    borderRadius: 11.5,
    height: 25
  },
  circular: {
    marginLeft:12
  },
  usageTitleNormal : {
    ... appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 14 : 16,
    maxWidth: '70%'
  },
  usageStatus: {
    ... appStyles.bold14Text,
    fontSize: isDeviceSize('small') ? 12 : 14
  },
  usagePeriod: {
    ... appStyles.normal14Text, 
    color:colors.warmGrey,
    fontSize: isDeviceSize('small') ? 12 : 14
  },
  normal12WarmGrey : {
    ... appStyles.normal12Text, 
    color:colors.warmGrey,
    textAlign:'left'
  },
  normal14WarmGrey : {
    ... appStyles.normal14Text, 
    color:colors.warmGrey
  },
  bold16WarmGrey : {
    ... appStyles.bold16Text,
    color:colors.warmGrey
  },
  bold18ClearBlue : {
    ... appStyles.bold18Text, 
    color:colors.clearBlue
  },
  warning : {
    ... appStyles.normal12Text, 
    textAlign:'left' ,
    color: colors.warmGrey,
    marginHorizontal: 20, 
    marginBottom: 20
  },
  box: {
    marginBottom: 5,
  },
  normal14White: {
    ... appStyles.normal14Text,
    color: colors.white,
  },
  normal12White: {
    ... appStyles.normal12Text,
    color: colors.white
  },
  rechargeBtn: {
    width: 160,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    marginBottom: 40,
    marginTop: 25
  },
  rechargeBtnTitle: {
    ... appStyles.bold16Text,
    textAlign: 'center',
    color:colors.clearBlue
  },
  checkUsageBtn:{
    width: 160,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.clearBlue,
    borderRadius: 24
  },
  checkUsageBtnTitle : {
    ... appStyles.bold16Text,
    textAlign: 'center',
    color:colors.white
  },
  checkUsageBtnContainer : {
    marginBottom: 30,
    alignContent:'center'
  }
});

const mapStateToProps = (state) => ({
  order: state.order.toObject(),

  account : state.account.toJS(),
  auth: accountActions.auth(state.account),
  noti : state.noti.toJS(),
  info : state.info.toJS(),
  loginPending: state.pender.pending[accountActions.LOGIN] ||
    state.pender.pending[accountActions.GET_ACCOUNT] || false,
  pending: state.pender.pending[orderActions.GET_SUBS] || false,
  sync : state.sync.toJS(),
  lastTab : state.cart.get('lastTab').toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      order: bindActionCreators(orderActions, dispatch),

      sim: bindActionCreators(simActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      info: bindActionCreators(infoActions, dispatch)
    }
  })
)(UsimScreen)