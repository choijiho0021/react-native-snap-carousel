import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppAlert from '@/components/AppAlert';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {
  HomeStackParamList,
  PaymentParams,
  goBack,
} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import api from '@/redux/api/api';
import {createPaymentInfoForRokebiCash} from '@/redux/models/paymentResult';
import {
  AccountAction,
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
  handlePaymentError,
} from '@/redux/modules/product';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import DiscountInfo from '@/components/AppPaymentGateway/DiscountInfo';
import PaymentSummary from '@/components/PaymentSummary';
import ConfirmButton from '@/components/AppPaymentGateway/ConfirmButton';
import PymMethod, {
  PymMethodRef,
} from '@/components/AppPaymentGateway/PymMethod';
import PopupList from './PopupList';
import {retrieveData, utils} from '@/utils/utils';
import AppText from '@/components/AppText';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import DropDownHeader from './DropDownHeader';
import ProductDetailList from '../CancelOrderScreen/component/ProductDetailList';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import ScreenHeader from '@/components/ScreenHeader';
import BackbuttonHandler from '@/components/BackbuttonHandler';

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
    ...appStyles.bold16Text,
    marginTop: 24,
    marginBottom: 12,
    color: colors.black,
  },
  bottomBar: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },

  productTitle: {
    ...appStyles.bold18Text,
    lineHeight: 24,
    letterSpacing: 0.27,
    flexDirection: 'row',
    maxWidth: isDeviceSize('small') ? '70%' : '80%',
  },
  confirm: {
    height: 52,
    backgroundColor: colors.clearBlue,
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
    account: AccountAction;
  };
};

const {esimGlobal, impId, cachePrefix} = Env.get();
const defaultCardList = [
  ['14', '신한카드'],
  ['12', '삼성카드'],
  ['04', '현대카드'],
  ['06', 'KB국민카드'],
  ['03', '롯데카드'],
  ['41', 'NH농협카드'],
  ['02', '우리카드'],
  ['01', '하나카드'],
  ['11', 'BC카드'],
  ['43', '씨티카드'],
  ['56', '카카오뱅크'],
  ['55', '케이뱅크카드'],
  ['35', '산업카드'],
  ['51', '수협카드'],
  ['32', '광주카드'],
  ['33', '전북카드'],
  ['48', '신협체크카드'],
  ['52', '제주카드'],
  ['71', '우체국체크'],
];

const PymMethodScreen: React.FC<PymMethodScreenProps> = ({
  navigation,
  route,
  account: {mobile, email, token, isSupportDev, iccid},
  cart: {cartId, cartItems, pymPrice, pymReq, purchaseItems},
  info: {infoMap},
  product: {rule},
  action,
}) => {
  const {params: {mode} = {}} = route;
  const [selected, setSelected] = useState('pym:kakao');
  const [clickable, setClickable] = useState(true);
  const [policyChecked, setPolicyChecked] = useState(false);
  const [showUnsupAlert, setShowUnsupAlert] = useState(false);
  const [showSelectCard, setShowSelectCard] = useState(false);
  const [showInstallmentMonths, setShowInstallmentMonths] = useState(false);
  const [installmentMonths, setInstallmentMonths] = useState('0');
  const pymMethodRef = useRef<PymMethodRef>(null);
  const dispatch = useDispatch();
  const creditCardList = useMemo(() => {
    return (
      rule.ccard?.map(([k, v]) => ({
        label: v,
        value: `card${k}`,
      })) ||
      defaultCardList.map(([k, v]) => ({
        label: v,
        value: `card${k}`,
      }))
    );
  }, [rule.ccard]);

  const installmentMonthsList = useMemo(
    () =>
      [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((k) => ({
        label: k === 0 ? i18n.t('pym:pay:atonce') : k + i18n.t('pym:duration'),
        value: k.toString(),
      })),
    [],
  );

  useEffect(() => {
    action.account.getMyCoupon({token: token!}).then(async () => {
      const rsp = await action.cart.prepareOrder();

      // 재고 부족, unpublish 일 때는 결제 진입 시 Alert
      if (
        [api.E_RESOURCE_NOT_FOUND, api.E_STATUS_EXPIRED].includes(
          rsp?.payload?.result,
        )
      ) {
        handlePaymentError(
          {...rsp?.payload},
          navigation,
          cartItems,
          dispatch,
          token,
          iccid,
          cartId,
        );
      }
    });
    // 불필요한 두번 호춟 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action.account, action.cart, dispatch, iccid, navigation, token]);

  useEffect(() => {
    if (!infoMap.has(infoKey)) {
      action.info.getInfoList(infoKey);
    }
  }, [action.info, infoMap]);

  useEffect(() => {
    Analytics.trackEvent('Page_View_Count', {
      page: `Payment - ${mode}`,
    });
  }, [mode]);

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

      if (!passingAlert && !isSupportDev) {
        setShowUnsupAlert(true);
        return;
      }

      setClickable(false);

      const payMethod = selected.startsWith('card')
        ? API.Payment.method['pym:ccard']
        : selected.startsWith('vbank')
        ? API.Payment.method['pym:vbank']
        : API.Payment.method[selected];
      if (!payMethod && pymPrice?.value !== 0) return;

      const scheme = esimGlobal ? 'RokebiGlobal' : 'RokebiEsim';

      // 로깨비캐시 결제
      if (pymPrice?.value === 0) {
        // if the payment amount is zero, call the old API payNorder
        const pymInfo = createPaymentInfoForRokebiCash({
          impId,
          mobile,
          digital: true,
          deduct: pymReq?.rkbcash,
        });

        // payNorder에서 재고 확인 - resp.result값으로 비교
        action.cart.payNorder(pymInfo).then(({payload: resp}) => {
          if (resp.result === 0) {
            navigation.setParams({isPaid: true});
            navigation.replace('PaymentResult', {
              pymResult: true,
              pay_method: 'rokebi',
              mode,
            });
          } else {
            setClickable(true);
            handlePaymentError(
              resp,
              navigation,
              cartItems,
              dispatch,
              token,
              iccid,
              cartId,
            );
          }
        });
      } else {
        // if the payment amount is not zero, make order first
        let prefix = 'r_';
        let receipt: PaymentParams['receipt'];
        if (payMethod?.method === 'vbank') {
          receipt = pymMethodRef?.current?.getExtraInfo();
          prefix = 'v_';
        }

        const isSave = pymMethodRef?.current?.getIsSave();
        const params = {
          pg: payMethod?.key,
          pay_method: payMethod?.method,
          card: selected.startsWith('card') ? selected.slice(4, 6) : '',
          installmentMonths,
          merchant_uid: `${prefix}${mobile}_${new Date().getTime()}`,
          name: i18n.t('appTitle'),
          amount: pymPrice?.value, // 실제 결제 금액 (로깨비캐시 제외)
          rokebi_cash: pymReq?.rkbcash?.value, // balance 차감 금액
          buyer_tel: mobile,
          buyer_name: mobile,
          buyer_email: email,
          escrow: false,
          app_scheme: scheme,
          language: payMethod?.language || i18n.locale,
          digital: true,
          paymentRule: rule,
          mode,
          receipt,
          selected,
          pymMethod: selected,
          isSave,
        } as PaymentParams;

        setClickable(true);
        navigation.navigate('PaymentGateway', params);
      }
    },
    [
      action.cart,
      cartId,
      cartItems,
      clickable,
      dispatch,
      email,
      iccid,
      installmentMonths,
      isSupportDev,
      mobile,
      mode,
      navigation,
      pymPrice?.value,
      pymReq?.rkbcash,
      rule,
      selected,
      token,
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
    } else if (kind === 'installmentMonths') {
      setShowInstallmentMonths(true);
    } else {
      setSelected(kind);
    }
  }, []);

  useEffect(() => {
    if (mode === 'recharge')
      action.cart.applyCoupon({couponId: undefined, accountCash: 0});
  }, [action.cart, mode]);

  const backHandler = useCallback(() => {
    return action.modal.renderModal(() => (
      <AppModalContent
        title={
          (pymReq?.discount?.value || 0) < 0
            ? i18n.t('pym:goBack:alert')
            : i18n.t('pym:goBack:alert2')
        }
        type="normal"
        onOkClose={() => {
          action.modal.closeModal();
        }}
        onCancelClose={() => {
          goBack(navigation, route);
          action.modal.closeModal();
        }}
        cancelButtonStyle={{color: colors.black, marginRight: 60}}
        okButtonTitle={i18n.t('no')}
        cancelButtonTitle={i18n.t('yes')}
        okButtonStyle={{color: colors.clearBlue}}
      />
    ));
  }, [action.modal, navigation, pymReq?.discount?.value, route]);

  BackbuttonHandler({
    navigation,
    onBack: () => {
      backHandler();
      return true;
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={i18n.t('payment')} backHandler={backHandler} />
      <KeyboardAwareScrollView
        contentContainerStyle={{minHeight: '100%'}}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        enableResetScrollToCoords={false}>
        <DropDownHeader
          title={i18n.t('pym:title')}
          style={{paddingTop: 16, paddingBottom: 20}}
          titleStyle={styles.productTitle}
          summary={`${purchaseItems.reduce((acc, cur) => acc + cur.qty, 0)}개`}>
          <ProductDetailList
            style={{
              paddingBottom: 0,
              paddingHorizontal: 20,
            }}
            showPriceInfo
            orderItems={purchaseItems}
          />
        </DropDownHeader>

        <View style={styles.bottomBar} />

        <View style={styles.changeEmail}>
          <AppText style={styles.title}>{i18n.t('pym:email')}</AppText>
          <ConfirmButton
            title={email}
            buttonTitle={i18n.t('changeEmail:short')}
            onPress={() => navigation.navigate('ChangeEmail')}
          />
        </View>

        <View style={styles.divider} />

        {mode !== 'recharge' && (
          <DiscountInfo onPress={() => navigation.navigate('SelectCoupon')} />
        )}

        <View style={styles.divider} />

        <PaymentSummary data={pymReq} total={pymPrice} mode={mode} />

        <View style={styles.divider} />

        <PymMethod
          pymMethodRef={pymMethodRef}
          value={selected}
          installmentMonths={installmentMonths}
          onPress={setPymMethod}
          price={pymPrice}
        />

        {/* 가변영역 설정 */}
        <View style={{flex: 1, minHeight: 26}} />

        <PolicyChecker onPress={setPolicyChecked} />
        <AppButton
          title={i18n.t('cart:payment').replace('%%', utils.price(pymPrice))}
          titleStyle={[appStyles.medium18, {color: colors.white}]}
          disableColor={colors.greyish}
          disableStyle={{backgroundColor: colors.lightGrey}}
          disabled={
            (pymPrice?.value !== 0 && !selected) ||
            !policyChecked ||
            (pymPrice?.value !== 0 && selected === 'card:noSelect')
          }
          disabledCanOnPress
          disabledOnPress={() => {
            if (selected === 'card:noSelect') {
              // AppAlert 결제에 사용할 카드를 선택해주세요
              AppAlert.info(i18n.t('pym:card:noSelect'));
            } else if (!policyChecked) {
              // AppAlert 주문 내용 확인 후 약관에 동의해주세요.
              AppAlert.info(i18n.t('pym:policy:alert'));
            }
          }}
          onPress={() => onSubmit(false)}
          style={styles.confirm}
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
          showSelectCard
            ? creditCardList
            : showInstallmentMonths
            ? installmentMonthsList
            : []
        }
        height={showInstallmentMonths ? '60%' : '80%'}
        visible={showSelectCard || showInstallmentMonths}
        onPress={(v) => {
          if (showSelectCard) {
            setShowSelectCard(false);
            setSelected(v);
          } else {
            setShowInstallmentMonths(false);
            setInstallmentMonths(v);
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
