import {Platform} from 'react-native';

const impId = 'imp53913318';

// rokebi esim App
const appId = 'esim';
const codePushLabel = {
  stagingIOS: 'v38',
  stagingAndroid: 'v38',
  productionIOS: 'v0',
  productionAndroid: 'v0',
};
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
      // scheme: 'http',
      // rokApiUrl: 'svcapp.rokebi.com',
      // apiUrl: 'esim.rokebi.com',
      // baseUrl: 'http://esim.rokebi.com',
      scheme: 'https',
      rokApiUrl: 'svcapp.rokebi.com',
      apiUrl: 'esim.rokebi.com',
      baseUrl: 'https://esim.rokebi.com',
      label:
        Platform.OS === 'ios'
          ? codePushLabel.stagingIOS
          : codePushLabel.stagingAndroid,
    },
    staging: {
      ...env,
      scheme: 'http',
      rokApiUrl: 'tb.service.rokebi.com',
      apiUrl: 'esim-tb-v1.ap-northeast-2.elasticbeanstalk.com',
      baseUrl: 'http://esim-tb-v1.ap-northeast-2.elasticbeanstalk.com',
      impId: impId,
      label:
        Platform.OS === 'ios'
          ? codePushLabel.stagingIOS
          : codePushLabel.stagingAndroid,
    },
    prod: {
      ...env,
      scheme: 'https',
      rokApiUrl: 'svcapp.rokebi.com',
      apiUrl: 'esim.rokebi.com',
      baseUrl: 'https://esim.rokebi.com',
      impId: impId,
      label:
        Platform.OS === 'ios'
          ? codePushLabel.productionIOS
          : codePushLabel.productionAndroid,
    },
  },
  rokebi: {
    dev: {
      ...env,
      scheme: 'https',
      rokApiUrl: 'svcapp.rokebi.com',
      apiUrl: 'usim.rokebi.com',
      baseUrl: 'https://usim.rokebi.com',
      // scheme: 'http',
      // rokApiUrl: 'tb.service.rokebi.com',
      // apiUrl: 'esim2-tb-v3.ap-northeast-2.elasticbeanstalk.com',
      // baseUrl: 'http://esim-tb-v3.ap-northeast-2.elasticbeanstalk.com',
      label:
        Platform.OS === 'ios'
          ? codePushLabel.stagingIOS
          : codePushLabel.stagingAndroid,
    },
    staging: {
      ...env,
      scheme: 'http',
      rokApiUrl: 'tb.service.rokebi.com',
      apiUrl: 'esim2-tb-v3.ap-northeast-2.elasticbeanstalk.com',
      baseUrl: 'http://esim2-tb-v3.ap-northeast-2.elasticbeanstalk.com',
      label:
        Platform.OS === 'ios'
          ? codePushLabel.stagingIOS
          : codePushLabel.stagingAndroid,
    },
    prod: {
      ...env,
      scheme: 'https',
      rokApiUrl: 'svcapp.rokebi.com',
      apiUrl: 'usim.rokebi.com',
      baseUrl: 'https://usim.rokebi.com',
      label:
        Platform.OS === 'ios'
          ? codePushLabel.productionIOS
          : codePushLabel.productionAndroid,
    },
  },
};

class Env {
  constructor() {
    this.env = this.Env('esim');
  }

  setAppIdByIccid(iccid) {
    this.env = this.Env(iccid.substr(0, 8) === '00001111' ? 'esim' : 'usim');
  }

  get() {
    return this.env;
  }

  Env(appId) {
    const env =
      process.env.NODE_ENV == 'production'
        ? ENV[appId].prod
        : process.env.NODE_ENV == 'staging'
        ? ENV[appId].staging
        : ENV[appId].dev;

    return {
      ...env,
      appId: appId,
      impId,
      channelId,
      esimApp: appId === 'esim',
      sipServer: '193.122.106.2:35060',
    };
  }
}

export default new Env();
