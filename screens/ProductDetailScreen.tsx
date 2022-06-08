/* eslint-disable no-plusplus */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
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

const {baseUrl, esimGlobal} = Env.get();

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
  account: AccountModelState;

  action: {
    toast: ToastAction;
    product: ProductAction;
  };
};

type ProductDetailScreenState = {
  querying: boolean;
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
      querying: true,
    };

    this.renderWebView = this.renderWebView.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.checkWindowSize = this.checkWindowSize.bind(this);

    this.controller = new AbortController();
    this.scrollView = React.createRef<ScrollView>();
  }

  componentDidMount() {
    const {detailCommon, partnerId} = this.props.product;
    const {params = {}} = this.props.route;

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton title={this.props.route.params?.title} />
      ),
    });

    if (!detailCommon) {
      this.props.action.product.getProdDetailCommon(this.controller);
    }

    if (partnerId !== this.props.route.params?.partnerId) {
      this.props.action.product.getProdDetailInfo(params?.partnerId || '');
    }
  }

  onMessage = (event: WebViewMessageEvent) => {
    const cmd = JSON.parse(event.nativeEvent.data);

    switch (cmd.key) {
      case 'dimension':
        this.checkWindowSize(cmd.value);
        break;
      case 'moveToPage':
        if (cmd.value) {
          this.props.action.info.getItem(cmd.value).then(({payload: item}) => {
            if (item?.title && item?.body) {
              this.props.navigation.navigate('SimpleText', {
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
    const {
      pending,
      route,
      account: {iccid, loggedIn},
    } = this.props;

    return (
      <SafeAreaView style={styles.screen}>
        <AppActivityIndicator visible={pending} />
        <ScrollView
          style={{backgroundColor: colors.whiteTwo}}
          ref={this.scrollView}
          // stickyHeaderIndices={[1]} // 탭 버튼 고정
          // showsVerticalScrollIndicator={false}
          scrollEventThrottle={100}>
          {this.renderWebView()}
        </ScrollView>
        {/* useNativeDriver 사용 여부가 아직 추가 되지 않아 warning 발생중 */}
        {/* <AppSnackBar
          visible={showSnackBar}
          onClose={() => this.setState({showSnackBar: false})}
          textMessage={i18n.t('country:addCart')}
        />
        {iccid || (esimApp && loggedIn) ? (
          <View style={styles.buttonBox}>
            <AppButton
              style={styles.btnCart}
              title={i18n.t('cart:toCart')}
              titleStyle={styles.btnCartText}
              disabled={pending || disabled}
              disableColor={colors.black}
              disableBackgroundColor={colors.whiteTwo}
              onPress={this.onPressBtnCart}
            />
            <AppButton
              style={styles.btnBuy}
              title={i18n.t('cart:buy')}
              titleStyle={styles.btnBuyText}
              onPress={this.onPressBtnPurchase}
            />
          </View>
        ) : (
          <View style={styles.buttonBox}>
            <AppButton
              style={styles.regCardView}
              title={loggedIn ? i18n.t('reg:card') : i18n.t('err:login')}
              titleStyle={styles.regCard}
              onPress={this.onPressBtnRegCard}
            />
            <AppText style={styles.regCard}>{i18n.t('reg:card')}</AppText>
          </View>
        )} */}
      </SafeAreaView>
    );
  }
}

export default connect(
  ({product, account, status, info}: RootState) => ({
    product,
    account,
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
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(ProductDetailScreen);
