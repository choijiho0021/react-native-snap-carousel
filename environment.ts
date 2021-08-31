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
// 현재 test 목적(staging 용)으로 Production 기준으로 분리
const impId = Config.NODE_ENV === 'production' ? 'imp53913318' : 'imp60215393';
// const impId = esimGlobal ? 'imp60215393' : 'imp53913318';

// countryCode: "KR"
// languageTag: "en-KR"
// languageCode: "en"
const lc = RNLocalize.getLocales()[0];
// esim 이고 한국어가 아닌 경우 모두 esimEng
const esimEng = appId === 'esim' && !esimGlobal && lc.languageCode !== 'ko';

const codePushLabel = {
  stagingIOS: "v80",
  stagingAndroid: "v79",
  productionIOS: 'v20',
  productionAndroid: 'v13',
};
const channelId = '_nzQhxb';

type Env = {
  appId: string;
  impId: string;
  channelId: string;
  esimApp: boolean;
  esimGlobal: boolean;
  esimEng: boolean;
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
};
const env: Env = {
  appId,
  impId,
  channelId,
  esimApp: appId === 'esim',
  esimGlobal,
  esimEng,
  esimCurrency: esimGlobal ? 'USD' : 'KRW',
  sipServer: '193.122.106.2:35060',
  isProduction: Config.NODE_ENV === 'production',
  isIOS: Platform.OS === 'ios',
  fbUser: '100751328128324',
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
        env.apiUrl = esimGlobal ? 'tb-global.rokebi.com' : 'esim.rokebi.com';
        env.baseUrl = esimGlobal
          ? 'http://tb-global.rokebi.com'
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
