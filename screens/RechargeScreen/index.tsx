import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
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
import {RkbProduct} from '@/redux/api/productApi';
import {useIsFocused} from '@react-navigation/native';
import TabBar from '../CountryScreen/TabBar';
import {API} from '@/redux/api';
import AppTextInput from '@/components/AppTextInput';
import AppAlert from '@/components/AppAlert';

const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirm: {
    ...appStyles.confirm,
    marginTop: 0,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  divider: {
    marginTop: 32,
    marginBottom: 5,
    height: 10,
    backgroundColor: '#f5f5f5',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 12.5,
  },
  button: {
    // iphon5s windowWidth == 320
    // width: isDeviceSize('small') ? 130 : 150,
    flex: 1,
    marginHorizontal: 7.5,
    height: 52,
    borderRadius: 100,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.warmGrey,
    justifyContent: 'center',
  },
  buttonText: {
    ...appStyles.price,
    textAlign: 'right',
    color: colors.warmGrey,
  },
  priceButtonText: {
    ...appStyles.price,
    fontSize: 20,
    textAlign: 'right',
    color: colors.warmGrey,
  },
  balance: {
    ...appStyles.robotoBold28Text,
    color: colors.black,
    lineHeight: 40,
  },
  currency: {
    ...appStyles.bold26Text,
    color: colors.black,
    lineHeight: 40,
    marginRight: 4,
  },
  buttonVoucherOcr: {
    marginTop: 20,
    flex: 1,
    height: 52,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.warmGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    marginTop: 20,
    flex: 1,
    height: 52,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chargeAmountView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray02,
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

const RechargeScreen: React.FC<RechargeScreenProps> = ({
  navigation,
  account: {iccid, token, balance = 0},
  action,
}) => {
  // recharge 상품의 SKU는 'rch-{amount}' 형식을 갖는다.
  const [selected, setSelected] = useState(`rch-${rechargeChoice[0][0]}`);
  const [amount, setAmount] = useState(rechargeChoice[0][0]);
  const isFocused = useIsFocused();
  const [voucherCode, setVoucherCode] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    return () => {
      if (iccid && token) {
        action.order.getSubs({iccid, token});
      }
    };
  }, [action.order, iccid, token]);

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
            API.Account.patchVoucherPoint({
              iccid,
              token,
              sign: 'register',
              code: voucherCode,
            }).then((rsp) => {
              if (rsp?.result === 0) {
                console.log('@@@@ ');
              } else {
                AppAlert.info(
                  '존재하지 않는 상품권입니다. 코드를 다시 확인해 주세요.',
                  '',
                  () => console.log('@@@ alert 확인 동작'),
                );
              }
            });
          }

          break;
        default:
          console.log('@@@@ error');
      }
    },
    [action.cart, amount, iccid, navigation, selected, token, voucherCode],
  );

  const rechargeButton = useCallback(
    (value: number[]) => (
      <View key={`${value[0]}`} style={styles.row}>
        {value.map((v) => {
          const key = `rch-${v}`;
          const checked = key === selected;
          const color = checked ? colors.clearBlue : colors.warmGrey;

          return (
            <Pressable
              key={key}
              onPress={() => {
                setSelected(key);
                setAmount(v);
              }}
              style={[
                styles.button,
                {borderColor: checked ? colors.clearBlue : colors.lightGrey},
              ]}>
              <AppPrice
                style={styles.buttonBox}
                balanceStyle={[styles.buttonText, {color}]}
                currencyStyle={[styles.priceButtonText, {color}]}
                price={utils.toCurrency(v, esimCurrency)}
              />
            </Pressable>
          );
        })}
      </View>
    ),
    [selected],
  );

  const renderChargeAmount = useCallback(() => {
    return (
      <View style={styles.chargeAmountView}>
        <AppText
          key="label"
          style={[appStyles.robotoBold22Text, {textAlign: 'left'}]}>
          {i18n.t('mypage:cash:amount')}
        </AppText>
        <AppPrice
          price={{value: (balance || 0) + amount, currency: esimCurrency}}
          balanceStyle={styles.balance}
          currencyStyle={styles.currency}
        />
      </View>
    );
  }, [amount, balance]);

  const renderProdType = useCallback(
    (key: RechargeTabType) => () => {
      console.log('@@@ 재렌더링 되는건가?');

      return key === 'cash' ? (
        <>
          <ScrollView>
            <AppText
              style={[appStyles.normal16Text, {marginTop: 30, marginLeft: 20}]}>
              {i18n.t('rch:amount')}
            </AppText>
            <View style={{marginBottom: 40}}>
              {rechargeChoice.map(rechargeButton)}
            </View>
          </ScrollView>
          {renderChargeAmount()}
          <AppButton
            title={i18n.t('rch:recharge')}
            titleStyle={[appStyles.medium18, {color: colors.white}]}
            disabled={_.isEmpty(selected)}
            onPress={() => onSubmit('cash')}
            style={styles.confirm}
            type="primary"
          />
        </>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              marginHorizontal: 20,
            }}>
            <AppText
              style={[appStyles.normal16Text, {marginTop: 30, marginLeft: 20}]}>
              {i18n.t('mypage:voucher:code')}
            </AppText>

            <Pressable
              key={key}
              onPress={() => {
                console.log('@@@ 구현 필요');
              }}
              style={[
                styles.buttonVoucherOcr,
                {borderColor: colors.lightGrey},
              ]}>
              <AppText>{i18n.t('mypage:voucher:ocr')}</AppText>
            </Pressable>

            <AppTextInput
              style={styles.textInput}
              enablesReturnKeyAutomatically
              keyboardType="numeric"
              onChangeText={(val: string) => {
                setVoucherCode(val);
              }}
              clearTextOnFocus={false}
              value={voucherCode}
            />
            <View>
              <AppText>{i18n.t('mypage:voucher:noti')}</AppText>
            </View>
          </ScrollView>

          <AppButton
            title={i18n.t('mypage:voucher:use')}
            titleStyle={[appStyles.medium18, {color: colors.white}]}
            disabled={_.isEmpty(selected)}
            onPress={() => onSubmit('voucher')}
            style={styles.confirm}
            type="primary"
          />
        </>
      );
    },
    [onSubmit, rechargeButton, renderChargeAmount, selected, voucherCode],
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
    </SafeAreaView>
  );
};

export default connect(
  ({account}: RootState) => ({account}),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(RechargeScreen);
