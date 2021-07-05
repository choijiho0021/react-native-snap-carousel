import _ from 'underscore';
import utils from '@/submodules/rokebi-utils/utils';
import AppAlert from '@/components/AppAlert';
import {actions as toastActions} from '@/redux/modules/toast';
import {AsyncThunk} from '@reduxjs/toolkit';
import {Toast} from '@/constants/CustomTypes';
import {AppDispatch} from '@/store';
import i18n from './i18n';

const UniAsyncStorage = require('@react-native-community/async-storage')
  .default;

const storeData = async (key: string, value: any) => {
  try {
    await UniAsyncStorage.setItem(key, value);
  } catch (error) {
    AppAlert.error(i18n.t('util:storeDataFailed') + error);
  }
};

const retrieveData = async (key: string) => {
  try {
    const val = await UniAsyncStorage.getItem(key);
    return val;
  } catch (error) {
    AppAlert.error(i18n.t('util:retrieveDataFailed') + error);
    return null;
  }
};

const removeData = async (key: string) => {
  try {
    await UniAsyncStorage.removeItem(key);
  } catch (error) {
    AppAlert.error(i18n.t('util:removeDataFailed') + error);
  }
};

const reflectWithToast = <T, S>(
  action: AsyncThunk<T, S, {}>,
  toastType?: Toast,
) => (args: S) => (dispatch: AppDispatch) =>
  dispatch(action(args)).then(
    (resp) => {
      const result = resp.payload ? resp.payload.result : resp.result;
      if (result !== 0) {
        dispatch(toastActions.push(toastType));
      }
      return resp;
    },
    (err) => {
      dispatch(toastActions.push(toastType));
      return err;
    },
  );

export {utils};
export {storeData, retrieveData, removeData, reflectWithToast};
