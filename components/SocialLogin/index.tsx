import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {appStyles} from '@/constants/Styles';
import appleAuth from '@invertase/react-native-apple-authentication';
import AppleLogin from './AppleLogin';
import FacebookLogin from './FacebookLogin';
import KakaoLogin from './KakaoLogin';
import NaverLoginButton from './NaverLoginButton';

export type AuthCallback = ({
  user,
  pass,
  authorized,
  email,
  mobile,
  profileImageUrl,
}: {
  user: string;
  pass: string;
  authorized: boolean;
  email?: string;
  mobile?: string;
  profileImageUrl?: string;
}) => void;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 60,
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
    height: 30,
    marginVertical: 20,
    alignItems: 'center',
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 55,
  },
});

const SocialLogin = ({onAuth}: {onAuth: AuthCallback}) => {
  return (
    <View style={styles.container}>
      <View style={styles.easyLoginTitle}>
        <View style={styles.divider} />
        <Text style={appStyles.bold18Text}>{i18n.t('login:easyLogin')}</Text>
        <View style={styles.divider} />
      </View>
      <View style={styles.btnGroup}>
        <KakaoLogin onAuth={onAuth} />
        <NaverLoginButton onAuth={onAuth} />
        <FacebookLogin onAuth={onAuth} />
        {appleAuth.isSupported && <AppleLogin onAuth={onAuth} />}
      </View>
    </View>
  );
};

export default memo(SocialLogin);
