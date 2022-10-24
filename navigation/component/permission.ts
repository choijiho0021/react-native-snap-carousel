import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
// import {Adjust, AdjustConfig} from 'react-native-adjust';
import Env from '@/environment';

const {esimApp} = Env.get();

export async function requestPermission() {
  if (Platform.OS === 'ios') {
    await requestTrackingPermission();
    await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (!esimApp) {
      await request(PERMISSIONS.IOS.CAMERA);
    }
    await messaging().requestPermission();
    await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
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
