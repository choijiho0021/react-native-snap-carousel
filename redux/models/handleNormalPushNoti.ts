import HandlePushNoti from './handlePushNoti';

class HandleNormalPushNoti extends HandlePushNoti {
  handleNoti() {
    if (!this.isForeground) this.navigation.navigate('Noti');
  }
}

export default HandleNormalPushNoti;
