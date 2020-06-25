import { Platform } from 'react-native'
import Analytics from 'appcenter-analytics'
import i18n from '../utils/i18n'
import _ from 'underscore'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

let PushNotification = undefined
let firebase = undefined

PushNotification = require("react-native-push-notification")

if ( Platform.OS !== 'ios') {
  firebase = require('react-native-firebase')
}

class PushNoti {
  constructor() {
    this.callback = undefined
    this.notificationListener = undefined
    this.notificationOpenedListener = undefined
    this.notificationInitListener = undefined
    this.onMessage = undefined
    this._onRegister = this._onRegister.bind(this)
    this._onNotification = this._onNotification.bind(this)
    this.AndroidOnNoti = this.AndroidOnNoti.bind(this)
  }

  _onRegister(token) {
    console.log("PushNotification TOKEN:", token)

    if ( _.isFunction(this.callback)) {
      this.callback('register', token.token)
    }
  }

  _onNotification(notification, isForeground = true) {
    console.log("NOTIFICATION:", notification, PushNotificationIOS);

    if ( _.isFunction(this.callback)) this.callback('notification', notification, isForeground)
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
    if (  Platform.OS === 'ios' ) {
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
  }

  remove() {
    PushNotification && PushNotification.unregister()
  }

  async _configureForAndroid({ onRegister = ({token}) => {}, onNotification = (notification) => {}}) {
    const enabled = await firebase.messaging().hasPermission()
    const notifications = firebase.notifications()

    if (enabled) {
      await firebase.messaging().requestPermission()
    }

    firebase.messaging().getToken().then(token => {
      if ( _.isFunction(onRegister) ) {
        onRegister({token})
      }
    })

    //App이 foreground상태, push noti를 클릭하는 경우
    this.notificationListener = notifications.onNotification(this.AndroidOnNoti("onNotification",onNotification));

    //App이 background상태, push noti를 클릭하는 경우
    this.notificationOpenedListener = notifications.onNotificationOpened(this.AndroidOnNoti("onNotificationOpened",onNotification));

    //App이 Killed상태, push noti를 클릭하고 앱을 실행하는 경우
    this.notificationInitListener = notifications.getInitialNotification().then(this.AndroidOnNoti("getInitialNotification",onNotification))

    //foreground 상태에서 data만 받아서 처리 (foreground badge 수 변경 전용)
    this.onMessage = firebase.messaging().onMessage(message => {
      console.log("message",message)
      const { badge = 0, notiType, iccid } = message.data
      firebase.notifications().setBadge(Number(badge))

      // sim 카드 해지 알림이 왓을 때 백그라운드
      if(notiType && iccid){
        onNotification({data: {notiType,iccid}})
      }
    })
  }

  AndroidOnNoti = (key, onNotification) => (notification) => {
    console.log('key & notification', key, notification);
    if ( notification && _.isFunction(onNotification)) {
      if(key == "onNotification") onNotification(notification)
      else {
        const notiType = notification.notification._data.notiType.split('/')
        //push noti를 클릭하여 앱으로 진입한 경우에만 카운트
        Analytics.trackEvent('Touch_Noti', {type : notiType[0]})
        onNotification(notification.notification,false)
      }
    }
  }

  add( callback) {
    this.callback = callback

    if ( Platform.OS === 'ios' ) {
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
      
        //(optional) default: true
        //- Specified if permissions (ios) and token (android and ios) will requested or not,
        //- if not, you must call PushNotificationsHandler.requestPermissions() later
        requestPermissions: true
      })
    }
    else {
      this._configureForAndroid({
        onRegister: this._onRegister,
        onNotification: this._onNotification
      })
    }
  }
}

export default new PushNoti()