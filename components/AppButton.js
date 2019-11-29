import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import {appStyles} from '../constants/Styles'
import i18n from '../utils/i18n';
import {colors} from '../constants/Colors'
import AppIcon from './AppIcon';
import api from '../utils/api/api'

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 36,
    borderRadius: 3,
    backgroundColor: colors.clearBlue,
  },
  text: {
    ... appStyles.normal14Text,
    color: "#ffffff",
    textAlign: "center",
    margin: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  }
})

export default function AppButton({style, disabled=false, size, title, iconName, uri, onPress, titleStyle, checked, disableColor, disableBackgroundColor, direction}) {
  const align = direction == 'row' ? { flexDirection: 'row', justifyContent: 'flex-start' } : { justifyContent: 'center' }

  return (
    <TouchableOpacity style={[style || styles.button, disabled ? {backgroundColor: disableBackgroundColor || colors.warmGrey} : {}]} disabled={disabled} onPress={onPress}>
      <View style={[styles.container, align]}>
        {
          uri ? <Image source={{uri:api.httpImageUrl(uri)}}/> :
          iconName &&  <AppIcon name={iconName} size={size} checked={checked}/> 
        }
        {
          title && <Text style={[titleStyle || styles.text, disabled ? {color:disableColor || colors.white} : {}]}>{ title || i18n.t('select')}</Text>
        }
      </View>
    </TouchableOpacity>
  )
}

