import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  title: {
    marginBottom: 18,
    paddingHorizontal: 20,
  },
  titleText: {
    ...appStyles.bold24Text,
    lineHeight: 32,
    color: colors.black,
  },
});

const GuideTitle = ({title}: {title: string}) => (
  <View style={styles.title}>
    <AppStyledText
      text={title}
      textStyle={styles.titleText}
      format={{b: [styles.titleText, {color: colors.clearBlue}]}}
    />
  </View>
);

export default memo(GuideTitle);
