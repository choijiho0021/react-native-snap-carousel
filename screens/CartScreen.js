import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SectionList
} from 'react-native';
import {connect} from 'react-redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import * as cartActions from '../redux/modules/cart'
import * as accountActions from '../redux/modules/account'
import AppButton from '../components/AppButton'
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
      section: this._section([], []),
      checked: new Map(),
      qty: new Map(),
      total: {cnt:0, price:0},
    }

    this._onPurchase = this._onPurchase.bind(this)
    this._onChangeQty = this._onChangeQty.bind(this)
    this._removeItem = this._removeItem.bind(this)
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

  _section( simList, prodList) {
    return [
      {
        title : 'sim',
        data: simList
      }, 
      {
        title : 'product',
        data: prodList
      } 
    ]
  }

  _init() {
    const { orderItems } = this.props.cart
    let {qty, checked} = this.state
    const total = this._calculate( checked, qty),
      list = orderItems.reduce((acc,cur) => {
        return cur.type == 'sim_card' ? [ acc[0].concat([cur]), acc[1] ] : [ acc[0], acc[1].concat([cur])]
      }, [[], []])

    this.setState({
      total,
      section : this._section( list[0], list[1])
    })

    orderItems.forEach(item => {
      qty = qty.update(item.key, value => value || item.qty)
      checked = checked.update(item.key, value => (typeof value === 'undefined') ? true : value)
    })

    this.setState({
      qty, checked
    })
  }

  _dlvCost( checked, qty, total, section) {
    return section[0].data.findIndex(item => checked.get(item.key) && qty.get(item.key) > 0) >= 0 ? 
      utils.dlvCost(total.price) : 0
  }

  _onChangeQty(key, orderItemId, cnt) {
    const qty = this.state.qty.set(key, cnt),
      checked = this.state.checked.set(key, true),
      total = this._calculate( checked, qty)

    this.setState({
      qty, checked, total,
    })

    if ( orderItemId) {
      if ( this.cancelUpdate) {
        this.cancelUpdate()
        this.cancelUpdate = null
      }

      const cartUpdateQty = this.props.action.cart.cartUpdateQty({
        orderId: this.props.cart.orderId, 
        orderItemId,
        qty: cnt, 
        abortController: new AbortController()
      })

      this.cancelUpdate = cartUpdateQty.cancel
      cartUpdateQty.catch( err => {
        console.log('cancel2', err)
      })
    }
  }

  _onPurchase() {
    const { section, qty, checked, total } = this.state,
      dlvCost = this._dlvCost( checked, qty, total, section),
      {loggedIn} = this.props.account

    if(!loggedIn){
      this.props.navigation.navigate('Auth')
    }
    else {
      const purchaseItems = (section[0].data.concat(section[1].data))
        .filter(item => checked.get(item.key) && qty.get(item.key) > 0)
        .map(item => ({
          ... item,
          sku: item.prod.sku,
          qty: qty.get(item.key)
        }))

      this.props.action.cart.purchase({purchaseItems, dlvCost: dlvCost > 0})
      this.props.navigation.navigate('PymMethod')
    }
  }

  _onChecked(key) {
    const checked = this.state.checked.update( key, value => ! value),
      total = this._calculate( checked, this.state.qty)

    this.setState({
      total, checked
    })
  }

  _removeItem(key, orderItemId) {
    const section = this._section( 
        this.state.section[0].data.filter(item => item.orderItemId != orderItemId), 
        this.state.section[1].data.filter(item => item.orderItemId != orderItemId)),
      data = this.state.data.filter(item => item.orderItemId != orderItemId),
      checked = this.state.checked.remove( key),
      qty = this.state.qty.remove(key),
      total = this._calculate( checked, qty, section)

    this.setState({
      total, checked, qty, section
    })

    if ( orderItemId) {
      this.props.action.cart.cartRemove({
        orderId: this.props.cart.orderId, 
        orderItemId,
      })
    }
  }

  _renderItem = ({item}) => {
    const { qty, checked } = this.state
    const prod = (item.type == 'sim_card') ?
      this.props.sim.simList.find(sim => sim.uuid == item.key) : 
      this.props.product.prodList.find(p => p.uuid == item.key)

    return <CartItem checked={checked.get(item.key) || false}
      onChange={(value) => this._onChangeQty(item.key, item.orderItemId, value)} 
      onDelete={() => this._removeItem(item.key, item.orderItemId)}
      onChecked={() => this._onChecked(item.key)}
      name={item.title}
      price={item.price}
      image={prod && prod.imageUrl}
      qty={qty.get(item.key)} />

  }

  _calculate( checked, qty, section = this.state.section) {
    // 초기 기동시에는 checked = new Map() 으로 선언되어 있어서
    // checked.get() == undefined를 반환할 수 있다. 
    // 따라서, checked.get() 값이 false인 경우(사용자가 명확히 uncheck 한 경우)에만 계산에서 제외한다. 

    const list = section[0].data.concat(section[1].data)
    return list.filter(item => checked.get(item.key) !== false)
      .map(item => ({
        qty: Math.max(0, qty.get(item.key)),
        price: item.price
      })).reduce((acc,cur) => ({
        cnt: acc.cnt+ cur.qty, 
        price: acc.price + cur.qty * cur.price
      }), {cnt: 0, price:0})
  }


  render() {
    const { qty, checked, section, total} = this.state,
      dlvCost = this._dlvCost( checked, qty, total, section)

    return (
      <SafeAreaView style={styles.container}>

        <SectionList 
          sections={section}
          renderItem={this._renderItem} 
          extraData={[qty, checked]}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.header, {marginTop: title == 'sim' ? 20 : 30}]}>{i18n.t(title)}</Text>
          )}
          ListFooterComponent={ <ChargeSummary totalCnt={total.cnt} totalPrice={total.price} dlvCost={dlvCost}/>} />

        <View style={styles.buttonBox}>
          <View style={styles.sumBox}>
            <Text style={[styles.btnBuyText, {color:colors.black}]}>{i18n.t('sum') + ': '}</Text>
            <Text style={appStyles.roboto16Text}>{utils.numberToCommaString(total.price)}</Text>
            <Text style={[styles.btnBuyText, {color:colors.black}]}>{i18n.t('won')}</Text>
          </View>
          <AppButton style={styles.btnBuy} title={i18n.t('cart:purchase') + `(${total.cnt})`} 
            disabled={total.price == 0}
            onPress={this._onPurchase}/>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    ... appStyles.bold18Text,
    color: colors.black,
    marginTop: 30,
    marginLeft: 20
  },
  sumBox : {
    flexDirection:'row', 
    justifyContent:'center',
    marginHorizontal: 30
  },
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
    flex: 1,
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
    flexDirection: "row",
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 52,
    borderTopColor: colors.lightGrey,
    borderTopWidth: 1
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