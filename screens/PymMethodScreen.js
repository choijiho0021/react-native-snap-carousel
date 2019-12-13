import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as accountActions from '../redux/modules/account'
import * as orderActions from '../redux/modules/order'
import * as cartActions from '../redux/modules/cart'
import utils from '../utils/utils';
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import AppButton from '../components/AppButton';
import _ from 'underscore'
import { SafeAreaView } from 'react-navigation';
import orderApi from '../utils/api/orderApi';
import AddressCard from '../components/AddressCard'
import PaymentItemInfo from '../components/PaymentItemInfo';
import PaymentResultScreen from '../screens/PaymentResultScreen';
import { ScrollView } from 'react-native-gesture-handler';

class PymMethodScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('payment')}),
  })

  constructor(props) {
    super(props)

    this.state = {
      data: undefined,
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
    const pymReq = this.props.navigation.getParam('pymReq')
    const mode = this.props.navigation.getParam('mode')
    const buyProduct = this.props.navigation.getParam('buyProduct')

    if ( pymReq ) {
      this.setState({
        data: pymReq,
        mode,
        buyProduct
      })
    }
    
    this.props.action.order.getCustomerProfile(this.props.account)
  }

  componentDidUpdate(){
    console.log('pym method screen update!')
  }

  _onSubmit() {
    const { selected} = this.state
    if ( ! selected ) return

    const { mobile, email} = this.props.account

    const params = {
      pg : selected,
//      pay_method: 'card',
      merchant_uid: `mid_${new Date().getTime()}`,
      name:'esim',
      amount: '100',
      buyer_tel: mobile,
      buyer_email: email,
      escrow: false,
      app_scheme: 'esim',
      mode: 'test'
    };

    this.props.action.cart.makePayment( this.props.cart.orderId, this.props.auth)
    this.props.navigation.navigate('PaymentResult', {params: params, pymReq:this.props.navigation.getParam('pymReq'), cartItems:this.props.cart})
  
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

  // _renderItemCart({item}) {
  //   const {mode} = this.state

  //   if(mode == 'buy'){
  //     return (
  //       <View style={styles.row}>
  //         <Text style={styles.productPriceTitle}>{item.name+' x 1'+i18n.t('qty')}</Text>
  //         <Text style={styles.normalText16}>{utils.price(item.price)}</Text>
  //       </View>
  //     )
  //   }
  //   return (
  //     <View style={styles.row}>
  //       <Text style={styles.productPriceTitle}>{item.title+' x '+item.qty+i18n.t('qty')}</Text>
  //       <Text style={styles.normalText16}>{utils.price(item.totalPrice)}</Text>
  //     </View>
  //   )
  // }

  _address(){
    return (
      <View>
        {
          // 주소
          this.props.order.profile.length > 0 &&
          <View>
            <Text style={styles.title}>{i18n.t('pym:delivery')}</Text>
            <View style={styles.profileTitle}>
              <Text style={styles.profileTitleText}>{item.alias}</Text>
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
        }

        <View style={styles.divider}/>

        {
          // 주소 등록 
          // == 0
          this.props.order.profile.length >= 0 &&
          <View>
            <Text style={styles.title}>{i18n.t('pym:delivery')}</Text>
            <View style={{flex:1}}>
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
    const { data, selected, buyProduct, mode } = this.state
    const total = data ? data.reduce((acc,cur) => acc + cur.amount, 0) : 0
    
    console.log('PROPS',this.props) // cart에서 cart 목록과 sim 목록 받음.

    console.log('props',this.props.cart.orderItems)
    const sim = (this.props.cart.orderItems || []).filter(item => item.prod.type == 'sim_card')

    console.log('sim', sim )

    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom:"always"}}>
        <ScrollView>
          <PaymentItemInfo cart={this.props.navigation.getParam('cartItem')}
                           pymReq={this.props.navigation.getParam('pymReq')}/>         
          {
            sim.length > 0 && this._address()
          }

          <Text style={[styles.title, styles.mrgBottom5]}>{i18n.t('pym:method')}</Text>
          <View style={[styles.mrgBottom33, {flex: 1}]}>
            {
              this.method.map((v,idx) => this._button(idx+"", v))
            }
          </View>
          {/* <AppButton title={i18n.t('payment')} 
                      textStyle={appStyles.confirmText}
                      //disabled={_.isEmpty(selected)}
                      key={i18n.t('payment')}
                      onPress={this._onSubmit}
                      style={appStyles.confirm}/>  */}
                
      </ScrollView>
      <AppButton title={i18n.t('payment')} 
                      textStyle={appStyles.confirmText}
                      //disabled={_.isEmpty(selected)}
                      key={i18n.t('payment')}
                      onPress={this._onSubmit}
                      style={[appStyles.confirm,
                      {position:'absolute', bottom:0, left:0, right:0}]}/> 

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
    width: 160,
    height: 48,
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
    fontSize: 12, 
    lineHeight: 19, 
    fontWeight: 'normal', 
    color: colors.white
  },
  chgButton: {
    width: 50, 
    height: 36, 
    borderRadius: 3, 
    backgroundColor: colors.warmGrey, 
    marginHorizontal: 20
  }
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  cart: state.cart.toJS(),
  auth: accountActions.auth(state.account),
  order: state.order.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action: {
      account : bindActionCreators(accountActions, dispatch),
      cart : bindActionCreators(cartActions, dispatch),
      order : bindActionCreators(orderActions, dispatch),  
    }
  })
)(PymMethodScreen)