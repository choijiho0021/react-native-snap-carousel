import React, {memo} from 'react';
import {StyleSheet, TextStyle, View} from 'react-native';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import AppStyledText from '@/components/AppStyledText';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  body: {
    ...appStyles.normal14Text,
    lineHeight: 22,
  },
  bold: {
    ...appStyles.bold14Text,
    lineHeight: 22,
    color: colors.clearBlue,
  },
  dot: {
    ...appStyles.normal14Text,
    marginHorizontal: 5,
    marginTop: 3,
  },
});

const TextWithDot = ({
  dotStyle,
  textStyle,
  boldStyle,
  text,
}: {
  dotStyle?: TextStyle;
  textStyle?: TextStyle;
  boldStyle?: TextStyle;
  text: string;
}) => {
  return (
    <View key={text} style={{flexDirection: 'row'}}>
      <AppText style={dotStyle || styles.dot}>•</AppText>
      <AppStyledText
        textStyle={textStyle || styles.body}
        text={text}
        format={{b: boldStyle || styles.bold}}
      />
    </View>
  );
};

export default memo(TextWithDot);
