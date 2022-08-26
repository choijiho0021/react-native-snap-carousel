import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {SetStateAction, useCallback, useEffect, useState} from 'react';
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Video from 'react-native-video';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
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
import {PaymentMethod} from '@/redux/api/paymentApi';
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

const {esimApp} = Env.get();
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
    // marginTop: 20,
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // marginTop: 15,
    // marginHorizontal: 20,
  },
  buttonStyle: {
    flex: 1,
    height: 62,
    backgroundColor: colors.white,
    borderStyle: 'solid' as const,
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  buttonText: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    color: colors.warmGrey,
  },
  addrCardText: {
    ...appStyles.normal14Text,
    color: colors.black,
    lineHeight: 24,
  },
  addrBtn: {
    height: 48,
    borderRadius: 3,
    // marginHorizontal: 20,
    marginTop: 0,
  },
  profileTitle: {
    marginBottom: 6,
    flex: 1,
    flexDirection: 'row',
  },
  profileTitleText: {
    color: colors.black,
    alignItems: 'flex-start',
    marginRight: 20,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chgButtonText: {
    ...appStyles.normal12Text,
    color: colors.white,
  },
  chgButton: {
    width: 50,
    height: 36,
    borderRadius: 3,
    backgroundColor: colors.warmGrey,
    marginLeft: 20,
  },
  basicAddr: {
    ...appStyles.normal12Text,
    width: 52,
    height: Platform.OS === 'android' ? 15 : 12,
    lineHeight: Platform.OS === 'android' ? 15 : 12,
    fontSize: Platform.OS === 'android' ? 11 : 12,
    color: colors.clearBlue,
    alignSelf: 'center',
  },
  basicAddrBox: {
    width: 68,
    height: 22,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,
    justifyContent: 'center',
    alignSelf: 'center',
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
  boldTitle: {
    ...appStyles.bold18Text,
    color: colors.black,
    lineHeight: 22,
    // marginTop: 20,
    alignSelf: 'center',
  },
  dropDownIcon: {
    flexDirection: 'column',
    alignSelf: 'flex-end',
  },
  thickBar: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    // marginVertical: 20,
    marginBottom: 30,
  },
  pickerWrapper: {
    ...appStyles.borderWrapper,
    height: 40,
    borderColor: colors.lightGrey,
    paddingLeft: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  textField: {
    borderRadius: 3,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    marginTop: 15,
    height: 100,
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignSelf: 'center',
    marginRight: 15,
  },
  normal16BlueTxt: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
    lineHeight: 24,
    letterSpacing: 0.24,
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
    paddingHorizontal: 15,
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

const {esimGlobal} = Env.get();

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
  const [selected, setSelected] = useState<PaymentMethod>(
    API.Payment.method[0][0],
  );
  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);
  const [clickable, setClickable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModalMethod, setShowModalMethod] = useState(true);
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [deliveryMemo, setDeliveryMemo] = useState<{
    directInput: boolean;
    header?: string;
    selected?: string;
    content?: string;
  }>(
    Platform.OS === 'android'
      ? {
          directInput: false,
          header: i18n.t('pym:notSelected'),
          selected: undefined,
          content: i18n.t('pym:notSelected'),
        }
      : {
          directInput: false,
          header: undefined,
          selected: undefined,
          content: undefined,
        },
  );
  const [consent, setConsent] = useState<boolean>();
  const [isRecharge, setIsRecharge] = useState<boolean>();
  const [isPassingAlert, setIsPassingAlert] = useState(false);

  const setValues = useCallback(() => {
    setPymPrice(cart.pymPrice);
    setDeduct(cart.deduct);
    setMode(route.params.mode);
    setIsRecharge(
      cart.purchaseItems.findIndex((item) => item.type === 'rch') >= 0,
    );
    setDeliveryMemo((prev) => ({...prev, content: profile.content}));
  }, [cart, profile, route.params?.mode]);

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
    if (!esimApp) {
      const {uid, token} = account;
      // ESIM이 아닌 경우에만 주소 정보가 필요하다.
      action.profile.getCustomerProfile({uid, token});
    }
  }, [account, action.profile]);

  useEffect(() => {
    setValues();
  }, [setValues]);

  const onSubmit = useCallback(
    (passingAlert: boolean) => {
      if (!clickable) return;

      const memo =
        deliveryMemo.selected === i18n.t('pym:input')
          ? deliveryMemo.content
          : deliveryMemo.selected;

      if (!passingAlert && !account.isSupportDev) {
        setShowModalAlert((prev) => !prev);
        return;
      }

      setClickable(false);

      if (_.isEmpty(selected) && pymPrice?.value !== 0) return;

      const {mobile, email} = account;
      const profileId =
        profile.selectedAddr ||
        profile.profile.find((item) => item.isBasicAddr)?.uuid;
      const dlvCost =
        cart.pymReq?.find((item) => item.key === 'dlvCost')?.amount ||
        utils.toCurrency(0, pymPrice?.currency);

      let scheme = 'RokebiUsim';
      if (esimApp) scheme = esimGlobal ? 'RokebiGlobal' : 'RokebiEsim';

      // 로깨비캐시 결제
      if (pymPrice?.value === 0) {
        // if the payment amount is zero, call the old API payNorder
        setLoading(true);
        const {impId, adjustRokebiCash = ''} = Env.get();

        const pymInfo = createPaymentInfoForRokebiCash({
          impId,
          mobile,
          profileId,
          memo,
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
          pg: selected?.key,
          pay_method: selected?.method,
          merchant_uid: `mid_${mobile}_${new Date().getTime()}`,
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
          language: selected?.language || 'KR',
          digital: true,
          memo,
          // mode: 'test'
        } as PaymentParams;

        console.log('@@ para', params);

        setClickable(true);
        navigation.navigate('Payment', params);
      }
    },
    [
      account,
      action.cart,
      cart.pymReq,
      clickable,
      deduct,
      deliveryMemo,
      mode,
      navigation,
      profile,
      pymPrice,
      selected,
    ],
  );

  const button = useCallback(
    () =>
      API.Payment.method
        .filter((m) => m.length > 0)
        .map((value, rowIdx, arr) => (
          <View key={rowIdx.toString()} style={styles.buttonRow}>
            {
              // key: row, idx: column
              value.map((v, idx) => (
                <AppButton
                  key={v.key + v.method}
                  title={!v.icon ? i18n.t(v.title) : undefined}
                  style={[
                    styles.buttonStyle,
                    {
                      borderRightWidth: idx === value.length - 1 ? 1 : 0,
                      borderBottomWidth: rowIdx === arr.length - 1 ? 1 : 0,
                      borderLeftColor:
                        (idx === column || idx === column + 1) && rowIdx === row
                          ? colors.clearBlue
                          : colors.lightGrey,
                      borderTopColor:
                        (idx === column ||
                          (rowIdx - 1 === row && !arr[rowIdx - 1][idx])) &&
                        (rowIdx === row || rowIdx - 1 === row)
                          ? colors.clearBlue
                          : colors.lightGrey,
                      borderRightColor:
                        idx === column && rowIdx === row
                          ? colors.clearBlue
                          : colors.lightGrey,
                      borderBottomColor:
                        idx === column && rowIdx === row
                          ? colors.clearBlue
                          : colors.lightGrey,
                    },
                  ]}
                  iconName={v.icon}
                  checked={v.title === selected.title}
                  onPress={() => {
                    setSelected(v);
                    setRow(rowIdx);
                    setColumn(idx);
                  }}
                  titleStyle={styles.buttonText}
                />
              ))
            }
          </View>
        )),
    [column, row, selected.title],
  );

  const dropDownHeader = useCallback(
    (
      showModal: boolean,
      setShowModal: React.Dispatch<SetStateAction<boolean>>,
      title: string,
      alias?: string,
    ) => {
      return (
        <TouchableOpacity
          style={styles.spaceBetweenBox}
          onPress={() => setShowModal((prev) => !prev)}>
          <AppText style={styles.boldTitle}>{title}</AppText>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            {!showModal && (
              <AppText style={[styles.alignCenter, styles.normal16BlueTxt]}>
                {alias}
              </AppText>
            )}
            <AppButton
              style={{backgroundColor: colors.white, height: 70}}
              iconName={showModal ? 'iconArrowUp' : 'iconArrowDown'}
              iconStyle={styles.dropDownIcon}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [],
  );

  const method = useCallback(() => {
    const benefit = selected
      ? info.infoMap
          .get(infoKey)
          ?.find((item) => item.title.indexOf(selected.title) >= 0)
      : undefined;

    return (
      <View>
        {dropDownHeader(
          showModalMethod,
          setShowModalMethod,
          i18n.t('pym:method'),
          selected?.title ? i18n.t(selected?.title) : '',
        )}
        {showModalMethod && (
          <View style={styles.beforeDrop}>
            <View style={styles.thickBar} />
            {button()}
            {
              //
              /* 토스 간편결제 추가로 현재 불필요
            <AppText style={{marginVertical: 20, color: colors.clearBlue}}>
              {i18n.t('pym:tossInfo')}
            </AppText> 
            */
            }
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
  }, [button, dropDownHeader, info.infoMap, selected, showModalMethod]);

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

  const modalBody = useCallback(() => {
    return (
      <View style={styles.modalBodyStyle}>
        <AppText style={[appStyles.normal16Text]}>
          {i18n.t('pym:unsupportDeviceModalContent')}
        </AppText>
      </View>
    );
  }, []);

  const consentBox = useCallback(() => {
    return (
      <View style={{backgroundColor: colors.whiteTwo, paddingBottom: 45}}>
        <TouchableOpacity
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
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.spaceBetweenBox]}
          onPress={() => move('1')}>
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
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.spaceBetweenBox}
          onPress={() => move('2')}>
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
        </TouchableOpacity>
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
          disabled={(pymPrice?.value !== 0 && _.isEmpty(selected)) || !consent}
          key={i18n.t('payment')}
          onPress={() => onSubmit(isPassingAlert)}
          style={appStyles.confirm}
          type="primary"
        />
      </KeyboardAwareScrollView>
      <AppModal
        title={i18n.t('pym:unsupportDeviceModal')}
        type="normal"
        onOkClose={async () => {
          setShowModalAlert((prev) => !prev);
          setIsPassingAlert(true);
          onSubmit(true);
        }}
        onCancelClose={() => setShowModalAlert((prev) => !prev)}
        visible={showModalAlert === true}>
        {modalBody()}
      </AppModal>
      {
        // 로깨비캐시 결제시 필요한 로딩처리
        loading && (
          <Video
            source={loadingImg}
            resizeMode="stretch"
            repeat
            style={styles.backgroundVideo}
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
