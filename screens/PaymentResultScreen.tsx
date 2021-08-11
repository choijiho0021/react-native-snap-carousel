import AppButton from '@/components/AppButton';
import PaymentItemInfo from '@/components/PaymentItemInfo';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as cartActions,
  CartAction,
  CartModelState,
  PaymentReq,
} from '@/redux/modules/cart';
import {actions as notiActions, NotiAction} from '@/redux/modules/noti';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import utils from '@/redux/api/utils';
import i18n from '@/utils/i18n';
import Analytics from 'appcenter-analytics';
import React, {Component} from 'react';
import {
  BackHandler,
  Image,
  NativeEventSubscription,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigation/navigation';
import {RouteProp} from '@react-navigation/native';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {Currency} from '@/redux/api/productApi';
import Env from '@/environment';

const {esimCurrency} = Env.get();
const imgCheck = require('../assets/images/main/imgCheck.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: 10,
    justifyContent: 'flex-start',
  },
  result: {
    ...appStyles.itemRow,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 90,
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 0,
  },
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  image: {
    marginTop: 30,
  },
  paymentResultView: {
    backgroundColor: colors.white,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  paymentResultText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginVertical: 15,
  },
  btnOrderList: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    width: 180,
    height: 44,
    marginTop: 15,
    marginBottom: 40,
  },
  btnHomeText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.white,
  },
  btnHome: {
    width: '100%',
    height: 52,
    position: 'absolute',
    bottom: 30,
    backgroundColor: colors.clearBlue,
  },
});

type PaymentResultScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PaymentResult'
>;

type PaymentResultScreenRouteProp = RouteProp<
  HomeStackParamList,
  'PaymentResult'
>;

type PaymentResultScreenProps = {
  navigation: PaymentResultScreenNavigationProp;
  route: PaymentResultScreenRouteProp;

  account: AccountModelState;
  cart: CartModelState;

  action: {
    noti: NotiAction;
    order: OrderAction;
    cart: CartAction;
  };
};

type PaymentResultScreenState = {
  pymReq?: PaymentReq[];
  purchaseItems: PurchaseItem[];
  pymPrice?: Currency;
  deduct?: Currency;
  isRecharge?: boolean;
  screen: keyof HomeStackParamList;
};

class PaymentResultScreen extends Component<
  PaymentResultScreenProps,
  PaymentResultScreenState
> {
  backHandler: NativeEventSubscription | null;

  constructor(props: PaymentResultScreenProps) {
    super(props);

    this.state = {
      purchaseItems: [],
      pymReq: [],
      pymPrice: undefined,
      deduct: undefined,
      isRecharge: undefined,
    };

    this.init = this.init.bind(this);
    this.moveScreen = this.moveScreen.bind(this);
    this.backKeyHandler = this.backKeyHandler.bind(this);

    this.backHandler = null;
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <Text style={styles.title}>{i18n.t('his:paymentCompleted')}</Text>
      ),
    });

    const {params} = this.props.route;
    const {success} = params?.pymResult || {};
    const {result} = params?.orderResult || {};
    const mode = params?.mode;

    const isSuccess = _.isEmpty(success)
      ? result === 0
      : success && result === 0;

    Analytics.trackEvent('Payment', {
      payment: `${mode} Payment${isSuccess ? ' Success' : ' Fail'}`,
    });

    this.init();
    this.props.action.noti.getNotiList({mobile: this.props.account.mobile});
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backKeyHandler,
    );
  }

  backKeyHandler = () => {
    console.log('Disabled back key');
    return true;
  };

  moveScreen(name: keyof HomeStackParamList) {
    this.backHandler?.remove();

    this.props.navigation.reset({routes: [{name}]});
  }

  init() {
    const {pymReq, purchaseItems, pymPrice, deduct} = this.props.cart;
    const {iccid, token} = this.props.account;
    const {name} = this.props.route;

    this.setState({
      purchaseItems,
      pymReq,
      pymPrice,
      deduct,
      isRecharge:
        this.props.cart.purchaseItems.findIndex(
          (item) => item.type === 'rch',
        ) >= 0,
      screen: name,
    });

    // 구매 이력을 다시 읽어 온다.
    // this.props.action.order.getOrders(this.props.auth)
    // 사용 내역을 다시 읽어 온다.
    this.props.action.order.getSubs({iccid, token});
    // 카트를 비운다.
    this.props.action.cart.empty();
  }

  render() {
    const {params} = this.props.route;
    const {pymReq, purchaseItems, pymPrice, deduct, isRecharge, screen} =
      this.state;
    const {success} = params?.pymResult || {};
    const {result} = params?.orderResult || {};
    const {balance = 0} = this.props.account;

    // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
    // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.

    const isSuccess = _.isEmpty(success)
      ? result === 0
      : success && result === 0;

    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{backgroundColor: colors.whiteTwo}}>
          <View style={styles.paymentResultView}>
            <Image
              style={styles.image}
              source={imgCheck}
              resizeMode="contain"
            />
            <Text style={styles.paymentResultText}>
              {` ${i18n.t(isSuccess ? 'pym:success' : 'pym:fail')}`}
            </Text>
            <AppButton
              style={styles.btnOrderList}
              // MyPage화면 이동 필요
              onPress={() =>
                this.moveScreen('MyPageStack' as keyof HomeStackParamList)
              }
              // title={i18n.t('cancel')}
              title={i18n.t('pym:toOrderList')}
              titleStyle={appStyles.normal16Text}
            />
          </View>
          <View style={styles.container}>
            <PaymentItemInfo
              cart={purchaseItems}
              pymReq={pymReq}
              mode="result"
              pymPrice={
                isSuccess ? pymPrice : utils.toCurrency(0, esimCurrency)
              }
              deduct={isSuccess ? deduct : utils.toCurrency(0, esimCurrency)}
              isRecharge={isRecharge}
              screen={screen}
            />
            {screen === 'PaymentResult' && (
              <View style={styles.result}>
                <Text style={[appStyles.normal16Text, {flex: 1}]}>
                  {i18n.t('cart:afterDeductBalance')}
                </Text>
                <Text style={appStyles.normal16Text}>
                  {utils.price(utils.toCurrency(balance, esimCurrency))}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        <AppButton
          style={styles.btnHome}
          title={i18n.t('pym:toHome')}
          titleStyle={styles.btnHomeText}
          onPress={() =>
            this.moveScreen('HomeStack' as keyof HomeStackParamList)
          }
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, cart}: RootState) => ({
    account,
    cart,
  }),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
    },
  }),
)(PaymentResultScreen);
