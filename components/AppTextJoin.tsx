import React, {memo} from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import AppText from './AppText';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
    alignSelf: 'flex-end',
  },
});

export type StyledText = {
  text: string;
  textStyle?: TextStyle;
  viewStyle?: ViewStyle;
};

const AppTextJoin = ({
  data,
  style,
  textStyle,
}: {
  data: StyledText[];
  style?: ViewStyle;
  textStyle?: TextStyle;
}) => {
  return (
    <View style={[styles.container, style]}>
      {data.map((elm, idx) => (
        <View key={idx} style={elm.viewStyle}>
          <AppText style={[styles.text, textStyle, elm.textStyle]}>
            {elm.text}
          </AppText>
        </View>
      ))}
    </View>
  );
};
export default memo(AppTextJoin);

// 사용예시
// const data: StyledText[] = [
//   {
//     text: 'QR코드',
//     viewStyle: {
//       borderStyle: 'solid',
//       borderBottomWidth: 10,
//       borderBottomColor: '#b8d1f5',
//     },
//     textStyle: {
//       ...appStyles.bold24Text,
//       top: 10,
//     },
//   },
//   {
//     text: '혹은',
//     viewStyle: {},
//     textStyle: {
//       ...appStyles.bold20Text,
//       top: 10,
//     },
//   },
// ];
