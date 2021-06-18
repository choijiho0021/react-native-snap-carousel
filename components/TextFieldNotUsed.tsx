import React, {memo} from 'react';
import {StyleSheet, View, TextInput, Text} from 'react-native';

const styles = StyleSheet.create({
  input: {
    width: '100%',
  },
});

const TextField = (props) => {
  return (
    <View style={props.style}>
      <TextInput {...props} style={styles.input} />
      {props.error ? <Text style={styles.input}>{props.error[0]}</Text> : null}
    </View>
  );
};

export default memo(TextField);
