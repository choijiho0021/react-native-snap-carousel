import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Modal,
  Pressable,
  Keyboard,
} from 'react-native';
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
import utils from '@/redux/api/utils';
import Env from '@/environment';

const {isIOS} = Env.get();

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
    lineHeight: isIOS ? 0 : undefined,
    paddingHorizontal: 12,
    paddingVertical: 13,
    justifyContent: 'center',
    borderColor: colors.lightGrey,
    borderWidth: 1,
  },
  content: {
    marginHorizontal: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
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
  const [mobile, setMobile] = useState(utils.toPhoneNumber(account.mobile));

  const sendClientLog = useCallback(async () => {
    // 앱 로그 서버로 전송
    const resp = await API.User.saveClientLog({
      mobile: mobile?.replace(/-/g, ''),
      log: log.log,
    });
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
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <Pressable style={styles.content} onPress={() => Keyboard.dismiss()}>
          <View style={styles.headerContainer}>
            <ScreenHeader
              title={i18n.t('cliLog:title')}
              titleStyle={appStyles.bold20Text}
              showIcon={false}
              renderLeft={
                <AppSvgIcon name="closeModal" onPress={() => onOkClose()} />
              }
            />
          </View>
          <View style={{flex: 1, marginHorizontal: 20}}>
            <AppStyledText
              text={i18n.t('cliLog:txt')}
              textStyle={{
                ...appStyles.normal16Text,
                lineHeight: 24,
                fontWeight: '400',
              }}
              format={{
                b: {
                  ...appStyles.semiBold16Text,
                  color: colors.clearBlue,
                  lineHeight: 24,
                },
              }}
            />
            <AppText
              style={{
                ...appStyles.semiBold14Text,
                marginTop: 32,
                marginBottom: 6,
                lineHeight: 20,
              }}>
              {i18n.t('cliLog:mobile')}
            </AppText>
            <AppTextInput
              style={[
                styles.cliLogMobile,
                {
                  backgroundColor: !account.loggedIn
                    ? colors.white
                    : colors.backGrey,
                  color: colors.black,
                },
              ]}
              returnKeyType="done"
              keyboardType="number-pad"
              enablesReturnKeyAutomatically
              onChangeText={(text) => setMobile(text)}
              onBlur={() =>
                setMobile((pre) => {
                  const str = pre?.replace(/-/g, '');
                  if (str && str?.length >= 11) {
                    return utils.toPhoneNumber(str);
                  }
                  return pre;
                })
              }
              onFocus={() => setMobile((pre) => pre?.replace(/-/g, ''))}
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
            disabled={mobile.length < 11}
          />
        </Pressable>
      </SafeAreaView>
      <SafeAreaView style={{backgroundColor: colors.white}} />
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
