import {Platform} from 'react-native';
import Config from 'react-native-config';
import {getBundleId} from 'react-native-device-info';
import {CurrencyCode} from './redux/api/productApi';

const bundleId = getBundleId();
const impId = Config.NODE_ENV === 'production' ? 'imp53913318' : 'imp60215393';

// rokebi esim App
const appId = bundleId === 'com.uangel.rokebi-USIM' ? 'usim' : 'esim';
const esimGlobal = appId === 'esim' && bundleId === 'com.uangel.rokebi-global';
const codePushLabel = {
  stagingIOS: 'v66',
  stagingAndroid: 'v65',
  productionIOS: 'v18',
  productionAndroid: 'v11',
};
const channelId = '_nzQhxb';

type Env = {
  appId: string;
  impId: string;
  channelId: string;
  esimApp: boolean;
  esimGlobal: boolean;
  esimCurrency: CurrencyCode;
  label?: string;
  scheme?: string;
  apiUrl?: string;
  baseUrl?: string;
  rokApiUrl?: string;
  sipServer: string;
  isProduction: boolean;
  isIOS?: boolean;
};
const env: Env = {
  appId,
  impId,
  channelId,
  esimApp: appId === 'esim',
  esimGlobal,
  esimCurrency: esimGlobal ? 'USD' : 'KRW',
  sipServer: '193.122.106.2:35060',
  isProduction: Config.NODE_ENV === 'production',
  isIOS: Platform.OS === 'ios',
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
        env.scheme = 'http';
        env.rokApiUrl = 'tb-svcapp.rokebi.com';
        env.apiUrl = esimGlobal ? 'tb-global.rokebi.com' : 'tb-esim.rokebi.com';
        env.baseUrl = esimGlobal
          ? 'http://tb-global.rokebi.com'
          : 'http://tb-esim.rokebi.com';
        break;
      default:
        env.scheme = 'http';
        env.rokApiUrl = 'tb-svcapp.rokebi.com';
        env.apiUrl = esimGlobal ? 'tb-global.rokebi.com' : 'tb-esim.rokebi.com';
        env.baseUrl = esimGlobal
          ? 'http://tb-global.rokebi.com'
          : 'http://tb-esim.rokebi.com';
        // scheme: 'https',
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
