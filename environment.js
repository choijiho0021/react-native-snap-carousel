import { Platform } from 'react-native';

const impId = "imp53913318"
const codePushiOSStagLabel = "v63"
const codePushiOSProdLabel = "v0"
const codePushAndStagLabel = "v59"
const codePushAndProdLabel = "v0"
const channelId = "_nzQhxb"

const ENV = {
  dev: {
    // scheme: 'https',
    // rokApiUrl: "service.rokebi.com",
    // apiUrl: "api.rokebi.com",
    // baseUrl: "https://www.rokebi.com",
    scheme: 'http',
    rokApiUrl: "rokebi-svc-tb.ap-northeast-2.elasticbeanstalk.com",
    apiUrl: "esim2-tb-v2.ap-northeast-2.elasticbeanstalk.com",
    baseUrl: "http://esim2-tb-v2.ap-northeast-2.elasticbeanstalk.com",
    impId: impId,
    label: Platform.OS === 'ios' ? codePushiOSStagLabel : codePushAndStagLabel,
    channelId
  },
  staging: {
    scheme: 'http',
    rokApiUrl: "rokebi-svc-tb.ap-northeast-2.elasticbeanstalk.com",
    apiUrl: "esim2-tb-v1.ap-northeast-2.elasticbeanstalk.com",
    baseUrl: "http://esim2-tb-v1.ap-northeast-2.elasticbeanstalk.com",
    impId: impId,
    label: Platform.OS === 'ios' ? codePushiOSStagLabel : codePushAndStagLabel,
    channelId
  },
  prod: {
    scheme: 'https',
    rokApiUrl: "service.rokebi.com",
    apiUrl: "api.rokebi.com",
    baseUrl: "https://www.rokebi.com",
    impId: impId,
    label: Platform.OS === 'ios' ? codePushiOSProdLabel : codePushAndProdLabel,
    channelId
  }
};

export default function() {
  if ( process.env.NODE_ENV == 'production') return ENV.prod
  if ( process.env.NODE_ENV == 'staging') return ENV.staging
  return ENV.dev
}


