import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native'
import i18n from '../utils/i18n'
import AppButton from './AppButton';
import { appStyles } from '../constants/Styles'
import { colors } from '../constants/Colors';
import _ from 'underscore'

const AppTextInput = React.forwardRef((props, ref) => {
  return (
    <View style={[styles.container, props.style]}>
      <View style={[styles.inputWrapper, props.inputStyle, {flex:1, marginRight:20}]}>
        <TextInput {... props} 
          ref={ref}
          autoFocus={props.autoFocus}
          style={styles.input}
          editable={ ! props.disabled }
          selectTextOnFocus={ ! props.disabled }/>
      </View>
      <AppButton disabled={ (typeof props.clickable === 'boolean') ? ! props.clickable : props.disabled } 
        onPress={props.onPress}
        iconName={props.iconName}
        direction={props.direction}
        style={props.buttonStyle}
        checked={props.checked}
        titleStyle={props.titleStyle} 
        title={props.title || i18n.t('ok')}
        disableColor={props.titleDisableColor}/>
    </View>
    )
})

const styles = StyleSheet.create({
  input: {
    ... appStyles.normal16Text,
    color: colors.black
  },
  inputWrapper : {
    paddingHorizontal: 10,
    borderBottomColor: colors.black,
    borderBottomWidth: 1
  },
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: 'flex-end'
  }
});


export default AppTextInput