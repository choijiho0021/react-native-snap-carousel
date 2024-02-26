/* eslint-disable no-plusplus */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  Linking,
  NativeScrollEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import Clipboard from '@react-native-community/clipboard';
import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {windowWidth} from '@/constants/SliderEntry.style';
import {appStyles, htmlDetailWithCss} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {actions as infoActions, InfoModelState} from '@/redux/modules/info';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import {
  actions as toastActions,
  Toast,
  ToastAction,
} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import utils from '@/redux/api/utils';
import {parseJson} from '@/utils/utils';
import ScreenHeader from '@/components/ScreenHeader';

const {baseUrl, channelId, esimGlobal, fbUser} = Env.get();

const HEADER_IMG_HEIGHT = 200;
const TAB_IDX_ASK_BY_KAKAO = 3; // KakaoTalk으로 물어보기 Tab의 index
const tabList = ['ProdInfo', 'Tip', 'Caution', 'askWithKakaoTalk'];

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  tabView: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  whiteBackground: {
    backgroundColor: colors.white,
  },
  normal16WarmGrey: {
    ...appStyles.normal16Text,
    color: colors.warmGrey,
  },
  boldClearBlue: {
    color: colors.clearBlue,
    fontWeight: 'bold',
  },
  questionImage: {
    marginBottom: 14,
    marginTop: 45,
  },
  kakaoContainer: {
    alignItems: 'center',
    backgroundColor: colors.whiteTwo,
    height: 350,
  },
  kakaoPlus: {
    ...appStyles.normal14Text,
    marginTop: 56,
    marginBottom: 10,
    color: colors.warmGrey,
    textAlign: 'center',
  },
});

type ProductDetailScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ProductDetail'
>;

type ProductDetailScreenRouteProp = RouteProp<
  HomeStackParamList,
  'ProductDetail'
>;

type ProductDetailScreenProps = {
  navigation: ProductDetailScreenNavigationProp;
  route: ProductDetailScreenRouteProp;

  pending: boolean;
  product: ProductModelState;
  info: InfoModelState;

  action: {
    toast: ToastAction;
    product: ProductAction;
  };
};

const ProductDetailGlobalScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
  pending,
  product,
  info,
  action,
}) => {
  // controller: AbortController;
  const scrollView = useRef<ScrollView>(null);
  // const scrollY = useRef(new Animated.Value(0));
  const [tabIdx, setTabIdx] = useState(0);
  const [height, setHeight] = useState([0, 0, 0, 0]);

  useEffect(() => {
    if (!product.detailCommon) {
      action.product.getProdDetailCommon();
    }

    if (product.partnerId !== route.params?.partnerId) {
      action.product.getProdDetailInfo(route.params?.partnerId || '');
    }
  }, [
    action.product,
    product.detailCommon,
    product.partnerId,
    route.params?.partnerId,
  ]);

  const checkWindowSize = useCallback((sizeString = '') => {
    const sz = sizeString.split(',');
    const scale = windowWidth / Number(sz[0]);

    for (let i = 3; i < sz.length; i++) {
      // 각 tab별로 시작 위치를 설정한다.
      setHeight((prev) => {
        prev[sz.length - 2] = Math.ceil(Number(sz[i]) * scale);
        return prev;
      });
    }
    // 전체 화면의 높이를 저장한다.
    setHeight((prev) => {
      prev[sz.length - 2] = Math.ceil(Number(sz[1]) * scale);
      return prev;
    });
  }, []);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const cmd = parseJson(event.nativeEvent.data);

      switch (cmd.key) {
        case 'dimension':
          checkWindowSize(cmd.value);
          break;
        case 'moveToPage':
          if (cmd.value) {
            const item = info.infoMap
              .get('info')
              ?.find((elm) => elm.uuid === cmd.value);
            navigation.navigate('SimpleText', {
              key: 'noti',
              title: i18n.t('set:noti'),
              bodyTitle: item?.title,
              body: item?.body,
              mode: 'html',
            });
          }
          break;
        case 'moveToFaq':
          if (cmd.value) {
            const moveTo = cmd.value.split('/');
            navigation.navigate('Faq', {
              key: moveTo[0],
              num: moveTo[1],
            });
          }
          break;
        case 'copy':
          action.toast.push(Toast.COPY_SUCCESS);
          break;
        default:
          Clipboard.setString(cmd.value);
          break;
      }
    },
    [action.toast, checkWindowSize, info.infoMap, navigation],
  );

  const openKTalk = useCallback(() => {
    if (esimGlobal) {
      Linking.openURL(`fb-messenger-public://user-thread/${fbUser}`).catch(() =>
        AppAlert.info(i18n.t('acc:moveToFbDown'), '', () =>
          Linking.openURL('http://appstore.com/Messenger'),
        ),
      );
    } else {
      KakaoSDK.KakaoChannel.chat(channelId).catch(() => {
        action.toast.push(Toast.NOT_OPENED);
      });
    }
  }, [action.toast]);

  const scrollTo = useCallback((y: number) => {
    if (scrollView.current)
      scrollView.current.scrollTo({x: 0, y, animated: true});
  }, []);

  const clickTab = useCallback(
    (idx: number) => () => {
      Analytics.trackEvent('Page_View_Count', {
        page:
          tabList[idx] === 'askWithKakaoTalk'
            ? 'Ask with KakaoTalk'
            : tabList[idx],
      });

      const h =
        idx < TAB_IDX_ASK_BY_KAKAO ? (height[idx] || 0) + HEADER_IMG_HEIGHT : 0;
      scrollTo(h);
      setTabIdx(idx);
    },
    [height, scrollTo],
  );

  const checkIdx = useCallback(
    (event: NativeScrollEvent) => {
      const {contentOffset} = event;
      let offset = contentOffset.y;

      offset -= HEADER_IMG_HEIGHT;
      if (tabIdx !== TAB_IDX_ASK_BY_KAKAO) {
        for (let idx = 0; idx < TAB_IDX_ASK_BY_KAKAO; idx++) {
          // 어떤 tab 위치를 스크롤하고 있는지 계산한다.
          if (offset < height[idx + 1]) {
            if (tabIdx !== idx) setTabIdx(idx);
            break;
          }
        }
      }
    },
    [height, tabIdx],
  );

  const renderContactKakao = useCallback(() => {
    return (
      <View style={styles.kakaoContainer}>
        <AppIcon style={styles.questionImage} name="imgQuestion" />
        <AppText style={appStyles.normal16Text}>
          <AppText style={{...appStyles.normal16Text, color: colors.clearBlue}}>
            {i18n.t('prodDetail:Rokebi')}
          </AppText>
          {i18n.t('prodDetail:On')}
        </AppText>
        <AppText style={appStyles.normal16Text}>
          {i18n.t('prodDetail:Question')}
        </AppText>

        <AppText style={styles.kakaoPlus}>
          {i18n.t(
            esimGlobal ? 'prodDetail:FacebookMessage' : 'prodDetail:KakaoPlus',
          )}
        </AppText>
        <AppButton
          iconName={esimGlobal ? 'openFacebookEng' : 'openKakao'}
          onPress={openKTalk}
          style={{flex: 1}}
        />
      </View>
    );
  }, [openKTalk]);

  const renderWebView = useCallback(() => {
    const localOpDetails = route.params?.localOpDetails;
    const detail = _.isEmpty(localOpDetails)
      ? product.detailInfo + product.detailCommon
      : localOpDetails + product.detailCommon;

    return (
      <WebView
        automaticallyAdjustContentInsets={false}
        javaScriptEnabled
        domStorageEnabled
        scalesPageToFit
        startInLoadingState
        // injectedJavaScript={script}
        decelerationRate="normal"
        // onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}
        scrollEnabled
        // source={{html: body + html + script} }
        onMessage={onMessage}
        source={{html: htmlDetailWithCss(detail), baseUrl}}
        style={{height: height[3] || 1000}}
      />
    );
  }, [
    height,
    onMessage,
    product.detailCommon,
    product.detailInfo,
    route.params?.localOpDetails,
  ]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title={route.params?.title} />
      <AppActivityIndicator visible={pending} />
      <ScrollView
        style={{backgroundColor: colors.whiteTwo}}
        ref={scrollView}
        stickyHeaderIndices={[1]} // 탭 버튼 고정
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}
        onScroll={({nativeEvent}) => checkIdx(nativeEvent)}>
        <View style={{height: HEADER_IMG_HEIGHT}}>
          <Image
            style={{height: HEADER_IMG_HEIGHT}}
            source={{
              uri: API.default.httpImageUrl(route.params?.img),
            }}
          />
        </View>

        {/* ScrollView  stickyHeaderIndices로 상단 탭을 고정하기 위해서 View한번 더 사용 */}
        <View style={styles.whiteBackground}>
          <View style={styles.tabView}>
            {tabList.map((elm, idx) => (
              <AppButton
                key={utils.generateKey(elm + idx)}
                style={styles.whiteBackground}
                titleStyle={[
                  styles.normal16WarmGrey,
                  idx === tabIdx ? styles.boldClearBlue : {},
                ]}
                title={i18n.t(`prodDetail:${elm}`)}
                onPress={clickTab(idx)}
              />
            ))}
          </View>
        </View>
        {tabIdx === TAB_IDX_ASK_BY_KAKAO
          ? renderContactKakao()
          : renderWebView()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default connect(
  ({product, status, info}: RootState) => ({
    product,
    pending:
      status.pending[productActions.getProdDetailCommon.typePrefix] ||
      status.pending[productActions.getProdDetailInfo.typePrefix] ||
      false,
    info,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(ProductDetailGlobalScreen);
