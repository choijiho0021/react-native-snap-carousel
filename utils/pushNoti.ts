import Analytics from 'appcenter-analytics';
import _ from 'underscore';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
import ShortcutBadge from 'react-native-app-badge';

class PushNoti {
  constructor() {
    this.callback = undefined;
    this.notificationListener = undefined;
    this.notificationOpenedListener = undefined;
    this.notificationInitListener = undefined;
    this.onMessage = undefined;
    this.onRegister = this.onRegister.bind(this);
    this.onNotification = this.onNotification.bind(this);
    this.onNoti = this.onNoti.bind(this);
  }

  onRegister(token) {
    console.log('PushNotification TOKEN:', token.token);

    if (_.isFunction(this.callback)) {
      this.callback('register', token.token);
    }
  }

  onNotification(notification, isForeground = true) {
    console.log('NOTIFICATION:', notification);

    if (_.isFunction(this.callback))
      this.callback('notification', notification, isForeground);
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
  }

  async configure({
    onRegister = ({token}) => {},
    onNotification = (notification) => {},
  }) {
    messaging()
      .getToken()
      .then((token) => {
        if (_.isFunction(onRegister)) {
          onRegister({token});
        }
      });

    // App이 foreground상태, push noti를 클릭하는 경우
    // this.notificationListener = notifications.onNotification(
    //   this.onNoti('onNotification', onNotification),
    // );

    // App이 background상태, push noti를 클릭하는 경우
    this.notificationOpenedListener = messaging().onNotificationOpenedApp(
      this.onNoti('onNotificationOpened', onNotification),
    );

    // // App이 Killed상태, push noti를 클릭하고 앱을 실행하는 경우
    this.notificationInitListener = messaging()
      .getInitialNotification()
      .then(this.onNoti('getInitialNotification', onNotification));

    // // foreground 상태에서 data만 받아서 처리 (foreground badge 수 변경 전용)
    this.onMessage = messaging().onMessage((message) => {
      const {badge = 0, notiType, iccid} = message.data;
      // messaging().setBadge(Number(badge));
      if (Platform.OS === 'ios')
        PushNotificationIOS.setApplicationIconBadgeNumber(Number(badge));
      else ShortcutBadge.setCount(Number(badge));
      // sim 카드 해지 알림이 왓을 때 백그라운드
      if (notiType && iccid) {
        onNotification({data: {notiType, iccid}});
      }
    });
  }

  onNoti = (key, onNotification) => (notification) => {
    if (notification && _.isFunction(onNotification)) {
      if (key === 'onNotification') onNotification(notification);
      else {
        const notiType = notification.data.notiType.split('/');
        // push noti를 클릭하여 앱으로 진입한 경우에만 카운트
        Analytics.trackEvent('Touch_Noti', {type: notiType[0]});
        onNotification(notification, false);
      }
    }
  };

  async add(callback) {
    this.callback = callback;

    this.configure({
      onRegister: this.onRegister,
      onNotification: this.onNotification,
    });
  }
}

export default new PushNoti();
