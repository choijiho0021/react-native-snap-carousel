import React, {Fragment, useCallback, useMemo, useRef} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '@/constants/Colors';
import ProductDetailInfo from './ProductDetailInfo';
import {ProdInfo} from '@/redux/api/productApi';
import {RkbOrderItem} from '@/redux/api/cartApi';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {utils} from '@/utils/utils';
import {OrderItemType} from '@/redux/api/orderApi';

import {
  actions as productActions,
  ProductModelState,
} from '@/redux/modules/product';

import {bindActionCreators, RootState} from 'redux';
import {connect} from 'react-redux';

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
  action,
}) => {
  const loading = useRef(false);

  // 함수로 묶기
  const getProdDate = useCallback(() => {
    if (!loading.current && (orderItems?.length || 0) > 0) {
      orderItems.forEach((i) => {
        if (!product.prodList.has(i?.key || i?.uuid)) {
          // 해당 Uuid로 없다면 서버에서 가져온다.
          action.product.getProdByUuid(i?.key || i?.uuid);
          loading.current = true;
        }
      });
    }
  }, [action.product, orderItems, product.prodList]);

  const prodList = useMemo(() => {
    if (!orderItems) return [];

    getProdDate();

    const prods = orderItems
      .map((item) => {
        const price =
          item.qty === undefined
            ? item.price
            : utils.toCurrency(
                Math.round(
                  (item?.price?.value || item.price) * item.qty * 100,
                ) / 100,
                item?.price?.currency || 'KRW',
              );
        const prod = product.prodList.get(item?.key || item?.uuid);

        if (prod)
          return {
            title: prod.name,
            field_description: prod?.field_description,
            promoFlag: prod.promoFlag,
            qty: item.qty,
            price,
          };

        return null;
      })
      .filter((r) => r !== null);

    const isNeedUpdate = prods.some((item) => item === null);

    if (isNeedUpdate) getProdDate();
    return prods;
  }, [getProdDate, orderItems, product.prodList]);

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
      {prodList?.length > 0 &&
        prodList.map((r, index) => {
          return renderItem({
            item: r,
            isLast: index === orderItems.length - 1,
            indexParam: index,
          });
        })}
    </View>
  );
};

// export default memo(ProductDetailList);
export default connect(
  ({product}: RootState) => ({product}),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(ProductDetailList);
