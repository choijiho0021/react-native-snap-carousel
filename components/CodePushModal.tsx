import {Component} from 'react';
import {Alert, AppState, Linking} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import codePush from 'react-native-code-push';
import VersionCheck from 'react-native-version-check';
// import {Adjust, AdjustEvent} from 'react-native-adjust';
import {
  actions as syncActions,
  SyncAction,
  SyncModelState,
} from '@/redux/modules/sync';
import i18n from '@/utils/i18n';
import {RootState} from '@/redux';
import AppAlert from './AppAlert';
import Env from '@/environment';

// const {adjustAppUpdate = ''} = Env.get();

type CodePushModalProps = {
  sync: SyncModelState;
  action: {
    sync: SyncAction;
  };
};

class CodePushModal extends Component<CodePushModalProps> {
  componentDidMount() {
    this.props.action.sync.init();
    this.codePushCheckForUpdate();
  }

  codePushCheckForUpdate() {
    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'staging'
    )
      return;

    codePush
      .notifyAppReady()
      .then((_) => codePush.checkForUpdate())
      .then((update) => {
        if (this.props.sync.isSkipped) return;

        if (update) {
          const {isMandatory} = update;

          if (isMandatory) {
            Alert.alert(
              i18n.t('codepush:title'),
              i18n.t('codepush:mandatory'),
              [
                {
                  text: i18n.t('codepush:continue'),
                  onPress: () => this.props.action.sync.progress(),
                },
              ],
            );
          } else {
            Alert.alert(i18n.t('codepush:title'), i18n.t('codepush:body'), [
              {
                text: i18n.t('codepush:later'),
                onPress: () => this.props.action.sync.skip(),
                style: 'cancel',
              },
              {
                text: i18n.t('codepush:update'),
                onPress: () => this.props.action.sync.progress(),
              },
            ]);
          }
        }
      })
      .catch((error) => {
        console.log('@@ codePush failed', error);
      });
  }

  render() {
    return null;
  }
}

export default connect(
  ({sync}: RootState) => ({sync}),
  (dispatch) => ({
    action: {
      sync: bindActionCreators(syncActions, dispatch),
    },
  }),
)(CodePushModal);
