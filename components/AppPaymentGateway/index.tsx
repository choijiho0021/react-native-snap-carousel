import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {ShouldStartLoadRequest} from 'react-native-webview/lib/WebViewTypes';
import Video from 'react-native-video';
import moment from 'moment';
import {inicisWebviewHtml} from './ConfigInicis';
import AppText from '../AppText';
import i18n from '@/utils/i18n';
import {PaymentParams} from '@/navigation/navigation';
import utils from '@/redux/api/utils';
import AppAlert from '@/components/AppAlert';
import {hectoWebViewHtml} from './ConfigHecto';
import {useFocusEffect} from '@react-navigation/native';
import {appStyles} from '@/constants/Styles';

export type PaymentResultCallbackParam = 'next' | 'cancel' | 'check';

export const pgWebViewConfig = {
  cancelUrl: 'https://localhost/canc',

  nextUrl: 'https://localhost/next',
};

type PaymentGatewayScreenProps = {
  info: PaymentParams;
  callback: (result: PaymentResultCallbackParam, errorMsg?: string) => void;
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    zIndex: 1,
  },
  loadingContainer: {
    backgroundColor: 'white',
    shadowColor: 'rgba(166, 168, 172, 0.24)',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    height: 160,
  },
  head: {
    height: 74,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 6,
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

  // 화면 빠져나간 경우도 로딩 취소

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setLoading(false);
      };
    }, []),
  );

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
      console.log('@@@@ event : ', event.loading);

      if (event.url.includes(pgWebViewConfig.cancelUrl)) {
        callback('cancel', decodeURI(event?.url));
        return false;
      }

      if (pgWebViewConfig.nextUrl === event.url) {
        callback('next');
        return false;
      }

      if (
        event.url.startsWith('about:blank') ||
        event.url.indexOf('blank') !== -1
      ) {
        setLoading(false);
        return true;
      }

      console.log('@@@ url : ', event.url, ', setLoading : true');
      if (event.url.startsWith('http://') || event.url.startsWith('https://')) {
        // 결제사의 비밀번호 입력 화면 같은 특정 웹 페이지는 loading false -> onLoadEnd 호출을 안해서 loading 값 참조
        setLoading(event?.loading || false);
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
    const isKST = moment().format().includes('+09:00');

    return (
      <>
        <View style={styles.loading}>
          <Video
            source={loadingImg}
            repeat
            style={styles.backgroundVideo}
            resizeMode="cover"
            mixWithOthers="mix"
          />
          {/* <AppText style={styles.infoText}>{i18n.t('pym:loadingInfo')}</AppText> */}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <View style={styles.head}>
              <AppText style={appStyles.bold18Text}>
                {i18n.t('pym:wait:title')}
              </AppText>
            </View>
            <View>
              <AppText
                style={{
                  ...appStyles.normal16Text,
                  paddingHorizontal: 20,
                }}>
                {i18n.t(isKST ? 'pym:wait:kst' : 'pym:wait:another')}
              </AppText>
            </View>
          </View>
        )}
      </>
    );
  }, [loading]);

  const onLoadEnd = useCallback(({nativeEvent: event}) => {
    setLoading(false);

    if (event.url.startsWith('about') && !injected.current) {
      ref.current?.injectJavaScript('start_script();');
      injected.current = true;
    }
  }, []);

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
      {loading ? <>{renderLoading()}</> : null}
    </>
  );
};

export default AppPaymentGateway;
