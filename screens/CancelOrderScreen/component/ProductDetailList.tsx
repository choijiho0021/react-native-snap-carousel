import React, {Fragment, memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import ProductDetailInfo from './ProductDetailInfo';
import {ProdInfo} from '@/redux/api/productApi';

const styles = StyleSheet.create({
  cancelItem: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    marginBottom: 8,
    borderColor: colors.whiteFive,
  },
});

type ProductDetailListPros = {
  prods: ProdInfo[];
  listTitle?: string;
};

const ProductDetailList: React.FC<ProductDetailListPros> = ({
  prods,
  listTitle,
}) => {
  const renderItem = useCallback(
    ({item, isLast}: {item: ProdInfo; isLast?: boolean}) => {
      return (
        <Fragment key={`${item.title}_${listTitle}`}>
          {Array.from({length: item?.qty}, (_, index) => {
            return (
              <ProductDetailInfo
                key={`${item.title}_${index}_${listTitle}`}
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
          })}
        </Fragment>
      );
    },
    [listTitle],
  );

  return (
    <View key="cancelList" style={{justifyContent: 'center'}}>
      {prods.map((r, index) => {
        return renderItem({item: r, isLast: index === prods.length - 1});
      })}
    </View>
  );
};

export default memo(ProductDetailList);
