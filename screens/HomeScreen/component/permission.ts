import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import {PERMISSIONS, request} from 'react-native-permissions';
import Env from '@/environment';
import AsyncStorage from '@react-native-community/async-storage';

const {esimApp} = Env.get();

export async function requestPermission() {
  if (Platform.OS === 'ios') {
    await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (!esimApp) {
      await request(PERMISSIONS.IOS.CAMERA);
    }
    await messaging().requestPermission();
    await requestTrackingPermission();
  } else if (Platform.OS === 'android') {
    await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    await requestTrackingPermission();
    if (!esimApp) {
      await request(PERMISSIONS.ANDROID.CAMERA);
    }
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
