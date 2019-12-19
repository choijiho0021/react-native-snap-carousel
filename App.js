import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'

import AppNavigator from './navigation/AppNavigator';
import reducer from './redux/index'
import ReduxThunk from 'redux-thunk'
import penderMiddleware from 'redux-pender'
import { createLogger } from 'redux-logger'


import MyAppLoading from './components/MyAppLoading'
import Constants from 'expo-constants';
import Video from 'react-native-video'
import userApi from './utils/api/userApi';
import utils from './utils/utils';
import * as accountActions from './redux/modules/account'
import * as productActions from './redux/modules/product'
import * as simActions from './redux/modules/sim'

const logger = createLogger()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
  applyMiddleware( logger, ReduxThunk, penderMiddleware())
  //applyMiddleware( ReduxThunk, penderMiddleware())
  ))

let SplashScreen = undefined
if ( Constants.appOwnership !== 'expo') {
  SplashScreen = require('react-native-splash-screen').default;
}

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [showSplash, setShowSplash] = useState(true)

  // load product list
  store.dispatch(productActions.getProdList())
  store.dispatch(simActions.getSimCardList())

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
  } 
  else {
    if ( SplashScreen) SplashScreen.hide()

    setTimeout (() => {
      setShowSplash(false)
    }, 3000)

    // showSplash == true 인 경우에만 1번 로그인 한다.
    if (showSplash) login()

    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {
            showSplash && Constants.appOwnership !== 'expo' ?
              <Video source={require('./assets/images/rokebi_intro.mp4')}   
                style={styles.backgroundVideo} /> :
              <AppNavigator />
          }
        </View>
      </Provider>
    );
  }
}

async function login() {
    const iccid = await utils.retrieveData( userApi.KEY_ICCID)
    const mobile = await utils.retrieveData( userApi.KEY_MOBILE)
    const pin = await utils.retrieveData( userApi.KEY_PIN)

    console.log('load', mobile, pin, iccid)

    if ( mobile && pin ) {
      store.dispatch(accountActions.logInAndGetAccount( mobile, pin, iccid))
    }
    else {
      store.dispatch(accountActions.getToken())
    }
}

async function loadResourcesAsync() {
}

function handleLoadingError(error: Error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
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
  }
});
