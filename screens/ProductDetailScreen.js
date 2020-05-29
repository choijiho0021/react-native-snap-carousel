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
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

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
import KakaoSDK from '@actbase/react-native-kakaosdk';
import { windowWidth } from '../constants/SliderEntry.style';
import * as toastActions from '../redux/modules/toast'
import { Toast } from '../constants/CustomTypes'

const { channelId } = getEnvVars()

const HEADER_IMG_HEIGHT = 200;
const TAB_IDX_ASK_BY_KAKAO = 3    // KakaoTalk으로 물어보기 Tab의 index
const { baseUrl } = getEnvVars();

const tabList = ['ProdInfo','Tip','Caution','Ask with KakaoTalk']
const html = [
  '<button onclick="send()">Send</button> <div id="info" style="font-size:16px; border:1px solid black;"><h1>starta</h1>  <p> test1 test2 </p> <p> test1 test2 </p> </div>'
  // '<div id="testb" style="font-size:16px; border:1px solid black;"><h1>startb</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>',
  // '<div id="testc" style="font-size:16px; border:1px solid black;"><h1>startc</h1> <p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p> <p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p><p> test1 test2 </p></div>',
]

// document.body.clientWidth : 화면의 너비
// document.documentElement.clientHeight : 문서의 총 높이 
// getBoundingClientRect().y : 각 div의 시작 위치 y position

const script = `<script>
window.onload = function () {
  window.location.hash = 1;
  var dimension = document.body.clientWidth + ',' + document.documentElement.clientHeight + ',' + 
    ['prodInfo', 'tip', 'caution'].map(item => {
      var rect = document.getElementById(item).getBoundingClientRect();
      return rect.y;
    }).join(',');
  window.ReactNativeWebView.postMessage('size:' + dimension);
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
}
</script>`


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
    
    this._openKTalk = this._openKTalk.bind(this);
    this.checkIdx = this.checkIdx.bind(this)
    this._scrollTo = this._scrollTo.bind(this)
    this.renderContactKakao = this.renderContactKakao.bind(this)
    this.renderWebView = this.renderWebView.bind(this)
    this._onMessage = this._onMessage.bind(this)
    this._checkWindowSize = this._checkWindowSize.bind(this)
    this._clickTab = this._clickTab.bind(this)

    this.controller = new AbortController()
    this.scrollView = React.createRef()
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

  _checkWindowSize(sizeString = '') {

    const sz = sizeString.split(','),
      scale = windowWidth / Number(sz[0])

    // console.log('@@@ height', sizeString, scale)

    for( var i =2; i< sz.length; i++) {
      // 각 tab별로 시작 위치를 설정한다. 
      this.setState({
        ['height' + (i-2)] : Math.ceil( Number(sz[i]) * scale)
      })
    }
    // 전체 화면의 높이를 저장한다.
    this.setState({
      ['height' + (i-2)]: Math.ceil( Number(sz[1]) * scale)
    })
  }

  checkIdx(event) {
    var { contentOffset } = event,
      offset = contentOffset.y

    // console.log('@@@ offset', offset, event)
    
    offset -= HEADER_IMG_HEIGHT
    if ( this.state.tabIdx != TAB_IDX_ASK_BY_KAKAO){
      for( var idx=0; idx< TAB_IDX_ASK_BY_KAKAO; idx++) {
        // 어떤 tab 위치를 스크롤하고 있는지 계산한다.
        if ( offset < this.state['height' + (idx+1)] ) {
          if ( this.state.tabIdx != idx) this.setState({tabIdx:idx })
          break
        }
      }
    }
  }

  _scrollTo(y){
    // console.log('@@@ scroll to', y)
    
    if ( this.scrollView.current) this.scrollView.current.scrollTo({x: 0, y: y, animated: true}) 
  }

  _clickTab = (idx) => () => {
    // console.log('@@@ click tab', this._webView1)
    
    Analytics.trackEvent('Page_View_Count', {page: tabList[idx]})

    const height = ( idx < TAB_IDX_ASK_BY_KAKAO) ? (this.state['height' + idx] || 0) + HEADER_IMG_HEIGHT : 0
    this._scrollTo( height)
    this.setState({tabIdx:idx})
  }
  _openKTalk = () => {
    KakaoSDK.Channel.chat(channelId)
      .catch(_ => { this.props.action.toast.push(Toast.NOT_OPENED) });  
  }

  renderContactKakao() {
    return (
    <View style={styles.kakaoContainer}>
      <Image style={styles.questionImage} source={require('../assets/images/main/imgQuestion.png')} />
      <Text style={appStyles.normal16Text}>
        <Text style={{...appStyles.normal16Text, color:colors.clearBlue, }}>{i18n.t("prodDetail:Rokebi")}</Text>
        {i18n.t("prodDetail:On")}
      </Text>
      <Text style={appStyles.normal16Text}>{i18n.t("prodDetail:Question")}</Text>

      <Text style={styles.kakaoPlus}>{i18n.t("prodDetail:KakaoPlus")}</Text>
      <AppButton iconName="openKakao" onPress={this._openKTalk} style={{flex:1}}/>
    </View>)
  }

  _onMessage(event) {
    const {data} = event.nativeEvent

    // console.log("@@@ on Message : ", data)

    if ( data.startsWith('size:')) {
      this._checkWindowSize( data.substring(5))
    }
    else {
      Clipboard.setString(data)
    }
  }

  renderWebView() {
    const {height3, prodInfo} = this.state

    return <WebView 
      automaticallyAdjustContentInsets={false}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      scalesPageToFit={true}
      startInLoadingState={true}
      // injectedJavaScript={script}
      decelerationRate="normal"
      // onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}
      scrollEnabled = {true}
      // source={{html: body + html + script} }
      onMessage={this._onMessage}
      source={{html: htmlDetailWithCss(prodInfo, script), baseUrl} }
      style={{height: height3 || 1000}}
    />
  }

  render() {
    const {querying = false, tabIdx} = this.state
    const {navigation} = this.props

    return (
      <SafeAreaView style={styles.screen}>
        <AppActivityIndicator visible={querying} />

        <ScrollView style={{backgroundColor:colors.whiteTwo}}
          ref={this.scrollView}
          stickyHeaderIndices={[1]} //탭 버튼 고정
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={100}
          onScroll={(state) => {this.checkIdx(state.nativeEvent)}} >
          
          {
          <View style={{height:HEADER_IMG_HEIGHT}}>
            <Image style={{height:HEADER_IMG_HEIGHT}} source={{uri:api.httpImageUrl(navigation.getParam('img'))}}/>
          </View>
          }

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
          </View >
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
  },
  questionImage : {
    marginBottom: 14,
    marginTop: 45
  },
  kakaoImage : {
  },
  kakaoContainer : {
    alignItems:'center',
    backgroundColor:colors.whiteTwo,
    height: 350
  },
  kakaoPlus : {
    ... appStyles.normal14Text, 
    marginTop:56, 
    marginBottom: 10, 
    color:colors.warmGrey}

});

export default connect(undefined, (dispatch) => ({
  action : {
    toast: bindActionCreators(toastActions, dispatch)
  }
}))(ProductDetailScreen)