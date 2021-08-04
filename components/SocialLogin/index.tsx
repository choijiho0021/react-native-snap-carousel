import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import i18n from '@/utils/i18n';
import AppleLogin from './AppleLogin';
import KakaoLogin from './KakaoLogin';

export type AuthCallback = ({
  user,
  pass,
  authorized,
  email,
  mobile,
}: {
  user: string;
  pass: string;
  authorized: boolean;
  email?: string;
  mobile?: string;
}) => void;

const styles = StyleSheet.create({
  title: {
    marginTop: 10,
    textAlign: 'center',
  },
});

const SocialLogin = ({onAuth}: {onAuth: AuthCallback}) => {
  return (
    <View>
      <Text style={styles.title}>{i18n.t('login:easyLogin')}</Text>
      <AppleLogin onAuth={onAuth} />
      <KakaoLogin onAuth={onAuth} />
    </View>
  );
};

export default memo(SocialLogin);
