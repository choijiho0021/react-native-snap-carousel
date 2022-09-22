import React, {memo, useCallback, useEffect, useState} from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import AppModal from '@/components/AppModal';
import AppIcon from '@/components/AppIcon';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import AppSvgIcon from '@/components/AppSvgIcon';
import {navigate} from '@/navigation/navigation';
import {MAX_WIDTH} from '@/constants/SliderEntry.style';
import {RkbSubscription} from '@/redux/api/subscriptionApi';

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.white,
  },
  btn: {
    height: 62,
    flex: 1,
  },
  btnTitle: {
    color: colors.warmGrey,
  },
  btn2: {
    position: 'absolute',
    width: 112,
    height: 40,
    borderRadius: 20,
    top: 168,
    left: 20,
    backgroundColor: '#00245a',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  closeBtn: {
    height: 45,
    backgroundColor: colors.gray,
    width: '49%',
  },
  closeBtnTitle: {
    ...appStyles.medium18,
    color: colors.black,
    textAlign: 'center',
    width: '100%',
  },
  chargeBtn: {
    height: 45,
    backgroundColor: colors.clearBlue,
    width: '49%',
  },
  chargeBtnTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
});
type ChargeModalProps = {
  visible: boolean;
  onOkClose?: () => void;
  item: RkbSubscription;
};
const ChargeModal: React.FC<ChargeModalProps> = ({
  visible,
  onOkClose,
  item,
}) => {
  const navigation = useNavigation();
  const renderBottom = useCallback(
    () => (
      <View style={styles.bottom}>
        <AppButton
          style={styles.closeBtn}
          type="primary"
          onPress={onOkClose}
          title={i18n.t('close')}
          titleStyle={styles.closeBtnTitle}
        />
        <AppButton
          style={styles.chargeBtn}
          type="primary"
          onPress={() => navigation.navigate('Charge', {item})}
          title={i18n.t('esim:charge')}
          titleStyle={styles.chargeBtnTitle}
        />
      </View>
    ),
    [item, navigation, onOkClose],
  );

  return (
    <AppModal
      justifyContent="flex-end"
      contentStyle={{
        marginHorizontal: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
      bottom={renderBottom}
      visible={visible}>
      <View>
        <AppText>{i18n.t('esim:charge')}</AppText>
        <AppText>{i18n.t('esim:chargeModal:body1')}</AppText>
        <AppText>{i18n.t('esim:chargeModal:body2')}</AppText>
        <AppText>{i18n.t('esim:chargeModal:body3')}</AppText>
      </View>
    </AppModal>
  );
};

export default memo(ChargeModal);
