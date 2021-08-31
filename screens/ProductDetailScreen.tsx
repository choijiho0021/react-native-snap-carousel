/* eslint-disable no-plusplus */
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
import KakaoSDK from '@actbase/react-native-kakaosdk';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {Component} from 'react';
import {
  Animated,
  Clipboard,
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

const {baseUrl, channelId, esimEng, esimGlobal, fbUser} = Env.get();

const HEADER_IMG_HEIGHT = 200;
const TAB_IDX_ASK_BY_KAKAO = 3; // KakaoTalk으로 물어보기 Tab의 index
const tabList = ['ProdInfo', 'Tip', 'Caution', 'Ask with KakaoTalk'];

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    paddingTop: 40,
    paddingHorizontal: 20,
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
  kakaoImage: {},
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

type ProductDetailScreenState = {
  scrollY: Animated.Value;
  tabIdx: number;
  querying: boolean;
  height1?: number;
  height2?: number;
  height3?: number;
};

class ProductDetailScreen extends Component<
  ProductDetailScreenProps,
  ProductDetailScreenState
> {
  controller: AbortController;

  scrollView: React.RefObject<ScrollView>;

  constructor(props: ProductDetailScreenProps) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      tabIdx: 0,
      querying: true,
    };

    this.openKTalk = this.openKTalk.bind(this);
    this.checkIdx = this.checkIdx.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.renderContactKakao = this.renderContactKakao.bind(this);
    this.renderWebView = this.renderWebView.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.checkWindowSize = this.checkWindowSize.bind(this);
    this.clickTab = this.clickTab.bind(this);

    this.controller = new AbortController();
    this.scrollView = React.createRef<ScrollView>();
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton title={this.props.route.params?.title} />
      ),
    });

    this.props.action.product.getProdDetail(this.controller);
  }

  // TODO : detailInfo 정보 비교 방법
  shouldComponentUpdate(
    preProps: ProductDetailScreenProps,
    preState: ProductDetailScreenState,
  ) {
    const {tabIdx, height2} = this.state;
    const {detailInfo, detailCommon} = this.props.product;

    return (
      preState.tabIdx !== tabIdx ||
      preState.height2 !== height2 ||
      preProps.product.detailInfo !== detailInfo ||
      preProps.product.detailCommon !== detailCommon
    );
  }

  onMessage(event: WebViewMessageEvent) {
    const cmd = JSON.parse(event.nativeEvent.data);

    switch (cmd.key) {
      case 'dimension':
        this.checkWindowSize(cmd.value);
        break;
      case 'moveToPage':
        if (cmd.value) {
          const item = this.props.info.infoMap
            .get('info')
            ?.find((elm) => elm.uuid === cmd.value);
          this.props.navigation.navigate('SimpleText', {
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
          this.props.navigation.navigate('Faq', {
            key: moveTo[0],
            num: moveTo[1],
          });
        }
        break;
      case 'copy':
        this.props.action.toast.push(Toast.COPY_SUCCESS);
        break;
      default:
        Clipboard.setString(cmd.value);
        break;
    }
  }

  openKTalk = () => {
    if (esimGlobal) {
      Linking.openURL(`fb-messenger-public://user-thread/${fbUser}`).catch(() =>
        AppAlert.info(i18n.t('acc:moveToFbDown'), '', () =>
          Linking.openURL(
            'https://apps.apple.com/kr/app/messenger/id454638411',
          ),
        ),
      );
    } else {
      KakaoSDK.Channel.chat(channelId).catch((_) => {
        this.props.action.toast.push(Toast.NOT_OPENED);
      });
    }
  };

  clickTab = (idx: number) => () => {
    // console.log('@@@ click tab', this._webView1)

    Analytics.trackEvent('Page_View_Count', {page: tabList[idx]});

    const height =
      idx < TAB_IDX_ASK_BY_KAKAO
        ? (this.state[`height${idx}`] || 0) + HEADER_IMG_HEIGHT
        : 0;
    this.scrollTo(height);
    this.setState({tabIdx: idx});
  };

  checkWindowSize(sizeString = '') {
    const sz = sizeString.split(',');
    const scale = windowWidth / Number(sz[0]);

    let i = 3;
    for (; i < sz.length; i++) {
      // 각 tab별로 시작 위치를 설정한다.
      this.setState({
        [`height${i - 2}`]: Math.ceil(Number(sz[i]) * scale),
      });
    }
    // 전체 화면의 높이를 저장한다.
    this.setState({
      [`height${i - 2}`]: Math.ceil(Number(sz[1]) * scale),
    });
  }

  checkIdx(event: NativeScrollEvent) {
    const {contentOffset} = event;
    let offset = contentOffset.y;

    // console.log('@@@ offset', offset, event)

    offset -= HEADER_IMG_HEIGHT;
    if (this.state.tabIdx !== TAB_IDX_ASK_BY_KAKAO) {
      for (let idx = 0; idx < TAB_IDX_ASK_BY_KAKAO; idx++) {
        // 어떤 tab 위치를 스크롤하고 있는지 계산한다.
        if (offset < this.state[`height${idx + 1}`]) {
          if (this.state.tabIdx !== idx) this.setState({tabIdx: idx});
          break;
        }
      }
    }
  }

  scrollTo(y: number) {
    // console.log('@@@ scroll to', y)

    if (this.scrollView.current)
      this.scrollView.current.scrollTo({x: 0, y, animated: true});
  }

  renderContactKakao() {
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
          {i18n.t('prodDetail:KakaoPlus')}
        </AppText>
        <AppButton
          iconName={
            esimGlobal
              ? `openFacebook${esimEng ? 'Eng' : ''}`
              : `openKakao${esimEng ? 'Eng' : ''}`
          }
          onPress={this.openKTalk}
          style={{flex: 1}}
        />
      </View>
    );
  }

  renderWebView() {
    const {height3} = this.state;
    const {route, product} = this.props;
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
        onMessage={this.onMessage}
        source={{html: htmlDetailWithCss(detail), baseUrl}}
        style={{height: height3 || 1000}}
      />
    );
  }

  render() {
    const {tabIdx} = this.state;
    const {pending, route} = this.props;

    return (
      <SafeAreaView style={styles.screen}>
        <AppActivityIndicator visible={pending} />
        <ScrollView
          style={{backgroundColor: colors.whiteTwo}}
          ref={this.scrollView}
          stickyHeaderIndices={[1]} //탭 버튼 고정
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={100}
          onScroll={({nativeEvent}) => {
            this.checkIdx(nativeEvent);
          }}>
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
                  key={elm + idx}
                  style={styles.whiteBackground}
                  titleStyle={[
                    styles.normal16WarmGrey,
                    idx === tabIdx ? styles.boldClearBlue : {},
                  ]}
                  title={i18n.t(`prodDetail:${elm}`)}
                  onPress={this.clickTab(idx)}
                />
              ))}
            </View>
          </View>
          {tabIdx === TAB_IDX_ASK_BY_KAKAO
            ? this.renderContactKakao()
            : this.renderWebView()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(
  ({product, status, info}: RootState) => ({
    product,
    pending: status.pending[productActions.getProdDetail.typePrefix] || false,
    info,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(ProductDetailScreen);
