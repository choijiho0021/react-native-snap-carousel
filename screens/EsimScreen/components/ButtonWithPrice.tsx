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
    flex: 1,
    // flex: 0.65,
    backgroundColor: colors.clearBlue,
  },
  amountFrame: {
    // flex: 0.35,
    minWidth: 144,
    alignItems: 'center',
    paddingHorizontal: 20,
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
  title,
  onPress,
  disable = false,
}: {
  amount: string;
  currency: string;
  title?: string;
  onPress: () => void;
  disable?: boolean;
}) => {
  return (
    <View style={styles.paymentBtnFrame}>
      <View style={styles.amountFrame}>
        <AppText style={styles.amountText}>
          {i18n.t('esim:charge:amount')}
          <AppText style={styles.amount}>
            {amount.includes(',')
              ? amount
              : amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </AppText>
          {currency}
        </AppText>
      </View>
      <AppButton
        style={[
          styles.paymentBtn,
          {backgroundColor: disable ? colors.line : colors.clearBlue},
        ]}
        disabled={disable}
        type="primary"
        onPress={onPress}
        title={title || i18n.t('esim:charge:payment')}
        titleStyle={[
          styles.paymentBtnTitle,
          {color: disable ? colors.greyish : colors.white},
        ]}
        disableStyle={{backgroundColor: colors.line}}
        pressedStyle={{
          backgroundColor: disable ? colors.line : colors.dodgerBlue,
        }}
      />
    </View>
  );
};

export default memo(ButtonWithPrice);
