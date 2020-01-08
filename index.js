/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

if(Platform.OS=='android'){
  const bgMessaging = require('./bgMessaging')
  AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);
}
