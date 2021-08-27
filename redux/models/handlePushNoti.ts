import {Platform} from 'react-native';
import _ from 'underscore';
import {API} from '@/redux/api';

class HandlePushNoti {
  constructor(
    navigation,
    payload,
    {
      mobile,
      iccid,
      isForeground,
      isRegister,
      updateAccount,
      clearCurrentAccount,
      checkAndGetOrderById,
      auth,
      order,
    },
  ) {
    this.navigation = navigation;
    this.payload = payload;
    this.isForeground = isForeground;
    this.isRegister = isRegister;
    this.isNoticed = false;
    this.updateAccount = updateAccount;
    this.clearCurrentAccount = clearCurrentAccount;
    this.checkAndGetOrderById = checkAndGetOrderById;
    this.order = order;
    this.auth = auth;
    this.mobile = mobile;
    this.iccid = iccid;
  }

  sendLog() {
    if (this.mobile && _.size(this.payload.data) > 0) {
      if (Platform.OS === 'ios') {
        // API.Noti.sendLog({
        //   mobile: this.mobile,
        //   message: JSON.stringify(this.payload.data),
        // });
      }
    }
  }
}
export default HandlePushNoti;
