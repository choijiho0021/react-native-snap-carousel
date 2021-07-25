import _ from 'underscore';
import moment from 'moment-with-locales-es6';
import i18n from '@/utils/i18n';

const dateTimeFmt = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})*$/;
moment.locale(i18n.locale);

const numberToCommaString = (n?: number): string => {
  if (typeof n !== 'undefined' && n.toString()) {
    return n
      .toString()
      .replace(/,/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return n ? n.toString() : '';
};

const dlvCost = (totalPrice: number) => {
  return totalPrice < 30000 && totalPrice > 0 ? 3000 : 0;
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

const price = (num: number | string | undefined): string => {
  if (_.isNumber(num)) return `${numberToCommaString(num)} ${i18n.t('won')}`;

  if (_.isString(num)) {
    const str = stringToNumber(num);
    return str ? `${numberToCommaString(str)} ${i18n.t('won')}` : '';
  }

  return '';
};

const pricePerDay = (num: number | string | undefined, days: number) => {
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
      .replace(/<br>/gi, '\n\n')
      .replace(/<br\/>/gi, '\n\n')
      .replace(/&lt;br\/&gt;/gi, '\n\n')
      .replace(/&amp;lt;br\/&amp;gt;/gi, '\n\n')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#039;/g, "'")
      .replace(/<\/p>/gi, '\n\n')
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

const toDateString = (str: string | object, fmt = 'LLL'): string => {
  if (typeof str === 'string') {
    const dt = toDate(str);
    return dt?.format(fmt) || '';
  }

  if (typeof str === 'object') return str.format(fmt);

  return '';
};

export default {
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
};
