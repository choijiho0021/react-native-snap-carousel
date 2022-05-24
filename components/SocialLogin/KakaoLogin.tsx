import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  getProfile as getKakaoProfile,
  login,
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
      // performs login request
      const {accessToken} = await login();

      if (accessToken) {
        const profile = await getKakaoProfile();
        const {phoneNumber, email, id, profileImageUrl} = profile;
        const mobile = phoneNumber
          .replace(/^\+[\d]+/, '0')
          .replace(/[ -]+/g, ''); // phoneNumber : '{국가코드} + ' ' + {번호}'
        const user = id.toString();

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
            kind: 'kakao',
            user,
            pass: accessToken,
            mobile,
            authorized: true,
            email: storedEmail,
            profileImageUrl,
          });
      }
    } catch (error) {
      console.error('@@@ kakao login failed', error);
    }
  }, [onAuth]);

  return (
    <View style={styles.button}>
      <AppButton
        iconName="kakaoLogin"
        style={{
          width: 44,
          height: 44,
        }}
        onPress={onPress}
      />
    </View>
  );
};
export default memo(KakaoLogin);
