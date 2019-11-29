import React from 'react';
import { View, Text } from 'react-native';

export default function PaymentResult({ navigation }) {
  const response = navigation.getParam('response');

  console.log('payment response', response)
  const { imp_success, success, imp_uid, merchant_uid, error_msg } = response;

  // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
  // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.
  const isSuccess = !(imp_success === 'false' || imp_success === false || success === 'false' || success === false);

  return (
    <View style={{flex:1}}>
      <Text>{`결제에 ${isSuccess ? '성공' : '실패'}하였습니다`}</Text>
    </View>
  );
}