import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';

export const setI18nConfig = () => {
  const fallback = {languageTag: 'ko'};
  const {languageTag} =
    RNLocalize.findBestAvailableLanguage(['ko', 'en']) || fallback;

  // translate.cache.clear();
  switch (languageTag) {
    case 'en':
      import('../constants/locale/en.json').then((en) => {
        i18n.translations = {en};
      });
      break;
    default:
    case 'ko':
      import('../constants/locale/ko.json').then((ko) => {
        i18n.translations = {ko};
      });
      break;
  }
  i18n.locale = languageTag;
  i18n.defaultLocale = languageTag;
};

export default i18n;
