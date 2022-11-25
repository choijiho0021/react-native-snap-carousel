// naver login for commit
import React, {memo, useCallback} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {
  ConfigParam,
  getProfile,
  NaverLogin,
  TokenResponse,
} from '@react-native-seoul/naver-login';
import AppButton from '@/components/AppButton';
import {AuthCallback} from '@/components/SocialLogin';
import Env from '@/environment';

const {esimGlobal} = Env.get();

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
});

const NaverLoginButton = ({onAuth}: {onAuth: AuthCallback}) => {
  const getProfileInfo = useCallback(
    async (token: string) => {
      const res = await getProfile(token);
      if (res.resultcode === '024') {
        Alert.alert('Login Failed', res.message);
        return;
      }

      if (onAuth) {
        onAuth({
          user: res.response.id,
          pass: token,
          authorized: true,
          email: res.response.email,
          mobile: res.response.mobile.replace(/-/gi, ''),
        });
      }
    },
    [onAuth],
  );

  const onPress = useCallback(async () => {
    const iosKeys: ConfigParam = {
      // kConsumerKey => naver application client ID
      // kCosumerSecret => naver application secret key
      kConsumerKey: '', // client ID
      kConsumerSecret: '',
      kServiceAppName: '로밍도깨비 eSIM', // app name
      kServiceAppUrlScheme: esimGlobal ? 'globalnaverlogin' : 'esimnaverlogin', // only for iOS // naverlogin
    };

    await NaverLogin.login(iosKeys, (err?: Error, token?: TokenResponse) => {
      // accessToken: string;
      // refreshToken: string;
      // expiresAt: string;
      // tokenType: string;
      console.log('\n\n  Token is fetched  ::\n\n ', token, iosKeys);

      if (err) {
        console.log('login error', err);
        return;
      }
      if (token) getProfileInfo(token.accessToken);
    });
  }, [getProfileInfo]);

  return (
    <View style={styles.button}>
      <AppButton
        iconName="naverLogin"
        style={{
          width: 44, // You must specify a width
          height: 44, // You must specify a height
        }}
        onPress={onPress}
      />
    </View>
  );
};
export default memo(NaverLoginButton);
