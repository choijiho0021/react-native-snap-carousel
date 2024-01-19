import React, {memo} from 'react';
import {StyleSheet, TextStyle, View} from 'react-native';
import AppText from '@/components/AppText';
import AppSvgIcon from '@/components/AppSvgIcon';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxText: {
    ...appStyles.semiBold14Text,
    lineHeight: 22,
    letterSpacing: -0.28,
    marginRight: 32,
  },
});

type TextWithCheckProps = {
  text: string;
  textStyle?: TextStyle;
  textBoldStyle?: TextStyle;
};

const TextWithCheck: React.FC<TextWithCheckProps> = ({
  text,
  textStyle,
  textBoldStyle,
}) => {
  return (
    <View style={styles.row} key={text}>
      <AppSvgIcon
        style={{marginRight: 8, alignSelf: 'flex-start', marginTop: 3}}
        name="checkedBlueSmall"
      />
      {textBoldStyle ? (
        <AppStyledText
          text={text}
          textStyle={textStyle || styles.boxText}
          format={{b: textBoldStyle}}
        />
      ) : (
        <AppText style={textStyle || styles.boxText}>{text}</AppText>
      )}
    </View>
  );
};

export default memo(TextWithCheck);
