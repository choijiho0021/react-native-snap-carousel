import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Animated,
  Image,
  Clipboard
} from 'react-native';

import i18n from '../utils/i18n'
import AppBackButton from '../components/AppBackButton';
import _ from 'underscore'
import AppActivityIndicator from '../components/AppActivityIndicator';
import api from '../utils/api/api';
import pageApi from '../utils/api/pageApi';
import AppAlert from '../components/AppAlert';
import { colors } from '../constants/Colors';
import { appStyles, htmlDetailWithCss } from '../constants/Styles';
import AppButton from '../components/AppButton';
import WebView from 'react-native-webview';
import getEnvVars from '../environment'
import Analytics from 'appcenter-analytics'

const HEADER_IMG_HEIGHT = 200;
const TAB_IDX_ASK_BY_KAKAO = 3    // KakaoTalk으로 물어보기 Tab의 index
const { baseUrl } = getEnvVars();

const tabList = ['ProdInfo','Tip','Caution','Ask with KakaoTalk']
const html = [
  '<button onclick="send()">Send</button> <div id="info" style="font-size:16px; border:1px solid black;"><h1>starta</h1>  <p> test1 test2 </p> <p> test1 test2 </p> </div>'
  // '<div id="testb" style="font-size:16px; border:1px solid black;"><h1>startb</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>',
  // '<div id="testc" style="font-size:16px; border:1px solid black;"><h1>startc</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>',
]

const script = `<script>
window.onload = function() {
  window.location.hash = 1;
  document.title = ['prodInfo', 'tip', 'caution'].map(item => {
    var rect = document.getElementById(item).getBoundingClientRect();
    return rect.bottom;
  }).join(',');
}
function copy(val) {
  var txtArea = document.createElement("textarea");
  document.body.appendChild(txtArea);
  txtArea.value = val;
  txtArea.select();
  document.execCommand("copy");
  document.body.removeChild(txtArea);
  }
function send() {
  window.ReactNativeWebView.postMessage('APN Value have to insert into this', '*');
  window.alert('copy');
};</script>`

// const script = `window.location.hash = 1;
// document.title = ['testa', 'testb', 'testc'].map(item => {
//   var rect = document.getElementById(item).getBoundingClientRect();
//   return rect.bottom;
// }).join(',');
// function send() {
//   window.ReactNativeWebView.postMessage('APN Value have to insert into this', '*');
//   window.alert('copy');
// };
// return true;`

const scale = 0.422

class ProductDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={navigation.getParam('title')} />,
  })

  constructor(props) {
    super(props)
    
    this.state = {
      scrollY: new Animated.Value(0),
      tabIdx : 0,
      querying : true,
      prodInfo : ''
    }
    
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
    this.checkIdx = this.checkIdx.bind(this)
    this._scrollTo = this._scrollTo.bind(this)
    this.renderContactKakao = this.renderContactKakao.bind(this)
    this.renderWebView = this.renderWebView.bind(this)
    this._onMessage = this._onMessage.bind(this)
    this.controller = new AbortController()
  }

  shouldComponentUpdate(preProps,preState){
    const {tabIdx, height2, prodInfo} = this.state
    return preState.tabIdx != tabIdx || preState.prodInfo != prodInfo || preState.height2 != height2 
  }

  componentDidMount() {

    //todo : 상세 HTML을 가져오도록 변경 필요
    pageApi.getProductDetails(this.controller).then(resp =>{
      if ( resp.result == 0 && resp.objects.length > 0) {
        this.setState({
          prodInfo: resp.objects,
          disable: false
        })
      }
      else throw Error('Failed to get contract')
    }).catch( err => {
      console.log('failed', err)
      AppAlert.error(i18n.t('set:fail'))
    }).finally(_ => {
      this.setState({
        querying: false
      })
    })

  }

  onNavigationStateChange(navState) {

    navState.title.split(',').map((bottom, idx) => 
      this.setState({
        ['height' + idx] : Number(bottom) * scale
      })) 
  }

  checkIdx(offset) {
    
    // todo: 정확하게 Title이 상단끝에 걸쳐야 idx가 변경되어야 하는지 확인필요
    if ( this.state.tabIdx != TAB_IDX_ASK_BY_KAKAO){
      for( var idx=0; idx< TAB_IDX_ASK_BY_KAKAO; idx++) {
        if ( offset < this.state['height' + idx]) break;
      }
      if(idx != TAB_IDX_ASK_BY_KAKAO) this.setState({tabIdx:idx})
    }
  }

  _scrollTo(y){
    console.log('scroll to y:', y)
    this._scrollView.scrollTo({x: 0, y: y, animated: true}) 
  }

  _clickTab = (idx) => () => {
    
    Analytics.trackEvent('Page_View_Count', {page: tabList[idx]})

    var height = 0;
    if ( idx < TAB_IDX_ASK_BY_KAKAO) height += (this.state['height' + (idx-1)] || 0) + HEADER_IMG_HEIGHT
    this._scrollTo( height)
    this.setState({tabIdx:idx})
  }

  //todo : 디자인 나오면 변경
  renderContactKakao() {
    return (
    <View>
      <Text>{i18n.t("prodDetail:Question")}</Text>
      <Text>{i18n.t("prodDetail:KakaoPlus")}</Text>
    </View>)
  }

  _onMessage(event) {
    const {data} = event.nativeEvent
    Clipboard.setString(data)
    console.log("Copy APN value : ",data)
  }

  renderWebView() {
    const {height2, prodInfo} = this.state

    return <WebView 
      ref={webView1 => {this._webView1 = webView1}}
      automaticallyAdjustContentInsets={false}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      scalesPageToFit={true}
      startInLoadingState={true}
      // injectedJavaScript={script}
      decelerationRate="normal"
      onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}
      scrollEnabled = {false}
      // source={{html: body + html + script} }
      onMessage={this._onMessage}
      source={{html: htmlDetailWithCss(prodInfo, script), baseUrl} }
      style={{height: height2 + HEADER_IMG_HEIGHT || 1000}}
    />
  }

  render() {
    const {querying = false, tabIdx} = this.state
    const {navigation} = this.props

    return (
      <SafeAreaView style={styles.screen}>
        <AppActivityIndicator visible={querying} />

        <ScrollView 
          ref={scrollView => {this._scrollView = scrollView}}
          stickyHeaderIndices={[1]} //탭 버튼 고정
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={11}
          onScroll={(state) => {this.checkIdx(state.nativeEvent.contentOffset.y)}}
          onContentSizeChange={this._clickTab(tabIdx)}>
          
          <View style={{height:HEADER_IMG_HEIGHT}}>
            <Image style={{height:HEADER_IMG_HEIGHT}} source={{uri:api.httpImageUrl(navigation.getParam('img'))}}/>
          </View>

          {/* ScrollView  stickyHeaderIndices로 상단 탭을 고정하기 위해서 View한번 더 사용*/}
          <View style={styles.whiteBackground}>
            <View style={styles.tabView}>
            {
              tabList.map((elm,idx) => 
                <AppButton
                  key = {elm + idx}
                  style={styles.whiteBackground}
                  titleStyle={[styles.normal16WarmGrey, (idx == tabIdx) ? styles.boldClearBlue : {}]}
                  title={i18n.t(`prodDetail:${elm}`)}
                  onPress={this._clickTab(idx)} />
              )
            }
            </View>
          </View>
          { 
            tabIdx == TAB_IDX_ASK_BY_KAKAO ? this.renderContactKakao() : this.renderWebView()
          }

        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems:'stretch',
    paddingTop: 40,
    paddingHorizontal: 20
  },
  tabView: {
    height: 60,
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    marginHorizontal: 20,
  },
  whiteBackground: {
    backgroundColor: colors.white
  },
  normal16WarmGrey: {
    ... appStyles.normal16Text,
    color: colors.warmGrey
  },
  boldClearBlue: {
    color: colors.clearBlue,
    fontWeight: 'bold'
  }

});

export default ProductDetailScreen