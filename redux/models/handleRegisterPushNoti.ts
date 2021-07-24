import HandlePushNoti from './handlePushNoti';

class HandleRegisterPushNoti extends HandlePushNoti {
  handleNoti() {
    this.updateAccount({deviceToken: this.payload});
  }
}
export default HandleRegisterPushNoti;
