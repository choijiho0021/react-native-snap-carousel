import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import LabelText from '@/components/LabelText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {MyPageStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
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
  actions as orderActions,
  OrderAction,
  OrderModelState,
} from '@/redux/modules/order';
import {API} from '@/redux/api';
import utils from '@/redux/api/utils';
import i18n from '@/utils/i18n';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';

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
  upper: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    height: 168,
    // borderWidth: 1,
    // borderColor: colors.lightGrey,
    marginHorizontal: 47,
    marginTop: 20,
  },
  iccidTitle: {
    ...appStyles.bold12Text,
    color: colors.clearBlue,
  },
  iccidRow: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iccid: {
    ...appStyles.roboto16Text,
    color: colors.black,
  },
  iccidBox: {
    marginHorizontal: 47,
    marginTop: 15,
  },
  divider: {
    marginTop: 30,
    marginBottom: 5,
    height: 10,
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 20,
  },
  button: {
    // iphon5s windowWidth == 320
    width: isDeviceSize('small') ? 130 : 150,
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
    textAlign: 'center',
    color: colors.warmGrey,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  rechargeBox: {
    marginTop: 15,
    marginHorizontal: 20,
    height: 130,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rchTextBox: {
    width: '100%',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWithText: {
    flex: 6,
    marginHorizontal: 28,
    marginVertical: 22,
    // justifyContent: 'center',
  },
});

type RechargeScreenNavigationProp = StackNavigationProp<
  MyPageStackParamList,
  'Recharge'
>;

type RechargeScreenRouteProp = RouteProp<MyPageStackParamList, 'Recharge'>;

type RechargeScreenProps = {
  navigation: RechargeScreenNavigationProp;
  route: RechargeScreenRouteProp;

  cart: CartModelState;
  order: OrderModelState;
  account: AccountModelState;

  pending: boolean;

  action: {
    order: OrderAction;
    cart: CartAction;
  };
};

type RechargeScreenState = {
  selected: string;
};

const {esimApp} = Env.get();

class RechargeScreen extends Component<
  RechargeScreenProps,
  RechargeScreenState
> {
  constructor(props: RechargeScreenProps) {
    super(props);

    // recharge 상품의 SKU는 'rch-{amount}' 형식을 갖는다.
    this.state = {
      selected: 'rch-5000',
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onPress = this.onPress.bind(this);
    this.rechargeButton = this.rechargeButton.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('recharge')} />,
    });
  }

  componentWillUnmount() {
    // 보완 필요
    const {iccid, token} = this.props.account;
    if (iccid && token) {
      this.props.action.order.getSubs({iccid, token});
    }
  }

  onSubmit() {
    const {selected} = this.state;
    const purchaseItems = [
      {
        key: 'rch',
        type: 'rch',
        title: `${utils.numberToCommaString(
          utils.stringToNumber(selected),
        )} ${i18n.t('sim:rechargeBalance')}`,
        price: utils.stringToNumber(selected),
        qty: 1,
        sku: selected,
      },
    ];

    this.props.action.cart.purchase({purchaseItems});
    this.props.navigation.navigate('PymMethod', {
      pymPrice: utils.stringToNumber(selected),
      mode: 'recharge',
    });
  }

  onPress = (key: string) => () => {
    this.setState({
      selected: key,
    });
  };

  rechargeButton(value: number[]) {
    const {selected} = this.state;

    return (
      <View key={`${value[0]}`} style={styles.row}>
        {value.map((v) => {
          const key = `rch-${v}`;
          const checked = key === selected;
          const color = checked ? colors.clearBlue : colors.warmGrey;

          return (
            <TouchableOpacity
              key={key}
              onPress={this.onPress(key)}
              style={[
                styles.button,
                {borderColor: checked ? colors.clearBlue : colors.lightGrey},
              ]}>
              <View style={styles.buttonBox}>
                <Text style={[styles.buttonText, {color}]}>
                  {utils.numberToCommaString(v)}
                </Text>
                <Text style={[appStyles.normal14Text, {color}]}>
                  {i18n.t('won')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  render() {
    const {iccid = '', balance, simCardImage} = this.props.account;
    const {selected} = this.state;
    const seg = [0, 5, 10, 15].map((v) => iccid.substring(v, v + 5));
    const amount = [
      [5000, 10000],
      [15000, 20000],
      [25000, 30000],
    ];

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {esimApp ? (
            <View style={styles.rechargeBox}>
              <ImageBackground
                source={require('../assets/images/esim/card.png')}
                style={styles.image}>
                <View style={styles.iconWithText}>
                  <AppIcon
                    style={{width: '100%', justifyContent: 'flex-end'}}
                    name="rokIcon"
                  />
                  <View style={styles.rchTextBox}>
                    <Text style={appStyles.normal14Text}>
                      {i18n.t('acc:remain')}
                    </Text>
                    <Text
                      style={
                        appStyles.bold30Text
                      }>{`${utils.numberToCommaString(balance)}${i18n.t(
                      'won',
                    )}`}</Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          ) : (
            <View>
              <Image
                style={styles.card}
                source={{uri: API.default.httpImageUrl(simCardImage)}}
                resizeMode="contain"
              />
              <View style={styles.iccidBox}>
                <Text style={styles.iccidTitle}>{i18n.t('rch:iccid')}</Text>
                <View style={styles.iccidRow}>
                  {seg.map((s, i) => [
                    <Text key={i} style={styles.iccid}>
                      {s}
                    </Text>,
                    i < 3 ? <Text key={`${i}-`}>-</Text> : null,
                  ])}
                </View>
                <LabelText
                  label={i18n.t('sim:remainingBalance')}
                  style={{marginTop: 15}}
                  value={balance}
                  format="price"
                  color={colors.clearBlue}
                />
              </View>
            </View>
          )}

          <View style={[styles.divider, esimApp && {marginTop: 20}]} />
          <View style={{flex: 1}} />
          <Text
            style={[appStyles.normal16Text, {marginTop: 30, marginLeft: 40}]}>
            {i18n.t('rch:amount')}
          </Text>
          <View style={{marginBottom: 40}}>
            {amount.map((v: number[]) => this.rechargeButton(v))}
          </View>
        </ScrollView>
        <AppButton
          title={i18n.t('rch:recharge')}
          titleStyle={appStyles.confirmText}
          disabled={_.isEmpty(selected)}
          onPress={this.onSubmit}
          style={styles.confirm}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account}: RootState) => ({account, auth: accountActions.auth(account)}),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(RechargeScreen);
