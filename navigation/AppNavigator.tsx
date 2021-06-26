import React, {memo} from 'react';
import Analytics from 'appcenter-analytics';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {actions as cartActions} from '@/redux/modules/cart';
import Env from '@/environment';
import MainTabNavigator from './MainTabNavigator';
import EsimMainTabNavigator from './EsimMainTabNavigator';
import AuthStackNavigator from './AuthStackNavigator';

const {esimApp} = Env.get();

const MainStack = createStackNavigator();

const getActiveRouteName = (state): string => {
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

const CreateAppContainer = ({store}) => {
  const navigationRef = React.useRef();
  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(state) => {
        const lastTab = getActiveRouteName(state);
        Analytics.trackEvent('Page_View_Count', {page: lastTab});
        store.dispatch(cartActions.pushLastTab(lastTab));
      }}>
      {mainStack()}
    </NavigationContainer>
  );
};

export default memo(CreateAppContainer);
