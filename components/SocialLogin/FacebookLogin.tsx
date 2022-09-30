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

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
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
    <View style={styles.button}>
      <AppButton
        iconName="facebookLogin"
        style={{
          width: 44,
          height: 44,
        }}
        onPress={onPress}
      />
    </View>
  );
};
export default memo(FacebookLogin);
