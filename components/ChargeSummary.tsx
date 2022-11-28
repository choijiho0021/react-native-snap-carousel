import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {Currency} from '@/redux/api/productApi';
import LabelText from './LabelText';
import utils from '../redux/api/utils';

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 32,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
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
  balance = 0,
  totalPrice,
}: {
  totalCnt: number;
  totalPrice: Currency;
  balance?: number;
}) => {
  // 상품가격 + 배송비
  const amount = totalPrice.value;
  // 잔액 차감
  const deduct = totalCnt > 0 ? (amount > balance ? balance : amount) : 0;
  // 계산해야하는 총액
  const pymPrice = amount > balance ? amount - balance : 0;

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

      <LabelText
        label={i18n.t('cart:deductBalance')}
        style={styles.summary}
        format="price"
        value={utils.toCurrency(balance, totalPrice.currency)}
        deduct={deduct}
        balanceStyle={appStyles.bold22Text}
        currencyStyle={appStyles.medium14}
      />

      <LabelText
        label={i18n.t('cart:totalCost')}
        style={styles.summary}
        format="price"
        color={colors.clearBlue}
        value={utils.toCurrency(pymPrice, totalPrice.currency)}
        balanceStyle={appStyles.bold22Text}
        currencyStyle={appStyles.medium14}
      />
    </View>
  );
};

export default memo(ChargeSummary);
