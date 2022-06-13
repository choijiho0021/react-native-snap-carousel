/* eslint-disable no-plusplus */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component, useState} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {windowWidth} from '@/constants/SliderEntry.style';
import {appStyles, htmlDetailWithCss} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {actions as infoActions, InfoModelState} from '@/redux/modules/info';
import {
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
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
import AppSnackBar from '@/components/AppSnackBar';
import {useCallback, useEffect} from 'react';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import analytics, {firebase} from '@react-native-firebase/analytics';
import Analytics from 'appcenter-analytics';
import {Settings} from 'react-native-fbsdk';

import {
  getTrackingStatus,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import {API} from '@/redux/api';
import {ApiResult} from '@/redux/api/api';
import {RkbProduct} from '../redux/api/productApi';
import {PurchaseItem} from '../redux/models/purchaseItem';
import {
  actions as cartActions,
  CartAction,
  CartModelState,
} from '@/redux/modules/cart';

const {baseUrl, esimApp, esimGlobal} = Env.get();
const PURCHASE_LIMIT = 10;

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
  buttonBox: {
    flexDirection: 'row',
  },
  btnCart: {
    width: '50%',
    height: 52,
    backgroundColor: '#ffffff',
    borderColor: colors.lightGrey,
    borderTopWidth: 1,
  },
  btnCartText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.black,
  },
  btnBuy: {
    width: '50%',
    height: 52,
    backgroundColor: colors.clearBlue,
  },
  btnBuyText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.white,
  },
  regCard: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    textAlignVertical: 'bottom',
    width: '100%',
  },
  regCardView: {
    width: '100%',
    height: 52,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: colors.lightGrey,
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
  account: AccountModelState;
  cart: CartModelState;

  action: {
    toast: ToastAction;
    product: ProductAction;
    cart: CartAction;
  };
};

const details = `
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, width=device-width, target-densitydpi=medium-dpi">
	<meta name="robots" content="all">
	<title>로밍도깨비eSIM</title>
	<!-- font CSS -->
	<link rel="stylesheet" href="../font/Pretendard.css">
	<link type="text/css" rel="stylesheet" href="../css/common.css">
</head>
<style>
@font-face {
	font-family: 'Pretendard';
	font-weight: 700;
	font-display: swap;
	src: local('Pretendard Bold'), url('./pretendard/Pretendard-Bold.woff2') format('woff2'), url('./pretendard/Pretendard-Bold.woff') format('woff');
}
@font-face {
	font-family: 'Pretendard';
	font-weight: 600;
	font-display: swap;
	src: local('Pretendard SemiBold'), url('./pretendard/Pretendard-SemiBold.woff2') format('woff2'), url('./pretendard/Pretendard-SemiBold.woff') format('woff');
}
@font-face {
	font-family: 'Pretendard';
	font-weight: 500;
	font-display: swap;
	src: local('Pretendard Medium'), url('./pretendard/Pretendard-Medium.woff2') format('woff2'), url('./pretendard/Pretendard-Medium.woff') format('woff');
}
@font-face {
	font-family: 'Pretendard';
	font-weight: 400;
	font-display: swap;
	src: local('Pretendard Regular'), url('./pretendard/Pretendard-Regular.woff2') format('woff2'), url('./pretendard/Pretendard-Regular.woff') format('woff');
}

html,body{position:static;height:100%;overflow:auto;overflow-x:hidden;-webkit-touch-callout:none;-webkit-user-select:none;-webkit-text-size-adjust:none;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color:transparent;}
body{font-family:'Pretendard', 'Sans-serif';font-weight:400;font-size:14px;color:#2c2c2c;word-break:keep-all;}
body,div,p,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,table,th,td,pre,form,fieldset,legend,input,textarea,button,select,blockquote,strong{margin:0;padding:0;font-weight:400;}
input,textarea,select,button,td,th,h1,h2,h3,h4,h5,h6{font-family:inherit;font-size:14px;color:#2c2c2c;outline:none;}
img,fieldset,button,iframe{border:0 none;}
dl,ul,ol,menu,li{list-style:none;}
blockquote,q{quotes:none;}
blockquote:before,blockquote:after,q:before,q:after{content:'';content:none;}
address,caption,cite,code,dfn,em,var{font-style:normal;}
table{width:100%;border-collapse:collapse;border-spacing:0;}
hr{display:none;}
caption{visibility:hidden;width:0;height:0;font-size:0;line-height:0;}
legend{display:block;overflow:hidden;visibility:hidden;position:absolute;top:-1000em;left:0;}
button{border:0 none;background-color:transparent;}
img{vertical-align:top;}
a{display:inline-block;color:#2c2c2c;text-decoration:none;}
a:hover,a:link,a:visited,a:active,a:focus{text-decoration:none;}
input[type=text],input[type=password],input[type=submit],input[type=search],input{-webkit-appearance:none!important;border-radius:0;}
input:checked[type=checkbox]{-webkit-appearance:checkbox;}
button,input[type=button],input[type=submit],input[type=reset],input[type=file]{-webkit-appearance:button;border-radius:0;}
/* data */
.wrap_data {padding-bottom:52px;}
.wrap_data .box_msg {position:relative;height:288px;color:#fff;}
.wrap_data .data_type1 {background:#4455F5 url(../img/img_bg_1.png) no-repeat 50% 50%;background-size:cover;}
.wrap_data .data_type2 {background:#AC40E0 url(../img/img_bg_2.png) no-repeat 50% 50%;background-size:cover;}
.wrap_data .top_area {padding:37px 0 0 20px;}
.wrap_data .top_area .stit {padding-bottom:5px;color:#fff;font-size:24px;line-height:42px;}
.wrap_data .top_area .stit strong {font-size:36px;line-height:42px;}
.wrap_data .top_area .msg {font-size:14px;line-height:20px;}
.wrap_data .top_area .msg_bottom {position:absolute;left:20px;bottom:30px;font-size:16px;line-height:24px;}
.wrap_data .top_area .info {position:absolute;left:20px;bottom:30px;}
.wrap_data .top_area .info:after {content:'';clear:both;display:block;}
.wrap_data .top_area .info dt {font-size:16px;line-height:24px;}
.wrap_data .top_area .info dd {float:left;padding-right:8px;font-size:16px;line-height:24px;}
.wrap_data .top_area .info dd:last-child {padding-right:0;}
.wrap_data .txt_dot {padding-left:18px;font-size:14px;line-height:18px;color:#777;}
.wrap_data .txt_dot:before {content:'•';clear:both;display:inline-block;width:12px;margin-left:-12px;color:#2c2c2c;}
.wrap_data .txt_dot em {font-weight:600;color:#2c2c2c;}
.wrap_data .box_info {padding:48px 10px 10px 10px;text-align:center;background-color:#f4f9fe;}
.wrap_data .box_info:after {content:'';clear:both;display:block;}
.wrap_data .box_info li {display:inline-block;width:106px;margin-bottom:30px;padding-top:40px;font-weight:600;font-size:14px;text-align:center;background-size:32px 32px;}
.wrap_data .box_info li.ico_data {background:url(./img/icon_data.svg) no-repeat 50% 0;background-size:32px 32px;}
.wrap_data .box_info li.ico_clock {background:url(./img/icon_clock.svg) no-repeat 50% 0;background-size:32px 32px;}
.wrap_data .box_info li.ico_lte {background:url(./img/icon_lte.svg) no-repeat 50% 0;background-size:32px 32px;}
.wrap_data .box_info li.ico_speed {background:url(./img/icon_speed.svg) no-repeat 50% 0;background-size:32px 32px;}
.wrap_data .box_info li.ico_wifi {background:url(./img/icon_wifi.svg) no-repeat 50% 0;background-size:32px 32px;}
.wrap_data .box_info li.ico_wifi_off {background:url(./img/icon_wifi_off.svg) no-repeat 50% 0;background-size:32px 32px;}
.wrap_data .box_info li:nth-child(4) {margin:0 20px;}
.wrap_data .box_info2 {padding:48px 20px 0 20px;}
.wrap_data .box_info2 .stit {margin-bottom:16px;font-weight:500px;font-size:20px;line-height:22px;}
.wrap_data .box_info2 .info {margin-bottom:16px;padding:20px 20px 18px 20px;box-sizing:border-box;border:1px solid #d8d8d8;border-radius:3px;}
.wrap_data .box_info2 .info:after {content:'';clear:both;display:block;}
.wrap_data .box_info2 .info dt {margin-bottom:4px;font-weight:600;font-size:16px;line-height:22px;}
.wrap_data .box_info2 .info dd {float:left;margin-right:8px;font-size:16px;line-height:22px;color:#2a7ff6;}
.wrap_data .box_info2 .info2 {display:block;height:80px;margin-bottom:16px;padding:29px 20px 18px 20px;font-weight:600;font-size:16px;box-sizing:border-box;border:1px solid #d8d8d8;border-radius:3px;}
.wrap_data .box_info2 .info2 .txt_detail {float:right;font-weight:500;font-size:14px;color:#2a7ff6;}
.wrap_data .box_info2 .info2 .txt_detail:after {content:'';clear:both;display:inline-block;width:10px;height:10px;margin-left:4px;background:url(../img/icon_arrow_right_blue.svg) no-repeat 50% 50%;background-size:cover;}
.wrap_data .box_info2 .txt_dot {margin-bottom:6px;}
.wrap_data .box_set {overflow:hidden;margin:56px 20px 0 20px;border-radius:3px;}
.wrap_data .box_set .stit {height:50px;font-weight:400;font-size:18px;line-height:50px;color:#fff;background-color:#4455f5;}
.wrap_data .box_set .stit:before {content:'';clear:both;display:inline-block;width:18px;height:18px;margin:0 8px 0 20px;vertical-align:middle;background:url(../img/icon_apn.svg) no-repeat 0 0;background-size:cover;}
.wrap_data .box_set .code_area {position:relative;margin-bottom:16px;padding:20px;border:1px solid #d8d8d8;border-top:0 none;background-color:#f5f5f5;}
.wrap_data .box_set .code_area .btn_copy {position:absolute;right:20px;top:20px;width:62px;height:40px;text-align:center;font-weight:500;font-size:14px;line-height:38px;color:#2c2c2c;box-sizing:border-box;border:1px solid #d8d8d8;border-radius:3px;background-color:#fff;}
.wrap_data .box_set .code_area .btn_copy:active {color:#2a7ff6;border-color:#2a7ff6;}
.wrap_data .box_set .code {position:relative;padding-top:10px;font-size:16px;line-height:24px;}
.wrap_data .box_set .code:after {content:'';clear:both;display:block;}
.wrap_data .box_set .code dt {position:absolute;left:0;top:10px;color:#777;}
.wrap_data .box_set .code dd {overflow:hidden;float:left;margin:0 70px 0 50px;font-weight:bold;color:#2c2c2c;word-break:break-all;}
.wrap_data .box_set .code dd .txt {float:left;height:50px;box-sizing:border-box;border-bottom:1px solid #2c2c2c;}
.wrap_data .set_type2 .stit {background-color:#8f1ff1;}
.wrap_data .set_type2 .code_area {padding:0;}
.wrap_data .set_type2 .btn_apn {display:block;padding:20px;font-weight:600;font-size:16px;line-height:24px;color:#2c2c2c;}
.wrap_data .set_type2 .btn_apn:after {content:'';clear:both;display:block;position:absolute;right:20px;top:50%;width:10px;height:10px;margin-top:-5px;background:url(../img/icon_arrow_right_black.svg) no-repeat 50% 50%;background-size:cover;}
.wrap_data .set_type2 .code_area {background-color:#fff;}
.box_notandum {margin-top:56px;padding:0 20px 56px 20px;background-color:#f5f5f5;}
.box_notandum .stit {padding:40px 0 24px 0;font-weight:700;font-size:20px;line-height:22px;}
.box_notandum dl {margin-bottom:26px;color:#777;font-size:14px;line-height:20px;}
.box_notandum dl dt {margin-bottom:6px;font-weight:700;color:#2c2c2c;}
.box_notandum dl em {font-weight:600;color:#2c2c2c;}
.btn_bottom {position:absolute;left:0;bottom:0;width:100%;background-color:#fff;}
.btn_bottom a {float:left;width:50%;height:52px;font-weight:500;font-size:18px;line-height:52px;text-align:center;border-top:1px solid #d8d8d8;}
.btn_bottom a:active {background-color:#f5f5f5;}
.btn_bottom a:nth-child(2) {color:#fff;background-color:#2a7ff6;border-top:1px solid #2a7ff6;}
.btn_bottom a:nth-child(2):active {background-color:#4f99ff;}
</style>
<script>
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
function copy(CopyTxtNumber) {
  var copyTxt = document.getElementById('copyTxt' + CopyTxtNumber).firstChild.innerHTML;
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
function go(key , className){
  var cmd = {
    key: key,
    value: document.getElementsByClassName(className)[0].getAttribute('value')
  };
  window.ReactNativeWebView.postMessage(JSON.stringify(cmd));
}
function send() {
  window.ReactNativeWebView.postMessage('APN Value have to insert into this', '*');
  window.alert('copy');
}
</script>
<body>
<div class="wrap_data">
	<div class="box_msg data_type1"> <!-- 타입별 클래스 : data_type1, data_type2 -->
		<div class="top_area">
			<h1 class="stit">데이터 무제한 <strong>7</strong>일</h1>
			<p class="msg">하루에 500MB를 사용하면 속도가<br>384Kbps로 제한됩니다.</p>
			<dl class="info">
				<dt>통신사</dt>
				<dd>KT •</dd>
				<dd>LG U+ •</dd>
				<dd>SKT</dd>
			</dl>
		</div>
	</div>
  <img src="http://www.naver.com"/>
	<ul class="box_info">
		<li class="ico_data">데이터 ONLY</li>
		<li class="ico_clock">사용 기간 : 7일</li>
		<li class="ico_lte">LTE / 3G</li>
		<li class="ico_speed">일 500MB 소진 시<br>속도 제한</li>
		<li class="ico_wifi">핫스팟 테더링<br>가능</li>
	</ul>

	<div class="box_info2" >
		<h2 class="stit">사용 가능 지역 및 통신사 확인하기</h2>
		<dl class="info">
			<dt>대한민국</dt>
			<dd>KT •</dd>
			<dd>LG U+ •</dd>
			<dd>SKT</dd>
		</dl>
		<p class="txt_dot">본 상품은 <em>대한민국이 포함된 상품</em>으로 국내에서 상품 등록(QR스캔)시 네트워크에 바로 접속되어 개통될 수 있으니, <em>현지 도착 후 상품 등록을 권고드립니다.</em></p>
	</div>

	<div class="box_set">
		<h2 class="stit">APN 설정</h2>
		<div class="code_area">
			<dl class="code">
				<dt>APN :</dt>
				<dd><span class="txt">mobile.abc.de</span></dd>
			</dl>
			<a href="#" class="btn_copy">복사</a>
		</div>
		<p class="txt_dot">단말에 eSIM 등록시 <em>자동 설정</em>됩니다.</p>
		<p class="txt_dot">현지에서 바로 개통되지 않을 때! 당황하지 말고 수동 APN을 설정해보세요.</p>
	</div>

	<div class="box_notandum">
		<h2 class="stit">주의사항</h2>
		<dl>
			<dt>유효 기간 및 사용 기간 적용 기준</dt>
			<dd class="txt_dot">
				유효 기간은 <em>구매일로부터 180일</em>이며 180일 이내에 개통(현지 네트워크 접속)하시면 정상 사용이 가능합니다.
			</dd>
			<dd class="txt_dot">
				<em>개통(현지 네트워크 접속) 시점으로부터 24시간을 1일로 간주</em>하여 구매한 상품의 데이터를 이용할 수 있습니다.<br>
				(예) 사용 기간 : 5일 - 개통 후 120시간 동안 사용 가능)
			</dd>
		</dl>
		<dl>
			<dt>음영 지역 및 해외 통신환경</dt>
			<dd class="txt_dot">현지 통신사의 통신 환경에 따라 데이터 이용이 원활하지 않은 지역이 일부 있을 수 있습니다.</dd>
			<dd class="txt_dot">스마트폰 기종에 따라 특정 해외 통신사의 LTE 주파수와 맞지 않을 경우 3G 또는 2G로 연결될 수 있습니다.</dd>
			<dd class="txt_dot">이는 해당 국가의 환경과 단말기 성능의 문제이기 때문에 서비스 불량 사유에 해당되지 않습니다.</dd>
		</dl>
		<dl>
			<dt>반품 및 환불</dt>
			<dd class="txt_dot">
				정상적인 회수 및 사용 중단이 어려운 상품의 특성상, 상품(QR코드)을 이메일 및 앱으로 발송 이후
				혹은 단말에 QR코드 스캔 혹은 세부정보 기입을 통해 상품을 등록한 경우
				<em>단순 변심에 의한 교환/환불은 불가능</em>합니다.
			</dd>
		</dl>
	</div>

	<div class="btn_bottom">
		<a href="#" class="btn_1" onclick="go('moveToFaq','btn_1')" value="config/04">카트에 넣기</a>
		<a href="#" class="btn_2">바로 구매</a>
	</div>
</div>

</body>
</html>
`;
const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
  pending,
  product,
  cart,
  info,
  action,
  account,
}) => {
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState<TrackingStatus>();
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    const {detailCommon, partnerId} = product;
    const {params = {}} = route;

    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={route.params?.title} />,
    });

    // if (!detailCommon) {
    //   action.product.getProdDetailCommon(this.controller);
    // }

    if (partnerId !== route.params?.partnerId) {
      action.product.getProdDetailInfo(params?.partnerId || '');
    }

    const item = API.Product.toPurchaseItem(route.params.item);
    setPurchaseItems(item ? [item] : []);
    getTrackingStatus().then((elm) => setStatus(elm));
  }, [action.product, navigation, product, route, route.params?.partnerId]);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const cmd = JSON.parse(event.nativeEvent.data);

      console.log('aaaaa cmd', cmd);
      switch (cmd.key) {
        case 'moveToPage':
          if (cmd.value) {
            action.info.getItem(cmd.value).then(({payload: item}) => {
              if (item?.title && item?.body) {
                navigation.navigate('SimpleText', {
                  key: 'noti',
                  title: i18n.t('set:noti'),
                  bodyTitle: item?.title,
                  body: item?.body,
                  mode: 'html',
                });
              } else {
                AppAlert.error(i18n.t('info:init:err'));
              }
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
    [action, navigation],
  );

  const renderWebView = useCallback(() => {
    const localOpDetails = route.params?.localOpDetails;
    const detail = _.isEmpty(localOpDetails)
      ? product.detailInfo + product.detailCommon
      : localOpDetails + product.detailCommon;

    console.log('aaaaa detail', detail);
    return (
      <View style={{flex: 1}}>
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
          // source={{uri: 'http://146.56.139.208/#/product/desc/1'}}
          source={{uri: 'http://localhost:8000/#/product/desc/1'}}
          // source={{html: detail}}
          style={{height: 1800}}
        />
      </View>
    );
  }, [onMessage, route.params?.localOpDetails]);

  const soldOut = useCallback((payload: ApiResult<any>, message: string) => {
    if (payload.result === api.E_RESOURCE_NOT_FOUND) {
      AppAlert.info(i18n.t(message));
    } else {
      AppAlert.info(i18n.t('cart:systemError'));
    }
  }, []);

  const onPressBtnCart = useCallback(async () => {
    const {loggedIn} = account;
    const {params = {}} = route;
    // 다른 버튼 클릭으로 스낵바 종료될 경우, 재출력 안되는 부분이 있어 추가
    setShowSnackBar(false);

    if (status === 'authorized') {
      Analytics.trackEvent('Click_cart');
      await firebase.analytics().setAnalyticsCollectionEnabled(true);
      await Settings.setAdvertiserTrackingEnabled(true);

      analytics().logEvent(`${esimGlobal ? 'global' : 'esim'}_to_cart`, {
        item: purchaseItems[0].title,
        count: 1,
      });
    }

    if (!loggedIn) {
      return navigation.navigate('Auth');
    }

    // if (selected) {
    action.cart.cartAddAndGet({purchaseItems}).then(({payload: resp}) => {
      console.log('@@@ add and get', resp);
      if (resp.result === 0) {
        setShowSnackBar(true);
        if (
          resp.objects[0].orderItems.find((v) => v.key === selected).qty >=
          PURCHASE_LIMIT
        ) {
          setDisabled(true);
        }
      } else {
        soldOut(resp, 'cart:notToCart');
      }
    });
    // }
  }, [account, action.cart, navigation, purchaseItems, route, soldOut, status]);

  const onPressBtnRegCard = useCallback(() => {
    Analytics.trackEvent('Click_regCard');

    if (!account.loggedIn) {
      return navigation.navigate('Auth');
    }

    navigation.navigate('RegisterSim');
  }, [account.loggedIn, navigation]);

  const onPressBtnPurchase = useCallback(() => {
    const {loggedIn, balance} = account;

    // 다른 버튼 클릭으로 스낵바 종료될 경우, 재출력 안되는 부분이 있어 추가
    setShowSnackBar(false);

    Analytics.trackEvent('Click_purchase');

    if (!loggedIn) {
      return navigation.navigate('Auth');
    }

    // if (selected) {
    // 구매 품목을 갱신한다.
    return action.cart
      .checkStockAndPurchase({
        purchaseItems,
        balance,
      })
      .then(({payload: resp}) => {
        if (resp.result === 0) {
          navigation.navigate('PymMethod', {
            mode: 'roaming_product',
          });
        } else {
          soldOut(resp, 'cart:soldOut');
        }
      })
      .catch((err) => {
        console.log('failed to check stock', err);
      });
    // }
  }, [account, action.cart, navigation, purchaseItems, soldOut]);

  return (
    <SafeAreaView style={styles.screen}>
      <AppActivityIndicator visible={pending} />
      <ScrollView
        style={{backgroundColor: colors.whiteTwo, flex: 1}}
        // ref={scrollView}
        // stickyHeaderIndices={[1]} // 탭 버튼 고정
        // showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}>
        {renderWebView()}
      </ScrollView>
      {/* useNativeDriver 사용 여부가 아직 추가 되지 않아 warning 발생중 */}
      {/* <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('country:addCart')}
      />
      {account.iccid || (esimApp && account.loggedIn) ? (
        <View style={styles.buttonBox}>
          <AppButton
            style={styles.btnCart}
            title={i18n.t('cart:toCart')}
            titleStyle={styles.btnCartText}
            disabled={pending || disabled}
            disableColor={colors.black}
            disableBackgroundColor={colors.whiteTwo}
            onPress={onPressBtnCart}
          />
          <AppButton
            style={styles.btnBuy}
            title={i18n.t('cart:buy')}
            titleStyle={styles.btnBuyText}
            onPress={onPressBtnPurchase}
          />
        </View>
      ) : (
        <View style={styles.buttonBox}>
          <AppButton
            style={styles.regCardView}
            title={account.loggedIn ? i18n.t('reg:card') : i18n.t('err:login')}
            titleStyle={styles.regCard}
            onPress={onPressBtnRegCard}
          />
          <AppText style={styles.regCard}>{i18n.t('reg:card')}</AppText>
        </View>
      )} */}
    </SafeAreaView>
  );
};

export default connect(
  ({product, account, cart, status, info}: RootState) => ({
    product,
    account,
    cart,
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
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(ProductDetailScreen);
