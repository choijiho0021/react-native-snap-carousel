import {
  Dimensions,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {memo} from 'react';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {Currency} from '@/redux/api/productApi';
import utils from '@/redux/api/utils';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {PaymentReq} from '@/redux/modules/cart';
import i18n from '@/utils/i18n';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';
import AppText from './AppText';

const {width} = Dimensions.get('window');

const {esimApp} = Env.get();
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
    color: colors.redError,
    lineHeight: 20,
    width: width - 72,
  },
  esimInfoBold: {
    ...appStyles.bold14Text,
    color: colors.redError,
    lineHeight: 20,
    width: width - 72,
  },
});

type PaymentItemMode = 'method' | 'result';

const PaymentItem0 = ({
  style,
  title,
  titleStyle,
  value,
  valueStyle,
  mode,
}: {
  title: string;
  value: string;
  mode?: PaymentItemMode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}) => {
  return (
    <View style={style || styles.row} key={title}>
      <AppText
        key="title"
        style={
          titleStyle || [appStyles.normal14Text, {color: colors.warmGrey}]
        }>
        {title}
      </AppText>
      <AppText
        key="amount"
        style={
          valueStyle || [
            styles.normalText16,
            mode === 'result' && styles.colorWarmGrey,
          ]
        }>
        {value}
      </AppText>
    </View>
  );
};
const PaymentItem = memo(PaymentItem0);

const PaymentItemInfo = ({
  cart,
  pymReq = [],
  deduct,
  pymPrice,
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
  mode?: PaymentItemMode;
}) => {
  return (
    <View>
      <AppText style={[styles.title, styles.mrgBottom0]}>
        {i18n.t('pym:title')}
      </AppText>
      {/*
        상품별 가격
        ex) 일본 상품 3일  x 1개   
      */}
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
                    Math.round(item.price.value * item.qty * 100) / 100,
                    item.price.currency,
                  ),
                ];
          return (
            <PaymentItem
              key={item.key}
              titleStyle={styles.productPriceTitle}
              title={item.title + qty}
              valueStyle={[
                styles.normalText16,
                mode === 'result' && styles.colorWarmGrey,
              ]}
              value={utils.price(price)}
            />
          );
        })}
      </View>

      {!isRecharge && (
        <View style={styles.priceInfo}>
          {pymReq.map((item) => (
            <PaymentItem
              key={item.key}
              title={item.title}
              value={utils.price(item.amount)}
              mode={mode}
            />
          ))}
          <PaymentItem
            key="deductBalance"
            title={i18n.t('cart:deductBalance')}
            value={`- ${utils.price(deduct)}`}
            mode={mode}
          />
        </View>
      )}

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
        value={utils.price(pymPrice)}
      />
      {mode !== 'result' && esimApp && (
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginTop: 20,
          }}>
          <AppSvgIcon
            name="cautionIcon"
            style={{
              marginRight: 8,
              justifyContent: 'center',
            }}
          />
          <AppStyledText
            text={i18n.t('pym:esimInfo')}
            textStyle={styles.esimInfo}
            format={{b: styles.esimInfoBold}}
          />
        </View>
      )}
      <View
        style={[styles.divider, screen === 'PaymentResult' && {marginTop: 0}]}
      />
    </View>
  );
};

export default memo(PaymentItemInfo);
