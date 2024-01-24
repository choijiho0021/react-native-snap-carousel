import analytics from '@react-native-firebase/analytics';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import PaymentItemInfo from '@/components/PaymentItemInfo';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as cartActions,
  CartAction,
  CartModelState,
} from '@/redux/modules/cart';
import {actions as notiActions, NotiAction} from '@/redux/modules/noti';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import {eventToken} from '@/constants/Adjust';
import ScreenHeader from '@/components/ScreenHeader';
import BackbuttonHandler from '@/components/BackbuttonHandler';

const {esimCurrency, esimGlobal} = Env.get();

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
    justifyContent: 'center',
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
    backgroundColor: colors.clearBlue,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.whiteTwo,
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

const PaymentResultScreen: React.FC<PaymentResultScreenProps> = ({
  navigation,
  route: {params, name: screen},
  account,
  cart,
  action,
}) => {
  const [oldCart, setOldCart] = useState<Partial<CartModelState>>();
  const isSuccess = useMemo(() => params?.pymResult || false, [params]);

  useEffect(() => {
    const {iccid, token} = account;

    // 구매 이력을 다시 읽어 온다.
    // this.props.action.order.getOrders(this.props.auth)
    // 사용 내역을 다시 읽어 온다.
    action.order.getSubs({iccid, token});
    action.noti.getNotiList({mobile: account.mobile});
  }, [account, action.noti, action.order]);

  const onNavigateScreen = useCallback(() => {
    navigation.popToTop();

    // 캐시 구매 -> 내 계정 화면으로 이동
    if (params?.mode === 'recharge') {
      action.order.subsReload({
        iccid: account?.iccid!,
        token: account?.token!,
        hidden: false,
      });
      navigation.navigate('MyPageStack', {screen: 'MyPage'});
      // 일반 상품, 충전 상품 -> eSIM 화면 이동
    } else
      navigation.navigate('EsimStack', {
        screen: 'Esim',
        params: {
          actionStr: 'reload',
        },
      });
  }, [account?.iccid, account?.token, action.order, navigation, params?.mode]);

  // 결제 완료창에서 뒤로가기 시 확인과 똑같이 처리한다.
  BackbuttonHandler({
    navigation,
    onBack: () => {
      onNavigateScreen();
      return true;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      // init cart 5 sec later
      setTimeout(() => {
        action.cart.cartFetch();
      }, 5000);
    }, [action.cart]),
  );

  useEffect(() => {
    const {pymReq, purchaseItems, pymPrice, deduct, orderId} = cart;
    const {token} = account;
    if (purchaseItems.length > 0) {
      setOldCart({pymReq, purchaseItems, pymPrice, deduct});
      // 카트를 비운다.
      action.cart.makeEmpty({orderId, token});
    }
  }, [account, action.cart, cart]);

  useEffect(() => {
    Analytics.trackEvent('Payment', {
      payment: `${params?.mode} Payment${isSuccess ? ' Success' : ' Fail'}`,
    });
    if (cart?.pymPrice && cart?.pymPrice.value > 0 && isSuccess) {
      utils.adjustEventadd(eventToken.Sales, cart?.pymPrice.value, 'KRW'); // pymPrice.value 실결제금액, deduct.value 로깨비캐시 차감금액
      analytics().logEvent(`${esimGlobal ? 'global' : 'esim'}_payment`);
    }
  }, [cart?.pymPrice, isSuccess, params?.mode]);

  // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
  // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'stretch'}}>
      <ScreenHeader
        title={i18n.t(isSuccess ? 'his:paymentCompleted' : 'his:paymentFailed')}
        backHandler={() => {}}
        showIcon={false}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.paymentResultView}>
          <AppIcon
            style={styles.image}
            name={isSuccess ? 'imgCheck' : 'imgFail'}
          />
          <AppText
            style={[
              styles.paymentResultText,
              !isSuccess && {color: colors.tomato},
            ]}>
            {` ${i18n.t(isSuccess ? 'pym:success' : 'pym:fail')}`}
          </AppText>
          <AppButton
            style={styles.btnOrderList}
            type="secondary"
            // MyPage화면 이동 필요
            onPress={() => {
              navigation.popToTop();
              navigation.navigate('MyPageStack', {screen: 'MyPage'});
            }}
            // title={i18n.t('cancel')}
            title={i18n.t('pym:toOrderList')}
            titleStyle={appStyles.normal16Text}
          />
        </View>
        <View style={styles.container}>
          <PaymentItemInfo
            purchaseItems={oldCart?.purchaseItems || []}
            pymReq={oldCart?.pymReq}
            mode="result"
            pymPrice={
              isSuccess ? oldCart?.pymPrice : utils.toCurrency(0, esimCurrency)
            }
            deduct={
              isSuccess ? oldCart?.deduct : utils.toCurrency(0, esimCurrency)
            }
            screen={screen}
          />
          {screen === 'PaymentResult' && (
            <View style={styles.result}>
              <AppText style={[appStyles.normal16Text, {flex: 1}]}>
                {i18n.t('cart:afterDeductBalance')}
              </AppText>
              <AppText style={appStyles.normal16Text}>
                {utils.price(
                  utils.toCurrency(account.balance || 0, esimCurrency),
                )}
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>
      <AppButton
        style={styles.btnHome}
        title={i18n.t('pym:toCheck')}
        titleStyle={styles.btnHomeText}
        type="primary"
        onPress={() => {
          onNavigateScreen();
        }}
      />
    </SafeAreaView>
  );
};

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
