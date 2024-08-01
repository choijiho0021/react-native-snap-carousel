import React, {memo, useCallback, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import NaverLogin from '@react-native-seoul/naver-login';
import {SocialAuthInfo} from '.';
import Env from '@/environment';
import AppSvgIcon from '../AppSvgIcon';

const {naver} = Env.get();

const NaverLoginButton = ({onAuth}: {onAuth: (v: SocialAuthInfo) => void}) => {
  useEffect(() => {
    NaverLogin.initialize({
      appName: '로밍도깨비 eSIM',
      consumerKey: naver.consumerKey,
      consumerSecret: naver.consumerSecret,
      serviceUrlSchemeIOS: 'esimnaverlogin',
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
    } finally {
      NaverLogin.deleteToken();
      NaverLogin.logout();
    }
  }, [onAuth]);

  return <AppSvgIcon name="naverNew" onPress={onPress} />;
};
export default memo(NaverLoginButton);
