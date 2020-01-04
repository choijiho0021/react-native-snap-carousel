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
import { ScrollView } from 'react-native-gesture-handler';
import PaymentItemInfo from '../components/PaymentItemInfo';
import { isAndroid } from '../components/SearchBarAnimation/utils';
import { isDeviceSize } from '../constants/SliderEntry.style';

class PymMethodScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('payment')} />
  })

  constructor(props) {
    super(props)

    this.state = {
      data: undefined,
      // profile: undefined,
      selected: undefined,
      showModal: false
    }

    this._onSubmit = this._onSubmit.bind(this)
    this._onPress = this._onPress.bind(this)
    this._button = this._button.bind(this)
    this._address = this._address.bind(this)

    this.method = [
      [
        {
          key: 'naverco',
          title: i18n.t('pym:naver')
        },
        {
          key: 'html5_inicis',
          title: i18n.t('pym:ccard')
        },
      ],
      [
        {
          key: 'kakaopay',
          title: i18n.t('pym:kakao')
        },
        {
          key: 'payco',
          title: i18n.t('pym:payco')
        },
      ],
      [
        {
          key: 'danal',
          title: i18n.t('pym:mobile')
        },
        {
          key: 'syrup',
          title: i18n.t('pym:syrup')
        },
      ],
    ]
  }

  //
  componentDidMount() {
    this.props.action.profile.getCustomerProfile(this.props.auth)
  }

  _onSubmit() {
    const { selected} = this.state
    if ( ! selected ) return

    const { mobile, email} = this.props.account
    const { pymReq } = this.props.cart,
      total = pymReq.reduce((sum,cur) => sum + cur.amount, 0),
      profileId = this.props.profile.selectedAddr || (this.props.profile.profile.find(item => item.isBasicAddr) || {}).uuid

    const params = {
      pg : selected,
//      pay_method: 'card',
      merchant_uid: `mid_${new Date().getTime()}`,
      name:'esim',
      amount: total,
      buyer_tel: mobile,
      buyer_email: email,
      escrow: false,
      app_scheme: 'esim',
      profile_uuid: profileId,
      mode: 'test'
    };

    // this.props.action.cart.makePayment( this.props.cart.orderId, this.props.auth)
    this.props.navigation.navigate('Payment', {params: params})
  }

  _onPress = (key) => () => {
    this.setState({
      selected: key
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
          checked={v.key == selected}
          checkedColor={colors.clearBlue}
          onPress={this._onPress(v.key)}
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
                  mobileStyle={[styles.addrCardText, styles.colorWarmGrey]}
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

  render() {
    const { selected } = this.state,
      { purchaseItems = [], pymReq } = this.props.cart,
      simIncluded = purchaseItems.findIndex(item => item.type == 'sim_card') >= 0,
      noProfile = this.props.profile.profile.length == 0

    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom:"always"}}>
        <ScrollView>
          <PaymentItemInfo cart={purchaseItems} pymReq={pymReq}/>              

          {
            simIncluded && this._address()
          }

          <Text style={[styles.title, styles.mrgBottom5]}>{i18n.t('pym:method')}</Text>
          <View style={styles.mrgBottom33}>
            {
              this.method.map((v,idx) => this._button(idx+"", v))
            }
          </View>
        </ScrollView>

        <AppButton title={i18n.t('payment')} 
                      textStyle={appStyles.confirmText}
                      disabled={_.isEmpty(selected) || (simIncluded && noProfile)}
                      key={i18n.t('payment')}
                      onPress={this._onSubmit}
                      style={appStyles.confirm} />

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
    height: 21,
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
  total: {
    height: 52,
    paddingHorizontal: 20,
    borderTopColor: colors.blackack,
    borderTopWidth: 1,
    backgroundColor: colors.whiteTwo,
    alignItems: 'center'
  },
  divider: {
    marginTop: 30,
    height: 10,
    backgroundColor: colors.whiteTwo
  },
  buttonRow : {
    flexDirection: "row",
    justifyContent: 'space-around',
    marginTop: 15,
    marginHorizontal: 20,
  },
  button: {
    width: isDeviceSize('small') ? 130 : 160,
    height: isDeviceSize('small') ? 40 : 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.warmGrey
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
  mrgBottom0: {
    marginBottom: 0
  },
  mrgBottom5: {
    marginBottom: 5
  },
  mrgBottom33: {
    marginBottom: 33
  },
  brdrBottom0: {
    borderBottomWidth: 0
  },
  colorWarmGrey: {
    color: colors.warmGrey
  },
  colorClearBlue: {
    color: colors.clearBlue
  },
  fontWeightNormal: {
    fontWeight: 'normal'
  },
  productPriceInfo: {
    paddingVertical: 11,
    marginTop: 9,
    marginHorizontal: 20, 
    borderBottomColor: colors.lightGrey, 
    borderBottomWidth: 1
  },
  productPriceTitle: {
    ... appStyles.normal16Text, 
    lineHeight: 36, 
    letterSpacing: 0.26,
    fontWeight: 'normal'
  },
  normalText14: {
    ... appStyles.normal14Text,
    fontWeight: 'normal'
  },
  normalText16: {
    ... appStyles.normal16Text,
    fontWeight: 'normal'
  },
  PriceInfo: {
    height:72, 
    marginVertical: 11, 
    marginHorizontal: 20
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