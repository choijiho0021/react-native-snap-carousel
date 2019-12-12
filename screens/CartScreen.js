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

class CartScreen extends Component {
  static navigationOptions = {
    headerLeft: (
      <Text style={[appStyles.title, {marginLeft:22}]}>{i18n.t('cart')}</Text>
    ),
  }

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      checked: new Map(),
      querying: false,
      qty: new Map(),
      total: { cnt:0, price:0}
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
    const { cart} = this.props

    this.setState({
      qty: new Map(cart.orderItems.reduce((acc,cur) => ({
        ... acc,
        [cur.prod.uuid] : cur.qty
      }), {})),
      checked: new Map(cart.orderItems.reduce((acc,cur) => ({
        ... acc,
        [cur.prod.uuid] : true
      }), {})),
      data : cart.orderItems,
      total: cart.orderItems.reduce((acc,cur) => ({
        cnt: acc.cnt+ cur.qty, 
        price: acc.price + cur.qty * cur.price
      }), {cnt: 0, price:0})
    })
  }

  _onChangeQty(uuid, cnt) {
    const qty = this.state.qty.set(uuid, cnt),
      checked = this.state.checked.set(uuid, true) 

    this.setState({
      qty, checked,
      total: this._calculate( checked, qty)
    })
  }

  _onPurchase() {
    const { data, qty, checked, total} = this.state
    const {loggedIn} = this.props.account

    if(!loggedIn){
      // AppAlert.confirm(i18n.t('error'),i18n.t('err:login'), {
      //   ok: () => this.props.navigation.navigate('Home')
      // })
      this.props.navigation.navigate('RegisterMobile')
    }
    else {
      // remove items from cart
      /*
      cart.orderItems.forEach(item => {
        const itemQty = qty.get(item.prod.uuid)
        if ( item.qty != itemQty) {
          console.log('qty changed', item)

          if ( itemQty < 0) this.props.action.cart.cartRemove( cart.orderId, item.orderItemId)
          else this.props.action.cart.cartUpdate( cart.orderId, item.orderItemId, itemQty)
        }
      })
      */

      const pymReq = [
        {
          key: 'total',
          title: i18n.t('sim:rechargeAmt'),
          amount: total.price
        },      
        {
          key: 'dlvCost',
          title: i18n.t('cart:dlvCost'),
          amount: utils.dlvCost(total.price)
        }
      ]

      const purchaseItems = data.map(item => ({
        ... item, 
        qty: checked.get(item.key) && qty.get(item.key)
      })).filter(item => item.qty > 0)

      console.log('cart', pymReq, purchaseItems, data, qty.toJS())

      this.props.navigation.navigate('PymMethod', {pymReq, purchaseItems})
    }
  }

  _onChecked(uuid) {
    const checked = this.state.checked.update( uuid, value => ! value)
    this.setState({
      checked,
      total: this._calculate( checked, this.state.qty)
    })
  }

  _renderItem = ({item}) => {
    const { qty } = this.state
    const prod = ( item.prod.type == 'sim_card') ?
      this.props.sim.simList.find(sim => sim.uuid == item.prod.uuid) : undefined

    return <CartItem checked={this.state.checked.get(item.key) || false}
      onChange={(value) => this._onChangeQty(item.key, value)} 
      onDelete={() => this._onChangeQty(item.key, -1)}
      onChecked={() => this._onChecked(item.key)}
      name={item.title}
      price={item.price}
      image={prod && prod.image}
      qty={qty.get(item.prod.uuid)} />

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
    const { querying, qty, checked, data, total} = this.state

    return (
      <SafeAreaView style={styles.container}>
        <AppActivityIndicator visible={querying} />
        <FlatList data={data.filter(item => qty.get(item.key) >= 0)}
          renderItem={this._renderItem} 
          extraData={[qty, checked]}
          ListFooterComponent={ <ChargeSummary totalCnt={total.cnt} totalPrice={total.price}/>} />
        <AppButton style={styles.btnBuy} title={i18n.t('cart:purchase')} 
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