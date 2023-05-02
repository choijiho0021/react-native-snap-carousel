import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';

const styles = StyleSheet.create({
  paymentBtnFrame: {
    height: 52,
    flexDirection: 'row',
  },
  paymentBtn: {
    height: 52,
    backgroundColor: colors.clearBlue,
    flex: 0.65,
  },
  amountFrame: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: '#d8d8d8',
  },
  amountText: {
    ...appStyles.normal16Text,
    lineHeight: 36,
    letterSpacing: 0.26,
  },
  amount: {
    ...appStyles.robotoBold16Text,
    lineHeight: 36,
    letterSpacing: 0.26,
    color: colors.black,
  },
  paymentBtnTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
});

const ButtonWithPrice = ({
  amount,
  currency,
  onPress,
}: {
  amount: string;
  currency: string;
  onPress: () => void;
}) => {
  return (
    <View style={styles.paymentBtnFrame}>
      <View style={styles.amountFrame}>
        <AppText style={styles.amountText}>
          {i18n.t('esim:charge:amount')}
          <AppText style={styles.amount}>{amount}</AppText>
          {currency}
        </AppText>
      </View>
      <AppButton
        style={styles.paymentBtn}
        type="primary"
        onPress={onPress}
        title={i18n.t('esim:charge:payment')}
        titleStyle={styles.paymentBtnTitle}
      />
    </View>
  );
};

export default memo(ButtonWithPrice);
