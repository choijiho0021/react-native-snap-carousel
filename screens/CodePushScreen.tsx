import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, AppState, StyleSheet, View} from 'react-native';
import codePush, {DownloadProgress} from 'react-native-code-push';
import AppAlert from '@/components/AppAlert';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  text: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    marginBottom: 15,
  },
  indicator: {
    marginBottom: 15,
  },
});

const CodePushScreen: React.FC = () => {
  const [syncMessage, setSyncMessage] = useState();
  const [progress, setProgress] = useState<DownloadProgress>();

  const codePushSync = useCallback(() => {
    if (Config.NODE_ENV !== 'production' && Config.NODE_ENV !== 'staging')
      return;

    try {
      codePush.sync(
        {
          updateDialog: false,
          installMode: codePush.InstallMode.IMMEDIATE, // 업데이트 후 바로 재기동
        },
        (syncStatus) => {
          let msg = '';

          switch (syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
              msg = i18n.t('codepush:checking');
              break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              msg = i18n.t('codepush:download');
              break;
            /*
            case codePush.SyncStatus.AWAITING_USER_ACTION:
              syncMessage = i18n.t('codepush:awaiting');
              break;
            */
            case codePush.SyncStatus.INSTALLING_UPDATE:
              msg = i18n.t('codepush:install');
              break;
            case codePush.SyncStatus.UP_TO_DATE:
              msg = i18n.t('codepush:uptodate');
              break;
            case codePush.SyncStatus.UPDATE_IGNORED:
              msg = i18n.t('codepush:ignore');
              break;
            /*
            case codePush.SyncStatus.UPDATE_INSTALLED:
              syncMessage = i18n.t('codepush:nextresume');
              break;
            */
            case codePush.SyncStatus.UNKNOWN_ERROR:
              msg = i18n.t('codepush:error');
              break;

            default:
          }

          setSyncMessage(msg);

          if (
            [
              codePush.SyncStatus.UP_TO_DATE,
              codePush.SyncStatus.UPDATE_IGNORED,
              codePush.SyncStatus.UPDATE_INSTALLED,
              codePush.SyncStatus.UNKNOWN_ERROR,
            ].includes(syncStatus)
          ) {
            setProgress(undefined);
          }
        },
        (progress) => {
          setProgress(progress);
        },
      );
    } catch (error) {
      AppAlert.error(i18n.t('codepush:failedToUpdate'), '', () =>
        console.log('codepush error', error),
      );
      codePush.log(error);
    }
  }, []);

  useEffect(() => {
    codePushSync();
    AppState.addEventListener('change', (state) => {
      if (state === 'active') codePushSync();
    });
  }, [codePushSync]);

  return (
    <View style={[styles.container]}>
      <ActivityIndicator
        size="large"
        color={colors.clearBlue}
        style={styles.indicator}
      />
      {progress && (
        <AppText style={styles.text}>
          {parseInt((progress.receivedBytes / progress.totalBytes) * 100, 10)}%
        </AppText>
      )}
      <AppText style={styles.text}> {syncMessage} </AppText>
    </View>
  );
};

export default CodePushScreen;
