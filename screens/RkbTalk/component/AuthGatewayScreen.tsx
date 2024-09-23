import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import {HomeStackParamList} from '@/navigation/navigation';

import i18n from '@/utils/i18n';
import {PaymentResultCallbackParam} from '@/components/AppPaymentGateway';
import account, {
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
import AppButton from '@/components/AppButton';

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
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.paleGray4,
    backgroundColor: colors.clearBlue,
    borderRadius: 100,
  },
});

export type AuthResponseType = {
  resultMsg: string;
  resultCode: string;
};

const AuthGatewayScreen: React.FC<AuthGatewayScreenProps> = ({
  navigation,
  account: {iccid, token, mobile},
  actions,
}) => {
  const [isResult, setIsResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultParam, setResultParam] = useState<AuthResponseType>({
    resultMsg: '',
    resultCode: '0',
  });
  const [count, setCount] = useState(0);

  const callback = useCallback(
    async (status: PaymentResultCallbackParam, errorMsg?: AuthResponseType) => {
      if (status === 'cancel') {
        // 플래그 값 정리
        setCount((prev) => prev + 1);
        setIsResult(true);
        setIsSuccess(false);
        if (errorMsg) setResultParam(errorMsg);
      } else {
        actions.account.getAccount({iccid, token});
        setIsSuccess(true);
        navigation.goBack();
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
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 1,
                gap: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AppSvgIcon name="bannerWarning20" />
              <AppText
                style={{
                  ...appStyles.bold14Text,
                  color: colors.redBold,
                  marginHorizontal: 20,
                }}>
                {resultParam.resultMsg.replaceAll('+', ' ')}
              </AppText>
              <AppText>
                {i18n
                  .t('talk:auth:fail:code')
                  .replace('%', resultParam.resultCode)}
              </AppText>
              <AppButton
                style={styles.button}
                title={i18n.t('talk:auth:retry')}
                titleStyle={[appStyles.normal16Text, {color: colors.white}]}
                type="primary"
                onPress={() => {
                  setIsResult(false);
                }}
              />
            </View>
            <View style={{height: 80}}>
              {count > 1 && <AppText>{i18n.t('talk:auth:fail')}</AppText>}
            </View>
          </View>
        );
      }
    }
    return <AppAuthGateway mobile={mobile || ''} callback={callback} />;
  }, [
    callback,
    count,
    isResult,
    isSuccess,
    mobile,
    resultParam.resultCode,
    resultParam.resultMsg,
  ]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={appStyles.header}>
        <AppBackButton title={i18n.t('talk:authGateway:title')} />
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
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(AuthGatewayScreen);
