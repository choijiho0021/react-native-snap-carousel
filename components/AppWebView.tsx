import React, {useCallback, useRef, useState} from 'react';
import WebView from 'react-native-webview';

type AppWebViewProps = {
  uri: string;
  callback: (v) => void;
};

const AppWebView: React.FC<AppWebViewProps> = ({uri, callback}) => {
  const [loading, setLoading] = useState(true);
  const ref = useRef<WebView>(null);
  const onMessage = useCallback(
    (payload) => {
      try {
        const data = JSON.parse(payload.nativeEvent.data);
        callback?.(data);
      } catch (e) {
        console.log('[Console] ', e);
      }
    },
    [callback],
  );

  const onLoadEnd = useCallback(({nativeEvent: {url}}) => {
    // console.log('@@@ onLoadEnd url', url, injected.current);
    // ref.current?.injectJavaScript(
    //   'console.log("END" + window.document.documentElement.innerHTML);' +
    //     'console.log("LOAD:" + document.body.onload);',
    // );
    setLoading(false);
  }, []);

  const onError = useCallback(({nativeEvent}) => {
    console.log('loading error', nativeEvent);
  }, []);

  return (
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
      onLoadEnd={onLoadEnd}
      source={{uri}}
    />
  );
};

export default AppWebView;
