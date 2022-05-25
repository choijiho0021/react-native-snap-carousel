import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import React, {memo, useEffect} from 'react';
import {View} from 'react-native';
import {SocialAuthInfo} from '.';
import i18n from '@/utils/i18n';

const GoogleLogin = ({onAuth}: {onAuth: (v: SocialAuthInfo) => void}) => {
  const googleSigininConfigure = async () => {
    await GoogleSignin.configure({
      scopes: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/user.phonenumbers.read',
      ],
      webClientId:
        '709736045062-9v8j5dfc12jj07bo9htaolhqc19l5dm7.apps.googleusercontent.com',
      offlineAccess: true,
    });
  };

  useEffect(() => {
    googleSigininConfigure();
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfoPromise = await GoogleSignin.signIn();
      const {user, serverAuthCode} = userInfoPromise;

      onAuth({
        email: user.email,
        authorized: true,
        pass: serverAuthCode || '',
        user: user.id,
        profileImageUrl: user.photo || '',
        kind: 'google',
      });
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log(i18n.t('googleLogin:signInCanceled'));
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(i18n.t('googleLogin:inProgress'));
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(i18n.t('googleLogin:serviceUnavailable'));
        // play services not available or outdated
      } else {
        // some other error happened
        console.log('unknownError : ', error);
      }
    }
  };

  return (
    <View>
      <GoogleSigninButton
        style={{width: 218, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
        // disabled={this.state.isSigninInProgress}
      />
    </View>
  );
};
export default memo(GoogleLogin);
