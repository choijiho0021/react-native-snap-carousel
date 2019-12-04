import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import {appStyles} from '../constants/Styles'
import { colors } from '../constants/Colors';
import Icon from 'react-native-vector-icons/AntDesign';

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 32,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  box: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  boxCenter:{
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
  },
  text: {
    ... appStyles.normal16Text,
    textAlign: 'center',
  },
  centerBox: {
    borderLeftColor: colors.lightGrey,
    borderLeftWidth: 1,
    borderRightColor: colors.lightGrey,
    borderRightWidth: 1,
  },
  disabled: {
    backgroundColor: '#D8D8D8'
  },
});

export default function InputNumber({value, onChange, minValue=0, maxValue=9}) {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => value > minValue && onChange(value-1)} >
        {
          value == minValue ?
          <View style={[styles.box, styles.disabled]}>
            <Icon name="minus"/>
          </View> 
        : <View style={styles.box}>
            <Icon name="minus"/>
          </View>
        }
      </TouchableOpacity>
      <View style={styles.boxCenter}>
        <Text style={styles.text}>{value}</Text>
      </View>
      <TouchableOpacity onPress={() => value < maxValue && onChange(value+1)} >
        <View style={styles.box}>
          <Icon name="plus"/>
        </View>
      </TouchableOpacity>
    </View>
  )
}

