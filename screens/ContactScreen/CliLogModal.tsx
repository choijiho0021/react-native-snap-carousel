import React, {useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Modal} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';
import ScreenHeader from '@/components/ScreenHeader';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppTextInput from '@/components/AppTextInput';
import AppButton from '@/components/AppButton';
import {
  LogAction,
  LogModelState,
  actions as logActions,
} from '@/redux/modules/log';
import {
  actions as toastActions,
  Toast,
  ToastAction,
} from '@/redux/modules/toast';
import {AccountModelState} from '@/redux/modules/account';
import {API} from '@/redux/api';

const styles = StyleSheet.create({
  closeButtonTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  cliLogMobile: {
    ...appStyles.medium16,
    paddingHorizontal: 12,
    paddingVertical: 13,
    backgroundColor: colors.lightGrey,
  },
});

type CliLogModalProps = {
  visible: boolean;
  onOkClose: () => void;

  account: AccountModelState;
  log: LogModelState;

  action: {
    log: LogAction;
    toast: ToastAction;
  };
};

const CliLogModal: React.FC<CliLogModalProps> = ({
  visible,
  onOkClose,

  account,
  log,
  action,
}) => {
  const [mobile, setMobile] = useState(account.mobile);

  const sendClientLog = useCallback(async () => {
    // 앱 로그 서버로 전송
    const resp = await API.User.saveClientLog({mobile, log: log.log});
    if (resp.result === 0) {
      action.toast.push({
        msg: Toast.SAVE_LOG_SUCCESS,
        toastIcon:
          resp.result === 0 ? 'bannerMarkToastSuccess' : 'bannerMarkToastError',
      });
    }
    action.log.clear();
  }, [action.log, action.toast, log.log, mobile]);

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View style={styles.headerContainer}>
            <ScreenHeader
              title={i18n.t('cliLog:title')}
              showIcon={false}
              renderLeft={
                <AppSvgIcon name="closeModal" onPress={() => onOkClose()} />
              }
            />
          </View>
          <View style={{flex: 1, marginHorizontal: 20}}>
            <AppStyledText
              text={i18n.t('cliLog:txt')}
              textStyle={appStyles.normal16Text}
              format={{
                b: {...appStyles.semiBold16Text, color: colors.clearBlue},
              }}
            />
            <AppText
              style={{
                marginTop: 32,
                marginBottom: 6,
                ...appStyles.semiBold14Text,
              }}>
              {i18n.t('cliLog:mobile')}
            </AppText>
            <AppTextInput
              style={styles.cliLogMobile}
              returnKeyType="done"
              enablesReturnKeyAutomatically
              onChangeText={(text) => setMobile(text)}
              editable={!account.loggedIn}
              maxLength={13}
              value={mobile}
            />
          </View>

          <AppButton
            style={{
              height: 52,
              marginHorizontal: 20,
              backgroundColor: colors.clearBlue,
            }}
            type="primary"
            onPress={() => {
              sendClientLog();
              onOkClose();
            }}
            title={i18n.t('cliLog:btnTitle')}
            titleStyle={[styles.closeButtonTitle, {color: colors.white}]}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default connect(
  ({account, log}: RootState) => ({
    account,
    log,
  }),
  (dispatch) => ({
    action: {
      log: bindActionCreators(logActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(CliLogModal);
