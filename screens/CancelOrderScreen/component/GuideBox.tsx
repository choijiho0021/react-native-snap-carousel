import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  refundGuideFrame: {
    paddingTop: 41,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.backGrey,
  },

  refundGuideTitle: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  refundGuideBody: {
    ...appStyles.normal14Text,
    lineHeight: 22,
    color: colors.warmGrey,
  },
  refundGuideBodyBold: {
    ...appStyles.bold14Text,
    lineHeight: 22,
    color: colors.warmGrey,
  },
  bannerMark: {
    marginRight: 8,
  },
});

type GuideBoxPros = {
  iconName: string;
  title: string;
  body: string;
};

const GuideBox: React.FC<GuideBoxPros> = ({iconName, title, body}) => {
  return (
    <View style={styles.refundGuideFrame}>
      <View style={styles.refundGuideTitle}>
        <AppSvgIcon name={iconName} style={styles.bannerMark} />
        <AppText style={appStyles.bold18Text}>
          {/* {i18n.t('his:cancelGuideLineTitle')} */}
          {title}
        </AppText>
      </View>
      <AppStyledText
        text={body}
        textStyle={styles.refundGuideBody}
        format={{b: styles.refundGuideBodyBold}}
      />
    </View>
  );
};

export default memo(GuideBox);
