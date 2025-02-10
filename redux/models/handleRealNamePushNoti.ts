import HandlePushNoti from './handlePushNoti';
import i18n from '@/utils/i18n';
import AppAlert from '@/components/AppAlert';

class HandleRealNamePushNoti extends HandlePushNoti {
  handleNoti() {
    this.navigation.navigate('TalkStack', {
      screen: 'RkbTalk',
      params: {
        actionStr: 'reload',
      },
    });
    this.terminatedCall(true);

    AppAlert.info(i18n.t('talk:duplicate:realName'), '', () => {});
  }
}

export default HandleRealNamePushNoti;
