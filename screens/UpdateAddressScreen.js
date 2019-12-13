import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux'

import i18n from '../utils/i18n'
import AppButton from '../components/AppButton'
import { TextField } from 'react-native-material-textfield'
import validate from 'validate.js'
import _ from 'underscore'
import utils from '../utils/utils'
import orderApi from '../utils/api/orderApi';
import AppAlert from '../components/AppAlert'
import * as orderActions from '../redux/modules/order'
import validationUtil from '../utils/validationUtil';
import { bindActionCreators } from 'redux'



class UpdateAddressScreen extends Component {
  static navigationOptions = {
    title: i18n.t('purchase:address')
  }

  constructor(props) {
    super(props)

    const key = this.props.navigation.getParam('key')
    console.log('update key ', key)

    this.state = {
      title : undefined,
      recipient: undefined,
      roadAddr : undefined,
      jibunAddr : undefined,
      mobile : undefined,
      phone : undefined,
      details : undefined,
      zipNo : undefined,

      showAddressModal : false,
    }

    this._onChangeText = this._onChangeText.bind(this)
    this._findAddr = this._findAddr.bind(this)
    this._showAddressModal = this._showAddressModal.bind(this)
    this._okCloseModal = this._okCloseModal.bind(this)
    this._validate = this._validate.bind(this)
    this._error = this._error.bind(this)
    this._onSubmit = this._onSubmit.bind(this)

    this.address = undefined
  }

  componentDidMount() {
    const addr = this.props.navigation.getParam('addr')
    console.log('update addr', addr)
    this.setState({
      ... addr
    })
  }

  _error(key) {
    const {errors} = this.state
    return ( ! _.isEmpty(errors) && errors[key] ) ? errors[key][0] : ''
  }

  _validate = (key, value) => {
    const { title, mobile} = this.state
    const val = {
      title, mobile,
      [key] : value
    }

    const errors = validationUtil.validateAll(val)
    this.setState({
      errors
    })

    return errors
  }

  _onChangeText = (key) => (value) => {

    if ( key == 'mobile') {
      value = utils.toPhoneNumber(value)
    }

    this.setState({
      [key]: value
    })

    this._validate(key, value)
  }

  _findAddr() {
    return (
      <AppButton title={i18n.t('purchase:findAddr')}>{i18n.t('purchase:findAddr')}</AppButton>
    )
  }

  _showAddressModal = (flag) => () => {
    this.setState({
      showAddressModal: flag
    })
    if (flag) this.address.blur()
  }

  _okCloseModal(addr) {

    this.setState({
      showAddressModal: false,
      zipNo: addr.zipNo,
      roadAddr : addr.roadAddr,
      jibunAddr : addr.jibunAddr
    })
  }

  _onSubmit() {
    const { title, recipient, mobile, phone, details, zipNo, jibunAddr, roadAddr, uuid } = this.state
    const addr = {
      title : title,
      recipient,
      mobile,
      phone,
      details,
      zipNo,
      jibunAddr,
      roadAddr
    }
    const {userId, token} = this.props.account

    const update = _.isEmpty(uuid) ? orderApi.addDeliveryAddress( addr, token) : 
      orderApi.chgDeliveryAddress( uuid, addr, token)

    update.then(resp => {
      if ( resp.result == 0) {
        // reload data
        orderApi.getCustomerProfile( userId, token).then(resp => {
          this.props.addDeliveryAddressList(resp.objects)
        })
      }
      else {
        AppAlert.error(i18n.t('purchase:failedToSave'))
      }
    }).catch(_ => {
      AppAlert.error(i18n.t('purchase:failedToSave'))
    }).finally(() => {
      this.props.navigation.goBack()
    })
  }

  render() {
    const { details, title, recipient, mobile, phone, zipNo, jibunAddr, showAddressModal } = this.state,
      address = _.isEmpty(jibunAddr) || _.isEmpty(zipNo) ? '' : `${jibunAddr} [${zipNo}]`

    return (
      <View style={styles.container}>

        <TextField containerStyle={styles.field}
          label={i18n.t('purchase:addrName')}
          returnKeyType='next'
          enablesReturnKeyAutomatically={true}
          clearTextOnFocus={true}
          onChangeText={this._onChangeText('title')}
          error={this._error('title')}
          value={title} />

        <TextField containerStyle={styles.field}
          label={i18n.t('purchase:recipient')}
          returnKeyType='next'
          enablesReturnKeyAutomatically={true}
          clearTextOnFocus={true}
          onChangeText={this._onChangeText('recipient')}
          error={this._error('recipient')}
          value={recipient} />

        <TextField containerStyle={styles.field}
          ref={ref => this.address = ref}
          label={i18n.t('purchase:address')}
          returnKeyType='next'
          enablesReturnKeyAutomatically={true}
          multiline={true}
          onFocus={this._showAddressModal(true)}
          value={address} />

        <TextField containerStyle={styles.field}
          label={i18n.t('addr:details')}
          returnKeyType='next'
          enablesReturnKeyAutomatically={true}
          clearTextOnFocus={true}
          onChangeText={this._onChangeText('details')}
          value={details} />

        <TextField containerStyle={styles.field}
          label={i18n.t('reg:mobile')}
          returnKeyType='next'
          enablesReturnKeyAutomatically={true}
          clearTextOnFocus={true}
          maxLength={13}
          onChangeText={this._onChangeText('mobile')}
          error={this._error('mobile')}
          value={mobile} />

        <TextField containerStyle={styles.field}
          label={i18n.t('reg:phone')}
          returnKeyType='next'
          enablesReturnKeyAutomatically={true}
          clearTextOnFocus={true}
          onChangeText={this._onChangeText('phone')}
          value={phone} />

        <AppButton title={i18n.t('save')} onPress={this._onSubmit}/>

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
  delete : {
    paddingVertical: 12,
    width: "10%"
  },
  field: {
    paddingHorizontal: 10,
    width: "100%",
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

const mapStateToProps = (state) => ({
  order: state.order.toJS(),
  account: state.account.toJS(),
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    OrderAction: bindActionCreators(orderActions, dispatch)
  })
)(UpdateAddressScreen)