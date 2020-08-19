const getLocales = () => [
  // you can choose / add the locales you want
  {countryCode: 'KR', languageTag: 'ko-KR', languageCode: 'ko', isRTL: false},
  {countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false},
];

// use a provided translation, or return undefined to test your fallback
const findBestAvailableLanguage = () => ({
  languageTag: 'ko-KR',
  isRTL: false,
});

const getNumberFormatSettings = () => ({
  decimalSeparator: '.',
  groupingSeparator: ',',
});

const getCalendar = () => 'gregorian'; // or "japanese", "buddhist"
const getCountry = () => 'KR'; // the country code you want
const getCurrencies = () => ['USD', 'KRW']; // can be empty array
const getTemperatureUnit = () => 'celsius'; // or "fahrenheit"
const getTimeZone = () => 'Asia/Seoul'; // the timezone you want
const uses24HourClock = () => true;
const usesMetricSystem = () => true;

const addEventListener = jest.fn();
const removeEventListener = jest.fn();

export {
  findBestAvailableLanguage,
  getLocales,
  getNumberFormatSettings,
  getCalendar,
  getCountry,
  getCurrencies,
  getTemperatureUnit,
  getTimeZone,
  uses24HourClock,
  usesMetricSystem,
  addEventListener,
  removeEventListener,
};
