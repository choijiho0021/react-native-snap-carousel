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
import AppBottomModal from '@/screens/DraftUsScreen/component/AppBottomModal';

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

// 고정된 값으로 처리해야만 하나 서버에서 받는건?
// naver, ios. 전북 은행은 는 3번째 링크로 안들어간다..
const exceptionLink = ['naver', 'apple', 'card33'];

const cardLinkKeyword = [
  'lottecard',
  'nonghyup',
  'toss',
  'lpay',
  'payco',
  'ssgpay',
  'kakao',
  'hyundai',
  'kbcard',
  'bcAppPay',
  'samsungcard',
  'shinhancard',
  'hanacard',
  'wooricard',
  'ispmobile',
  'citibank',
  'kbcard',
];

const AppPaymentGateway: React.FC<PaymentGatewayScreenProps> = ({
  info,
  callback,
}) => {
  const [loading, setLoading] = useState(true);

  const injected = useRef(false);
  const ref = useRef<WebView>(null);
  const html = useMemo(() => pgWebViewHtml(info), [info]);

  const [count, setCount] = useState(0);

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

      if (event.url.startsWith('about:blank')) {
        return true;
      }

      if (event.url.startsWith('http://') || event.url.startsWith('https://')) {
        setCount((prev) => prev + 1);
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
        <AppBottomModal
          visible={loading}
          isCloseBtn={false}
          height={160}
          onClose={() => {}}
          containerStyle={{
            backgroundColor: 'rgba(0,0,0,0)',
            shadowColor: 'rgba(166, 168, 172, 0.24)',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowRadius: 16,
            shadowOpacity: 1,
          }}
          title={i18n.t('pym:wait:title')}
          body={
            <View style={{marginHorizontal: 20}}>
              <AppText>
                {i18n.t(isKST ? 'pym:wait:kst' : 'pym:wait:another')}
              </AppText>
            </View>
          }
        />
      </>
    );
  }, [loading]);

  const onLoadEnd = useCallback(
    ({nativeEvent: event}) => {
      if (count > 1) {
        setLoading(false);
      }

      if (event.url.startsWith('about') && !injected.current) {
        ref.current?.injectJavaScript('start_script();');
        injected.current = true;
      }
    },
    [count],
  );

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
