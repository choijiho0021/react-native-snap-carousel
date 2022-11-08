import {Platform} from 'react-native';
import Config from 'react-native-config';
import {getBundleId} from 'react-native-device-info';
import {CurrencyCode} from './redux/api/productApi';

// getBuildNumber() > 현재 info.plist bundleVersion 확인 가능
const bundleId = getBundleId();

// rokebi esim App
const appId =
  bundleId === 'com.uangel.rokebi-USIM' || bundleId === 'com.rokebi.usim'
    ? 'usim'
    : 'esim';
const esimGlobal =
  (appId === 'esim' && bundleId === 'com.uangel.rokebi-global') ||
  bundleId === 'com.rokebi.global';

// global / esim 계정
let impId = esimGlobal ? 'imp60215393' : 'imp53913318';
const appStoreId = esimGlobal ? '' : '1525664178';

// Dynamic Link
const dynamicLink = 'https://rokebi.page.link';

// test 계정
impId = Config.NODE_ENV !== 'production' ? 'imp54175831' : impId;

const codePushLabel = {
  stagingIOS: 'v2',
  stagingAndroid: 'v2',
  productionIOS: 'v47',
  productionAndroid: 'v40',
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
  esimCurrency: CurrencyCode;
  label?: string;
  scheme?: string;
  apiUrl?: string;
  rokApiUrl?: string;
  sipServer: string;
  isProduction: boolean;
  isIOS?: boolean;
  fbUser?: string;
  webViewHost?: string;
  adjustToken: string;
  appStoreUrl: {
    ios: string;
    android: string;
  };
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
  esimCurrency: esimGlobal ? 'USD' : 'KRW',
  sipServer: '193.122.106.2:35060',
  isProduction: Config.NODE_ENV === 'production',
  isIOS: Platform.OS === 'ios',
  fbUser: '100751328128324',
  adjustToken: 'hu4tkjd8im0w',
  appStoreUrl: {
    ios: 'https://apps.apple.com/kr/app/%EB%A1%9C%EB%B0%8D%EB%8F%84%EA%B9%A8%EB%B9%84-esim-%EB%8D%B0%EC%9D%B4%ED%84%B0%EA%B0%80-%ED%95%84%EC%9A%94%ED%95%9C-%EC%88%9C%EA%B0%84/id1525664178',
    android: '',
  },
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
        env.webViewHost = esimGlobal
          ? 'https://www.rokebi.com/us'
          : 'https://www.rokebi.com';
        break;
      default:
        env.scheme = 'http';
        env.rokApiUrl = 'tb-svcapp.rokebi.com';
        env.apiUrl = esimGlobal ? 'tb-global.rokebi.com' : 'tb-esim.rokebi.com';
        env.webViewHost = esimGlobal
          ? 'http://tb.rokebi.com/us'
          : 'http://tb.rokebi.com';
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
      env.webViewHost = 'http://rokebi.com';
      break;
    default:
      env.scheme = 'http';
      env.rokApiUrl = 'svcapp.rokebi.com';
      env.apiUrl = 'tb-usim.rokebi.com';
      env.webViewHost = 'http://tb.rokebi.com';
      break;
  }
  return env;
}

export default {get};
