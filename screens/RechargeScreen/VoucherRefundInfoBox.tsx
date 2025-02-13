import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';

import {utils} from '@/utils/utils';
import moment from 'moment';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  boxContainer: {
    width: '49%',
    backgroundColor: colors.backGrey,
    padding: 16,
  },
  titleText: {
    ...appStyles.bold14Text,
    lineHeight: 22,
    marginBottom: 6,
  },

  balanceView: {flexDirection: 'row', marginBottom: 2},
  balanceText: {
    ...appStyles.robotoBold18Text,
    color: colors.clearBlue,
    lineHeight: 24,
  },
  currencyText: {
    ...appStyles.bold18Text,
    color: colors.clearBlue,
    lineHeight: 24,
  },
  subText: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.warmGrey,
  },
  subBoldText: {
    ...appStyles.bold14Text,
    color: colors.warmGrey,
    lineHeight: 20,
  },
});

type VoucherRefundInfoBoxProps = {
  textColor?: string;
  title: string;
  amount: string;
  subText: string;
};

const VoucherRefundInfoBox: React.FC<VoucherRefundInfoBoxProps> = ({
  textColor = '',
  amount,
  title,
  subText,
}) => {
  return (
    <View style={styles.boxContainer}>
      <AppText style={styles.titleText}>{title}</AppText>
      <View style={styles.balanceView}>
        <AppText
          style={[styles.balanceText, textColor ? {color: textColor} : {}]}>
          {amount}
        </AppText>
        <AppText
          style={[styles.currencyText, textColor ? {color: textColor} : {}]}>
          {i18n.t('KRW')}
        </AppText>
      </View>
      <AppStyledText
        text={subText}
        textStyle={styles.subText}
        format={{
          b: styles.subBoldText,
        }}
      />
    </View>
  );
};

// export default memo(VoucherRefundInfoBox);

export default memo(VoucherRefundInfoBox);
