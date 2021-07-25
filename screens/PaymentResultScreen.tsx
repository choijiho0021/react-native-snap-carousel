import AppButton from '@/components/AppButton';
import PaymentItemInfo from '@/components/PaymentItemInfo';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {actions as accountActions} from '@/redux/modules/account';
import {actions as cartActions} from '@/redux/modules/cart';
import {actions as notiActions, NotiAction} from '@/redux/modules/noti';
import {actions as orderActions} from '@/redux/modules/order';
import utils from '@/redux/api/utils';
import i18n from '@/utils/i18n';
import Analytics from 'appcenter-analytics';
import React, {Component} from 'react';
import {
  BackHandler,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';

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

type PaymentResultScreenProps = {
  action: {
    noti: NotiAction;
  };
};

class PaymentResultScreen extends Component<PaymentResultScreenProps> {
  constructor(props) {
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
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <Text style={styles.title}>{i18n.t('his:paymentCompleted')}</Text>
      ),
    });

    const {params} = this.props.route;

    const {success} = (params && params.pymResult) || {};
    const {result} = params && params.orderResult;
    const mode = params && params.mode;

    const isSuccess = _.isEmpty(success)
      ? result === 0
      : success && result === 0;

    Analytics.trackEvent('Payment', {
      payment: `${mode} Payment${isSuccess ? ' Success' : ' Fail'}`,
    });

    this.init();
    this.props.action.noti.getNotiList({mobile: this.props.auth.user});
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backKeyHandler,
    );
  }

  backKeyHandler = () => {
    console.log('Disabled back key');
    return true;
  };

  moveScreen(key) {
    this.backHandler.remove();

    if (key === 'MyPage') {
      this.props.navigation.reset({routes: [{name: 'MyPageStack'}]});
    } else {
      this.props.navigation.reset({routes: [{name: 'HomeStack'}]});
    }
  }

  init() {
    const {pymReq, purchaseItems, pymPrice, deduct} = this.props.cart;
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
    this.props.action.order.getSubs(this.props.account.iccid, this.props.auth);
    // 카트를 비운다.
    this.props.action.cart.empty();
  }

  render() {
    const {params} = this.props.route;
    const {pymReq, purchaseItems, pymPrice, deduct, isRecharge, screen} =
      this.state;
    const {success} = params && params.pymResult;
    const {result} = params && params.orderResult;

    // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
    // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.

    const isSuccess = _.isEmpty(success)
      ? result === 0
      : success && result === 0;

    return (
      <SafeAreaView
        style={{flex: 1}}
        forceInset={{top: 'never', bottom: 'always'}}>
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
              onPress={() => this.moveScreen('MyPage')}
              // title={i18n.t('cancel')}
              title={i18n.t('pym:toOrderList')}
              titleStyle={appStyles.normal16Text}
            />
          </View>
          <View style={styles.container}>
            <PaymentItemInfo
              cart={purchaseItems}
              pymReq={pymReq}
              balance={this.props.account.balance}
              mode="result"
              pymPrice={isSuccess ? pymPrice : 0}
              deduct={isSuccess ? deduct : 0}
              isRecharge={isRecharge}
              screen={screen}
            />
            {screen === 'PaymentResult' && (
              <View style={styles.result}>
                <Text style={appStyles.normal16Text}>
                  {i18n.t('cart:afterDeductBalance')}{' '}
                </Text>
                <Text style={appStyles.normal16Text}>
                  {`${utils.numberToCommaString(
                    this.props.account.balance,
                  )} ${i18n.t('won')}`}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        <AppButton
          style={styles.btnHome}
          title={i18n.t('pym:toHome')}
          titleStyle={styles.btnHomeText}
          onPress={() => this.moveScreen('Home')}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, cart, noti}: RootState) => ({
    account,
    cart,
    auth: accountActions.auth(account),
    noti,
  }),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
    },
  }),
)(PaymentResultScreen);
