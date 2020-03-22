import { Platform } from 'react-native';

const impId = "imp53913318"
const codePushiOSStagLabel = "v61"
const codePushiOSProdLabel = "v0"
const codePushAndStagLabel = "v57"
const codePushAndProdLabel = "v0"

const ENV = {
  dev: {
    // scheme: 'https',
    // rokApiUrl: "service.rokebi.com",
    // apiUrl: "api.rokebi.com",
    // baseUrl: "https://www.rokebi.com",
    scheme: 'http',
    rokApiUrl: "rokebi-svc-tb.ap-northeast-2.elasticbeanstalk.com",
    apiUrl: "esim2-tb-v1.ap-northeast-2.elasticbeanstalk.com",
    baseUrl: "http://esim2-tb-v1.ap-northeast-2.elasticbeanstalk.com",
    impId: impId,
    label: Platform.OS === 'ios' ? codePushiOSStagLabel : codePushAndStagLabel
  },
  staging: {
    scheme: 'http',
    rokApiUrl: "rokebi-svc-tb.ap-northeast-2.elasticbeanstalk.com",
    apiUrl: "esim2-tb-v1.ap-northeast-2.elasticbeanstalk.com",
    baseUrl: "http://esim2-tb-v1.ap-northeast-2.elasticbeanstalk.com",
    impId: impId,
    label: Platform.OS === 'ios' ? codePushiOSStagLabel : codePushAndStagLabel
  },
  prod: {
    scheme: 'https',
    rokApiUrl: "service.rokebi.com",
    apiUrl: "api.rokebi.com",
    baseUrl: "https://www.rokebi.com",
    impId: impId,
    label: Platform.OS === 'ios' ? codePushiOSProdLabel : codePushAndProdLabel
  }
};

export default function() {
  if ( process.env.NODE_ENV == 'production') return ENV.prod
  if ( process.env.NODE_ENV == 'staging') return ENV.staging
  return ENV.dev
}


