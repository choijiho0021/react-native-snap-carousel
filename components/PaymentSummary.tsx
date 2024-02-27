import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import {PaymentReq} from '@/redux/modules/cart';
import i18n from '@/utils/i18n';
import {PaymentItem} from './PaymentItemInfo';
import DropDownHeader from '@/screens/PymMethodScreen/DropDownHeader';
import {Currency} from '@/redux/api/productApi';

const styles = StyleSheet.create({
  row: {
    ...appStyles.itemRow,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  total: {
    marginHorizontal: 20,
    paddingTop: 24,
    borderTopColor: colors.lightGrey,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  priceInfo: {
    marginTop: 11,
    marginBottom: 25,
    marginHorizontal: 20,
  },
});

const PaymentSummary = ({data, total}: {data: PaymentReq; total: Currency}) => {
  return (
    <DropDownHeader
      title={i18n.t('cart:pymAmount')}
      summary={utils.price(total)}>
      <View style={styles.priceInfo}>
        {(['subtotal', 'discount', 'rkbcash'] as const).map((k) => (
          <PaymentItem
            key={k}
            title={i18n.t(`pym:item:${k}`)}
            value={utils.price(
              utils.toCurrency(
                (data[k]?.value || 0) * (k === 'rkbcash' ? -1 : 1),
              ),
            )}
            valueStyle={
              k === 'subtotal'
                ? {...appStyles.robotoBold16Text, color: colors.black}
                : appStyles.roboto16Text
            }
          />
        ))}
      </View>

      <PaymentItem
        key="totalCost"
        style={[styles.row, styles.total]}
        titleStyle={appStyles.bold16Text}
        title={`${i18n.t('cart:totalCost')} `}
        valueStyle={{...appStyles.robotoBold22Text, color: colors.clearBlue}}
        value={utils.price(total)}
      />
    </DropDownHeader>
  );
};

export default memo(PaymentSummary);
