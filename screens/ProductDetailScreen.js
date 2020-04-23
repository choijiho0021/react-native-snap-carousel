import React, {Component} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Platform,
  Animated,
  Image,
  FlatList,
  findNodeHandle,
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
import getEnvVars from '../environment'

const { baseUrl } = getEnvVars();

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = 200;

class ProductDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={navigation.getParam('title')} />,
  })

  constructor(props) {
    super(props)
    
    this.state = {
      imageAnimation : new Animated.Value(200),
      scrollY: new Animated.Value(0),
      isShow:true,
      offset:0
    }
    
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
    this.controller = new AbortController()
  }

  componentDidMount() {

    pageApi.getPageByCategory('Contract', this.controller).then(resp => { 
      console.log("resp -aaaa",resp)
      if ( resp.result == 0 && resp.objects.length > 0) {
        this.setState({
          body: resp.objects[0].body,
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

  componentDidUpdate(prevProps) {
  }

  onNavigationStateChange(navState) {
    // console.log("webView Height:", navState.title);
    console.log("navState", navState)

    navState.title.split(',').map((bottom, idx) => 
      this.setState({
        ['height' + idx] : Number(bottom)
      })) 
  }


  render() {
    const {querying = false, body, bodyTitle, imageAnimation, isShow, height0, height1, height2, height3, height4} = this.state
    const {navigation} = this.props

    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });

    const emptyHeaderHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT],
      extrapolate: 'clamp',
    });

    console.log("render")

    if(headerHeight > height1) {
      console.log("aaaaaa height")
    }

const html0 = htmlWithCss("test", body)
const html = [
  '<div id="testa" style="font-size:16px; border:1px solid black;"><h1>starta</h1> <p> test1 test2 </p> <p> test1 test2 </p></div>',
  '<div id="testb" style="font-size:16px; border:1px solid black;"><h1>startb</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>',
  '<div id="testc" style="font-size:16px; border:1px solid black;"><h1>startc</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>',
  '<div id="testd" style="font-size:16px; border:1px solid black;"><h1>startd</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>',
  '<div id="teste" style="font-size:16px; border:1px solid black;"><h1>starte</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>'
]


const script = `<script>window.location.hash = 1;
document.title = ['testa', 'testb', 'testc', 'testd', 'teste'].map(item => {
  var rect = document.getElementById(item).getBoundingClientRect();
  return rect.bottom;
}).join(',');</script>`
//const script = `<script>window.location.hash = 1;document.title = document.getElementById('testa').scrollHeight+',' + document.getElementById('testb').scrollHeight+',' + document.getElementById('testc').scrollHeight </script>`
// const script = `<script>window.location.hash = 1;document.title = document.getElementById('testa').clientHeight </script>`
const scale = 0.422

    return (
      <SafeAreaView style={styles.screen}>
        <AppActivityIndicator visible={querying} />


        <View>
          <Animated.View style={{height:headerHeight}}>
            <Animated.Image style={{height:headerHeight}} source={{uri:api.httpImageUrl(navigation.getParam('img'))}}/>
          </Animated.View>

          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginHorizontal:40}}>
            <AppButton title={'상품정보'} onPress={() => { this._scrollView.scrollTo({x: 0, y: 0, animated: true}) }}/>
            <AppButton title={'주의사항'} onPress={() => { 
              console.log('scroll to ', height0 * scale)
              this._scrollView.scrollTo({x: 0, y: height0 * scale, animated: true}) 
            }}/>
            <AppButton title={'사용팁'} onPress={() => { 
              console.log('scroll to ', height1 * scale)
              this._scrollView.scrollTo({x: 0, y: height1 * scale, animated: true}) 
            }}/>
            <AppButton title={'물어보기'} onPress={() => { 
              console.log('scroll to ', height2 * scale)
              this._scrollView.scrollTo({x: 0, y: height2 * scale, animated: true}) 
            }}/>
          </View>
        </View>

        {/* <Animated.View style={{height:emptyHeaderHeight}}></Animated.View> */}

        <ScrollView 
          ref={scrollView => {this._scrollView = scrollView}}
          style={{flex:1}}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={11}
          onScroll={event => { 
            console.log('scroll y:' + event.nativeEvent.contentOffset.y);
          }}
          //onScroll={Animated.event(
           // [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
          //)}// > 
          >
          <WebView 
            automaticallyAdjustContentInsets={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            decelerationRate="normal"
            onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}
            scrollEnabled = {false}
            source={{html: html.join('') + script} } 
            // style={{height:  2000}} 
            style={{height: height1 + height2 + height3 || 1000}} 
          />

        {/* <WebView 
        ref={webView2 => {this._webView2 = webView2}}
        automaticallyAdjustContentInsets={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        onLayout={event => {
          const layout = event.nativeEvent.layout;
          console.log('height:', layout.height);
          console.log('width:', layout.width);
          console.log('x:', layout.x);
          console.log('y:', layout.y);
        }}
        decelerationRate="normal"
        onNavigationStateChange={(navState) => this.onNavigationStateChange('webView2',navState)}
        scrollEnabled = {false}
        source={{html: html1 + script} } 
        style={{height:Number(webView2) ||200}} 
        />

        <WebView 
        ref={webView3 => {this._webView3 = webView3}}
        automaticallyAdjustContentInsets={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        decelerationRate="normal"
        onNavigationStateChange={(navState) => this.onNavigationStateChange('webView3',navState)}
        scrollEnabled = {false}
        source={{html: html1 + script} } 
        style={{height:Number(webView3) ||200}} 
        /> */}
         
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
});

export default ProductDetailScreen