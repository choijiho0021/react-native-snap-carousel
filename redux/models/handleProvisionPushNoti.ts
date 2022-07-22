import HandlePushNoti from './handlePushNoti';

class HandleProvisionPushNoti extends HandlePushNoti {
  handleNoti() {
    if (!this.isForeground)
      this.navigation.navigate('EsimStack', {screen: 'Esim'});
  }
}

export default HandleProvisionPushNoti;
