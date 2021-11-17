import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {useEffect} from 'react';
import codePush from 'react-native-code-push';
import {Provider} from 'react-redux';
import {setI18nConfig} from '@/utils/i18n';
import Env from '@/environment';
import store from '@/store';
import AppComponent from './components/AppComponent';

const codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};
const {esimGlobal} = Env.get();

const App = ({skipLoadingScreen}: {skipLoadingScreen: boolean}) => {
  useEffect(() => {
    setI18nConfig();

    dynamicLinks()
      .getInitialLink()
      .then((l) => {
        analytics().logEvent(`${esimGlobal ? 'global' : 'esim'}_dynamic_utm`, {
          item: l?.utmParameters.utm_source,
          count: 1,
        });
      });
  }, []);

  return (
    <Provider store={store}>
      <AppComponent skipLoadingScreen={skipLoadingScreen} />
    </Provider>
  );
};

export default codePush(codePushOptions)(App);
