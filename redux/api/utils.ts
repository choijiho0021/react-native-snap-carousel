import Env from '@/environment';
import i18n from '@/utils/i18n';
import moment from 'moment-with-locales-es6';
import {Image} from 'react-native';
import {getFontScale} from 'react-native-device-info';
import RNFetchBlob from 'rn-fetch-blob';
import _ from 'underscore';
import {RkbImage} from './accountApi';
import {Currency, CurrencyCode} from './productApi';

const {esimCurrency} = Env.get();
const dateTimeFmt = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})*$/;
moment.locale(i18n.locale);

const fontScaling = async (size: number = 12): Promise<number> => {
  const scale = await getFontScale();
  if (scale) return size / scale;
  return size;
};

const numberToCommaString = (n?: number): string => {
  if (typeof n === 'number') {
    return n
      .toString()
      .replace(/,/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return typeof n === 'string' ? n : '';
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

const isExist = (value: any) => {
  return value !== undefined && value !== null && !Number.isNaN(value);
};

// 숫자만 입력 받기
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

const stringToCurrency = (value: string): Currency => {
  if (value.startsWith('USD')) {
    return {value: stringToNumber(value.substr(3)) || 0, currency: 'USD'};
  }

  if (value.startsWith('KRW')) {
    return {value: stringToNumber(value.substr(3)) || 0, currency: 'KRW'};
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

const toCurrency = (value: number, currency: CurrencyCode): Currency => ({
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

  return `${currencyString(num.value)} ${i18n.t(num.currency)}`;
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

//html5: <br> == <br/>, &lt;br/&gt; == <br/>
const htmlToString = (html?: string) => {
  return (
    html &&
    html
      .replace(/<br>/gi, '\n')
      .replace(/<br\/>/gi, '\n')
      .replace(/&lt;br\/&gt;/gi, '\n')
      .replace(/&amp;lt;br\/&amp;gt;/gi, '\n')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#039;/g, "'")
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]*>/gi, '')
      .replace(/\&nbsp;/gi, ' ')
  );
};

const toDate = (str: string) => {
  if (typeof str === 'string') {
    // m[1] == undefined 이면 date 정보 (yyyy-mm-dd) 형식이고,
    // m[1]이 정의되면, timezone 정보가 없는 경우이므로 UTC timezone flag 'Z'를 추가해서 처리한다.
    const m = str.match(dateTimeFmt);
    if (m) {
      if (m[1]) {
        return moment(`${str}Z`);
      }
      return moment(`${str}T00:00:00Z`);
    }
    return moment(str);
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

const convertURLtoRkbImage = async (url: string) => {
  const response = await RNFetchBlob.fetch('GET', url);
  const data = response.base64();
  return new Promise<RkbImage>((resolve, reject) => {
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
  stringToCurrency,
  priceToCurrency,
  toCurrency,
  addCurrency,
  currencyString,
  convertURLtoRkbImage,
};
