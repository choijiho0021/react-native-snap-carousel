import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {ShouldStartLoadRequest} from 'react-native-webview/lib/WebViewTypes';
import Video from 'react-native-video';
import {inicisWebviewHtml} from './ConfigInicis';
import {colors} from '@/constants/Colors';
import AppText from '../AppText';
import i18n from '@/utils/i18n';
import {PaymentParams} from '@/navigation/navigation';
import utils from '@/redux/api/utils';
import AppAlert from '@/components/AppAlert';
import {hectoWebViewHtml} from './ConfigHecto';
import VBank from './VBank';

export type PaymentResultCallbackParam = 'next' | 'cancel' | 'check';

export const pgWebViewConfig = {
  cancelUrl: 'https://localhost/canc',

  nextUrl: 'https://localhost/next',
};

type PaymentGatewayScreenProps = {
  info: PaymentParams;
  callback: (result: PaymentResultCallbackParam) => void;
};

const loadingImg = require('../../assets/images/loading_1.mp4');

const pgWebViewHtml = (info: PaymentParams) => {
  const pg = info.paymentRule?.[info.card || info.pay_method] || '';
  if (pg === 'T') return hectoWebViewHtml(info);
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
  const injected = useRef(false);
  const ref = useRef<WebView>(null);
  const html = useMemo(() => pgWebViewHtml(info), [info]);
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
        AppAlert.info(i18n.t('pym:noAppScheme'), i18n.t('ok'), () =>
          callback('cancel'),
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
    // console.log('@@@ onLoadEnd url', url, injected.current);
    // ref.current?.injectJavaScript(
    //   'console.log("END" + window.document.documentElement.innerHTML);' +
    //     'console.log("LOAD:" + document.body.onload);',
    // );
    setLoading(false);
    if (url.startsWith('about') && !injected.current) {
      ref.current?.injectJavaScript('start_script();');
      injected.current = true;
    }
  }, []);

  console.log('@@@ info', info);

  if (info.pay_method === 'vbank') {
    return <VBank info={info} />;
  }

  return (
    <>
      <WebView
        style={{flex: 1}}
        ref={ref}
        javaScriptEnabled
        mixedContentMode="compatibility"
        onMessage={onMessage}
        originWhitelist={['*']}
        sharedCookiesEnabled
        javaScriptCanOpenWindowsAutomatically
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onLoadEnd={onLoadEnd}
        source={{html}}
      />
      {loading ? renderLoading() : null}
    </>
  );
};

export default AppPaymentGateway;
