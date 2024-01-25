import React, {memo, useCallback} from 'react';
import {Image, Platform, Pressable, StyleSheet, View} from 'react-native';
import AppModal from '@/components/AppModal';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';
import {API} from '@/redux/api';
import AppButton from '@/components/AppButton';

const styles = StyleSheet.create({
  content: {
    marginHorizontal: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '100%',
    height: '100%',
    // backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    alignSelf: 'center',
  },
  osTxt: {
    ...appStyles.bold14Text,
    color: colors.warmGrey,
    lineHeight: 22,
  },
  backGrey: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.backGrey,
  },
  boTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
  boContainer: {
    height: 92,
    padding: 20,
    backgroundColor: colors.white,
  },
});
type HtQrModalProps = {
  visible: boolean;
  onOkClose: () => void;
};

const HtQrModal: React.FC<HtQrModalProps> = ({visible, onOkClose}) => {
  const bottom = useCallback(
    () => (
      <View style={styles.boContainer}>
        <AppButton
          style={{
            height: 52,
            backgroundColor: colors.clearBlue,
          }}
          type="primary"
          onPress={onOkClose}
          title={i18n.t('ok')}
          titleStyle={styles.boTitle}
        />
      </View>
    ),
    [],
  );

  return (
    <AppModal
      justifyContent="flex-end"
      type="close"
      contentStyle={styles.content}
      titleViewStyle={{padding: 20}}
      onOkClose={() => {
        onOkClose();
      }}
      onCancelClose={() => {
        onOkClose();
      }}
      bottom={bottom}
      visible={visible}>
      <Pressable onPress={() => onOkClose()} style={{flex: 1}} />
      <View style={{backgroundColor: colors.white}}>
        <View style={styles.header}>
          <AppSvgIcon
            onPress={() => {
              onOkClose();
            }}
            name="triangleCaution"
          />
          <AppText style={{...appStyles.bold18Text, marginLeft: 6}}>
            {i18n.t('esim:howToCall:moveToQr')}
          </AppText>
        </View>
        <View style={{margin: 20}}>
          <AppStyledText
            text={i18n.t(`esim:howToCall:moveToQr:txt`)}
            textStyle={[appStyles.bold16Text, {lineHeight: 24}]}
            format={{
              b: {color: colors.clearBlue},
            }}
          />
          <View style={styles.qrContainer}>
            <Image
              style={{width: 126, height: 126}}
              source={{
                uri: API.default.httpImageUrl(
                  'sites/default/files/img/mail/ht-qr.png',
                ),
              }}
            />
          </View>

          <View style={styles.backGrey}>
            <AppText style={{...appStyles.bold14Text, color: colors.darkBlue}}>
              {i18n.t(`${Platform.OS}`)}
            </AppText>
            <AppText style={styles.osTxt}>
              {i18n.t(`esim:howToCall:moveToQr:txt:${Platform.OS}`)}
            </AppText>
          </View>
        </View>
      </View>
    </AppModal>
  );
};

export default memo(HtQrModal);
