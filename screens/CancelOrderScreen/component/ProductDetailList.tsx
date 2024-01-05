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

  notiText: {...appStyles.normal20Text, color: colors.white, lineHeight: 28},
  notiBoldText: {...appStyles.bold20Text, color: colors.white, lineHeight: 28},
  cancelItemFrame: {
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.whiteFive,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,

    elevation: 12,
    shadowColor: colors.shadow4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 10,
    shadowOpacity: 0.3,
  },
  cancelItem: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    marginBottom: 8,
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
  isFooter?: boolean;
};

const ProductDetailList: React.FC<ProductDetailListPros> = ({
  prods,
  style,
  listTitle,
  notiComponent,
  footerComponent,
  isGradient = false,
  isFooter = true,
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
    <View
      key="container"
      style={[{backgroundColor: 'white', borderColor: '#000'}, style]}>
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
                textStyle={styles.notiText}
                format={{b: styles.notiBoldText}}
              />
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.cancelCountNotiFrame}>
            <View>
              <AppStyledText
                text={listTitle}
                textStyle={styles.notiText}
                format={{b: styles.notiBoldText}}
              />
            </View>
          </View>
        )}
      </View>

      <View key="cancelFrame" style={styles.cancelItemFrame}>
        <View key="cancelList" style={{justifyContent: 'center'}}>
          {prods.map((r, index) => {
            return renderItem({item: r, isLast: index === prods.length - 1});
          })}
        </View>
        {isFooter && footerComponent}
      </View>
    </View>
  );
};

export default memo(ProductDetailList);
