import React, {Component} from 'react';
import {StyleSheet, View, FlatList, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import i18n from '../utils/i18n';
import _ from 'underscore';
import AppActivityIndicator from '../components/AppActivityIndicator';
import AppButton from '../components/AppButton';
import * as simActions from '../redux/modules/sim';
import * as accountActions from '../redux/modules/account';
import * as cartActions from '../redux/modules/cart';
import SimCard from '../components/SimCard';
import {bindActionCreators} from 'redux';
import AppBackButton from '../components/AppBackButton';
import {appStyles} from '../constants/Styles';
import {colors} from '../constants/Colors';
import ChargeSummary from '../components/ChargeSummary';
import utils from '../utils/utils';
import Analytics from 'appcenter-analytics';
class NewSimScreen extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          navigation={this.props.navigation}
          title={i18n.t('sim:purchase')}
        />
      ),
    });

    this.state = {
      querying: false,
      total: {cnt: 0, price: 0},
      checked: new Map(),
      simPrice: new Map(),
      simQty: new Map(),
    };

    this._onChangeQty = this._onChangeQty.bind(this);
    this._onPress = this._onPress.bind(this);
    this._getTotal = this._getTotal.bind(this);
    this._init = this._init.bind(this);
  }

  componentDidMount() {
    Analytics.trackEvent('Page_View_Count', {page: 'Purchase New Sim'});
    this._init();
  }

  componentDidUpdate(prevProps) {
    // if ( this.props.sim.simList != prevProps.sim.simList) {
    //   this._init()
    // }
  }
  // key value array로 리턴해서 합쳐야 함 - array로 맵을 초기화 할 수 있음

  _init() {
    const {simList} = this.props.sim;
    this.setState({
      checked: new Map(
        simList.reduce(
          (acc, cur) => ({
            ...acc,
            [cur.key]: false,
          }),
          {},
        ),
      ),
      simQty: new Map(
        simList.reduce(
          (acc, cur) => ({
            ...acc,
            [cur.key]: 0,
          }),
          {},
        ),
      ),
      simPrice: new Map(
        simList.reduce(
          (acc, cur) => ({
            ...acc,
            [cur.key]: 0,
          }),
          {},
        ),
      ),
      total: {
        cnt: 0,
        price: 0,
      },
    });
  }

  _onChangeQty(key, qty) {
    const simQty = this.state.simQty.set(key, qty),
      checked = this.state.checked.set(key, qty > 0),
      simPrice = this.state.simPrice.set(
        key,
        this.props.sim.simList.filter(item => item.key == key || false)[0]
          .price * qty,
      );

    // update qty
    this.setState({
      checked,
      simQty,
      simPrice,
      total: this._getTotal(checked, simQty),
    });
  }

  _onPress = mode => () => {
    const {loggedIn, balance} = this.props.account;
    const {checked, simQty} = this.state;

    if (!loggedIn) {
      this.props.navigation.navigate('Auth');
    } else {
      const simList = this.props.sim.simList
        .filter(item => checked.get(item.uuid) && simQty.get(item.uuid) > 0)
        .map(item => ({
          title: item.name,
          key: item.uuid,
          variationId: item.variationId,
          sku: item.sku,
          price: item.price,
          qty: simQty.get(item.uuid),
          type: 'sim_card',
        }));

      if (simList.length > 0) {
        this.props.action.cart.purchase({
          purchaseItems: simList,
          dlvCost: true,
          balance,
        });
        this.props.navigation.navigate('PymMethod', {mode: 'New Sim'});
      }
    }
  };

  _onChecked(key) {
    const checked = this.state.checked.update(key, value => !value),
      simQty = this.state.simQty.update(key, value => value || 1),
      simPrice = this.state.simPrice.update(
        key,
        value =>
          value ||
          this.props.sim.simList.filter(item => item.key == key || false)[0]
            .price,
      );

    this.setState({
      checked,
      simQty,
      simPrice,
      total: this._getTotal(checked, simQty),
    });
  }

  _renderItem = ({item, index}) => {
    const {simQty, simPrice} = this.state;

    return (
      <SimCard
        onChange={value => this._onChangeQty(item.key, value)}
        checked={this.state.checked.get(item.key) || false}
        onChecked={() => this._onChecked(item.key)}
        qty={simQty.get(item.uuid)}
        simPrice={simPrice.get(item.uuid)}
        last={index == this.props.sim.simList.length - 1}
        {...item}
      />
    );
  };

  _getTotal(checked, simQty) {
    return this.props.sim.simList
      .filter(item => checked.get(item.key) || false)
      .map(item => ({
        qty: simQty.get(item.key) || 0,
        checked: checked.get(item.key) || false,
        price: item.price,
      }))
      .reduce(
        (acc, cur) => ({
          cnt: acc.cnt + cur.qty,
          price: acc.price + cur.qty * cur.price,
        }),
        {cnt: 0, price: 0},
      );
  }

  render() {
    const {querying, checked, simQty, total, simPrice} = this.state,
      {simList} = this.props.sim,
      selected =
        simList.findIndex(
          item => checked.get(item.key) && simQty.get(item.key) > 0,
        ) >= 0;

    return (
      <SafeAreaView
        style={styles.container}
        style={styles.container}
        forceInset={{top: 'never', bottom: 'always'}}>
        <AppActivityIndicator visible={querying} />
        <FlatList
          data={simList}
          renderItem={this._renderItem}
          extraData={[checked, simQty, simPrice]}
          ListFooterComponent={
            <ChargeSummary
              totalCnt={total.cnt}
              totalPrice={total.price}
              balance={this.props.account.balance}
              dlvCost={utils.dlvCost(total.price)}
              simList={simList}
            />
          }
        />
        <AppButton
          style={styles.btnBuy}
          title={i18n.t('cart:buy')}
          disabled={!selected}
          onPress={this._onPress('purchase')}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  btnBuy: {
    width: '100%',
    height: 52,
    backgroundColor: colors.clearBlue,
  },
});

const mapStateToProps = state => ({
  sim: state.sim.toJS(),
  account: state.account.toJS(),
});

export default connect(
  mapStateToProps,
  dispatch => ({
    action: {
      sim: bindActionCreators(simActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(NewSimScreen);
