import React, {memo, useCallback} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import AppButton from '@/components/AppButton';
import {SocialAuthInfo} from '.';
import AppSvgIcon from '../AppSvgIcon';

const KakaoLogin = ({onAuth}: {onAuth: (v: SocialAuthInfo) => void}) => {
  const onPress = useCallback(async () => {
    try {
      // performs login request
      const {accessToken} = await KakaoSDK.RNKakaoLogins.login();

      if (accessToken) {
        const profile = await KakaoSDK.RNKakaoLogins.getProfile();
        const {phoneNumber, email, id, profileImageUrl} = profile;
        const mobile = phoneNumber
          ?.replace(/^\+[\d]+/, '0')
          ?.replace(/[ -]+/g, ''); // phoneNumber : '{국가코드} + ' ' + {번호}'
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

        onAuth?.({
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
      console.log('@@@ kakao login failed', error);
    }
  }, [onAuth]);

  return <AppSvgIcon name="kakaoNew" onPress={onPress} />;
};
export default memo(KakaoLogin);
