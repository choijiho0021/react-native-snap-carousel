import React, {useCallback, useMemo} from 'react';
import {Linking, Platform} from 'react-native';
import WebView from 'react-native-webview';
import {ShouldStartLoadRequest} from 'react-native-webview/lib/WebViewTypes';
import {pgWebViewHtml, pgWebViewScript} from './constant';

type PaymentGatewayScreenProps = {
  pg: 'hecto';
  onSuccess: () => void;
  onError: () => void;
};

const AppPaymentGateway: React.FC<PaymentGatewayScreenProps> = ({
  pg = 'hecto',
  onError,
  onSuccess,
}) => {
  const script = useMemo(() => {
    if (Platform.OS === 'android')
      return `window.onload = ${pgWebViewScript(pg)};true;`;
    return `(${pgWebViewScript(pg)})(); true; `;
  }, [pg]);

  const handleMessage = async (event: any) => {
    const data = JSON.parse(event?.nativeEvent?.data);
    if (data?.message) {
      return onError(data);
    }
    return onSuccess(data);
  };

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
      injectedJavaScript={script}
      mixedContentMode="compatibility"
      onMessage={handleMessage}
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
