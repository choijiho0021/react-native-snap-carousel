import React, {memo} from 'react';
import {StyleSheet, ViewStyle, View, StyleProp} from 'react-native';
import {colors} from '@/constants/Colors';
import SplitText from '@/components/SplitText';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import {utils} from '@/utils/utils';
import {renderPromoFlag} from '@/screens/ChargeHistoryScreen';
import {ProdInfo} from '@/redux/api/productApi';
import i18n from '@/utils/i18n';
import AppPrice from '@/components/AppPrice';

const styles = StyleSheet.create({
  productFrame: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {
    ...appStyles.bold16Text,
    color: colors.black,
    lineHeight: 24,
  },
});

type ProductDetailInfoPros = {
  item: ProdInfo;
  style?: StyleProp<ViewStyle>;
  showPriceInfo?: boolean;
};

const ProductDetailInfo: React.FC<ProductDetailInfoPros> = ({
  item,
  style = {marginBottom: 10},
  showPriceInfo = false,
}) => {
  return (
    <View style={[{gap: 4}, style]}>
      <View style={styles.productFrame}>
        <SplitText
          numberOfLines={2}
          renderExpend={() =>
            renderPromoFlag({
              flags: item?.promoFlag || [],
              isStore: false,
              isReceived: false,
            })
          }
          style={{...appStyles.bold16Text, marginRight: 6}}
          ellipsizeMode="tail">
          {utils.removeBracketOfName(item?.title)}
        </SplitText>
      </View>
      {item?.field_description && (
        <View>
          <AppText
            key="desc"
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              appStyles.medium14,
              {
                color: colors.warmGrey,
              },
            ]}>
            {item?.field_description}
          </AppText>
        </View>
      )}

      {showPriceInfo && (
        <View style={{flexDirection: 'row'}}>
          <AppPrice
            price={utils.toCurrency(
              item.price?.value || 0,
              item.price?.currency,
            )}
            balanceStyle={styles.priceText}
            currencyStyle={styles.priceText}
          />
          <AppText
            key="qty"
            style={[
              appStyles.normal16Text,
              {
                color: colors.black,
                lineHeight: 24,
              },
            ]}>
            {` / ${item.qty}${i18n.t('qty')}`}
          </AppText>
        </View>
      )}
    </View>
  );
};

export default memo(ProductDetailInfo);
