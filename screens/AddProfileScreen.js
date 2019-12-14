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
import * as orderActions from '../redux/modules/order'
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
      profile: {
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
      },
      errors: undefined
    }

    this._onChangeText = this._onChangeText.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onChecked = this._onChecked.bind(this)
    this._findAddress = this._findAddress.bind(this)
  }

  componentDidMount() {
    
    const update = this.props.navigation.getParam('update') 
    const profile = update || this.props.order.profile.find(item => item.isBasicAddr == true)

    console.log('mount profile', profile)
    
    this.setState({
      update,
      prefix: "010",
    })

    if (profile) {
      this.setState({
        disabled: true,
        profile,
      })
    }

  }

  componentDidUpdate(prevProps) {
    const addr = this.props.order.addr

    // 다른 정보 변경 & 주소 검색을 한 경우
    if(addr != prevProps.order.addr){
      
      if(!_.isEmpty(addr)){
        const {admCd} = addr
        const provinceNumber = admCd.substring(0,2)
        const cityNumber = admCd.substring(2,5)
        
        this.setState({
            profile: {
              ... this.state.profile,
              addressLine1: addr.roadAddrPart1,
              addressLine2: addr.roadAddrPart2,
              zipCode: addr.zipNo,
              province: findEngAddress.city[provinceNumber] && findEngAddress.city[provinceNumber].province,
              city: findEngAddress.city[provinceNumber][cityNumber]
          }
        })
      }

    }
  }



  _onSubmit() {
    const {order} = this.props.action

    const defaultProfile = this.props.order.profile.find(item => item.isBasicAddr)

    if(_.isEmpty(this.state.update)){
      // profile 신규 추가
      order.addCustomerProfile(this.state.profile, defaultProfile ,this.props.account)
    }else{
      // profile update
      order.updateCustomerProfile(this.state.profile, this.props.account)
    }
    this.props.navigation.goBack()
  }

  _onChecked() {
    const {profile} = this.state
    this.setState({
      profile: {
        ... this.state.profile,
        isBasicAddr: ! profile.isBasicAddr
      }
    })
  }

  _onChangeText = (key = '') => (value) => {

    const item = key.substring(key.indexOf('.') + 1)
    const idx = key.indexOf('.')

    if (idx == -1) {
      this.setState({
        [key]: value,
        disabled: _.isEmpty(value) ? true : false
      })
    }else {
      this.setState({
        profile: {
          ... this.state.profile,
          [item]: value
        }
      })
    }


  }

  _findAddress() {
    this.props.navigation.navigate('FindAddress')
  }

  render() {

    const { prefix, profile } = this.state
    let isAddrEmpty = false
    
    // for (let [key, value] of Object.entries(profile)) {
    //   // console.log(`객체 값찾긔~~${key}: ${value}`);
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
                            placeholder={profile.alias}
                            placeholderTextColor='#2c2c2c'
                            onChangeText={this._onChangeText('profile.alias')} />
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textTitle}>{i18n.t('addr:recipient')}</Text>
                  <TextInput style={styles.textBox}
                            value={profile.recipient}
                            placeholder={i18n.t('addr:enterWithin50')}
                            onChangeText={this._onChangeText('profile.recipient')} />
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
                        onValueChange={this._onChangeText("prefix")}
                        items={["010", "011", "017", "018", "019"].map(item => ({
                          label: item,
                          value: item
                        }))}
                        value={prefix}
                        Icon={() => {
                          return (<Triangle width={8} />)
                        }}
                      />
                    </View>
                  </View>
                  <TextInput style={[styles.textBox, { width: '56%' }]}
                            onChangeText={this._onChangeText('profile.recipientNumber')}
                            value={profile.recipientNumber} />
                </View>
                <View style={[styles.textRow, { marginBottom: 10 }]}>
                  <Text style={styles.textTitle}>{i18n.t('addr:address')}</Text>
                  <Text style={[styles.textBox, { width: '61%' }]}
                        onPress={this._findAddress}>{profile.addressLine1}</Text>
                  <AppButton title={i18n.t('addr:search')}
                            style={styles.findButton}
                            titleStyle={styles.findBtnText}
                            onPress={this._findAddress} />
                </View>
                <View style={styles.findTextRow}>
                  <Text style={styles.textBox}
                        onPress={this._findAddress} >{profile.addressLine2}</Text>
                </View>

                <View style={styles.findTextRow}>
                  <TextInput style={styles.textBox}
                            value={profile.detailAddr}
                            onChangeText={this._onChangeText('profile.detailAddr')} />
                </View>
                <TouchableOpacity style={{flex:1, width: '82%', flexDirection: 'row', alignSelf: 'flex-end',marginTop: 20}}
                                  onPress={this._onChecked}>
                  <AppIcon name="btnCheck2"
                          checked={this.state.profile.isBasicAddr || false}/>
                  <Text style={styles.basicProfile}>{i18n.t('addr:basicAddress')}</Text>
                </TouchableOpacity>
              </View>
            </View>
        </KeyboardAwareScrollView>
        <AppButton style={[appStyles.confirm, {position:'absolute', right:0, bottom:0, left:0}]} 
                    title={i18n.t('save')}
                    textStyle={appStyles.confirmText}
                    disabled={isAddrEmpty}
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
    backgroundColor: colors.warmGrey, 
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
  }
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  order: state.order.toJS(),
})

export default connect(mapStateToProps,
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    }
  })
)(AddProfileScreen)
