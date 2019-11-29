import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import _ from 'underscore'
import utils from '../utils/utils'
import orderApi from '../utils/api/orderApi';
import AppAlert from '../components/AppAlert'
import AppActivityIndicator from '../components/AppActivityIndicator';
import AppButton from '../components/AppButton';
import TotalPrice from '../components/TotalPrice';
import * as orderActions from '../redux/modules/order'
import * as productActions from '../redux/modules/product'
import paymentApi from '../utils/api/paymentApi';
import api from '../utils/api/api';
import { bindActionCreators } from 'redux'

class OrderScreen extends Component {
  static navigationOptions = {
    title: i18n.t('payment')
  }

  constructor(props) {
    super(props)

    this.state = {
      addrName : undefined,
      address: undefined,
      mobile : undefined,
      phone : undefined,
      detail : undefined,
      querying: api.API_STATUS_INIT,

      showAddressModal : false,
    }

    this._renderAddress = this._renderAddress.bind(this)
    this._registerAddress = this._registerAddress.bind(this)
    this._onPress = this._onPress.bind(this)
  }

  componentDidMount() {
    const { userId, auth } = this.props.account

    if ( ! _.isEmpty(userId)) {
      this.setState({
        querying: api.API_STATUS_TRYING
      })
      // read delivery address
      orderApi.getCustomerProfile(userId, auth).then(resp => {
        if ( resp.result == 0) {
          console.log('addr', resp.objects)
          this.props.addDeliveryAddressList(resp.objects)
        }
      }).catch(err => {
        AppAlert.error(err.message)
      }).finally(() => {
        this.setState({
          querying: api.API_STATUS_DONE
        })
      })
    }

    const pymResult = this.props.navigation.getParam('pymResult')
    if ( pymResult ) {
      console.log('payment result', pymResult)
      AppAlert.info('Payment :' + pymResult.imp_success)

      if ( pymResult.imp_success ) {
        const {product} = this.props

        if (product.cart.length > 0) {
          this.setState({querying: api.API_STATUS_TRYING})
          console.log('auth', this.props.account.auth)

          // 상품 가입 처리 
          Promise.all( product.cart.map(elm => {
            // UTC 0시 기준으로 start Date를 설정한다. 
            const subs = {
              uuid: elm.uuid,
              startDate: elm.startDate + 'T00:00:00',
              amount: 0,
              directPayment: 0
            }
            return paymentApi.buyProduct( subs, this.props.account.auth)
              .then(rsp => {
                console.log('buy product', rsp)
                if ( rsp.result == 0) {
                  this.props.ProductActions.delProdFromCart({uuid:elm.uuid})
                }
                else {
                  throw new Error('Failed to purchase product')
                }
                // remove from the cart
              }).catch(err => {
                console.log('failed to subscribe', err)
                throw err
              })
          })).then(_ => {
            AppAlert.info( i18n.t('purchase:finished'))
          }).catch(err => {
            AppAlert.error( i18n.t('purchase:failed'))
          })
          .finally(_ => this.setState({querying: api.API_STATUS_DONE}))
        }
      }
    }
  }

  _registerAddress() {
    this.props.navigation.navigate('DeliveryAddress')
  }

  _renderAddress(addr) {
    if (this.state.querying != api.API_STATUS_DONE) return null

    // SIM ㅋㅏ드가 없으면 배송 주소는 표시하지 않는다. 
    const {sim} = this.props
    if ( ! sim || sim.cart.length == 0) return null

    if (_.isEmpty(addr)) return (
      <View style={styles.address}>
        <Text style={appStyles.h2}>{i18n.t('purchase:noAddr')}</Text>
        <AppButton onPress={this._registerAddress} title={i18n.t('add')}/>
      </View>
    )

    return (
      <View style={styles.address}>
        <Text style={appStyles.h2}>{`${i18n.t('purchase:address')} : ${addr.title}`}</Text>
        <Text>{`${i18n.t('purchase:addrName')} : ${addr.recipient}`}</Text>
        <Text>{`${addr.jibunAddr} ${addr.details} [${addr.zipNo}]`}</Text>
        <Text>{`${i18n.t('reg:mobile')} : ${utils.toPhoneNumber(addr.mobile)}`}</Text>
        <Text>{`${i18n.t('reg:phone')} : ${utils.toPhoneNumber(addr.phone)}`}</Text>
        <AppButton onPress={this._registerAddress} title={i18n.t('change')}/>
      </View>
    )
  }

  _onPress() {
    const params = {
      pg : 'html5_inicis',
      pay_method: 'card',
      merchant_uid: `mid_${new Date().getTime()}`,
      name:'esim',
      amount: '100',
      buyer_name: 'noname',
      buyer_tel: '01012341234',
      buyer_email: 'email@test.com',
      escrow: false,
      app_scheme: 'esim',
      mode: 'test',
      home: 'Order'
    };
    
    /*
    // 신용카드의 경우, 할부기한 추가
    if (method === 'card' && cardQuota !== 0) {
      params.display = {
        card_quota: cardQuota === 1 ? [] : [cardQuota],
      };
    }

    // 가상계좌의 경우, 입금기한 추가
    if (method === 'vbank' && vbankDue) {
      params.vbank_due = vbankDue;
    }

    // 다날 && 가상계좌의 경우, 사업자 등록번호 10자리 추가
    if (method === 'vbank' && pg === 'danal_tpay') {
      params.biz_num = bizNum;
    }

    // 휴대폰 소액결제의 경우, 실물 컨텐츠 여부 추가
    if (method === 'phone') {
      params.digital = digital;
    }

    // 정기결제의 경우, customer_uid 추가
    if (pg === 'kcp_billing') {
      params.customer_uid = `cuid_${new Date().getTime()}`;
    }
    */

    this.props.navigation.replace('Payment', { pymReq: params });
  }

  render() {
    const { querying } = this.state,
      {addrList, selectedAddrIdx} = this.props.order,
      addr = addrList.length > 0 && selectedAddrIdx >= 0 && selectedAddrIdx < addrList.length ? addrList[selectedAddrIdx] : {}

    return (
      <View style={styles.container}>
        <AppActivityIndicator visible={querying == api.API_STATUS_TRYING} />
        <View>
          <TotalPrice prod={this.props.product} sim={this.props.sim}/>
        </View>
        {
          this._renderAddress(addr)
        }
        <AppButton title={i18n.t('payment')} onPress={this._onPress}/>
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
    borderRadius: 4,
    borderWidth: 0.5,
    width: "100%",
    margin: 20,
    padding: 5,
  },
  delete : {
    paddingVertical: 12,
    width: "10%"
  },
  field: {
    paddingHorizontal: 10,
    width: "100%",
  },
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  order: state.order.toJS(),
  product: state.product.toJS(),
  sim: state.sim.toJS(),
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    OrderActions: bindActionCreators(orderActions, dispatch),
    ProductActions: bindActionCreators(productActions, dispatch),
  })
)(OrderScreen)