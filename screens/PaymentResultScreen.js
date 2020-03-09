import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet
} from 'react-native';
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as cartActions from '../redux/modules/cart'
import * as orderActions from '../redux/modules/order'
import * as accountActions from '../redux/modules/account'
import * as notiActions from '../redux/modules/noti'

import PaymentItemInfo from '../components/PaymentItemInfo';
import SafeAreaView from 'react-native-safe-area-view';
import AppBackButton from '../components/AppBackButton';
import i18n from '../utils/i18n';
import _ from 'underscore';

import { colors } from '../constants/Colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: 'stretch'
  },
  result: {
    flex: 1,
    justifyContent: 'center'
  }
})

class PaymentResultScreen extends Component {

  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('cart')} back="top" />
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
  }

  componentDidMount() {
    this.props.action.noti.getNotiList(this.props.auth.user)

    this._init()
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
      <SafeAreaView style={styles.container}>
        <PaymentItemInfo cart={purchaseItems} pymReq={pymReq} balance={this.props.account.balance}
                        pymPrice={isSuccess ? pymPrice : 0} deduct={isSuccess ? deduct : 0} isRecharge={isRecharge} screen={screen}/>     

        <View style={styles.result}>
          <Text style={{alignSelf: 'center', color: colors.black}}>{i18n.t( isSuccess ? 'pym:success' : 'pym:fail')}</Text>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  cart: state.cart.toJS(),
  auth: accountActions.auth(state.account),
  noti : state.noti.toJS(),
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