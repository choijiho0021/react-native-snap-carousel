export type HandlePushNotiOptions = {
  isForeground: boolean;
  isRegister: boolean;
  updateAccount: any;
  getNotiSubs: any;
  token?: string;
  mobile?: string;
  iccid?: string;
  clearCurrentAccount: () => void;
  terminatedCall: any;
};

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

  protected mobile: any;

  protected iccid: any;

  protected terminatedCall: any;

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
      terminatedCall,
    }: HandlePushNotiOptions,
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
    this.mobile = mobile;
    this.iccid = iccid;
    this.terminatedCall = terminatedCall;
  }
}
export default HandlePushNoti;
