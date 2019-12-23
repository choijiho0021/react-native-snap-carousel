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

class AddProfileScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('purchase:address')}/>
  })


  constructor(props) {
    super(props)

    this.state = {
      update: undefined,
      prefix: "010",
      disabled: true,
      profile: new Map({
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
      }),
      errors: {}
    }

    this._onChangeProfile = this._onChangeProfile.bind(this)
    this._onChangeValue = this._onChangeValue.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onChecked = this._onChecked.bind(this)
    this._findAddress = this._findAddress.bind(this)
    this._validate = this._validate.bind(this)
    this._warning = this._warning.bind(this)
  }

  componentDidMount() {
    
    const update = this.props.navigation.getParam('update') 
    const profile = update

    this.setState({
      update,
      prefix: "010",
    })

    if (profile) {
      this.setState({
        disabled: true,
        profile : new Map(profile),
      })
    }

    if(_.isUndefined(this.state.profile.get('addressLine1'))){
      this._validate("addressLine1", '')  
      this._validate("addressLine2", '')  
    }
  }

  componentDidUpdate(prevProps) {
    const addr = this.props.profile.addr

    // 주소 검색을 한 경우
    if(addr != prevProps.profile.addr){
      
      if(!_.isEmpty(addr)){
        const {admCd = ''} = addr
        const provinceNumber = admCd.substring(0,2)
        const cityNumber = admCd.substring(2,5)
        
        this.setState({
          profile: this.state.profile.set( 'addressLine1', addr.roadAddrPart1)
            .set('addressLine2', addr.roadAddrPart2)
            .set('zipCode', addr.zipNo)
            .set('province', findEngAddress.findProvince(provinceNumber))
            .set('city', findEngAddress.findCity( provinceNumber, cityNumber))
        })

      this._validate("addressLine1", addr.roadAddrPart1)  
      this._validate("addressLine2", addr.roadAddrPart2)  

      }

    }
  }

_onSubmit() {
  const {profile} = this.props.action
  const defaultProfile = this.props.profile.profile.find(item => item.isBasicAddr) || {}

  if(_.isEmpty(this.state.update)){
    // profile 신규 추가
    profile.profileAddAndGet(this.state.profile.toJS(), defaultProfile, this.props.account)
  }
  else{
    // profile update
    profile.updateCustomerProfile(this.state.profile.toJS(), this.props.account)
  }
  this.props.navigation.goBack()
}

  _onChecked() {
    const {profile} = this.state
    this.setState({
      profile: profile.update( 'isBasicAddr', value => ! value)
    })

  }

  _onChangeValue = (key = '') => (value) => {
    this.setState({
      [key]: value,
      // disabled: _.isEmpty(value) ? true : false
    })
  }

  _onChangeProfile = (key = '') => (value) => {

    this.setState({
      profile: this.state.profile.set(key, value)
    })

    this._validate(key, value)
  }

  _validate = (key, value) => {

    // error 계속 저장
    // 마지막 확인시 error length == (채워져야 하는 항목 수)일 경우, 
    // error에 value 가 모두 비워졌는지 확인
    // 비워졌을 경우 disabled false 로 변경
    const {errors} = this.state,
    valid = validationUtil.validate(key, value)

    errors[key] = _.isEmpty(valid) ? undefined : valid[key]

    this.setState({
      errors
    })

    if(Object.keys(this.state.errors).length >= 6){
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
    return (<Text style={{ fontSize:12, width:'82%', height: 20, color:colors.tomato
                          , flex:1, alignSelf: 'flex-end'}}>{this.state.errors[key] ? this.state.errors[key] : null}</Text> )    
  }

  render() {

    const { prefix, profile } = this.state

    console.log('length', Object.keys(this.state.errors).length)

    console.log('detail', this.state.errors.detailAddr)
    
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={60}
          innerRef={ref => { this.scroll = ref; }}>

            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
              <View style={{ margin: 20 }}>
                <View style={styles.textRow}>
                  <Text style={styles.textTitle}>{i18n.t('addr:addrAlias')}</Text>
                  <TextInput style={styles.textBox}
                            placeholder={profile.get('alias')}
                            placeholderTextColor={colors.black}
                            onChangeText={this._onChangeProfile('alias')}/>
                </View>
                { 
                  this._warning('alias')
                }             

                <View style={styles.textRow}>
                  <Text style={styles.textTitle}>{i18n.t('addr:recipient')}</Text>
                  <TextInput style={styles.textBox}
                            value={profile.get('recipient')}
                            placeholder={i18n.t('addr:enterWithin50')}
                            onChangeText={this._onChangeProfile('recipient')} />
                </View>
                { 
                  this._warning('recipient')
                }                 
                <View style={styles.textRow}>
                  <Text style={styles.textTitle}>{i18n.t('addr:recipientNumber')}</Text>
                  <View style={[styles.container, this.props.style]}>
                    <View style={styles.pickerWrapper}>
                      <RNPickerSelect style={{
                        placeholder: styles.placeholder,
                        iconContainer: {
                          top: 4,
                          right: 10,}
                      }}
                        placeholder={{}}
                        onValueChange={this._onChangeValue("prefix")}
                        items={["010", "011", "017", "018", "019"].map(item => ({
                          label: item,
                          value: item
                        }))}
                        value={prefix}
                        Icon={() => {
                          return (<Triangle width={8} height={6} />)
                        }}
                      />
                    </View>
                  </View>
                  <TextInput style={[styles.textBox, { width: '60%' }]} // 56%
                            onChangeText={this._onChangeProfile('recipientNumber')}
                            maxLength={8}
                            keyboardType='numeric'
                            value={profile.get('recipientNumber')} 
                            placeholder={i18n.t('addr:noHyphen')}/>
                </View>
                { 
                  this._warning('recipientNumber')
                }    
                <View style={[styles.textRow, { marginBottom: 10 }]}>
                  <Text style={styles.textTitle}>{i18n.t('addr:address')}</Text>
                  <Text style={[styles.textBox, { width: '61%' }]}
                        onPress={this._findAddress}>{profile.get('addressLine1')}</Text>
                  <AppButton title={i18n.t('addr:search')}
                            style={styles.findButton}
                            titleStyle={styles.findBtnText}
                            onPress={this._findAddress} />
                </View>
                <View style={styles.findTextRow}>
                  <Text style={styles.textBox}
                        onPress={this._findAddress} >{profile.get('addressLine2')}</Text>
                </View>

                <View style={[styles.findTextRow, {marginBottom:0}]}>
                  <TextInput style={styles.textBox}
                            value={profile.get('detailAddr')}
                            onChangeText={this._onChangeProfile('detailAddr')} 
                            placeholder={i18n.t('addr:details')}/>
                </View>
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

const styles = StyleSheet.create({
  container: {
    ...appStyles.container,
    alignItems: 'stretch',
  },
  placeHolder: {
    ...appStyles.normal14Text,
    color: colors.greyish
  },
  textRow: {
    flex: 1,
    flexDirection: 'row',
    // marginBottom: 20
  },
  findTextRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    justifyContent: 'flex-end'
  },
  findButton: {
    backgroundColor: colors.clearBlue, 
    borderRadius: 3, 
    width: '18%', 
    height: 36, 
    marginLeft: 10
  },
  findBtnText:{
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 12,
    letterSpacing: 0.15,
    color: colors.white

  },
  textBox: {
    width: '82%',
    height: 36,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey,
    padding: 10,
  },
  textTitle: {
    ...appStyles.normal14Text,
    fontWeight: 'normal',
    color: colors.warmGrey,
    alignSelf: 'center',
    width: '18%'
  },
  pickerWrapper: {
    ...appStyles.borderWrapper,
    width: 76, //28%
    paddingLeft: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  basicProfile: {
    ... appStyles.normal12Text,
    color: colors.warmGrey,
    marginLeft: 10
  },
  checkBasicProfile: {
    flex:1, 
    width: '82%', 
    flexDirection: 'row', 
    alignSelf: 'flex-end',
    marginTop: 10
  }
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
