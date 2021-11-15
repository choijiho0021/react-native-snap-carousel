import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import React, {memo, useCallback, useEffect, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {AuthCallback} from '.';
import AppButton from '../AppButton';

interface UserInfoInterface {
  idToken: string;
  serverAuthCode: string;
  scopes: Array<string>; // on iOS this is empty array if no additional scopes are defined
  user: {
    email: string;
    id: string;
    givenName: string;
    familyName: string;
    photo: string; // url
    name: string; // full name
  };
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
});

const GoogleLogin = ({onAuth}: {onAuth: AuthCallback}) => {
  const [userInfo, setUserInfo] = useState<UserInfoInterface>();

  const googleSigininConfigure = async () => {
    await GoogleSignin.configure({
      webClientId:
        Platform.OS === 'ios'
          ? '851340189695-vdasd78idkdeg77dgpb956r469ktrpqs.apps.googleusercontent.com'
          : '709736045062-jqtosfdqco0pgr620es7a4fgq9emokr9.apps.googleusercontent.com',
      offlineAccess: true, // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  };

  useEffect(() => {
    console.log('signing configure start');
    googleSigininConfigure();
  }, []);

  const signIn = async () => {
    console.log('signIn start');
    try {
      console.log(
        'GoogleSignin.hasPlayServices : ',
        await GoogleSignin.hasPlayServices(),
      );
      const userInfoPromise = await GoogleSignin.signIn()
        .then((val) => console.log('then val : ', val))
        .catch((e) => console.log('e : ', e));
      console.log('userInfoPromise : ', userInfoPromise);
      setUserInfo(userInfoPromise || []);
    } catch (error: any) {
      console.log('error log : ', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('로그인이 취소되었습니다.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('이미 로그인 중입니다.');
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Service 가 불가능합니다.');
        // play services not available or outdated
      } else {
        // some other error happened
        console.log('unknownError');
      }
    }
  };

  return (
    <View>
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
        // disabled={this.state.isSigninInProgress}
      />
    </View>
  );
};
export default memo(GoogleLogin);

// GoogleSignin.configure({
//   scopes: ['https://www.googleapis.com/auth/drive.readonly'], // [Android] what API you want to access on behalf of the user, default is email and profile
//   webClientId:
//     '709736045062-jqtosfdqco0pgr620es7a4fgq9emokr9.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
//   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//   hostedDomain: '', // specifies a hosted domain restriction
//   forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
//   accountName: '', // [Android] specifies an account name on the device that should be used
//   iosClientId:
//     '851340189695-vdasd78idkdeg77dgpb956r469ktrpqs.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//   googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
//   openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
//   profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
// });
