import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';

import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import * as cartActions from '../redux/modules/cart';
import * as orderActions from '../redux/modules/order';
import {actions as accountActions} from '../redux/modules/account';
import utils from '@/submodules/rokebi-utils/utils';
import {bindActionCreators} from 'redux';
import {colors} from '../constants/Colors';
import LabelText from '../components/LabelText';
import AppButton from '../components/AppButton';
import _ from 'underscore';
import AppBackButton from '../components/AppBackButton';
import {isDeviceSize} from '../constants/SliderEntry.style';
import {API} from 'RokebiESIM/submodules/rokebi-utils';
import {RootState} from '@/redux';

class RechargeScreen extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          navigation={this.props.navigation}
          title={i18n.t('recharge')}
        />
      ),
    });

    // recharge 상품의 SKU는 'rch-{amount}' 형식을 갖는다.
    this.state = {
      selected: 'rch-5000',
    };

    this._onSubmit = this._onSubmit.bind(this);
    this._onPress = this._onPress.bind(this);
    this._rechargeButton = this._rechargeButton.bind(this);
  }

  componentWillUnmount() {
    // 보완 필요
    const iccid = this.props.account.iccid,
      auth = this.props.auth;
    if (iccid && auth) {
      this.props.action.order.getSubs(iccid, auth);
    }
  }

  _onSubmit() {
    const mode = this.props.route.params && this.props.route.params.mode;
    const {selected} = this.state,
      purchaseItems = [
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
      mode: mode + 'Recharge',
    });
  }

  _onPress = (key) => () => {
    this.setState({
      selected: key,
    });
  };

  _rechargeButton(value) {
    const {selected} = this.state;

    return (
      <View key={value[0] + ''} style={styles.row}>
        {value.map((v) => {
          const key = `rch-${v}`,
            checked = key == selected,
            color = checked ? colors.clearBlue : colors.warmGrey;

          return (
            <TouchableOpacity
              key={key}
              onPress={this._onPress(key)}
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

    console.log('image22222', API.default.httpImageUrl(simCardImage));
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'never', bottom: 'always'}}>
        <ScrollView>
          <Image
            style={styles.card}
            source={{uri: API.default.httpImageUrl(simCardImage)}}
            resizeMode="contain"
          />
          <View style={styles.iccidBox}>
            <Text style={styles.iccidTitle}>ICCID</Text>
            <View style={styles.iccidRow}>
              {seg.map((s, i) => [
                <Text key={i} style={styles.iccid}>
                  {s}
                </Text>,
                i < 3 ? <Text key={i + '-'}>-</Text> : null,
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
          <View style={styles.divider} />
          <View style={{flex: 1}} />
          <View style={{marginBottom: 40}}>
            {amount.map((v) => this._rechargeButton(v))}
          </View>
        </ScrollView>
        <AppButton
          title={i18n.t('rch:recharge')}
          titleStyle={appStyles.confirmText}
          disabled={_.isEmpty(selected)}
          onPress={this._onSubmit}
          style={styles.confirm}
        />
      </SafeAreaView>
    );
  }
}

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
});

export default connect(
  ({account}: RootState) => ({account, auth: accountActions.auth(account)}),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(RechargeScreen);
