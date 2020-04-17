import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Image,
  BackHandler
} from 'react-native';
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as cartActions from '../redux/modules/cart'
import * as orderActions from '../redux/modules/order'
import * as accountActions from '../redux/modules/account'
import * as notiActions from '../redux/modules/noti'

import utils from '../utils/utils';
import AppButton from '../components/AppButton';
import {appStyles} from '../constants/Styles'
import PaymentItemInfo from '../components/PaymentItemInfo';
import SafeAreaView from 'react-native-safe-area-view';
import AppBackButton from '../components/AppBackButton';
import i18n from '../utils/i18n';
import _ from 'underscore';

import { colors } from '../constants/Colors'
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.white,
    marginHorizontal:10,
    justifyContent: "flex-start",
  },
  result: {
    ... appStyles.itemRow,
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 52,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: colors.white
  },
  title: {
    ... appStyles.title,
    marginLeft: 20,
  },
  image : {
    marginTop:30
  },
  paymentResultView: {
    backgroundColor:colors.white, 
    alignItems:'center',
    marginHorizontal:10, 
    marginVertical:10
  },
  paymentResultText: {
    ... appStyles.normal14Text,
    color:colors.clearBlue, 
    marginVertical:15
  },
  btnOrderList: {
    borderWidth:1,
    borderColor:colors.lightGrey, 
    width:180, 
    height:44, 
    marginTop:15, 
    marginBottom:40
  },
  btnHomeText: {
    ... appStyles.normal18Text,
    textAlign: "center",
    color: colors.white
  },
  btnHome: {
    width: "100%",
    height: 52,
    backgroundColor: colors.clearBlue
  },
})

class PaymentResultScreen extends Component {

  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <Text style={styles.title}>{i18n.t('his:paymentCompleted')}</Text>
    )
    // headerLeft: <AppBackButton navigation={navigation} title={i18n.t('his:paymentCompleted')} back="top"/>
  })

  constructor(props){
    super(props)

    this.state = {
      result : {},
      orderResult : {},
      purchaseItems: [],
      pymReq: [],
      pymPrice: undefined,
      deduct: undefined,
      isRecharge: undefined,
    }

    this._init = this._init.bind(this)
    this.moveScreen = this.moveScreen.bind(this)
    this.backKeyHandler = this.backKeyHandler.bind(this)

  }

  componentDidMount() {
    this._init()
    this.props.action.noti.getNotiList(this.props.auth.user)
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.backKeyHandler)
  }

  backKeyHandler() {
    console.log("Disabled back key")
    return true
  }

  moveScreen(key) {
    
    this.backHandler.remove()

    if(key == 'MyPage') {
      this.props.navigation.popToTop() && this.props.navigation.navigate('MyPage')
    }
    else {
      this.props.navigation.popToTop() && this.props.navigation.navigate('Home')
    }
  }

  _init() {
    const { pymReq, purchaseItems, pymPrice, deduct} = this.props.cart

    this.setState({
      result: this.props.navigation.getParam('pymResult'),
      orderResult: this.props.navigation.getParam('orderResult'),
      purchaseItems,
      pymReq,
      pymPrice,
      deduct,
      isRecharge: this.props.cart.purchaseItems.findIndex(item => item.type == 'rch') >= 0,
      screen: this.props.navigation.state.routeName,
    })

    // 구매 이력을 다시 읽어 온다.
    this.props.action.order.getOrders(this.props.auth)
    // 사용 내역을 다시 읽어 온다.
    this.props.action.order.getUsage(this.props.account.iccid, this.props.auth)
    // 카트를 비운다.
    this.props.action.cart.empty()
  }

  render() {
    const { pymReq, purchaseItems, pymPrice, deduct, isRecharge, screen } = this.state
      , { imp_success } = this.props.navigation.getParam('pymResult')
      ,{ result } = this.props.navigation.getParam('orderResult')

    // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
    // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.

    const isSuccess = !_.isUndefined(imp_success) ? imp_success && (result == 0) : result == 0

    return (
      <SafeAreaView style={{flex:1}}>
        <ScrollView style={{backgroundColor:colors.whiteTwo}}>
          <View style={styles.paymentResultView}>
            <Image style={styles.image} source={require('../assets/images/main/imgCheck.png')} resizeMode='contain'/>
            <Text style={styles.paymentResultText}> {i18n.t( isSuccess ? 'pym:success' : 'pym:fail')}</Text>
            <AppButton style={styles.btnOrderList}
                      //MyPage화면 이동 필요
                      onPress={() => this.moveScreen('MyPage')}
                      // title={i18n.t('cancel')} 
                      title={i18n.t('pym:toOrderList')}
                      titleStyle={appStyles.normal16Text}/>
          </View>
          <View style={styles.container}>
            <PaymentItemInfo cart={purchaseItems} pymReq={pymReq} balance={this.props.account.balance} mode={'result'}
                            pymPrice={isSuccess ? pymPrice : 0} deduct={isSuccess ? deduct : 0} isRecharge={isRecharge} screen={screen}/>
            { screen == 'PaymentResult' &&
              <View style={styles.result}>
                <Text style={appStyles.normal16Text}>{i18n.t('cart:afterDeductBalance')} </Text>
                <Text style={appStyles.normal16Text}>{utils.numberToCommaString(this.props.account.balance)+ ' ' + i18n.t('won')}</Text>
              </View>
            }
          </View>
        </ScrollView>
        
        <AppButton style={styles.btnHome} title={i18n.t('pym:toHome')} 
            titleStyle={styles.btnHomeText}
            onPress={() => this.moveScreen('Home')}/>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  cart: state.cart.toJS(),
  auth: accountActions.auth(state.account),
  noti : state.noti.toJS(),
  order: state.order.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action: {
      cart : bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
    }
  })
)(PaymentResultScreen)