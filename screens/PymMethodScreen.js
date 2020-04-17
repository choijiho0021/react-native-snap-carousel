import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as accountActions from '../redux/modules/account'
import * as profileActions from '../redux/modules/profile'
import * as cartActions from '../redux/modules/cart'
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import AppButton from '../components/AppButton';
import _ from 'underscore'
import { SafeAreaView } from 'react-navigation';
import AddressCard from '../components/AddressCard'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import PaymentItemInfo from '../components/PaymentItemInfo';
import { isAndroid } from '../components/SearchBarAnimation/utils';
import { isDeviceSize } from '../constants/SliderEntry.style';
import getEnvVars from '../environment';
import Video from 'react-native-video';
import paymentApi from '../utils/api/paymentApi';

class PymMethodScreen extends Component {

  static navigationOptions =  ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
        headerLeft: <AppBackButton navigation={navigation} title={i18n.t('payment')} isPaid={params.isPaid}/>
    }  
  }

  constructor(props) {
    super(props)

    this.state = {
      data: undefined,
      selected: {},
      pymPrice: undefined,
      deduct: undefined,
      isRecharge: undefined,
      clickable: true,
      loading: undefined,
      showModal:{
        delivery: true,
        memo: true,
        method: true
      }      
    }

    this._onSubmit = this._onSubmit.bind(this)
    this._onPress = this._onPress.bind(this)
    this._button = this._button.bind(this)
    this._address = this._address.bind(this)
    // this._memo = this._memo.bind(this)
  }

  componentDidMount() {
    this.props.action.profile.getCustomerProfile(this.props.account)
    const {pymPrice, deduct} = this.props.cart

    this.setState({
      pymPrice,
      deduct,
      isRecharge: this.props.cart.purchaseItems.findIndex(item => item.type == 'rch') >= 0
    })

  }

  async _onSubmit() {
    
    if (! this.state.clickable) return

    this.setState({
      clickable: false
    })

    const { selected, pymPrice, deduct } = this.state
    
    if ( (! selected) && (pymPrice !=0) ) return

    const { mobile, email } = this.props.account,
      profileId = this.props.profile.selectedAddr || (this.props.profile.profile.find(item => item.isBasicAddr) || {}).uuid,
      dlvCost = (this.props.cart.pymReq.find(item => item.key == 'dlvCost') || {}).amount

    // 로깨비캐시 결제
    if (pymPrice == 0) {
      this.setState({
        loading: true
      })
      await this.props.navigation.setParams({isPaid:true})
      const {impId} = getEnvVars()
      const response = { imp_success: true,
        imp_uid: impId,
        merchant_uid: `mid_${mobile}_${new Date().getTime()}`,
        profile_uuid: profileId,
        amount: 0,
        rokebi_cash: deduct,
        dlvCost,
        payment_type: 'rokebi_cash'
      }
      const orderResult = await this.props.action.cart.payNorder(response)
      // 최종 결제 처리 과정에서 실패할 수 있다. pymResult.result 값이 0인지 다시 확인한다.
      this.props.navigation.replace('PaymentResult', {pymResult:response, orderResult})

    } else {
      const params = {
        pg : selected.key,
        pay_method: selected.method,
        merchant_uid: `mid_${mobile}_${new Date().getTime()}`,
        name: i18n.t('appTitle'),
        amount: pymPrice,                 // 최종 결제 금액 
        rokebi_cash: deduct,      // balance 차감 금액 
        buyer_tel: mobile,
        buyer_name: mobile,
        buyer_email: email,
        escrow: false,
        app_scheme: 'Rokebi',
        profile_uuid: profileId,
        dlvCost,
        // mode: 'test'
      };

      this.setState({
        clickable: true
      })
      this.props.navigation.navigate('Payment', {params: params})
    }
  }

  _onPress = (method) => () => {
    this.setState({
      selected: method
    })
  }

  _button(key, value) {

    const { selected } = this.state

    return (
      <View key={key} style={styles.buttonRow}>
      {
        value.map((v,idx) => <AppButton 
          key={idx+""} 
          title={v.title} 
          style={styles.button}
          checked={v.title == selected.title}
          checkedColor={colors.clearBlue}
          onPress={this._onPress(v)}
          titleStyle={styles.buttonText}/>)
      }
      </View>
    )
  }

  _address(){

    const selectedAddr = this.props.profile.selectedAddr || undefined
    const profile = this.props.profile.profile
    const item = profile.find(item =>item.uuid==selectedAddr) || profile.find(item =>item.isBasicAddr) || {}

    return (
      <View>
        {
          // 주소
          this.props.profile.profile.length > 0 && 
          <View>
            <Text style={styles.title}>{i18n.t('pym:delivery')}</Text>
              <View>
                <View style={styles.profileTitle}>
                  <Text style={styles.profileTitleText}>{item.alias}</Text>
                  { 
                    item.isBasicAddr &&
                    <View style={styles.basicAddrBox}>
                      <Text style={styles.basicAddr}>{i18n.t('addr:basicAddr')}</Text>
                    </View>
                  }
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <AppButton title={i18n.t('change')} 
                              titleStyle={styles.chgButtonText}
                              style={[styles.chgButton]}
                              onPress={() => this.props.navigation.navigate('CustomerProfile')}/>
                  </View>
                </View>
                <AddressCard 
                  textStyle={styles.addrCardText}
                  mobileStyle={[styles.addrCardText, {color: colors.warmGrey}]}
                  style={styles.addrCard}
                  profile={item}
                  mobile={this.props.account.mobile}/>
              </View>  
            <View style={styles.divider}/>            
          </View>
        }

        {
          // 주소 등록 
          // == 0
          this.props.profile.profile.length == 0 &&
          <View>
            <Text style={styles.title}>{i18n.t('pym:delivery')}</Text>
            <View>
              <AppButton title={i18n.t('reg:address')}
                textStyle={appStyles.confirmText}
                style={[appStyles.confirm, styles.addrBtn]}
                onPress={() => this.props.navigation.navigate('AddProfile')}/>
            </View>
            <View style={styles.divider}/>
          </View>
        }
      </View>
    )
  }

  // _memo(){
  //   return(
  //     <View>
  //       <Text style={styles.title}>{i18n.t('pym:deliveryMemo')}</Text>
  //       <View style={styles.divider}/>
  //     </View>
  //   )
  // }

  render() {
    const { selected, pymPrice, deduct, isRecharge } = this.state,
      { purchaseItems = [], pymReq } = this.props.cart,
      simIncluded = purchaseItems.findIndex(item => item.type == 'sim_card') >= 0,
      noProfile = this.props.profile.profile.length == 0

    return (
      <SafeAreaView style={styles.container} forceInset={{top: 'never', bottom:"always"}}>
        <ScrollView>
          <PaymentItemInfo cart={purchaseItems} pymReq={pymReq} balance={this.props.account.balance} mode={'method'}
                          pymPrice={pymPrice} deduct={deduct} isRecharge={isRecharge}/>              

          {
            simIncluded && this._address()
          }
          {
            // simIncluded && 
            // <TouchableOpacity style={styles.dropDownBox} onPress={this._onPressPayment} >
            //   <Text style={styles.boldTitle}>{i18n.t('pym:deliveryMemo')}</Text>
            //   <View style={styles.thickBar}/>
            //   <View style={{flexDirection: 'row'}}>
            //   {
            //     !this.state.showModal.memo &&
            //     <View style={[styles.alignCenter, {flexDirection: 'row'}]}>
            //       <Text>hihi</Text>
            //       {/* <Text style={styles.normal16BlueTxt}>{i18n.t('total')}</Text>
            //       <Text style={[styles.normal16BlueTxt, styles.fontWeightBold]}>{orderItems.length}</Text>
            //       <Text style={styles.normal16BlueTxt}>{i18n.t('qty')} / </Text>
            //       <Text style={[styles.normal16BlueTxt, styles.fontWeightBold]}>{utils.numberToCommaString(billingAmt)}</Text>
            //       <Text style={styles.normal16BlueTxt}>{i18n.t('won')}</Text> */}
            //     </View>
            //   }
            //     <AppButton style={{backgroundColor: colors.white, height:70}} 
            //               iconName= {this.state.showModal.memo ? "iconArrowUp" : "iconArrowDown"}
            //               iconStyle={styles.dropDownIcon}/>
            //   </View>
            // </TouchableOpacity>  
          }
          {
            pymPrice !=0 ?
              <View>
                <Text style={[styles.title, styles.mrgBottom5]}>{i18n.t('pym:method')}</Text>
                <View style={styles.mrgBottom33}>
                  {
                    paymentApi.method.map((v,idx) => this._button(idx+"", v))
                  }
                </View>
              </View>  
            :
              <View style={styles.result}>
                <Text style={styles.resultText}>{i18n.t('pym:balPurchase')}</Text>
              </View>
          }
        </ScrollView>

        <AppButton title={i18n.t('payment')} 
                      textStyle={appStyles.confirmText}
                      disabled={(pymPrice !=0 && (_.isEmpty(selected)) || (simIncluded && noProfile))}
                      key={i18n.t('payment')}
                      onPress={this._onSubmit}
                      style={appStyles.confirm} />
                              {/* {
          this.state.loading && <Video source={require('../assets/images/loading_1.mp4')} resizeMode={"stretch"} repeat={true} style={styles.backgroundVideo}/>
        }       */}

      </SafeAreaView>
            
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: 'stretch'
  },
  title: {
    ... appStyles.bold18Text,
    //fontFamily: "AppleSDGothicNeo",
    marginVertical: 20,
    marginHorizontal: 20,
    color: colors.black
  },
  row: {
    ... appStyles.itemRow,
    height: 36,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0
  },
  divider: {
    marginTop: 30,
    height: 10,
    backgroundColor: colors.whiteTwo
  },
  buttonRow : {
    flexDirection: "row",
    justifyContent: 'space-between',
    // marginTop: 15,
    marginHorizontal: 20,
  },
  button: {
    flex:1,
    height: 62,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.lightGrey
  },
  buttonText: {
    ... appStyles.normal14Text,
    textAlign: 'center',
    color: colors.warmGrey
  },
  addrCard: {
    marginHorizontal: 20
  },
  addrCardText: {
    ... appStyles.normal14Text,
    color: colors.black,
    lineHeight: 24
  },
  mrgBottom5: {
    marginBottom: 5
  },
  mrgBottom33: {
    marginBottom: 33
  },
  addrBtn: {
    height: 48, 
    borderRadius: 3, 
    marginHorizontal: 20, 
    marginTop: 0
  },
  profileTitle: {
    marginBottom: 6, 
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
  chgButtonText: {
    ... appStyles.normal12Text,    
    color: colors.white
  },
  chgButton: {
    width: 50, 
    height: 36, 
    borderRadius: 3, 
    backgroundColor: colors.warmGrey, 
    marginHorizontal: 20
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
  result: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 400,
    minHeight: isDeviceSize('small') ? '30%' : '40%',
  },
  resultText: {
    ... appStyles.normal14Text,
    color: colors.warmGrey,
    textAlign: 'center', 
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  dropDownBox: {
    marginHorizontal: 20,
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  boldTitle: {
    ... appStyles.bold18Text,
    color: colors.black,
    lineHeight: 22,
    // marginTop: 20,
    alignSelf: 'center'
  },
  dropDownIcon: {
    flexDirection: 'column',
    alignSelf: 'flex-end'
  },
  thickBar: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1, 
    marginHorizontal: 20,
    // marginVertical: 20,
    marginBottom: 30,
  },
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  cart: state.cart.toJS(),
  auth: accountActions.auth(state.account),
  profile: state.profile.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action: {
      account : bindActionCreators(accountActions, dispatch),
      cart : bindActionCreators(cartActions, dispatch),
      profile : bindActionCreators(profileActions, dispatch),  
    }
  })
)(PymMethodScreen)