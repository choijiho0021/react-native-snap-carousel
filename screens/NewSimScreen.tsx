import React, {Component} from 'react';
import {StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {Map as ImmutableMap} from 'immutable';

import _ from 'underscore';
import {bindActionCreators} from 'redux';
import Analytics from 'appcenter-analytics';
import {RootState} from '@/redux';
import i18n from '../utils/i18n';
import AppActivityIndicator from '../components/AppActivityIndicator';
import AppButton from '../components/AppButton';
import * as simActions from '../redux/modules/sim';
import * as accountActions from '../redux/modules/account';
import * as cartActions from '../redux/modules/cart';
import SimCard from '../components/SimCard';
import AppBackButton from '../components/AppBackButton';
import {colors} from '../constants/Colors';
import ChargeSummary from '../components/ChargeSummary';
import utils from '@/submodules/rokebi-utils/utils';

interface NewSimScreenProps {
  account: accountActions.AccountModelState;
  sim: simActions.SimModelState;
  navigation: any;
}

interface NewSimScreenState {
  querying: boolean;
  total: {cnt: number; price: number};
  checked: ImmutableMap<string, boolean>;
  simPrice: ImmutableMap<string, number>;
  simQty: ImmutableMap<string, number>;
}
class NewSimScreen extends Component<NewSimScreenProps, NewSimScreenState> {
  constructor(props) {
    super(props);

    this.state = {
      querying: false,
      total: {cnt: 0, price: 0},
      checked: ImmutableMap(),
      simPrice: ImmutableMap(),
      simQty: ImmutableMap(),
    };

    this.onChangeQty = this.onChangeQty.bind(this);
    this.onPress = this.onPress.bind(this);
    this.updateTotal = this.updateTotal.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          navigation={this.props.navigation}
          title={i18n.t('sim:purchase')}
        />
      ),
    });

    Analytics.trackEvent('Page_View_Count', {page: 'Purchase New Sim'});
    this.init();
  }

  componentDidUpdate(
    prevProps: NewSimScreenProps,
    prevState: NewSimScreenState,
  ) {
    const {checked, simQty} = this.state;
    if (prevState.checked !== checked || prevState.simQty !== simQty) {
      // state update되면 total을 갱신한다.
      this.updateTotal();
    }
  }

  onChangeQty(key: string, qty: number) {
    // update qty
    this.setState(({simQty, checked, simPrice}) => ({
      checked: checked.set(key, qty > 0),
      simQty: simQty.set(key, qty),
      simPrice: simPrice.set(
        key,
        this.props.sim.simList.filter((item) => item.key === key || false)[0]
          .price * qty,
      ),
    }));
  }

  onPress = (mode) => () => {
    const {loggedIn, balance} = this.props.account;
    const {checked, simQty} = this.state;

    if (!loggedIn) {
      this.props.navigation.navigate('Auth');
    } else {
      const simList = this.props.sim.simList
        .filter((item) => checked.get(item.uuid) && simQty.get(item.uuid) > 0)
        .map((item) => ({
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

  onChecked(key: string) {
    this.setState(({checked, simQty, simPrice}) => ({
      checked: checked.update(key, (value) => !value),
      simQty: simQty.update(key, (value) => value || 1),
      simPrice: simPrice.update(
        key,
        (value) =>
          value ||
          this.props.sim.simList.filter((item) => item.key === key || false)[0]
            .price,
      ),
    }));
  }

  updateTotal() {
    this.setState(({checked, simQty}) => ({
      total: this.props.sim.simList
        .filter((item) => checked.get(item.key) || false)
        .map((item) => ({
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
        ),
    }));
  }

  renderItem = ({item, index}) => {
    const {simQty, simPrice, checked} = this.state;

    return (
      <SimCard
        onChange={(value) => this.onChangeQty(item.key, value)}
        checked={checked.get(item.key) || false}
        onChecked={() => this.onChecked(item.key)}
        qty={simQty.get(item.uuid)}
        simPrice={simPrice.get(item.uuid)}
        last={index === this.props.sim.simList.length - 1}
        {...item}
      />
    );
  };

  // key value array로 리턴해서 합쳐야 함 - array로 맵을 초기화 할 수 있음
  init() {
    const {simList} = this.props.sim;
    const checked = ImmutableMap(
      simList.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.key]: false,
        }),
        {},
      ),
    );

    this.setState({
      checked,
      simQty: checked.map(() => 0),
      simPrice: checked.map(() => 0),
      total: {
        cnt: 0,
        price: 0,
      },
    });
  }

  render() {
    const {querying, checked, simQty, total, simPrice} = this.state;
    const {simList} = this.props.sim;
    const selected =
      simList.findIndex(
        (item) => checked.get(item.key) && simQty.get(item.key) > 0,
      ) >= 0;

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'never', bottom: 'always'}}>
        <AppActivityIndicator visible={querying} />
        <FlatList
          data={simList}
          renderItem={this.renderItem}
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
          onPress={this.onPress('purchase')}
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

export default connect(
  ({account, sim}: RootState) => ({sim, account}),
  (dispatch) => ({
    action: {
      sim: bindActionCreators(simActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(NewSimScreen);
