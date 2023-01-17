import React, {useCallback, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {ShouldStartLoadRequest} from 'react-native-webview/lib/WebViewTypes';
import Video from 'react-native-video';
import {configHecto, hectoWebViewScript} from './ConfigHecto';
import {
  inicisWebviewHtml,
  inicisWebViewScript,
  pgWebViewConfig,
} from './ConfigInicis';
import {colors} from '@/constants/Colors';
import AppText from '../AppText';
import i18n from '@/utils/i18n';
import {PaymentParams} from '@/navigation/navigation';

type PaymentResult = {
  success: boolean;
};

type PaymentGatewayScreenProps = {
  info: PaymentParams;
  callback: (result: PaymentResult) => void;
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
      console.log('@@@ PG result', event);

      if (pgWebViewConfig.cancelUrl === event.url) {
        callback({success: false});
        return false;
      }

      if (pgWebViewConfig.nextUrl === event.url) {
        callback({success: true});
        return false;
      }

      if (
        event.url.startsWith('http://') ||
        event.url.startsWith('https://') ||
        event.url.startsWith('about:blank')
      ) {
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

  console.log('@@@ pym', info);

  return (
    <>
      <WebView
        style={{flex: 1}}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScriptForMainFrameOnly
        injectedJavaScript={pgWebViewScript(info)}
        mixedContentMode="compatibility"
        onMessage={onMessage}
        originWhitelist={['*']}
        sharedCookiesEnabled
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onLoadEnd={() => setLoading(false)}
        source={{
          html: pgWebViewHtml(info),
        }}
      />
      {loading ? renderLoading() : null}
    </>
  );
};

export default AppPaymentGateway;
