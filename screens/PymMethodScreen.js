import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform
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
import { SafeAreaView } from '@react-navigation/native';
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
import orderApi from '../utils/api/orderApi';
import Analytics from 'appcenter-analytics'
import pageApi from '../utils/api/pageApi';

const deliveryText = orderApi.deliveryText

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
      mode: undefined,
      selected: {},
      pymPrice: undefined,
      deduct: undefined,
      isRecharge: undefined,
      clickable: true,
      loading: undefined,
      data: {},
      showModal:{
        address: true,
        memo: true,
        method: true
      },
      label: Platform.OS == 'android' ? undefined : i18n.t("pym:selectMemo"),
      deliveryMemo: Platform.OS == 'android' ? {
        directInput: false,
        header: i18n.t("pym:notSelected"),
        selected: undefined,
        content: i18n.t("pym:notSelected"),
      } : {
        directInput: false,
        header: undefined,
        selected: undefined,
        content: undefined,
      },
      consent: undefined,
      simIncluded: undefined,
    }

    this.confirmList = [
      {
        key: "1",
        route: 'SimpleText', 
        param: { key: 'setting:privacy', title: i18n.t('pym:privacy')} 
      },
      {
        key: "2",
        route: 'SimpleText', 
        param: { key: 'pym:agreement', title: i18n.t('pym:paymentAgency')} 
      }
    ]

    this._onSubmit = this._onSubmit.bind(this)
    this._onPress = this._onPress.bind(this)
    this._button = this._button.bind(this)
    this._address = this._address.bind(this)
    this._memo = this._memo.bind(this)
    this._changePlaceHolder = this._changePlaceHolder.bind(this)
    this._method = this._method.bind(this)
    this._saveMemo = this._saveMemo.bind(this)
    this._showModal = this._showModal.bind(this)
    this._move = this._move.bind(this)
    this._consentEssential = this._consentEssential.bind(this)
    this._consentBox = this._consentBox.bind(this)
    this._dropDownHeader = this._dropDownHeader.bind(this)
    this._inputMemo = this._inputMemo.bind(this)
    this._benefit = this._benefit.bind(this)
  }

  componentDidMount() {
    this.props.action.profile.getCustomerProfile(this.props.account)
    const {pymPrice, deduct} = this.props.cart
    const content = this.props.profile.content
    const mode = this.props.navigation.getParam('mode')

    Analytics.trackEvent('Page_View_Count', {page : 'Payment - ' + mode})

    this.setState({
      pymPrice,
      deduct,
      isRecharge: this.props.cart.purchaseItems.findIndex(item => item.type == 'rch') >= 0,
      simIncluded: this.props.cart.purchaseItems.findIndex(item => item.type == 'sim_card') >= 0,
      deliveryMemo: {
        ... this.state.deliveryMemo,
        content
      },
      mode : mode
    })
    this._benefit()
  }

  async _onSubmit() {
    
    if (! this.state.clickable) return

    this.setState({
      clickable: false
    })

    const { selected, pymPrice, deduct, deliveryMemo, simIncluded, mode } = this.state
    const memo = deliveryMemo.selected == i18n.t("pym:input") ? deliveryMemo.content : deliveryMemo.selected

    if ( (_.isEmpty(selected)) && (pymPrice !=0) ) return

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
        digital: !simIncluded,
        memo,
        payment_type: 'rokebi_cash'
      }
      const orderResult = await this.props.action.cart.payNorder(response)
      // 최종 결제 처리 과정에서 실패할 수 있다. pymResult.result 값이 0인지 다시 확인한다.
      this.props.navigation.replace('PaymentResult', {pymResult:response, orderResult,mode:mode})

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
        digital: !simIncluded,            // 컨텐츠 - 데이터상품일 경우 true
        memo
        // mode: 'test'
      };

      this.setState({
        clickable: true
      })
      this.props.navigation.navigate('Payment', {params: params})
    }
  }

  _onPress = (method, key, idx) => () => {

    this.setState({
      selected: method,
      row: key,
      column: idx
    })
  }

  _button(key, value) {

    const { selected, row, column } = this.state

    return (
      <View key={key} style={styles.buttonRow}>
      {
        // key: row, idx: column
        value.map((v,idx) => 
        !_.isEmpty(v) &&
        <AppButton 
          key={v.method} 
          title={_.isEmpty(v.icon) && v.title}
          style={[styles.button,
            idx == 0 && {borderLeftWidth:1}, key == 0 && {borderTopWidth: 1},
          !_.isEmpty(selected) && ( ( idx == column -1 ) && (key == row ) && {borderRightColor: colors.clearBlue}
          || (key == row -1) && (idx == column) && {borderBottomColor: colors.clearBlue} ) ]}
          iconName={!_.isEmpty(v.icon) && v.icon}
          checked={v.method == selected.method}
          checkedStyle={{borderColor: colors.clearBlue}}
          checkedColor={colors.clearBlue}
          onPress={this._onPress(v, key, idx)}
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
            ... this.state.deliveryMemo.content
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

  _dropDownHeader(stateTitle, title, alias){
    return(
      <TouchableOpacity style={styles.dropDownBox} onPress={()=>this._showModal(stateTitle)}>
      <Text style={styles.boldTitle}>{title}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        {
          !this.state.showModal[stateTitle] &&
          <Text style={[styles.alignCenter,styles.normal16BlueTxt]}>{alias}</Text>
        }
        <AppButton style={{backgroundColor: colors.white, height:70}} 
                iconName= {this.state.showModal[stateTitle] ? "iconArrowUp" : "iconArrowDown"}
                iconStyle={styles.dropDownIcon}/>
      </View>          
    </TouchableOpacity>
    )
  }

  _inputMemo(val){
    this.setState({
      deliveryMemo: {
        ... this.state.deliveryMemo,
        content: val
      }
    })
  }

  _address(){

    const selectedAddr = this.props.profile.selectedAddr || undefined
    const profile = this.props.profile.profile
    const item = profile.find(item =>item.uuid==selectedAddr) || profile.find(item =>item.isBasicAddr) || {}

    return (
      <View>
        {
          this._dropDownHeader('address', i18n.t('pym:delivery'), item.alias)
        }
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

  _changePlaceHolder(){
    if(_.isEmpty(this.state.deliveryMemo.selected)){
      this.setState({
        label: undefined
      })
      this._saveMemo(deliveryText[0].key)
    }
  }

  _memo(){
    const { label } = this.state
    return(
      <View>
        {
          this._dropDownHeader('memo', i18n.t('pym:deliveryMemo'), this.state.deliveryMemo.header)
        }
        {
          this.state.showModal.memo &&
          <View style={styles.beforeDrop}>
            <View style={styles.thickBar}/>
            <View style={styles.pickerWrapper}>
              <RNPickerSelect style={{
                            ... pickerSelectStyles,
                          }}
                            useNativeAndroidPickerStyle={false}
                            placeholder={!_.isEmpty(label) ? {label} : {}}
                            placeholderTextColor={colors.warmGrey}
                            onValueChange={(value)=>{this._saveMemo(value)}}
                            onOpen={this._changePlaceHolder}
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
                    value={this.state.deliveryMemo.content || ''}
                    enablesReturnKeyAutomatically={true}
                    onChangeText={(val)=>this._inputMemo(val)}
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
    const { selected, data } = this.state,
          benefit = !_.isEmpty(data) && !_.isEmpty(selected) && this.state.data.find(item => item.title.indexOf(selected.title) >= 0)

    return(
      <View>
        {
          this._dropDownHeader('method', i18n.t('pym:method'), this.state.selected.title)
        }
        {
          this.state.showModal.method &&
          <View style={styles.beforeDrop}>
            <View style={styles.thickBar}/>
            {
              paymentApi.method.map((v,idx) => this._button(idx+"", v))
            }
            <Text style={{marginVertical: 20, color: colors.clearBlue}}>{i18n.t('pym:tossInfo')}</Text>
            {
              !_.isEmpty(benefit) &&
              <View style={{backgroundColor: colors.whiteTwo, padding: 15}}>
                <Text style={[styles.normal12TxtLeft, {marginBottom: 5}]}>{benefit.title}</Text>
                <Text style={[styles.normal12TxtLeft, {color: colors.warmGrey}]}>{benefit.body}</Text>
              </View>
            }
          </View>
        }
        <View style={styles.divider}/>
      </View>
    )
  }

  _move(key) {
    if ( !_.isEmpty(key) ) {
      const {route, param} = this.confirmList.find(item => item.key == key)
      Analytics.trackEvent('Page_View_Count', {page : param.key})
      this.props.navigation.navigate(route, param)
    }
  }
  
  _consentEssential(){
    this.setState({
      consent: !this.state.consent
    })
  }

  _benefit(){
    pageApi.getPageByCategory('pym:benefit').then(resp => {
      if ( resp.result == 0 && resp.objects.length > 0) {
        console.log('benefit resp', resp)
          this.setState({
            data: resp.objects
          })
        }
      }).catch(err => {
        console.log('failed to get page', err)
      }).finally(_ => {
        this.setState({
          querying: false
      })
    })
  }

  _consentBox(){
    return(
      <View style={{backgroundColor: colors.whiteTwo, padding: 20, paddingBottom: 45}}>
      <TouchableOpacity style={styles.rowCenter} onPress={()=>this._consentEssential()}>
        <AppIcon name="btnCheck2"
                checked={this.state.consent}
                size={22}/>
        <Text style={[appStyles.bold16Text,{color: colors.black, marginLeft: 12}]}>{i18n.t('pym:consentEssential')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.buttonRow, {marginTop: 20}]} onPress={()=>this._move("1")}>
        <Text style={[appStyles.normal14Text, {color: colors.warmGrey, lineHeight: 22}]}>{i18n.t("pym:privacy")}{i18n.t('pym:mandatory')}</Text>
        <Text style={styles.underlinedClearBlue}>{i18n.t("pym:detail")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonRow} onPress={()=>this._move("2")}>
        <Text style={[appStyles.normal14Text, {color: colors.warmGrey, lineHeight: 22}]}>{i18n.t("pym:paymentAgency")}{i18n.t('pym:mandatory')}</Text>
        <Text style={styles.underlinedClearBlue}>{i18n.t("pym:detail")}</Text>
      </TouchableOpacity>
    </View>
    )
  }

  render() {
    const { selected, pymPrice, deduct, isRecharge, consent, simIncluded } = this.state,
      { purchaseItems = [], pymReq } = this.props.cart,
      noProfile = this.props.profile.profile.length == 0

    return (
      <SafeAreaView style={styles.container} forceInset={{top: 'never', bottom:"always"}}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          enableOnAndroid={true}>

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
          <AppButton title={i18n.t('payment')}
                        textStyle={appStyles.confirmText}
                        disabled={(pymPrice !=0 && (_.isEmpty(selected)) || (simIncluded && noProfile) || !consent)}
                        key={i18n.t('payment')}
                        onPress={this._onSubmit}
                        style={appStyles.confirm} />
        </KeyboardAwareScrollView>

        {
          // 로깨비캐시 결제시 필요한 로딩처리
          this.state.loading && <Video source={require('../assets/images/loading_1.mp4')} resizeMode={"stretch"} repeat={true} style={styles.backgroundVideo}/>
        }
      </SafeAreaView>
    )
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 37,
    color: colors.black,
    fontSize: isDeviceSize('small') ? 12 : 14,
    paddingVertical: 8
  },
  inputAndroid: {
    height: 37,
    fontSize: 12,
    lineHeight: 20, 
    paddingVertical: 8,
    color: colors.black,
  },
  iconContainer: {
    top: 8,
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
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center'
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
    justifyContent: 'flex-start',
    // marginTop: 15,
    // marginHorizontal: 20,
  },
  button: {
    width: '33.3%',
    height: 62,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderRightWidth: 1,
    borderBottomWidth: 1,
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
    justifyContent: 'center',
    height: isDeviceSize('small') ? 200 : 255,
  },
  resultText: {
    ... appStyles.normal16Text,
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
    textAlign: 'left',
    lineHeight: 14,
    textAlignVertical: 'center'
  },
  underlinedClearBlue: {
    color: colors.clearBlue,
    textDecorationLine: 'underline',
    alignSelf: 'center'
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