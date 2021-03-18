/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS == 'android') {
  // const firebase = require('@react-native-firebase/app');

  AppRegistry.registerHeadlessTask(
    'RNFirebaseBackgroundMessage',
    () => async (message) => {
      const {badge = 0} = message.data;
      // firebase.notifications().setBadge(Number(badge));
      PushNotificationIOS.setApplicationIconBadgeNumber(Number(badge));
      // return Promise.resolve()
    },
  );
}
