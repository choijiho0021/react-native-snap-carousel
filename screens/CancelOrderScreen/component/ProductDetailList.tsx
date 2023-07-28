import React, {memo, useCallback} from 'react';
import {StyleSheet, ViewStyle, View, StyleProp} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';
import ProductDetailInfo from './ProductDetailInfo';

const styles = StyleSheet.create({
  notiContainer: {
    marginTop: 20,
  },
  cancelItemFrame: {
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: colors.shadow2,
    shadowRadius: 10,
    shadowOpacity: 0.16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  cancelItem: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderColor: colors.whiteFive,
  },

  cancelCountNotiFrame: {
    backgroundColor: colors.darkBlue,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    paddingVertical: 12,

    shadowColor: colors.shadow2,
    shadowRadius: 10,

    shadowOpacity: 0.16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    cancelItemFrame: {
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.whiteFive,
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 3,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      shadowColor: colors.shadow2,
      shadowRadius: 10,
      shadowOpacity: 0.16,
      shadowOffset: {
        width: 0,
        height: 4,
      },
    },
    cancelItem: {
      paddingVertical: 24,
      borderBottomWidth: 1,
      borderColor: colors.whiteFive,
    },
  },
});

type ProdDesc = {
  title: string;
  field_description: string;
  promoFlag: string[];
  qty: number;
};

type ProductDetailListPros = {
  prods: ProdDesc[];
  listTitle: string;
  style?: StyleProp<ViewStyle>;
  notiComponent?: any;
  footerComponent?: any;
};

const ProductDetailList: React.FC<ProductDetailListPros> = ({
  prods,
  style,
  listTitle,
  notiComponent,
  footerComponent,
}) => {
  const renderItem = useCallback(
    ({item, isLast}: {item: ProdDesc; isLast?: boolean}) => {
      return (
        <>
          {Array.from({length: item?.qty}, (_, index) => {
            return (
              <ProductDetailInfo
                key={item.title + index}
                item={item}
                style={[styles.cancelItem, isLast && {borderBottomWidth: 0}]}
              />
            );
          })}
        </>
      );
    },
    [],
  );

  return (
    <View style={style}>
      <View style={styles.notiContainer}>
        {notiComponent}
        <View style={styles.cancelCountNotiFrame}>
          <AppStyledText
            text={listTitle}
            textStyle={{...appStyles.normal20Text, color: colors.white}}
            format={{b: {...appStyles.bold20Text, color: colors.white}}}
          />
        </View>
      </View>

      {/* contentContainerStyle={[styles.cancelItemFrame]} */}

      <View style={styles.cancelItemFrame}>
        {prods.map((r, index) =>
          renderItem({item: r, isLast: index === prods.length - 1}),
        )}
        {footerComponent}
      </View>
    </View>
  );
};

export default memo(ProductDetailList);
