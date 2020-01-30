const impId = "imp53913318"

const ENV = {
  dev: {
    rokApiUrl: "simrm.ap-northeast-2.elasticbeanstalk.com",
    apiUrl: "esim2-tb-v1.ap-northeast-2.elasticbeanstalk.com",
    impId: impId
  },
  staging: {
    rokApiUrl: "simrm.ap-northeast-2.elasticbeanstalk.com",
    apiUrl: "esim2-tb-v1.ap-northeast-2.elasticbeanstalk.com",
    impId: impId
  },
  prod: {
    rokApiUrl: "service.rokebi.com",
    apiUrl: "api.rokebi.com",
    impId: impId
  }
};

export default function() {
  if ( process.env.NODE_ENV == 'production') return ENV.prod
  if ( process.env.NODE_ENV == 'staging') return ENV.staging
  return ENV.dev
}


