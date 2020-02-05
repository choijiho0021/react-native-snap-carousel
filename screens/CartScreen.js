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
import { isDeviceSize } from '../constants/SliderEntry.style';

const sectionTitle = ['sim', 'product']

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
    this._isEmptyList = this._isEmptyList.bind(this)
    this._sim = this._sim.bind(this)
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

  _section( ... args) {
    return args.map((item,idx) => ({
      title: sectionTitle[idx],
      data: item
    })).filter(item => item.data.length > 0)
  }

  _init() {
    const { orderItems } = this.props.cart
    let {qty, checked, section} = this.state
    const total = this._calculate( checked, qty),
      list = orderItems.reduce((acc,cur) => {
        return cur.type == 'sim_card' ? [ acc[0].concat([cur]), acc[1] ] : [ acc[0], acc[1].concat([cur])]
      }, [[], []])

    this.setState({
      total,
      section : this._section( list[0], list[1])
    })

    orderItems.forEach(item => {
      qty = qty.set(item.key, item.qty)
      checked = checked.update(item.key, value => (typeof value === 'undefined') ? true : value)
    })

    this.setState({
      qty, checked
    })
    
  }

  _dlvCost( checked, qty, total, section) {
    const simList = section.find(item => item.title == 'sim')
    return simList && simList.data.findIndex(item => checked.get(item.key) && qty.get(item.key) > 0) >= 0 ? 
      utils.dlvCost(total.price) : 0
  }

  _onChangeQty(key, orderItemId, cnt) {
    const qty = this.state.qty.set(key, cnt),
      checked = this.state.checked.set(key, true),
      total = this._calculate( checked, qty)

    this.setState({
      qty, checked, total
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
      {loggedIn, balance} = this.props.account
      
    if(!loggedIn){
      this.props.navigation.navigate('Auth')
    }
    else {
      const purchaseItems = section.reduce((acc,cur) => acc.concat(cur.data.filter(item => checked.get(item.key) && qty.get(item.key) > 0)), [])
        .map(item => ({
          ... item,
          sku: item.prod.sku,
          qty: qty.get(item.key)
        }))

      this.props.action.cart.purchase({purchaseItems, dlvCost: dlvCost > 0, balance})
      this.props.navigation.navigate('PymMethod')

    }
  }

  _onChecked(key) {

    const checked = this.state.checked.update( key, value => ! value),
      { qty, section } = this.state,
      total = this._calculate( checked, qty)

      this.setState({
        total, checked
      })
  }

  _sim(){
    return this.props.cart.orderItems.filter(item => item.prod.type == 'sim_card' && this.state.checked.get(item.key) && this.state.qty.get(item.key))
            .map(item=> item.totalPrice).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  }

  _removeItem(key, orderItemId) {
    const section = this.state.section.map(item => ({
        title: item.title,
        data: item.data.filter(i => i.orderItemId != orderItemId)
      })),
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

    return section.reduce((acc,cur) => acc.concat(cur.data.filter(item => checked.get(item.key) !== false)), [])
      .map(item => ({
        qty: Math.max(0, qty.get(item.key)),
        price: item.price
      })).reduce((acc,cur) => ({
        cnt: acc.cnt+ cur.qty, 
        price: acc.price + cur.qty * cur.price
      }), {cnt: 0, price:0})
  }

  _isEmptyList(){
      return <View style={styles.emptyView}>
                <Text style={styles.emptyText}>{i18n.t('cart:empty')}</Text>
            </View>
  }

  render() {

    const { qty, checked, section, total} = this.state,
      dlvCost = this._dlvCost( checked, qty, total, section),
      balance = this.props.account.balance || 0,
      amount = total.price + dlvCost,
      pymPrice = amount > balance ? amount - balance : 0      

      return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom:"always"}}>

        <SectionList 
          sections={section}
          renderItem={this._renderItem} 
          extraData={[qty, checked]}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={this._isEmptyList}
          ListFooterComponent={ <ChargeSummary totalCnt={total.cnt} 
                                              totalPrice={total.price} 
                                              balance={balance} 
                                              dlvCost={dlvCost}/>} />
        <View style={styles.buttonBox}>
          <View style={styles.sumBox}>
            <Text style={[styles.btnBuyText, {color:colors.black}]}>{i18n.t('sum') + ': '}</Text>
            <Text style={[styles.btnBuyText, {color:colors.black}]}>{utils.numberToCommaString(pymPrice)}</Text>
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
  },
  emptyView: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    height: isDeviceSize('small') ? 200 : 450
  },
  emptyText: {
    alignSelf: 'center'
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