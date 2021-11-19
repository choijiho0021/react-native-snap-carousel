import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthCallback} from '.';
import AppButton from '../AppButton';
import {appStyles} from '../../constants/Styles';
import {Langcode} from '../../redux/api/api';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const AppleLogin = ({onAuth}: {onAuth: AuthCallback}) => {
  const onPress = useCallback(async () => {
    try {
      /* for testing
      if (onAuth)
        onAuth({
          user: 'appleuser',
          pass: '1234',
          authorized: true,
          email: 'app@test.com',
        });
        */

      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {user: newUser, email, nonce} = appleAuthRequestResponse;

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        newUser,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        console.log('@@@ auth', appleAuthRequestResponse);

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
            authorized: true,
            email: storedEmail,
            kind: 'ios',
          });
      }
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
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
      {/* <AppButton
        iconName="appleLogin"
        style={{
          width: 44,
          height: 44,
        }}
        onPress={onPress}
      /> */}
      <AppleButton
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        // style={{
        //   width: 160, // You must specify a width
        //   height: 45, // You must specify a height
        // }}
        // style={{width: 200, height: 45}}
        style={{flex: 1, height: 45}}
        textStyle={appStyles.bold18Text}
        onPress={onPress}
      />
    </View>
  );
};
export default memo(AppleLogin);
