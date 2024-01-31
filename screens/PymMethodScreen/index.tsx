import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import PaymentItemInfo from '@/components/PaymentItemInfo';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList, PaymentParams} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import api from '@/redux/api/api';
import {createPaymentInfoForRokebiCash} from '@/redux/models/paymentResult';
import {
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {
  actions as cartActions,
  CartAction,
  CartModelState,
} from '@/redux/modules/cart';
import {
  actions as infoActions,
  InfoAction,
  InfoModelState,
} from '@/redux/modules/info';
import i18n from '@/utils/i18n';
import AppModal from '@/components/AppModal';
import AppStyledText from '@/components/AppStyledText';
import PymButtonList from '@/components/AppPaymentGateway/PymButtonList';
import DropDownHeader from './DropDownHeader';
import PolicyChecker from '@/components/AppPaymentGateway/PolicyChecker';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import DiscountInfo from '@/components/AppPaymentGateway/DiscountInfo';
import PaymentSummary from '@/components/PaymentSummary';
import ConfirmEmail from '@/components/AppPaymentGateway/ConfirmEmail';
import ChangeEmail from './ChangeEmail';
import PymMethod from '@/components/AppPaymentGateway/PymMethod';
import SelectCoupon from './SelectCoupon';
import SelectCard from './SelectCard';
import {retrieveData, storeData} from '@/utils/utils';

const infoKey = 'pym:benefit';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  thickBar: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    marginBottom: 30,
  },
  normal12TxtLeft: {
    ...appStyles.normal12Text,
    color: colors.black,
    textAlign: 'left',
    lineHeight: 14,
    textAlignVertical: 'center',
  },
  beforeDrop: {
    marginHorizontal: 20,
    marginBottom: 45,
  },
  benefit: {
    backgroundColor: colors.whiteTwo,
    padding: 15,
    marginTop: 20,
  },
  modalBodyStyle: {
    paddingTop: 15,
    paddingHorizontal: 30,
  },
  textHeighlight: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
  },
  textCaution: {
    ...appStyles.normal16Text,
    color: colors.redError,
  },
  modalText: {
    ...appStyles.normal16Text,
    lineHeight: 26,
    letterSpacing: -0.5,
  },
});

type PymMethodScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PymMethod'
>;

type PymMethodScreenRouteProp = RouteProp<HomeStackParamList, 'PymMethod'>;

type PymMethodScreenProps = {
  navigation: PymMethodScreenNavigationProp;
  route: PymMethodScreenRouteProp;

  account: AccountModelState;
  cart: CartModelState;
  info: InfoModelState;
  product: ProductModelState;

  action: {
    cart: CartAction;
    info: InfoAction;
    product: ProductAction;
    modal: ModalAction;
  };
};

const {esimGlobal, impId, cachePrefix} = Env.get();

const PymMethodScreen: React.FC<PymMethodScreenProps> = ({
  navigation,
  route,
  account,
  cart,
  info,
  product,
  action,
}) => {
  const [selected, setSelected] = useState('pym:kakao');
  const [clickable, setClickable] = useState(true);
  const [policyChecked, setPolicyChecked] = useState(false);
  const [showUnsupAlert, setShowUnsupAlert] = useState(false);
  const mode = useMemo(() => route.params.mode, [route.params.mode]);

  useEffect(() => {
    if (!info.infoMap.has(infoKey)) {
      action.info.getInfoList(infoKey);
    }
  }, [action.info, info.infoMap]);

  useEffect(() => {
    action.cart.prepareOrder({
      id: account.coupon?.map((a) => a.id),
    });
  }, [account.coupon, action.cart]);

  useEffect(() => {
    Analytics.trackEvent('Page_View_Count', {
      page: `Payment - ${route.params?.mode}`,
    });
  }, [route.params]);

  useEffect(() => {
    async function getPymMethod() {
      const method = await retrieveData(`${cachePrefix}cache.pym.method`);
      console.log('@@@ cached method', method);
      if (method) setSelected(method);
    }
    getPymMethod();
  }, []);

  const onSubmit = useCallback(
    (passingAlert: boolean) => {
      if (!clickable) return;

      if (!passingAlert && !account.isSupportDev) {
        setShowUnsupAlert((prev) => !prev);
        return;
      }

      setClickable(false);

      // store payment
      console.log('@@@ pym method', selected);
      storeData(`${cachePrefix}cache.pym.method`, selected);

      const payMethod = selected.startsWith('card')
        ? API.Payment.method['pym:ccard']
        : API.Payment.method[selected];
      if (!payMethod && cart.pymPrice?.value !== 0) return;

      const {mobile, email} = account;
      const scheme = esimGlobal ? 'RokebiGlobal' : 'RokebiEsim';

      // 로깨비캐시 결제
      if (cart.pymPrice?.value === 0) {
        // if the payment amount is zero, call the old API payNorder
        const pymInfo = createPaymentInfoForRokebiCash({
          impId,
          mobile,
          digital: true,
          deduct: cart.pymReq?.rkbcash,
        });

        // payNorder에서 재고 확인 - resp.result값으로 비교
        action.cart.payNorder(pymInfo).then(({payload: resp}) => {
          if (resp.result === 0) {
            navigation.setParams({isPaid: true});
            navigation.replace('PaymentResult', {
              pymResult: true,
              mode,
            });
          } else {
            setClickable(true);
            if (resp.result === api.E_RESOURCE_NOT_FOUND) {
              AppAlert.info(i18n.t('cart:soldOut'));
            } else if (resp.result === api.E_STATUS_EXPIRED) {
              // product status is changed.
              const skuList = resp?.message.split(',');
              if (skuList?.length > 0 && cart.cartId) {
                cart?.cartItems
                  .filter((elm) => skuList.includes(elm.prod.sku))
                  .forEach((elm) => {
                    // remove it from the cart
                    if (elm.orderItemId) {
                      action.cart.cartRemove({
                        orderId: cart.cartId,
                        orderItemId: elm.orderItemId,
                      });
                    }
                  });
              }

              action.product.getAllProduct(true);

              AppAlert.info(i18n.t('cart:unpublishedError'), '', () =>
                navigation.popToTop(),
              );
            } else {
              AppAlert.info(i18n.t('cart:systemError'));
            }
          }
        });
      } else {
        // if the payment amount is not zero, make order first
        const params = {
          pg: payMethod?.key,
          pay_method: payMethod?.method,
          card: selected.startsWith('card') ? selected.slice(4, 6) : '',
          merchant_uid: `${
            product.rule.inicis_enabled === '1' ? 'r_' : 'i_'
          }${mobile}_${new Date().getTime()}`,
          name: i18n.t('appTitle'),
          amount: cart.pymPrice?.value, // 실제 결제 금액 (로깨비캐시 제외)
          rokebi_cash: cart.pymReq?.rkbcash?.value, // balance 차감 금액
          buyer_tel: mobile,
          buyer_name: mobile,
          buyer_email: email,
          escrow: false,
          app_scheme: scheme,
          language: payMethod?.language || i18n.locale,
          digital: true,
          paymentRule: product.rule,
          mode,
        } as PaymentParams;

        setClickable(true);
        navigation.navigate(esimGlobal ? 'Payment' : 'PaymentGateway', params);
      }
    },
    [
      account,
      action.cart,
      action.product,
      cart.cartId,
      cart?.cartItems,
      cart.pymPrice?.value,
      cart.pymReq?.rkbcash,
      clickable,
      mode,
      navigation,
      product.rule,
      selected,
    ],
  );

  const modalBody = useCallback(() => {
    return (
      <View style={styles.modalBodyStyle}>
        <AppStyledText
          text={i18n.t('pym:unsupportDeviceModalContent')}
          textStyle={styles.modalText}
          format={{b: styles.textHeighlight, c: styles.textCaution}}
        />
      </View>
    );
  }, []);

  const showChangeEmail = useCallback(() => {
    action.modal.renderModal(() => (
      <ChangeEmail
        email={account.email}
        onCancelClose={() => action.modal.closeModal()}
      />
    ));
  }, [account.email, action.modal]);

  const showCouponSelector = useCallback(() => {
    action.modal.renderModal(() => (
      <SelectCoupon
        promo={cart.promo}
        couponId={cart.couponToApply}
        onPress={(couponId: string) => {
          action.cart.applyCoupon({couponId});
          action.modal.closeModal();
        }}
      />
    ));
  }, [action.cart, action.modal, cart.couponToApply, cart.promo]);

  const showCardSelector = useCallback(() => {
    action.modal.renderModal(() => (
      <SelectCard
        onPress={(card: string) => {
          console.log('@@@ card', card);
          setSelected(card);
          action.modal.closeModal();
        }}
      />
    ));
  }, [action.modal]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={appStyles.header}>
        <AppBackButton
          title={i18n.t('payment')}
          disabled={route.params.isPaid}
          showIcon={!route.params.isPaid}
        />
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={{minHeight: '100%'}}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        enableResetScrollToCoords={false}>
        <PaymentItemInfo purchaseItems={cart.purchaseItems} mode="method" />

        <ConfirmEmail onPress={() => showChangeEmail()} />

        <DiscountInfo onPress={() => showCouponSelector()} />

        <PymMethod
          value={selected}
          onPress={(kind: string) =>
            kind === 'card' ? showCardSelector() : setSelected(kind)
          }
        />

        <PaymentSummary mode="method" />

        {/* {cart.pymPrice?.value !== 0 ? (
          method()
        ) : (
          <View style={styles.result} key="result">
            <AppText style={styles.resultText}>
              {i18n.t('pym:balPurchase')}
            </AppText>
          </View>
        )} */}

        {/* 가변영역 설정 */}
        <View style={{flex: 1}} />

        <PolicyChecker onPress={setPolicyChecked} />
        <AppButton
          title={i18n.t('payment')}
          titleStyle={appStyles.medium18}
          disabled={(cart.pymPrice?.value !== 0 && !selected) || !policyChecked}
          key={i18n.t('payment')}
          onPress={() => onSubmit(false)}
          style={appStyles.confirm}
          type="primary"
        />
      </KeyboardAwareScrollView>

      <AppModal
        title={showUnsupAlert ? i18n.t('pym:unsupportDeviceModal') : undefined}
        type={showUnsupAlert ? 'normal' : 'info'}
        onOkClose={async () => {
          setShowUnsupAlert((prev) => !prev);
          onSubmit(true);
        }}
        onCancelClose={() => setShowUnsupAlert((prev) => !prev)}
        visible={showUnsupAlert}>
        {modalBody()}
      </AppModal>
    </SafeAreaView>
  );
};

export default connect(
  ({account, cart, info, product}: RootState) => ({
    account,
    cart,
    info,
    product,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
      product: bindActionCreators(productActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(PymMethodScreen);
