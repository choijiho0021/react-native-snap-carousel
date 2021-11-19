import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {memo, useEffect} from 'react';
import Env from '@/environment';
import {actions as cartActions} from '@/redux/modules/cart';
import AuthStackNavigator from './AuthStackNavigator';
import EsimMainTabNavigator from './EsimMainTabNavigator';
import MainTabNavigator from './MainTabNavigator';

const {esimApp, esimGlobal} = Env.get();

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

  const handleDynamicLink = (link) => {
    let screen = link?.utmParameters?.utm_source;

    if (screen.includes('Screen')) screen = screen.replace('Screen', '');

    // Screen 별 동작 추가
    if (navigationRef?.current) {
      switch (screen) {
        case 'Esim':
          navigationRef.current.navigate('EsimStack', {
            screen,
          });
          break;
        default:
      }
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(async (l) => {
        if (l?.utmParameters) {
          analytics().logEvent(
            `${esimGlobal ? 'global' : 'esim'}_dynamic_utm`,
            {
              item: l?.utmParameters.utm_source,
              count: 1,
            },
          );
        }
      });
  }, []);

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
