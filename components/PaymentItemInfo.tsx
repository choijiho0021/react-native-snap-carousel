import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import _ from 'underscore';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {PaymentReq} from '@/redux/modules/cart';
import {Currency} from '@/redux/api/productApi';

const styles = StyleSheet.create({
  // container: {
  //   justifyContent: 'space-between',
  //   width: '63%'
  // },
  title: {
    ...appStyles.bold18Text,
    // fontFamily: "AppleSDGothicNeo",
    marginTop: 20,
    marginBottom: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black,
  },
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
  mrgBottom0: {
    marginBottom: 0,
  },
  brdrBottom0: {
    borderBottomWidth: 0,
  },
  colorClearBlue: {
    color: colors.clearBlue,
  },
  colorWarmGrey: {
    color: colors.warmGrey,
  },
  colorBlack: {
    color: colors.black,
  },
  productPriceInfo: {
    paddingVertical: isDeviceSize('small') ? 13 : 11,
    marginTop: isDeviceSize('small') ? 0 : 9,
    marginHorizontal: 20,
  },
  borderBottomGrey: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
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
  productPriceTitle: {
    ...appStyles.normal16Text,
    lineHeight: 36,
    letterSpacing: 0.26,
    fontWeight: 'normal',
    fontSize: isDeviceSize('small') ? 14 : 16,
    maxWidth: '70%',
    // flexDirection: 'row',
    // flexWrap: 'wrap'
  },
  divider: {
    marginTop: 30,
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  esimInfo: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginHorizontal: 20,
    marginTop: 20,
    lineHeight: 20,
  },
});

const PaymentItemInfo = ({
  cart,
  pymReq = [],
  deduct = 0,
  pymPrice = 0,
  isRecharge,
  screen,
  mode = 'method',
}: {
  cart: PurchaseItem[];
  pymReq?: PaymentReq[];
  deduct?: Currency;
  pymPrice?: Currency;
  isRecharge?: boolean;
  screen?: string;
  mode?: 'method' | 'result';
}) => {
  return (
    <View>
      <Text style={[styles.title, styles.mrgBottom0]}>
        {i18n.t('pym:title')}
      </Text>
      <View
        style={[
          styles.productPriceInfo,
          !isRecharge && styles.borderBottomGrey,
        ]}>
        {cart.map((item) => {
          const [qty, price] =
            item.qty === undefined
              ? ['', item.price]
              : [
                  ` × ${item.qty}`,
                  utils.toCurrency(
                    item.price.value * item.qty,
                    item.price.currency,
                  ),
                ];
          return (
            <View style={styles.row} key={item.key}>
              {/* <View style={{maxWidth: '70%'}}> */}
              <Text key="title" style={styles.productPriceTitle}>
                {item.title + qty}
              </Text>
              {/* </View> */}
              <Text
                key="price"
                style={[
                  styles.normalText16,
                  mode === 'result' && styles.colorWarmGrey,
                ]}>
                {utils.price(price)}
              </Text>
            </View>
          );
        })}
      </View>

      {!isRecharge && (
        <View style={styles.priceInfo}>
          {pymReq.map((item) => (
            <View style={styles.row} key={item.title}>
              <Text
                key="title"
                style={[appStyles.normal14Text, {color: colors.warmGrey}]}>
                {item.title}
              </Text>
              <Text
                key="amount"
                style={[
                  styles.normalText16,
                  mode === 'result' && styles.colorWarmGrey,
                ]}>
                {utils.price(item.amount)}
              </Text>
            </View>
          ))}
          <View style={styles.row} key="balance">
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Text
                key="title"
                style={[appStyles.normal14Text, {color: colors.warmGrey}]}>
                {i18n.t('cart:deductBalance')}
              </Text>
              {/* {
                  screen != 'PaymentResult' &&
                  <Text key="currentBal" style={[styles.normal14WarmGrey, {marginLeft: 18}]}>{`(${i18n.t('cart:currentBalance')}:${utils.numberToCommaString(balance) + ' ' + i18n.t('won')}) `}</Text>
                } */}
            </View>
            <Text
              key="amount"
              style={[
                styles.normalText16,
                mode === 'result' && styles.colorWarmGrey,
              ]}>{`- ${utils.price(deduct)}`}</Text>
          </View>
        </View>
      )}

      <View
        style={[
          styles.row,
          styles.total,
          styles.brdrBottom0,
          mode === 'result' && styles.resultTotal,
        ]}>
        <Text
          style={mode === 'result' ? styles.boldText16 : styles.normalText16}>
          {i18n.t('cart:totalCost')}{' '}
        </Text>
        <Text
          style={[
            mode === 'result' ? styles.boldText18 : styles.boldText16,
            styles.colorClearBlue,
          ]}>
          {utils.price(pymPrice)}
        </Text>
      </View>
      {mode !== 'result' && (
        <Text style={styles.esimInfo}>{i18n.t('pym:esimInfo')}</Text>
      )}
      <View
        style={[styles.divider, screen === 'PaymentResult' && {marginTop: 0}]}
      />
    </View>
  );
};

export default memo(PaymentItemInfo);
