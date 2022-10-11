import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import React, {memo, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {SocialAuthInfo} from '.';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppButton from '../AppButton';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    height: 52,
  },
  btnStyle: {
    width: '100%',
  },
});

const GoogleLogin = ({onAuth}: {onAuth: (v: SocialAuthInfo) => void}) => {
  const googleSigininConfigure = async () => {
    await GoogleSignin.configure({
      scopes: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/user.phonenumbers.read',
      ],
      webClientId:
        // '709736045062-9v8j5dfc12jj07bo9htaolhqc19l5dm7.apps.googleusercontent.com',
        '851340189695-vdasd78idkdeg77dgpb956r469ktrpqs.apps.googleusercontent.com',
      offlineAccess: true,
    });
  };

  useEffect(() => {
    googleSigininConfigure();
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
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
      <AppButton
        iconName="googleLogin"
        title={i18n.t('socialLogin:google')}
        titleStyle={{...appStyles.medium16, marginLeft: 5, color: colors.black}}
        viewStyle={styles.viewStyle}
        style={styles.btnStyle}
        onPress={signIn}
      />
    </View>
  );
};
export default memo(GoogleLogin);
