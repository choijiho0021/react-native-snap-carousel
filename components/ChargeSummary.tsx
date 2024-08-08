import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {Currency} from '@/redux/api/productApi';
import LabelText from './LabelText';
import AppText from './AppText';

const styles = StyleSheet.create({
  price: {
    marginHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: colors.black,
  },
  summary: {
    height: 36,
  },
  priceTxt: {
    ...appStyles.bold22Text,
    textAlignVertical: 'center',
    height: 36,
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
        style={styles.summary}
        labelStyle={{...appStyles.bold14Text, color: colors.warmGrey}}
        valueStyle={{...appStyles.normal16Text, color: colors.black}}
        value={i18n.t('cart:totalCntX').replace('%%', totalCnt.toString())}
      />
      <LabelText
        label={i18n.t('cart:totalPrice')}
        style={styles.summary}
        format="price"
        labelStyle={{...appStyles.bold14Text, color: colors.warmGrey}}
        value={totalPrice}
        color={colors.clearBlue}
        balanceStyle={styles.priceTxt}
        currencyStyle={styles.priceTxt}
      />
      <View style={{flexDirection: 'row'}}>
        <AppText
          style={{
            ...appStyles.medium14,
            color: colors.warmGrey,
            marginTop: 12,
          }}>
          {i18n.t('middleDot')}
        </AppText>
        <AppText
          style={{
            ...appStyles.medium14,
            color: colors.warmGrey,
            marginTop: 12,
          }}>
          {i18n.t('cart:notice')}
        </AppText>
      </View>
    </View>
  );
};

export default memo(ChargeSummary);
