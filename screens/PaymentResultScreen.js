import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet
} from 'react-native';
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as cartActions from '../redux/modules/cart'

import PaymentItemInfo from '../components/PaymentItemInfo';
import SafeAreaView from 'react-native-safe-area-view';
import AppBackButton from '../components/AppBackButton';
import i18n from '../utils/i18n';

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

  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('home'), reset: true}),
  })

  constructor(props){
    super(props)

    this.state = {
      result : {}
    }

    this._init = this._init.bind(this)
  }

  componentDidMount() {
    this._init()
  }

  _init() {
    this.setState({
      result: this.props.navigation.getParam('pymResult')
    })
  }

  render() {
    const { pymReq, purchaseItems} = this.props.cart
    const { imp_success, success} = this.state.result

    // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
    // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.
    
    const isSuccess = !(imp_success === 'false' || imp_success === false || success === 'false' || success === false);

    return (
      <SafeAreaView style={styles.container}>
        <PaymentItemInfo cart={purchaseItems} pymReq={pymReq}/>     

        <View style={styles.result}>
          <Text style={{alignSelf: 'center'}}>{i18n.t( isSuccess ? 'pym:success' : 'pym:fail')}</Text>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  cart: state.cart.toJS(),
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action: {
      cart : bindActionCreators(cartActions, dispatch),
    }
  })
)(PaymentResultScreen)