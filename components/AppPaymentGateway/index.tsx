import React, {useCallback, useRef, useState} from 'react';
import {Linking, StyleSheet, View, Platform, Alert} from 'react-native';
import WebView from 'react-native-webview';
import {ShouldStartLoadRequest} from 'react-native-webview/lib/WebViewTypes';
import Video from 'react-native-video';
import {inicisWebviewHtml, pgWebViewConfig} from './ConfigInicis';
import {colors} from '@/constants/Colors';
import AppText from '../AppText';
import i18n from '@/utils/i18n';
import {PaymentParams} from '@/navigation/navigation';
import utils from '@/redux/api/utils';
import AppAlert from '@/components/AppAlert';

export type PaymentResultCallbackParam = 'next' | 'cancel' | 'check';

type PaymentGatewayScreenProps = {
  info: PaymentParams;
  callback: (result: PaymentResultCallbackParam) => void;
};

const loadingImg = require('../../assets/images/loading_1.mp4');

const pgWebViewHtml = (info: PaymentParams) => {
  return inicisWebviewHtml(info);
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
  const ref = useRef<WebView>(null);
  const onMessage = useCallback((payload) => {
    let dataPayload;
    try {
      dataPayload = JSON.parse(payload.nativeEvent.data);
    } catch (e) {
      console.log('[Console] ', e);
    }

    if (dataPayload) {
      if (dataPayload.type === 'Console') {
        console.info(`[Console] ${JSON.stringify(dataPayload.data)}`);
      } else {
        console.log(dataPayload);
      }
    }
  }, []);

  const onShouldStartLoadWithRequest = useCallback(
    (event: ShouldStartLoadRequest): boolean => {
      console.log('@@@ PG ', event.url);

      if (pgWebViewConfig.cancelUrl === event.url) {
        callback('cancel');
        return false;
      }

      if (pgWebViewConfig.nextUrl === event.url) {
        callback('next');
        return false;
      }

      if (
        event.url.startsWith('http://') ||
        event.url.startsWith('https://') ||
        event.url.startsWith('about:blank')
      ) {
        return true;
      }

      Linking.openURL(utils.intentToUrl(event.url)).catch((err) => {
        AppAlert.info(
          '앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.',
          i18n.t('ok'),
          () => callback('cancel'),
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
    // console.log('@@@ url', url);
    // ref.current?.injectJavaScript(
    //   'console.log("END" + window.document.documentElement.innerHTML);' +
    //     'console.log("LOAD:" + document.body.onload);',
    // );
    // const script = injectScript(url);
    // if (script) {
    //   ref.current?.injectJavaScript(script);
    // }
  }, []);

  return (
    <>
      <WebView
        style={{flex: 1}}
        ref={ref}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScriptForMainFrameOnly
        mixedContentMode="compatibility"
        onMessage={onMessage}
        originWhitelist={['*']}
        sharedCookiesEnabled
        javaScriptCanOpenWindowsAutomatically
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onLoadEnd={onLoadEnd}
        source={{html: pgWebViewHtml(info)}}
      />
      {loading ? renderLoading() : null}
    </>
  );
};

export default AppPaymentGateway;
