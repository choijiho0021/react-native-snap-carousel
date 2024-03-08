import analytics from '@react-native-firebase/analytics';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {PaymentItem} from '@/components/PaymentItemInfo';
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
import BackbuttonHandler from '@/components/BackbuttonHandler';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppIcon from '@/components/AppIcon';
import {PurchaseItem, getItemsOrderType} from '@/redux/models/purchaseItem';
import AppBottomModal from './DraftUsScreen/component/AppBottomModal';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import api from '@/redux/api/api';
import AppAlert from '@/components/AppAlert';

const {esimGlobal} = Env.get();

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: colors.whiteFive,
    shadowColor: 'rgba(166, 168, 172, 0.16)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
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
  btnGoHomeText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.black,
  },
  btnGoHome: {
    width: '50%',
    height: 52,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.lightGrey,
    colors: colors.black,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: 20,
  },
  status: {
    ...appStyles.bold24Text,
    marginTop: 80,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginTop: 23,
    backgroundColor: colors.black,
  },
  stamp: {
    marginRight: 8,
    alignItems: 'flex-end',
    height: 62,
  },
  detailButton: {
    marginTop: 40,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 3,
    paddingVertical: 8,
  },

  dashContainer: {
    overflow: 'hidden',
  },
  dashFrame: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    margin: -1,
    height: 0,
    marginVertical: 23,
  },
  dash: {
    width: '100%',
  },

  headerNoti: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.lightGrey,
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
  route: {params},
  account,
  cart,
  action,
}) => {
  const [oldCart, setOldCart] = useState<Partial<CartModelState>>();
  const isSuccess = useMemo(() => params?.pymResult || false, [params]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const {iccid, token, mobile} = account;

    // 구매 이력을 다시 읽어 온다.
    // this.props.action.order.getOrders(this.props.auth)
    // 사용 내역을 다시 읽어 온다.
    action.order.getSubs({iccid: iccid!, token: token!});
    action.order.getOrders({
      user: mobile,
      token,
      state: 'validation',
      orderType: 'refundable',
      page: 0,
    });
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

  const retry = useCallback(() => {
    console.log('@@@@ retry : ', retry);

    console.log(
      '@@@@ oldCart 정보 확인, 체크된 데이터만 들어오는지? : ',
      oldCart?.purchaseItems,
    );

    // 이렇게 했을 때, 뒤로가기 같은거 하면 안꼬이는 지 확인이 필요할듯?
    const purchaseItems = oldCart?.purchaseItems || [];

    if (purchaseItems.length > 0)
      action.cart
        .checkStockAndPurchase({purchaseItems, isCart: true})
        .then(({payload: resp}) => {
          if (resp.result === 0) {
            navigation.navigate('PymMethod', {mode: 'cart'});
          } else if (resp.result === api.E_RESOURCE_NOT_FOUND)
            AppAlert.info(`${resp.title} ${i18n.t('cart:soldOut')}`);
          else AppAlert.info(i18n.t('cart:systemError'));
        })
        .catch((err) => {
          console.log('failed to check stock', err);
        });
    else {
      console.log('@@@@ 재 결제 시도 실패 홈으로 이동하기');
      navigation.navigate('HomeStack', {screen: 'Home'});
    }
  }, [action.cart, navigation, oldCart?.purchaseItems]);

  useEffect(() => {
    const {pymReq, purchaseItems, pymPrice, orderId} = cart;
    const {token} = account;

    // cart를 비우는게 맞나??

    if (purchaseItems.length > 0) {
      setOldCart({pymReq, purchaseItems, pymPrice, orderId});

      // 성공했을 때만
      // 카트를 비운다.
      if (isSuccess) action.cart.makeEmpty({orderId, token});
    }
  }, [account, action.cart, cart, isSuccess]);

  useEffect(() => {
    Analytics.trackEvent('Payment', {
      payment: `${params?.mode} Payment${isSuccess ? ' Success' : ' Fail'}`,
    });
    if (cart?.pymPrice && cart?.pymPrice.value > 0 && isSuccess) {
      analytics().logEvent(`${esimGlobal ? 'global' : 'esim'}_payment`);
    }
  }, [cart?.pymPrice, isSuccess, params?.mode]);

  console.log('@@@ old cart', oldCart, params);

  const DashedBar = () => {
    const renderDashedDiv = useCallback(() => {
      return (
        <View style={styles.dashContainer}>
          <View style={styles.dashFrame}>
            <View style={styles.dash} />
          </View>
        </View>
      );
    }, []);

    return (
      <View>
        {Platform.OS === 'ios' && renderDashedDiv()}
        <View
          style={[
            styles.headerNoti,
            Platform.OS === 'android' && {
              borderStyle: 'dashed',
              borderTopWidth: 1,
            },
          ]}
        />
      </View>
    );
  };

  // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
  // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'stretch', backgroundColor: colors.white}}>
      <ScrollView style={styles.scrollView}>
        <AppText style={styles.status}>
          {i18n.t(isSuccess ? 'his:pym:success' : 'his:pym:fail')}
        </AppText>
        <AppText style={appStyles.normal16Text}>
          {i18n.t(isSuccess ? 'his:pym:withus' : 'his:pym:tryagain')}
        </AppText>

        {isSuccess ? (
          <AppSvgIcon name="stampSuccess" style={styles.stamp} />
        ) : (
          <AppSvgIcon name="stampFail" style={styles.stamp} />
        )}
        <View style={styles.box}>
          <AppText style={appStyles.bold18Text}>
            {oldCart?.purchaseItems?.[0].title}
            {(oldCart?.purchaseItems?.length || 0) > 1 && (
              <AppText style={appStyles.normal18Text}>
                {i18n
                  .t('his:etcCnt')
                  .replace('%%', (oldCart?.purchaseItems?.length || 0) - 1)}
              </AppText>
            )}
          </AppText>
          <View style={styles.divider} />
          <PaymentItem
            title={i18n.t('his:pymAmount')}
            value={utils.price(oldCart?.pymPrice)}
            valueStyle={{...appStyles.bold16Text, color: colors.clearBlue}}
          />
          <PaymentItem
            title={i18n.t('pym:method')}
            value={
              params.pay_method === 'card'
                ? i18n.t(`pym:card${params.card}`)
                : i18n.t(`pym:${params.pay_method}`)
            }
            valueStyle={appStyles.roboto16Text}
          />

          <AppButton
            style={styles.detailButton}
            titleStyle={{
              ...appStyles.roboto16Text,
              lineHeight: 24,
            }}
            title={i18n.t(`pym:detail`)}
            onPress={() => {
              navigation.navigate('PurchaseDetail', {
                orderId: oldCart?.orderId?.toString(),
              });
            }}
          />
          {isSuccess &&
            oldCart?.purchaseItems &&
            getItemsOrderType(oldCart.purchaseItems) === 'refundable' && (
              <>
                <DashedBar />

                <View
                  style={{
                    flexDirection: 'row',
                    gap: 6,
                  }}>
                  <AppIcon name="bannerMark2" />
                  <AppText
                    style={{
                      ...appStyles.bold14Text,
                      color: colors.warmGrey,
                      lineHeight: 20,
                    }}>
                    {i18n.t('his:pym:alert')}
                  </AppText>
                </View>
              </>
            )}
        </View>
      </ScrollView>

      {isSuccess ? (
        <AppButton
          style={styles.btnHome}
          title={i18n.t('pym:toCheck')}
          titleStyle={styles.btnHomeText}
          type="secondary"
          onPress={() => {
            onNavigateScreen();
          }}
        />
      ) : (
        <View style={{flexDirection: 'row'}}>
          <AppButton
            style={styles.btnGoHome}
            title={i18n.t('pym:toHome')}
            titleStyle={styles.btnGoHomeText}
            type="primary"
            onPress={() => {
              navigation.navigate('HomeStack', {screen: 'Home'});
            }}
          />
          <AppButton
            style={[styles.btnHome, {width: '50%'}]}
            title={i18n.t('pym:retry')}
            titleStyle={styles.btnHomeText}
            type="primary"
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      )}
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
