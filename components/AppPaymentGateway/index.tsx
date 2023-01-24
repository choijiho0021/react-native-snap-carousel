import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AppState, Linking, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {ShouldStartLoadRequest} from 'react-native-webview/lib/WebViewTypes';
import Video from 'react-native-video';
import {configHecto, hectoWebViewScript} from './ConfigHecto';
import {
  inicisWebviewHtml,
  inicisWebViewScript,
  injectScript,
  pgWebViewConfig,
} from './ConfigInicis';
import {colors} from '@/constants/Colors';
import AppText from '../AppText';
import i18n from '@/utils/i18n';
import {PaymentParams} from '@/navigation/navigation';

export type PaymentResultCallbackParam = 'next' | 'cancel' | 'check';

type PaymentGatewayScreenProps = {
  info: PaymentParams;
  callback: (result: PaymentResultCallbackParam) => void;
};

// const IMP = require('iamport-react-native').default;
const loadingImg = require('../../assets/images/loading_1.mp4');

const pgWebViewHtml = (info: PaymentParams) => {
  const script =
    info.pg === 'hecto'
      ? `<script type="text/javascript" src="${configHecto.PAYMENT_SERVER}/resources/js/v1/SettlePG.js"></script>`
      : '';

  //    <form name="mobileweb" id="" method="post" acceptCharset="euc-kr"></form>
  let html = '';
  if (info.pg !== 'hecto') {
    html = inicisWebviewHtml(info);
  }

  return `<html>
  <head>
    <meta http-equiv='content-type' content='text/html; charset=utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>

    <script type='text/javascript' src='https://code.jquery.com/jquery-latest.min.js' ></script>
    ${script}
  </head>
  <body>${html}</body>
</html>
`;
};

const pgWebViewScript = (info: PaymentParams) => {
  return info.pg === 'hecto'
    ? hectoWebViewScript(info)
    : inicisWebViewScript(info);
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 80,
    right: 0,
  },
  infoText: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    marginBottom: 30,
    color: colors.clearBlue,
    textAlign: 'center',
    fontSize: 14,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    zIndex: 1,
  },
});

const AppPaymentGateway: React.FC<PaymentGatewayScreenProps> = ({
  info,
  callback,
}) => {
  const [loading, setLoading] = useState(true);
  const [checkPayment, setCheckPayment] = useState(false);
  const ref = useRef<WebView>(null);
  const onMessage = useCallback((payload) => {
    let dataPayload;
    try {
      dataPayload = JSON.parse(payload.nativeEvent.data);
    } catch (e) {}

    if (dataPayload) {
      if (dataPayload.type === 'Console') {
        console.info(`[Console] ${JSON.stringify(dataPayload.data)}`);
      } else {
        console.log(dataPayload);
      }
    }
  }, []);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        if (info.pg === 'html5_inicis' && checkPayment) {
          ref.current?.injectJavaScript(pgWebViewConfig.runScript);
        }
      }

      appState.current = nextAppState;
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [callback, checkPayment, info]);

  const onShouldStartLoadWithRequest = useCallback(
    (event: ShouldStartLoadRequest): boolean => {
      console.log('@@@ PG ', event);

      if (pgWebViewConfig.cancelUrl === event.url) {
        callback('cancel');
        return false;
      }

      if (pgWebViewConfig.nextUrl === event.url) {
        callback('next');
        return false;
      }

      // '쇼핑몰 이동' 버튼
      /*
      if (event.url.startsWith('https://ansimclick.hyundaicard.com/mobile3')) {
        callback('check');
        return true;
      }
      */

      if (
        event.url.startsWith('http://') ||
        event.url.startsWith('https://') ||
        event.url.startsWith('about:blank')
      ) {
        setCheckPayment(true);
        return true;
      }

      Linking.openURL(event.url).catch((err) => {
        console.log(
          '앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.',
        );
      });
      return false;
    },
    [callback],
  );

  const renderLoading = useCallback(() => {
    return (
      <View style={styles.loading}>
        <Video
          source={loadingImg}
          repeat
          style={styles.backgroundVideo}
          resizeMode="cover"
          mixWithOthers="mix"
        />
        <AppText style={styles.infoText}>{i18n.t('pym:loadingInfo')}</AppText>
      </View>
    );
  }, []);

  const onLoadEnd = useCallback(({nativeEvent: {url}}) => {
    setLoading(false);
    /*
    console.log('@@@ url', url);
    ref.current?.injectJavaScript(
      'console.log("END" + window.document.documentElement.innerHTML);',
    );
    */
    const script = injectScript(url);
    if (script) {
      ref.current?.injectJavaScript(script);
    }
  }, []);

  return (
    <>
      <WebView
        style={{flex: 1}}
        ref={ref}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScriptForMainFrameOnly
        injectedJavaScript={pgWebViewScript(info)}
        mixedContentMode="compatibility"
        onMessage={onMessage}
        originWhitelist={['*']}
        sharedCookiesEnabled
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onLoadEnd={onLoadEnd}
        source={{html: pgWebViewHtml(info)}}
      />
      {loading ? renderLoading() : null}
    </>
  );
};

export default AppPaymentGateway;
