import React, {useEffect} from 'react';
import {Linking} from 'react-native';
import codePush from 'react-native-code-push';
import VersionCheck from 'react-native-version-check';
import {Provider} from 'react-redux';
import i18n, {setI18nConfig} from '@/utils/i18n';
import store from '@/store';
import AppAlert from './components/AppAlert';
import AppComponent from './components/AppComponent';

const codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

const App = ({skipLoadingScreen}: {skipLoadingScreen: boolean}) => {
  useEffect(() => {
    setI18nConfig();

    VersionCheck.needUpdate().then(async (res) => {
      if (res.isNeeded) {
        if (res.currentVersion < res.latestVersion)
          AppAlert.confirm(
            i18n.t('noti:updateTitle'),
            i18n.t('noti:updateOpt'),
            {
              ok: () => Linking.openURL(res.storeUrl),
            },
            i18n.t('noti:cancel'),
            i18n.t('noti:ok'),
          );
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <AppComponent skipLoadingScreen={skipLoadingScreen} />
    </Provider>
  );
};

export default codePush(codePushOptions)(App);
