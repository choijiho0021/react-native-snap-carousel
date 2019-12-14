import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux'
import {Map} from 'immutable'

import i18n from '../utils/i18n'
import _ from 'underscore'
import AppActivityIndicator from '../components/AppActivityIndicator'
import AppButton from '../components/AppButton';
import * as simActions from '../redux/modules/sim'
import * as accountActions from '../redux/modules/account'
import * as cartActions from '../redux/modules/cart'
import SimCard from '../components/SimCard'
import { bindActionCreators } from 'redux'
import AppBackButton from '../components/AppBackButton';
import simCardApi from '../utils/api/simCardApi';
import AppAlert from '../components/AppAlert';
import { appStyles } from '../constants/Styles';
import { colors } from '../constants/Colors';
import ChargeSummary from '../components/ChargeSummary';
import { SafeAreaView} from 'react-navigation'
import withBadge from '../components/withBadge';
import AppCartButton from '../components/AppCartButton';
import utils from '../utils/utils';

// const AppCartButton = withBadge(({cartItems}) => cartItems, {badgeStyle:{right:-5,top:5}}, 
//   (state) => ({cartItems: (state.cart.get('orderItems') || []).reduce((acc,cur) => acc + cur.qty, 0)}))(AppButton)

class NewSimScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('sim:purchase')} />,
    headerRight: <AppCartButton style={styles.btnCartIcon} onPress={() => navigation.navigate('Cart')} />
    })

  constructor(props) {
    super(props)

    this.state = {
      simCardList: [],
      querying: false,
      total: { cnt:0, price:0},
      checked: new Map(),
      simQty: new Map()
    }

    this._onChangeQty = this._onChangeQty.bind(this)
    this._onPress = this._onPress.bind(this)
    this._getTotal = this._getTotal.bind(this)
  }

  componentDidMount() {
    this.setState({
      querying: true
    })

    simCardApi.get().then( resp => {
      if (resp.result == 0) {
        const list = resp.objects.sort((a,b) => a.price - b.price).map(item => ({
            ... item,
            key: item.uuid,
          }))
    
        this.setState({
          simCardList: list,
          simQty: new Map( list.reduce((acc,cur) => ({
            ... acc, 
            [cur.uuid]: 0
          }), {})) 
        })

        this.props.action.sim.updateSimCardList({simList:list})
      }
    }).catch(err => {
      AppAlert.error(err.message)
    }).finally(() => {
      this.setState({
        querying: false
      })
    })
  }

  _onChangeQty(key, qty) {
    const simQty = this.state.simQty.set(key, qty),
      checked = this.state.checked.set(key, true)

      console.log('change', key, qty, simQty.toJS())
    // update qty
    this.setState({
      checked, simQty,
      total: this._getTotal(checked, simQty)
    })
  }

  _onPress = (mode) => () => {
    const {loggedIn} = this.props.account
    const {checked, simQty} = this.state

    if(!loggedIn){
      // AppAlert.confirm(i18n.t('error'),i18n.t('err:login'), {
      //   ok: () => this.props.navigation.navigate('Home')
      // })
      this.props.navigation.navigate('RegisterMobile')
    }
    else{
      // insert to cart
      const simList = this.state.simCardList.filter(item => checked.get(item.uuid) && simQty.get(item.uuid) > 0)
        .map(item => ({
          title: item.name,
          key: item.uuid,
          variationId : item.variationId,
          sku: item.sku,
          price: item.price,
          qty: simQty.get(item.uuid),
        }))

      if ( mode == 'purchase') {
        this.props.action.cart.purchase({ purchaseItems:simList, dlvCost:true})
        this.props.navigation.navigate('PymMethod')
      }
      else this.props.action.cart.cartAddAndGet( simList)
    }
    
  }

  _onChecked(key) {
    const checked = this.state.checked.update(key, value => ! value)

    this.setState({
      checked,
      total: this._getTotal( checked, this.state.simQty)
    })
  }

  _renderItem = ({item}) => {
    const { simQty} = this.state

    return (
      <SimCard onChange={value => this._onChangeQty(item.key, value)} 
        checked={this.state.checked.get(item.key) || false}
        onChecked={() => this._onChecked(item.key)}
        qty={simQty.get(item.uuid)}
        {... item} />
    )
  }

  _getTotal(checked, simQty) {
    const { simCardList} = this.state

    return simCardList.filter(item => checked.get(item.key) || false)
      .map(item => ({
        qty: simQty.get(item.key) || 0, 
        checked: checked.get(item.key) || false, 
        price: item.price
      })).reduce((acc,cur) => ({
        cnt: acc.cnt+ cur.qty, 
        price: acc.price + cur.qty * cur.price
      }), {cnt: 0, price:0})
  }


  render() {
    const { querying, simCardList, checked, simQty, total} = this.state,
      selected = simCardList.findIndex(item => checked.get(item.key) && simQty.get(item.key) > 0) >= 0

    return (
      <SafeAreaView style={styles.container}>
        <AppActivityIndicator visible={querying}/>
        <FlatList data={simCardList} 
                  renderItem={this._renderItem} 
                  extraData={[checked, simQty]}
                  ListFooterComponent={<ChargeSummary totalCnt={total.cnt} totalPrice={total.price} dlvCost={utils.dlvCost(total.price)}/>}/>
        <View style={styles.buttonBox}>

          <AppButton style={styles.btnCart} title={i18n.t('cart:toCart')} 
            titleStyle={styles.btnCartText}
            onPress={this._onPress('cart')}/>

          <AppButton style={styles.btnBuy} title={i18n.t('cart:buy')} 
            disabled={! selected}
            onPress={this._onPress('purchase')}/>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonBox: {
    flexDirection: 'row'
  },
  btnBuy: {
    width: "50%",
    height: 52,
    backgroundColor: colors.clearBlue
  },
  btnCart: {
    width: "50%",
    height: 52,
    backgroundColor: "#ffffff",
    borderColor: colors.lightGrey,
    borderTopWidth: 1
  },
  btnCartText: {
    ... appStyles.normal16Text,
    textAlign: "center",
    color: colors.black
  },
  btnCartIcon : {
    width:40,
    height:40,
    marginRight: 10
  },
});

const mapStateToProps = (state) => ({
  sim: state.sim.toJS(),
  account : state.account.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action:{
      sim : bindActionCreators( simActions, dispatch),
      cart : bindActionCreators( cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    }
  })
)(NewSimScreen)