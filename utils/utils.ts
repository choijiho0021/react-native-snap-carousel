import utils from '@/redux/api/utils';
import AppAlert from '@/components/AppAlert';
import CryptoJS from 'crypto-js';
import 'react-native-get-random-values'
import i18n from './i18n';

const UniAsyncStorage =
  require('@react-native-community/async-storage').default;

const storeData = async (key: string, value: any, isEncrypt?: boolean) => {
  try {
    if (isEncrypt) {
      await UniAsyncStorage.setItem(
        key,
        CryptoJS.AES.encrypt(value, key).toString(),
      );
    } else {
      await UniAsyncStorage.setItem(key, value);
    }
  } catch (error) {
    AppAlert.error(i18n.t('util:storeDataFailed') + error);
  }
};

const retrieveData = async (key: string, isDecrypt?: boolean) => {
  try {
    if (isDecrypt) {
      const bytes = CryptoJS.AES.decrypt(key, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    }

    const value = await UniAsyncStorage.getItem(key);

    if (isDecrypt) {
      const bytes = CryptoJS.AES.decrypt(value, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    }

    return value;
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

const parseJson = (str?: string) => {
  try {
    return str ? JSON.parse(str) : undefined;
  } catch (err) {
    return '';
  }
};

export const getImage = (
  imgList: Record<string, any[]>,
  key: string,
  locale?: 'ko' | 'en',
) => {
  const img = imgList[key];
  if (img) {
    const lang = locale || i18n.locale;
    return lang === 'en' && img[1] ? img[1] : img[0];
  }
  return null;
};

export {utils};
export {storeData, retrieveData, removeData, parseJson};
