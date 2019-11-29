import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { appStyles } from '../constants/Styles'
import { colors } from '../constants/Colors'

export default function AppRadioButton(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
      <View style={[styles.borderCircle]}>
        <View style={ props.checked ? [styles.innerCircle] : []} />
      </View>
      <View style={[styles.textWrapper]}>
        <Text> {props.title} </Text>
      </View>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  borderCircle: {
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 50,
    width: 15,
    height: 15,
    padding: 2,
    marginTop: 1,
    marginRight: 12
  },
  innerCircle: {
    backgroundColor: colors.clearBlue,
    width: '100%',
    height: '100%',
    borderWidth: 0,
    borderRadius: 50
  },
  textWrapper: {
    height: 17
  },
  text : {
    ... appStyles.normal14Text,
    color: colors.black,
    marginRight: 12,
    lineHeight: 17
  }
});

