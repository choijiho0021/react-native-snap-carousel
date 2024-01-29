import {
  Dimensions,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {memo, useMemo} from 'react';
import {connect} from 'react-redux';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import utils from '@/redux/api/utils';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {CartModelState} from '@/redux/modules/cart';
import i18n from '@/utils/i18n';
import AppText from './AppText';
import {RootState} from '@/redux';
import {ProductModelState} from '@/redux/modules/product';
import {RkbProduct} from '@/redux/api/productApi';

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
  mrgBottom0: {
    marginBottom: 0,
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
  normalText16: {
    ...appStyles.normal16Text,
    fontWeight: 'normal',
    color: colors.black,
    fontSize: isDeviceSize('small') ? 14 : 16,
  },
  esimInfo: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    lineHeight: 20,
    width: width - 112,
  },
  esimInfoBold: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
    lineHeight: 20,
    width: width - 112,
  },
});

export type PaymentItemMode = 'method' | 'result';

const PaymentItem0 = ({
  style,
  title,
  value,
  valueStyle,
  mode,
  prod,
  qty,
}: {
  title: string;
  value: string;
  mode?: PaymentItemMode;
  style?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>;
  prod?: RkbProduct;
  qty: number;
}) => {
  console.log('@@@ prod', prod);

  return (
    <>
      <View style={style || styles.row} key="title">
        <AppText
          key="title"
          style={[appStyles.normal14Text, {color: colors.warmGrey}]}>
          {title}
        </AppText>
        <AppText key="qty">{`${qty} ${i18n.t('qty')}`}</AppText>
      </View>
      <View style={styles.row} key="amount">
        <AppText
          key="desc"
          style={[appStyles.normal14Text, {color: colors.warmGrey}]}>
          {prod?.field_description}
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
    </>
  );
};

export const PaymentItem = memo(PaymentItem0);

type PaymentItemInfoProps = {
  cart: CartModelState;
  product: ProductModelState;
  purchaseItems: PurchaseItem[];
  mode?: PaymentItemMode;
};

const PaymentItemInfo: React.FC<PaymentItemInfoProps> = ({
  cart,
  product,
  purchaseItems,
  mode = 'method',
}) => {
  const isRecharge = useMemo(
    () => purchaseItems.findIndex((item) => item.type === 'rch') >= 0,
    [purchaseItems],
  );

  const isImmediateOrder = useMemo(
    () =>
      cart.mainSubsId ||
      purchaseItems.findIndex((item) =>
        ['add_on_product', 'rch'].includes(item.type),
      ) >= 0,
    [cart.mainSubsId, purchaseItems],
  );

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
        {purchaseItems.map((item) => {
          const price =
            item.qty === undefined
              ? item.price
              : utils.toCurrency(
                  Math.round(item.price.value * item.qty * 100) / 100,
                  item.price.currency,
                );
          return (
            <PaymentItem
              key={item.key}
              title={item.title}
              valueStyle={[
                styles.normalText16,
                mode === 'result' && styles.colorWarmGrey,
              ]}
              qty={item.qty}
              value={utils.price(price)}
              prod={product.prodList.get(item.key)}
            />
          );
        })}
      </View>
    </View>
  );
};

export default connect(({cart, product}: RootState) => ({
  cart,
  product,
}))(memo(PaymentItemInfo));
