import store from '@/store';
import i18n, {setI18nConfig} from '@/utils/i18n';
import React, {useEffect} from 'react';
import {BackHandler, Linking, Platform} from 'react-native';
import codePush from 'react-native-code-push';
import RNExitApp from 'react-native-exit-app';
import VersionCheck from 'react-native-version-check';
import {Provider} from 'react-redux';
import AppAlert from './components/AppAlert';
import AppComponent from './components/AppComponent';

const codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

const App = ({skipLoadingScreen}: {skipLoadingScreen: boolean}) => {
  useEffect(() => {
    setI18nConfig();

    VersionCheck.needUpdate().then(async (res) => {
      if (res.isNeeded) {
        // if (res.currentVersion < '1.1.8') {
        //   AppAlert.info(
        //     i18n.t('noti:updateReq'),
        //     i18n.t('noti:updateTitleReq'),
        //     () => {
        //       // open store if update is needed.
        //       Linking.openURL(res.storeUrl).then((v) => {
        //         console.log('@@ v', v);
        //         if (v) {
        //           if (Platform.OS === 'ios') RNExitApp.exitApp();
        //           else BackHandler.exitApp();
        //         }
        //       });
        //     },
        //   );
        // } else {
        if (res.currentVersion < res.latestVersion)
          AppAlert.confirm(
            i18n.t('noti:updateTitle'),
            i18n.t('noti:updateOpt'),
            {
              ok: () => Linking.openURL(res.storeUrl),
            },
          );
        // }
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
