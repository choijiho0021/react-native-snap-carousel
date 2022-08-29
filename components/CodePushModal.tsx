import React, {useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import codePush from 'react-native-code-push';
import {
  actions as syncActions,
  SyncAction,
  SyncModelState,
} from '@/redux/modules/sync';
import i18n from '@/utils/i18n';
import {RootState} from '@/redux';

// const {adjustAppUpdate = ''} = Env.get();

type CodePushModalProps = {
  sync: SyncModelState;
  action: {
    sync: SyncAction;
  };
};

const CodePushModal: React.FC<CodePushModalProps> = ({sync, action}) => {
  const codePushCheckForUpdate = useCallback(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'staging'
    )
      return;

    codePush
      .notifyAppReady()
      .then((_) => codePush.checkForUpdate())
      .then((update) => {
        if (sync.isSkipped) return;

        if (update) {
          const {isMandatory} = update;

          if (isMandatory) {
            Alert.alert(
              i18n.t('codepush:title'),
              i18n.t('codepush:mandatory'),
              [
                {
                  text: i18n.t('codepush:continue'),
                  onPress: () => action.sync.progress(),
                },
              ],
            );
          } else {
            Alert.alert(i18n.t('codepush:title'), i18n.t('codepush:body'), [
              {
                text: i18n.t('codepush:later'),
                onPress: () => action.sync.skip(),
                style: 'cancel',
              },
              {
                text: i18n.t('codepush:update'),
                onPress: () => action.sync.progress(),
              },
            ]);
          }
        }
      })
      .catch((error) => {
        console.log('@@ codePush failed', error);
      });
  }, [action.sync, sync.isSkipped]);

  useEffect(() => {
    action.sync.init();
    codePushCheckForUpdate();
  }, [action.sync, codePushCheckForUpdate]);

  return null;
};

export default connect(
  ({sync}: RootState) => ({sync}),
  (dispatch) => ({
    action: {
      sync: bindActionCreators(syncActions, dispatch),
    },
  }),
)(CodePushModal);
