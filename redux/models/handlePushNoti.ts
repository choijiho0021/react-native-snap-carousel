import {Platform} from 'react-native';
import _ from 'underscore';
// import {API} from '@/redux/api';

class HandlePushNoti {
  private navigation: any;
  private payload: any;
  private isForeground: boolean;
  private isRegister: boolean;
  private isNoticed: boolean;
  private updateAccount: any;
  private clearCurrentAccount: any;
  private checkAndGetOrderById: any;
  private order: any;
  private auth: any;
  private mobile: any;
  private iccid: any;

  constructor(
    navigation: any, // replace 'any' with the actual type of 'navigation'
    payload: any, // replace 'any' with the actual type of 'payload'
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
    }: {
      mobile: any;
      iccid: any;
      isForeground: boolean;
      isRegister: boolean;
      updateAccount: any;
      clearCurrentAccount: any;
      checkAndGetOrderById: any;
      auth: any;
      order: any;
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
