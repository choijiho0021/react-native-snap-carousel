import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
// import Flag from 'react-native-flags';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import AppText from './AppText';
import InputNumber from './InputNumber';

const styles = StyleSheet.create({
  list: {
    ...appStyles.itemRow,
    paddingVertical: 5,
  },
  flag: {
    marginLeft: 5,
    paddingVertical: 20,
    width: '10%',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemTitle: {
    fontSize: 16,
    padding: 5,
    width: '60%',
  },
  itemValue: {
    fontSize: 16,
    padding: 5,
    textAlign: 'right',
    width: '40%',
  },
  desc: {
    justifyContent: 'flex-start',
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

function RoamingProduct({item, startDate, qty, onChange}) {
  return (
    <View style={[appStyles.container, {borderBottomWidth: 0.5}]}>
      <View style={styles.itemRow}>
        <AppText style={styles.itemTitle}>{item.name}</AppText>
        <AppText style={styles.itemValue}>{`${i18n.t(
          'sim:price',
        )}: ${utils.price(item.price)}`}</AppText>
      </View>
      <View style={styles.itemRow}>
        {/* <Flag style={styles.flag} code={item.ccode} size={48} /> */}
        <AppText style={styles.desc}>{`${i18n.t(
          'store:startDate',
        )} : ${startDate}`}</AppText>
        <View style={[styles.itemValue, {alignItems: 'flex-end'}]}>
          <InputNumber
            value={qty}
            onChange={onChange}
            minValue={0}
            maxValue={9}
          />
        </View>
      </View>
    </View>
  );
}

export default memo(RoamingProduct);
