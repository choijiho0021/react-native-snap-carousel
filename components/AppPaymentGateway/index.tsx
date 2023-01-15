import React, {useCallback, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {ShouldStartLoadRequest} from 'react-native-webview/lib/WebViewTypes';
import Video from 'react-native-video';
import {PaymentInfo} from '@/redux/api/cartApi';
import {
  pgWebViewCancelled,
  pgWebViewHtml,
  pgWebViewScript,
  pgWebViewSuccessful,
} from './constant';
import {colors} from '@/constants/Colors';
import AppText from '../AppText';
import i18n from '@/utils/i18n';

type PaymentResult = {
  success: boolean;
};

type PaymentGatewayScreenProps = {
  pg: 'hecto';
  info: PaymentInfo;
  callback: (result: PaymentResult) => void;
};

// const IMP = require('iamport-react-native').default;
const loadingImg = require('../../assets/images/loading_1.mp4');

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
});

const AppPaymentGateway: React.FC<PaymentGatewayScreenProps> = ({
  pg = 'hecto',
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
      if (pgWebViewCancelled(pg, event.url)) {
        callback({success: false});
        return false;
      }

      if (pgWebViewSuccessful(pg, event.url)) {
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
    [callback, pg],
  );

  const renderLoading = useCallback(() => {
    return (
      <View style={{flex: 1, alignItems: 'stretch'}}>
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

  return (
    <>
      <WebView
        style={{flex: 1}}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScriptForMainFrameOnly
        injectedJavaScript={pgWebViewScript(pg, info)}
        mixedContentMode="compatibility"
        onMessage={onMessage}
        originWhitelist={['*']}
        sharedCookiesEnabled
        shoul
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onLoadEnd={() => {
          setLoading(false);
        }}
        source={{
          html: pgWebViewHtml(pg),
        }}
      />
      {loading ? renderLoading() : null}
    </>
  );
};

export default AppPaymentGateway;
