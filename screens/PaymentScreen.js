import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as cartActions from '../redux/modules/cart'
import Video from 'react-native-video'

import Constants from 'expo-constants'

import getEnvVars from '../environment'

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
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)

    this._callback = this._callback.bind(this)
  }

  componentDidMount() {
    const params = this.props.navigation.getParam('params')

    if (params.mode == 'test' || Constants.appOwnership === 'expo' || params.amount == 0) {
      const {impId} = getEnvVars()
      const response = { imp_success: true,
        imp_uid: impId,
        merchant_uid: params.merchant_uid,
        profile_uuid: params.profile_uuid,
        deduct_from_balance: params.deduct_from_balance
      }

      this._callback(response)
    }
  }

  async _callback( response ) {
    await this.props.action.cart.payNorder(response)
    this.props.navigation.replace('PaymentResult', {pymResult:response})
  }

  render() {
    const {impId} = getEnvVars()
    const params = this.props.navigation.getParam('params')

    return (
      <View style={styles.container}>
        <IMP.Payment
          userCode={impId}
          loading={<Video source={require('../assets/images/loading_1.mp4')} style={styles.backgroundVideo} />} 
          data={params}             // 결제 데이터
          callback={response => this._callback(response)}
          style={styles.webview}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignSelf: 'stretch',
    backgroundColor: 'skyblue',
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