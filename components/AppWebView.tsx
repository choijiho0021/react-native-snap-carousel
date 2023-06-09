import React, {useCallback, useRef, useState} from 'react';
import WebView from 'react-native-webview';
import AppActivityIndicator from './AppActivityIndicator';

type AppWebViewCallbackParams = {
  cmd: string;
};

type AppWebViewProps = {
  uri: string;
  callback: (v: AppWebViewCallbackParams) => void;
};

const AppWebView: React.FC<AppWebViewProps> = ({uri, callback}) => {
  const [loading, setLoading] = useState(true);
  const ref = useRef<WebView>(null);
  const onMessage = useCallback(
    ({nativeEvent: {data}}) => {
      console.log('@@@ webview onMessage', data);
      try {
        if (data) callback?.(JSON.parse(data));
      } catch (e) {
        console.log('[Console] ', e);
      }
    },
    [callback],
  );

  const onError = useCallback(({nativeEvent}) => {
    console.log('loading error', nativeEvent);
  }, []);

  return (
    <>
      <WebView
        style={{flex: 1}}
        ref={ref}
        javaScriptEnabled
        mixedContentMode="compatibility"
        onMessage={onMessage}
        onError={onError}
        originWhitelist={['*']}
        sharedCookiesEnabled
        javaScriptCanOpenWindowsAutomatically
        onLoadEnd={({nativeEvent: {loading: webViewLoading}}) =>
          setLoading(webViewLoading)
        }
        source={{uri}}
      />
      <AppActivityIndicator visible={loading} />
    </>
  );
};

export default AppWebView;
