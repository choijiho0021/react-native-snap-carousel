import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  KakaoOAuthToken,
  KakaoProfile,
  getProfile as getKakaoProfile,
  login,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-community/async-storage';
import AppButton from '@/components/AppButton';
import {AuthCallback} from '.';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
});

const KakaoLogin = ({onAuth}: {onAuth: AuthCallback}) => {
  const onPress = useCallback(async () => {
    try {
      /* for testing
      if (onAuth)
        onAuth({
          user: 'kakaouser',
          pass: '1234',
          authorized: true,
          email: 'app@test.com',
        });
        */

      // performs login request
      const {accessToken} = await login();

      if (accessToken) {
        const profile = await getKakaoProfile();
        const {phoneNumber, email} = profile;
        const user = phoneNumber.split(' ')[1].replace(/-/g, ''); // phoneNumber : '{국가코드} + ' ' + {번호}'

        console.log('@@@ Kakao accessToken', accessToken);
        console.log('@@@ Kakao user', user);
        console.log('@@@ Kakao email', email);

        await AsyncStorage.setItem('login.kakao.user', user);
        if (accessToken)
          await AsyncStorage.setItem('login.kakao.pass', accessToken);

        let storedEmail = email || '';
        if (email) {
          await AsyncStorage.setItem('login.kakao.email', email);
        } else {
          storedEmail = (await AsyncStorage.getItem('login.kakao.email')) || '';
        }

        if (onAuth)
          onAuth({
            user,
            pass: accessToken,
            authorized: true,
            email: storedEmail,
          });
      }
    } catch (error) {
      console.error(error);
    }
  }, [onAuth]);

  return (
    <View style={styles.button}>
      <AppButton
        iconName="kakaoLogin"
        style={{
          width: 160,
          height: 45,
        }}
        onPress={onPress}
      />
    </View>
  );
};
export default memo(KakaoLogin);
