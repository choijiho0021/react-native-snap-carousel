import React, {memo} from 'react';
import {StyleSheet, ViewStyle, View, StyleProp} from 'react-native';
import {colors} from '@/constants/Colors';
import SplitText from '@/components/SplitText';
import AppText from '@/components/AppText';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {utils} from '@/utils/utils';
import {renderPromoFlag} from '@/screens/ChargeHistoryScreen';

const styles = StyleSheet.create({});

type ProdDesc = {
  title: string;
  field_description: string;
  promoFlag: string[];
  qty: number;
};

type ProductDetailInfoPros = {item: ProdDesc; style?: StyleProp<ViewStyle>};

const ProductDetailInfo: React.FC<ProductDetailInfoPros> = ({
  item,
  style = {marginBottom: 10},
}) => {
  return (
    <View style={style}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}>
        <SplitText
          numberOfLines={2}
          renderExpend={() => renderPromoFlag(item.promoFlag || [], false)}
          style={{...appStyles.bold16Text, marginRight: 6}}
          ellipsizeMode="tail">
          {utils.removeBracketOfName(item.title)}
        </SplitText>
      </View>
      <View>
        <AppText
          key="desc"
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[
            appStyles.medium14,
            {
              flex: 1,
              color: colors.warmGrey,
              fontSize: isDeviceSize('medium') ? 14 : 16,
              lineHeight: isDeviceSize('medium') ? 20 : 22,
            },
          ]}>
          {item.field_description}
        </AppText>
      </View>
    </View>
  );
};

export default memo(ProductDetailInfo);
