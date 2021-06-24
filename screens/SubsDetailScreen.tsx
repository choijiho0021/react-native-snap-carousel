import React, {Component} from 'react';
import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as productActions from '../redux/modules/product';
import {actions as accountActions} from '../redux/modules/account';
import * as orderActions from '../redux/modules/order';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import utils from '@/submodules/rokebi-utils/utils';
import AppBackButton from '../components/AppBackButton';
import AppActivityIndicator from '../components/AppActivityIndicator';
import {colors} from '../constants/Colors';
import LabelText from '../components/LabelText';
import AppButton from '../components/AppButton';
import AppModal from '../components/AppModal';
import subsApi from '../submodules/rokebi-utils/api/subscriptionApi';
import {RootState} from '@/redux';

const activateBtn = 'activateBtn';
const deactivateBtn = 'deactivateBtn';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notice: {
    ...appStyles.normal14Text,
    marginTop: 40,
    marginLeft: 20,
    color: colors.warmGrey,
  },
  title: {
    ...appStyles.normal20Text,
    marginTop: 10,
    marginHorizontal: 20,
  },
  divider: {
    marginTop: 40,
    marginBottom: 40,
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  value: {
    ...appStyles.normal16Text,
    color: colors.black,
  },
  label: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
  },
  info: {
    height: 36,
    marginHorizontal: 20,
  },
  confirm: {
    height: 52,
    flex: 1,
    backgroundColor: colors.clearBlue,
  },
});

class SubsDetailScreen extends Component {
  statusMap = {
    [subsApi.STATUS_RESERVED]: [
      i18n.t('reg:registerToUse'),
      subsApi.STATUS_ACTIVE,
      false,
    ],
    [subsApi.STATUS_INACTIVE]: [
      i18n.t('reg:reserveToUse'),
      subsApi.STATUS_RESERVED,
      false,
    ],
    [subsApi.STATUS_EXPIRED]: [i18n.t('reg:expired'), undefined, true],
    [subsApi.STATUS_USED]: [i18n.t('reg:used'), undefined, true],
    [subsApi.STATUS_CANCELED]: [i18n.t('reg:canceled'), undefined, true],
  };

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      modal: undefined,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitModal = this.onSubmitModal.bind(this);
    this.info = this.info.bind(this);
    this.callProd = this.callProd.bind(this);
    this.dataProd = this.dataProd.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('his:detail')} />,
    });

    const detail = this.props.route.params && this.props.route.params.detail;
    const {prodList} = this.props.product;
    const {price} = prodList.get(detail.prodId) || {};

    this.setState({price, ...detail});
  }

  onSubmit(targetStatus) {
    const {auth} = this.props;
    const {uuid} = this.state;

    // registerToUse: 사용 등록
    // 사용등록(A, R)/사용예약취소(I, R)/사용예약(target: R, I)/로깨비캐시 전환(U, I)/
    if (targetStatus) {
      // targetStatus - I, R 인 경우
      // 상태 전환 - 사용 예약 취소(I, R), 사용 예약(target: R, I)
      this.props.action.order.updateSubsStatus(uuid, targetStatus, auth);
    }
    this.props.navigation.goBack();
  }

  onSubmitModal(modal) {
    // 사용등록 / 로깨비캐시 전환
    const {
      account: {iccid},
      auth,
    } = this.props;
    const {uuid} = this.state;

    if (modal === activateBtn) {
      this.props.action.order.updateSubsStatus(
        uuid,
        subsApi.STATUS_ACTIVE,
        auth,
      );
    } else {
      this.props.action.order
        .updateSubsStatus(uuid, subsApi.STATUS_USED, auth)
        .then((resp) => {
          // 업데이트 후 정렬된 usage list 가져오기
          if (resp.result === 0) {
            this.props.action.account.getAccount(iccid, auth);
          }
        });
    }

    this.setState({showModal: false, modal});
    this.props.navigation.goBack();
  }

  showModal(value, modal) {
    this.setState({
      showModal: value,
      modal,
    });
  }

  info() {
    const {
      prodName,
      activationDate,
      endDate,
      expireDate,
      purchaseDate,
    } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.notice}>{i18n.t('his:timeStd')}</Text>
        <Text style={styles.title}>{prodName}</Text>
        <View style={styles.divider} />

        <LabelText
          style={styles.info}
          valueStyle={{color: colors.black}}
          label={i18n.t('his:purchaseDate')}
          value={utils.toDateString(purchaseDate)}
        />
        <LabelText
          style={styles.info}
          valueStyle={{color: colors.black}}
          label={i18n.t('his:activationDate')}
          value={
            activationDate
              ? utils.toDateString(activationDate)
              : i18n.t('his:inactive')
          }
        />
        <LabelText
          style={styles.info}
          valueStyle={{color: colors.black}}
          label={i18n.t('his:termDate')}
          value={endDate ? utils.toDateString(endDate) : i18n.t('his:inactive')}
        />
        <LabelText
          style={styles.info}
          valueStyle={{color: colors.black}}
          label={i18n.t('his:expireDate')}
          value={utils.toDateString(expireDate, 'LL')}
        />
      </View>
    );
  }

  callProd() {
    return (
      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={styles.confirm}
          title={i18n.t('ok')}
          titleStyle={appStyles.confirmText}
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }

  dataProd() {
    const {statusCd} = this.state;
    const [buttonTitle, targetStatus, disable] = this.statusMap.hasOwnProperty(
      statusCd,
    )
      ? this.statusMap[statusCd]
      : [i18n.t('ok'), undefined, false];

    return (
      <View style={{flexDirection: 'row'}}>
        {statusCd === subsApi.STATUS_RESERVED && (
          <AppButton
            style={[
              styles.confirm,
              {
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: colors.lightGrey,
                flex: 1,
              },
            ]}
            title={i18n.t('reg:cancelReservation')}
            titleStyle={[appStyles.confirmText, {color: colors.black}]}
            onPress={() => this.onSubmit(subsApi.STATUS_INACTIVE)}
          />
        )}
        {statusCd === subsApi.STATUS_INACTIVE && (
          <AppButton
            title={i18n.t('reg:toRokebiCash')}
            titleStyle={[appStyles.confirmText, {color: colors.black}]}
            style={{borderWidth: 1, borderColor: colors.lightGrey, flex: 1}}
            onPress={() => this.showModal(true, deactivateBtn)}
          />
        )}
        <AppButton
          style={styles.confirm}
          title={buttonTitle}
          titleStyle={appStyles.confirmText}
          disabled={disable}
          onPress={() =>
            targetStatus === subsApi.STATUS_ACTIVE
              ? this.showModal(true, activateBtn)
              : this.onSubmit(targetStatus)
          }
        />
      </View>
    );
  }

  render() {
    const {showModal, modal, price, type} = this.state;

    const isCallProduct = type === subsApi.CALL_PRODUCT;

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'never', bottom: 'always'}}>
        <AppActivityIndicator visible={this.props.pending} />
        {this.info()}
        {isCallProduct ? this.callProd() : this.dataProd()}
        <AppModal
          title={
            modal === activateBtn
              ? i18n.t('reg:activateProduct')
              : i18n.t('reg:toCash')
          }
          onOkClose={() => this.onSubmitModal(modal)}
          onCancelClose={() => this.showModal(false)}
          toRokebiCash={
            modal === deactivateBtn && utils.numberToCommaString(price)
          }
          visible={showModal}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, product, order, pender}: RootState) => ({
    product,
    account,
    auth: accountActions.auth(account),
    order,
    pending:
      // state.pender.pending[orderActions.GET_SUBS] ||
      pender.pending[orderActions.UPDATE_SUBS_STATUS] || false,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(SubsDetailScreen);
