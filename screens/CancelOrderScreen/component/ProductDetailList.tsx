import React, {Fragment, memo, useCallback, useEffect, useMemo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '@/constants/Colors';
import ProductDetailInfo from './ProductDetailInfo';
import {ProdInfo} from '@/redux/api/productApi';
import {RkbOrderItem} from '@/redux/api/cartApi';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {ProductModelState} from '@/redux/modules/product';
import {utils} from '@/utils/utils';
import {OrderItemType} from '@/redux/api/orderApi';

const styles = StyleSheet.create({
  cancelItem: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    marginBottom: 8,
    borderColor: colors.whiteFive,
  },
});

type ProductDetailListPros = {
  orderItems: RkbOrderItem[] | PurchaseItem[] | OrderItemType[];
  style: StyleProp<ViewStyle>;
  listTitle?: string;
  showPriceInfo?: boolean;
  product: ProductModelState;
};

const ProductDetailList: React.FC<ProductDetailListPros> = ({
  orderItems,
  listTitle,
  style,
  showPriceInfo,
  product,
}) => {
  const prodList = useMemo(() => {
    if (!orderItems) return [];

    console.log('@@@@ purchaseItem length : ', orderItems.length);

    return orderItems.map((item) => {
      const price =
        item.qty === undefined
          ? item.price
          : utils.toCurrency(
              Math.round((item?.price?.value || item.price) * item.qty * 100) /
                100,
              item?.price?.currency || 'KRW',
            );
      const prod = product.prodList.get(item?.key || item?.uuid);

      if (prod)
        return {
          title: prod.name,
          field_description: prod.field_description,
          promoFlag: prod.promoFlag,
          qty: item.qty,
          price,
        };

      return null;
    });
  }, [orderItems, product.prodList]);

  const renderItem = useCallback(
    ({
      item,
      isLast,
      indexParam,
    }: {
      item: ProdInfo;
      isLast?: boolean;
      indexParam: number;
    }) => {
      return (
        <Fragment key={`${item?.title}_${listTitle}_${indexParam}`}>
          {showPriceInfo ? (
            <ProductDetailInfo
              key={`${item?.title}_${indexParam}_${listTitle}`}
              showPriceInfo={showPriceInfo}
              item={item}
              style={[
                styles.cancelItem,
                isLast && {
                  marginBottom: 0,
                  borderBottomWidth: 0,
                },
              ]}
            />
          ) : (
            Array.from({length: item?.qty}, (_, index) => {
              return (
                <ProductDetailInfo
                  key={`${item?.title}_${index}_${listTitle}`}
                  showPriceInfo={showPriceInfo}
                  item={item}
                  style={[
                    styles.cancelItem,
                    isLast &&
                      index === item?.qty - 1 && {
                        marginBottom: 0,
                        borderBottomWidth: 0,
                      },
                  ]}
                />
              );
            })
          )}
        </Fragment>
      );
    },
    [listTitle, showPriceInfo],
  );

  return (
    <View key="cancelList" style={[{justifyContent: 'center'}, style]}>
      {prodList.map((r, index) => {
        return renderItem({
          item: r,
          isLast: index === orderItems.length - 1,
          indexParam: index,
        });
      })}
    </View>
  );
};

export default memo(ProductDetailList);
