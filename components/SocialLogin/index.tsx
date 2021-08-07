import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppleLogin from './AppleLogin';
import KakaoLogin from './KakaoLogin';
import AppButton from '../AppButton';
import FacebookLogin from './FacebookLogin';

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
        {/* naver, facebook 로그인은 추가 필요 */}
        <AppButton
          iconName="naverLogin"
          style={{
            width: 44,
            height: 44,
          }}
          onPress={() => {}}
        />
        <FacebookLogin onAuth={onAuth} />
        <AppleLogin onAuth={onAuth} />
      </View>
    </View>
  );
};

export default memo(SocialLogin);
