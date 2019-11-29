import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import AppButton from '../components/AppButton'
import _ from 'underscore'
import utils from '../utils/utils'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import AppAlert from '../components/AppAlert'
import orderApi from '../utils/api/orderApi';
import AppActivityIndicator from '../components/AppActivityIndicator';
import * as orderActions from '../redux/modules/order'
import { bindActionCreators } from 'redux'

class DeliveryScreen extends Component {
  static navigationOptions = {
    title: i18n.t('payment')
  }

  constructor(props) {
    super(props)

    this.state = {
      querying: false
    }

    this._renderItem = this._renderItem.bind(this)
    this._changeAddress = this._changeAddress.bind(this)
    this._deleteAddress = this._deleteAddress.bind(this)
    this._confirmDeleteAddress = this._confirmDeleteAddress.bind(this)
    this._selectAddress = this._selectAddress.bind(this)
  }

  componentDidMount() {
  }

  _changeAddress = (addr) => () => {
    this.props.navigation.navigate('UpdateAddress', {addr} )
  }

  _confirmDeleteAddress = (key) => () => {
    AppAlert.confirm( i18n.t('purchase:address'), i18n.t('purchase:delAddr'), {
      ok: () => {
        this._deleteAddress(key)
      }
    })
  }

  _deleteAddress(key) {
    const { userId, auth } = this.props.account

    this.setState({
      querying: true
    })

    orderApi.delDeliveryAddress(key, auth).then( resp => {
      if ( resp.result == 0) {
        // reload data
        orderApi.getCustomerProfile( userId, auth).then( resp => {
          this.props.addDeliveryAddressList(resp.objects)
        })
      }
      else {
        AppAlert.error( i18n.t('purchase:failedToDelete'))
      }
    }).catch(_ => {
      AppAlert.error( i18n.t('purchase:failedToDelete'))
    }).finally(() => {
      this.setState({
        querying: false
      })
    })
  }

  _selectAddress = (uuid) => () => {
    this.props.selectAddress(uuid)
    this.props.navigation.goBack()
  }

  _renderItem({item}) {
    if ( item.uuid == 'add') {
      return (
        <AppButton title={i18n.t('add')} onPress={() => this.props.navigation.navigate('UpdateAddress')}/>
      )
    }

    return (
      <View style={styles.address}>
        <TouchableOpacity onPress={this._selectAddress(item.uuid)}>
          <Text style={appStyles.h2}>{`${i18n.t('purchase:address')} : ${item.title}`}</Text>
          <Text>{`${i18n.t('purchase:addrName')} : ${item.recipient}`}</Text>
          <Text>{`${item.jibunAddr} ${item.details} [${item.zipNo}]`}</Text>
          <Text>{`${i18n.t('reg:mobile')} : ${utils.toPhoneNumber(item.mobile)}`}</Text>
          <Text>{`${i18n.t('reg:phone')} : ${utils.toPhoneNumber(item.phone)}`}</Text>
        </TouchableOpacity>
        <View style={styles.buttonBox}>
          <AppButton title={i18n.t('change')} onPress={this._changeAddress(item)}/>
          <AppButton title={i18n.t('delete')} onPress={this._confirmDeleteAddress(item.uuid)}/>
        </View>
      </View>
    )
  }

  render() {
    const { addrList } = this.props.order,
      { querying} = this.state,
      list = addrList.concat([{uuid: 'add'}])

    return (
      <View style={styles.container}>
        <AppActivityIndicator visible={querying} />
        <FlatList data={list} 
          renderItem={this._renderItem} 
          keyExtractor={(item) => item.uuid} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  address: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderBottomWidth: 0.5,
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  order: state.order.toJS(),
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    OrderActions: bindActionCreators(orderActions, dispatch)
  })
)(DeliveryScreen)