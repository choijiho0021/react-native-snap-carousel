import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Animated,
  Image,
  PixelRatio
} from 'react-native';

import i18n from '../utils/i18n'
import AppBackButton from '../components/AppBackButton';
import _ from 'underscore'
import AppActivityIndicator from '../components/AppActivityIndicator';
import api from '../utils/api/api';
import pageApi from '../utils/api/pageApi';
import AppAlert from '../components/AppAlert';
import { colors } from '../constants/Colors';
import { appStyles, htmlWithCss } from '../constants/Styles';
import AppButton from '../components/AppButton';
import WebView from 'react-native-webview';
import utils from '../utils/utils';

const HEADER_IMG_HEIGHT = 200;
const INIT_IDX = 999;

const html = [
  '<div id="testa" style="font-size:16px; border:1px solid black;"><h1>starta</h1> <p> test1 test2 </p> <p> test1 test2 </p></div>',
  '<div id="testb" style="font-size:16px; border:1px solid black;"><h1>startb</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>',
  '<div id="testc" style="font-size:16px; border:1px solid black;"><h1>startc</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>',
]

const script = `<script>window.location.hash = 1;
document.title = ['testa', 'testb', 'testc'].map(item => {
  var rect = document.getElementById(item).getBoundingClientRect();
  return rect.bottom;
}).join(',');</script>`

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
      body : ''
    }
    
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
    this.checkIdx = this.checkIdx.bind(this)
    this._scrollTo = this._scrollTo.bind(this)
    this.renderContactKakao = this.renderContactKakao.bind(this)
    this.renderWebView = this.renderWebView.bind(this)
    this.controller = new AbortController()
  }

  shouldComponentUpdate(preProps,preState){
    const {idx, height2, body} = this.state

    return preState.idx != idx || preState.body != body || preState.height2 != height2
  }

  componentDidMount() {

    //todo : 상세 HTML을 가져오도록 변경 필요
    pageApi.getPageByCategory('Contract', this.controller).then(resp => { 
      console.log("resp -aaaa",resp)
      if ( resp.result == 0 && resp.objects.length > 0) {
        this.setState({
          body: htmlWithCss("test", resp.objects[0].body),
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
    // if(this.state.idx != 3){
    //   if(offset < height0 * scale + HEADER_IMG_HEIGHT - 1 && this.state.idx != 0){
    //     this.setState({idx : 0})
    //   }
    //   else if(offset >= height0 * scale + HEADER_IMG_HEIGHT -1 && offset < height1 * scale + HEADER_IMG_HEIGHT -1 && this.state.idx != 1){
    //     this.setState({idx : 1})
    //   }
    //   else if(offset >= height1 * scale + HEADER_IMG_HEIGHT -1 && this.state.idx != 2) {
    //     this.setState({idx : 2})
    //   }
    // }

    // 정확하게 Title이 상단끝에 걸쳐야 idx가 변경되어야 하는가?
    if ( this.state.idx != 3){
      var idx = 0;
      for( var i=0; i<2; i++) {
        if ( offset < this.state['height' + i]) break;
      }
      this.setState({idx})
    }
  }

  _scrollTo(y){
    console.log('scroll to y:', y)
    this._scrollView.scrollTo({x: 0, y: y, animated: true}) 
  }

  _clickTab(idx) {
    var height = 0;
    if ( idx < 3) height += (this.state['height' + (idx-1)] || 0) + HEADER_IMG_HEIGHT
    this._scrollTo( height)
    this.setState({idx})
  }

  renderContactKakao() {
    return (
    <View>
      <Text> 로밍도깨비에 궁금하신점 있으신가요?</Text>
      <Text> 카카오톡 플러스 친구로 편하게 물어보세요!</Text>
    </View>)
  }

  renderWebView() {
    const {body, height2} = this.state

    return (
    <WebView 
      ref={webView1 => {this._webView1 = webView1}}
      automaticallyAdjustContentInsets={false}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      scalesPageToFit={true}
      decelerationRate="normal"
      onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}
      scrollEnabled = {false}
      // source={{html: body + html + script} } 
      source={{html: html + script} } 
      style={{height: height2 * scale + HEADER_IMG_HEIGHT || 1000}} 
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
          onContentSizeChange={(contentWidth, contentHeight)=>{this._clickTab(idx)}}>
          
          <View style={{height:HEADER_IMG_HEIGHT}}>
            <Image style={{height:HEADER_IMG_HEIGHT}} source={{uri:api.httpImageUrl(navigation.getParam('img'))}}/>
          </View>

          {/* ScrollView  stickyHeaderIndices로 상단 탭을 고정하기 위해서 View한번 더 사용*/}
          <View style={{backgroundColor:colors.white}}>
            <View style={styles.tabView}>
              <AppButton 
                style={{backgroundColor: idx == 0 || idx == INIT_IDX ? colors.tomato : colors.gray}} 
                title={'상품정보'} 
                onPress={() => {this._clickTab(0)}}
              />
              <AppButton 
                style={{backgroundColor: idx == 1 ? colors.tomato : colors.gray}}
                title={'주의사항'} 
                onPress={() => {this._clickTab(1)}}
              />
              <AppButton 
                style={{backgroundColor: idx == 2 ? colors.tomato : colors.gray}} 
                title={'사용팁'} 
                onPress={() => {this._clickTab(2)}}
              />
              <AppButton 
              style={{backgroundColor: idx == 3 ? colors.tomato : colors.gray}} 
              title={'물어보기'} 
              onPress={() => {this._clickTab(3)}}
              />
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
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    marginHorizontal:40
  }
});

export default ProductDetailScreen