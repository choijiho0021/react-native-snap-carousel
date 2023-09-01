import CryptoJS from 'crypto-js';
import utils from '@/redux/api/utils';
import i18n from './i18n';

const UniAsyncStorage =
  require('@react-native-community/async-storage').default;

const storeData = async (key: string, value: any, isEncrypt?: boolean) => {
  if (!key) return undefined;

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
    console.log('@@ store error : ', i18n.t('util:storeDataFailed') + error);
  }
};

const retrieveData = async (key: string, isDecrypt?: boolean) => {
  if (!key) return undefined;

  try {
    const value = await UniAsyncStorage.getItem(key);

    if (!value) return undefined;

    if (isDecrypt) {
      const bytes = CryptoJS.AES.decrypt(value, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    }

    return value;
  } catch (error) {
    console.log('@@ read error : ', i18n.t('util:retrieveDataFailed') + error);
    return null;
  }
};

const removeData = async (key: string) => {
  if (!key) return undefined;

  try {
    await UniAsyncStorage.removeItem(key);
  } catch (error) {
    console.log('@@ remove error : ', i18n.t('util:removeDataFailed') + error);
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
