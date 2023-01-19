import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import analytics from '@react-native-firebase/analytics';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {NavigationContainer} from '@react-navigation/native';
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
} from 'react-native';
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
import {ModalModelState} from '../redux/modules/modal';

const {isIOS, esimGlobal} = Env.get();

const POPUP_DIS_DAYS = 7;
const MainStack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
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
  modal: ModalModelState;
  link: LinkModelState;
  promotion: RkbPromotion[];
  actions: {
    modal: ModalAction;
  };
};

const CreateAppContainer: React.FC<RegisterMobileScreenProps> = ({
  store,
  modal,
  link,
  promotion,
  actions,
}) => {
  const navigationRef = React.useRef();
  const [iamgeHight, setImageHeight] = useState(450);
  const [checked, setChecked] = useState(false);
  const [popUpPromo, setPopUpPromo] = useState<RkbPromotion>();
  const dimensions = useMemo(() => Dimensions.get('window'), []);

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

  const DynamicLinkSave = useCallback(
    async (
      l: FirebaseDynamicLinksTypes.DynamicLink | null,
      params: urlParamObj,
    ) => {
      if (l?.url) {
        store.dispatch(
          linkActions.update({
            utmParameters: l?.utmParameters,
            url: l?.url,
            params,
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
    async (link: FirebaseDynamicLinksTypes.DynamicLink | null) => {
      const url = link?.url;
      const urlParams: urlParamObj = utils.getParam(url);
      const isSupport = await getIsSupport();

      DynamicLinkSave(link, urlParams);

      if (
        isSupport &&
        navigationRef?.current &&
        urlParams.hasOwnProperty('stack') &&
        urlParams.hasOwnProperty('screen')
      ) {
        // Screen 별 동작 추가 - Home, Cart,Esim, MyPage 이동 가능
        navigationRef.current.navigate(`${urlParams?.stack}Stack`, {
          screen: urlParams?.screen,
          initial: false,
        });
      } else if (isSupport && url) {
        gift(url, urlParams);
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
            navigationRef.current.navigate(popUp?.rule?.stack, {
              screen: popUp.rule.navigate,
              initial: false,
            });
          } else {
            navigationRef.current.navigate(popUp.rule.navigate);
          }
        } else if (popUp?.notice) {
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
        }
      }

      setPopupDisabled(popUp);
      actions.modal.closeModal();
    },
    [actions.modal, setPopupDisabled],
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
          {popUp?.rule?.btnCancelTitle && (
            <AppButton
              style={{
                ...styles.btnCancel,
                marginRight: 10,
              }}
              title={popUp?.rule?.btnCancelTitle}
              onPress={() => handlePopUp(popUp, false)}
            />
          )}
          <AppButton
            style={styles.btnCancel}
            title={popUp?.rule?.btnOkTitle}
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
                height: iamgeHight + 88 + (rule?.closeWeek ? 37 : 0), // 88 = 52(버튼) + 20 (아래여백) + 16(위 여백)
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

              {rule?.closeWeek && renderCloseWeek()}

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
      const popUp = promotion.find((elm) => {
        const inflowUrlList = elm?.rule?.inflowUrl
          ? elm?.rule?.inflowUrl.split(',')
          : [''];

        return (
          elm.rule?.popUp &&
          elm.rule?.routeName === routeName &&
          inflowUrlList.includes(link.url || '')
        );
      });

      setPopUpPromo(popUp);
      if (popUp) {
        if (popUp.notice?.image?.noti)
          Image.getSize(
            API.default.httpImageUrl(popUp?.notice?.image?.noti),
            (width, height) => {
              setImageHeight(
                Math.ceil(height * ((dimensions.width - 40) / width)),
              );
            },
          );

        AsyncStorage.getItem(`popupDisabled_${popUp?.uuid}`).then((v) => {
          const now = moment();
          if (v) {
            const disabled =
              moment.duration(now.diff(v)).asDays() <= POPUP_DIS_DAYS;
            if (!disabled) {
              actions.modal.showModal({
                content: popUpModalBody(popUp),
              });
              AsyncStorage.removeItem('popupDisabled');
            }
          } else {
            actions.modal.showModal({
              content: popUpModalBody(popUp),
            });
          }
        });
      }
    },
    [actions.modal, dimensions.width, link.url, popUpModalBody, promotion],
  );

  useEffect(() => {
    if (modal.visible && popUpPromo) {
      actions.modal.showModal({
        content: popUpModalBody(popUpPromo),
      });
    }
  }, [actions.modal, modal.visible, popUpModalBody, popUpPromo]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(state) => {
        const lastTab = getActiveRouteName(state);
        showPopUp(lastTab);
        Analytics.trackEvent('Page_View_Count', {page: lastTab});
        store.dispatch(cartActions.pushLastTab(lastTab));
      }}>
      {mainStack()}
    </NavigationContainer>
  );
};

export default connect(
  ({account, modal, link, promotion}: RootState) => ({
    account,
    modal,
    promotion: promotion.promotion,
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
