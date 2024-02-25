import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {Currency} from '@/redux/api/productApi';
import LabelText from './LabelText';

const styles = StyleSheet.create({
  price: {
    marginHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.black,
  },
  summary: {
    height: 36,
  },
  summaryTop: {
    marginTop: 17,
  },
});

const ChargeSummary = ({
  totalCnt = 0,
  totalPrice,
}: {
  totalCnt: number;
  totalPrice: Currency;
}) => {
  return (
    <View style={styles.price}>
      <LabelText
        label={i18n.t('cart:totalCnt')}
        style={[styles.summary, styles.summaryTop]}
        valueStyle={{...appStyles.normal14Text, color: colors.black}}
        value={i18n.t('cart:totalCntX').replace('%%', totalCnt.toString())}
      />
      <LabelText
        label={i18n.t('cart:totalPrice')}
        style={styles.summary}
        format="price"
        value={totalPrice}
        balanceStyle={appStyles.bold22Text}
        currencyStyle={appStyles.medium14}
      />
    </View>
  );
};

export default memo(ChargeSummary);
