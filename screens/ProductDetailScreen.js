/* eslint-disable no-plusplus */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Animated,
  Image,
  Clipboard,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import _ from 'underscore';
import WebView from 'react-native-webview';
import Analytics from 'appcenter-analytics';
import KakaoSDK from '@actbase/react-native-kakaosdk';
import {API} from '../submodules/rokebi-utils';
import i18n from '../utils/i18n';
import AppBackButton from '../components/AppBackButton';
import AppActivityIndicator from '../components/AppActivityIndicator';
import {colors} from '../constants/Colors';
import {appStyles, htmlDetailWithCss} from '../constants/Styles';
import AppButton from '../components/AppButton';
import Env from '../environment';
import {windowWidth} from '../constants/SliderEntry.style';
import * as toastActions from '../redux/modules/toast';
import * as productActions from '../redux/modules/product';
import {Toast} from '../constants/CustomTypes';
import AppIcon from '../components/AppIcon';

const {channelId} = Env.get();

const HEADER_IMG_HEIGHT = 200;
const TAB_IDX_ASK_BY_KAKAO = 3; // KakaoTalk으로 물어보기 Tab의 index
const {baseUrl} = Env.get();

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
  },
});

// document.body.clientWidth : 화면의 너비
// document.documentElement.clientHeight : 문서의 총 높이
// getBoundingClientRect().y : 각 div의 시작 위치 y position

const script = `<script>
window.onload = function () {
  window.location.hash = 1;
  var cmd = {
    key: 'dimension',
    value: document.body.clientWidth + ',' + document.documentElement.clientHeight + ',' + 
      ['prodInfo', 'tip', 'caution'].map(item => {
        var rect = document.getElementById(item).getBoundingClientRect();
        return rect.y;
      }).join(',')
    };
  window.ReactNativeWebView.postMessage(JSON.stringify(cmd));
}
function copy() {
  var copyTxt = document.getElementById('copyTxt').firstChild.innerHTML;
  var txtArea = document.createElement("textarea");
  document.body.appendChild(txtArea);
  txtArea.value = copyTxt;
  txtArea.select();
  document.execCommand("copy");
  document.body.removeChild(txtArea);

  var cmd = {
    key: 'copy'
  }  
  window.ReactNativeWebView.postMessage(JSON.stringify(cmd));
}
function go(){
  var cmd = {
    key: 'move',
    value: document.getElementsByClassName('moveToBox')[0].getAttribute('value')
  };
  window.ReactNativeWebView.postMessage(JSON.stringify(cmd));
}
function send() {
  window.ReactNativeWebView.postMessage('APN Value have to insert into this', '*');
  window.alert('copy');
}
</script>`;

class ProductDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      tabIdx: 0,
      querying: true,
    };

    this.toastRef = React.createRef();

    this.openKTalk = this.openKTalk.bind(this);
    this.checkIdx = this.checkIdx.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.renderContactKakao = this.renderContactKakao.bind(this);
    this.renderWebView = this.renderWebView.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.checkWindowSize = this.checkWindowSize.bind(this);
    this.clickTab = this.clickTab.bind(this);

    this.controller = new AbortController();
    this.scrollView = React.createRef();
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          navigation={this.props.navigation}
          title={this.props.route.params && this.props.route.params.title}
        />
      ),
    });

    // todo : 상세 HTML을 가져오도록 변경 필요
    this.props.action.product.getProdDetail(this.controller);
  }

  shouldComponentUpdate(preProps, preState) {
    const {tabIdx, height2} = this.state;
    const {detail} = this.props.product;

    return (
      preState.tabIdx !== tabIdx ||
      preState.height2 !== height2 ||
      preProps.detail !== detail ||
      preProps.localOpDetails !== this.props.localOpDetails
    );
  }

  onMessage(event) {
    const cmd = JSON.parse(event.nativeEvent.data);

    switch (cmd.key) {
      case 'dimension':
        this.checkWindowSize(cmd.value);
        break;
      case 'move':
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
    }
  }

  openKTalk = () => {
    KakaoSDK.Channel.chat(channelId).catch(() => {
      this.props.action.toast.push(Toast.NOT_OPENED);
    });
  };

  clickTab = (idx) => () => {
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

    // console.log('@@@ height', sizeString, scale)

    for (let i = 2; i < sz.length; i++) {
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

  checkIdx(event) {
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

  scrollTo(y) {
    // console.log('@@@ scroll to', y)

    if (this.scrollView.current)
      this.scrollView.current.scrollTo({x: 0, y, animated: true});
  }

  renderContactKakao() {
    return (
      <View style={styles.kakaoContainer}>
        <AppIcon style={styles.questionImage} name="imgQuestion" />
        <Text style={appStyles.normal16Text}>
          <Text style={{...appStyles.normal16Text, color: colors.clearBlue}}>
            {i18n.t('prodDetail:Rokebi')}
          </Text>
          {i18n.t('prodDetail:On')}
        </Text>
        <Text style={appStyles.normal16Text}>
          {i18n.t('prodDetail:Question')}
        </Text>

        <Text style={styles.kakaoPlus}>{i18n.t('prodDetail:KakaoPlus')}</Text>
        <AppButton
          iconName="openKakao"
          onPress={this.openKTalk}
          style={{flex: 1}}
        />
      </View>
    );
  }

  renderWebView() {
    const {height3} = this.state;
    const localOpDetails =
      this.props.route.params && this.props.route.params.localOpDetails;
    const detail = _.isEmpty(localOpDetails)
      ? this.props.product.detail
      : localOpDetails;

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
        source={{html: htmlDetailWithCss(detail, script), baseUrl}}
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
          onScroll={(state) => {
            this.checkIdx(state.nativeEvent);
          }}>
          <View style={{height: HEADER_IMG_HEIGHT}}>
            <Image
              style={{height: HEADER_IMG_HEIGHT}}
              source={{
                uri: API.default.httpImageUrl(route.params && route.params.img),
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
  (state) => ({
    product: state.product.toObject(),
    pending: state.pender.pending[productActions.GET_PROD_DETAIL] || false,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(ProductDetailScreen);
