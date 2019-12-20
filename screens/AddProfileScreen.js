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
      disabled: false,
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
        isBasicAddr: false,
      }),
      errors: undefined
    }

    this._onChangeProfile = this._onChangeProfile.bind(this)
    this._onChangeValue = this._onChangeValue.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onChecked = this._onChecked.bind(this)
    this._findAddress = this._findAddress.bind(this)
  }

  componentDidMount() {
    
    const update = this.props.navigation.getParam('update') 
    const profile = update || this.props.profile.profile.find(item => item.isBasicAddr)

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

  }

  componentDidUpdate(prevProps) {
    const addr = this.props.profile.addr

    // 다른 정보 변경 & 주소 검색을 한 경우
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
            .set('isBasicAddr', this.props.profile.profile.isBasicAddr)
        })
      }

    }
  }

_onSubmit() {
  const {profile} = this.props.action
  const defaultProfile = this.props.profile.profile.find(item => item.isBasicAddr) || {}
  
  // 기본배송지 설정된 것이 없는 경우 신규 기본 배송지 설정
  if(_.isEmpty(defaultProfile)){
    this.setState({
      profile : this.state.profile.set('isBasicAddr', true)
    }) 
  }

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
    if(_.isEmpty(value)){
      this.setState({
        disabled: true
      })
    }
    this._validate(key, value)
  }


  _findAddress() {
    this.props.navigation.navigate('FindAddress')
  }

  render() {

    const { prefix, profile } = this.state
    const basicAddr = this.props.profile.profile.find(item=> item.isBasicAddr)
    let isAddrEmpty = false
    
    // for (let [key, value] of Object.entries(profile)) {
    //   console.log(`객체 값!${key}: ${value}`);
    //   if(_.isEmpty(value)){
         
    //     // 기본배송지 선택 -> 필수값 X
    //     if( key == 'isBasicAddr'){ 
    //       continue 
    //     }
    //     // 필수값이 비어있을 경우
    //     console.log('empty value', key)
    //     console.log('empty value', value)
    //     isAddrEmpty = true
    //     break 
    //   }
    // }

    console.log('isAddrEmpty', isAddrEmpty)
  
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
                            onChangeText={this._onChangeProfile('alias')}
                            // onBlur={item=>this._validCheck(item)}
                            />
                            
                  {/* <Text style={{color:colors.clearBlue, fontSize:5, borderColor: colors.clearBlue, borderwidth: 2}}>정확히!입력하세요</Text>                             */}
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textTitle}>{i18n.t('addr:recipient')}</Text>
                  <TextInput style={styles.textBox}
                            value={profile.get('recipient')}
                            placeholder={i18n.t('addr:enterWithin50')}
                            onChangeText={this._onChangeProfile('recipient')} />
                </View>
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
                  <TextInput style={[styles.textBox, { width: '56%' }]}
                            onChangeText={this._onChangeProfile('recipientNumber')}
                            maxLength={8}
                            keyboardType='numeric'
                            value={profile.get('recipientNumber')} 
                            placeholder={i18n.t('addr:noHyphen')}/>
                </View>
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

                <View style={styles.findTextRow}>
                  <TextInput style={styles.textBox}
                            value={profile.get('detailAddr')}
                            onChangeText={this._onChangeProfile('detailAddr')} 
                            placeholder={i18n.t('addr:details')}/>
                </View>
                <TouchableOpacity style={styles.checkBasicProfile}
                                  onPress={this._onChecked}>
                  <AppIcon name="btnCheck2"
                          checked={this.state.profile.get('isBasicAddr') || false}/>
                  <Text style={styles.basicProfile}>{i18n.t('addr:basicAddress')}</Text>
                </TouchableOpacity>
              </View>
            </View>
        </KeyboardAwareScrollView>

        <AppButton style={appStyles.confirm}
                    title={i18n.t('save')}
                    textStyle={appStyles.confirmText}
                    // disabled={isAddrEmpty}
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
    marginBottom: 20
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
    marginTop: 20
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
