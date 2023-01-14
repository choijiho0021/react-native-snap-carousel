import React, {useCallback, useMemo} from 'react';
import {Linking, Platform} from 'react-native';
import WebView from 'react-native-webview';
import {ShouldStartLoadRequest} from 'react-native-webview/lib/WebViewTypes';
import {PaymentInfo} from '@/redux/api/cartApi';
import {pgWebViewHtml, pgWebViewScript} from './constant';

type PaymentGatewayScreenProps = {
  pg: 'hecto';
  info: PaymentInfo;
};

const AppPaymentGateway: React.FC<PaymentGatewayScreenProps> = ({
  pg = 'hecto',
  info,
}) => {
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

  const onShouldStartLoadWithRequest = useCallback(
    (event: ShouldStartLoadRequest): boolean => {
      if (
        event.url.startsWith('http://') ||
        event.url.startsWith('https://') ||
        event.url.startsWith('about:blank')
      ) {
        return true;
      }
      if (Platform.OS === 'android') {
        // @ts-ignore
        SendIntentAndroid.openAppWithUri(event.url)
          .then((isOpened: boolean) => {
            if (!isOpened) {
              console.log('앱 실행에 실패했습니다');
            }
            return false;
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else {
        Linking.openURL(event.url).catch((err) => {
          console.log(
            '앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.',
          );
        });
        return false;
      }
      return false;
    },
    [],
  );

  return (
    <WebView
      useWebkit
      style={{flex: 1}}
      javaScriptEnabled
      domStorageEnabled
      injectedJavaScriptForMainFrameOnly
      injectedJavaScript={pgWebViewScript(pg, info)}
      mixedContentMode="compatibility"
      onMessage={onMessage}
      originWhitelist={['*']}
      sharedCookiesEnabled
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      source={{
        html: pgWebViewHtml(pg),
      }}
    />
  );
};

export default AppPaymentGateway;
