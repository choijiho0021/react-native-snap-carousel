import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import PaymentItemInfo from '@/components/PaymentItemInfo';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
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
import {ProductModelState} from '@/redux/modules/product';

const infoKey = 'pym:benefit';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  result: {
    justifyContent: 'center',
    height: isDeviceSize('small') ? 200 : 255,
  },
  resultText: {
    ...appStyles.normal16Text,
    color: colors.warmGrey,
    textAlign: 'center',
  },
  spaceBetweenBox: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  underlinedClearBlue: {
    color: colors.clearBlue,
    textDecorationLine: 'underline',
    alignSelf: 'center',
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
  };
};

const {esimGlobal, impId} = Env.get();

const PymMethodScreen: React.FC<PymMethodScreenProps> = ({
  navigation,
  route,
  account,
  cart,
  info,
  product,
  action,
}) => {
  const [selected, setSelected] = useState('pym:ccard');
  const [clickable, setClickable] = useState(true);
  const [showModalMethod, setShowModalMethod] = useState(true);
  const [consent, setConsent] = useState<boolean>();
  const [showUnsupAlert, setShowUnsupAlert] = useState(false);
  const [showChargeAlert, setShowChargeAlert] = useState(false);
  const {pymPrice, deduct} = useMemo(() => cart, [cart]);
  const mode = useMemo(() => route.params.mode, [route.params.mode]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (cart.esimIccid) setShowChargeAlert(true);
    });

    return unsubscribe;
  }, [cart.esimIccid, navigation, showChargeAlert]);

  useEffect(() => {
    if (!info.infoMap.has(infoKey)) {
      action.info.getInfoList(infoKey);
    }
  }, [action.info, info.infoMap]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          title={i18n.t('payment')}
          isPaid={route.params?.isPaid}
        />
      ),
    });
    Analytics.trackEvent('Page_View_Count', {
      page: `Payment - ${route.params?.mode}`,
    });
  }, [navigation, route.params]);

  const onSubmit = useCallback(
    (passingAlert: boolean) => {
      if (!clickable) return;

      if (!passingAlert && !account.isSupportDev) {
        setShowUnsupAlert((prev) => !prev);
        return;
      }

      setClickable(false);

      const payMethod = API.Payment.method[selected];
      if (!payMethod && pymPrice?.value !== 0) return;

      const {mobile, email} = account;
      const scheme = esimGlobal ? 'RokebiGlobal' : 'RokebiEsim';

      // 로깨비캐시 결제
      if (pymPrice?.value === 0) {
        // if the payment amount is zero, call the old API payNorder
        const pymInfo = createPaymentInfoForRokebiCash({
          impId,
          mobile,
          deduct,
          digital: true,
        });

        // const adjustRokebiCashEvent = new AdjustEvent(adjustRokebiCash);
        // adjustRokebiCashEvent.setRevenue(info.rokebi_cash, 'KRW');
        // Adjust.trackEvent(adjustRokebiCashEvent);

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
          merchant_uid: `${
            product.rule.inicis_enabled === '1' ? 'r_' : 'i_'
          }${mobile}_${new Date().getTime()}`,
          name: i18n.t('appTitle'),
          amount: pymPrice?.value, // 실제 결제 금액 (로깨비캐시 제외)
          rokebi_cash: deduct?.value, // balance 차감 금액
          buyer_tel: mobile,
          buyer_name: mobile,
          buyer_email: email,
          escrow: false,
          app_scheme: scheme,
          language: payMethod?.language || i18n.locale,
          digital: true,
          paymentRule: product.rule,
        } as PaymentParams;

        setClickable(true);
        navigation.navigate(
          // product.rule.inicis_enabled === '1' ? 'PaymentGateway' : 'Payment',
          product.rule.inicis_enabled === '1'
            ? payMethod?.method === 'card'
              ? 'SelectCard'
              : 'PaymentGateway'
            : 'Payment',
          params,
        );
      }
    },
    [
      account,
      action.cart,
      clickable,
      deduct,
      mode,
      navigation,
      product.rule,
      pymPrice?.value,
      selected,
    ],
  );

  const method = useCallback(() => {
    const benefit = selected
      ? info.infoMap
          .get(infoKey)
          ?.find((item) => item.title.indexOf(selected) >= 0)
      : undefined;

    return (
      <View>
        <DropDownHeader
          showModal={showModalMethod}
          onPress={() => setShowModalMethod((prev) => !prev)}
          title={i18n.t('pym:method')}
          alias={selected ? i18n.t(selected) : ''}
        />
        {showModalMethod && (
          <View style={styles.beforeDrop}>
            <View style={styles.thickBar} />
            <PymButtonList selected={selected} onPress={setSelected} />
            {benefit && (
              <View style={styles.benefit}>
                <AppText style={[styles.normal12TxtLeft, {marginBottom: 5}]}>
                  {benefit.title}
                </AppText>
                <AppText
                  style={[styles.normal12TxtLeft, {color: colors.warmGrey}]}>
                  {benefit.body}
                </AppText>
              </View>
            )}
          </View>
        )}
        <View style={styles.divider} />
      </View>
    );
  }, [info.infoMap, selected, showModalMethod]);

  const move = useCallback(
    (key: '1' | '2') => {
      const param =
        key === '1'
          ? {
              key: 'setting:privacy',
              title: i18n.t('pym:privacy'),
            }
          : {
              key: 'pym:agreement',
              title: i18n.t('pym:paymentAgency'),
            };

      Analytics.trackEvent('Page_View_Count', {page: param.key});
      navigation.navigate('SimpleText', param);
    },
    [navigation],
  );

  const modalBody = useCallback((isSupported: boolean) => {
    return (
      <View style={styles.modalBodyStyle}>
        <AppStyledText
          text={
            isSupported
              ? i18n.t('pym:unsupportDeviceModalContent')
              : i18n.t('pym:chargeInfo')
          }
          textStyle={styles.modalText}
          format={{b: styles.textHeighlight, c: styles.textCaution}}
        />
      </View>
    );
  }, []);

  const consentBox = useCallback(() => {
    return (
      <View style={{backgroundColor: colors.whiteTwo, paddingBottom: 45}}>
        <Pressable
          style={styles.rowCenter}
          onPress={() => setConsent((prev) => !prev)}>
          <AppIcon name="btnCheck2" checked={consent} size={22} />
          <AppText
            style={[
              appStyles.bold16Text,
              {color: colors.black, marginLeft: 12},
            ]}>
            {i18n.t('pym:consentEssential')}
          </AppText>
        </Pressable>
        <Pressable style={styles.spaceBetweenBox} onPress={() => move('1')}>
          <AppText
            style={[
              appStyles.normal14Text,
              {color: colors.warmGrey, lineHeight: 22},
            ]}>
            {i18n.t('pym:privacy')}
          </AppText>
          <AppText style={styles.underlinedClearBlue}>
            {i18n.t('pym:detail')}
          </AppText>
        </Pressable>
        <Pressable style={styles.spaceBetweenBox} onPress={() => move('2')}>
          <AppText
            style={[
              appStyles.normal14Text,
              {color: colors.warmGrey, lineHeight: 22},
            ]}>
            {i18n.t('pym:paymentAgency')}
          </AppText>
          <AppText style={styles.underlinedClearBlue}>
            {i18n.t('pym:detail')}
          </AppText>
        </Pressable>
      </View>
    );
  }, [consent, move]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableResetScrollToCoords={false}>
        <PaymentItemInfo
          cart={cart.purchaseItems}
          pymReq={cart.pymReq}
          mode="method"
          pymPrice={pymPrice}
          deduct={deduct}
        />

        {pymPrice?.value !== 0 ? (
          method()
        ) : (
          <View style={styles.result}>
            <AppText style={styles.resultText}>
              {i18n.t('pym:balPurchase')}
            </AppText>
          </View>
        )}
        {consentBox()}
        <AppButton
          title={i18n.t('payment')}
          titleStyle={appStyles.medium18}
          disabled={(pymPrice?.value !== 0 && !selected) || !consent}
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
          if (showChargeAlert) {
            setShowChargeAlert((prev) => !prev);
          } else {
            setShowUnsupAlert((prev) => !prev);
            onSubmit(true);
          }
        }}
        onCancelClose={() => {
          if (showChargeAlert) {
            setShowChargeAlert((prev) => !prev);
          } else setShowUnsupAlert((prev) => !prev);
        }}
        visible={showUnsupAlert || showChargeAlert}>
        {modalBody(showUnsupAlert)}
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
    },
  }),
)(PymMethodScreen);
