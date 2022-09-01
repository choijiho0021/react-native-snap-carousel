import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import AppButton from '@/components/AppButton';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {SocialAuthInfo} from '.';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7E600',
    borderRadius: 2,
    height: 52,
  },
  btnStyle: {
    width: '100%',
  },
});

const KakaoLogin = ({onAuth}: {onAuth: (v: SocialAuthInfo) => void}) => {
  const onPress = useCallback(async () => {
    try {
      // performs login request
      const {accessToken} = await KakaoSDK.RNKakaoLogins.login();

      if (accessToken) {
        const profile = await KakaoSDK.RNKakaoLogins.getProfile();
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

  return (
    <View style={styles.container}>
      <AppButton
        iconName="kakaoLogin"
        title={i18n.t('socialLogin:kakao')}
        titleStyle={{...appStyles.medium16, marginLeft: 5, color: colors.black}}
        viewStyle={styles.viewStyle}
        style={styles.btnStyle}
        onPress={onPress}
      />
    </View>
  );
};
export default memo(KakaoLogin);
