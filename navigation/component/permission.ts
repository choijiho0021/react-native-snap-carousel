import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
// import {Adjust, AdjustConfig} from 'react-native-adjust';
import Env from '@/environment';

const {esimApp, isProduction, adjustToken = ''} = Env.get();

export function adjustCreate() {
  // const adjustEnv = isProduction
  //   ? AdjustConfig.EnvironmentProduction
  //   : AdjustConfig.EnvironmentSandbox;
  // const adjustConfig = new AdjustConfig(adjustToken, adjustEnv);
  // adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
  // messaging()
  //   .getToken()
  //   .then((deviceToken) => Adjust.setPushToken(deviceToken));
  // Adjust.create(adjustConfig);
  // Adjust.requestTrackingAuthorizationWithCompletionHandler((status) => {
  //   console.log(' aaaaa tracking permission request', status);
  //   // 0 : 미결정 ATTrackingManagerAuthorizationStatusNotDetermined case
  //   // 1 : 제한됨 ATTrackingManagerAuthorizationStatusRestricted case
  //   // 2 : 거부됨 ATTrackingManagerAuthorizationStatusDenied case
  //   // 3 : 허가함 ATTrackingManagerAuthorizationStatusAuthorized case
  // });
}
export async function requestPermission() {
  if (Platform.OS === 'ios') {
    await requestTrackingPermission();
    await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (!esimApp) {
      await request(PERMISSIONS.IOS.CAMERA);
    }
    await messaging().requestPermission();
    await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    // adjustCreate();
  } else if (Platform.OS === 'android') {
    await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  }
}

export async function checkFistLaunch() {
  // 앱 첫 실행 여부 확인
  const value = await AsyncStorage.getItem('alreadyLaunched');
  if (value == null) {
    AsyncStorage.setItem('alreadyLaunched', 'true');
    return true;
  }
  return false;
}
