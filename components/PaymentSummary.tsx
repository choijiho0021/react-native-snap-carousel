import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {connect} from 'react-redux';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import {CartModelState} from '@/redux/modules/cart';
import i18n from '@/utils/i18n';
import {RootState} from '@/redux';
import {PaymentItem, PaymentItemMode} from './PaymentItemInfo';
import AppText from './AppText';

const styles = StyleSheet.create({
  // container: {
  //   justifyContent: 'space-between',
  //   width: '63%'
  // },
  row: {
    ...appStyles.itemRow,
    height: isDeviceSize('small') ? 30 : 36,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  total: {
    height: 52,
    paddingHorizontal: 20,
    borderTopColor: colors.black,
    borderTopWidth: 1,
    backgroundColor: colors.whiteTwo,
    alignItems: 'center',
  },
  resultTotal: {
    backgroundColor: colors.white,
    height: 60,
    marginTop: 20,
  },
  brdrBottom0: {
    borderBottomWidth: 0,
  },
  colorClearBlue: {
    color: colors.clearBlue,
  },
  priceInfo: {
    marginVertical: 11,
    marginHorizontal: 20,
  },
  normalText16: {
    ...appStyles.normal16Text,
    fontWeight: 'normal',
    color: colors.black,
    fontSize: isDeviceSize('small') ? 14 : 16,
  },
  boldText16: {
    ...appStyles.bold16Text,
    fontSize: isDeviceSize('small') ? 14 : 16,
  },
  boldText18: {
    ...appStyles.bold18Text,
    fontSize: isDeviceSize('small') ? 14 : 16,
  },
});

const PaymentSummary = ({
  cart,
  mode = 'method',
}: {
  cart: CartModelState;
  mode?: PaymentItemMode;
}) => {
  return (
    <View>
      <AppText style={styles.total}>{i18n.t('cart:pymAmount')}</AppText>
      <View style={styles.priceInfo}>
        {(['subtotal', 'discount', 'rkbcash'] as const).map((k) =>
          cart.pymReq?.[k] ? (
            <PaymentItem
              key={k}
              title={i18n.t(`pym:item:${k}`)}
              value={utils.price(cart.pymReq[k])}
              mode={mode}
            />
          ) : null,
        )}
      </View>

      <PaymentItem
        key="totalCost"
        style={[
          styles.row,
          styles.total,
          styles.brdrBottom0,
          mode === 'result' && styles.resultTotal,
        ]}
        titleStyle={mode === 'result' ? styles.boldText16 : styles.normalText16}
        title={`${i18n.t('cart:totalCost')} `}
        valueStyle={[
          mode === 'result' ? styles.boldText18 : styles.boldText16,
          styles.colorClearBlue,
        ]}
        value={utils.price(cart.pymPrice)}
      />
    </View>
  );
};

export default connect(({cart}: RootState) => ({
  cart,
}))(memo(PaymentSummary));
