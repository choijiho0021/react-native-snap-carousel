import {Platform} from 'react-native';
import Config from 'react-native-config';
import {getBundleId} from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import {CurrencyCode} from './redux/api/productApi';

// getBuildNumber() > 현재 info.plist bundleVersion 확인 가능
const bundleId = getBundleId();

// rokebi esim App
const appId = bundleId === 'com.uangel.rokebi-USIM' ? 'usim' : 'esim';
const esimGlobal = appId === 'esim' && bundleId === 'com.uangel.rokebi-global';

// global / esim 계정
let impId = esimGlobal ? 'imp60215393' : 'imp53913318';
const appStoreId = esimGlobal ? '' : '1525664178';

// Dynamic Link
const dynamicLink = 'https://rokebi.page.link';

// test 계정
impId = Config.NODE_ENV !== 'production' ? 'imp54175831' : impId;

// countryCode: "KR"
// languageTag: "en-KR"
// languageCode: "en"
const lc = RNLocalize.getLocales()[0];
// 한국어가 아닌 경우 isEng = true
const isEng = lc.languageCode !== 'ko';

const codePushLabel = {
  stagingIOS: 'v104',
  stagingAndroid: 'v94',
  productionIOS: "v47",
  productionAndroid: "v40",
};
const channelId = '_nzQhxb';

type Env = {
  bundleId: string;
  appId: string;
  impId: string;
  appStoreId: string;
  dynamicLink: string;
  channelId: string;
  esimApp: boolean;
  esimGlobal: boolean;
  isEng: boolean;
  esimCurrency: CurrencyCode;
  label?: string;
  scheme?: string;
  apiUrl?: string;
  baseUrl?: string;
  rokApiUrl?: string;
  sipServer: string;
  isProduction: boolean;
  isIOS?: boolean;
  fbUser?: string;
  adjustToken?: string;
  adjustSignUp?: string;
  adjustPayment?: string;
  adjustRokebiCash?: string;
  adjustInvite?: string;
  adjustAppUpdate?: string;
};
const env: Env = {
  bundleId,
  appId,
  impId,
  appStoreId,
  dynamicLink,
  channelId,
  esimApp: appId === 'esim',
  esimGlobal,
  isEng,
  esimCurrency: esimGlobal ? 'USD' : 'KRW',
  sipServer: '193.122.106.2:35060',
  isProduction: Config.NODE_ENV === 'production',
  isIOS: Platform.OS === 'ios',
  fbUser: '100751328128324',

  // adjust
  adjustToken: 'bqh6jm4ljcao',
  adjustSignUp: '6cm0e4',
  adjustPayment: 'xg1smu',
  adjustRokebiCash: '5wu24b',
  adjustInvite: 'u3zo2x',
  adjustAppUpdate: 'r0masz',
};

function get() {
  if (env.label) return env;

  if (env.isProduction) {
    env.label = env.isIOS
      ? codePushLabel.productionIOS
      : codePushLabel.productionAndroid;
  } else {
    env.label = env.isIOS
      ? codePushLabel.stagingIOS
      : codePushLabel.stagingAndroid;
  }

  if (appId === 'esim') {
    switch (Config.NODE_ENV) {
      case 'production':
        env.scheme = 'https';
        env.rokApiUrl = 'svcapp.rokebi.com';
        env.apiUrl = esimGlobal ? 'global.rokebi.com' : 'esim.rokebi.com';
        env.baseUrl = esimGlobal
          ? 'https://global.rokebi.com'
          : 'https://esim.rokebi.com';
        break;
      default:
        env.scheme = 'http';
        env.rokApiUrl = 'tb-svcapp.rokebi.com';
        env.apiUrl = esimGlobal ? 'tb-global.rokebi.com' : 'tb-esim.rokebi.com';
        env.baseUrl = esimGlobal
          ? 'http://tb-global.rokebi.com'
          : 'http://tb-esim.rokebi.com';
        // scheme: 'https',
        // rokApiUrl:'svcapp.rokebi.com';
        // apiUrl: 'esim.rokebi.com',
        // baseUrl: 'https://esim.rokebi.com',
        break;
    }
    return env;
  }

  // appId = rokebi
  switch (Config.NODE_ENV) {
    case 'production':
      env.scheme = 'https';
      env.rokApiUrl = 'svcapp.rokebi.com';
      env.apiUrl = 'usim.rokebi.com';
      env.baseUrl = 'https://usim.rokebi.com';
      break;
    default:
      env.scheme = 'http';
      env.rokApiUrl = 'svcapp.rokebi.com';
      env.apiUrl = 'tb-usim.rokebi.com';
      env.baseUrl = 'http://tb-usim.rokebi.com';
      break;
  }
  return env;
}

export default {get};
