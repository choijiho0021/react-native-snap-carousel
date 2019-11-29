import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text
} from 'react-native';
import {connect} from 'react-redux'

import i18n from '../utils/i18n'
import _ from 'underscore'
import AppActivityIndicator from '../components/AppActivityIndicator'
import AppButton from '../components/AppButton';
import * as simActions from '../redux/modules/sim'
import * as accountActions from '../redux/modules/account'
import SimCard from '../components/SimCard'
import { bindActionCreators } from 'redux'
import AppBackButton from '../components/AppBackButton';
import simCardApi from '../utils/api/simCardApi';
import AppAlert from '../components/AppAlert';
import { appStyles } from '../constants/Styles';
import { colors } from '../constants/Colors';
import ChargeSummary from '../components/ChargeSummary';
import { SafeAreaView} from 'react-navigation'

class NewSimScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('sim:purchase')}),
  })

  constructor(props) {
    super(props)

    this.state = {
      simCardList: [],
      querying: false,
      checked: {},
      simQty: {}
    }

    this._onChangeQty = this._onChangeQty.bind(this)
    this._onPress = this._onPress.bind(this)
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
          simQty: list.reduce((acc,cur) => ({
            ... acc, 
            [cur.uuid]: 0
          }), {}) 
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

    // update qty
    this.setState({
      simQty: {
        ... this.state.simQty,
        [key]: qty
      },
      checked: {
        ... this.state.checked,
        [key]: true
      }
    })
  }

  _onPress() {
    const {loggedIn} = this.props.account

    if(!loggedIn){
      // AppAlert.confirm(i18n.t('error'),i18n.t('err:login'), {
      //   ok: () => this.props.navigation.navigate('Home')
      // })
      this.props.navigation.navigate('RegisterMobile')
    }
    else{
      // insert to cart
      this.state.simCardList.forEach(item => {
        if ( item.qty > 0) {
          this.props.action.sim.addSimToCart({
            uuid : item.uuid,
            qty : item.qty
          })
        }
      })
    }
    
  }

  _onChecked(key) {
    const { checked } = this.state

    this.setState({
      checked: {
        ... checked,
        [key]: ! checked[key]
      }
    })
  }

  _renderItem = ({item}) => {
    const { simQty} = this.state

    return (
      <SimCard onChange={value => this._onChangeQty(item.key, value)} 
        checked={this.state.checked[item.key] || false}
        onChecked={() => this._onChecked(item.key)}
        qty={simQty[item.uuid]}
        {... item} />
    )
  }


  render() {
    const { querying, simCardList, checked, simQty} = this.state
    const total = simCardList.filter(item => checked[item.key] || false)
      .map(item => ({
        qty: simQty[item.key] || 0, 
        checked: checked[item.key] || false, 
        price: item.price
      })).reduce((acc,cur) => ({
        cnt: acc.cnt+ cur.qty, 
        price: acc.price + cur.qty * cur.price
      }), {cnt: 0, price:0})


    return (
      <SafeAreaView style={styles.container}>
        <AppActivityIndicator visible={querying}/>
        <FlatList data={simCardList} renderItem={this._renderItem} extraData={[checked, simQty]}/>
        <ChargeSummary totalCnt={total.cnt} totalPrice={total.price}/>
        <View style={styles.buttonBox}>
          <AppButton style={styles.btnCart} title={i18n.t('cart:toCart')} 
            titleStyle={styles.btnCartText}
            onPress={this._onPress}/>
          <AppButton style={styles.btnBuy} title={i18n.t('cart:buy')} 
            titleStyle={styles.btnBuyText}
            onPress={this._onPress}/>
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
    borderWidth: 1
  },
  btnCartText: {
    ... appStyles.normal16Text,
    textAlign: "center",
    color: colors.black
  },
  btnBuyText: {
    ... appStyles.normal16Text,
    textAlign: "center",
    color: "#ffffff"
  }
});

const mapStateToProps = (state) => ({
  sim: state.sim.toJS(),
  account : state.account.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action:{
      sim : bindActionCreators( simActions, dispatch),
      account: bindActionCreators(accountActions, dispatch)
    }
  })
)(NewSimScreen)