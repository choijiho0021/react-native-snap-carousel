import Constants from "expo-constants";

const rokApiHost = "simrm.ap-northeast-2.elasticbeanstalk.com"
const awsHost = "www.rokebi.com"
//const awsHost = "esim2-dev.ap-northeast-2.elasticbeanstalk.com"
//const awsHost = "localhost:8888"
const impId = "imp53913318"

const ENV = {
  dev: {
    rokApiUrl: rokApiHost,
    apiUrl: awsHost,
    impId: impId
  },
  staging: {
    rokApiUrl: rokApiHost,
    apiUrl: awsHost,
    impId: impId
  },
  prod: {
    rokApiUrl: rokApiHost,
    apiUrl: awsHost,
    impId: impId
  }
};

let getEnvVars
if (Constants.appOwnership === 'expo') {
  getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
    if (__DEV__) {
      return ENV.dev;
    } else if (env === 'staging') {
      return ENV.staging;
    } else if (env === 'prod') {
      return ENV.prod;
    }
    return ENV.dev;
  }
}
else {
  getEnvVars = () => {
    return ENV.dev
  }
}

export default getEnvVars;

