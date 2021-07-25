import i18n from '@/utils/i18n';
import AppAlert from '@/components/AppAlert';
import HandlePushNoti from './handlePushNoti';

class HandleAccountPushNoti extends HandlePushNoti {
  handleNoti() {
    const target = (this.payload.data || {}).iccid;
    if (typeof this.iccid !== 'undefined' && this.iccid === target) {
      if (!this.isNoticed) {
        this.isNoticed = true;
        this.clearAccount = this.clearAccount.bind(this);

        AppAlert.info(
          i18n.t('acc:disconnectSim'),
          i18n.t('noti'),
          this.clearAccount,
        );
      }
    }
  }

  clearAccount() {
    this.clearCurrentAccount();
    this.isNoticed = false;
  }
}

export default HandleAccountPushNoti;
