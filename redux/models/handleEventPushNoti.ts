import HandlePushNoti from './handlePushNoti';

class HandleEventPushNoti extends HandlePushNoti {
  handleNoti() {
    if (!this.isForeground)
      this.navigation.navigate('HomeStack', {
        screen: 'EventBoard',
        params: {index: 1},
      });
  }
}
export default HandleEventPushNoti;
