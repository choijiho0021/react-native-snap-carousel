import React, {memo} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  bg: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 20,
    marginTop: 6,
  },
  prodTitle: {
    ...appStyles.normal20Text,
    lineHeight: 32,
    color: colors.white,
  },
  prodTitleBold: {
    ...appStyles.bold24Text,
    lineHeight: 34,
    color: colors.white,
  },
  prodTitleLine: {
    ...appStyles.normal20Text,
    lineHeight: 34,
    color: colors.white,
  },
});

interface SelectedProdTitleProps {
  isdaily: boolean;
  prodName: string;
  isAddOn: boolean;
}

const SelectedProdTitle: React.FC<SelectedProdTitleProps> = ({
  isdaily,
  prodName,
  isAddOn,
}) => {
  return (
    <ImageBackground
      source={
        isdaily
          ? require('@/assets/images/esim/img_bg_1.png')
          : require('@/assets/images/esim/img_bg_2.png')
      }
      style={styles.bg}>
      <AppStyledText
        text={i18n.t(`esim:charge:type:${isAddOn ? 'addOn' : 'charge'}:title`, {
          prodName,
        })}
        textStyle={styles.prodTitle}
        format={{b: styles.prodTitleBold, l: styles.prodTitleLine}}
      />
    </ImageBackground>
  );
};

export default memo(SelectedProdTitle);
