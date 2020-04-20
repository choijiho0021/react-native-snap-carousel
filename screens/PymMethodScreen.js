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
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import PaymentItemInfo from '../components/PaymentItemInfo';
import { isAndroid } from '../components/SearchBarAnimation/utils';
import { isDeviceSize } from '../constants/SliderEntry.style';
import getEnvVars from '../environment';
import RNPickerSelect from 'react-native-picker-select';
import Triangle from '../components/Triangle';
import paymentApi from '../utils/api/paymentApi';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppIcon from '../components/AppIcon';
import Video from 'react-native-video';

const deliveryText = [{
                        key: i18n.t("pym:tel"),
                        value: i18n.t("pym:toTel")
                      },
                      {
                        key: i18n.t("pym:frontDoor"),
                        value: i18n.t("pym:atFrontDoor")
                      },
                      {
                        key: i18n.t("pym:deliveryBox"),
                        value: i18n.t("pym:toDeliveryBox")
                      },
                      {
                        key: i18n.t("pym:security"),
                        value: i18n.t("pym:toSecurity")
                      },
                      {
                        key: i18n.t("pym:input"),
                        value: i18n.t("pym:input")
                      }]

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
        address: true,
        memo: true,
        method: true
      },
      deliveryMemo:{
        directInput: false,
        header: undefined,
        selected: undefined,
        content: undefined,
      },
      consent: undefined,
    }

    this.confirmList = [
      {
        key: "1",
        route: 'SimpleText', 
        param: { key: 'PrivacyPolicy', title: i18n.t('pym:privacy')} 
      },
      {
        key: "2",
        route: 'SimpleText', 
        param: { key: 'MarketingAgreement', title: i18n.t('pym:paymentAgency')} 
      }
    ]

    this._onSubmit = this._onSubmit.bind(this)
    this._onPress = this._onPress.bind(this)
    this._button = this._button.bind(this)
    this._address = this._address.bind(this)
    this._memo = this._memo.bind(this)
    this._method = this._method.bind(this)
    this._saveMemo = this._saveMemo.bind(this)
    this._showModal = this._showModal.bind(this)
    this._move = this._move.bind(this)
    this._consentEssential = this._consentEssential.bind(this)
    this._consentBox = this._consentBox.bind(this)
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
        rokebi_cash: deduct,              // balance 차감 금액 
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
    const rowLength = paymentApi.method.length - 1

    return (
      <View key={key} style={styles.buttonRow}>
      {
        value.map((v,idx) => 
        <AppButton 
          key={v.method} 
          title={_.isEmpty(v.icon) && v.title}
          style={[styles.button, idx == rowLength && {borderRightWidth:1}, key == rowLength && {borderBottomWidth: 1}]}
          iconName={!_.isEmpty(v.icon) && v.icon}
          checked={v.method == selected.method}
          checkedStyle={{borderWidth: 1, borderColor: colors.clearBlue}}
          checkedColor={colors.clearBlue}
          onPress={this._onPress(v)}
        titleStyle={styles.buttonText}/>)
      }
      </View>
    )
  }

  _saveMemo(value){

    const selectedMemo = deliveryText.find(item => item.value == value) || {}

    if(!_.isEmpty(selectedMemo)){
      if(deliveryText.indexOf(selectedMemo)+1 == deliveryText.length){
        this.setState({
          deliveryMemo:{
            directInput: true,
            header: !_.isEmpty(selectedMemo) && selectedMemo.key,
            selected: value,
            content: undefined,
          }
        })
      }else{
        this.setState({
          deliveryMemo: {          
            directInput: false,
            header: !_.isEmpty(selectedMemo) && selectedMemo.key,
            selected: value,
          }        
        })
      }
    }
  }

  _showModal(key){
    this.setState({
      showModal: {
        ... this.state.showModal,
        [key]: !this.state.showModal[key]
      }
    })
  }

  _address(){

    const selectedAddr = this.props.profile.selectedAddr || undefined
    const profile = this.props.profile.profile
    const item = profile.find(item =>item.uuid==selectedAddr) || profile.find(item =>item.isBasicAddr) || {}

    return (
      <View>
        <TouchableOpacity style={styles.dropDownBox} onPress={()=>this._showModal('address')}>
          <Text style={styles.boldTitle}>{i18n.t('pym:delivery')}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            {
              !this.state.showModal.address &&
              <Text style={[styles.alignCenter,styles.normal16BlueTxt]}>{item.alias}</Text>
            }
            <AppButton style={{backgroundColor: colors.white, height:70}} 
                    iconName= {this.state.showModal.address ? "iconArrowUp" : "iconArrowDown"}
                    iconStyle={styles.dropDownIcon}/>
          </View>          
        </TouchableOpacity>
        {
          this.state.showModal.address &&
          <View style={styles.beforeDrop}>
            <View style={styles.thickBar}/>
          {
            // 주소
            this.props.profile.profile.length > 0 && 
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
                profile={item}
                mobile={this.props.account.mobile}/>
            </View>
          }
          {
            // 주소 등록 
            // == 0
            // 확인하기
            this.props.profile.profile.length == 0 &&
              <AppButton title={i18n.t('reg:address')}
                textStyle={appStyles.confirmText}
                style={[appStyles.confirm, styles.addrBtn]}
                onPress={() => this.props.navigation.navigate('AddProfile')}/>
          }
          </View>
        }
        <View style={styles.divider}/>
      </View>
    )
  }

  _memo(){
    return(
      <View>
        <TouchableOpacity style={styles.dropDownBox} onPress={()=>this._showModal('memo')}>
          <Text style={styles.boldTitle}>{i18n.t('pym:deliveryMemo')}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            {
              !this.state.showModal.memo &&
              <Text style={[styles.alignCenter,styles.normal16BlueTxt]}>{this.state.deliveryMemo.header}</Text>
            }
            <AppButton style={{backgroundColor: colors.white, height:70}} 
                      iconName= {this.state.showModal.memo ? "iconArrowUp" : "iconArrowDown"}
                      iconStyle={styles.dropDownIcon}/>
          </View>
        </TouchableOpacity>
        {
          this.state.showModal.memo &&
          <View style={styles.beforeDrop}>
            <View style={styles.thickBar}/>
            <View style={styles.pickerWrapper}>
              <RNPickerSelect style={{
                            ... pickerSelectStyles,
                          }}
                            useNativeAndroidPickerStyle={false}
                            placeholder={{label: i18n.t("pym:selectMemo")}}
                            placeholderTextColor={colors.warmGrey}
                            onValueChange={(value)=>{this._saveMemo(value)}} 
                            items={deliveryText.map(item => ({
                              label: item.value,
                              value: item.value
                            }))}
                            value={this.state.deliveryMemo.selected}
                            Icon={() => {
                              return (<Triangle width={8} height={6} color={colors.warmGrey}/>)
                            }}/>
            </View>
            {
              this.state.deliveryMemo.directInput &&
              <TextInput
                    placeholder={i18n.t("pym:IputMemo")}
                    placeholderTextColor={colors.warmGrey}
                    style={styles.textField}
                    // clearTextOnFocus={true}
                    maxLength={50}
                    returnKeyType='done'
                    multiline={true}
                    enablesReturnKeyAutomatically={true}
                    onChangeText={(val)=>{this.setState({... this.state.deliveryMemo, content: val})}}
                    // maxFontSizeMultiplier
                    />
            }
          </View>
        }
        <View style={styles.divider}/>
      </View>
    )
  }

  _method(){
    return(
      <View>
        <TouchableOpacity style={styles.dropDownBox} onPress={()=>this._showModal('method')}>
          <Text style={styles.boldTitle}>{i18n.t('pym:method')}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            {
              !this.state.showModal.method &&
              <Text style={[styles.alignCenter,styles.normal16BlueTxt]}>{this.state.selected.title}</Text>
            }
            <AppButton style={{backgroundColor: colors.white, height:70}} 
                      iconName= {this.state.showModal.method ? "iconArrowUp" : "iconArrowDown"}
                      iconStyle={styles.dropDownIcon}/>
          </View>
        </TouchableOpacity>
        {
          this.state.showModal.method &&
          <View style={styles.beforeDrop}>
            <View style={styles.thickBar}/>
            {
              paymentApi.method.map((v,idx) => this._button(idx+"", v))
            }
            <Text style={{marginVertical: 20, color: colors.clearBlue}}>{i18n.t('pym:tossInfo')}</Text>
            <View style={{backgroundColor: colors.whiteTwo, padding: 15}}>
              <Text style={styles.normal12TxtLeft}>{i18n.t('pym:kakaoInfo')}</Text>
              <Text style={[styles.normal12TxtLeft, {color: colors.warmGrey}]}>{i18n.t('pym:kakaoInfoContent')}</Text>
            </View>
          </View>
        }
        <View style={styles.divider}/>
      </View>
    )
  }

  _move(key) {
    if ( !_.isEmpty(key) ) {
      const {route, param} = this.confirmList.find(item => item.key == key)
      this.props.navigation.navigate(route, param)
    }
  }
  
  _consentEssential(){
    this.setState({
      consent: !this.state.consent
    })
  }

  _consentBox(){
    return(
      <View style={{backgroundColor: colors.whiteTwo, padding: 20, paddingBottom: 45}}>
      <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=>this._consentEssential()}>
        <AppIcon name="btnCheck2"
                checked={this.state.consent}
                size={22}/>
        <Text style={[appStyles.bold16Text,{color: colors.black, marginLeft: 12}]}>{i18n.t('pym:consentEssential')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.buttonRow, {marginTop: 20}]} onPress={()=>this._move("1")}>
        <Text style={[appStyles.normal14Text, {color: colors.warmGrey, lineHeight: 22}]}>{i18n.t("pym:privacy")}</Text>
        <Text style={styles.underlinedClearBlue}>{i18n.t("pym:detail")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonRow} onPress={()=>this._move("2")}>
        <Text style={[appStyles.normal14Text, {color: colors.warmGrey, lineHeight: 22}]}>{i18n.t("pym:paymentAgency")}</Text>
        <Text style={styles.underlinedClearBlue}>{i18n.t("pym:detail")}</Text>
      </TouchableOpacity>
    </View>
    )
  }

  render() {
    const { selected, pymPrice, deduct, isRecharge, consent, deliveryMemo:{header, content} } = this.state,
      { purchaseItems = [], pymReq } = this.props.cart,
      simIncluded = purchaseItems.findIndex(item => item.type == 'sim_card') >= 0,
      noProfile = this.props.profile.profile.length == 0

    return (
      <SafeAreaView style={styles.container} forceInset={{top: 'never', bottom:"always"}}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          enableOnAndroid={true}
          // extraScrollHeight={60}
          innerRef={ref => { this.scroll = ref; }}>
          <PaymentItemInfo cart={purchaseItems} pymReq={pymReq} balance={this.props.account.balance} mode={'method'}
                          pymPrice={pymPrice} deduct={deduct} isRecharge={isRecharge}/>  
              
          {
            simIncluded && this._address()
          }
          {
            simIncluded && this._memo()
          }
          {
            pymPrice !=0 ? this._method()
            :
              <View style={styles.result}>
                <Text style={styles.resultText}>{i18n.t('pym:balPurchase')}</Text>
              </View>
          }
          {
            this._consentBox()
          }
        </KeyboardAwareScrollView>

        <AppButton title={i18n.t('payment')} 
                      textStyle={appStyles.confirmText}
                      disabled={(pymPrice !=0 && (_.isEmpty(selected)) || (simIncluded && (noProfile || _.isEmpty(header))) || !consent)}
                      key={i18n.t('payment')}
                      onPress={this._onSubmit}
                      style={appStyles.confirm} />
        {
          this.state.loading && <Video source={require('../assets/images/loading_1.mp4')} resizeMode={"stretch"} repeat={true} style={styles.backgroundVideo}/>
        }
      </SafeAreaView>
    )
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: colors.black,
    fontSize: isDeviceSize('small') ? 12 : 14,
    paddingVertical: 8
  },
  inputAndroid: {
    height: 37,
    fontSize: 12,
    lineHeight: 20, 
    color: colors.black,
  },
  iconContainer: {
    top: 4,
    right: 10,
    paddingVertical: 8
  }
})

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
    // marginTop: 20,
    height: 10,
    backgroundColor: colors.whiteTwo
  },
  buttonRow : {
    flexDirection: "row",
    justifyContent: 'space-between',
    // marginTop: 15,
    // marginHorizontal: 20,
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
    // marginHorizontal: 20,
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
    marginRight: 20,
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
    marginLeft: 20
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
    // marginVertical: 20,
    marginBottom: 30,
  },
  pickerWrapper: {
    ...appStyles.borderWrapper,
    height: 40,
    borderColor: colors.lightGrey,
    paddingLeft: 20,
    alignContent: 'center',
    justifyContent: 'center'
  },
  textField: {
    borderRadius: 3,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    marginTop: 15,
    height: 100,
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignSelf: 'center',
    marginRight: 15
  },
  normal16BlueTxt: {
    ... appStyles.normal16Text,
    color: colors.clearBlue,
    lineHeight: 24,
    letterSpacing: 0.24,
  },
  normal12TxtLeft: {
    ... appStyles.normal12Text,
    color: colors.black,
    textAlign: 'left'
  },
  underlinedClearBlue: {
    color: colors.clearBlue,
    textDecorationLine: 'underline'
  },
  beforeDrop: {
    marginHorizontal: 20,
    marginBottom: 45
  }
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