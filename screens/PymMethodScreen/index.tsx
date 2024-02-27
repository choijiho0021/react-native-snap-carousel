import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
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
import PolicyChecker from '@/components/AppPaymentGateway/PolicyChecker';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import DiscountInfo from '@/components/AppPaymentGateway/DiscountInfo';
import PaymentSummary from '@/components/PaymentSummary';
import ConfirmButton from '@/components/AppPaymentGateway/ConfirmButton';
import PymMethod, {
  PymMethodRef,
} from '@/components/AppPaymentGateway/PymMethod';
import PopupList from './PopupList';
import {retrieveData, storeData} from '@/utils/utils';
import AppText from '@/components/AppText';
import {isDeviceSize} from '@/constants/SliderEntry.style';

const infoKey = 'pym:benefit';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
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
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
    marginTop: 24,
  },
  changeEmail: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
    marginHorizontal: 20,
  },
  title: {
    ...appStyles.bold18Text,
    marginTop: 20,
    marginBottom: isDeviceSize('small') ? 10 : 20,
    color: colors.black,
  },
  bottomBar: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
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
  const [showNavigateAlert, setShowNavigateAlert] = useState(false);
  const [navigateAlertTxt, setNavigateAlertTxt] = useState<string>();
  const [rstTm, setRstTm] = useState('');
  const [showSelectCard, setShowSelectCard] = useState(false);
  const [showDuration, setShowDuration] = useState(false);
  const [duration, setDuration] = useState('1');

  const mode = useMemo(() => route.params.mode, [route.params.mode]);
  const pymMethodRef = useRef<PymMethodRef>(null);
  const creditCardList = useMemo(
    () =>
      [
        '41',
        '03',
        '04',
        '06',
        '11',
        '12',
        '14',
        '34',
        '38',
        '32',
        '35',
        '33',
        '95',
        '43',
        '48',
        '51',
        '52',
        '54',
        '55',
        '56',
        '71',
      ].map((k) => ({
        label: i18n.t(`pym:card${k}`),
        value: `card${k}`,
      })),
    [],
  );

  const durationList = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((k) => ({
        label: k === 1 ? i18n.t('pym:pay:atonce') : k + i18n.t('pym:duration'),
        value: k.toString(),
      })),
    [],
  );

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
      if (method) setSelected(method);
    }
    getPymMethod();
  }, []);

  const onSubmit = useCallback(
    (passingAlert: boolean) => {
      if (!clickable) return;

      if (!passingAlert && !account.isSupportDev) {
        setShowUnsupAlert(true);
        return;
      }

      setClickable(false);

      // store payment
      console.log('@@@ pym method', selected);
      storeData(`${cachePrefix}cache.pym.method`, selected);

      const payMethod = selected.startsWith('card')
        ? API.Payment.method['pym:ccard']
        : selected.startsWith('vbank')
        ? API.Payment.method['pym:vbank']
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
            } else if (
              [api.E_INVALID_STATUS, api.W_INVALID_STATUS].includes(resp.result)
            ) {
              if (api.E_INVALID_STATUS === resp.result) {
                setNavigateAlertTxt(i18n.t('esim:charge:time:reject3'));
              } else if (resp.objects[0].leftDays > 1) {
                setRstTm(moment(resp.objects[0].rstTm).format('HH:mm:ss'));
                setNavigateAlertTxt(i18n.t('esim:charge:time:reject2'));
              } else {
                setNavigateAlertTxt(i18n.t('esim:charge:time:reject1'));
              }

              setShowNavigateAlert(true);
            } else {
              AppAlert.info(i18n.t('cart:systemError'));
            }
          }
        });
      } else {
        // if the payment amount is not zero, make order first
        let prefix = 'r_';
        let receipt: PaymentParams['receipt'];
        if (payMethod?.method === 'vbank') {
          receipt = pymMethodRef?.current?.getExtraInfo();
          prefix = 'v_';
          console.log('@@@ vbank', receipt);
        }

        const params = {
          pg: payMethod?.key,
          pay_method: payMethod?.method,
          card: selected.startsWith('card') ? selected.slice(4, 6) : '',
          merchant_uid: `${prefix}${mobile}_${new Date().getTime()}`,
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
          receipt,
        } as PaymentParams;

        setClickable(true);
        navigation.navigate('PaymentGateway', params);
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

  const setPymMethod = useCallback((kind: string) => {
    if (kind === 'card') {
      setShowSelectCard(true);
    } else if (kind === 'duration') {
      setShowDuration(true);
    } else {
      setSelected(kind);
    }
  }, []);

  const renderModal = useCallback(() => {
    const navigateEsim = () => {
      setShowNavigateAlert(false);
      navigation.popToTop();
      navigation.navigate('EsimStack', {screen: 'Esim'});
    };

    return (
      <AppModal
        onCancelClose={navigateEsim}
        type="info"
        onOkClose={navigateEsim}
        contentStyle={styles.modalContent}
        titleStyle={styles.titleContent}
        visible={showNavigateAlert}
        buttonBackgroundColor={colors.clearBlue}
        cancelButtonTitle={i18n.t('no')}
        cancelButtonStyle={styles.modalCloseStyle}
        okButtonTitle={i18n.t('ok')}
        okButtonStyle={styles.modalOkText}>
        <View style={{marginHorizontal: 30}}>
          <AppStyledText
            text={navigateAlertTxt}
            textStyle={[
              appStyles.medium16,
              {color: colors.black, textAlignVertical: 'center'},
            ]}
            format={{
              red: [appStyles.bold16Text, {color: colors.redError}],
              b: appStyles.bold16Text,
            }}
            data={{date: rstTm}}
          />
        </View>
      </AppModal>
    );
  }, [navigateAlertTxt, navigation, rstTm, showNavigateAlert]);

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

        <View style={styles.bottomBar} />

        <View style={styles.changeEmail}>
          <AppText style={styles.title}>{i18n.t('pym:email')}</AppText>
          <ConfirmButton
            title={account.email}
            buttonTitle={i18n.t('changeEmail:short')}
            onPress={() => navigation.navigate('ChangeEmail')}
          />
        </View>

        <View key="div1" style={styles.divider} />

        <DiscountInfo onPress={() => navigation.navigate('SelectCoupon')} />

        <View key="div2" style={styles.divider} />

        <PaymentSummary data={cart.pymReq} total={cart.pymPrice} />

        <View key="div3" style={styles.divider} />

        <PymMethod
          pymMethodRef={pymMethodRef}
          value={selected}
          duration={duration}
          onPress={setPymMethod}
        />

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
        <View style={{flex: 1, minHeight: 26}} />

        <PolicyChecker onPress={setPolicyChecked} />
        <AppButton
          title={i18n.t('payment')}
          titleStyle={[appStyles.medium18, {color: colors.white}]}
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
          setShowUnsupAlert(false);
          onSubmit(true);
        }}
        onCancelClose={() => setShowUnsupAlert(false)}
        visible={showUnsupAlert}>
        {modalBody()}
      </AppModal>
      <PopupList
        data={
          showSelectCard ? creditCardList : showDuration ? durationList : []
        }
        visible={showSelectCard || showDuration}
        onPress={(v) => {
          if (showSelectCard) {
            setShowSelectCard(false);
            setSelected(v);
          } else {
            setShowDuration(false);
            setDuration(v);
          }
        }}
      />
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
