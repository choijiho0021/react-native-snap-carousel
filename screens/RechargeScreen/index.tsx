import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ImageBackground,
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
import AppIcon from '@/components/AppIcon';
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
  divider: {
    marginTop: 30,
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
    height: 48,
    borderRadius: 24,
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
  image: {
    width: '100%',
    height: '100%',
  },
  rechargeBox: {
    marginTop: 15,
    marginHorizontal: 20,
    height: 108,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWithText: {
    marginHorizontal: 28,
    marginVertical: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceButtonText: {
    ...appStyles.normal14Text,
    marginLeft: 0,
    textAlign: 'left',
  },
});

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

const {esimApp, esimCurrency} = Env.get();
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
  account,
  action,
}) => {
  // recharge 상품의 SKU는 'rch-{amount}' 형식을 갖는다.
  const [selected, setSelected] = useState(`rch-${rechargeChoice[0][0]}`);
  const [amount, setAmount] = useState(rechargeChoice[0][0]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('recharge')} />,
    });

    return () => {
      const {iccid, token} = account;
      if (iccid && token) {
        action.order.getSubs({iccid, token});
      }
    };
  }, [account, action.order, navigation]);

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

  const {balance = 0} = account;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.rechargeBox}>
          <ImageBackground
            source={require('../../assets/images/esim/card.png')}
            style={styles.image}>
            <View style={styles.iconWithText}>
              <View>
                <AppIcon
                  style={{width: '100%', justifyContent: 'flex-end'}}
                  name="rokIcon"
                />
                <AppText
                  style={[
                    appStyles.normal14Text,
                    {textAlign: 'left', marginTop: 12},
                  ]}>
                  {i18n.t('acc:remain')}
                </AppText>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <AppText style={appStyles.bold30Text}>
                  {utils.numberToCommaString(balance || 0)}
                  <AppText
                    style={[appStyles.normal20Text, {fontWeight: 'normal'}]}>
                    {i18n.t(esimCurrency)}
                  </AppText>
                </AppText>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={[styles.divider, esimApp && {marginTop: 20}]} />
        <View style={{flex: 1}} />
        <AppText
          style={[appStyles.normal16Text, {marginTop: 30, marginLeft: 20}]}>
          {i18n.t('rch:amount')}
        </AppText>
        <View style={{marginBottom: 40}}>
          {rechargeChoice.map(rechargeButton)}
        </View>
      </ScrollView>
      <AppButton
        title={i18n.t('rch:recharge')}
        titleStyle={appStyles.medium18}
        disabled={_.isEmpty(selected)}
        onPress={onSubmit}
        style={styles.confirm}
        type="primary"
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
    },
  }),
)(RechargeScreen);
