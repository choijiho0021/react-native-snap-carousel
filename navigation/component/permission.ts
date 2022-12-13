import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {requestTrackingPermission} from 'react-native-tracking-transparency';

export async function requestPermission() {
  if (Platform.OS === 'ios') {
    await requestTrackingPermission();
    await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    await messaging().requestPermission();
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
