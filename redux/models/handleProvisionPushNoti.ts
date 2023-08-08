import HandlePushNoti from './handlePushNoti';

class HandleProvisionPushNoti extends HandlePushNoti {
  handleNoti() {
    if (!this.isForeground)
      this.navigation.navigate('EsimStack', {screen: 'Esim'});
    else {
      const {notiType} = this.payload.data;

      if (notiType) {
        const subsIccid = notiType.split('/')[1];

        if (subsIccid) {
          // foreground 일 때
          this.getNotiSubs({
            iccid: this.iccid,
            token: this.token,
            uuid: subsIccid,
          });
        }
      }
    }
  }
}

export default HandleProvisionPushNoti;
