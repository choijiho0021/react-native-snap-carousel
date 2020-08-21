import Analytics from 'appcenter-analytics';
import _ from 'underscore';
import firebase from 'react-native-firebase';

class PushNoti {
  constructor() {
    this.callback = undefined;
    this.notificationListener = undefined;
    this.notificationOpenedListener = undefined;
    this.notificationInitListener = undefined;
    this.onMessage = undefined;
    this._onRegister = this._onRegister.bind(this);
    this._onNotification = this._onNotification.bind(this);
    this.onNoti = this.onNoti.bind(this);
  }

  _onRegister(token) {
    console.log('PushNotification TOKEN:', token);

    if (_.isFunction(this.callback)) {
      this.callback('register', token.token);
    }
  }

  _onNotification(notification, isForeground = true) {
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

  async _configure({
    onRegister = ({token}) => {},
    onNotification = notification => {},
  }) {
    const enabled = await firebase.messaging().hasPermission();
    const notifications = firebase.notifications();

    if (enabled) {
      await firebase.messaging().requestPermission();
    }

    firebase
      .messaging()
      .getToken()
      .then(token => {
        if (_.isFunction(onRegister)) {
          onRegister({token});
        }
      });

    //App이 foreground상태, push noti를 클릭하는 경우
    this.notificationListener = notifications.onNotification(
      this.onNoti('onNotification', onNotification),
    );

    //App이 background상태, push noti를 클릭하는 경우
    this.notificationOpenedListener = notifications.onNotificationOpened(
      this.onNoti('onNotificationOpened', onNotification),
    );

    //App이 Killed상태, push noti를 클릭하고 앱을 실행하는 경우
    this.notificationInitListener = notifications
      .getInitialNotification()
      .then(this.onNoti('getInitialNotification', onNotification));

    //foreground 상태에서 data만 받아서 처리 (foreground badge 수 변경 전용)
    this.onMessage = firebase.messaging().onMessage(message => {
      console.log('message', message);
      const {badge = 0, notiType, iccid} = message.data;
      firebase.notifications().setBadge(Number(badge));

      // sim 카드 해지 알림이 왓을 때 백그라운드
      if (notiType && iccid) {
        onNotification({data: {notiType, iccid}});
      }
    });
  }

  onNoti = (key, onNotification) => notification => {
    console.log('key & notification', key, notification);
    if (notification && _.isFunction(onNotification)) {
      if (key == 'onNotification') onNotification(notification);
      else {
        const notiType = notification.notification._data.notiType.split('/');
        //push noti를 클릭하여 앱으로 진입한 경우에만 카운트
        Analytics.trackEvent('Touch_Noti', {type: notiType[0]});
        onNotification(notification.notification, false);
      }
    }
  };

  async add(callback) {
    this.callback = callback;

    this._configure({
      onRegister: this._onRegister,
      onNotification: this._onNotification,
    });
  }
}

export default new PushNoti();
