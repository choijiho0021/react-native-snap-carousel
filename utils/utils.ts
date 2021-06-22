import _ from 'underscore';
import utils from '@/submodules/rokebi-utils/utils';
import i18n from './i18n';
import AppAlert from '../components/AppAlert';
import * as ToastActions from '../redux/modules/toast';

const UniAsyncStorage = require('@react-native-community/async-storage')
  .default;

const storeData = async (key, value) => {
  try {
    await UniAsyncStorage.setItem(key, value);
  } catch (error) {
    AppAlert.error(i18n.t('util:storeDataFailed') + error);
  }
};

const retrieveData = async (key) => {
  try {
    return await UniAsyncStorage.getItem(key);
  } catch (error) {
    AppAlert.error(i18n.t('util:retrieveDataFailed') + error);
  }
};

const removeData = async (key) => {
  try {
    return await UniAsyncStorage.removeItem(key);
  } catch (error) {
    AppAlert.error(i18n.t('util:removeDataFailed') + error);
  }
};

const reflectWithToast = (action, toastType) => (...args) => {
  return (dispatch) => {
    return dispatch(action(...args)).then(
      (resp) => {
        if (resp.result !== 0) {
          dispatch(ToastActions.push(toastType));
        }
        return resp;
      },
      (err) => {
        dispatch(ToastActions.push(toastType));
        return err;
      },
    );
  };
};

export {utils};
export {storeData, retrieveData, removeData, reflectWithToast};
