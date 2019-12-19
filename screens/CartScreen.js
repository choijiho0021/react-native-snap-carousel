import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';
import {connect} from 'react-redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import * as cartActions from '../redux/modules/cart'
import * as accountActions from '../redux/modules/account'
import AppButton from '../components/AppButton'
import AppActivityIndicator from '../components/AppActivityIndicator'
import { bindActionCreators } from 'redux'
import { colors } from '../constants/Colors';
import CartItem from '../components/CartItem';
import ChargeSummary from '../components/ChargeSummary';
import { SafeAreaView } from 'react-navigation'
import utils from '../utils/utils';
import {Map} from 'immutable'
import _ from 'underscore'
import AppBackButton from '../components/AppBackButton';

class CartScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('cart')} back="lastTab"/>
  })

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      checked: undefined,
      querying: false,
      qty: undefined,
      total: {cnt:0, price:0},
    }

    this._onPurchase = this._onPurchase.bind(this)
    this._onChangeQty = this._onChangeQty.bind(this)
    this._calculate = this._calculate.bind(this)
    this._init = this._init.bind(this)
  }

  componentDidMount() {
    this._init()
  }

  componentDidUpdate(prevProps) {
    const { cart, pending } = this.props

    if ( cart && cart != prevProps.cart && cart.orderItems && ! pending ) {
      this._init()
    }
  }

  _init() {
    const { orderItems } = this.props.cart
    const qty = new Map(orderItems.reduce((acc,cur) => ({
        ... acc,
        [cur.key] : cur.qty
      }), {})),
      checked = new Map(orderItems.reduce((acc,cur) => ({
        ... acc,
        [cur.key] : true
      }), {})),
      total = orderItems.reduce((acc,cur) => ({
        cnt: acc.cnt+ cur.qty, 
        price: acc.price + cur.qty * cur.price
      }), {cnt: 0, price:0})

    this.setState({
      qty, checked, total,
      data : orderItems,
    })
  }

  _dlvCost( checked, qty, total, data) {
    return data.findIndex(item => item.type == 'sim_card' && checked.get(item.key) && qty.get(item.key) > 0) >= 0 ? 
      utils.dlvCost(total.price) : 0
  }

  _onChangeQty(uuid, cnt) {
    const qty = this.state.qty.set(uuid, cnt),
      checked = this.state.checked.set(uuid, true),
      total = this._calculate( checked, qty)

    this.setState({
      qty, checked, total,
    })
  }

  _onPurchase() {
    const { data, qty, checked, total } = this.state,
      dlvCost = this._dlvCost( checked, qty, total, data),
      {loggedIn} = this.props.account

    if(!loggedIn){
      this.props.navigation.navigate('Auth')
    }
    else {
      const purchaseItems = data.filter(item => checked.get(item.key) && qty.get(item.key) > 0)
        .map(item => ({
          ... item,
          sku: item.prod.sku,
          qty: qty.get(item.key)
        }))

      this.props.action.cart.purchase({purchaseItems, dlvCost: dlvCost > 0})
      this.props.navigation.navigate('PymMethod')
    }
  }

  _onChecked(uuid) {
    const checked = this.state.checked.update( uuid, value => ! value),
      total = this._calculate( checked, this.state.qty)

    this.setState({
      checked, total,
    })
  }

  _renderItem = ({item}) => {
    const { qty } = this.state
    const prod = (item.type == 'sim_card') ?
      this.props.sim.simList.find(sim => sim.uuid == item.key) : 
      this.props.product.prodList.find(p => p.uuid == item.key)

    return <CartItem checked={this.state.checked.get(item.key) || false}
      onChange={(value) => this._onChangeQty(item.key, value)} 
      onDelete={() => this._onChangeQty(item.key, -1)}
      onChecked={() => this._onChecked(item.key)}
      name={item.title}
      price={item.price}
      image={prod && prod.imageUrl}
      qty={qty.get(item.key)} />

  }

  _calculate( checked, qty) {
    return this.state.data.filter(item => checked.get(item.key))
      .map(item => ({
        qty: Math.max( qty.get(item.key), 0), 
        price: item.price
      })).reduce((acc,cur) => ({
        cnt: acc.cnt+ cur.qty, 
        price: acc.price + cur.qty * cur.price
      }), {cnt: 0, price:0})
  }


  render() {
    const { querying, qty, checked, data, total} = this.state,
      list = data.filter(item => qty.get(item.key) >= 0),
      dlvCost = this._dlvCost( checked, qty, total, data)

    return (
      <SafeAreaView style={styles.container}>
        <AppActivityIndicator visible={querying} />

        <FlatList data={list}
          renderItem={this._renderItem} 
          extraData={[qty, checked]}
          ListFooterComponent={ <ChargeSummary totalCnt={total.cnt} totalPrice={total.price} dlvCost={dlvCost}/>} />

        <AppButton style={styles.btnBuy} title={i18n.t('cart:purchase')} 
          disabled={data.length == 0}
          onPress={this._onPurchase}/>

      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  sectionTitle: {
    ... appStyles.subTitle,
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch"
  },
  btnBuy: {
    justifyContent:'flex-end',
    height: 52,
    backgroundColor: colors.clearBlue
  },
  btnBuyText: {
    ... appStyles.normal16Text,
    textAlign: "center",
    color: "#ffffff"
  },
  delete : {
    paddingVertical: 12,
    width: "10%"
  },
  buttonBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%"
  },
  button: {
    ... appStyles.button,
    width: 100,
    alignSelf: "center"
  }
});

const mapStateToProps = (state) => ({
  sim: state.sim.toJS(),
  product: state.product.toJS(),
  cart: state.cart.toJS(),
  account : state.account.toJS(),
  pending: state.pender.pending[cartActions.CART_ADD] || 
    state.pender.pending[cartActions.CART_UPDATE] || 
    state.pender.pending[cartActions.CART_REMOVE] || false,
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action:{
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch)
    }
  })
)(CartScreen)