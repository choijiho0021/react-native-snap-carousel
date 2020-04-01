import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

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

const STATUS_ACTIVE = 'A'     //사용중
const STATUS_INACTIVE = 'I'   //미사용
const STATUS_RESERVED = 'R'   //사용 대기중
const STATUS_CANCELED = 'C'   //취소
const STATUS_EXPIRED = 'E'    //사용 기간 종료
const STATUS_USED = 'U'       //사용 완료

class UsageItem extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      statusColor : colors.warmGrey,
      isActive : false
    }
    this.setStatusColor = this.setStatusColor.bind(this)
  }

  componentDidMount() {
    const {item, auth} = this.props

    this.setStatusColor()

    //그래프 테스트 nid = 1616
    if(item.statusCd == 'A') {
      subscriptionApi.getSubsUsage(item.nid, this.props.auth).then(
        resp => {
          if(resp.result == 0){
            console.log("getSubsUsage progress",resp.objects)
            const {activated, quota, used, unit} = resp.objects
            const progress = used > 0 ? Math.floor(used / quota * 100) : 0
            this.circularProgress.animate(80, 3000, null)
            this.setState({activated, quota, used, unit})
          }
        }
      )
    }
  }

  componentDidUpdate() {
    this.setStatusColor()
  }

  setStatusColor() {
    const {item} = this.props
    let statusColor = colors.warmGrey

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
    this.setState({statusColor : statusColor})
  }

  toMb(kb){
    if(kb == 0) return 0
    return utils.numberToCommaString(kb/1024)
  }

  toGb(kb){
    if(kb == 0) return 0
    return (kb/1024/1024).toFixed(2)
  }

  render () {
    const {item, onPress} = this.props
    const {statusColor = colors.warmGrey, isActive, quota = 0, used = 0} = this.state 
      
    return (
      <TouchableOpacity onPress={onPress}>
        <View style ={styles.usageListContainer}>
          <View style={styles.titleAndStatus}>
            <Text style={isActive ? appStyles.bold16Text : appStyles.normal16Text}>{item.prodName}</Text>
            <Text style={[appStyles.bold14Text,{color:statusColor}]}> • {item.status}</Text>
          </View>
          {item.statusCd == 'A' ?
          <View>
            <View style={styles.activeContainer}>
              <AnimatedCircularProgress
              ref={(ref) => this.circularProgress = ref}
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
            <Text style={styles.warning}>{i18n.t('usim:warning')}</Text>
          </View> : 
          <View style={styles.inactiveContainer}>
            <Text style={appStyles.normal12Text}>{i18n.t('usim:usablePeriod')}</Text>
            <Text style={styles.normal14WarmGrey}>{`${item.purchaseDate} ~ ${item.expireDate}`}</Text>
          </View> }
        </View>
        
      </TouchableOpacity>
    )
  }
}

class UsimScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <Text style={styles.title}>{i18n.t('usim')}</Text>
    )
  })

  constructor(props) {
    super(props)

    this.state = {
      refreshing: false
    }

    this._renderUsage = this._renderUsage.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
 }

  componentDidMount() {
    const { account: {iccid}, auth} = this.props
    if ( iccid) {
      this.props.action.order.getUsage( iccid, auth)
    }
  }

  componentDidUpdate( prevProps) {
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
  
  _renderUsage({item}) {
    return (<UsageItem item={item} auth={this.props.auth} onPress={this._onPressUsageDetail(item.key)}/>)
  }

  _onRefresh() {

    this.setState({
      refreshing: true
    })

    const { account: {iccid}, auth} = this.props
    if ( iccid) {
      this.props.action.order.getUsage( iccid, auth).then(resp =>{
        this.setState({
          refreshing: false
        })
      })
    }
  }

  _info() {
    return (
      <View>
        <View style={{backgroundColor: colors.clearBlue, height: 280, paddingHorizontal: 20}}>
          <View style={{flex:1, flexDirection: 'row', marginTop: 30, justifyContent: 'space-between'}}>
            <Text style={[appStyles.normal16Text, {color: colors.white,}]}>로깨비 캐시</Text>
            <AppButton title={'유심변경'} 
              titleStyle={[appStyles.normal12Text, {color: colors.white}]}
              style={{borderWidth:1, borderColor: colors.white, paddingHorizontal: 4, paddingTop: 3, borderRadius: 11.5, height: 25}}
              iconName={'iconRefresh'} direction={'row'}
              size={16}
              iconStyle={{margin:3}}/>
          </View>
        </View>
        <View style={{backgroundColor:colors.whiteTwo, marginHorizontal:20, marginBottom:20, marginTop:30}}>
          <Text style={{... appStyles.bold18Text}} >{i18n.t('usim:dataUsageList')}</Text>
        </View>
      </View>
      )
  }
  render() {
    const { usage } = this.props.order
    const {refreshing} = this.state

    return(
      <View style={styles.container}>        
        <View style={{backgroundColor:colors.whiteTwo, marginBottom:20}}>
          <FlatList ref={(ref) => { this.flatListRef = ref; }}
            data={usage} 
            ListHeaderComponent={this._info}
            ListEmptyComponent={this._empty}
            renderItem={this._renderUsage} 
            onRefresh={this._onRefresh}
            refreshing={refreshing}
            /> 
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    ... appStyles.title,
    marginLeft: 20,
  },
  nolist: {
    marginVertical: 60,
    textAlign: 'center',
    marginHorizontal:20
  },
  usageListContainer: {
    marginHorizontal: 20,
    marginBottom:20, 
    backgroundColor:colors.white
  },
  titleAndStatus: {
    flexDirection:'row', 
    marginHorizontal: 20, 
    marginVertical: 20, 
    alignItems:'center', 
    justifyContent:'space-between'
  },
  activeContainer: {
    flexDirection:'row', 
    marginHorizontal: 20, 
    marginVertical: 20
  },
  inactiveContainer: {
    flexDirection:'row', 
    marginHorizontal: 20, 
    marginBottom: 20, 
    alignItems:'center', 
    justifyContent:'space-between'
  },
  circular: {
    marginLeft:12
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
    marginHorizontal: 20, 
    marginBottom: 20
  }
});

const mapStateToProps = (state) => ({
  order: state.order.toJS(),

  account : state.account.toJS(),
  auth: accountActions.auth(state.account),
  noti : state.noti.toJS(),
  info : state.info.toJS(),
  loginPending: state.pender.pending[accountActions.LOGIN] || false,
  sync : state.sync.toJS()
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