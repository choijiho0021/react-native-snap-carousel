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
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
  Platform,
  Modal,
} from 'react-native';
import Env from '@/environment';
import {actions as cartActions} from '@/redux/modules/cart';
import {
  actions as promotionActions,
  PromotionModelState,
} from '@/redux/modules/promotion';
import {
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as linkActions, urlParamObj} from '@/redux/modules/link';
import AuthStackNavigator from './AuthStackNavigator';
import EsimMainTabNavigator from './EsimMainTabNavigator';
import {
  requestPermission,
  checkFistLaunch,
} from '@/navigation/component/permission';
import utils from '@/redux/api/utils';
import {
  actions as modalActions,
  ModalAction,
  ModalModelState,
} from '@/redux/modules/modal';
import {RootState} from '@/redux';
import {RkbPromotion} from '@/redux/api/promotionApi';
import {LinkModelState} from '../redux/modules/link';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import {API} from '@/redux/api';
import ProgressiveImage from '@/components/ProgressiveImage';
import i18n from '@/utils/i18n';
import {isFolderOpen} from '@/constants/SliderEntry.style';
import {ProductModelState} from '@/redux/modules/product';

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
  account: AccountModelState;
  link: LinkModelState;
  promotion: PromotionModelState;
  product: ProductModelState;
  modal: ModalModelState;
  actions: {
    modal: ModalAction;
  };
};

const CreateAppContainer: React.FC<RegisterMobileScreenProps> = ({
  store,
  modal,
  link: {url, linkPath},
  product: {prodList, localOpList, ready},
  promotion: {popUpPromotionMap},
  actions,
}) => {
  const navigationRef = useNavigationContainerRef();
  const [imageHeight, setImageHeight] = useState(450);
  const [checked, setChecked] = useState(false);
  const [popUpPromo, setPopUpPromo] = useState<RkbPromotion>();
  const [closedPopUp, setClosedPopUp] = useState<string[]>([]);
  const [lastRouteName, setLastRouteName] = useState<string>();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [savedPopup, setSavedPopup] = useState();
  const runDynamicLink = useRef(false);
  const routeNameRef = useRef();

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

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
        const {loggedIn, userId, token} = store.getState().account;

        if (loggedIn) {
          // API.User.registeRecommender({
          //   token,
          //   recommender: json?.recommender,
          //   uuid: userId,
          // });

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
          refNavigate({
            stack: 'EsimStack',
            screen: 'Esim',
            params: {
              actionStr: 'reload',
            },
          });
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

    DeviceInfo.getDeviceName().then((name) => {
      const deviceFullName = `${deviceModel},${name}`;

      store.dispatch(
        accountActions.updateAccount({
          isSupportDev: isSupport,
          deviceModel: deviceFullName,
        }),
      );
    });

    return isSupport;
  }, [checkSupportIos, store]);

  const linkSave = useCallback(
    async ({
      linkUrl,
      params,
      utmParameters,
      linkPath,
    }: {
      linkUrl?: string;
      params?: urlParamObj;
      linkPath?: string;
      utmParameters?: any;
    }) => {
      if (linkUrl) {
        store.dispatch(
          linkActions.update({
            linkUrl,
            params,
            utmParameters,
            linkPath,
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

  const getNaviParams = useCallback(
    (
      url?: string,
      params?: urlParamObj,
    ): {stack?: string; screen?: string; naviParams?: any} => {
      const canNavigate =
        params?.hasOwnProperty('stack') && params?.hasOwnProperty('screen');

      if (
        url?.indexOf('product') > -1 &&
        params?.uuid &&
        prodList.size > 0 &&
        localOpList.size > 0
      ) {
        const prod = prodList.get(params.uuid);
        const localOp = localOpList.get(params.uuid);

        if (prod)
          return {
            stack: 'HomeStack',
            screen: 'ProductDetail',
            naviParams: {
              title: prod.name,
              item: API.Product.toPurchaseItem(prod),
              uuid: prod.uuid,
              desc: prod.desc,
              price: prod.price,
              listPrice: prod.listPrice,
              localOpDetails: localOp?.detail,
              partnerId: prod?.partnerId,
            },
          };
      }
      if (canNavigate) {
        return {
          stack: `${params?.stack}Stack`,
          screen: params?.screen,
          naviParams: {},
        };
      }

      return {stack: undefined, screen: undefined, naviParams: undefined};
    },
    [localOpList, prodList],
  );

  const handleDynamicLink = useCallback(
    async (dLink: FirebaseDynamicLinksTypes.DynamicLink | null) => {
      const linkUrl = dLink?.url;
      const params: urlParamObj = utils.getParam(linkUrl);
      const isSupport = await getIsSupport();
      const isFirst = await checkFistLaunch();

      linkSave({
        linkUrl,
        params,
        utmParameters: dLink?.utmParameters,
        linkPath: params?.linkPath,
      });

      const {stack, screen, naviParams} = getNaviParams(linkUrl, params);
      if (isSupport || Platform.OS === 'ios') {
        if (isFirst) {
          refNavigate({
            stack: `HomeStack`,
            screen: 'Tutorial',
            initial: false,
            params: {stack, screen, naviParams},
          });
        } else if (stack && screen && navigationRef?.current) {
          refNavigate({
            stack,
            screen,
            initial: false,
            params: naviParams,
          });
        } else if (linkUrl) {
          const urlSplit = linkUrl.split('?');
          const schemeSplit = urlSplit[0].split('/');
          const lastSegment = schemeSplit[schemeSplit.length - 1];

          if (lastSegment === 'draft') {
            refNavigate({
              stack: 'EsimStack',
              screen: 'Esim',
              params: {actionStr: 'reload'},
            });
          } else gift(linkUrl, params);
        }
      }
    },
    [getIsSupport, getNaviParams, gift, linkSave, navigationRef, refNavigate],
  );

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, [handleDynamicLink]);

  useEffect(() => {
    if (ready && !runDynamicLink.current) {
      runDynamicLink.current = true;
      dynamicLinks()
        .getInitialLink()
        .then((l) => handleDynamicLink(l));
    }
  }, [handleDynamicLink, ready]);

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
                height: imageHeight + 88 + (rule?.display?.closeWeek ? 37 : 0), // 88 = 52(버튼) + 20 (아래여백) + 16(위 여백)
              }}>
              <ProgressiveImage
                style={{width: '100%', height: imageHeight}}
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
    [actions.modal, imageHeight, renderBtn, renderCloseWeek],
  );

  const showPopUp = useCallback(
    (routeName: string) => {
      const popUpList = popUpPromotionMap?.get(routeName);

      if (popUpList) {
        let popUp = popUpList.find((elm) => !elm.rule?.cond?.linkPath);

        if (url) {
          popUp =
            popUpList?.find((elm) =>
              elm.rule?.cond?.linkPath?.includes(linkPath),
            ) || popUp;
        }

        if (popUp) {
          setSavedPopup(popUp);

          if (popUp.notice?.image?.noti) {
            setPopUpPromo(popUp);
            Image.getSize(
              API.default.httpImageUrl(popUp?.notice?.image?.noti),
              (width, height) => {
                setImageHeight(
                  Math.ceil(
                    height *
                      ((isFolderOpen(dimensions.width)
                        ? 420
                        : dimensions.width - 40) /
                        width),
                  ),
                );
              },
            );
          }
        }
      }
    },
    [dimensions.width, linkPath, popUpPromotionMap, url],
  );

  useEffect(() => {
    if (dimensions && savedPopup) {
      Image.getSize(
        API.default.httpImageUrl(savedPopup?.notice?.image?.noti),
        (width, height) => {
          setImageHeight(
            Math.ceil(
              height *
                ((isFolderOpen(dimensions.width)
                  ? 420
                  : dimensions.width - 40) /
                  width),
            ),
          );
        },
      );
    }
  }, [dimensions, savedPopup]);

  useEffect(() => {
    if (
      popUpPromo &&
      (!closedPopUp.includes(popUpPromo?.uuid) ||
        popUpPromo.rule?.display?.repeat)
    ) {
      actions.modal.renderModal(() => popUpModalBody(popUpPromo));
    }
  }, [actions.modal, closedPopUp, popUpModalBody, popUpPromo]);

  const deepLinkHandler = useCallback(
    async (linkUrl: string) => {
      const isSupport = await getIsSupport();
      const urlSplit = linkUrl.split('?');

      if (
        isSupport &&
        navigationRef?.current &&
        urlSplit &&
        urlSplit.length >= 2
      ) {
        const params = utils.getParam(linkUrl);
        const schemeSplit = urlSplit[0].split('/');
        const lastSegment = schemeSplit[schemeSplit.length - 1];

        linkSave({linkUrl, params, linkPath: lastSegment});

        switch (lastSegment) {
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
            // console.log('@@@@ params?.orderID : ', params?.orderId);

            // AppAlert.info(`params orderId : ${params?.orderId}`, 'logging');

            // // 이게 맞나... 따로 붙여야할 것 같음.
            // if (params?.orderId) {
            //   refNavigate({
            //     stack: 'EsimStack',
            //     screen: 'Esim',
            //     initial: false,
            //     params: {
            //       actionStr: 'reload',
            //     },
            //   });
            // }

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
        deepLinkHandler(initialUrl);
      }
    };

    runDeepLink();
  }, [deepLinkHandler]);

  useEffect(() => {
    const addListenerLink = ({url: incomingUrl}) => {
      if (incomingUrl) deepLinkHandler(incomingUrl);
    };

    Linking.addEventListener('url', addListenerLink);

    // return () => Linking.removeAllListeners('url');
  }, [deepLinkHandler]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={async () => {
        if (navigationRef?.current?.getCurrentRoute() && routeNameRef) {
          routeNameRef.current =
            navigationRef?.current?.getCurrentRoute()?.name;
        }
      }}
      onStateChange={async (state) => {
        const previousName = routeNameRef.current;
        const currentName = navigationRef?.current?.getCurrentRoute()?.name;

        if (previousName !== currentName) {
          await analytics().logScreenView({
            screen_name: `${previousName}>${currentName}`,
            screen_class: currentName,
          });

          routeNameRef.current = currentName;
        }

        const lastTab = getActiveRouteName(state);
        setLastRouteName(lastTab);
        if (lastRouteName !== lastTab && lastTab !== 'Home') {
          showPopUp(lastTab);
        }
        Analytics.trackEvent('Page_View_Count', {page: lastTab});
        store.dispatch(cartActions.pushLastTab(lastTab));
      }}>
      {mainStack()}
      <Modal animationType="fade" transparent visible={modal.visible}>
        {modal.render?.()}
      </Modal>
    </NavigationContainer>
  );
};

export default connect(
  ({account, link, product, promotion, modal}: RootState) => ({
    account,
    promotion,
    product,
    link,
    modal,
  }),
  (dispatch) => ({
    actions: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(CreateAppContainer);
