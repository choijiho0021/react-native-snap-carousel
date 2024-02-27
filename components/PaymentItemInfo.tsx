import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {connect} from 'react-redux';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import i18n from '@/utils/i18n';
import AppText from './AppText';
import {RootState} from '@/redux';
import {ProductModelState} from '@/redux/modules/product';
import {RkbProduct} from '@/redux/api/productApi';
import DropDownHeader from '@/screens/PymMethodScreen/DropDownHeader';
import ProductDetailList from '@/screens/CancelOrderScreen/component/ProductDetailList';

const styles = StyleSheet.create({
  title: {
    ...appStyles.bold18Text,
    marginTop: 20,
    marginBottom: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black,
  },
  row: {
    ...appStyles.itemRow,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
    marginTop: 14,
  },
  mrgBottom0: {
    marginBottom: 0,
  },
  productPriceInfo: {
    paddingVertical: isDeviceSize('small') ? 13 : 11,
    marginTop: isDeviceSize('small') ? 0 : 9,
    paddingHorizontal: 20,
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
});

export type PaymentItemMode = 'method' | 'result';

const PaymentItem0 = ({
  style,
  title,
  titleStyle,
  value,
  valueStyle,
  prod,
  qty,
}: {
  title: string;
  value: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>;
  prod?: RkbProduct;
  qty?: number;
}) => {
  const renderAmount = useCallback(
    () => (
      <AppText key="amount" style={valueStyle || styles.normalText16}>
        {value}
      </AppText>
    ),
    [value, valueStyle],
  );

  return (
    <>
      <View style={style || styles.row} key="title">
        <AppText
          key="title"
          style={
            titleStyle || [appStyles.semiBold14Text, {color: colors.warmGrey}]
          }>
          {title}
        </AppText>
        {qty ? (
          <AppText key="qty">{`${qty} ${i18n.t('qty')}`}</AppText>
        ) : (
          renderAmount()
        )}
      </View>
      {qty ? (
        <View style={styles.row} key="amount">
          <AppText
            key="desc"
            style={[appStyles.normal14Text, {color: colors.warmGrey}]}>
            {prod?.field_description}
          </AppText>
          <AppText key="amount" style={valueStyle || styles.normalText16}>
            {value}
          </AppText>
        </View>
      ) : null}
    </>
  );
};

export const PaymentItem = memo(PaymentItem0);

type PaymentItemInfoProps = {
  product: ProductModelState;
  purchaseItems: PurchaseItem[];
};

const PaymentItemInfo: React.FC<PaymentItemInfoProps> = ({
  product,
  purchaseItems,
}) => {
  // PaymentResultScreen에서 어떻게 보이나 확인 필요

  const isRecharge = useMemo(
    () => purchaseItems.findIndex((item) => item.type === 'rch') >= 0,
    [purchaseItems],
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
              valueStyle={styles.normalText16}
              qty={item.qty}
              value={utils.price(price)}
              prod={product.prodList.get(item.key)}
            />
          );
        })}
      </View>
    </View>
  );

  // const isRecharge = useMemo(
  //   () => purchaseItems.findIndex((item) => item.type === 'rch') >= 0,
  //   [purchaseItems],
  // );
  // return (
  //   <View>
  //     <AppText style={[styles.title, styles.mrgBottom0]}>
  //       {i18n.t('pym:title')}
  //     </AppText>
  //     {/*
  //       ex) 일본 상품 3일  x 1개
  //     */}
  //     <View
  //       style={[
  //         styles.productPriceInfo,
  //         !isRecharge && styles.borderBottomGrey,
  //       ]}>
  //       {purchaseItems.map((item) => {
  //         const price =
  //           item.qty === undefined
  //             ? item.price
  //             : utils.toCurrency(
  //                 Math.round(item.price.value * item.qty * 100) / 100,
  //                 item.price.currency,
  //               );
  //         return (
  //           <PaymentItem
  //             key={item.key}
  //             title={item.title}
  //             valueStyle={[
  //               styles.normalText16,
  //               mode === 'result' && styles.colorWarmGrey,
  //             ]}
  //             qty={item.qty}
  //             value={utils.price(price)}
  //             prod={product.prodList.get(item.key)}
  //           />
  //         );
  //       })}
  //     </View>
  //   </View>
  // );
};

export default connect(({product}: RootState) => ({product}))(
  memo(PaymentItemInfo),
);
