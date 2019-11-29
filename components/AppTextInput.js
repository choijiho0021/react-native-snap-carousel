import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native'
import i18n from '../utils/i18n'
import AppButton from './AppButton';
import { appStyles } from '../constants/Styles'
import { colors } from '../constants/Colors';

export default function AppTextInput(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={[styles.inputWrapper, props.completed ? { borderColor: colors.black } : {}]}>
        <TextInput {... props} style={[props.inputStyle, {paddingTop:9}]} disabled={ props.disabled || props.completed }/>
      </View>
      <AppButton disabled={props.disabled} 
        onPress={props.onPress}
        iconName={props.iconName}
        direction={props.direction}
        //style={props.style}
        checked={props.checked}
        titleStyle={props.titleStyle} title={props.title || i18n.t('ok')}
        disableColor={props.titleDisableColor}/>
    </View>
    )
}

const styles = StyleSheet.create({
  inputWrapper : {
    ... appStyles.borderUnderscore,
    flex: 1,
    marginRight: 10,
    paddingLeft: 10
  },
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: 'flex-end'
  },
});

