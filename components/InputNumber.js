import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import {appStyles} from '../constants/Styles'
import { colors } from '../constants/Colors';
import Icon from 'react-native-vector-icons/AntDesign';
import { isDeviceSize } from '../constants/SliderEntry.style';

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 32,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end'
  },
  box: {
    width: isDeviceSize('small') ? 28 : 32,
    height: isDeviceSize('small') ? 28 : 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  boxCenter:{
    width: isDeviceSize('small') ? 28 : 32,
    height: isDeviceSize('small') ? 28 : 32,
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
    color: colors.lightGrey
  },
  abled: {
    color: colors.black
  }
});

export default class InputNumber extends PureComponent {

  render() {
    const { value, onChange, minValue=1, maxValue=9} = this.props,
      min = value <= minValue, 
      max = value >= maxValue

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => onChange(value-1)} disabled={min} >
          <View style={styles.box}>
            <Icon name="minus" style={min ? styles.disabled : styles.abled}/>
          </View> 
        </TouchableOpacity>
        <View style={styles.boxCenter}>
          <Text style={styles.text}>{value}</Text>
        </View>
        <TouchableOpacity onPress={() => onChange(value+1)} disabled={max}>
          <View style={styles.box}>
            <Icon name="plus" style={max ? styles.disabled : styles.abled}/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

