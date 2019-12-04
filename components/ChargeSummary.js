import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../constants/Colors';
import i18n from '../utils/i18n'
import LabelText from './LabelText';
import utils from '../utils/utils';

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

export default function ChargeSummary({totalCnt, totalPrice}) {
  const dlvCost = utils.dlvCost(totalPrice)

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

      <LabelText label={i18n.t('cart:totalCost')} style={styles.summary}
        format="price" color={colors.clearBlue}
        value={totalPrice + dlvCost}/>
    </View>
  )
}

