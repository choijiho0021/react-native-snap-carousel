import IMP from 'iamport-react-native';
import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Video from 'react-native-video';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colors} from '@/constants/Colors';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import Env from '@/environment';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import api from '@/redux/api/api';
import i18n from '@/utils/i18n';
import {API} from '@/redux/api';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigation/navigation';
import {RouteProp} from '@react-navigation/native';

// const IMP = require('iamport-react-native').default;
const loading = require('../assets/images/loading_1.mp4');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    height: '100%',
    width: '100%',
    backgroundColor: colors.white,
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
    bottom: 80,
    right: 0,
  },
  infoText: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    marginBottom: 30,
    color: colors.clearBlue,
    textAlign: 'center',
    fontSize: 14,
  },
});

type PaymentScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Payment'
>;

type PaymentScreenRouteProp = RouteProp<HomeStackParamList, 'Payment'>;

type PaymentScreenProps = {
  navigation: PaymentScreenNavigationProp;
  route: PaymentScreenRouteProp;

  action: {
    cart: CartAction;
  };
};

type PaymentScreenState = {
  isPaid: boolean;
  token?: string;
};

class PaymentScreen extends Component<PaymentScreenProps, PaymentScreenState> {
  constructor(props: PaymentScreenProps) {
    super(props);

    this.state = {
      isPaid: true,
      token: undefined,
    };

    this.callback = this.callback.bind(this);
    this.isTrue = this.isTrue.bind(this);
    this.setToken = this.setToken.bind(this);
  }

  componentDidMount() {
    const {params} = this.props.route;

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          title={
            params?.isPaid ? i18n.t('his:paymentCompleted') : i18n.t('payment')
          }
          isPaid={params.isPaid}
        />
      ),
    });

    if (this.state.isPaid) {
      this.setState({
        isPaid: false,
      });
      this.props.navigation.setParams({isPaid: false});
    }
    API.Payment.getImpToken().then((resp) => {
      if (resp.code === 0) {
        this.setToken(resp.response.access_token);
      }
    });

    if (params.mode === 'test' || params.amount === 0) {
      const {impId} = Env.get();
      const response = {
        success: true,
        imp_uid: impId,
        merchant_uid: params.merchant_uid,
        amount: params.amount,
        profile_uuid: params.profile_uuid,
        rokebi_cash: params.rokebi_cash,
        memo: params.memo,
      };

      this.callback(response);
    }
  }

  setToken = (token: string) => {
    this.setState({token});
  };

  isTrue = (val: string) => {
    return val === 'true';
  };

  async callback(response) {
    let rsp = {};

    await API.Payment.getUid({
      uid: response.imp_uid,
      token: this.state.token,
    }).then((res) => {
      rsp = res;
    });

    console.log('payment getuid rsp: \n', rsp, response);
    if (rsp[0].success) {
      // 결제완료시 '다음' 버튼 연속클릭 방지 - 연속클릭시 추가 결제 없이 order 계속 생성
      if (!this.props.route.params.isPaid) {
        await this.props.navigation.setParams({isPaid: true});
        const {params} = this.props.route;

        this.props.action.cart
          .payNorder({
            imp_uid: rsp[0].imp_uid,
            merchant_uid: rsp[0].merchant_uid,
            pg_provider: params.pg,
            payment_type: params.pay_method,
            amount: params.amount,
            profile_uuid: params.profile_uuid,
            rokebi_cash: params.rokebi_cash,
            dlvCost: params.dlvCost,
            memo: params.memo,
          })
          .then(({payload: resp}) => {
            console.log(' pay and order then ', resp);
            if (resp?.result === 0) {
              this.props.navigation.replace('PaymentResult', {
                pymResult: rsp[0],
                orderResult: resp,
              });
            } else {
              if (resp?.result === api.E_RESOURCE_NOT_FOUND)
                AppAlert.info(`${resp.title} ${i18n.t('cart:soldOut')}`);
              else AppAlert.info(i18n.t('cart:systemError'));
              this.props.navigation.goBack();
            }
          });
      }
    } else {
      this.props.navigation.goBack();
    }
  }

  render() {
    const {impId} = Env.get();
    const {params} = this.props.route;

    return (
      <SafeAreaView style={styles.container}>
        <IMP.Payment
          userCode={impId}
          loading={
            <View style={{flex: 1, alignItems: 'stretch'}}>
              <Video
                source={loading}
                repeat
                style={styles.backgroundVideo}
                resizeMode="cover"
              />
              <Text style={styles.infoText}>{i18n.t('pym:loadingInfo')}</Text>
            </View>
          }
          startInLoadingState
          data={params} // 결제 데이터
          callback={this.callback}
          style={styles.webview}
        />
      </SafeAreaView>
    );
  }
}

export default connect(undefined, (dispatch) => ({
  action: {
    cart: bindActionCreators(cartActions, dispatch),
  },
}))(PaymentScreen);
