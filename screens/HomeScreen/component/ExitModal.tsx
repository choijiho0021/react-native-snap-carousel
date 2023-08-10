import React, {memo, useCallback, useMemo} from 'react';
import {BackHandler, ScrollView, StyleSheet, View} from 'react-native';
import AppModal from '@/components/AppModal';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import Env from '@/environment';

const {isIOS} = Env.get();

const styles = StyleSheet.create({
  normal16BlueText: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
  },
  modalTitle: {
    ...appStyles.normal20Text,
    marginHorizontal: 20,
  },
  modalBody: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  supportDevTitle: {
    ...appStyles.bold16Text,
    marginTop: 30,
    marginBottom: 10,
  },
  deviceScrollView: {
    backgroundColor: colors.whiteTwo,
    height: 250,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
});

const ExitModal = ({
  visible,
  devList,
  maintenance,
  onOkClose,
}: {
  visible: boolean;
  devList: string[];
  maintenance: {
    state: string;
    message?: string;
  };
  onOkClose: (v: string) => void;
}) => {
  const maintenanceMode = useMemo(
    () => maintenance.state === '1',
    [maintenance.state],
  );

  const showMaintenanceMode = useCallback(
    () => (
      <View style={styles.modalBody}>
        <AppText>{maintenance.message || i18n.t('home:maintenance')}</AppText>
      </View>
    ),
    [maintenance.message],
  );

  const showDevList = useCallback(
    () => (
      <View style={styles.modalBody}>
        {isIOS ? (
          <View>
            <View style={{marginBottom: 10}}>
              <AppStyledText
                text={i18n.t('home:unsupportedBody2')}
                textStyle={appStyles.normal16Text}
                format={{b: styles.normal16BlueText}}
              />
            </View>
            <AppText style={styles.supportDevTitle}>
              {i18n.t('home:supportedDevice')}
            </AppText>

            <ScrollView
              style={styles.deviceScrollView}
              showsVerticalScrollIndicator={false}>
              <AppText style={[appStyles.normal16Text, {lineHeight: 24}]}>
                {devList?.join(', ')}
                {i18n.t('home:supportedDeviceBody')}
              </AppText>
            </ScrollView>
          </View>
        ) : (
          <View style={{marginBottom: 10}}>
            <AppStyledText
              text={i18n.t('home:unsupportedBody1')}
              textStyle={appStyles.normal16Text}
              format={{b: styles.normal16BlueText}}
            />
            <AppStyledText
              text={i18n.t('home:unsupportedBody2')}
              textStyle={{...appStyles.normal16Text, marginTop: 30}}
              format={{b: styles.normal16BlueText}}
            />
            <AppText style={[appStyles.normal16Text, {marginVertical: 30}]}>
              {i18n.t('home:unsupportedBody3')}
            </AppText>
            <AppStyledText
              text={i18n.t('home:unsupportedBody4')}
              textStyle={appStyles.normal16Text}
              format={{b: styles.normal16BlueText}}
            />
            <AppText style={[appStyles.normal16Text, {marginTop: 30}]}>
              {i18n.t('home:unsupportedBody5')}
            </AppText>
          </View>
        )}
      </View>
    ),
    [devList],
  );

  return (
    <AppModal
      title={i18n.t(
        maintenanceMode ? 'home:maintenanceTitle' : 'home:unsupportedTitle',
      )}
      okButtonTitle={isIOS ? i18n.t('ok') : i18n.t('exitAndOpenLink')}
      titleStyle={styles.modalTitle}
      type="close"
      onOkClose={() => onOkClose?.(maintenanceMode ? 'maintenance' : 'exit')}
      onRequestClose={() => BackHandler.exitApp()}
      visible={visible}>
      {maintenanceMode ? showMaintenanceMode() : showDevList()}
    </AppModal>
  );
};

export default memo(ExitModal);
