import React, {Component} from 'react';
import { View, Text, StyleSheet, Button } from 'react-native'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as cartActions from '../redux/modules/cart'
import Video from 'react-native-video'

import Constants from 'expo-constants'

import getEnvVars from '../environment'
import i18n from '../utils/i18n';
import { SafeAreaView } from 'react-navigation';
import AppBackButton from '../components/AppBackButton';
import AppButton from '../components/AppButton';
import _ from 'underscore';

let IMP
if (Constants.appOwnership === 'expo') {
  IMP = {
    Payment : function() {
      return (<View/>)
    }
  }
}
else {

  IMP = require('iamport-react-native').default;
}

class PaymentScreen extends Component{
  // static navigationOptions = ({navigation= this.props.navigation}) => ({
  //   headerLeft: <AppBackButton navigation={navigation} title={!_.isEmpty(navigation.state.params.isPaid) && navigation.state.params.isPaid ? '결제완료' : i18n.t('payment')}/>
  //     // goBack={!_.isEmpty(this.state.isPaid) && !this.state.isPaid || true}
  //   })

  constructor(props) {
    super(props)

    this.state = {
      params: {},
      isPaid: true
    }

    this._callback = this._callback.bind(this)
  }

  static navigationOptions =  ({ navigation }) => {
    const { params = {} } = navigation.state

    return {
        headerLeft: <AppBackButton navigation={navigation} title={params.isPaid ? i18n.t('his:paymentCompleted') : i18n.t('payment')} isPaid={params.isPaid} pymResult={params.pymResult} orderResult={params.orderResult}/>
        // headerLeft: <AppBackButton navigation={navigation} title={'결제완료'} isPaid={true}/>
        // Similarly for the rest
    }  
  }

  componentDidMount() {
    const params = this.props.navigation.getParam('params')
    if(this.state.isPaid){
      this.setState({
        isPaid: false
      })
      this.props.navigation.setParams({isPaid:false})
    }

    if (params.mode == 'test' || Constants.appOwnership === 'expo' || params.amount == 0) {
      const {impId} = getEnvVars()
      const response = { imp_success: true,
        imp_uid: impId,
        merchant_uid: params.merchant_uid,
        amount: params.amount,
        profile_uuid: params.profile_uuid,
        deduct_from_balance: params.deduct_from_balance
      }

      this._callback(response)
    }
  }

  async _callback( response ) {
    const isSuccess = _.isUndefined(response.success) ? false : response.success
    const isImpSuccess = typeof(response.imp_success) === 'boolean' ? response.imp_success  : response.imp_success === 'true'

    console.log('@@@response', response)
    if(isSuccess || isImpSuccess || false){
      await this.props.navigation.setParams({isPaid:true})

      const params = this.props.navigation.getParam('params')
      const orderResult = await this.props.action.cart.payNorder({
        ... response,
        // payment_type: params.pg,
        amount: params.amount,
        profile_uuid: params.profile_uuid,
        deduct_from_balance: params.deduct_from_balance,
        dlvCost: params.dlvCost,
        // pay_method: params.pay_method,
      })

      this.props.navigation.replace('PaymentResult', {pymResult:response, orderResult})  
    }
    else{
      this.props.navigation.goBack()
    }
  }

  render() {
    const {impId} = getEnvVars()
    const params = this.props.navigation.getParam('params')

    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom:"always"}}>
        <IMP.Payment
          userCode={impId}
          loading={<Video source={require('../assets/images/loading_1.mp4')} style={styles.backgroundVideo} resizeMode={'cover'}/>} 
          data={params}             // 결제 데이터
          callback={response => this._callback(response)}
          style={styles.webview}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignSelf: 'stretch',
    height:"100%",
    width:"100%",
  },
  webview: {
    flex:1,
    alignSelf: 'stretch',
    backgroundColor: 'yellow',
    height:"100%",
    width:"100%",
    borderWidth: 1
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
})

export default connect(undefined, 
  (dispatch) => ({
    action: {
      cart : bindActionCreators(cartActions, dispatch),
    }
  })
)(PaymentScreen)