import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import analytics from '@react-native-firebase/analytics';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import SimCardsManagerModule from 'react-native-sim-cards-manager';
import DeviceInfo from 'react-native-device-info';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {EnhancedStore} from '@reduxjs/toolkit';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  View,
  StyleSheet,
  Linking,
} from 'react-native';
import {Adjust} from 'react-native-adjust';
import Env from '@/environment';
import {actions as cartActions} from '@/redux/modules/cart';
import {actions as promotionActions} from '@/redux/modules/promotion';
import {actions as accountActions} from '@/redux/modules/account';
import {actions as linkActions, urlParamObj} from '@/redux/modules/link';
import AuthStackNavigator from './AuthStackNavigator';
import EsimMainTabNavigator from './EsimMainTabNavigator';
import {
  requestPermission,
  checkFistLaunch,
} from '@/navigation/component/permission';
import utils from '@/redux/api/utils';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import {RootState} from '@/redux';
import {RkbPromotion} from '@/redux/api/promotionApi';
import {LinkModelState} from '../redux/modules/link';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import {API} from '@/redux/api';
import ProgressiveImage from '@/components/ProgressiveImage';
import i18n from '@/utils/i18n';
import {PromotionModelState} from '../redux/modules/promotion';

const {isIOS, esimGlobal} = Env.get();
const MainStack = createStackNavigator();

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  modalBtnContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: colors.clearBlue,
    height: 52,
  },
  closeWeek: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 18,
    height: 19,
    backgroundColor: 'white',
  },
});

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

type RegisterMobileScreenProps = {
  store: EnhancedStore;
  link: LinkModelState;
  promotion: PromotionModelState;
  actions: {
    modal: ModalAction;
  };
};

const CreateAppContainer: React.FC<RegisterMobileScreenProps> = ({
  store,
  link,
  promotion,
  actions,
}) => {
  const navigationRef = useNavigationContainerRef();
  const [iamgeHight, setImageHeight] = useState(450);
  const [checked, setChecked] = useState(false);
  const [popUpPromo, setPopUpPromo] = useState<RkbPromotion>();
  const [closedPopUp, setClosedPopUp] = useState<string[]>([]);
  const [lastRouteName, setLastRouteName] = useState<string>();
  const dimensions = useMemo(() => Dimensions.get('window'), []);

  const refNavigate = useCallback(
    ({
      stack,
      screen,
      initial,
      params,
    }: {
      stack: string;
      screen?: string;
      initial?: boolean;
      params?: object;
    }) => {
      if (navigationRef?.current) {
        if (screen)
          navigationRef.current.navigate(stack, {
            screen,
            initial,
            params,
          });
        else navigationRef.current.navigate(stack);
      }
    },
    [navigationRef],
  );

  const gift = useCallback(
    (url: string, json: urlParamObj) => {
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
          refNavigate({stack: 'EsimStack', screen: 'Esim'});
        } else {
          refNavigate({stack: 'MyPageStack', screen: 'MyPage'});
        }
      }
    },
    [navigationRef, refNavigate, store],
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
        (DeviceId.length >= 8 && DeviceId.localeCompare('iPad13,1') >= 0)
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

  const linkSave = useCallback(
    async ({
      url,
      params,
      utmParameters,
      deepLinkPath,
    }: {
      url?: string;
      params?: urlParamObj;
      deepLinkPath?: string;
      utmParameters?: any;
    }) => {
      if (url) {
        store.dispatch(
          linkActions.update({
            url,
            params,
            utmParameters,
            deepLinkPath,
          }),
        );
      }

      if (utmParameters) {
        analytics().logEvent(`${esimGlobal ? 'global' : 'esim'}_dynamic_utm`, {
          item: utmParameters?.utm_source,
          count: 1,
        });
      }
    },
    [store],
  );

  const handleDynamicLink = useCallback(
    async (dLink: FirebaseDynamicLinksTypes.DynamicLink | null) => {
      const url = dLink?.url;
      const params: urlParamObj = utils.getParam(url);
      const isSupport = await getIsSupport();

      linkSave({url, params, utmParameters: dLink?.utmParameters});

      if (
        isSupport &&
        navigationRef?.current &&
        params.hasOwnProperty('stack') &&
        params.hasOwnProperty('screen')
      ) {
        // Screen 별 동작 추가 - Home, Cart,Esim, MyPage 이동 가능
        refNavigate({
          stack: `${params?.stack}Stack`,
          screen: params?.screen,
          initial: false,
        });
      } else if (isSupport && url) {
        gift(url, params);
      }
    },
    [getIsSupport, gift, linkSave, navigationRef, refNavigate],
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

  const setPopupDisabled = useCallback(
    (popUp?: RkbPromotion) => {
      if (checked)
        AsyncStorage.setItem(
          `popupDisabled_${popUp?.uuid}`,
          moment().format('YYYY-MM-DD HH:mm'),
        );
    },
    [checked],
  );

  const handlePopUp = useCallback(
    (popUp?: RkbPromotion, isOkClose: boolean = false) => {
      if (isOkClose && navigationRef?.current) {
        if (popUp?.rule?.navigate) {
          if (popUp?.rule?.stack) {
            refNavigate({
              stack: popUp?.rule?.stack,
              screen: popUp.rule.navigate,
              initial: false,
            });
          } else if (popUp?.notice && popUp?.rule?.navigate === 'SimpleText') {
            navigationRef.current.navigate('SimpleText', {
              key: 'noti',
              title: i18n.t('set:noti'),
              bodyTitle: popUp.notice.title,
              body: popUp.notice.body,
              rule: popUp.rule,
              nid: popUp.notice.nid,
              image: popUp.notice.image,
              mode: 'noti',
            });
          } else {
            refNavigate({stack: popUp.rule.navigate});
          }
        }
      }

      setPopupDisabled(popUp);
      setClosedPopUp((pre) => (popUp?.uuid ? pre.concat(popUp.uuid) : pre));
      setPopUpPromo(undefined);
      actions.modal.closeModal();
    },
    [actions.modal, navigationRef, refNavigate, setPopupDisabled],
  );

  const renderCloseWeek = useCallback(() => {
    return (
      <Pressable
        style={styles.closeWeek}
        onPress={() => setChecked((prev) => !prev)}>
        <AppButton
          iconName="btnCheck"
          style={{marginRight: 10}}
          checked={checked}
          onPress={() => setChecked((prev) => !prev)}
        />
        <AppText>{i18n.t('close:week')}</AppText>
      </Pressable>
    );
  }, [checked]);

  const renderBtn = useCallback(
    (popUp: RkbPromotion) => {
      return (
        <View style={styles.modalBtnContainer}>
          {popUp?.rule?.display?.btnCancelTitle && (
            <AppButton
              style={{
                ...styles.btnCancel,
                marginRight: 10,
              }}
              title={popUp?.rule?.display?.btnCancelTitle}
              onPress={() => handlePopUp(popUp, false)}
            />
          )}
          <AppButton
            style={styles.btnCancel}
            title={popUp?.rule?.display?.btnOkTitle || i18n.t('ok')}
            onPress={() => handlePopUp(popUp, true)}
          />
        </View>
      );
    },
    [handlePopUp],
  );

  const popUpModalBody = useCallback(
    (popUp: RkbPromotion) => {
      const {rule, notice} = popUp;

      return (
        <Pressable
          style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}
          onPress={() => actions.modal.closeModal()}>
          <SafeAreaView style={{backgroundColor: 'transparent'}} />
          <View style={styles.modalContainer}>
            <View
              style={{
                backgroundColor: colors.white,
                height: iamgeHight + 88 + (rule?.display?.closeWeek ? 37 : 0), // 88 = 52(버튼) + 20 (아래여백) + 16(위 여백)
              }}>
              <ProgressiveImage
                style={{width: '100%', height: iamgeHight}}
                thumbnailSource={{
                  uri: API.default.httpImageUrl(notice?.image?.thumbnail),
                }}
                source={{
                  uri: API.default.httpImageUrl(notice?.image?.noti),
                }}
                resizeMode="contain"
              />

              {rule?.display?.closeWeek && renderCloseWeek()}

              {renderBtn(popUp)}
            </View>
          </View>
          <SafeAreaView style={{backgroundColor: colors.white}} />
        </Pressable>
      );
    },
    [actions.modal, iamgeHight, renderBtn, renderCloseWeek],
  );

  const showPopUp = useCallback(
    (routeName: string) => {
      const popUpList = promotion?.popUpPromotionMap?.get(routeName);

      if (popUpList) {
        const {url, deepLinkPath} = link;

        let popUp = popUpList.find(
          (elm) => !elm.rule?.cond?.inflowUrl && !elm.rule?.cond?.deepLinkPath,
        );

        if (url) {
          popUp =
            popUpList?.find(
              (elm) =>
                url.includes(elm?.rule?.cond?.inflowUrl) ||
                elm.rule?.cond?.deepLinkPath === deepLinkPath,
            ) || popUp;
        }

        if (popUp) {
          if (popUp.notice?.image?.noti) {
            setPopUpPromo(popUp);
            Image.getSize(
              API.default.httpImageUrl(popUp?.notice?.image?.noti),
              (width, height) => {
                setImageHeight(
                  Math.ceil(height * ((dimensions.width - 40) / width)),
                );
              },
            );
          }
        }
      }
    },
    [dimensions.width, link, promotion?.popUpPromotionMap],
  );

  useEffect(() => {
    if (
      popUpPromo &&
      (!closedPopUp.includes(popUpPromo?.uuid) ||
        popUpPromo.rule?.display?.repeat)
    ) {
      actions.modal.showModal({
        content: popUpModalBody(popUpPromo),
      });
    }
  }, [actions.modal, closedPopUp, popUpModalBody, popUpPromo]);

  const deepLinkHandler = useCallback(
    async (url: string) => {
      const isSupport = await getIsSupport();
      const urlSplit = url.split('?');

      if (
        isSupport &&
        navigationRef?.current &&
        urlSplit &&
        urlSplit.length >= 2
      ) {
        const params = utils.getParam(url);
        const schemeSplit = urlSplit[0].split('/');
        const deepLinkPath = schemeSplit[schemeSplit.length - 1];

        linkSave({url, params, deepLinkPath});

        switch (deepLinkPath) {
          case 'PROMOTION':
            refNavigate({
              stack: 'HomeStack',
              screen: 'Home',
              initial: false,
              params: {clickPromotion: true},
            });
            break;
          case 'HOME':
            refNavigate({
              stack: 'HomeStack',
              screen: 'Home',
              initial: false,
            });
            break;
          case 'MYPAGE':
            refNavigate({
              stack: 'MyPageStack',
              screen: 'Mypage',
              initial: false,
            });
            break;
          case 'INVITE':
            refNavigate({
              stack: 'MyPageStack',
              screen: 'Invite',
              initial: false,
            });
            break;
          default:
            break;
        }
      }
    },
    [getIsSupport, linkSave, navigationRef, refNavigate],
  );

  useEffect(() => {
    const runDeepLink = async () => {
      const initialUrl = await Linking.getInitialURL();

      if (initialUrl) {
        Adjust.appWillOpenUrl(initialUrl);
        deepLinkHandler(initialUrl);
      }
    };

    runDeepLink();
  }, [deepLinkHandler]);

  useEffect(() => {
    const addListenerLink = ({url}) => {
      if (url) deepLinkHandler(url);
    };

    Linking.addEventListener('url', addListenerLink);

    // return () => Linking.removeAllListeners('url');
  }, [deepLinkHandler]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(state) => {
        const lastTab = getActiveRouteName(state);
        setLastRouteName(lastTab);
        if (lastRouteName !== lastTab && lastTab !== 'Home') showPopUp(lastTab);
        Analytics.trackEvent('Page_View_Count', {page: lastTab});
        store.dispatch(cartActions.pushLastTab(lastTab));
      }}>
      {mainStack()}
    </NavigationContainer>
  );
};

export default connect(
  ({account, link, promotion}: RootState) => ({
    account,
    promotion,
    link,
  }),
  (dispatch) => ({
    actions: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(CreateAppContainer);
