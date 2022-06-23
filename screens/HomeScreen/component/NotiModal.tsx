import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, {memo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import AppUserPic from '@/components/AppUserPic';
import {appStyles} from '@/constants/Styles';
import {RkbPromotion} from '@/redux/api/promotionApi';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {isDeviceSize, windowWidth} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  infoModalTitle: {
    ...appStyles.normal20Text,
    marginHorizontal: 20,
  },
  popupImg: {
    width: windowWidth - 40,
    height: isDeviceSize('medium') ? 446 : 500,
    marginBottom: 20,
  },
});

type NotiModalProps = {
  onOkClose?: () => void;
  onCancelClose?: () => void;
  visible: boolean;
  closeType?: 'redirect' | 'close' | 'exit';
  popUp?: RkbPromotion;
};
const NotiModal: React.FC<NotiModalProps> = ({
  popUp,
  closeType,
  visible,
  onOkClose,
  onCancelClose,
}) => {
  const [checked, setChecked] = useState(false);

  return (
    <AppModal
      // titleStyle={styles.infoModalTitle}
      // title={popUp?.title}
      contentStyle={{
        paddingTop: 0,
        marginTop: 0,
        marginHorizontal: 20,
        backgroundColor: colors.white,
      }}
      // titleViewStyle={{marginTop: 0}}
      closeButtonTitle={i18n.t(closeType || 'close')}
      type={closeType === 'redirect' ? closeType : 'close'}
      closeButtonStyle={
        closeType === 'redirect' ? {flex: 1, margin: 20} : {margin: 20}
      }
      onOkClose={() => {
        onOkClose?.();
        if (checked)
          AsyncStorage.setItem(
            'popupDisabled',
            moment().format('YYYY-MM-DD HH:mm'),
          );
      }}
      onCancelClose={() => {
        onCancelClose?.();
        if (checked)
          AsyncStorage.setItem(
            'popupDisabled',
            moment().format('YYYY-MM-DD HH:mm'),
          );
      }}
      visible={visible}>
      <View style={{marginHorizontal: 20}}>
        <AppUserPic
          url={popUp?.notice?.image?.noti}
          style={styles.popupImg}
          resizeMode="cover"
          onPress={() => {
            if (closeType === 'redirect') {
              onOkClose?.();
            }
          }}
        />
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => setChecked((prev) => !prev)}>
          <AppButton
            iconName="btnCheck"
            style={{marginRight: 10}}
            checked={checked}
            onPress={() => setChecked((prev) => !prev)}
          />
          <AppText>{i18n.t('close:week')}</AppText>
        </Pressable>
      </View>
    </AppModal>
  );
};

export default memo(NotiModal);
