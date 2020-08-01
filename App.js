import React, {useState} from 'react';
import {Platform, StatusBar, StyleSheet, View, BackHandler} from 'react-native';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';

import AppNavigator from './navigation/AppNavigator';
import reducer from './redux/index';
import ReduxThunk from 'redux-thunk';
import penderMiddleware from 'redux-pender';
import {createLogger} from 'redux-logger';

import MyAppLoading from './components/MyAppLoading';
import Video from 'react-native-video';
import utils from './utils/utils';
import * as accountActions from './redux/modules/account';
import * as productActions from './redux/modules/product';
import * as promotionActions from './redux/modules/promotion';
import * as infoActions from './redux/modules/info';
import * as simActions from './redux/modules/sim';
import * as syncActions from './redux/modules/sync';
import CodePushModal from './components/CodePushModal';
import codePush from 'react-native-code-push';
import AppAlert from './components/AppAlert';
import i18n from './utils/i18n';
import AppToast from './components/AppToast';
import {API} from 'Rokebi/submodules/rokebi-utils';
import getEnvVars from './environment';
const {esimApp} = getEnvVars();

const logger = createLogger();
const composeEnhancers =
  (process.env.NODE_ENV == 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;
const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(logger, ReduxThunk, penderMiddleware()),
    //applyMiddleware( ReduxThunk, penderMiddleware())
  ),
);

let SplashScreen = require('react-native-splash-screen').default;

const codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

export default codePush(codePushOptions)(function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  //아래 코드는 expo doc 참고후 사용 해야함. 아직은 experimental이라고 되어 있음
  //StyleSheet.setStyleAttributePreprocessor('fontFamily', Font.processFontFamily);
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <MyAppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
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
  // load product list
  store.dispatch(productActions.getProdListWithToast());
  store.dispatch(promotionActions.getPromotion());

  if (!esimApp) {
    store.dispatch(simActions.getSimCardList());
  }
  // 공지 사항 가져오기
  store.dispatch(infoActions.getInfoList('info'));
  store.dispatch(infoActions.getHomeInfoList('info:home'));
}

function handleLoadingError(error: Error) {
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

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

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
