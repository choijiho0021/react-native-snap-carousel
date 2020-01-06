import { Platform } from 'react-native'
import Constants from 'expo-constants'
import _ from 'underscore'

let PushNotification = undefined
let PushNotificationIOS = undefined
if ( Constants.appOwnership !== 'expo') {
  PushNotification = require("react-native-push-notification")

  if ( Platform.OS == 'ios') {
    PushNotificationIOS = require('@react-native-community/push-notification-ios')
  }
}


class PushNoti {
  constructor() {
    this.callback = undefined
    this._onRegister = this._onRegister.bind(this)
    this._onNotification = this._onNotification.bind(this)
  }

  _onRegister(token) {
    console.log("PushNotification TOKEN:", token)

    if ( _.isFunction(this.callback)) {
      this.callback('register', token.token)
    }
  }

  _onNotification(notification) {
    console.log("NOTIFICATION:", notification, PushNotificationIOS);

    if ( _.isFunction(this.callback)) this.callback('notification', notification)
    /* sample
    { foreground: true,
      userInteraction: false,
      message: 'Sample message for iOS development endpoints',
      data: 
      { remote: true,
        notificationId: '74CE1538-4188-4481-89A8-1477E2A9694D' },
      badge: undefined,
      alert: 'Sample message for iOS development endpoints',
      sound: undefined,
      finish: [Function: finish] }
      */

    // process the notification

    // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
    if ( PushNotificationIOS) {
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
  }

  remove() {
    PushNotification && PushNotification.unregister()
  }

  add( callback) {
    this.callback = callback

    PushNotification && PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: this._onRegister,
    
      // (required) Called when a remote or local notification is opened or received
      onNotification: this._onNotification,
    
      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: "709736045062",
    
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
    
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
    
      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    })
  }
}

export default new PushNoti()