import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  BackHandler,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Video from 'react-native-video';
import {connect, DispatchProp} from 'react-redux';
import RNExitApp from 'react-native-exit-app';
import {API} from '@/redux/api';
import AppAlert from '@/components/AppAlert';
import AppToast from '@/components/AppToast';
import CodePushModal from '@/components/CodePushModal';
import Env from '@/environment';
import AppNavigator from '@/navigation/AppNavigator';
import {actions as accountActions} from '@/redux/modules/account';
import {actions as infoActions} from '@/redux/modules/info';
import {actions as productActions} from '@/redux/modules/product';
import {actions as simActions} from '@/redux/modules/sim';
import {actions as syncActions} from '@/redux/modules/sync';
import i18n from '@/utils/i18n';
import {retrieveData} from '@/utils/utils';
import store from '@/store';
import {RootState} from '@/redux';
import AppModal from './AppModal';
import {appStyles} from '@/constants/Styles';
import {ProductModelState} from '../redux/modules/product';

const {esimApp, esimGlobal} = Env.get();

const SplashScreen = require('react-native-splash-screen').default;

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
  modalTitle: {
    ...appStyles.normal20Text,
    marginHorizontal: 20,
  },
  modalBody: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
});

function handleLoadingError(error) {
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
type AppComponentProps = {
  skipLoadingScreen: boolean;
  product: ProductModelState;
};

const AppComponent: React.FC<AppComponentProps & DispatchProp> = ({
  skipLoadingScreen,
  product,
  dispatch,
}) => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [timeOut, setTimeOut] = useState(false);

  const login = useCallback(async () => {
    const iccid = await retrieveData(API.User.KEY_ICCID);
    const mobile = await retrieveData(API.User.KEY_MOBILE);
    const pin = await retrieveData(API.User.KEY_PIN);

    if (mobile && pin) {
      dispatch(accountActions.logInAndGetAccount({mobile, pin, iccid}));
    } else {
      dispatch(accountActions.getToken());
    }
  }, [dispatch]);

  const renderMain = useCallback(() => {
    // 앱 시작 시 splash 화면 3초강 항상 출력
    if (showSplash)
      return (
        <Video
          source={
            esimGlobal
              ? require('../assets/images/intro.mp4')
              : require('../assets/images/rokebi_intro.mp4')
          }
          style={styles.backgroundVideo}
          resizeMode="contain"
        />
      );

    // 상품준비가 안된 경우
    if (!product.ready) {
      // timeout 까지 상품이 준비가 되지 않으면 앱 종료 모달 출력
      if (timeOut)
        return (
          <View style={{flex: 1}}>
            <AppModal
              title={i18n.t('loading:errNetworkTitle')}
              closeButtonTitle={i18n.t('home:exitApp')}
              titleStyle={styles.modalTitle}
              type="close"
              onOkClose={() => RNExitApp.exitApp()}
              visible>
              <Text style={styles.modalBody}>
                {i18n.t('loading:errNetworkBody')}
              </Text>
            </AppModal>
          </View>
        );
      // timeout전까지 로딩화면 출력 (디자인 이후 수정 필요)
      return (
        <Video
          repeat
          source={
            esimGlobal
              ? require('../assets/images/rokebi_intro.mp4')
              : require('../assets/images/intro.mp4')
          }
          style={styles.backgroundVideo}
          resizeMode="contain"
        />
      );
    }
    // 상품이 준비 되면 홈화면로 이동
    return <AppNavigator store={store} />;
  }, [product.ready, showSplash, timeOut]);

  const loadResourcesAsync = useCallback(async () => {
    // clear caches
    dispatch(accountActions.clearCookies());

    // load product list
    dispatch(productActions.init());

    if (!esimApp) {
      dispatch(simActions.getSimCardList());
      // 공지 사항 가져오기
      dispatch(infoActions.getInfoList('info:home'));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isLoadingComplete && !skipLoadingScreen) {
      try {
        loadResourcesAsync();
        setLoadingComplete(true);
      } catch (e) {
        handleLoadingError(e);
      }
    }
  }, [isLoadingComplete, loadResourcesAsync, skipLoadingScreen]);

  useEffect(() => {
    if (isLoadingComplete || skipLoadingScreen) {
      if (SplashScreen) SplashScreen.hide();
    }
  }, [isLoadingComplete, skipLoadingScreen]);

  // 로그인을 하거나 토큰을 가져오도록 한다
  useEffect(() => {
    login();
    setTimeout(() => {
      store.dispatch(syncActions.skip());
      setShowSplash(false);
    }, 3000);
    setTimeout(() => {
      setTimeOut(true);
    }, 60000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      {renderMain()}
      {!showSplash && <CodePushModal />}
      <AppToast />
    </View>
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(memo(AppComponent));
