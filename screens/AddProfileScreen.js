import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput
} from 'react-native';
import i18n from '../utils/i18n'
import { appStyles } from '../constants/Styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as accountActions from '../redux/modules/account'
import * as profileActions from '../redux/modules/profile'
import { SafeAreaView } from 'react-navigation'
import _ from 'underscore'
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import AppButton from '../components/AppButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import Triangle from '../components/Triangle';
import findEngAddress from '../utils/findEngAddress'
import AppIcon from '../components/AppIcon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Map} from 'immutable'
import validationUtil from '../utils/validationUtil';
import { isDeviceSize } from '../constants/SliderEntry.style';
import { isAndroid } from '../components/SearchBarAnimation/utils';
import utils from '../utils/utils';

class AddProfileScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('purchase:address')}/>
  })


  constructor(props) {
    super(props)

    this.state = {
      update: undefined,
      disabled: true,
      profile: new Map({
        prefix: "010",
        alias: undefined,
        recipient: undefined,
        recipientNumber: undefined,
        province: undefined,
        city: undefined,
        organization: undefined,
        zipCode: undefined,
        addressLine1: undefined,
        addressLine2: undefined,
        detailAddr: undefined,
        isBasicAddr: true,
        uuid:undefined,
        roadAddr:undefined,
      }),
      errors: {}
    }

    this._onChangeProfile = this._onChangeProfile.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onChecked = this._onChecked.bind(this)
    this._findAddress = this._findAddress.bind(this)
    this._validate = this._validate.bind(this)
    this._warning = this._warning.bind(this)
    this._changeBorder = this._changeBorder.bind(this)
    this._onFocusClear = this._onFocusClear.bind(this)
  }

  componentDidMount() {
    
    const update = this.props.navigation.getParam('update') 
    const profile = update

    this.setState({
      update,
    })

    if (profile) {
      this.setState({
        disabled: true,
        profile : new Map(profile),
      })

      this._validate('alias', update.alias)
      this._validate('recipient', update.recipient)
      this._validate('recipientNumber', update.recipientNumber)
      this._validate('detailAddr', update.detailAddr)
      this._validate('addressLine1', update.addressLine1)
    }

    // 신규 배송지 추가시
    if(!update && _.isUndefined(this.state.profile.get('addressLine1'))){
      this._validate("addressLine1", '')  
    }
  }

  componentDidUpdate(prevProps) {
    const addr = this.props.profile.addr
   
    // 주소 검색을 한 경우
    if(addr != prevProps.profile.addr){

      if(!_.isEmpty(addr)){
        const {admCd = ''} = addr
        const provinceNumber = !_.isEmpty(addr.sggNm) ? admCd.substring(0,2) : admCd.substring(0,5)
        const cityNumber = !_.isEmpty(addr.sggNm) ? admCd.substring(2,5) : admCd.substring(5, 8)
        const addressLine1 = !_.isEmpty(addr.sggNm) ? (addr.siNm + ' ' + addr.sggNm) : (addr.siNm + ' ' + addr.emdNm)
        const addressLine2 = addr.jibunAddr.split(addressLine1+' ').find(item => !_.isEmpty(item))

        this.setState({
          profile: this.state.profile.set( 'addressLine1', addressLine1)
            .set('addressLine2', addressLine2)
            .set('zipCode', addr.zipNo)
            .set('province', findEngAddress.findProvince(provinceNumber))
            .set('city', findEngAddress.findCity(provinceNumber, cityNumber))
            .set('detailAddr', '')
            .set('roadAddr', addr.roadAddr)
        })

      this._validate("addressLine1", addr.roadAddrPart1)  

      }

    }
  }

_onSubmit() {
  const {profile} = this.props.action
  const defaultProfile = this.props.profile.profile.find(item => item.isBasicAddr) || {}
  const profileJS = this.state.profile.toJS()

  const profileToSave = {
    ...profileJS,
    recipientNumber: profileJS.prefix + profileJS.recipientNumber
  }

  if(_.isEmpty(this.state.update)){
    // profile 신규 추가
    profile.profileAddAndGet(profileToSave, defaultProfile, this.props.account)
  }
  else{
    // profile update
    profile.updateCustomerProfile(profileToSave, this.props.account)
  }
  this.props.navigation.goBack()
}

  _onChecked() {
    const {profile} = this.state
    const defaultProfile = this.props.profile.profile.find(item => item.isBasicAddr) || {}
    
    if(defaultProfile.uuid != profile.get('uuid')){
        this.setState({
          profile: profile.update( 'isBasicAddr', value => ! value)
      })
    }
  }

  _onChangeProfile = (key = '') => (value) => {

    this.setState({
      profile: this.state.profile.set(key, value)
    })

    this._validate(key, value)
  }

  _onFocusClear(key){

    this.setState({
      profile: this.state.profile.set(key, '')
    })

    this._validate(key, '')
  }

  _validate = (key, value) => {

    const {errors} = this.state,
    valid = validationUtil.validate(key, value)

    errors[key] = _.isEmpty(valid) ? undefined : valid[key]

    this.setState({
      errors
    })

    if(Object.keys(this.state.errors).length >= 5){
      const error = Object.keys(this.state.errors).find(key => !_.isUndefined(errors[key]))

      if(_.isUndefined(error)){
        this.setState({
          disabled: false
        })
      }else{
        this.setState({
          disabled: true
        })
      }
    }

  }

  _findAddress() {
    this.props.navigation.navigate('FindAddress')
  }

  _warning(key){
    return (<Text style={[styles.textWidth, { fontSize:12, height: 20, color:colors.tomato
                          , flex:1, alignSelf: 'flex-end'}]}>{this.state.errors[key] ? this.state.errors[key] : null}</Text> )    
  }

  _changeBorder(title){
    return this.state.profile.get(title) && _.isEmpty(this.state.errors[title]) ? colors.black : colors.lightGrey
  }

  render() {

    const { profile } = this.state

    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom:"always"}}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={60}
          innerRef={ref => { this.scroll = ref; }}>

            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
              <View style={{ margin: 20, flex: 1 }}>
                <View style={styles.textRow}>
                  <View style={styles.titleView}>
                    <Text style={styles.titleText}>{i18n.t('addr:addrAlias')}</Text>
                    <Text style={styles.titleRequired}>{i18n.t('addr:mandatory')}</Text>
                  </View>
                  <TextInput style={[styles.textBox, {borderColor: this._changeBorder('alias')}]}
                            value={profile.get('alias')}
                            placeholderTextColor={colors.black}
                            onFocus={()=>this._onFocusClear('alias')}
                            onChangeText={this._onChangeProfile('alias')}/>
                </View>
                { 
                  this._warning('alias')
                }             

                <View style={styles.textRow}>
                  <View style={styles.titleView}>
                    <Text style={styles.titleText}>{i18n.t('addr:recipient')}</Text>
                    <Text style={styles.titleRequired}>{i18n.t('addr:mandatory')}</Text>
                  </View>
                  <TextInput style={[styles.textBox, {borderColor: this._changeBorder('recipient')}]}
                            value={profile.get('recipient')}
                            placeholder={i18n.t('addr:enterWithin50')}
                            placeholderTextColor={colors.greyish}
                            onFocus={()=>this._onFocusClear('recipient')}
                            onChangeText={this._onChangeProfile('recipient')} />
                </View>
                { 
                  this._warning('recipient')
                }                 
                <View style={styles.textRow}>
                  <View style={styles.titleView}>
                    <Text style={styles.titleText}>{i18n.t('addr:recipientNumber')}</Text>
                    <Text style={styles.titleRequired}>{i18n.t('addr:mandatory')}</Text>
                  </View>
                  <View style={[styles.textWidth, {flexDirection: 'row'}]}>
                    <View style={[styles.container, this.props.style]}>
                      <View style={styles.pickerWrapper}>
                        <RNPickerSelect style={{
                          ... pickerSelectStyles,
                        }}
                          useNativeAndroidPickerStyle={false}
                          placeholder={{}}
                          onValueChange={this._onChangeProfile("prefix")}
                          items={["010", "011", "017", "018", "019"].map(item => ({
                            label: item,
                            value: item
                          }))}
                          value={profile.get('prefix')}
                          Icon={() => {
                            return (<Triangle width={8} height={6} />)
                          }}
                        />
                      </View>
                    </View>
                    <TextInput style={[styles.textBox, {borderColor: this._changeBorder('recipientNumber'), width: '65%'}]}  // 56%
                              onChangeText={this._onChangeProfile('recipientNumber')}
                              maxLength={9}
                              keyboardType='numeric'
                              value={utils.toPhoneNumber(profile.get('recipientNumber'))} 
                              onFocus={()=>this._onFocusClear('recipientNumber')}
                              placeholder={i18n.t('addr:noHyphen')}
                              placeholderTextColor={colors.greyish}/>
                  </View>                            
                </View>
                { 
                  this._warning('recipientNumber')
                }    
                <View style={[styles.textRow, { marginBottom: 10 }]}>
                  <View style={styles.titleView}>
                    <Text style={styles.titleText}>{i18n.t('addr:address')}</Text>
                    <Text style={styles.titleRequired}>{i18n.t('addr:mandatory')}</Text>
                  </View>
                  <View style={[styles.textWidth, {flexDirection: 'row'}]}>
                    <Text style={[styles.textBox, {borderColor: this._changeBorder('addressLine1'), width: '76%', paddingVertical: 10}]}
                          onPress={this._findAddress}>{profile.get('addressLine1')}</Text>
                    <AppButton title={i18n.t('addr:search')}
                              style={styles.findButton}
                              titleStyle={styles.findBtnText}
                              onPress={this._findAddress} />
                  </View>          
                </View>
                <View style={styles.findTextRow}>
                  <Text style={[styles.textBox, {borderColor: this._changeBorder('addressLine1'), paddingVertical: 10}]}
                        onPress={this._findAddress} >{profile.get('addressLine2')}</Text>
                </View>

                <View style={[styles.findTextRow, {marginBottom: 13}]}>
                  <TextInput style={[styles.textBox, {borderColor: this._changeBorder('detailAddr')}]}
                            value={profile.get('detailAddr')}
                            onFocus={()=>this._onFocusClear('detailAddr')}
                            onChangeText={this._onChangeProfile('detailAddr')} 
                            placeholder={i18n.t('addr:details')}
                            placeholderTextColor={colors.greyish}/>
                </View>
                {
                  !_.isEmpty(profile.get('addressLine1'))  && 
                  (<View style={styles.findTextRow}>
                    <View style={styles.textWidth}>
                      <View style={styles.roadBox}>
                        <Text style={styles.roadText}>{i18n.t('addr:road')}</Text>
                      </View>                       
                        <Text style={styles.addrText}>
                        {!_.isEmpty(profile.get('detailAddr')) ? 
                        profile.get('roadAddr') + ' '+ profile.get('detailAddr') : profile.get('roadAddr')}</Text>
                    </View> 
                  </View>)
                }                
                { 
                // 상세주소를 입력했는데 주소검색은 하지 않은 경우,
                  !_.isEmpty(this.state.errors.detailAddr) && _.isUndefined(this.state.profile.get('addressLine1')) ? this._warning('addressLine1') : this._warning('detailAddr')
                }    

                <TouchableOpacity style={styles.checkBasicProfile}
                                  onPress={this._onChecked}>
                  <AppIcon name="btnCheck2"
                          checked={this.state.profile.get('isBasicAddr')}/>
                  <Text style={styles.basicProfile}>{i18n.t('addr:selectBasicAddr')}</Text>
                </TouchableOpacity>
              </View>
            </View>
        </KeyboardAwareScrollView>
        <AppButton style={appStyles.confirm}
                    title={i18n.t('save')}
                    textStyle={appStyles.confirmText}
                    disabled={this.state.disabled}
                    onPress={this._onSubmit} />

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
    // backgroundColor: colors.white
  },
  iconContainer: {
    top: 4,
    right: 10,
    paddingVertical: 8
  }
})

const styles = StyleSheet.create({
  container: {
    ...appStyles.container,
    alignItems: 'stretch',
  },
  textRow: {
    flex: 1,
    flexDirection: 'row',
  },
  findTextRow: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'flex-end'
  },
  findButton: {
    backgroundColor: colors.clearBlue, 
    borderRadius: 3, 
    width: '20%', 
    height: 36, 
    marginLeft: 10,
    justifyContent: 'flex-end'
  },
  findBtnText:{
    fontSize: isDeviceSize('small') ? 10 : 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: isAndroid() ? 15 : 12,
    letterSpacing: 0.15, 
    color: colors.white

  },
  textBox: {
    width: '78%',//isDeviceSize('small') ? '74%':'78%',
    height: 36,
    fontSize: isDeviceSize('small') || isAndroid() ? 12 : 14,
    color:colors.black,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingHorizontal: 10,
  },
  titleView: {
    flex: 1, 
    flexDirection: 'row',
  },
  titleText: {
    fontSize: isDeviceSize('small') ? 12 : 14,
    fontWeight: 'normal',
    color: colors.warmGrey,
    alignSelf: 'center',
  },
  titleRequired: {
    fontSize: 14, 
    color: colors.tomato,
  },
  pickerWrapper: {
    ...appStyles.borderWrapper,
    width: '80%',
    paddingLeft: 10,
    alignContent: 'center'
  },
  basicProfile: {
    ... appStyles.normal12Text,
    color: colors.warmGrey,
    marginLeft: 10
  },
  checkBasicProfile: {
    flex:1, 
    width: '78%', 
    flexDirection: 'row', 
    alignSelf: 'flex-end',
    marginVertical: 10,

  },
  textWidth: {
    width: '78%'
  },
  roadBox: {
    width: isDeviceSize('small') ? '17%' : '15%',
    height: 20,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  roadText: {
    fontSize: isDeviceSize('small') ? 10 :  12,
    fontWeight: "normal",
    fontStyle: "normal",
    color: colors.warmGrey,
    alignSelf: 'center',
  },
  addrText: {
    ... appStyles.normal12Text,
    fontSize: isDeviceSize('small') ? 10 : 12,
    color: colors.warmGrey,
    marginTop: 3, 
    textAlign: 'left'
  },
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  profile: state.profile.toJS(),
})

export default connect(mapStateToProps,
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      profile: bindActionCreators(profileActions, dispatch),
    }
  })
)(AddProfileScreen)
