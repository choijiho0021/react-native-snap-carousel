import {Platform} from 'react-native';

const impId = 'imp53913318';

// rokebi esim App
const appId = 'rokebi';
const codePushiOSStagLabel = "v127"
const codePushiOSProdLabel = 'v0';
const codePushAndStagLabel = "v120"
const codePushAndProdLabel = 'v0';
const channelId = '_nzQhxb';

const env = {
  appId,
  impId,
  channelId,
  esimApp: appId === 'esim',
};

const ENV = {
  esim: {
    dev: {
      ...env,
      // scheme: 'https',
      // rokApiUrl: "service.rokebi.com",
      // apiUrl: "api.rokebi.com",
      // baseUrl: "https://www.rokebi.com",
      scheme: 'http',
      rokApiUrl: 'tb.service.rokebi.com',
      apiUrl: 'esim-tb-v1.ap-northeast-2.elasticbeanstalk.com',
      baseUrl: 'http://esim-tb-v1.ap-northeast-2.elasticbeanstalk.com',
      label:
        Platform.OS === 'ios' ? codePushiOSStagLabel : codePushAndStagLabel,
    },
    staging: {
      ...env,
      scheme: 'http',
      rokApiUrl: 'tb.service.rokebi.com',
      apiUrl: 'esim-tb-v1.ap-northeast-2.elasticbeanstalk.com',
      baseUrl: 'http://esim-tb-v1.ap-northeast-2.elasticbeanstalk.com',
      impId: impId,
      label:
        Platform.OS === 'ios' ? codePushiOSStagLabel : codePushAndStagLabel,
      channelId,
    },
    prod: {
      ...env,
      scheme: 'https',
      rokApiUrl: 'service.rokebi.com',
      apiUrl: 'esim.rokebi.com',
      baseUrl: 'https://esim.rokebi.com',
      impId: impId,
      label:
        Platform.OS === 'ios' ? codePushiOSStagLabel : codePushAndStagLabel,
      channelId,
    },
  },
  rokebi: {
    dev: {
      ...env,
      // scheme: 'https',
      // rokApiUrl: "service.rokebi.com",
      // apiUrl: "api.rokebi.com",
      // baseUrl: "https://www.rokebi.com",
      scheme: 'http',
      rokApiUrl: 'tb.service.rokebi.com',
      apiUrl: 'esim2-tb-v3.ap-northeast-2.elasticbeanstalk.com',
      baseUrl: 'http://esim-tb-v3.ap-northeast-2.elasticbeanstalk.com',
      label:
        Platform.OS === 'ios' ? codePushiOSStagLabel : codePushAndStagLabel,
    },
    staging: {
      ...env,
      scheme: 'http',
      rokApiUrl: 'tb.service.rokebi.com',
      apiUrl: 'esim2-tb-v3.ap-northeast-2.elasticbeanstalk.com',
      baseUrl: 'http://esim2-tb-v3.ap-northeast-2.elasticbeanstalk.com',
      label:
        Platform.OS === 'ios' ? codePushiOSStagLabel : codePushAndStagLabel,
    },
    prod: {
      ...env,
      scheme: 'https',
      rokApiUrl: 'service.rokebi.com',
      apiUrl: 'api.rokebi.com',
      baseUrl: 'https://www.rokebi.com',
      label:
        Platform.OS === 'ios' ? codePushiOSProdLabel : codePushAndProdLabel,
    },
  },
};

export default function() {
  if (process.env.NODE_ENV == 'production') return ENV[appId].prod;
  if (process.env.NODE_ENV == 'staging') return ENV[appId].staging;
  return ENV[appId].prod;
}
