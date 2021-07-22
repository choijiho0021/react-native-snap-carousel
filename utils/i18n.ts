import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import {EventEmitter} from 'events';

export const i18nEvent = new EventEmitter();

export const setI18nConfig = () => {
  const fallback = {languageTag: 'ko'};
  const {languageTag} =
    RNLocalize.findBestAvailableLanguage(['ko', 'en']) || fallback;

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
};

export default i18n;
