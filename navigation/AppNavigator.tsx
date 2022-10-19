import analytics from '@react-native-firebase/analytics';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {memo, useCallback, useEffect} from 'react';
import SimCardsManagerModule from 'react-native-sim-cards-manager';
import DeviceInfo from 'react-native-device-info';
import Env from '@/environment';
import {actions as cartActions} from '@/redux/modules/cart';
import {actions as promotionActions} from '@/redux/modules/promotion';
import {actions as accountActions} from '@/redux/modules/account';
import {actions as linkActions} from '@/redux/modules/link';
import AuthStackNavigator from './AuthStackNavigator';
import EsimMainTabNavigator from './EsimMainTabNavigator';
import {
  requestPermission,
  checkFistLaunch,
} from '@/navigation/component/permission';

const {isIOS, esimGlobal} = Env.get();

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
      <MainStack.Screen name="Main" component={EsimMainTabNavigator} />
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

  const gift = useCallback(
    (url: string) => {
      const json = getParam(url);
      // gift 금액은 서버에서 처리
      if (url.includes('recommender') && navigationRef?.current) {
        const {loggedIn, userId} = store.getState().account;

        if (loggedIn) {
          if (userId !== json?.recommender) {
            store.dispatch(
              accountActions.receiveAndGetGift({
                sender: json?.recommender,
                gift: json?.gift, // 선물하기 - 상품
              }),
            );
          }
        } else {
          store.dispatch(
            promotionActions.saveGiftAndRecommender({
              recommender: json?.recommender,
              gift: json?.gift,
            }),
          );
        }

        if (url.includes('gift')) {
          navigationRef.current.navigate('EsimStack', {
            screen: 'Esim',
          });
        } else {
          navigationRef.current.navigate('MyPageStack', {
            screen: 'MyPage',
          });
        }
      }
    },
    [store],
  );

  const checkSupportIos = useCallback(() => {
    const DeviceId = DeviceInfo.getDeviceId();

    if (DeviceId.startsWith('AppleTV')) return false;

    if (DeviceId.startsWith('iPhone'))
      return DeviceId.length >= 10 && DeviceId.localeCompare('iPhone11,1') >= 0;

    if (DeviceId.startsWith('iPad')) {
      // 가능한 iPad목록
      const enableIpadList = [
        'iPad4,2',
        'iPad4,3',
        'iPad5,4',
        'iPad7,12',
        'iPad8,3',
        'iPad8,4',
        'iPad8,7',
        'iPad8,8',
        'iPad11,2',
        'iPad11,4',
        'iPad13,2',
      ];

      return (
        enableIpadList.includes(DeviceId) ||
        (DeviceId.length >= 8 && DeviceId.localeCompare('iPad13,2') >= 0)
      );
    }

    return true;
  }, []);

  const getIsSupport = useCallback(async () => {
    let isSupport = true;
    if (isIOS) {
      isSupport = checkSupportIos();
    } else {
      isSupport = await SimCardsManagerModule.isEsimSupported();
    }

    if (isSupport) {
      requestPermission();
    }

    isSupport = true;
    const deviceModel = DeviceInfo.getModel();
    const isFirst = await checkFistLaunch();

    DeviceInfo.getDeviceName().then((name) => {
      const deviceFullName = `${deviceModel},${name}`;

      store.dispatch(
        accountActions.updateAccount({
          isSupportDev: isSupport,
          deviceModel: deviceFullName,
          isFirst,
        }),
      );
    });

    return isSupport;
  }, [checkSupportIos, store]);

  const DynamicLinkSave = useCallback(
    async (l: FirebaseDynamicLinksTypes.DynamicLink) => {
      if (l?.url) {
        const url = l?.url.split(/[;?&]/);
        url.shift();
        const param = url.map((elm) => `"${elm.replace('=', '":"')}"`);
        const json = JSON.parse(`{${param.join(',')}}`);

        store.dispatch(
          linkActions.update({
            utmParameters: l?.utmParameters,
            url: l?.url,
            ...json,
          }),
        );
      }

      if (l?.utmParameters) {
        analytics().logEvent(`${esimGlobal ? 'global' : 'esim'}_dynamic_utm`, {
          item: l?.utmParameters.utm_source,
          count: 1,
        });
      }
    },
    [store],
  );

  const handleDynamicLink = useCallback(
    async (link) => {
      let screen = link?.utmParameters?.utm_source;
      const url = link?.url;
      const isSupport = await getIsSupport();

      DynamicLinkSave(link);

      if (screen?.includes('Screen')) {
        screen = screen.replace('Screen', '');

        // Screen 별 동작 추가 - Home, Cart,Esim, MyPage 이동 가능
        if (
          isSupport &&
          navigationRef?.current &&
          ['Home', 'Cart', 'Esim', 'MyPage'].includes(screen)
        ) {
          navigationRef.current.navigate(`${screen}Stack`, {
            screen,
          });
        }
      } else if (isSupport && url) {
        gift(url);
      }
    },
    [DynamicLinkSave, getIsSupport, gift],
  );

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, [handleDynamicLink]);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((l) => handleDynamicLink(l));
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
