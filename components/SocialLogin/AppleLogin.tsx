import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-community/async-storage';
import {SocialAuthInfo} from '.';
import {appStyles} from '@/constants/Styles';
import AppButton from '../AppButton';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 2,
    height: 52,
  },
  btnStyle: {
    width: '100%',
  },
});

const AppleLogin = ({onAuth}: {onAuth: (v: SocialAuthInfo) => void}) => {
  const onPress = useCallback(async () => {
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
      } = appleAuthRequestResponse;

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        newUser,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        await AsyncStorage.setItem('login.apple.user', newUser);
        if (nonce) await AsyncStorage.setItem('login.apple.pass', nonce);

        let storedEmail = email || '';
        if (email) {
          await AsyncStorage.setItem('login.apple.email', email);
        } else {
          storedEmail = (await AsyncStorage.getItem('login.apple.email')) || '';
        }

        if (onAuth)
          onAuth({
            user: newUser,
            pass: nonce,
            token: identityToken,
            authorized: true,
            email: storedEmail,
            kind: 'apple',
          });
      }
    } catch (error) {
      if (error?.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in');
      } else {
        console.error(error);
      }
    }
  }, [onAuth]);

  useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    return appleAuth.onCredentialRevoked(async () => {
      console.warn(
        'If this function executes, User Credentials have been Revoked',
      );
    });
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  return (
    <View style={styles.button}>
      <AppButton
        iconName="appleLogin"
        title={i18n.t('socialLogin:apple')}
        titleStyle={{...appStyles.medium16, marginLeft: 5, color: 'white'}}
        viewStyle={styles.viewStyle}
        style={styles.btnStyle}
        onPress={onPress}
      />
    </View>
  );
};
export default memo(AppleLogin);
