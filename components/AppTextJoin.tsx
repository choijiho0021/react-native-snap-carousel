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

type StyledText = {
  text: string;
  style: TextStyle;
};

const AppTextJoin = ({
  data,
  style,
}: {
  data: StyledText[];
  style?: ViewStyle;
}) => {
  return (
    <View style={[style || styles.container]}>
      {data.map((elm) => (
        <AppText style={[styles.text, elm.style]}>{elm.text}</AppText>
      ))}
    </View>
  );
};
export default memo(AppTextJoin);
