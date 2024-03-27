import React, {Fragment, memo, useCallback} from 'react';
import {StyleSheet, ViewStyle, View, StyleProp, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {ProdInfo} from '@/redux/api/productApi';
import ProductDetailList from './ProductDetailList';
import {OrderItemType} from '@/redux/api/orderApi';

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
  dashContainer: {
    overflow: 'hidden',
  },
  dashFrame: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    margin: -1,
    height: 0,
    marginBottom: 0,
  },
  dash: {
    width: '100%',
  },

  headerNotiText: {
    ...appStyles.bold16Text,
    color: colors.redError,
  },

  headerNoti: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderColor: colors.lightGrey,
  },
});

const DefaultFooter = () => {
  const renderDashedDiv = useCallback(() => {
    return (
      <View style={styles.dashContainer}>
        <View style={styles.dashFrame}>
          <View style={styles.dash} />
        </View>
      </View>
    );
  }, []);

  return (
    <View>
      {Platform.OS === 'ios' && renderDashedDiv()}
      <View
        style={[
          styles.headerNoti,
          Platform.OS === 'android' && {
            borderStyle: 'dashed',
            borderTopWidth: 1,
          },
        ]}>
        <AppText style={styles.headerNotiText}>
          {i18n.t('his:draftNoti')}
        </AppText>
      </View>
    </View>
  );
};

type ProductDetailRenderPros = {
  orderItems: ProdInfo[] | OrderItemType[];
  listTitle?: string;
  style?: StyleProp<ViewStyle>;
  frameStyle?: StyleProp<ViewStyle>;
  notiComponent?: any;
  footerComponent?: any;
  bodyComponent?: any;
  isGradient?: boolean;
  isFooter?: boolean;
  isHeader?: boolean;
  isBody?: boolean;
};

const ProductDetailRender: React.FC<ProductDetailRenderPros> = ({
  orderItems,
  style,
  frameStyle,
  listTitle,
  notiComponent,
  footerComponent = <DefaultFooter />,
  bodyComponent,
  isGradient = false,
  isFooter = true,
  isHeader = true,
  isBody = false,
}) => {
  return (
    <View
      key="container"
      style={[{backgroundColor: 'white', borderColor: '#000'}, style]}>
      <View key="noti" style={styles.notiContainer}>
        {isHeader && (
          <>
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
          </>
        )}
      </View>

      <View key="cancelFrame" style={frameStyle || styles.cancelItemFrame}>
        <ProductDetailList orderItems={orderItems} listTitle={listTitle} />
        {isBody && bodyComponent}
        {isFooter && footerComponent}
      </View>
    </View>
  );
};

export default memo(ProductDetailRender);
