import {Alert} from 'react-native';
import i18n from '@/utils/i18n';

const alert = (
  message: string,
  title = '',
  buttonText = i18n.t('ok'),
  onPress = () => {},
) => {
  return Alert.alert(title, message, [{text: buttonText, onPress}]);
};

const info = (message: string, title = '', onPress = () => {}) => {
  return Alert.alert(title, message, [{text: i18n.t('ok'), onPress}]);
};

const error = (message: string, title?: string, onPress = () => {}) => {
  return info(message, title || i18n.t('error'), onPress);
};

const confirm = (
  title: string,
  message: string,
  {ok = () => {}, cancel = () => {}},
  cancelText: string = i18n.t('cancel'),
  okText: string = i18n.t('ok'),
) => {
  return Alert.alert(title, message, [
    {
      text: cancelText,
      onPress: cancel,
    },
    {
      text: okText,
      onPress: ok,
    },
  ]);
};

export default {alert, info, error, confirm};
