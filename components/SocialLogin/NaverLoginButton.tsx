// naver login for commit
import AppButton from '@/components/AppButton';
import {AuthCallback} from '@/components/SocialLogin';
import {colors} from '@/constants/Colors';
import {
  ConfigParam,
  getProfile,
  NaverLogin,
  TokenResponse,
} from '@react-native-seoul/naver-login';
import React, {memo, useCallback} from 'react';
import {Alert, StyleSheet, View} from 'react-native';

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
          pass: '',
          authorized: true,
          email: res.response.email,
          mobile: res.response.mobile,
        });
      }

      console.log('profileResult', res);
    },
    [onAuth],
  );

  const onPress = useCallback(async () => {
    const iosKeys: ConfigParam = {
      // kConsumerKey => naver application client ID
      // kCosumerSecret => naver application secret key
      kConsumerKey: '',
      kConsumerSecret: '',
      kServiceAppName: '로밍도깨비 eSIM',
      kServiceAppUrlScheme: 'naverlogin', // only for iOS // naverlogin
    };

    await NaverLogin.login(iosKeys, (err?: Error, token?: TokenResponse) => {
      // accessToken: string;
      // refreshToken: string;
      // expiresAt: string;
      // tokenType: string;
      console.log('\n\n  Token is fetched  ::\n\n ', token);

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
        title="naverLogin"
        style={{
          backgroundColor: colors.clearBlue,
          width: 160, // You must specify a width
          height: 45, // You must specify a height
        }}
        onPress={onPress}
      />
    </View>
  );
};
export default memo(NaverLoginButton);
