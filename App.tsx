import React, {useEffect, useState} from 'react';
import {BackHandler, Platform, StatusBar, StyleSheet, View} from 'react-native';
import codePush from 'react-native-code-push';
import Video from 'react-native-video';
import {Provider} from 'react-redux';
import {API} from '@/redux/api';
import AppAlert from '@/components/AppAlert';
import AppToast from '@/components/AppToast';
import CodePushModal from '@/components/CodePushModal';
import Env from '@/environment';
import AppNavigator from '@/navigation/AppNavigator';
import {actions as accountActions} from '@/redux/modules/account';
import {actions as infoActions} from '@/redux/modules/info';
import {actions as productActions} from '@/redux/modules/product';
import {actions as promotionActions} from '@/redux/modules/promotion';
import {actions as simActions} from '@/redux/modules/sim';
import {actions as syncActions} from '@/redux/modules/sync';
import {actions as cartActions, Store} from '@/redux/modules/cart';
import i18n, {setI18nConfig} from '@/utils/i18n';
import AsyncStorage from '@react-native-community/async-storage';
import {retrieveData} from '@/utils/utils';
import store from '@/store';

const {esimApp, esimGlobal} = Env.get();

const SplashScreen = require('react-native-splash-screen').default;

const codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

const App = ({skipLoadingScreen}: {skipLoadingScreen: boolean}) => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setI18nConfig();
  }, []);

  useEffect(() => {
    if (!isLoadingComplete && !skipLoadingScreen) {
      try {
        loadResourcesAsync();
        setLoadingComplete(true);
      } catch (e) {
        handleLoadingError(e);
      }
    }
  }, [isLoadingComplete, skipLoadingScreen]);

  if (isLoadingComplete || skipLoadingScreen) {
    if (SplashScreen) SplashScreen.hide();

    setTimeout(() => {
      store.dispatch(syncActions.skip());
      setShowSplash(false);
    }, 3000);

    // showSplash == true 인 경우에만 1번 로그인 한다.
    if (showSplash) login();

    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {showSplash ? (
            <Video
              source={
                esimGlobal
                  ? require('./assets/images/intro.mp4')
                  : require('./assets/images/rokebi_intro.mp4')
              }
              style={styles.backgroundVideo}
              resizeMode="contain"
            />
          ) : (
            <AppNavigator store={store} />
          )}
          {!showSplash && <CodePushModal />}
          <AppToast />
        </View>
      </Provider>
    );
  }
  return null;
};

async function login() {
  const iccid = await retrieveData(API.User.KEY_ICCID);
  const mobile = await retrieveData(API.User.KEY_MOBILE);
  const pin = await retrieveData(API.User.KEY_PIN);

  if (mobile && pin) {
    store.dispatch(accountActions.logInAndGetAccount({mobile, pin, iccid}));
  } else {
    store.dispatch(accountActions.getToken());
  }
}

async function loadResourcesAsync() {
  // get store info
  const st = await AsyncStorage.getItem('cart.store');
  store.dispatch(cartActions.setStore({store: st}));

  // clear caches
  await store.dispatch(accountActions.clearCookies());

  // load product list
  store.dispatch(productActions.getProd(st as Store));
  store.dispatch(productActions.getLocalOp());
  store.dispatch(promotionActions.getPromotion());

  if (!esimApp) {
    store.dispatch(simActions.getSimCardList());
  }
  // 공지 사항 가져오기
  store.dispatch(infoActions.getInfoList('info:home'));
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  const errorMsg =
    Platform.OS === 'ios'
      ? i18n.t('loading:failedToExec')
      : i18n.t('loading:terminate');

  AppAlert.error(errorMsg, i18n.t('loading:error'), () => {
    if (Platform.OS !== 'ios') {
      BackHandler.exitApp();
    }
  });

  console.warn(error);
}

export default codePush(codePushOptions)(App);
