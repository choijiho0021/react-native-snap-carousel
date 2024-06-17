import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NaverLogin from '@react-native-seoul/naver-login';
import AppButton from '@/components/AppButton';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {SocialAuthInfo} from '.';
import {colors} from '@/constants/Colors';

const consumerKey = 'eDNL03AN1tZ4WKa2vWOb';
const consumerSecret = '4IEh5ew6PA';
const appName = '로밍도깨비 eSIM';
const serviceUrlSchemeIOS = 'esimnaverlogin';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
    height: 52,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.black,
  },
  btnStyle: {
    width: '100%',
  },
});

const NaverLoginButton = ({onAuth}: {onAuth: (v: SocialAuthInfo) => void}) => {
  useEffect(() => {
    NaverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlSchemeIOS,
      // disableNaverAppAuthIOS: true,
    });
  }, []);

  const onPress = useCallback(async () => {
    try {
      const {successResponse} = await NaverLogin.login();

      if (successResponse) {
        const {accessToken} = successResponse;
        if (accessToken) {
          const profileResult = await NaverLogin.getProfile(accessToken);
          const {resultcode, response} = profileResult;
          if (resultcode === '00') {
            console.log('@@@@ response', response);
            const {id, email, mobile} = response;
            await AsyncStorage.setItem('login.naver.user', id);
            if (accessToken)
              await AsyncStorage.setItem('login.naver.pass', accessToken);

            let storedEmail = email || '';
            if (email) {
              await AsyncStorage.setItem('login.naver.email', email);
            } else {
              storedEmail =
                (await AsyncStorage.getItem('login.naver.email')) || '';
            }

            if (mobile)
              onAuth?.({
                kind: 'naver',
                user: id,
                pass: accessToken,
                mobile: mobile.replace(/-/g, ''),
                authorized: true,
                email: storedEmail,
              });
          }
        }
      }
    } catch (error) {
      console.log('@@@ naver login failed', error);
    }
  }, [onAuth]);

  return (
    <View style={styles.container}>
      <AppButton
        iconName="naverLogin"
        title={i18n.t('socialLogin:naver')}
        titleStyle={{...appStyles.medium16, marginLeft: 5, color: colors.black}}
        viewStyle={styles.viewStyle}
        style={styles.btnStyle}
        onPress={onPress}
      />
    </View>
  );
};
export default memo(NaverLoginButton);
