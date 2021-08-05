import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  AccessToken,
} from 'react-native-fbsdk';
import AsyncStorage from '@react-native-community/async-storage';
import AppButton from '@/components/AppButton';
import {AuthCallback} from '.';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
});

const FacebookLogin = ({onAuth}: {onAuth: AuthCallback}) => {
  const onPress = useCallback(async () => {
    try {
      /* for testing
      if (onAuth)
        onAuth({
          user: 'facebookuser',
          pass: '1234',
          authorized: true,
          email: 'app@test.com',
        });
        */

      LoginManager.logInWithPermissions(['public_profile', 'email']).then(
        (result) => {
          if (result.isCancelled) {
            console.log('FacebookLogin is Cancelled');
          } else {
            const req = new GraphRequest(
              '/me',
              {
                httpMethod: 'GET',
                version: 'v2.5',
                parameters: {
                  fields: {
                    string: 'email,name',
                  },
                },
              },
              async (err, res) => {
                if (err) {
                  console.log('Facebook get profile is failed', err);
                } else {
                  const {id, email} = res;
                  const {accessToken} =
                    await AccessToken.getCurrentAccessToken();

                  if (accessToken) {
                    await AsyncStorage.setItem('login.facebook.user', id);
                    await AsyncStorage.setItem(
                      'login.facebook.pass',
                      accessToken,
                    );

                    let storedEmail = email || '';
                    if (email) {
                      await AsyncStorage.setItem('login.facebook.email', email);
                    } else {
                      storedEmail =
                        (await AsyncStorage.getItem('login.facebook.email')) ||
                        '';
                    }

                    if (onAuth)
                      onAuth({
                        user: id,
                        pass: accessToken,
                        authorized: true,
                        email: storedEmail,
                      });
                  }
                }
              },
            );

            new GraphRequestManager().addRequest(req).start();
          }
        },
        (error) => {
          console.log('aaaaa Login fail with error: ', error);
        },
      );
    } catch (error) {
      console.error(error);
    }
  }, [onAuth]);

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
