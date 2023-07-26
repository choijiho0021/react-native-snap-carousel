import HandlePushNoti from './handlePushNoti';

class HandleProvisionPushNoti extends HandlePushNoti {
  handleNoti() {
    if (!this.isForeground)
      this.navigation.navigate('EsimStack', {screen: 'Esim'});
    else {
      // foreground 일 때
      this.getSubs({iccid: this.iccid, token: this.token});
    }
  }
}

export default HandleProvisionPushNoti;
