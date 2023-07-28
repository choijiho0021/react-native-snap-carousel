import React, {Fragment, memo, useCallback} from 'react';
import {StyleSheet, ViewStyle, View, StyleProp} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';
import ProductDetailInfo from './ProductDetailInfo';

const styles = StyleSheet.create({
  notiContainer: {
    marginTop: 20,
  },
  cancelItemFrame: {
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

    cancelCountNotiGradientFrame: {
      backgroundColor: 'transparent',
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
  isGradient?: boolean;
};

const ProductDetailList: React.FC<ProductDetailListPros> = ({
  prods,
  style,
  listTitle,
  notiComponent,
  footerComponent,
  isGradient = false,
}) => {
  const renderItem = useCallback(
    ({item, isLast}: {item: ProdDesc; isLast?: boolean}) => {
      return (
        <Fragment key={`${item.title}_${listTitle}`}>
          {Array.from({length: item?.qty}, (_, index) => {
            return (
              <ProductDetailInfo
                key={`${item.title}_${index}_${listTitle}`}
                item={item}
                style={[styles.cancelItem, isLast && {borderBottomWidth: 0}]}
              />
            );
          })}
        </Fragment>
      );
    },
    [listTitle],
  );

  return (
    <View key="container" style={style}>
      <View key="noti" style={styles.notiContainer}>
        {notiComponent}

        {isGradient ? (
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={[colors.clearBlue, colors.purplyBlue]}
            style={styles.cancelCountNotiFrame}>
            <View>
              <AppStyledText
                text={listTitle}
                textStyle={{...appStyles.normal20Text, color: colors.white}}
                format={{b: {...appStyles.bold20Text, color: colors.white}}}
              />
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.cancelCountNotiFrame}>
            <View>
              <AppStyledText
                text={listTitle}
                textStyle={{...appStyles.normal20Text, color: colors.white}}
                format={{b: {...appStyles.bold20Text, color: colors.white}}}
              />
            </View>
          </View>
        )}
      </View>

      {/* contentContainerStyle={[styles.cancelItemFrame]} */}

      <View key="cancelFrame" style={styles.cancelItemFrame}>
        <View
          key="cancelList"
          style={{paddingHorizontal: 16, justifyContent: 'center'}}>
          {prods.map((r, index) =>
            renderItem({item: r, isLast: index === prods.length - 1}),
          )}
        </View>
        {footerComponent}
      </View>
    </View>
  );
};

export default memo(ProductDetailList);
