import React from 'react';
import {
  Alert,
} from 'react-native';
import i18n from '../utils/i18n'


class AppAlert {
  error = (message, onPress = () => {}) => {
    return this.info(message, 'error', onPress)
  }

  info = (message, title='', onPress= () => {}) => {
    return (
      Alert.alert( title, message, [{text: i18n.t('ok'), onPress:onPress}])
    )
  }

  confirm = (title, message, {ok = () => {}, cancel = () => {}}) => {
    return (
      Alert.alert( title, message, [
        {
          text: i18n.t('cancel'),
          onPress: cancel
        }, 
        {
          text: i18n.t('ok'),
          onPress: ok
        }
      ])
    )
  }
}

export default new AppAlert()