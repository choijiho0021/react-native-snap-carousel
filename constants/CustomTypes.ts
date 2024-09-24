import {Map} from 'immutable';
import i18n from '@/utils/i18n';

const checkEng = /[a-zA-Z]/; // 영어
const checkKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글
const checkSpecial = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자

const doubleKor = [
  ['ㄱ', 'ㄲ'],
  // ['ㄴ'],
  ['ㄷ', 'ㄸ'],
  // ['ㄹ'],
  // ['ㅁ'],
  ['ㅂ', 'ㅃ'],
  ['ㅅ', 'ㅆ'],
  // ['ㅇ'],
  ['ㅈ', 'ㅉ'],
  // ['ㅊ'],
  // ['ㅋ'],
  // ['ㅌ'],
  // ['ㅍ'],
  // ['ㅎ'],
];

const sectionKeys = [
  {
    key: 'ㄱ',
    title: 'ㄱ',
    data: [],
  },
  {
    key: 'ㄴ',
    title: 'ㄴ',
    data: [],
  },
  {
    key: 'ㄷ',
    title: 'ㄷ',
    data: [],
  },
  {
    key: 'ㄹ',
    title: 'ㄹ',
    data: [],
  },
  {
    key: 'ㅁ',
    title: 'ㅁ',
    data: [],
  },
  {
    key: 'ㅂ',
    title: 'ㅂ',
    data: [],
  },
  {
    key: 'ㅅ',
    title: 'ㅅ',
    data: [],
  },
  {
    key: 'ㅇ',
    title: 'ㅇ',
    data: [],
  },
  {
    key: 'ㅈ',
    title: 'ㅈ',
    data: [],
  },
  {
    key: 'ㅊ',
    title: 'ㅊ',
    data: [],
  },
  {
    key: 'ㅋ',
    title: 'ㅋ',
    data: [],
  },
  {
    key: 'ㅌ',
    title: 'ㅌ',
    data: [],
  },
  {
    key: 'ㅍ',
    title: 'ㅍ',
    data: [],
  },
  {
    key: 'ㅎ',
    title: 'ㅎ',
    data: [],
  },
  {
    key: 'A',
    title: 'A',
    data: [],
  },
  {
    key: 'B',
    title: 'B',
    data: [],
  },
  {
    key: 'C',
    title: 'C',
    data: [],
  },
  {
    key: 'D',
    title: 'D',
    data: [],
  },
  {
    key: 'E',
    title: 'E',
    data: [],
  },
  {
    key: 'F',
    title: 'F',
    data: [],
  },
  {
    key: 'G',
    title: 'G',
    data: [],
  },
  {
    key: 'H',
    title: 'H',
    data: [],
  },
  {
    key: 'I',
    title: 'I',
    data: [],
  },
  {
    key: 'J',
    title: 'J',
    data: [],
  },
  {
    key: 'K',
    title: 'K',
    data: [],
  },
  {
    key: 'L',
    title: 'L',
    data: [],
  },
  {
    key: 'M',
    title: 'M',
    data: [],
  },
  {
    key: 'N',
    title: 'N',
    data: [],
  },
  {
    key: 'O',
    title: 'O',
    data: [],
  },
  {
    key: 'P',
    title: 'P',
    data: [],
  },
  {
    key: 'Q',
    title: 'Q',
    data: [],
  },
  {
    key: 'R',
    title: 'R',
    data: [],
  },
  {
    key: 'S',
    title: 'S',
    data: [],
  },
  {
    key: 'T',
    title: 'T',
    data: [],
  },
  {
    key: 'U',
    title: 'U',
    data: [],
  },
  {
    key: 'V',
    title: 'V',
    data: [],
  },
  {
    key: 'W',
    title: 'W',
    data: [],
  },
  {
    key: 'X',
    title: 'X',
    data: [],
  },
  {
    key: 'Y',
    title: 'Y',
    data: [],
  },
  {
    key: 'Z',
    title: 'Z',
    data: [],
  },
  {
    key: '#',
    title: '#',
    data: [],
  },
];

class Toast {
  NOT_LOADED = 1;

  NOT_UPDATED = 2;

  NOT_OPENED = 3;

  COPY_SUCCESS = 4;

  messageMap = Map({
    [Toast.NOT_LOADED]: i18n.t('toast:failedToLoad'),
    [Toast.NOT_UPDATED]: i18n.t('toast:failedToUpdate'),
    [Toast.NOT_OPENED]: i18n.t('toast:failedToOpen'),
    [Toast.COPY_SUCCESS]: i18n.t('toast:copySuccess'),
  });

  mapToMessage(idx) {
    if (idx && this.messageMap.has(idx.toString())) {
      return this.messageMap.get(idx.toString());
    }

    return idx;
  }
}

export default new Toast();

export {checkEng, checkKor, checkSpecial, sectionKeys, doubleKor};
