import {StyleSheet, View} from 'react-native';
import React, {memo, useMemo} from 'react';
import {connect} from 'react-redux';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import {CartModelState} from '@/redux/modules/cart';
import i18n from '@/utils/i18n';
import {RootState} from '@/redux';
import {PaymentItem, PaymentItemMode} from './PaymentItemInfo';
import DropDownHeader from '@/screens/PymMethodScreen/DropDownHeader';

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

const PaymentSummary = ({
  cart,
  mode = 'method',
}: {
  cart: CartModelState;
  mode?: PaymentItemMode;
}) => {
  const a = useMemo(
    () =>
      (['subtotal', 'discount', 'rkbcash'] as const).map(
        (k) => cart.pymReq?.[k]?.value,
      ),
    [cart.pymReq],
  );

  return (
    <DropDownHeader
      title={i18n.t('cart:pymAmount')}
      summary={utils.price(cart.pymPrice)}>
      <View style={styles.priceInfo}>
        {(['subtotal', 'discount', 'rkbcash'] as const).map((k) => (
          <PaymentItem
            key={k}
            title={i18n.t(`pym:item:${k}`)}
            value={utils.price(
              utils.toCurrency(
                (cart.pymReq?.[k]?.value || 0) * (k === 'rkbcash' ? -1 : 1),
              ),
            )}
            valueStyle={appStyles.roboto16Text}
            mode={mode}
          />
        ))}
      </View>

      <PaymentItem
        key="totalCost"
        style={[styles.row, styles.total]}
        titleStyle={appStyles.bold16Text}
        title={`${i18n.t('cart:totalCost')} `}
        valueStyle={{...appStyles.robotoBold22Text, color: colors.clearBlue}}
        value={utils.price(cart.pymPrice)}
      />
    </DropDownHeader>
  );
};

export default connect(({cart}: RootState) => ({
  cart,
}))(memo(PaymentSummary));
