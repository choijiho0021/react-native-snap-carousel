import appleAuth from '@invertase/react-native-apple-authentication';
import React, {memo} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppText from '../AppText';
import AppleLogin from './AppleLogin';
import GoogleLogin from './GoogleLogin';
import KakaoLogin from './KakaoLogin';

export type SocialAuthInfo = {
  user: string;
  pass: string;
  token?: string | null;
  authorized: boolean;
  email?: string;
  mobile?: string;
  profileImageUrl?: string;
  kind: 'kakao' | 'ios' | 'google' | 'apple';
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 60,
    height: 200,
  },
  divider: {
    marginHorizontal: 20,
    height: 1,
    flex: 1,
    backgroundColor: colors.lightGrey,
    alignContent: 'center',
  },
  easyLoginTitle: {
    flexDirection: 'row',
    // height: 30,
    marginVertical: 20,
    alignItems: 'center',
  },
  btnGroup: {
    marginTop: 20,
    marginHorizontal: 20,
    height: 100,
  },
});

const SocialLogin = ({onAuth}: {onAuth: (v: SocialAuthInfo) => void}) => {
  return (
    <View style={styles.container}>
      <View style={styles.easyLoginTitle}>
        <View style={styles.divider} />
        <AppText style={appStyles.bold18Text}>
          {i18n.t('login:easyLogin')}
        </AppText>
        <View style={styles.divider} />
      </View>
      <View style={styles.btnGroup}>
        <KakaoLogin onAuth={onAuth} />
        {/* <NaverLoginButton onAuth={onAuth} /> */}
        {/* <FacebookLogin onAuth={onAuth} /> */}
        {Platform.OS === 'android' && <GoogleLogin onAuth={onAuth} />}
        {appleAuth.isSupported && <AppleLogin onAuth={onAuth} />}
      </View>
    </View>
  );
};

export default memo(SocialLogin);
