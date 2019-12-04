import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet
} 
from 'react-native';
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
});
class PaymentResultScreen extends Component {

  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('home'), reset: true}),
  })

  constructor(props){
    super(props)
  }

  render(){
    const response = this.props.navigation.getParam('pymResult');
    const req = this.props.navigation.getParam('pymResult');
    const cart = this.props.navigation.getParam('cartItems');
    console.log('payment response', response)
    console.log('payment req', req)
    console.log('cart,', cart)

    // const { imp_success, success, imp_uid, merchant_uid, error_msg } = response;

    // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
    // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.
    
    // const isSuccess = !(imp_success === 'false' || imp_success === false || success === 'false' || success === false);

    return (
      <SafeAreaView style={styles.container}>
      <PaymentItemInfo cart={cart.orderItems}
                       pymReq={this.props.navigation.getParam('pymReq')}/>     
      <View style={{flex:1}}>
      <View style={{flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch'}}>
        {/* <Text>{`결제에 ${isSuccess ? '성공' : '실패'}하였습니다`}</Text> */}
        <Text style={{alignSelf: 'center'}}>결제가 완료되었습니다.</Text>
      </View>
      </View>
      </SafeAreaView>
    )
  }
}
export default PaymentResultScreen