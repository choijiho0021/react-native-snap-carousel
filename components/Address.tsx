import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../constants/Colors';
import {isDeviceSize} from '../constants/SliderEntry.style';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import AppText from './AppText';
import {isAndroid} from './SearchBarAnimation/utils';

const styles = StyleSheet.create({
  zip: {
    width: '10%',
    padding: 5,
  },
  addr: {
    marginVertical: 15,
  },
  addrValue: {
    ...appStyles.normal14Text,
    fontSize: isDeviceSize('small') ? 12 : 14,
    color: colors.warmGrey,
    lineHeight: isDeviceSize('small') ? 20 : 24,
    letterSpacing: 0.23,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 3,
  },
  bdTitle: {
    ...appStyles.bold14Text,
    fontSize: isDeviceSize('small') ? 12 : 14,
    lineHeight: 24,
    letterSpacing: 0.23,
  },
  roadText: {
    fontSize: isDeviceSize('small') ? 10 : 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: colors.warmGrey,
    textAlign: 'center',
  },
  roadBox: {
    width: isAndroid() ? 55 : isDeviceSize('small') ? 40 : 50,
    height: isAndroid() ? 25 : 20,
    marginRight: 10,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    justifyContent: 'center',
  },
});

const Address = ({item}) => {
  return (
    <View style={styles.itemRow}>
      <View style={styles.addr}>
        <AppText style={[styles.bdTitle, styles.itemRow]}>{item.bdNm}</AppText>
        <View style={styles.itemRow}>
          <AppText style={styles.addrValue}>{item.jibunAddr}</AppText>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.roadBox}>
            <AppText style={styles.roadText}>{i18n.t('addr:road')}</AppText>
          </View>
          <View style={{maxWidth: '83%'}}>
            <AppText
              style={[
                styles.addrValue,
                {flexDirection: 'row', flexWrap: 'wrap'},
              ]}>
              {item.roadAddr}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(Address);
