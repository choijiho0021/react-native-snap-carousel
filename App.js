import React, {useEffect, useState} from 'react';
import {BackHandler, Platform, StatusBar, StyleSheet, View} from 'react-native';
import codePush from 'react-native-code-push';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import Video from 'react-native-video';
import {Provider} from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import penderMiddleware from 'redux-pender';
import ReduxThunk from 'redux-thunk';
import {API} from 'RokebiESIM/submodules/rokebi-utils';
import AppAlert from './components/AppAlert';
import AppToast from './components/AppToast';
import CodePushModal from './components/CodePushModal';
import Env from './environment';
import AppNavigator from './navigation/AppNavigator';
import reducer from './redux/index';
import * as accountActions from './redux/modules/account';
import * as infoActions from './redux/modules/info';
import * as productActions from './redux/modules/product';
import * as promotionActions from './redux/modules/promotion';
import * as simActions from './redux/modules/sim';
import * as syncActions from './redux/modules/sync';
import i18n from './utils/i18n';
import utils from './utils/utils';

const {esimApp} = Env.get();

const logger = createLogger();
const composeEnhancers =
  (process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;
const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(logger, ReduxThunk, penderMiddleware()),
    // applyMiddleware( ReduxThunk, penderMiddleware())
  ),
);

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

export default codePush(codePushOptions)(function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!isLoadingComplete && !props.skipLoadingScreen) {
      try {
        loadResourcesAsync();
        setLoadingComplete(true);
      } catch (e) {
        handleLoadingError(e);
      }
    }
  }, [isLoadingComplete, props.skipLoadingScreen]);

  if (isLoadingComplete || props.skipLoadingScreen) {
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
              source={require('./assets/images/rokebi_intro.mp4')}
              style={styles.backgroundVideo}
              resizeMode="contain"
            />
          ) : (
            <AppNavigator store={store} />
          )}
          <CodePushModal />
          <AppToast />
        </View>
      </Provider>
    );
  }
  return null;
});

async function login() {
  const iccid = await utils.retrieveData(API.User.KEY_ICCID);
  const mobile = await utils.retrieveData(API.User.KEY_MOBILE);
  const pin = await utils.retrieveData(API.User.KEY_PIN);

  if (mobile && pin) {
    store.dispatch(accountActions.logInAndGetAccount(mobile, pin, iccid));
  } else {
    store.dispatch(accountActions.getToken());
  }
}

async function loadResourcesAsync() {
  // clear caches
  await store.dispatch(accountActions.clearCookies());
  await requestTrackingPermission();

  // load product list
  await store.dispatch(productActions.getProdListWithToast());
  await store.dispatch(promotionActions.getPromotion());

  if (!esimApp) {
    await store.dispatch(simActions.getSimCardList());
  }
  // 공지 사항 가져오기
  await store.dispatch(infoActions.getInfoList('info'));
  await store.dispatch(infoActions.getHomeInfoList('info:home'));
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
