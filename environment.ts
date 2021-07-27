import {Platform} from 'react-native';
import Config from 'react-native-config';
import {getBundleId} from 'react-native-device-info';

const bundleId = getBundleId();
const impId = 'imp53913318';

// rokebi esim App
const appId = bundleId === 'com.uangel.rokebi-USIM' ? 'usim' : 'esim';
const esimGlobal = appId === 'esim' && bundleId === 'com.uangel.rokebi-global';
const codePushLabel = {
  stagingIOS: 'v56',
  stagingAndroid: 'v55',
  productionIOS: 'v13',
  productionAndroid: 'v6',
};
const channelId = '_nzQhxb';

type Env = {
  appId: string;
  impId: string;
  channelId: string;
  esimApp: boolean;
  esimGlobal: boolean;
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
  sipServer: '193.122.106.2:35060',
  isProduction: Config.NODE_ENV === 'production',
  isIOS: Platform.OS === 'ios',
};

function get() {
  if (env.label) return env;

  env.label = env.isIOS
    ? codePushLabel.stagingIOS
    : codePushLabel.stagingAndroid;
  if (env.isProduction)
    env.label = env.isIOS
      ? codePushLabel.productionIOS
      : codePushLabel.productionAndroid;

  if (appId === 'esim') {
    switch (process.env.NODE_ENV) {
      case 'production':
        env.scheme = 'http';
        env.rokApiUrl = 'svcapp.rokebi.com';
        env.apiUrl = esimGlobal ? 'tb-global.rokebi.com' : 'tb-esim.rokebi.com';
        env.baseUrl = esimGlobal
          ? 'http://tb-global.rokebi.com'
          : 'http://tb-esim.rokebi.com';
        break;
      default:
        env.scheme = 'http';
        env.rokApiUrl = 'svcapp.rokebi.com';
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
  switch (process.env.NODE_ENV) {
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
