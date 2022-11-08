import i18n from 'i18n-js';
import {EventEmitter} from 'events';
import moment from 'moment-with-locales-es6';
import Env from '@/environment';

const {esimGlobal} = Env.get();
export const i18nEvent = new EventEmitter();

export const setI18nConfig = () => {
  const languageTag = esimGlobal ? 'en' : 'ko';
  // const locales = RNLocalize.getLocales();
  // let languageTag = locales[0].languageCode;
  // if (!['en', 'ko'].includes(languageTag)) {
  //   languageTag = esimGlobal ? 'en' : 'ko';
  // }

  // translate.cache.clear();
  switch (languageTag) {
    case 'en':
      import('../constants/locale/en.json').then((en) => {
        i18n.translations = {en};
        i18nEvent.emit('loaded');
      });
      break;
    default:
    case 'ko':
      import('../constants/locale/ko.json').then((ko) => {
        i18n.translations = {ko};
        i18nEvent.emit('loaded');
      });
      break;
  }
  i18n.locale = languageTag;
  i18n.defaultLocale = languageTag;
  moment.locale(languageTag);
};

export default i18n;
