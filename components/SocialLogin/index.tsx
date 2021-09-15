import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import appleAuth from '@invertase/react-native-apple-authentication';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import AppText from '../AppText';
import AppleLogin from './AppleLogin';

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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    // justifyContent: 'space-between',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});

const SocialLogin = ({onAuth}: {onAuth: AuthCallback}) => {
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
        {/* <KakaoLogin onAuth={onAuth} /> */}
        {/* <NaverLoginButton onAuth={onAuth} /> */}
        {/* <FacebookLogin onAuth={onAuth} /> */}
        {appleAuth.isSupported && <AppleLogin onAuth={onAuth} />}
      </View>
    </View>
  );
};

export default memo(SocialLogin);
