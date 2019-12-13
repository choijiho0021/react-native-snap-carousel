import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native'

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

  constructor(props) {
    super(props)

    this._callback = this._callback.bind(this)
  }

  componentDidMount() {
    const params = this.props.navigation.getParam('params')

    if (params.mode == 'test' || Constants.appOwnership === 'expo') {
      const {impId} = getEnvVars()
      const response = { imp_success: true,
        imp_uid: impId,
        merchant_uid: params.merchant_uid
      }

      this._callback(response)
    }
  }

  _callback( response) {
    this.props.navigation.replace('PaymentResult', {pymResult:response})
  }

  render() {
    const {impId} = getEnvVars()
    const params = this.props.navigation.getParam('params')

    return (
      <View style={styles.container}>
        <IMP.Payment
          userCode={impId}
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
})
 
export default PaymentScreen