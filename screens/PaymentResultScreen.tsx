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
import {
  actions as orderActions,
  OrderAction,
  getCountItems,
  OrderModelState,
} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import BackbuttonHandler from '@/components/BackbuttonHandler';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppIcon from '@/components/AppIcon';
import {getItemsOrderType} from '@/redux/models/purchaseItem';
import api from '@/redux/api/api';
import AppAlert from '@/components/AppAlert';
import AppDashBar from '@/components/AppDashBar';
import moment from 'moment';

const {esimGlobal} = Env.get();

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderTopEndRadius: 12,
    borderBottomEndRadius: 3,
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
    marginBottom: 12,
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
  order: OrderModelState;

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
  order,
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
    }
    if (cart.esimIccid) {
      // 충전 또는 연장 상품의 경우 충전내역으로 이동
      const main = order.subs?.find((s) => s.subsIccid === cart.esimIccid);

      if (main)
        navigation.navigate('ChargeHistory', {
          mainSubs: main,
          chargeablePeriod: utils.toDateString(main?.expireDate, 'YYYY.MM.DD'),
          isChargeable: !main.expireDate?.isBefore(moment()),
        });
    } else
      navigation.navigate('EsimStack', {
        screen: 'Esim',
        params: {
          actionStr: 'reload',
        },
      });
  }, [
    account?.iccid,
    account?.token,
    action.order,
    cart.esimIccid,
    navigation,
    order.subs,
    params?.mode,
  ]);

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

    if (purchaseItems.length > 0) {
      action.cart.purchase({purchaseItems, isCart: true});

      navigation.navigate('PymMethod', {mode: 'cart'});
    } else {
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
              marginTop: 24,
              marginBottom: 24,
            },
          ]}
        />
      </View>
    );
  };

  // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
  // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.

  const getTitle = useCallback(() => {
    let result = <></>;
    const etcCount = getCountItems(oldCart?.purchaseItems, true);
    console.log('@@@etc count : ', etcCount);

    if (parseInt(etcCount, 10) > 0)
      result = (
        <AppText style={appStyles.normal18Text}>
          {i18n.t('his:etcCnt').replace('%%', etcCount)}
        </AppText>
      );

    return result;
  }, [oldCart?.purchaseItems]);

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
            {getTitle()}
          </AppText>
          <View style={styles.divider} />
          <PaymentItem
            title={i18n.t('his:pymAmount')}
            value={utils.price(oldCart?.pymPrice)}
            valueStyle={
              isSuccess
                ? {
                    ...appStyles.bold16Text,
                    color: colors.clearBlue,
                  }
                : {...appStyles.roboto16Text}
            }
          />
          <PaymentItem
            title={i18n.t('pym:method')}
            value={
              params.pay_method === 'card'
                ? `${i18n.t(`pym:card${params.card}`)}/${
                    params?.installmentMonths === '0'
                      ? i18n.t('pym:pay:atonce')
                      : `${params?.installmentMonths}${i18n.t('pym:duration')}`
                  }`
                : i18n.t(`pym:${params.pay_method}`)
            }
            valueStyle={appStyles.roboto16Text}
          />
          {!isSuccess && params?.errorMsg && (
            <>
              <AppDashBar style={{width: '150%', right: 20}} />

              <View style={{gap: 6}}>
                <View style={{gap: 6, flexDirection: 'row'}}>
                  <AppSvgIcon name="bannerWarning20" />
                  <AppText
                    style={{
                      ...appStyles.bold14Text,
                      color: colors.redBold,
                    }}>
                    {i18n.t('pym:failReason')}
                  </AppText>
                </View>
                <View>
                  <AppText
                    style={{...appStyles.medium14, color: colors.redBold}}>
                    {utils.getParam(params?.errorMsg)?.error || ''}
                  </AppText>
                </View>
              </View>
            </>
          )}

          {isSuccess && (
            <AppButton
              style={styles.detailButton}
              titleStyle={{
                ...appStyles.medium14,
                lineHeight: 24,
              }}
              title={i18n.t(`pym:detail`)}
              onPress={() => {
                navigation.popToTop();

                navigation.navigate('PurchaseDetail', {
                  orderId: oldCart?.orderId?.toString(),
                });
              }}
            />
          )}
          {isSuccess &&
            oldCart?.purchaseItems &&
            getItemsOrderType(oldCart.purchaseItems) === 'refundable' && (
              <>
                <DashedBar />

                <View
                  style={{
                    flexDirection: 'row',
                    gap: 6,
                    // backgroundColor: 'red',
                  }}>
                  <AppIcon name="bannerMark2" />
                  <AppText
                    style={{
                      ...appStyles.bold14Text,
                      color: colors.warmGrey,
                      lineHeight: 20,
                      flex: 1,
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
              navigation.popToTop();
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
  ({account, cart, order}: RootState) => ({
    account,
    cart,
    order,
  }),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
    },
  }),
)(PaymentResultScreen);
