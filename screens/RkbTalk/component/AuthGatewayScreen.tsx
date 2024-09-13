import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import {HomeStackParamList} from '@/navigation/navigation';

import i18n from '@/utils/i18n';
import {PaymentResultCallbackParam} from '@/components/AppPaymentGateway';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import AppAuthGateway from './AuthGateway';
import AppSvgIcon from '@/components/AppSvgIcon';
import {utils} from '@/utils/utils';
import AppButton from '@/components/AppButton';

const {isIOS} = Env.get();

type PaymentGatewayScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PaymentGateway'
>;

type PaymentGatewayScreenRouteProp = RouteProp<
  HomeStackParamList,
  'PaymentGateway'
>;

type AuthGatewayScreenProps = {
  navigation: PaymentGatewayScreenNavigationProp;
  route: PaymentGatewayScreenRouteProp;
  account: AccountModelState;

  actions: {
    account: AccountAction;
  };
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    width: 200,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
  },
  normalBtnTitle: {
    ...appStyles.normal16Text,
    textAlign: 'right',
    width: '100%',
  },
});

export type AuthResponseType = {
  resultMsg: string;
  resultCode: string;
};

const AuthGatewayScreen: React.FC<AuthGatewayScreenProps> = ({
  route: {params},
  navigation,
  account: {iccid, token},
  actions,
}) => {
  const [isResult, setIsResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultParam, setResultParam] = useState<AuthResponseType>({
    resultMsg: '',
    resultCode: '0',
  });

  const callback = useCallback(
    async (status: PaymentResultCallbackParam, errorMsg?: AuthResponseType) => {
      if (status === 'cancel') {
        // 실패했을 때
        // flag 값 변경으로 result 화면에 실패문구랑 같이 다시 시도 버튼 추가하기
        setIsResult(true);
        setIsSuccess(false);
        if (errorMsg) setResultParam(errorMsg);
      } else {
        // 성공, 모달 닫기, realMobile을 reduxStore account에 저장하기
        // getAccount 써도되는지 확인하기

        actions.account.getAccount({iccid, token});
        setIsSuccess(true);
        navigation.goBack(); // goBack 하면 어디가는지 확인
      }
    },
    [actions.account, iccid, navigation, token],
  );

  const renderBody = useCallback(() => {
    if (isResult) {
      if (!isSuccess) {
        // 따로 컴포넌트로 뱰까
        return (
          <View
            style={{
              flex: 1,
              gap: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{gap: 6, alignItems: 'center'}}>
              <AppSvgIcon name="bannerWarning20" />
              <AppText
                style={{
                  ...appStyles.bold14Text,
                  color: colors.redBold,
                  marginHorizontal: 20,
                }}>
                {resultParam.resultMsg.replaceAll('+', ' ')}
              </AppText>
              <AppText>{`에러 코드 : ${resultParam.resultCode}`}</AppText>
              <AppButton
                style={styles.button}
                title={i18n.t('ok')}
                type="primary"
                onPress={() => {}}
              />
            </View>
          </View>
        );
      }
    }
    return <AppAuthGateway info={params} callback={callback} />;
  }, [
    callback,
    isResult,
    isSuccess,
    params,
    resultParam.resultCode,
    resultParam.resultMsg,
  ]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={appStyles.header}>
        <AppBackButton
          title={i18n.t('talk:authGateway:title')}
          disabled={params.isPaid}
          showIcon={!params.isPaid}
        />
      </View>
      {renderBody()}

      {/* {renderLoading()} */}
    </SafeAreaView>
  );
};

export default connect(
  ({account}: RootState) => ({account}),
  (dispatch) => ({
    actions: {
      accoune: bindActionCreators(accountActions, dispatch),
    },
  }),
)(AuthGatewayScreen);
