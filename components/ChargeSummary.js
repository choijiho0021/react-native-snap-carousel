import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../constants/Colors';
import i18n from '../utils/i18n'
import LabelText from './LabelText';

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
    borderTopWidth: 1,
    borderTopColor: colors.black
  },
  summary: {
    height: 36
  },
});

class ChargeSummary extends PureComponent {
  render() {
    const {totalCnt, totalPrice, simBalance, balance, dlvCost} = this.props
    // 구매하는 데이터 금액
    const data = totalPrice - simBalance

    const dataPriceToPay = balance < data ? (simBalance + balance < data ? data - (simBalance + balance) : 0) : 0
    const pymPrice = simBalance + dlvCost + dataPriceToPay

    return (
      <View style={styles.price}>
        <LabelText label={i18n.t('cart:dlvCostNotice')} style={{marginVertical:17}}/>

        <LabelText label={i18n.t('cart:totalCnt')} style={styles.summary}
          value={i18n.t('cart:totalCntX').replace('%%', totalCnt)}/>

        <LabelText label={i18n.t('cart:totalPrice')} style={styles.summary}
          format="price"
          value={totalPrice}/>

        <LabelText label={i18n.t('cart:dlvCost')} style={styles.summary}
          format="price"
          value={dlvCost} />

        <LabelText label={i18n.t('cart:totalBalance')} style={styles.summary}
          format="price"
          value={balance + simBalance}/>          

        <LabelText label={i18n.t('cart:totalCost')} style={styles.summary}
          format="price" color={colors.clearBlue}
          value={ pymPrice }/>
      </View>
    )
  }
}
export default ChargeSummary