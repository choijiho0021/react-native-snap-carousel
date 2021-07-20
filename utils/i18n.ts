import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';

const translationGetters = {
  // en: () => require('../constants/locale/en.json'),
  ko: () => require('../constants/locale/ko.json'),
};

export const setI18nConfig = () => {
  const fallback = {languageTag: 'ko'};
  const {languageTag} =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // translate.cache.clear();
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
  i18n.lang = i18n.locale.substr(0, 2);
};

export default i18n;
