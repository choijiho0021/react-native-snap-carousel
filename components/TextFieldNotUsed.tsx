import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import AppText from './AppText';
import AppTextInput from './AppTextInput';

const styles = StyleSheet.create({
  input: {
    width: '100%',
  },
});

const TextField = (props) => {
  return (
    <View style={props.style}>
      <AppTextInput {...props} style={styles.input} />
      {props.error ? (
        <AppText style={styles.input}>{props.error[0]}</AppText>
      ) : null}
    </View>
  );
};

export default memo(TextField);
