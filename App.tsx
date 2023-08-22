import React, {useEffect} from 'react';
import codePush from 'react-native-code-push';
import {Provider} from 'react-redux';
import {setI18nConfig} from '@/utils/i18n';
import store from '@/store';
import 'react-native-get-random-values'; // crypto.ts 동작에 필요
import AppComponent from './components/AppComponent';

const codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

const App = ({skipLoadingScreen}: {skipLoadingScreen: boolean}) => {
  useEffect(() => {
    setI18nConfig();
  }, []);

  return (
    <Provider store={store}>
      <AppComponent skipLoadingScreen={skipLoadingScreen} />
    </Provider>
  );
};

export default codePush(codePushOptions)(App);
