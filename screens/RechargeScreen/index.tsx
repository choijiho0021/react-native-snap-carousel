import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppPrice from '@/components/AppPrice';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import utils from '@/redux/api/utils';
import {PurchaseItem} from '@/redux/models/purchaseItem';

import {
  AccountModelState,
  AccountAction,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TabBar from '../CountryScreen/TabBar';
import {API} from '@/redux/api';
import VoucherBottomAlert from './VoucherBottomAlert';
import RenderChargeAmount from './RenderChargeAmount';
import AppSvgIcon from '@/components/AppSvgIcon';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';

import {
  actions as toastActions,
  ToastAction,
  Toast,
} from '@/redux/modules/toast';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import AppStyledText from '@/components/AppStyledText';
import VoucherTab from './VoucherTab';
import api from '@/redux/api/api';

const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirm: {
    ...appStyles.confirm,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginHorizontal: 20,
    gap: 12,
  },
  btnBox: {
    paddingTop: 20,
    // 그림자..
    shadowOpacity: 1,
    backgroundColor: colors.white,
    shadowColor: 'rgba(166, 168, 172, 0.16)',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowRadius: 16,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderColor: colors.whiteFive,
    gap: 4,
  },

  button: {
    flex: 1,
    height: 52,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.warmGrey,
    justifyContent: 'center',
  },
  buttonText: {
    ...appStyles.robotoMedium20Text,
    textAlign: 'right',
    lineHeight: 24,
    color: colors.warmGrey,
  },
  priceButtonText: {
    ...appStyles.medium18,
    textAlign: 'right',
    lineHeight: 24,
    color: colors.warmGrey,
  },
  modalText: {
    ...appStyles.normal16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.warmGrey,
  },
  modalBoldText: {
    ...appStyles.semiBold16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.black,
  },
});

type RechargeTabType = 'cash' | 'voucher';

type RechargeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Recharge'
>;

type RechargeScreenProps = {
  navigation: RechargeScreenNavigationProp;

  account: AccountModelState;

  action: {
    account: AccountAction;
    order: OrderAction;
    cart: CartAction;
    toast: ToastAction;
    modal: ModalAction;
  };
};

const {esimCurrency} = Env.get();
const rechargeChoice =
  esimCurrency === 'KRW'
    ? [
        [5000, 10000],
        [15000, 20000],
        [25000, 30000],
        [50000, 100000],
      ]
    : [
        [5, 10],
        [15, 20],
        [25, 30],
        [40, 50],
      ];

const TEST_OPTION = false;

const RechargeScreen: React.FC<RechargeScreenProps> = ({
  navigation,
  account: {iccid, token, balance = 0},
  action,
}) => {
  // recharge 상품의 SKU는 'rch-{amount}' 형식을 갖는다.
  const [selected, setSelected] = useState(`rch-${rechargeChoice[0][0]}`);
  const [amount, setAmount] = useState(rechargeChoice[0][0]);
  const [voucherCode, setVoucherCode] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [voucherType, setVoucherType] = useState({
    title: '',
    amount: 0,
    expireDesc: '',
  });

  useEffect(() => {
    return () => {
      if (iccid && token) {
        action.order.getSubs({iccid, token});
      }
    };
  }, [action.order, iccid, token]);

  const registerVoucher = useCallback(() => {
    API.Account.patchVoucherPoint({
      iccid,
      token,
      sign: 'register',
      code: voucherCode,
    }).then((rsp) => {
      if (rsp?.result === api.E_NETWORK_FAILED) {
        // 네트워크 오류 - 팝업 미출력
        return;
      }
      if (rsp?.result === 0) {
        action.toast.push({
          msg: Toast.VOUCHER_REGISTER,
          toastIcon: 'bannerMarkToastSuccess',
        });
        action.account.getAccount({iccid, token});
        navigation.navigate('MyPageStack', {
          screen: 'CashHistory',
          initial: false,
        });
      } else {
        action.modal.renderModal(() => (
          <AppModalContent
            type="info2"
            buttonBoxStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            okButtonStyle={{marginBottom: 1}}
            onOkClose={() => {
              action.modal.closeModal();
            }}>
            <View style={{marginLeft: 30}}>
              <AppStyledText
                text={i18n.t(
                  rsp?.result === 3205
                    ? 'esim:recharge:voucher:regist:alreadyUsed'
                    : `esim:recharge:voucher:regist:fail`,
                )}
                textStyle={styles.modalText}
                format={{b: styles.modalBoldText}}
              />
            </View>
          </AppModalContent>
        ));
      }
    });
  }, [
    action.account,
    action.modal,
    action.toast,
    iccid,
    navigation,
    token,
    voucherCode,
  ]);

  const onSubmit = useCallback(() => {
    if (selected) {
      const purchaseItems = [
        {
          key: 'rch',
          type: 'rch',
          title: `${utils.numberToCommaString(amount)} ${i18n.t(
            'sim:rechargeBalance',
          )}`,
          price: utils.toCurrency(amount, esimCurrency),
          qty: 1,
          sku: selected,
        } as PurchaseItem,
      ];

      action.cart.purchase({purchaseItems});
      navigation.navigate('PymMethod', {
        pymPrice: utils.stringToNumber(selected),
        mode: 'recharge',
      });
    }
  }, [action.cart, amount, navigation, selected]);

  const rechargeButton = useCallback(
    (value: number[]) => (
      <View key={`${value[0]}`} style={styles.row}>
        {value.map((v) => {
          const key = `rch-${v}`;
          const checked = key === selected;
          const fontColor = checked ? colors.white : colors.black;
          const backgroundColor = checked ? colors.clearBlue : colors.white;

          return (
            <Pressable
              key={key}
              onPress={() => {
                setSelected(key);
                setAmount(v);
              }}
              style={[
                styles.button,
                {
                  borderColor: checked ? colors.clearBlue : colors.lightGrey,
                  borderWidth: checked ? 0 : 1,
                  backgroundColor,
                },
              ]}>
              <AppPrice
                style={styles.buttonBox}
                balanceStyle={[styles.buttonText, {color: fontColor}]}
                currencyStyle={[styles.priceButtonText, {color: fontColor}]}
                price={utils.toCurrency(v, esimCurrency)}
              />
            </Pressable>
          );
        })}
      </View>
    ),
    [selected],
  );

  const renderProdType = useCallback(
    (key: RechargeTabType) => () => {
      return key === 'cash' ? (
        <>
          <ScrollView>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 32,
                marginLeft: 20,
                gap: 6,
              }}>
              <AppSvgIcon style={{marginTop: 1}} name="lightningCashIcon" />
              <AppText style={[appStyles.bold18Text, {lineHeight: 24}]}>
                {i18n.t('esim:recharge:cash')}
              </AppText>
            </View>
            <View style={{marginBottom: 40}}>
              {rechargeChoice.map(rechargeButton)}
            </View>
          </ScrollView>
          <View>
            <View style={styles.btnBox}>
              <RenderChargeAmount amount={amount} balance={balance} />
              <AppButton
                title={i18n.t('esim:recharge:cash:btn')}
                titleStyle={[appStyles.medium18, {color: colors.white}]}
                disabled={_.isEmpty(selected)}
                onPress={() => onSubmit()}
                style={styles.confirm}
                type="primary"
              />
            </View>
          </View>
        </>
      ) : (
        <VoucherTab
          setShowAlert={setShowAlert}
          setVoucherType={setVoucherType}
          amount={voucherType.amount}
          voucherCode={voucherCode}
          setVoucherCode={setVoucherCode}
        />
      );
    },
    [
      amount,
      balance,
      onSubmit,
      rechargeButton,
      selected,
      voucherCode,
      voucherType.amount,
    ],
  );
  const renderSelectedPane = useCallback(() => {
    return (
      <Tab.Navigator
        initialRouteName="cash"
        tabBar={(props) => <TabBar {...props} />}
        sceneContainerStyle={{backgroundColor: colors.white}}>
        {['cash', 'voucher'].map((k) => (
          <Tab.Screen
            key={k}
            name={k}
            options={{
              lazy: true,
              title: i18n.t(`mypage:charge:${k}`),
              swipeEnabled: false,
            }}>
            {renderProdType(k)}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    );
  }, [renderProdType]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={appStyles.header}>
        <AppBackButton title={i18n.t('recharge')} />
      </View>

      {renderSelectedPane()}
      <VoucherBottomAlert
        visible={showAlert}
        onClickButton={() => {
          registerVoucher();
          setShowAlert(false);
        }}
        setVisible={setShowAlert}
        balance={balance}
        voucherType={voucherType}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({account}: RootState) => ({account}),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(RechargeScreen);
