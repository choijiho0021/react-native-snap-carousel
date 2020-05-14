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
import utils from '../utils/utils';
import getEnvVars from '../environment'
import Analytics from 'appcenter-analytics'

const HEADER_IMG_HEIGHT = 200;
const INIT_IDX = 999;
const { baseUrl } = getEnvVars();

const tabList = ['ProdInfo','Caution','Tip','Ask with KakaoTalk']
const html = [
  '<button onclick="send()">Send</button> <div id="info" style="font-size:16px; border:1px solid black;"><h1>starta</h1>  <p> test1 test2 </p> <p> test1 test2 </p> </div>'
  // '<div id="testb" style="font-size:16px; border:1px solid black;"><h1>startb</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>',
  // '<div id="testc" style="font-size:16px; border:1px solid black;"><h1>startc</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>',
]

const script = `<script>window.location.hash = 1;
document.title = ['prodInfo', 'caution', 'tip'].map(item => {
  var rect = document.getElementById(item).getBoundingClientRect();
  return rect.bottom;
}).join(',');
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
      idx : INIT_IDX,
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
    const {idx, height2, prodInfo, Tip, Caution} = this.state
    return preState.idx != idx || preState.prodInfo != prodInfo || preState.height2 != height2 || preState.Tip != Tip || preState.Caution != Caution
  }

  componentDidMount() {

    const Tip =this.props.navigation.getParam('Tip')
    const Caution =this.props.navigation.getParam('Caution')

    this.setState({Tip,Caution})

    //todo : 상세 HTML을 가져오도록 변경 필요
    pageApi.getPageByCategory('prodInfo', this.controller).then(resp => { 
      console.log("resp",resp)
      if ( resp.result == 0 && resp.objects.length > 0) {
        this.setState({
          prodInfo: resp.objects[0].body,
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
    if ( this.state.idx != 3){
      for( var idx=0; idx<3; idx++) {
        if ( offset < this.state['height' + idx]) break;
      }
      if(idx != 3) this.setState({idx})
    }
  }

  _scrollTo(y){
    console.log('scroll to y:', y)
    this._scrollView.scrollTo({x: 0, y: y, animated: true}) 
  }

  _clickTab = (idx) => () => {
    
    Analytics.trackEvent('Page_View_Count', {page: tabList[idx+1]})

    var height = 0;
    if ( idx < 3) height += (this.state['height' + (idx-1)] || 0) + HEADER_IMG_HEIGHT
    this._scrollTo( height)
    this.setState({idx})
  }

  //todo : 디자인 나오면 변경
  renderContactKakao() {
    return (
    <View>
      <Text> 로밍도깨비에 궁금하신점 있으신가요?</Text>
      <Text> 카카오톡 플러스 친구로 편하게 물어보세요!</Text>
    </View>)
  }

  _onMessage(event) {
    const {data} = event.nativeEvent
    Clipboard.setString(data)
    console.log("Copy APN value : ",data)
  }

  renderWebView() {
    const {prodInfo, Tip, Caution, height2} = this.state

    return (
    <WebView 
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
      source={{html: htmlDetailWithCss(prodInfo + Caution + Tip + script), baseUrl} }
      style={{height: height2 + HEADER_IMG_HEIGHT || 1000}}
    />)
  }

  render() {
    const {querying = false, idx} = this.state
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
          onContentSizeChange={this._clickTab(idx)}>
          
          <View style={{height:HEADER_IMG_HEIGHT}}>
            <Image style={{height:HEADER_IMG_HEIGHT}} source={{uri:api.httpImageUrl(navigation.getParam('img'))}}/>
          </View>

          {/* ScrollView  stickyHeaderIndices로 상단 탭을 고정하기 위해서 View한번 더 사용*/}
          <View style={styles.whiteBackground}>
            <View style={styles.tabView}>
            {
              tabList.map((elm,idx) => (
                <AppButton
                key = {elm + idx}
                style={styles.whiteBackground}
                titleStyle={[styles.normal16WarmGrey, (idx == 0 || idx == INIT_IDX) && styles.boldClearBlue]}
                title={i18n.t(`prodDetail:${elm}`)}
                onPress={this._clickTab(idx)}
              />
              ))
            }
            </View>
          </View>
          {idx == 3 && this.renderContactKakao() }
          
          {idx != 3 && this.renderWebView()}

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