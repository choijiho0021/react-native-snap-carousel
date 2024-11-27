import HandlePushNoti from './handlePushNoti';

class HandleRealNamePushNoti extends HandlePushNoti {
  handleNoti() {
    this.navigation.navigate('TalkStack', {
      screen: 'RkbTalk',
    });
    this.terminatedCall(true);
  }
}

export default HandleRealNamePushNoti;
