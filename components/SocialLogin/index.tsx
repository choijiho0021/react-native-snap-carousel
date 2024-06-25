import appleAuth from '@invertase/react-native-apple-authentication';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Env from '@/environment';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppText from '../AppText';
import AppleLogin from './AppleLogin';
import GoogleLogin from './GoogleLogin';
import KakaoLogin from './KakaoLogin';
import FacebookLogin from './FacebookLogin';
import NaverLoginButton from './NaverLoginButton';
import LoginToolTip from './LoginToolTip';

const {esimGlobal} = Env.get();

export type SocialAuthInfoKind =
  | 'kakao'
  | 'ios'
  | 'google'
  | 'apple'
  | 'facebook'
  | 'naver';

export type SocialAuthInfo = {
  user: string;
  pass: string;
  token?: string | null;
  authorized: boolean;
  email?: string;
  mobile?: string;
  profileImageUrl?: string;
  kind: SocialAuthInfoKind;
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.white,
    height: 217,
  },
  divider: {
    marginHorizontal: 20,
    height: 1,
    flex: 1,
    backgroundColor: colors.lightGrey,
    alignContent: 'center',
  },
  dividerText: {
    ...appStyles.medium18,
    lineHeight: 22,
    color: colors.gray2,
  },
  easyLoginTitle: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
  },
  btnGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  btnWithToolTip: {
    marginTop: 24,
    marginHorizontal: 56,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 4,
    height: 107,
  },
});

export type SocialLoginHistType = {
  kakao: boolean;
  ios: boolean;
  google: boolean;
  apple: boolean;
  facebook: boolean;
  naver: boolean;
};

const initialHist = {
  kakao: false,
  ios: false,
  google: false,
  apple: false,
  facebook: false,
  naver: false,
};

const SocialLogin = ({
  onAuth,
  referrer,
}: {
  onAuth: (v: SocialAuthInfo) => void;
  referrer?: string;
}) => {
  const fromNaver = useMemo(() => referrer === 'naver', [referrer]);
  const [socialLoginHist, setSocialLoginHist] =
    useState<SocialLoginHistType>(initialHist);

  useEffect(() => {
    AsyncStorage.getItem('login.hist').then((v) => {
      if (v && initialHist.hasOwnProperty(v)) {
        setSocialLoginHist({...initialHist, [v]: true});
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.easyLoginTitle}>
        <View style={styles.divider} />
        <AppText style={styles.dividerText}>
          {i18n.t('login:easyLogin')}
        </AppText>
        <View style={styles.divider} />
      </View>
      <View style={styles.btnWithToolTip}>
        <View style={styles.btnGroup}>
          {!esimGlobal && <KakaoLogin onAuth={onAuth} />}
          {!esimGlobal && <NaverLoginButton onAuth={onAuth} />}
          {Platform.OS === 'android' && <GoogleLogin onAuth={onAuth} />}
          {appleAuth.isSupported && <AppleLogin onAuth={onAuth} />}
          {esimGlobal && <FacebookLogin onAuth={onAuth} />}
        </View>
        {!esimGlobal &&
          ((Object.values(socialLoginHist).some((value) => value === true) &&
            !referrer) ||
            fromNaver) && (
            <LoginToolTip
              socialLoginHist={socialLoginHist}
              fromNaver={fromNaver}
            />
          )}
      </View>
    </View>
  );
};

export default memo(SocialLogin);
