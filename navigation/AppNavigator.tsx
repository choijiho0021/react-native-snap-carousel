import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {memo, useCallback, useEffect} from 'react';
import Env from '@/environment';
import {actions as cartActions} from '@/redux/modules/cart';
import AuthStackNavigator from './AuthStackNavigator';
import EsimMainTabNavigator from './EsimMainTabNavigator';
import MainTabNavigator from './MainTabNavigator';
import {API} from '@/redux/api';

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

  const getParam = (link: string) => {
    const url = link.split(/[;?&]/);
    url.shift();
    const param = url.map((elm) => `"${elm.replace('=', '":"')}"`);
    const json = JSON.parse(`{${param.join(',')}}`);
    return json;
  };

  const goTo = useCallback((res: string) => {
    navigationRef.current.setParams({
      giftRes: res?.result?.code === 0,
    });
    navigationRef.current.navigate('EsimStack', {
      screen: 'Esim',
    });
  }, []);

  const handleDynamicLink = useCallback(
    (link) => {
      let screen = link?.utmParameters?.utm_source;
      const url = link?.url;
      if (screen) {
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
      } else if (url) {
        const json = getParam(url);
        if (url.includes('recommender') && navigationRef?.current) {
          const {loggedIn, iccid, token} = store.getState().account;

          if (loggedIn) {
            API.User.receiveGift({
              sender: json?.recommender,
              gift: json?.gift,
              iccid,
              token,
            }).then((res) => goTo(res));
          } else {
            navigationRef.current.navigate('EsimStack', {
              screen: 'RegisterMobile',
              recommender: json?.recommender,
              gift: json?.gift,
            });
          }
        }
      }
    },
    [goTo, store],
  );

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, [handleDynamicLink]);

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
        handleDynamicLink(l);
      });
  }, [handleDynamicLink]);

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
