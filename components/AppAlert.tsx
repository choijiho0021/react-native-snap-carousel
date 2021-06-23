import {Alert} from 'react-native';
import i18n from '@/utils/i18n';

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
) => {
  return Alert.alert(title, message, [
    {
      text: i18n.t('cancel'),
      onPress: cancel,
    },
    {
      text: i18n.t('ok'),
      onPress: ok,
    },
  ]);
};

export default {info, error, confirm};
