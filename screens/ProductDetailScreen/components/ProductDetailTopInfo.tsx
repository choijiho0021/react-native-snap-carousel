import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import AppStyledText from '@/components/AppStyledText';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  bg: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 288,
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  titleTop: {
    display: 'flex',
    gap: 8,
  },
  prodTitle: {
    ...appStyles.semiBold24Text,
    lineHeight: 42,
    color: colors.white,
  },
  prodTitleBold: {
    ...appStyles.bold32Text,
    lineHeight: 42,
    color: colors.white,
  },
  prodBody: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    color: colors.white,
  },
  locaTag: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.white,
    marginBottom: 4,
  },
  bottomText: {
    ...appStyles.normal16Text,
    color: colors.white,
    lineHeight: 24,
  },
});

type ProductDetailTopInfoProps = {
  isDaily: boolean;
  volume: string;
  volumeUnit: string;
  desc1: string;
  desc2: string;
  prodName: string;
  prodDays: string | number;
};

const ProductDetailTopInfo: React.FC<ProductDetailTopInfoProps> = ({
  isDaily,
  volume,
  volumeUnit,
  desc1,
  desc2,
  prodName,
  prodDays,
}) => {
  return (
    <ImageBackground
      source={
        isDaily
          ? require('@/assets/images/esim/img_bg_1.png')
          : require('@/assets/images/esim/img_bg_2.png')
      }
      style={styles.bg}>
      <View style={styles.titleTop}>
        <AppStyledText
          text={i18n.t(`prodDetail:title:${isDaily ? 'daily' : 'total'}`)}
          textStyle={styles.prodTitle}
          format={{b: styles.prodTitleBold}}
          data={{
            data: isDaily ? prodDays.toString() || '' : volume || '',
            unit: volumeUnit,
          }}
        />

        <AppText style={styles.prodBody}>{desc1}</AppText>
      </View>
      <View>
        <AppText style={styles.locaTag}>
          {i18n.t(
            `prodDetail:${
              ['로컬', 'local'].find((i) => prodName.includes(i))
                ? 'local'
                : 'roaming'
            }`,
          )}
        </AppText>
        <AppText style={styles.bottomText}>
          {desc2?.replace(/&amp;/g, '&')}
        </AppText>
      </View>
    </ImageBackground>
  );
};

export default ProductDetailTopInfo;
