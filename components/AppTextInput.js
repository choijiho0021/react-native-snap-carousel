import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native'
import i18n from '../utils/i18n'
import AppButton from './AppButton';
import { appStyles } from '../constants/Styles'
import { colors } from '../constants/Colors';

const AppTextInput = React.forwardRef((props, ref) => {
  return (
    <View style={[styles.container, props.style]}>
      <View style={[props.inputStyle || styles.inputWrapper, props.completed ? { borderColor: colors.black } : {}, {flex:1, marginRight:20}]}>
        <TextInput {... props} 
          ref={ref}
          autoFocus={props.autoFocus}
          style={styles.input}
          disabled={ props.disabled || props.completed }/>
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
})

const styles = StyleSheet.create({
  input: {
    ... appStyles.normal16Text,
    color: colors.black
  },
  inputWrapper : {
    flex: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    paddingBottom: 5,
    borderBottomColor: colors.warmGrey,
    borderBottomWidth: 1
  },
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: 'flex-end'
  },
});


export default AppTextInput