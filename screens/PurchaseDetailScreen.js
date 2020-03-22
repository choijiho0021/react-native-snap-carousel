import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import utils from '../utils/utils';
import AppButton from '../components/AppButton';
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import LabelText from '../components/LabelText';
import _ from 'underscore';
import { isDeviceSize } from '../constants/SliderEntry.style';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import LabelTextTouchable from '../components/LabelTextTouchable';
import orderApi from '../utils/api/orderApi';
import profileApi from '../utils/api/profileApi';
import {connect} from 'react-redux'
import * as accountActions from '../redux/modules/account'
import AppIcon from '../components/AppIcon';
import { isAndroid } from '../components/SearchBarAnimation/utils';
import AddressCard from '../components/AddressCard';

class PurchaseDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('his:detail')}/>
  })

  constructor(props) {
    super(props)
    this.state = {
      showPayment: false,
      showDelivery: false
    }
    this.method = [
      [
        {
          key: 'html5_inicis',
          title: i18n.t('pym:ccard')
        },
        {
          key: 'danal',
          title: i18n.t('pym:mobile')
        },
        {
          key: 'kakaopay',
          title: i18n.t('pym:kakao')
        },
        {
          key: 'payco',
          title: i18n.t('pym:payco')
        },
      ],
    ]
    
    this._paymentDetail = this._paymentDetail.bind(this)
    this._deliveryInfo = this._deliveryInfo.bind(this)
    this._profile = this._profile.bind(this)
    this._address = this._address.bind(this)
  }

  componentDidMount() {
    const detail = this.props.navigation.getParam('detail')
    this.setState(detail)

    // TODO
    // load Profile by profile_id
    profileApi.getCustomerProfileById(detail.profileId, this.props.auth).then(resp => 
      this._profile(resp));
  }

  _profile(profile){
    this.setState({
      profile: profile.objects[0]
    })
  }

  _paymentDetail(){
    this.setState({
      showPayment: !this.state.showPayment
    })
  }

  _deliveryInfo(){
    this.setState({
      showDelivery: !this.state.showDelivery
    })
  }
  _address(){
    const profile = !_.isEmpty(this.state.profile) && this.state.profile
    return(
      // 주소
      profile && 
      <View>
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

  render() {
    const {orderId, orderDate, orderItems, orderType, iamportPayment, totalPrice,
        trackingCompany, trackingCode, shipmentState} = this.props.navigation.getParam('detail') || {}
    const label = `${orderItems[0].title}  ${orderItems.length > 1 ? i18n.t('his:etcCnt').replace('%%', orderItems.length - 1) : ''}`

    const pg = !_.isEmpty(iamportPayment) ? this.method[0].find(item => item.key == iamportPayment[0].pg).title : i18n.t("pym:balance")
    const paidAmount = !_.isEmpty(iamportPayment) ? (iamportPayment[0].totalPrice) : 0
    const paymentList = !_.isEmpty(this.props.navigation.getParam('detail').paymentList) && this.props.navigation.getParam('detail').paymentList[0]
    const dlvCost = utils.stringToNumber(!_.isEmpty(paymentList) ? paymentList.dlvCost : 0)
    const billingAmt = utils.numberToCommaString(totalPrice + dlvCost)

    console.log('@@@shipment', shipmentState)

    return (
      <ScrollView style={styles.container}>
        <SafeAreaView forceInset={{ top: 'never', bottom:"always"}}>
          <Text style={styles.date}>{utils.toDateString(orderDate)}</Text>
          <Text style={styles.productTitle}>{label}</Text>
          <View style={styles.bar}/>
          <LabelText
            key="orderId" style={styles.item}
            label={i18n.t('his:orderId')} labelStyle={styles.label2}
            value={orderId} valueStyle={styles.labelValue}/>
          <LabelText
            key="pymMethod" style={[styles.item, {marginBottom: 20}]}
            label={i18n.t('pym:method')} labelStyle={styles.label2}
            value={pg} valueStyle={styles.labelValue}/>
          <View style={styles.divider}/>

          <TouchableOpacity style={{marginLeft: 20, flex:1, flexDirection:'row', justifyContent: 'space-between'}} onPress={this._paymentDetail} >
            <Text style={styles.boldTitle}>{i18n.t('his:paymentDetail')}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            {
              !this.state.showPayment &&
              <View style={[{alignSelf: 'center', marginRight: 15, flexDirection: 'row',}]}>
                <Text style={[styles.summaryTitle, {textAlignVertical: 'center'}]}>{i18n.t('total')}</Text>
                <Text style={[styles.summaryTitle, styles.fontWeightBold]}>{orderItems.length}</Text>
                <Text style={[styles.summaryTitle]}>{i18n.t('qty')} / </Text>
                <Text style={[styles.summaryTitle, styles.fontWeightBold]}>{billingAmt}</Text>
                <Text style={[styles.summaryTitle]}>{i18n.t('won')}</Text>
              </View>
            }
              <AppButton style={{backgroundColor: colors.white, height:70, paddingRight: 20}} 
                        iconName= {this.state.showPayment ? "iconArrowUp" : "iconArrowDown"} iconStyle={{flexDirection: 'column', alignSelf: 'flex-end'}}/>
            </View>
          </TouchableOpacity>  
          {
            this.state.showPayment &&
            <View>
              <View style={styles.thickBar}/>
              {
                orderItems && orderItems.map((item,idx) =>
                  <LabelText
                    key={idx+""} style={styles.item}
                    label={`${item.title}  X  ${item.qty} 개`} labelStyle={styles.label}
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
              <LabelText
                key="dvlCost" style={styles.item}
                label={i18n.t('cart:dlvCost')} labelStyle={styles.label2}
                format="price"
                valueStyle={appStyles.roboto16Text}
                value={dlvCost}/>
              {
                paymentList.balanceCharge != 0 && !_.isEmpty(paymentList) &&
                  <LabelText
                    key={"pymBalance"} style={styles.item}
                    label={i18n.t("pym:balance")} labelStyle={styles.label2}
                    format="price"
                    valueStyle={appStyles.roboto16Text}
                    value={`- ${paymentList.balanceCharge}`}/>
              }
              <View style={styles.bar}/>
              <View style={[styles.row, {marginBottom: 25}]}>
                <Text style={[appStyles.normal16Text]}>{i18n.t('cart:totalCost')} </Text>
                <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <Text style={styles.priceTxt}>{i18n.t('total') +' '}</Text>
                  <Text style={[appStyles.price, {fontWeight: 'bold', lineHeight:24, letterSpacing: 0.21}]}>{utils.numberToCommaString(paidAmount)}</Text>
                  <Text style={styles.priceTxt}>{' ' + i18n.t('won')}</Text>
                </View>
              </View>
            </View>  
          }

          {
            orderType == 'physical' &&
            <View>
              <View style={styles.divider}/>
              <TouchableOpacity style={{marginLeft: 20, flex:1, flexDirection:'row', justifyContent: 'space-between'}} onPress={this._deliveryInfo} >
                <Text style={styles.boldTitle}>{i18n.t('his:shipmentInfo')}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  {
                    !this.state.showDelivery &&
                    <Text style={[appStyles.normal16Text, {color: colors.clearBlue, alignSelf: 'center', marginRight: 15}]}>{_.isEmpty(shipmentState) ?'결제완료' : (shipmentState == ('fulfillment') ? '상품 준비중' : '출고완료')}</Text>
                  }
                  <AppButton style={{backgroundColor: colors.white, height:70, paddingRight: 20}} 
                            iconName= {this.state.showDelivery ? "iconArrowUp" : "iconArrowDown"} iconStyle={{flexDirection: 'column', alignSelf: 'flex-end'}}/>
                </View>
              </TouchableOpacity>  
              {
                this.state.showDelivery &&
                <View>
                  <View style={styles.thickBar}/>
                  <View style={{marginHorizontal: 20}}>
                    <Text style={styles.deliveryTitle}>{i18n.t('his:shipmentState')}</Text>
                    <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                      <Text style={[styles.deliveryStatus, (_.isEmpty(shipmentState)|| shipmentState == 'validation' )&& {color: colors.clearBlue}]}>{i18n.t('his:paymentCompleted')}</Text>
                      <AppIcon name="iconArrowRight" style={styles.arrowIcon}/>
                      <Text style={[styles.deliveryStatus, shipmentState == ('fulfillment') && {color: colors.clearBlue}]}>{i18n.t('his:ready')}</Text>
                      <AppIcon name="iconArrowRight" style={styles.arrowIcon}/>
                      <Text style={[styles.deliveryStatus, shipmentState == ('shipped') && {color: colors.clearBlue}]}>{i18n.t('his:shipped')}</Text>
                    </View>
                  </View>
                  <View style={styles.bar}/>
                  <View>
                    <Text style={[styles.deliveryTitle, {marginHorizontal: 20}]}>{i18n.t('his:addressInfo')}</Text>
                      {
                        // !_.isEmpty(this.state.profile) && this._address()
                        this._address()
                      }
                  </View>
                  <View style={styles.bar}/>
                  <View style={{marginBottom: 20}}>
                    <Text style={[styles.deliveryTitle, {marginHorizontal: 20}]}>{i18n.t('his:companyInfo')}</Text>
                    <LabelText key="trackingCompany" style={styles.item} format="shortDistance"
                        label={i18n.t('his:trackingCompany')} labelStyle={styles.companyInfoTitle}
                        value={trackingCompany} valueStyle={[styles.labelValue, {justifyContent: 'flex-start'}]}/>
                    <LabelText key="tel" style={styles.item}  format="shortDistance"
                        label={i18n.t('his:tel')} labelStyle={styles.companyInfoTitle}
                        value={utils.toPhoneNumber('12341234')} valueStyle={styles.labelValue}/>
                    <LabelTextTouchable onPress={() => this.props.navigation.navigate('SimpleText', {mode:'uri', text:orderApi.deliveryTrackingUrl('CJ', '341495229094')})}
                        label={i18n.t('his:trackingCode')} labelStyle={[styles.companyInfoTitle, {marginLeft: 20, width: '20%'}]}  format="shortDistance"
                        value={trackingCode} valueStyle={[styles.labelValue, {color: colors.clearBlue, textDecorationLine: 'underline'}]}/>
                  </View>

                </View>
              }    
            <View style={styles.divider}/>
            </View>
          }      
        </SafeAreaView>
      </ScrollView>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  summaryTitle: {
    ... appStyles.normal16Text,
    color: colors.clearBlue,
    lineHeight: 22,
    letterSpacing: 0.22
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
    maxWidth: '90%'
  },
  deliveryTitle: {
    ... appStyles.normal18Text,
    color: colors.warmGrey,
    marginBottom: 20,
    // marginHorizontal: 20,
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
    color: colors.greyishTwo
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
  priceTxt: {
    ... appStyles.normal16Text,
    lineHeight: 24,
    letterSpacing: 0.24
  },
  row: {
    ... appStyles.itemRow,
    paddingHorizontal: 20,
    height: isDeviceSize('small') ? 30 : 36,
    alignItems: 'center',
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  fontWeightNormal: {
    fontWeight: 'normal'
  },
  fontWeightBold: {
    fontWeight: 'bold'
  },
  colorClearBlue: {
    color: colors.clearBlue
  }
});

const mapStateToProps = state => ({
  auth: accountActions.auth( state.account),
})

export default connect(mapStateToProps)(PurchaseDetailScreen)