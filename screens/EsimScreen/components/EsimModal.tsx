import {bindActionCreators} from 'redux';
import Clipboard from '@react-native-community/clipboard';
import React, {memo, useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import _ from 'underscore';
import QRCode from 'react-native-qrcode-svg';
import AppModal from '@/components/AppModal';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import AppColorText from '@/components/AppColorText';
import AppButton from '@/components/AppButton';
import UsageItem from '@/screens/EsimScreen/components/UsageItem';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import AppSnackBar from '@/components/AppSnackBar';

const styles = StyleSheet.create({
  center: {
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,
    paddingVertical: 13,
    paddingHorizontal: 13,
  },
  titleAndStatus: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  titleStyle: {
    fontSize: 20,
  },
  esimInfoKey: {
    ...appStyles.normal16Text,
    color: colors.warmGrey,
    marginBottom: 6,
  },
  btnCopy: {
    backgroundColor: colors.white,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  modalBody: {
    marginVertical: 20,
  },
});

const showQR = (subs: RkbSubscription) => {
  return (
    <View style={styles.modalBody}>
      {_.isEmpty(subs.qrCode) ? (
        <View style={styles.center}>
          <AppText>{i18n.t('esim:showQR:nothing')}</AppText>
        </View>
      ) : (
        <View>
          <AppColorText
            style={appStyles.normal16Text}
            text={i18n.t('esim:showQR:body')}
          />
          <View style={styles.center}>
            <QRCode value={subs.qrCode} />
          </View>
        </View>
      )}
    </View>
  );
};

const esimManualInputInfo = () => {
  return (
    <View style={{marginBottom: 20}}>
      <AppColorText
        style={appStyles.normal16Text}
        text={i18n.t('esim:manualInput:body')}
      />
    </View>
  );
};

export type ModalType = 'showQR' | 'manual' | 'usage';
const modalTitleIcon = {showQR: 'btnQr', manual: 'btnPen', usage: undefined};

type EsimModalProps = {
  visible: boolean;
  subs?: RkbSubscription;
  onOkClose?: () => void;
  modal: ModalType;
  cmiUsage: any;
  cmiStatus: any;
  cmiPending: boolean;
  action: {
    toast: ToastAction;
  };
};
const EsimModal: React.FC<EsimModalProps> = ({
  modal,
  visible,
  subs,
  onOkClose,
  cmiUsage,
  cmiStatus,
  cmiPending,
  action,
}) => {
  const [copyString, setCopyString] = useState('');
  const [showSnackBar, setShowSnackbar] = useState(false);
  const modalHeadTitle = useMemo(() => {
    switch (modal) {
      case 'showQR':
        return i18n.t('esim:showQRTitle');

      case 'manual':
        return i18n.t('esim:manualInputTitle');

      default:
        return undefined;
    }
  }, [modal]);

  const copyToClipboard = useCallback(
    (value?: string) => () => {
      if (value) {
        Clipboard.setString(value);
        setCopyString(value);
        setShowSnackbar(true);
      }
    },
    [],
  );

  const copyInfo = useCallback(
    (title: string, valToCopy?: string) => {
      const selected = copyString === valToCopy;

      return (
        <View style={styles.titleAndStatus}>
          <View style={{flex: 1}}>
            <AppText style={styles.esimInfoKey}>
              {i18n.t(`esim:${title}`)}
            </AppText>
            <AppText style={appStyles.normal16Text}>{valToCopy}</AppText>
          </View>
          <AppButton
            title={i18n.t('copy')}
            titleStyle={[
              appStyles.normal14Text,
              {color: selected ? colors.clearBlue : colors.black},
            ]}
            style={[
              styles.btnCopy,
              {
                borderColor: selected ? colors.clearBlue : colors.whiteTwo,
              },
            ]}
            onPress={copyToClipboard(valToCopy)}
          />
        </View>
      );
    },
    [copyString, copyToClipboard],
  );

  const modalBody = useCallback(() => {
    if (!subs) return null;
    // const cmiUsage = {
    //   subscriberQuota: {
    //     qtavalue: '512000',
    //     qtabalance: '73042',
    //     qtaconsumption: '438958',
    //   },
    //   // 여기가 []면 미사용
    //   historyQuota: [
    //     {time: '20211222', qtaconsumption: '376.44', mcc: '452'},
    //     {time: '20211221', qtaconsumption: '1454.78', mcc: '452'},
    //   ],
    //   result: {code: 0},
    //   // 여기가 []면 미사용
    //   trajectoriesList: [
    //     {
    //       mcc: '452',
    //       country: 'Vietnam',
    //       beginTime: '20211221',
    //       useTime: '20220120',
    //       himsi: '454120382118109',
    //     },
    //   ],
    // };

    switch (modal) {
      case 'showQR':
        return showQR(subs);

      case 'manual':
        return (
          <View style={styles.modalBody}>
            {esimManualInputInfo()}
            {copyInfo('smdp', subs.smdpAddr)}
            {copyInfo('actCode', subs.actCode)}
          </View>
        );

      default: {
        const quota = cmiUsage?.quota;
        const used = cmiUsage?.used;
        const statusCd =
          _.isEmpty(quota) && !_.isEmpty(used) ? 'U' : cmiStatus?.statusCd;

        // usage
        return (
          cmiStatus &&
          cmiUsage && (
            <UsageItem
              item={subs}
              onPress={() => {}}
              showSnackbar={() => {}}
              cmiPending={cmiPending}
              usage={{quota, used}}
              cmiStatusCd={statusCd}
              endTime={cmiStatus?.endTime}
            />
          )
        );
      }
    }
  }, [cmiPending, cmiStatus, cmiUsage, copyInfo, modal, subs]);

  return (
    <AppModal
      type="close"
      justifyContent="flex-end"
      titleIcon={modalTitleIcon[modal]}
      titleStyle={styles.titleStyle}
      titleViewStyle={{justifyContent: 'flex-start'}}
      title={modalHeadTitle}
      contentStyle={{
        marginHorizontal: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: 20,
      }}
      onOkClose={onOkClose}
      visible={visible}>
      {modalBody()}
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('esim:copyMsg')}
      />
    </AppModal>
  );
};

export default connect(
  () => ({}),
  (dispatch) => ({
    action: {
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(memo(EsimModal));
