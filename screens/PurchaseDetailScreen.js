import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView
} from 'react-native';
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import utils from '../utils/utils';
import AppAlert from '../components/AppAlert';
import AppButton from '../components/AppButton';
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import LabelText from '../components/LabelText';
import _ from 'underscore';
import { isDeviceSize } from '../constants/SliderEntry.style';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import LabelTextTouchable from '../components/LabelTextTouchable';
import orderApi from '../utils/api/orderApi';
import profileApi from '../utils/api/profileApi';
import {connect} from 'react-redux'
import * as orderActions from '../redux/modules/order'
import * as accountActions from '../redux/modules/account'
import AppIcon from '../components/AppIcon';
import { isAndroid } from '../components/SearchBarAnimation/utils';
import AddressCard from '../components/AddressCard';
import { bindActionCreators } from 'redux';
import SnackBar from 'react-native-snackbar-component';
import { windowHeight } from '../constants/SliderEntry.style';
import Analytics from 'appcenter-analytics'
import AppActivityIndicator from '../components/AppActivityIndicator';


class PurchaseDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('his:detail')}/>
  })

  constructor(props) {
    super(props)
    this.state = {
      showPayment: true,
      showDelivery: true,
      cancelPressed: false,   // 결제취소버튼 클릭시 true
      isCanceled: false,      // 결제취소처리 완료시 및 기존결제 취소상품의 경우 true
      disableBtn: false,
      scrollHeight: 0,
      borderBlue: false,
    }

    this.snackRef = React.createRef();
    
    this._onPressPayment = this._onPressPayment.bind(this)
    this._onPressDelivery = this._onPressDelivery.bind(this)
    this._headerInfo = this._headerInfo.bind(this)
    this._paymentInfo = this._paymentInfo.bind(this)
    this._deliveryInfo = this._deliveryInfo.bind(this)
    this._profile = this._profile.bind(this)
    this._address = this._address.bind(this)
    this._cancelOrder = this._cancelOrder.bind(this)
    this._onScroll = this._onScroll.bind(this)

  }

  componentDidMount() {
    const detail = this.props.navigation.getParam('detail') || {}

    Analytics.trackEvent('Page_View_Count', {page : 'Purchase Detail'})

    this.setState({
      ... detail,
      isCanceled : detail.state == 'canceled' || false,
      billingAmt: utils.numberToCommaString(detail.totalPrice + detail.dlvCost),
      method : !_.isEmpty(detail.paymentList) && detail.paymentList.find(item => item.paymentGateway != 'rokebi_cash'),
      totalCnt: _.isEmpty(detail) ? 0 : detail.orderItems.reduce((acc,cur) => acc + cur.qty, 0)
    })

    // load Profile by profile_id
    if(detail.orderType == 'physical'){
      profileApi.getCustomerProfileById(detail.profileId, this.props.auth).then(resp => {
        if(resp.result == 0) this._profile(resp)
      },
      err => {
        console.log('Failed to get profile', err)
      })
    }
  }

  componentDidUpdate(){
    if(this.state.cancelPressed){
      setTimeout(()=>{
        this.setState({
          cancelPressed: false,
          disableBtn: true,
          isCanceled: true,
        })
      }, 3000)
    }
  }
  
  componentWillUnmount(){
    // 보완 필요
    const auth = this.props.navigation.getParam('auth')
    const { iccid } = this.props.account
    if(this.state.disableBtn && auth){
      this.props.action.order.getOrders(auth)
      this.props.action.account.getAccount(iccid, auth)
    }
  }

  _onScroll = (e) => {
    if(this.state.cancelPressed){
      this.setState({
        scrollHeight: e.nativeEvent.contentOffset.y,
      })
    }
  }

  _profile(profile){
    this.setState({
      profile: profile.objects[0]
    })
  }

  _onPressPayment(){
    this.setState({
      showPayment: !this.state.showPayment
    })
  }

  _onPressDelivery(){
    this.setState({
      showDelivery: !this.state.showDelivery
    })
  }

  _cancelOrder() {

    this.setState({borderBlue: true})

    AppAlert.confirm(i18n.t('his:cancel'), i18n.t('his:cancelAlert'), 
    {
      ok: () => 
        {
          this.props.action.order.cancelOrder(this.state.orderId, this.props.auth).then(resp =>{
            if (resp.result == 0){
              this.setState({cancelPressed: true})
            }else{
              AppAlert.info(i18n.t("his:cancelFail"))
            }},
            err =>{
              AppAlert.info(i18n.t("his:cancelError"))
          })
          this.setState({borderBlue: false})
        }
      ,cancel: ()=> {
          this.setState({borderBlue: false})
      }
    })
  }

  _address(){
    const profile = !_.isEmpty(this.state.profile) && this.state.profile
    return(
      // 주소
      profile && 
      <View style={{marginBottom: 30}}>
        <View style={styles.profileTitle}>
          <Text style={styles.profileTitleText}>{profile.alias}</Text>
          { 
            profile.isBasicAddr &&
            <View style={styles.basicAddrBox}>
              <Text style={styles.basicAddr}>{i18n.t('addr:basicAddr')}</Text>
            </View>
          }
        </View>
        <AddressCard 
          textStyle={styles.addrCardText}
          mobileStyle={[styles.addrCardText, {color: colors.warmGrey}]}
          style={styles.addrCard}
          profile={profile}
          mobile={profile.recipientNumber}/>    
      </View>
    )
  }

  _deliveryInfo(){

    const { trackingCompany, trackingCode, shipmentState, isCanceled, memo } = this.state || {}

    return(
      <View>
        <View style={styles.thickBar}/>
        <Text style={styles.deliveryTitle}>{i18n.t('his:shipmentState')}</Text>
        <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', marginHorizontal: 20}}>
          <Text style={[styles.deliveryStatus, (_.isEmpty(shipmentState)|| shipmentState == 'draft' )&& {color: colors.clearBlue}]}>{i18n.t('his:paymentCompleted')}</Text>
          <AppIcon name="iconArrowRight" style={styles.arrowIcon}/>
          <Text style={[styles.deliveryStatus, shipmentState == ('ready') && {color: colors.clearBlue}]}>{i18n.t('his:ready')}</Text>
          <AppIcon name="iconArrowRight" style={styles.arrowIcon}/>
          <Text style={[styles.deliveryStatus, shipmentState == ('shipped') && {color: colors.clearBlue}]}>{i18n.t('his:shipped')}</Text>
        </View>
        
        <View style={styles.bar}/>
        <Text style={styles.deliveryTitle}>{i18n.t('his:addressInfo')}</Text>
        {
          // !_.isEmpty(this.state.profile) && this._address()
          this._address()
        }
        <View style={[styles.bar, {marginTop: 0}]}/>
        <Text style={styles.deliveryTitle}>{i18n.t('his:memo')}</Text>
        <View style={{marginHorizontal: 20, marginBottom: 40}}>
          {
            !_.isEmpty(memo) && _.isEmpty(orderApi.deliveryText.find(item => item.value == memo)) && 
            <Text style={[styles.label2, {marginBottom: 5, lineHeight: 24}]}>{i18n.t('his:input')}</Text>
          }
          <Text style={appStyles.normal16Text}>{_.isEmpty(memo) ? i18n.t('his:notSelected') : memo}</Text>
        </View>

        {
          !isCanceled && shipmentState == ('shipped') &&
          <View style={{marginBottom: 40}}>
            <View style={[styles.bar, {marginTop: 0}]}/>
            <Text style={styles.deliveryTitle}>{i18n.t('his:companyInfo')}</Text>
            <LabelText key="trackingCompany"
                style={styles.item} format="shortDistance"
                label={i18n.t('his:trackingCompany')}
                labelStyle={styles.companyInfoTitle}
                value={trackingCompany}
                valueStyle={[styles.labelValue, {justifyContent: 'flex-start'}]}/>
            <LabelText key="tel"
                style={styles.item} format="shortDistance"
                label={i18n.t('his:tel')}
                labelStyle={styles.companyInfoTitle}
                value={utils.toPhoneNumber('12341234')} // 택배사 전화번호
                valueStyle={styles.labelValue}/>
            <LabelTextTouchable onPress={() => this.props.navigation.navigate('SimpleText', {mode:'uri', text:orderApi.deliveryTrackingUrl('CJ', '341495229094')})}
                label={i18n.t('his:trackingCode')}
                labelStyle={[styles.companyInfoTitle, {marginLeft: 20, width: '20%'}]}
                format="shortDistance"
                value={trackingCode}
                valueStyle={[styles.labelValue, {color: colors.clearBlue, textDecorationLine: 'underline'}]}/>
          </View>
        }
      </View>
    )
  }

  _paymentInfo(){
    const { orderId, orderDate, orderItems, orderType, usageList, totalPrice, state, shipmentState, billingAmt,
      dlvCost, balanceCharge, isCanceled, method } = this.state || {} 

      const elapsedDay = Math.ceil((new Date() - new Date(orderDate)) / (24 * 60 * 60 * 1000))
      const paidAmount = !_.isEmpty(method) ? method.amount : 0
      const isRecharge = orderItems.find(item => item.title.indexOf(i18n.t('acc:recharge')) > -1) || false
      const isUsed = !_.isEmpty(usageList) && usageList.find(value => value.status != 'R' && value.status != 'I') || false
      const usedOrExpired = isUsed || elapsedDay > 7
      const activateCancelBtn = orderType == 'physical' ? shipmentState == 'draft' : (state == 'draft' || state == 'validation') && !isUsed
      const disableBtn = isCanceled || !activateCancelBtn || this.state.cancelPressed || (elapsedDay > 7)
      const infoText = isCanceled ? i18n.t('his:afterCancelInfo') 
                : (orderType == 'physical' ? i18n.t('his:simCancelInfo') : usedOrExpired ? i18n.t('his:usedOrExpiredInfo') : i18n.t('his:dataCancelInfo'))

      return(
        <View>
          <View style={styles.thickBar}/>
          {
            orderItems && orderItems.map((item,idx) =>
              <LabelText
                key={idx+""} style={styles.item}
                label={`${item.title}  ×  ${item.qty} ${i18n.t('qty')}`} labelStyle={styles.label}
                format="price"
                valueStyle={appStyles.roboto16Text}
                value={item.price}/>
              )
          }
          <View style={styles.bar}/>
          <LabelText
            key="productAmount" style={styles.item}
            label={i18n.t('his:productAmount')} labelStyle={styles.label2}
            format="price"
            valueStyle={appStyles.roboto16Text}
            value={totalPrice}/>
          {
            orderType == 'physical' &&
              <LabelText
                key="dvlCost" style={styles.item}
                label={i18n.t('cart:dlvCost')} labelStyle={styles.label2}
                format="price"
                valueStyle={appStyles.roboto16Text}
                value={dlvCost}/>
          }
          {
            !isRecharge &&
              <LabelText
                key={"pymBalance"} style={styles.item}
                label={i18n.t("pym:balance")} labelStyle={styles.label2}
                format="price"
                valueStyle={appStyles.roboto16Text}
                value={`- ${balanceCharge}`}/>
          }
          <View style={styles.bar}/>
          <View style={[styles.row, {marginBottom: 5}]}>
            <Text style={[appStyles.normal16Text]}>{i18n.t('cart:totalCost')} </Text>
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Text style={[styles.normal16BlueTxt, {color: colors.black}]}>{i18n.t('total')}</Text>
              <Text style={[appStyles.price, styles.fontWeightBold, {marginHorizontal: 5}]}>{utils.numberToCommaString(paidAmount)}</Text>
              <Text style={[styles.normal16BlueTxt, {color: colors.black}]}>{i18n.t('won')}</Text>
            </View>
          </View>
          {
            !( isRecharge )?
            <AppButton
                style={[styles.cancelBtn, {borderColor: this.state.borderBlue ? colors.clearBlue : colors.lightGrey}]}
                disableBackgroundColor={colors.whiteTwo}
                disableColor={colors.greyish}
                disabled={disableBtn || this.state.disableBtn}
                onPress={() => this._cancelOrder()}
                title={i18n.t('his:cancel')}
                titleStyle={styles.normal16BlueTxt}/>
            : <View style={{marginBottom: 20}}/>    
          }
          <Text style={styles.cancelInfo}>{!isRecharge && infoText}</Text>
        </View>  
      )
  }

  _headerInfo(){
    const { orderNo, orderDate, orderItems, isCanceled, method, disableBtn } = this.state || {}

    const pg = !_.isEmpty(method) ? method.paymentMethod : i18n.t("pym:balance")

    if ( _.isEmpty(orderItems) ) return <View></View>

    var label = orderItems[0].title
    if ( orderItems.length > 1) label = label + i18n.t('his:etcCnt').replace('%%', orderItems.length - 1)
              
    return(
      <View>
        <Text style={styles.date}>{utils.toDateString(orderDate)}</Text>
        <View style={styles.productTitle}>
          {
            (isCanceled || disableBtn) &&
            <Text style={[appStyles.bold18Text, {color: colors.tomato}]}>{`(${i18n.t("his:cancel")})`} </Text>
          }
          <Text style={appStyles.bold18Text}>{label}</Text>
        </View>
        <View style={styles.bar}/>
        <LabelText
          key="orderId" style={styles.item}
          label={i18n.t('his:orderId')} labelStyle={styles.label2}
          value={orderNo} valueStyle={styles.labelValue}/>
        <LabelText
          key="pymMethod" style={[styles.item, {marginBottom: 20}]}
          label={i18n.t('pym:method')} labelStyle={styles.label2}
          value={pg} valueStyle={styles.labelValue}/>
        <View style={styles.divider}/>
      </View>
    )
  }

  render() {

    const { orderItems, orderType, isCanceled, shipmentState, billingAmt,
          showPayment, showDelivery, cancelPressed, totalCnt } = this.state || {}

    if ( _.isEmpty(orderItems) ) return <View></View>

    // [physical] shipmentState : draft(취소 가능) / ready shipped (취소 불가능)
    // [draft] state = validation && status = inactive , reserved (취소 가능)
    const shipStatus = (_.isEmpty(shipmentState) || shipmentState == 'draft') ? 
                    i18n.t('his:paymentCompleted') : (shipmentState == ('ready') ? i18n.t('his:ready') : i18n.t('his:shipped'))

    return (
      <ScrollView style={styles.container}
                  onScroll={this._onScroll}
                  scrollEventThrottle={16}>
        <SafeAreaView forceInset={{ top: 'never', bottom:"always"}}>
        <SnackBar ref={this.snackRef}
                  visible={cancelPressed} backgroundColor={colors.clearBlue} 
                  textMessage={i18n.t("his:cancelSuccess")} messageColor={colors.white}
                  position={'top'}
                  top={this.state.scrollHeight + windowHeight/2}
                  containerStyle={{borderRadius: 3, height: 48, marginHorizontal: 10}}
                  actionText={'X'}
                  actionStyle={{paddingHorizontal: 20}}
                  accentColor={colors.white}
                  // distanceCallback={(distance) => {console.log('distance', distance)}}
                  actionHandler={()=>{this.snackRef.current.hideSnackbar()}}/>
          {
            this._headerInfo()
          }
          <TouchableOpacity style={styles.dropDownBox} onPress={this._onPressPayment} >
            <Text style={styles.boldTitle}>{i18n.t('his:paymentDetail')}</Text>
            <View style={{flexDirection: 'row'}}>
            {
              !showPayment &&
              <View style={[styles.alignCenter, {flexDirection: 'row'}]}>
                <Text style={styles.normal16BlueTxt}>{i18n.t('total')}</Text>
                <Text style={[styles.normal16BlueTxt, styles.fontWeightBold]}>{totalCnt}</Text>
                <Text style={styles.normal16BlueTxt}>{i18n.t('qty')} / </Text>
                <Text style={[styles.normal16BlueTxt, styles.fontWeightBold]}>{utils.numberToCommaString(billingAmt)}</Text>
                <Text style={styles.normal16BlueTxt}>{i18n.t('won')}</Text>
              </View>
            }
              <AppButton style={{backgroundColor: colors.white, height:70}} 
                        iconName= {showPayment ? "iconArrowUp" : "iconArrowDown"}
                        iconStyle={styles.dropDownIcon}/>
            </View>
          </TouchableOpacity>  
          {
            showPayment && this._paymentInfo()
          }
          <View style={styles.divider}/>
          {
            orderType == 'physical' && !isCanceled &&
            <View>
              <TouchableOpacity style={styles.dropDownBox} onPress={this._onPressDelivery} >
                <Text style={styles.boldTitle}>{i18n.t('his:shipmentInfo')}</Text>
                <View style={{flexDirection: 'row'}}>
                  {
                    !showDelivery &&
                    <Text style={[styles.normal16BlueTxt, styles.alignCenter]}>{shipStatus}</Text>
                  }
                  <AppButton style={{backgroundColor: colors.white, height:70}}
                            iconName= {showDelivery ? "iconArrowUp" : "iconArrowDown"}
                            iconStyle={styles.dropDownIcon}/>
                </View>
              </TouchableOpacity>  
              {
                showDelivery && this._deliveryInfo()
                // this._deliveryInfo(isCanceled)
              }    
              <View style={styles.divider}/>
            </View>
          }
          <AppActivityIndicator visible={this.props.pending} />      
        </SafeAreaView>
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropDownBox: {
    marginHorizontal: 20,
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  dropDownIcon: {
    flexDirection: 'column',
    alignSelf: 'flex-end'
  },
  alias: {
    ... appStyles.bold18Text,
    //fontFamily: "AppleSDGothicNeo",
    marginVertical: 20,
    marginHorizontal: 20,
    color: colors.black
  },
  profileTitle: {
    marginBottom: 6,
    marginLeft: 0, 
    flex: 1, 
    flexDirection: 'row'
  },
  profileTitleText: {
    color: colors.black,
    alignItems: 'flex-start', 
    marginHorizontal: 20, 
    marginVertical: 10, 
    fontSize: 16, 
    fontWeight: 'bold'
  },
  basicAddr: {
    ... appStyles.normal12Text,
    width: 52,
    height: isAndroid() ? 15: 12,
    lineHeight: isAndroid() ? 15 : 12,
    fontSize: isAndroid() ? 11 : 12,
    color: colors.clearBlue,
    alignSelf: 'center',
  },
  basicAddrBox: {
    width: 68,
    height: 22,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.clearBlue,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  addrCard: {
    marginHorizontal: 20
  },
  addrCardText: {
    ... appStyles.normal14Text,
    color: colors.black,
    lineHeight: 24
  },
  title: {
    ... appStyles.bold18Text,
    height: 21,
    //fontFamily: "AppleSDGothicNeo",
    marginBottom: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black
  },
  date: {
    ... appStyles.normal14Text,
    marginTop: 40,
    marginLeft: 20,
    color: colors.warmGrey
  },
  normal16BlueTxt: {
    ... appStyles.normal16Text,
    color: colors.clearBlue,
    lineHeight: 24,
    letterSpacing: 0.24,
  },
  arrowIcon: {
    justifyContent: 'center', 
    marginHorizontal: isDeviceSize('small') ? 15 : 20
  },
  boldTitle: {
    ... appStyles.bold18Text,
    color: colors.black,
    lineHeight: 22,
    // marginTop: 20,
    alignSelf: 'center'
  },
  productTitle: {
    ... appStyles.bold18Text,
    lineHeight: 24,
    letterSpacing: 0.27,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginVertical: 10,
    maxWidth: isDeviceSize('small') ? '70%' : '80%'
  },
  cancelBtn: {
    backgroundColor: colors.white,
    borderRadius: 3,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    margin: 20,
    height: 48,
    justifyContent: 'center'
  },
  cancelInfo: {
    ... appStyles.normal14Text,
    marginHorizontal: 20,
    marginBottom: 40,
    color: colors.warmGrey,
    lineHeight: 28
  },
  deliveryTitle: {
    ... appStyles.normal18Text,
    color: colors.warmGrey,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  companyInfoTitle: {
    ... appStyles.normal14Text,
    lineHeight: 36,
    letterSpacing: 0.23,
    color: colors.warmGrey,
    width: '22%'
  },
  deliveryStatus: {
    ... appStyles.normal16Text,
    color: colors.greyishTwo,
    letterSpacing: 0.26,
    alignSelf: 'center',
  },
  bar: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1, 
    marginHorizontal: 20,
    marginVertical: 30,
  },
  thickBar: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1, 
    marginHorizontal: 20,
    // marginVertical: 20,
    marginBottom: 30,
  },
  item: {
    marginHorizontal: 20,
    height: 36,
    alignItems: 'center',
    minWidth:'25%'
  },
  label: {
    ... appStyles.bold16Text,
    fontSize: isDeviceSize('small') ? 14: 16,
    lineHeight: 36, 
    letterSpacing: 0.26,
    color: colors.black,
  },
  labelValue: {
    ... appStyles.normal16Text,
    lineHeight: 36, 
    letterSpacing: 0.22,
    color: colors.black,
    marginLeft: 0,
  },
  divider: {
    // marginTop: 25,
    // marginBottom: 20,
    height: 10,
    backgroundColor: colors.whiteTwo
  },
  label2: {
    ... appStyles.normal14Text,
    lineHeight: 36,
    color: colors.warmGrey
  },
  row: {
    ... appStyles.itemRow,
    paddingHorizontal: 20,
    height: isDeviceSize('small') ? 30 : 36,
    alignItems: 'center',
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  fontWeightBold: {
    fontWeight: 'bold',
    lineHeight:24,
    letterSpacing: 0.22
  },
  alignCenter: {
    alignSelf: 'center',
    marginRight: 15
  }
});

const mapStateToProps = state => ({
  account: state.account.toJS(),
  auth: accountActions.auth(state.account),
  uid: state.account.get('uid'),
  pending: state.pender.pending[orderActions.GET_ORDERS] || 
    state.pender.pending[orderActions.CANCEL_ORDER] || false
})

export default connect(mapStateToProps,
  (dispatch) => ({
    action: {
      order: bindActionCreators (orderActions, dispatch),
      account: bindActionCreators(accountActions, dispatch)
    }
  })
)(PurchaseDetailScreen)