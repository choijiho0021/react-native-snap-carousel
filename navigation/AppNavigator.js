import React from 'react';
import Analytics from 'appcenter-analytics';
import * as cartActions from '../redux/modules/cart';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import MainTabNavigator from './MainTabNavigator';
import EsimMainTabNavigator from './EsimMainTabNavigator';
import CodePushStack from './CodePushStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import Env from '../environment';
const {esimApp} = Env.get();

const MainStack = createStackNavigator();

const getActiveRouteName = state => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

function mainStack() {
  return (
    <MainStack.Navigator
      screenOptions={{animationEnabled: false, headerShown: false}}>
      <MainStack.Screen
        name="Main"
        component={esimApp ? EsimMainTabNavigator : MainTabNavigator}
      />
      <MainStack.Screen name="Auth" component={AuthStackNavigator} />
    </MainStack.Navigator>
  );
}

function createAppContainer({store}) {
  const navigationRef = React.useRef();
  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={state => {
        const lastTab = getActiveRouteName(state);
        Analytics.trackEvent('Page_View_Count', {page: lastTab});
        store.dispatch(cartActions.pushLastTab(lastTab));
      }}>
      {mainStack()}
    </NavigationContainer>
  );
}

export default createAppContainer;
