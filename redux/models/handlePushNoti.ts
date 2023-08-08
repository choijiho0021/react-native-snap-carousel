import {Platform} from 'react-native';
import _ from 'underscore';
// import {API} from '@/redux/api';

class HandlePushNoti {
  protected navigation: any;
  protected payload: any;
  protected isForeground: boolean;
  protected isRegister: boolean;
  protected isNoticed: boolean;
  protected updateAccount: any;
  protected getNotiSubs: any;
  protected token: string;
  protected clearCurrentAccount: any;
  protected checkAndGetOrderById: any;
  protected order: any;
  protected auth: any;
  protected mobile: any;
  protected iccid: any;

  constructor(
    navigation: any, // replace 'any' with the actual type of 'navigation'
    payload: any, // replace 'any' with the actual type of 'payload'
    {
      mobile,
      iccid,
      isForeground,
      isRegister,
      updateAccount,
      getNotiSubs,
      token,
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
      getNotiSubs: any;
      token: string;
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
    this.getNotiSubs = getNotiSubs;
    this.token = token;
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
