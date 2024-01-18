import {Platform} from 'react-native';
import Config from 'react-native-config';
import {getBundleId} from 'react-native-device-info';
import {CurrencyCode} from './redux/api/productApi';

const codePushLabel = {
  stagingIOS: 'v118',
  stagingAndroid: 'v107',
  productionIOS: 'v47',
  productionAndroid: 'v40',
};

// 보안정보 json 파일 읽음 - 없는 경우 에러 * 깃에 푸시하지 말 것
const secureData = require('./secure.json');

// getBuildNumber() > 현재 info.plist bundleVersion 확인 가능
const bundleId = getBundleId();

// rokebi esim App
const appId = Config.APP_ID;

const esimGlobal = Config.APP_ID === 'global';

// global / esim 계정
let impId = esimGlobal ? 'imp60215393' : 'imp53913318';
const appStoreId = esimGlobal ? '' : '1525664178';

const iosBundleId = esimGlobal
  ? 'com.uangel.rokebi-global'
  : 'com.uangel.rokebi-ESIM';

// Dynamic Link
const dynamicLink = 'https://rokebi.page.link';

const isProduction = Config.NODE_ENV === 'production';

// test 계정
impId = isProduction ? impId : 'imp54175831';

type PromoFlag =
  | 'hot'
  | 'sale'
  | 'sizeup'
  | 'doubleSizeup'
  | 'tripleSizeup'
  | 'fiveG';
const specialCategories: Record<string, PromoFlag> = esimGlobal
  ? isProduction
    ? {
        53: 'hot', // 운용자 추천
        57: 'sale', // 할인
        167: 'sizeup', // 사이즈업
        168: 'doubleSizeup', // 더블 사이즈업
      }
    : {
        53: 'hot', // 운용자 추천
        57: 'sale', // 할인
        420: 'sizeup', // 사이즈업
        421: 'doubleSizeup', // 더블 사이즈업
      }
  : isProduction
  ? {
      53: 'hot', // 운용자 추천
      57: 'sale', // 할인
      181: 'sizeup', // 사이즈업
      182: 'doubleSizeup', // 더블 사이즈업
      452: 'tripleSizeup', // 트리플 사이즈업
      459: 'fiveG', // 5G
    }
  : {
      53: 'hot', // 운용자 추천
      57: 'sale', // 할인
      181: 'sizeup', // 사이즈업
      182: 'doubleSizeup', // 더블 사이즈업
      746: 'tripleSizeup', // 트리플 사이즈업
      749: 'fiveG', // 5G
    };

type Env = {
  label?: string;
  scheme?: string;
  apiUrl?: string;
  rokApiUrl?: string;
  webViewHost?: string;
  iosBundleId: string; // android에서 참조용
  bundleId: string; // 현재 핸드폰의 번들 id
  appId: string;
  impId: string;
  appStoreId: string;
  dynamicLink: string;
  esimGlobal: boolean;
  isIOS?: boolean;
  esimApp: boolean;
  esimCurrency: CurrencyCode;
  isProduction: boolean;
  appStoreUrl: {
    ios: string;
    android: string;
  };

  // secure.json 참조
  fbUser?: string;
  channelId: string;
  sipServer: string;
  adjustToken: string;
  impKey: string;
  impSecret: string;
  talkPluginKey: string;
  specialCategories: Record<string, PromoFlag>;
  payment: {
    inicis: Record<string, string>;
    hecto: Record<string, string>;
  };
  cachePrefix: string;
};

const env: Env = {
  bundleId,
  iosBundleId,
  appId,
  impId,
  appStoreId,
  dynamicLink,
  esimGlobal,
  isIOS: Platform.OS === 'ios',
  esimApp: appId === 'esim',
  esimCurrency: esimGlobal ? 'USD' : 'KRW',
  isProduction,
  appStoreUrl: {
    ios: 'https://apps.apple.com/kr/app/%EB%A1%9C%EB%B0%8D%EB%8F%84%EA%B9%A8%EB%B9%84-esim-%EB%8D%B0%EC%9D%B4%ED%84%B0%EA%B0%80-%ED%95%84%EC%9A%94%ED%95%9C-%EC%88%9C%EA%B0%84/id1525664178',
    android: 'https://play.google.com/store/apps/details?id=com.rokebiesim',
  },
  fbUser: secureData.fbUser,
  channelId: secureData.kakaoChannelId,
  sipServer: secureData.sipServer,
  adjustToken: secureData.adjustToken,
  impKey: esimGlobal ? secureData.globalImpKey : secureData.esimImpKey,
  impSecret: esimGlobal ? secureData.globalImpSecret : secureData.esimImpSecret,
  talkPluginKey: secureData.talkPluginKey,
  payment:
    isProduction && secureData.payment
      ? secureData.payment
      : {
          inicis: {
            MID: 'INIpayTest', // inicis test key
            HASHKEY: '3CB8183A4BE283555ACC8363C0360223',
          },
          hecto: {
            PG_MID: 'nx_mid_il',
            LICENSE_KEY: 'ST1009281328226982205',
            AES256_KEY: 'pgSettle30y739r82jtd709yOfZ2yK5K',
          },
        },
  specialCategories,
  cachePrefix: `${esimGlobal ? 'g.' : ''}${isProduction ? '' : 'd.'}`,
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

  // if (appId === 'esim' || appId === 'global') {
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

export default {get};
