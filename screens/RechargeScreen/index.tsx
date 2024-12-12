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
import {AccountModelState} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TabBar from '../CountryScreen/TabBar';
import {API} from '@/redux/api';
import AppTextInput from '@/components/AppTextInput';
import AppAlert from '@/components/AppAlert';
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
    elevation: 12,
    shadowColor: 'rgba(166, 168, 172, 0.16)',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
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
  textInput: {
    ...appStyles.medium18,
    letterSpacing: -0.1,
    paddingVertical: 16,
    lineHeight: 24,
    marginTop: 20,
    flex: 1,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
  textContainer: {
    position: 'relative',
    ...appStyles.medium18,
    height: 52,
    marginTop: 20,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    ...appStyles.roboto16Text,
    letterSpacing: -0.16,
  },
  input: {
    opacity: 0,
    height: 0,
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
  const inputRef = useRef(null);
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
      if (rsp?.result === 0) {
        action.toast.push({
          msg: Toast.VOUCHER_REGISTER,
          toastIcon: 'bannerMarkToastSuccess',
        });
        navigation.goBack();
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
  }, [action.modal, action.toast, iccid, navigation, token, voucherCode]);

  const handleFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onSubmit = useCallback(
    (type: RechargeTabType) => {
      switch (type) {
        case 'cash':
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
          break;
        case 'voucher':
          if (iccid && token) {
            API.Account.getVoucherType({iccid, code: voucherCode}).then(
              (rsp) => {
                if (rsp?.result === 0) {
                  const {title, amount, expire_desc} = rsp?.objects;

                  setShowAlert(true);
                  setVoucherType({
                    title,
                    amount: parseInt(amount, 10),
                    expireDesc: expire_desc,
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
                          text={i18n.t(`esim:recharge:voucher:regist:fail`)}
                          textStyle={styles.modalText}
                          format={{b: styles.modalBoldText}}
                        />
                      </View>
                    </AppModalContent>
                  ));
                }
              },
            );
          }

          break;
        default:
          console.log('@@@@ error');
      }
    },
    [
      action.cart,
      action.modal,
      amount,
      iccid,
      navigation,
      selected,
      token,
      voucherCode,
    ],
  );
  const getMaskedPlaceholder = useCallback(
    (type: 'placeholder' | 'text') => {
      const code = voucherCode + '●●●●●●●●●●●●●●●●'.slice(voucherCode.length);
      const formattedCodeWithSpaces = code.replace(/.{4}/g, '$&  ');
      const text = formattedCodeWithSpaces.replace(/●/g, '').trim();

      if (type === 'placeholder') {
        return formattedCodeWithSpaces.replace(/[0-9]/g, '').trim();
      }

      if ((text.length % 6) - 4 === 0) {
        return `${text}  `;
      }

      return text;
    },
    [voucherCode],
  );

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
          <View style={styles.btnBox}>
            <RenderChargeAmount amount={amount} balance={balance} />
            <AppButton
              title={i18n.t('esim:recharge:cash:btn')}
              titleStyle={[appStyles.medium18, {color: colors.white}]}
              disabled={_.isEmpty(selected)}
              onPress={() => onSubmit('cash')}
              style={styles.confirm}
              type="primary"
            />
          </View>
        </>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              marginHorizontal: 20,
            }}>
            <View style={{flexDirection: 'row', marginTop: 32, gap: 6}}>
              <AppSvgIcon name="voucherIcon" />
              <AppText style={[appStyles.normal16Text]}>
                {i18n.t('mypage:voucher:code')}
              </AppText>
            </View>
            <Pressable onPress={handleFocus} style={styles.textContainer}>
              <AppText style={styles.placeholder}>
                <AppText style={{color: colors.black}}>
                  {getMaskedPlaceholder('text')}
                </AppText>
                <AppText style={{color: colors.greyish}}>
                  {getMaskedPlaceholder('placeholder')}
                </AppText>
              </AppText>
            </Pressable>

            {/* <AppTextInput
              style={styles.textInput}
              enablesReturnKeyAutomatically
              keyboardType="numeric"
              onChangeText={(val: string) => {
                console.log('@@@ test : ', val);

                setVoucherCode(val);
              }}
              placeholder="●●●●  ●●●●  ●●●●  ●●●●"
              placeholderTextColor={colors.greyish}
              clearTextOnFocus={false}
              value={voucherCode}
              maxLength={16}
            /> */}
            <View style={{flexDirection: 'row', gap: 6, marginTop: 6}}>
              <AppText
                style={[
                  appStyles.bold14Text,
                  {lineHeight: 20, color: colors.clearBlue},
                ]}>
                TIP
              </AppText>
              <AppText
                style={[
                  appStyles.medium14,
                  {lineHeight: 20, color: colors.warmGrey},
                ]}>
                {i18n.t('mypage:voucher:noti')}
              </AppText>
            </View>
            <AppTextInput
              ref={inputRef}
              style={styles.input}
              value={voucherCode}
              onChangeText={(val: string) => {
                setVoucherCode(val);
              }}
              keyboardType="numeric"
              maxLength={16}
            />
          </ScrollView>
          <AppButton
            title={i18n.t('mypage:voucher:use')}
            titleStyle={[appStyles.medium18, {color: colors.white}]}
            disabled={_.isEmpty(selected) || voucherCode.length !== 16}
            onPress={() => onSubmit('voucher')}
            style={styles.confirm}
            type="primary"
          />
        </>
      );
    },
    [
      amount,
      balance,
      getMaskedPlaceholder,
      handleFocus,
      onSubmit,
      rechargeButton,
      selected,
      voucherCode,
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
      order: bindActionCreators(orderActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(RechargeScreen);
