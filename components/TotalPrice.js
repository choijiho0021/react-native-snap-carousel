import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import utils from '../utils/utils'
import i18n from '../utils/i18n'
import { appStyles } from '../constants/Styles';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    marginTop: 20,
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%"
  },
  itemTitle: {
    fontSize: 16,
    width: "50%"
  },
  itemValue: {
    fontSize: 16,
    width: "50%",
    textAlign: "right"
  }
});

export default function TotalPrice({prod, sim}) {

  const sumOfProd = prod.cart.reduce((acc,item) => {
      const {price = 0} = prod.prodList.find(elm => elm.uuid == item.uuid) || {}
      return [
        acc[0] + item.qty,
        acc[1] + item.qty * price
      ]}, [0,0]),
    sumOfSim = sim.cart.reduce((acc,item) => {
      const {price =0, balance=0} = sim.simList.find(elm => elm.uuid == item.uuid) || {}
      console.log('sim cart',item, price, balance)
      return [
        acc[0] + item.qty,
        acc[1] + item.qty * price,
        acc[2] + item.qty * balance
      ]}, [0,0,0]),
    chargeFromBalance = sumOfProd[1] > 0 ? Math.min( sumOfProd[1], sumOfSim[2]) : 0,
    remainingBalance = sumOfSim[2] - chargeFromBalance,
    total = sumOfProd[1] + sumOfSim[1] - chargeFromBalance

  return (
    <View style={styles.container}>
      <View style={styles.total}>
        <Text style={styles.itemTitle}>{`${sumOfSim[0]} ${i18n.t('qty')} ${i18n.t('sim')}`}</Text>
        <Text style={styles.itemValue}>{utils.price(sumOfSim[1])}</Text>
      </View>
      <View style={styles.total}>
        <Text style={styles.itemTitle}>{`${sumOfProd[0]} ${i18n.t('qty')} ${i18n.t('product')}`}</Text>
        <Text style={styles.itemValue}>{utils.price(sumOfProd[1])}</Text>
      </View>
      {
        chargeFromBalance > 0 ?
          <View style={styles.total}>
            <Text style={styles.itemTitle}>{i18n.t('sim:deductFromBalance')}</Text>
            <Text style={styles.itemValue}>{utils.price(- chargeFromBalance)}</Text>
          </View> : null
      }
      <View style={[styles.total, {borderTopWidth:0.5, marginTop:10}]}>
        <Text style={styles.itemTitle}>{i18n.t('total')}</Text>
        <Text style={styles.itemValue}>{utils.price(total)}</Text>
      </View>
      {
        chargeFromBalance > 0 ?
          <View style={styles.total}>
            <Text style={styles.itemTitle}>{i18n.t('sim:remainingBalance')}</Text>
            <Text style={styles.itemValue}>{utils.price( remainingBalance)}</Text>
          </View> : null
      }
    </View>
  )
}

