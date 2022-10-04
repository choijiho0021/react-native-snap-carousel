import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
import AppButton from '../AppButton';
import {SocialAuthInfo} from '.';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B5998',
    borderRadius: 2,
    height: 52,
    marginTop: 12,
  },
  btnStyle: {
    width: '100%',
  },
});

const FacebookLogin = ({onAuth}: {onAuth: (v: SocialAuthInfo) => void}) => {
  const getPublicProfile = useCallback(
    (data) => {
      const infoRequest = new GraphRequest(
        '/me?fields=id,name,email,picture',
        null,
        async (error, result) => {
          if (error) {
            console.log('@@@ profile', error);
          } else {
            console.log('@@@ profile', data, result);

            const pass = data.accessToken.substr(0, 16);
            await AsyncStorage.setItem('login.facebook.user', result.id);
            await AsyncStorage.setItem('login.facebook.pass', pass);

            if (onAuth)
              onAuth({
                kind: 'facebook',
                user: result.id,
                pass,
                authorized: true,
                email: result.email,
              });
          }
        },
      );

      new GraphRequestManager().addRequest(infoRequest).start();
    },
    [onAuth],
  );

  const onPress = useCallback(() => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (result) => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            console.log('@@@ login', data?.accessToken.toString());
            getPublicProfile(data);
          });
        }
      },
      (error) => {
        console.log('Login fail with error: ' + error);
      },
    );
  }, [getPublicProfile]);

  return (
    <View style={styles.container}>
      <AppButton
        iconName="facebookLogin"
        title={i18n.t('socialLogin:facebook')}
        titleStyle={{...appStyles.medium16, marginLeft: 5, color: colors.white}}
        viewStyle={styles.viewStyle}
        style={styles.btnStyle}
        onPress={onPress}
      />
    </View>
  );
};
export default memo(FacebookLogin);
