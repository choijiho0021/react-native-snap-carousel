import {Platform} from 'react-native';

const impId = 'imp53913318';

// rokebi esim App
const appId = 'esim';
const codePushLabel = {
  stagingIOS: 'v56',
  stagingAndroid: 'v55',
  productionIOS: "v13",
  productionAndroid: "v6",
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
      scheme: 'http',
      rokApiUrl: 'tb.service.rokebi.com',
      apiUrl: 'esim-tb-v1.ap-northeast-2.elasticbeanstalk.com',
      baseUrl: 'http://esim-tb-v1.ap-northeast-2.elasticbeanstalk.com',
      impId,
      label:
        Platform.OS === 'ios'
          ? codePushLabel.stagingIOS
          : codePushLabel.stagingAndroid,
    },
    prod: {
      scheme: 'https',
      rokApiUrl: 'svcapp.rokebi.com',
      apiUrl: 'esim.rokebi.com',
      baseUrl: 'https://esim.rokebi.com',
      impId,
      label:
        Platform.OS === 'ios'
          ? codePushLabel.productionIOS
          : codePushLabel.productionAndroid,
    },
  },
  rokebi: {
    dev: {
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
    this.env = Env.appEnv('esim');
  }

  setAppIdByIccid(iccid) {
    this.env = Env.appEnv(iccid.substr(0, 8) === '00001111' ? 'esim' : 'usim');
  }

  get() {
    return this.env;
  }

  static appEnv(app) {
    if (ENV[app]) {
      const appEnv =
        ENV[app][
          // eslint-disable-next-line no-nested-ternary
          process.env.NODE_ENV === 'production'
            ? 'prod'
            : process.env.NODE_ENV === 'staging'
            ? 'staging'
            : 'dev'
        ];

      return {
        ...appEnv,
        ...env,
        sipServer: '193.122.106.2:35060',
      };
    }
    return env;
  }
}

export default new Env();
