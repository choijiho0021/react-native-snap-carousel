import AppAlert from '@/components/AppAlert';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {actions as syncActions} from '@/redux/modules/sync';
import i18n from '@/utils/i18n';
import React, {Component} from 'react';
import {ActivityIndicator, AppState, StyleSheet, View} from 'react-native';
import codePush from 'react-native-code-push';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

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

class CodePushScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      syncMessage: '',
      progress: undefined,
    };

    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;

    this.props.navigation.setOptions({
      title: null,
    });

    this.codePushSync();
    AppState.addEventListener('change', (state) => {
      if (state === 'active') this.codePushSync();
    });
  }

  componentDidUpdate() {
    if (this.props.sync.isCompleted) {
      this.props.navigation.popToTop();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  codePushSync() {
    if (Config.NODE_ENV !== 'production' && Config.NODE_ENV !== 'staging')
      return;

    try {
      codePush.sync(
        {
          updateDialog: false,
          installMode: codePush.InstallMode.IMMEDIATE, // 업데이트 후 바로 재기동
        },
        (syncStatus) => {
          let syncMessage = '';

          switch (syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
              syncMessage = i18n.t('codepush:checking');
              break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              syncMessage = i18n.t('codepush:download');
              break;
            /*
                        case codePush.SyncStatus.AWAITING_USER_ACTION:
                            syncMessage = i18n.t('codepush:awaiting')
                            break;
                        */
            case codePush.SyncStatus.INSTALLING_UPDATE:
              syncMessage = i18n.t('codepush:install');
              break;
            case codePush.SyncStatus.UP_TO_DATE:
              syncMessage = i18n.t('codepush:uptodate');
              break;
            case codePush.SyncStatus.UPDATE_IGNORED:
              syncMessage = i18n.t('codepush:ignore');
              break;
            /*
                        case codePush.SyncStatus.UPDATE_INSTALLED:
                            syncMessage = i18n.t('codepush:nextresume')
                            break;
                        */
            case codePush.SyncStatus.UNKNOWN_ERROR:
              syncMessage = i18n.t('codepush:error');
              break;

            default:
          }

          this.props.action.sync.update({syncStatus});

          if (this.mounted && !this.props.sync.isCompleted) {
            this.setState({syncMessage});
          }

          if (
            [
              codePush.SyncStatus.UP_TO_DATE,
              codePush.SyncStatus.UPDATE_IGNORED,
              codePush.SyncStatus.UPDATE_INSTALLED,
              codePush.SyncStatus.UNKNOWN_ERROR,
            ].includes(syncStatus)
          ) {
            setTimeout(() => {
              this.props.action.sync.complete();
            }, 1000);

            if (this.mounted) {
              this.setState({progress: undefined});
            }
          }
        },
        (progress) => {
          if (this.mounted && !this.props.sync.isCompleted) {
            this.setState({progress});
          }
        },
      );
    } catch (error) {
      AppAlert.error(i18n.t('codepush:failedToUpdate'), '', () =>
        this.props.action.sync.complete(),
      );
      codePush.log(error);
    }
  }

  render() {
    const {progress, syncMessage} = this.state;

    return (
      <View style={[styles.container, this.props.style]}>
        <ActivityIndicator
          size="large"
          color={colors.clearBlue}
          style={styles.indicator}
        />
        {progress && (
          <AppText style={styles.text}>
            {' '}
            {parseInt((progress.receivedBytes / progress.totalBytes) * 100, 10)}
            %{' '}
          </AppText>
        )}
        <AppText style={styles.text}> {syncMessage} </AppText>
      </View>
    );
  }
}

export default connect(
  ({sync}: RootState) => ({sync}),
  (dispatch) => ({
    action: {
      sync: bindActionCreators(syncActions, dispatch),
    },
  }),
)(CodePushScreen);
