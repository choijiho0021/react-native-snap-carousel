import {Image, Platform} from 'react-native';
import {getFontScale} from 'react-native-device-info';
import RNFetchBlob from 'rn-fetch-blob';
import _ from 'underscore';
import {Image as CropImage} from 'react-native-image-crop-picker';
import moment, {Moment} from 'moment';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import {RkbImage} from './accountApi';
import {Currency, CurrencyCode} from './productApi';
import {urlParamObj} from '@/redux/modules/link';
import {parseJson} from '@/utils/utils';
import store from '@/store';
import {
  appendLog,
  actions as LogActions,
  appendTalkLog,
} from '@/redux/modules/log';

const {esimCurrency} = Env.get();
const dateTimeFmt = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})*$/;
moment.locale(i18n.locale);

const fontScaling = async (size: number = 12): Promise<number> => {
  const scale = await getFontScale();
  if (scale) return size / scale;
  return size;
};

const isExist = (value: any) => {
  return value !== undefined && value !== null && !Number.isNaN(value);
};

const stringToNumber = (value: string): number | undefined => {
  if (typeof value === 'number') {
    return value;
  }

  if (
    typeof value === 'undefined' ||
    typeof value !== 'string' ||
    _.isEmpty(value)
  ) {
    return undefined;
  }

  // const num = value.replace(/[^0-9.]/g, '');
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (!isExist(num)) {
    return undefined;
  }

  if (value.trim().startsWith('-')) {
    return Number(-num);
  }
  return Number(num);
};

const numberToCommaString = (n?: number | string): string => {
  const num = typeof n === 'string' ? stringToNumber(n) : n;
  if (typeof num === 'number') {
    return num
      .toString()
      .replace(/,/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '';
};

const currencyString = (n?: number): string => {
  if (n === undefined) return '';

  const str = numberToCommaString(Math.round(n * 100) / 100);
  if (esimCurrency === 'KRW') return str;
  const digits = str.split('.');
  return `${digits[0]}.${(digits[1] || '').padEnd(1, '0')}`;
};

const dlvCost = (totalPrice: Currency): Currency => {
  if (totalPrice.currency === 'USD') {
    return {
      value: totalPrice.value < 30 && totalPrice.value > 0 ? 3 : 0,
      currency: 'USD',
    };
  }

  return {
    value: totalPrice.value < 30000 && totalPrice.value > 0 ? 3000 : 0,
    currency: 'KRW',
  };
};

// 숫자만 입력 받기
const stringToCurrency = (value?: string): Currency | undefined => {
  if (!value) return undefined;

  if (value.startsWith('USD')) {
    return {value: stringToNumber(value.substring(3)) || 0, currency: 'USD'};
  }

  if (value.startsWith('KRW')) {
    return {value: stringToNumber(value.substring(3)) || 0, currency: 'KRW'};
  }

  // default currency : KRW
  return {
    value: stringToNumber(value) || 0,
    currency: esimCurrency,
  };
};

const priceToCurrency = ({
  number,
  currency_code,
}: {
  number: string;
  currency_code: string;
}): Currency => {
  if (currency_code === 'USD') {
    return {value: stringToNumber(number) || 0, currency: 'USD'};
  }

  // default currency : KRW
  return {value: stringToNumber(number) || 0, currency: 'KRW'};
};

const toCurrency = (
  value: number,
  currency: CurrencyCode = 'KRW',
): Currency => ({
  value,
  currency,
});

const addCurrency = (a?: Currency, b?: Currency) => {
  if (a) {
    if (b) {
      if (a.currency === b.currency)
        return toCurrency(a.value + b.value, a.currency);
      throw Error('Currency code mismatch');
    }
    return a;
  }

  return b;
};

const price = (num?: Currency): string => {
  if (!num) return '';

  if (num.currency === 'USD' || i18n.locale !== 'ko')
    return `${i18n.t(num.currency)} ${currencyString(num.value)}`;

  return `${currencyString(num.value)}${i18n.t(num.currency)}`;
};

const pricePerDay = (num: Currency, days: number) => {
  return price(num) + (days ? ` / ${days} ${i18n.t('day')}` : '');
};

const toSegmentedString = (
  str: string,
  seg: number[],
  delimiter = '-',
): string => {
  return _.isArray(seg) && typeof str === 'string'
    ? seg
        .map((v, i, a) => str.substring(v, a[i + 1]))
        .filter((n) => n.length > 0)
        .join(delimiter)
    : str;
};

const toPhoneNumber = (str = '') => {
  if (_.isEmpty(str) || typeof str !== 'string') return '';

  const num = str.replace(/-/g, '');

  if (num.length === 7) return toSegmentedString(num, [0, 3, 7]);

  return num.length === 8
    ? toSegmentedString(num, [0, 4, 8])
    : toSegmentedString(num, [0, 3, 7, 11]);
};

const toICCID = (str: string, delimiter = '-') => {
  return toSegmentedString(str, [0, 5, 10, 15, 20], delimiter);
};

// html5: <br> == <br/>, &lt;br/&gt; == <br/>
const htmlToString = (html?: string) => {
  return (
    html &&
    html
      .replace(/&amp;lt;br\/&amp;gt;/gi, '\n')
      .replace(/&amp;/g, '&')
      .replace(/&lt;br\/&gt;/gi, '\n')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&quot;/gi, '"')
      .replace(/&#039;/g, "'")
      .replace(/<br.?\/?>/gi, '\n')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, '\n')
  );
};

const toDate = (str: string) => {
  if (typeof str === 'string') {
    // m[1] == undefined 이면 date 정보 (yyyy-mm-dd) 형식이고,
    // m[1]이 정의되면, timezone 정보가 없는 경우이므로 UTC timezone flag 'Z'를 추가해서 처리한다.
    const m = str.match(dateTimeFmt);
    const tz = 'Asia/Seoul';
    if (m) {
      if (m[1]) {
        return moment(`${str}Z`).tz(tz);
      }
      return moment(`${str}T00:00:00Z`).tz(tz);
    }
    return moment(str).tz(tz);
  }

  return null;
};

const toDateString = (
  str: string | object | undefined,
  fmt = 'LLL',
): string => {
  if (typeof str === 'string') {
    const dt = toDate(str);
    return dt?.format(fmt) || '';
  }

  if (typeof str === 'object') return str.format(fmt);

  return '';
};

const cmpMomentAsc = (a?: Moment, b?: Moment) => {
  if (a) {
    // check if a is defined
    if (b) return a.isBefore(b) ? -1 : 1;
    return -1;
  }
  return 1;
};

const cmpMomentDesc = (a?: Moment, b?: Moment) => {
  return cmpMomentAsc(a, b) * -1;
};

const convertFileURLtoRkbImage = async (url: string) => {
  if (_.isEmpty(url)) return Promise.reject(new Error(`invalid URL:${url}`));

  try {
    const data = await RNFetchBlob.fs.readFile(url, 'base64');
    return await new Promise<RkbImage>((resolve, reject) => {
      if (data) {
        Image.getSize(url, (width, height) => {
          const rkbImage: RkbImage = {
            mime: 'image/jpeg',
            data,
            height,
            width,
          };
          resolve(rkbImage);
        });
      } else {
        reject(new Error('convertURLtoRkbImage failed'));
      }
    });
  } catch (err) {
    return Promise.reject(new Error(`convertURLtoRkbImage failed : ${err}`));
  }
};

const convertURLtoRkbImage = async (url: string) => {
  if (_.isEmpty(url)) return Promise.reject(new Error(`invalid URL:${url}`));

  try {
    const response = await RNFetchBlob.fetch('GET', url);
    const data = response.base64();
    return await new Promise<RkbImage>((resolve, reject) => {
      if (data) {
        Image.getSize(url, (width, height) => {
          const rkbImage: RkbImage = {
            mime: 'image/jpeg',
            data,
            height,
            width,
          };
          resolve(rkbImage);
        });
      } else {
        reject(new Error('convertURLtoRkbImage failed'));
      }
    });
  } catch (err) {
    return Promise.reject(new Error('convertURLtoRkbImage failed'));
  }
};

const convertCropImageToRkbImage = ({
  mime,
  size,
  width,
  height,
  data,
}: CropImage) =>
  ({
    mime,
    size,
    width,
    height,
    data,
  } as RkbImage);

const removeBracketOfName = (str?: string) => {
  if (!str) return undefined;
  return str.slice(str.indexOf(']') + 1, str.length);
};

const generateKey = (pre: any) => {
  return `${pre || ''}_${new Date().getTime()}`;
};

const getParam = (link?: string): urlParamObj => {
  if (link) {
    const url = link.split(/[;?&]/);
    url.shift();
    const param = url.map((elm) => `"${elm.replace('=', '":"')}"`);
    const json = parseJson(`{${param.join(',')}}`);
    return json;
  }
  return {};
};

const intentToUrl = (url: string): string => {
  const scheme = url.split('://', 1)[0];
  const splittedUrl = [scheme, url.slice(scheme.length + 3)];

  if (Platform.OS === 'ios') {
    return scheme === 'itmss' ? `https://${splittedUrl[1]}` : url;
  }

  if (
    Platform.OS === 'android' &&
    !['http', 'https', 'about:blank'].includes(scheme) &&
    scheme.includes('intent')
  ) {
    const intentUrl = splittedUrl[1].split('#Intent;');
    const host = intentUrl[0];
    const args = intentUrl[1].split(';');

    if (scheme !== 'intent') {
      return `${scheme.split(':')[1]}://${host}`;
    }

    const argsScheme = args.find((elm) => elm.startsWith('scheme'));

    if (argsScheme) {
      return `${argsScheme.split('=')[1]}://${host}`;
    }
  }
  return url;
};

const toDataVolumeString = (dataVolume: number): string => {
  if (dataVolume < 1024) return `${dataVolume.toFixed(0)}MB`;
  return `${(dataVolume / 1024).toFixed(2)}GB`;
};

const toVersionStr = (version: string): number => {
  return version
    .split('.')
    .reduce(
      (accumulator, currentValue, idx, arr) =>
        accumulator + Number(currentValue) * 100 ** (arr.length - idx - 1),
      0,
    );
};

const compareVersion = (version1: string, version2: string): boolean => {
  return toVersionStr(version1) > toVersionStr(version2);
};

// 000001021035030 - 베트남 10일 무제한  -> 베트남 10일 무제한만 추출
const extractProdName = (str) => {
  const regex = / - (.+)$/;
  const match = str.match(regex);
  return match ? match[1] : str;
};

export const log = (str: string) => {
  // store.dispatch(ToastActions.push(Toast.NOT_LOADED));
  store.dispatch(appendLog(`$$$${moment().tz('Asia/Seoul').format()} :${str}`));
};

export const tlog = (str: string) => {
  store.dispatch(
    appendTalkLog(`$$$${moment().tz('Asia/Seoul').format()} :${str}`),
  );
};

export default {
  fontScaling,
  numberToCommaString,
  dlvCost,
  stringToNumber,
  isExist,
  price,
  pricePerDay,
  toPhoneNumber,
  toICCID,
  toSegmentedString,
  htmlToString,
  toDateString,
  toDate,
  extractProdName,
  stringToCurrency,
  priceToCurrency,
  toCurrency,
  addCurrency,
  currencyString,
  convertURLtoRkbImage,
  convertFileURLtoRkbImage,
  convertCropImageToRkbImage,
  removeBracketOfName,
  generateKey,
  getParam,
  intentToUrl,
  toDataVolumeString,
  compareVersion,
  cmpMomentAsc,
  cmpMomentDesc,
  log,
  tlog,
};
