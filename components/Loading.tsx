import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import AppText from './AppText';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contents: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  text: {
    fontSize: 20,
    marginTop: 20,
    lineHeight: 25,
  },
});

function Loading() {
  const {container, contents, text} = styles;
  return (
    <View style={container}>
      <View style={contents}>
        <AppText style={text}>잠시만 기다려주세요...</AppText>
      </View>
    </View>
  );
}

export default memo(Loading);
