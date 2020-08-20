import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as cartActions from '../redux/modules/cart';
import Video from 'react-native-video';
import getEnvVars from '../environment';
import i18n from '../utils/i18n';
import AppBackButton from '../components/AppBackButton';
import IMP from 'iamport-react-native';
import _ from 'underscore';
import api from '../submodules/rokebi-utils/api/api';
import AppAlert from '../components/AppAlert';

// const IMP = require('iamport-react-native').default;

class PaymentScreen extends Component {
  constructor(props) {
    super(props);

    const {params = {}} = this.props.route;
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          navigation={this.props.navigation}
          title={
            params.isPaid ? i18n.t('his:paymentCompleted') : i18n.t('payment')
          }
          isPaid={params.isPaid}
          pymResult={params.pymResult}
          orderResult={params.orderResult}
        />
      ),
    });

    this.state = {
      params: {},
      isPaid: true,
    };

    this._callback = this._callback.bind(this);
  }

  componentDidMount() {
    const params = this.props.route.params && this.props.route.params.params;
    if (this.state.isPaid) {
      this.setState({
        isPaid: false,
      });
      this.props.navigation.setParams({isPaid: false});
    }

    if (params.mode == 'test' || params.amount == 0) {
      const {impId} = getEnvVars();
      const response = {
        success: true,
        imp_uid: impId,
        merchant_uid: params.merchant_uid,
        amount: params.amount,
        profile_uuid: params.profile_uuid,
        rokebi_cash: params.rokebi_cash,
        memo: params.memo,
      };

      this._callback(response);
    }
  }

  async _callback(response) {
    const success = _.isEmpty(response.success) ? true : response.success;
    if (success) {
      // 결제완료시 '다음' 버튼 연속클릭 방지 - 연속클릭시 추가 결제 없이 order 계속 생성
      if (!this.props.route.params.isPaid) {
        await this.props.navigation.setParams({isPaid: true});
        const params =
          this.props.route.params && this.props.route.params.params;

        this.props.action.cart
          .payNorder({
            ...response,
            pg_provider: params.pg,
            payment_type: params.pay_method,
            amount: params.amount,
            profile_uuid: params.profile_uuid,
            rokebi_cash: params.rokebi_cash,
            dlvCost: params.dlvCost,
            memo: params.memo,
          })
          .then(resp => {
            if (resp.result == 0) {
              this.props.navigation.replace('PaymentResult', {
                pymResult: response,
                orderResult: resp,
              });
            } else {
              if (resp.result === api.E_RESOURCE_NOT_FOUND) {
                AppAlert.info(resp.title + i18n.t(message));
              } else {
                AppAlert.info(i18n.t('cart:systemError'));
              }
              this.props.navigation.goBack();
            }
          });
      }
    } else {
      this.props.navigation.goBack();
    }
  }

  render() {
    const {impId} = getEnvVars();
    const params = this.props.route.params && this.props.route.params.params;

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'never', bottom: 'always'}}>
        <IMP.Payment
          userCode={impId}
          loading={
            <Video
              source={require('../assets/images/loading_1.mp4')}
              repeat={true}
              style={styles.backgroundVideo}
              resizeMode="cover"
            />
          }
          startInLoadingState={true}
          data={params} // 결제 데이터
          callback={this._callback}
          style={styles.webview}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    height: '100%',
    width: '100%',
  },
  webview: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'yellow',
    height: '100%',
    width: '100%',
    borderWidth: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default connect(
  undefined,
  dispatch => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(PaymentScreen);
