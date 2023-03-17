import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  BackHandler,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import {connect, DispatchProp} from 'react-redux';
import RNExitApp from 'react-native-exit-app';
import {Adjust, AdjustConfig} from 'react-native-adjust';
import messaging from '@react-native-firebase/messaging';
import codePush from 'react-native-code-push';
import Config from 'react-native-config';
import SystemSetting from 'react-native-system-setting';
import {API} from '@/redux/api';
import AppAlert from '@/components/AppAlert';
import AppToast from '@/components/AppToast';
import Env from '@/environment';
import AppNavigator from '@/navigation/AppNavigator';
import {actions as accountActions} from '@/redux/modules/account';
import {actions as infoActions} from '@/redux/modules/info';
import {
  actions as productActions,
  ProductModelState,
} from '@/redux/modules/product';
import {actions as syncActions} from '@/redux/modules/sync';
import i18n from '@/utils/i18n';
import {retrieveData} from '@/utils/utils';
import store from '@/store';
import {RootState} from '@/redux';
import AppModal from './AppModal';
import {appStyles} from '@/constants/Styles';
import CodePushScreen from '@/screens/CodePushScreen';
import {ModalModelState} from '@/redux/modules/modal';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
const windowHeight = viewportHeight;
const windowWidth = viewportWidth;

const {esimApp, esimGlobal, adjustToken, isProduction} = Env.get();

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
  loadingVideo: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: windowHeight < 700 ? windowHeight - 210 : windowHeight - 310,
    left: windowWidth / 2 - 50,
  },
  loadingText: {
    ...appStyles.normal16Text,
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
    top: windowHeight < 700 ? windowHeight - 100 : windowHeight - 200,
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
  modal: ModalModelState;
};

const AppComponent: React.FC<AppComponentProps & DispatchProp> = ({
  skipLoadingScreen,
  product,
  modal,
  dispatch,
}) => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isCodepushRunning, setIsCodepushRunning] = useState(false);
  const [networkErr, setNetworkErr] = useState(false);
  const [loadingTextSec, setloadingTextSec] = useState(1);
  const [muteMode, setMuteMode] = useState<boolean>(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemSetting.getVolume('ring').then((volume) => {
        if (volume === 0) {
          setMuteMode(true);
        }
      });
    }
  }, []);

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

  useEffect(() => {
    const adjustConfig = new AdjustConfig(
      adjustToken,
      isProduction
        ? AdjustConfig.EnvironmentProduction
        : AdjustConfig.EnvironmentSandbox,
    );
    adjustConfig.setShouldLaunchDeeplink(true);
    adjustConfig.setAllowiAdInfoReading(true);

    Adjust.create(adjustConfig);
    messaging()
      .getToken()
      .then((deviceToken) => Adjust.setPushToken(deviceToken));
  }, []);

  useEffect(() => {
    if (loadingTextSec < 65)
      setTimeout(() => {
        setloadingTextSec(loadingTextSec + 1);
      }, 5000);
  }, [loadingTextSec]);

  const renderMain = useCallback(() => {
    // timeout 까지 상품이 준비가 되지 않으면 앱 종료 모달 출력
    if (!product.ready && networkErr)
      return (
        <View style={{flex: 1}}>
          <AppModal
            title={i18n.t('loading:errNetworkTitle')}
            okButtonTitle={i18n.t('home:exitApp')}
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

    // 앱 시작 시 splash 화면 3초강 항상 출력
    if (!product.ready || showSplash) {
      return (
        <View style={{flex: 1}}>
          <Video
            source={
              esimGlobal
                ? require('../assets/images/intro.mp4')
                : require('../assets/images/rokebi_intro.mp4')
            }
            style={styles.backgroundVideo}
            resizeMode="contain"
            mixWithOthers="mix"
            muted={muteMode}
          />
          {!showSplash && !esimGlobal && (
            <Image
              source={require('../assets/images/esim_loading.gif')}
              style={styles.loadingVideo}
            />
          )}
          {!showSplash && (
            <Text style={styles.loadingText}>
              {i18n.t(`loading:text${loadingTextSec % 2}`)}
            </Text>
          )}
        </View>
      );
    }

    return <AppNavigator store={store} />;
  }, [loadingTextSec, muteMode, networkErr, product.ready, showSplash]);

  const loadResourcesAsync = useCallback(async () => {
    // clear caches
    dispatch(accountActions.clearCookies());

    // load product list
    dispatch(productActions.init());

    if (!esimApp) {
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
      setNetworkErr(true);
    }, 60000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    codePush
      .notifyAppReady()
      .then(() => codePush.checkForUpdate())
      .then((update) => {
        if (update && Config.NODE_ENV !== 'debug') {
          setIsCodepushRunning(true);
        }
      });
  }, []);

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      {isCodepushRunning ? <CodePushScreen /> : renderMain()}
      {/* {!showSplash && !isCodepushRunning && <CodePushModal />} */}
      <AppToast />
      <Modal animationType="fade" transparent visible={modal.visible}>
        {modal.content}
      </Modal>
    </View>
  );
};

export default connect(({product, modal}: RootState) => ({
  product,
  modal,
}))(memo(AppComponent));
