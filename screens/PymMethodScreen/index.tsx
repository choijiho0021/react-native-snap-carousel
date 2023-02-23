import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Video from 'react-native-video';
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
import {
  HomeStackParamList,
  PaymentParams,
  PymMethodScreenMode,
} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import api from '@/redux/api/api';
import {Currency} from '@/redux/api/productApi';
import utils from '@/redux/api/utils';
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
import {
  actions as profileActions,
  ProfileAction,
  ProfileModelState,
} from '@/redux/modules/profile';
import i18n from '@/utils/i18n';
import AppModal from '@/components/AppModal';
import AppStyledText from '@/components/AppStyledText';
import PymButtonList from '@/components/AppPaymentGateway/PymButtonList';
import DropDownHeader from './DropDownHeader';

const infoKey = 'pym:benefit';
const loadingImg = require('../assets/images/loading_1.mp4');

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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
  profile: ProfileModelState;
  info: InfoModelState;

  action: {
    profile: ProfileAction;
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
  action,
  info,
  profile,
}) => {
  const [mode, setMode] = useState<PymMethodScreenMode>();
  const [pymPrice, setPymPrice] = useState<Currency>();
  const [deduct, setDeduct] = useState<Currency>();
  const [selected, setSelected] = useState('pym:ccard');
  const [clickable, setClickable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModalMethod, setShowModalMethod] = useState(true);
  const [consent, setConsent] = useState<boolean>();
  const [isRecharge, setIsRecharge] = useState<boolean>();
  const [showUnsupAlert, setShowUnsupAlert] = useState(false);
  const [showChargeAlert, setShowChargeAlert] = useState(false);
  const [inicisEnabled, setInicisEnabled] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (cart.esimIccid) setShowChargeAlert(true);
    });

    return unsubscribe;
  }, [cart.esimIccid, navigation, showChargeAlert]);

  const setValues = useCallback(() => {
    setPymPrice(cart.pymPrice);
    setDeduct(cart.deduct);
    setMode(route.params.mode);
    setIsRecharge(
      cart.purchaseItems.findIndex((item) => item.type === 'rch') >= 0,
    );
  }, [cart.deduct, cart.purchaseItems, cart.pymPrice, route.params.mode]);

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

  useEffect(() => {
    setValues();
  }, [setValues]);

  useEffect(() => {
    const {token} = account;
    if (inicisEnabled === undefined) {
      API.Payment.getRokebiPaymentRule({token}).then((rsp) => {
        setInicisEnabled(rsp.inicis_enabled === '1');
      });
    }
  }, [account, inicisEnabled]);

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
      const profileId =
        profile.selectedAddr ||
        profile.profile.find((item) => item.isBasicAddr)?.uuid;
      const dlvCost = utils.toCurrency(0, pymPrice?.currency);
      const scheme = esimGlobal ? 'RokebiGlobal' : 'RokebiEsim';

      // 로깨비캐시 결제
      if (pymPrice?.value === 0) {
        // if the payment amount is zero, call the old API payNorder
        setLoading(true);

        const pymInfo = createPaymentInfoForRokebiCash({
          impId,
          mobile,
          profileId,
          deduct,
          dlvCost,
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
            setLoading(false);
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
            inicisEnabled ? 'r_' : ''
          }${mobile}_${new Date().getTime()}`,
          name: i18n.t('appTitle'),
          amount: pymPrice?.value, // 실제 결제 금액 (로깨비캐시 제외)
          rokebi_cash: deduct?.value, // balance 차감 금액
          buyer_tel: mobile,
          buyer_name: mobile,
          buyer_email: email,
          escrow: false,
          app_scheme: scheme,
          profile_uuid: profileId,
          dlvCost: dlvCost.value,
          language: payMethod?.language || i18n.locale,
          digital: true,
          // mode: 'test'
        } as PaymentParams;

        setClickable(true);
        navigation.navigate(
          inicisEnabled ? 'PaymentGateway' : 'Payment',
          params,
        );
      }
    },
    [
      account,
      action.cart,
      clickable,
      deduct,
      inicisEnabled,
      mode,
      navigation,
      profile,
      pymPrice,
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

  const {purchaseItems = [], pymReq} = cart;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableResetScrollToCoords={false}
        // resetScrollToCoords={{x: 0, y: 0}}
      >
        <PaymentItemInfo
          cart={purchaseItems}
          pymReq={pymReq}
          mode="method"
          pymPrice={pymPrice}
          deduct={deduct}
          isRecharge={isRecharge}
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

      {
        // 로깨비캐시 결제시 필요한 로딩처리
        loading && (
          <Video
            source={loadingImg}
            resizeMode="stretch"
            repeat
            style={styles.backgroundVideo}
            mixWithOthers="mix"
          />
        )
      }
    </SafeAreaView>
  );
};

export default connect(
  ({account, cart, profile, info}: RootState) => ({
    account,
    cart,
    profile,
    info,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      profile: bindActionCreators(profileActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(PymMethodScreen);
