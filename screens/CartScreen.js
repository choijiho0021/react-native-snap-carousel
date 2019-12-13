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
import AppAlert from '../components/AppAlert';

class CartScreen extends Component {
  static navigationOptions = {
    headerLeft: (
      <Text style={[appStyles.title, {marginLeft:22}]}>{i18n.t('cart')}</Text>
    ),
  }

  constructor(props) {
    super(props)

    const {cart} = this.props
    this.state = {
      data: [],      
      // qty: cart.orderItems.reduce((acc,cur) => ({
      //   ... acc,
      //   [cur.prod.uuid] : cur.qty
      // }), {}),
      // checked: cart.orderItems.reduce((acc,cur) => ({
      //   ... acc,
      //   [cur.prod.uuid] : true
      // }), {}),
      qty:{},
      checked:{},
      querying: false,
      dlvCost: 0,
      totalCost: 0
    }

    this._onPurchase = this._onPurchase.bind(this)
    this._onChangeQty = this._onChangeQty.bind(this)
  }

  componentDidMount() {
    this.props.action.cart.cartFetch()
  }

  componentDidUpdate(prevProps) {
    const { cart, pendingAdd, pendingRemove, pendingUpdate } = this.props

    if ( cart && cart != prevProps.cart && cart.orderItems && ! pendingAdd && ! pendingUpdate && ! pendingRemove) {
      const data = cart.orderItems.map(item => ({
          ... item, 
          key: item.prod.uuid
        }))
        console.log('update data', data)

      this.setState({
        qty: cart.orderItems.reduce((acc,cur) => ({
          ... acc,
          [cur.prod.uuid] : cur.qty
        }), {}),
        checked: cart.orderItems.reduce((acc,cur) => ({
          ... acc,
          [cur.prod.uuid] : true
        }), {}),
        data : data
      })
    }

  }

  _onChangeQty(uuid, cnt) {
    // const data = this.state.data.filter(item => item.prod.uuid = uuid).map(item => item.qty = cnt)
    // console.log('qty data', data)
    this.setState({
      qty : {
        ... this.state.qty,
        [uuid]: cnt
      },
      checked: {
        ... this.state.checked,
        [uuid]: cnt > 0 ? true : false
      },
    })
  }

  // _onDelete(orderId, item){

  //   this.props.action.cart.cartRemove(orderId, item.orderItemId).then( resp => {
  //     if(resp.result == 0){
  //       this.setState({
  //         qty : {
  //           ... this.state.qty,
  //           [item.prod.uuid]: -1,
  //         }
  //       })
  //     }else {
  //       // AppAlert.error( i18n.t('purchase:failedToDelete'))
  //     }
  //   }).catch(_ => {
  //     // AppAlert.error( i18n.t('purchase:failedToDelete'))
  //   }).finally(() => {

  //   })

  //   console.log('ondelete orderId', orderId)
  //   console.log('ondelete orderId', item.prod.uuid)
  //   console.log(this.state)
  //   console.log(this.props)
  //   // this.props.action.cart.cartRemove(orderId, item.orderItemId)
  // }
  
  _onPurchase() {
    const { cart } = this.props
    const { data, checked, qty} = this.state
    const {loggedIn} = this.props.account

    if(!loggedIn){
      // AppAlert.confirm(i18n.t('error'),i18n.t('err:login'), {
      //   ok: () => this.props.navigation.navigate('Home')
      // })
      this.props.navigation.navigate('RegisterMobile')
    }
    else {
      // remove items from cart
      cart.orderItems.forEach(item => {
        if ( qty[item.prod.uuid] && item.qty != qty[item.prod.uuid]) {
          console.log('qty changed', item)

          console.log(cart.orderId, item.orderItemId)
          if ( qty[item.prod.uuid] < 0) this.props.action.cart.cartRemove( cart.orderId, item.orderItemId)
          else this.props.action.cart.cartUpdate( cart.orderId, item.orderItemId, qty[item.prod.uuid])
        }
      })

      const total = this._calculate(data, checked, qty)
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

    this.props.navigation.navigate('PymMethod', {pymReq, cartItem:data.filter(item => checked[item.key]==true)})
    }
  }

  _onChecked(uuid) {
    const { checked} = this.state
    this.setState({
      checked: {
        ... checked,
        [uuid]: ! checked[uuid]
      }
    })
  }

  _renderItem = ({item}) => {
    const { qty } = this.state
    const prod = ( item.prod.type == 'sim_card') ?
    this.props.sim.simList.find(sim => sim.uuid == item.prod.uuid) : undefined

    return <CartItem checked={this.state.checked[item.prod.uuid] || false}
      onChange={(value) => this._onChangeQty(item.prod.uuid, value)} 
      onDelete={() => this._onChangeQty(item.prod.uuid, -1)} 
      // onDelete={() => this._onDelete(this.props.cart.orderId, item)}
      onChecked={() => this._onChecked(item.prod.uuid)}
      name={item.title}
      price={item.price}
      image={prod && prod.image}
      qty={qty[item.prod.uuid]} />

  }

  _calculate( data, checked, qty) {

    return data.filter(item => checked[item.key]==true)
      .map(item => ({
        qty: Math.max( qty[item.key], 0), 
        price: item.price
      })).reduce((acc,cur) => ({
        cnt: acc.cnt+ cur.qty, 
        price: acc.price + cur.qty * cur.price
      }), {cnt: 0, price:0})
  }


  render() {
    const { querying, qty, checked, data} = this.state,
      total = this._calculate(data, checked, qty)

    return (
      <SafeAreaView style={styles.container}>
        <AppActivityIndicator visible={querying} />
          <View style={{flex:1, flexDirection: 'column'}}>
            <FlatList data={data.filter(item => qty[item.key] >= 0)}
              renderItem={this._renderItem} 
              extraData={[qty, checked]}
              ListFooterComponent={ <ChargeSummary totalCnt={total.cnt} totalPrice={total.price}/>} />
            <AppButton style={styles.btnBuy} 
                       title={i18n.t('cart:purchase')} 
                       disabled={total.price > 0 ? false : true}
                       onPress={this._onPurchase}/> 
                       {/* onPress={()=>this.props.navigation.dismiss()}/> */}
          </View>
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
  pendingAdd: state.pender.pending[cartActions.CART_ADD] || false,
  pendingUpdate: state.pender.pending[cartActions.CART_UPDATE] || false,
  pendingRemove: state.pender.pending[cartActions.CART_REMOVE] || false,
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action:{
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch)
    }
  })
)(CartScreen)