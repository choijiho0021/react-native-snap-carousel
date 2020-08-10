import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import SnackBar from 'react-native-snackbar-component';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import i18n from '../utils/i18n';
import utils from '../utils/utils';
import {appStyles} from '../constants/Styles';
import {colors} from '../constants/Colors';
import * as accountActions from '../redux/modules/account';
import * as notiActions from '../redux/modules/noti';
import * as infoActions from '../redux/modules/info';
import * as cartActions from '../redux/modules/cart';
import * as orderActions from '../redux/modules/order';
import * as toastActions from '../redux/modules/toast';
import _ from 'underscore';
import AppButton from '../components/AppButton';
import {isDeviceSize} from '../constants/SliderEntry.style';
import AppActivityIndicator from '../components/AppActivityIndicator';
import {timer} from '../constants/Timer';
import subsApi from '../submodules/rokebi-utils/api/subscriptionApi';
import AppModal from '../components/AppModal';
import QRCode from 'react-native-qrcode-svg';
import AppIcon from '../components/AppIcon';
import {Toast} from '../constants/CustomTypes';
import Clipboard from '@react-native-community/clipboard';

class CardInfo extends Component {
  render() {
    return (
      <View style={styles.notice}>
        <AppIcon style={{marginRight: 10}} name={'imgAlarm'} />
        <Text style={styles.normal14WarmGrey}>{i18n.t('esim:notice')}</Text>
      </View>
    );
  }
}

class UsageItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {item, onPress, expired} = this.props;

    return (
      <View
        style={[styles.usageListContainer, expired && styles.cardExpiredBg]}>
        <View style={styles.titleAndStatus}>
          <Text
            key={item.key}
            style={expired ? styles.usageTitleNormal : styles.usageTitleBold}>
            {item.prodName}
          </Text>
          {expired && (
            <View style={styles.expiredBg}>
              <Text key={item.nid} style={appStyles.normal12Text}>
                {i18n.t('esim:expired')}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.inactiveContainer}>
          <Text style={styles.normal12WarmGrey}>
            {i18n.t('esim:usablePeriod')}
          </Text>
          <Text style={styles.normal14WarmGrey}>{`${utils.toDateString(
            item.purchaseDate,
            'YYYY-MM-DD',
          )} ~ ${item.expireDate}`}</Text>
        </View>
        {!expired && (
          <View style={styles.activeBottomBox}>
            <AppButton
              style={styles.btn}
              onPress={() => onPress(true, 'showQR', item)}
              title={i18n.t('esim:showQR')}
              titleStyle={styles.btnTitle}
              iconName={'btnQr'}
            />
            <AppButton
              style={styles.btn}
              onPress={() => onPress(true, 'manual', item)}
              title={i18n.t('esim:manualInput')}
              titleStyle={styles.btnTitle}
              iconName={'btnPen'}
            />
          </View>
        )}
      </View>
    );
  }
}

class EsimScreen extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <Text style={styles.title}>{i18n.t('esimList')}</Text>,
    });

    this.state = {
      refreshing: false,
      showSnackBar: false,
      isFocused: false,
      showModal: false,
      modal: undefined,
      subs: undefined,
    };

    this._init = this._init.bind(this);
    this._renderUsage = this._renderUsage.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._info = this._info.bind(this);
    this.showSnackBar = this.showSnackBar.bind(this);
    this._showModal = this._showModal.bind(this);
    this._modalBody = this._modalBody.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  componentDidMount() {
    const {
      account: {iccid},
      auth,
    } = this.props;

    this._init(iccid, auth);
  }

  _init(iccid, auth) {
    if (iccid && auth) {
      this.props.action.order.getSubsWithToast(iccid, auth);
    }
  }

  _empty = () => {
    if (this.props.pending) return null;

    return <Text style={styles.nolist}>{i18n.t('his:noUsage')}</Text>;
  };

  showSnackBar() {
    this.setState({
      showSnackBar: true,
    });
  }

  _renderUsage({item}) {
    return (
      <UsageItem
        key={item.key}
        item={item}
        auth={this.props.auth}
        expired={new Date(item.expireDate) <= new Date()}
        showSnackBar={this.showSnackBar}
        onPress={this._showModal}
      />
    );
  }

  _onRefresh() {
    const {
      account: {iccid},
      auth,
    } = this.props;

    if (iccid) {
      this.setState({
        refreshing: true,
      });

      this.props.action.order
        .getSubsWithToast(iccid, auth)
        .then(_ => {
          this.props.action.account.getAccount(iccid, auth);
        })
        .finally(() => {
          this.setState({
            refreshing: false,
          });
        });
    }
  }

  _info() {
    const {
      account: {iccid, balance, expDate},
      navigation,
    } = this.props;
    return (
      <CardInfo
        iccid={iccid}
        balance={balance}
        expDate={expDate}
        navigation={navigation}
      />
    );
  }

  _showModal(flag, modal, subs) {
    this.setState({showModal: flag, modal, subs});
  }

  _modalBody = (modal, subs) => () => {
    if (!subs) return null;

    if (modal === 'showQR') {
      return (
        <View>
          {_.isEmpty(subs.smdpAddr + subs.actCode) ? (
            <View style={styles.center}>
              <Text>{i18n.t('esim:showQR:nothing')}</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.body}>
                <Text style={[styles.body, {color: colors.clearBlue}]}>
                  {i18n.t('esim:showQR:frontBody')}
                </Text>
                {i18n.t('esim:showQR:endBody')}
              </Text>
              <View style={styles.center}>
                <QRCode value={subs.smdpAddr + subs.actCode} />
              </View>
            </View>
          )}
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.body}>
          <Text style={[styles.body, {color: colors.clearBlue}]}>
            {i18n.t('esim:manualInput:bodyPart1')}
          </Text>
          <Text style={styles.body}>
            {i18n.t('esim:manualInput:bodyPart2')}
          </Text>
          <Text style={[styles.body, {color: colors.clearBlue}]}>
            {i18n.t('esim:manualInput:bodyPart3')}
          </Text>
          {i18n.t('esim:manualInput:bodyPart4')}
        </Text>
        <View style={styles.titleAndStatus}>
          <View>
            <Text style={styles.esimInfoKey}>{i18n.t('esim:smdp')}</Text>
            <Text style={appStyles.normal16Text}>{subs.smdpAddr}</Text>
          </View>
          <AppButton
            title={i18n.t('copy')}
            titleStyle={{color: colors.black}}
            style={styles.btnCopy}
            onPress={this.copyToClipboard(subs.smdpAddr)}
          />
        </View>
        <View style={styles.titleAndStatus}>
          <View>
            <Text style={styles.esimInfoKey}>{i18n.t('esim:actCode')}</Text>
            <Text style={appStyles.normal16Text}>{subs.actCode}</Text>
          </View>
          <AppButton
            title={i18n.t('copy')}
            titleStyle={{color: colors.black}}
            style={styles.btnCopy}
            onPress={this.copyToClipboard(subs.actCode)}
          />
        </View>
      </View>
    );
  };

  copyToClipboard = value => () => {
    Clipboard.setString(value);
    this.props.action.toast.push(Toast.COPY_SUCCESS);
  };

  render() {
    const {usage} = this.props.order;
    const {refreshing, showSnackBar, showModal, modal, subs} = this.state;

    return (
      <View style={styles.container}>
        <View style={{backgroundColor: colors.whiteTwo}}>
          <FlatList
            data={usage}
            keyExtractor={item => item.key.toString()}
            ListHeaderComponent={this._info}
            ListEmptyComponent={this._empty}
            renderItem={this._renderUsage}
            // onRefresh={this._onRefresh}
            // refreshing={refreshing}
            extraData={usage}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this._onRefresh}
                colors={[colors.clearBlue]} //android 전용
                tintColor={colors.clearBlue} //ios 전용
              />
            }
          />
          <AppActivityIndicator
            visible={this.props.pending || this.props.loginPending}
          />
        </View>
        <AppModal
          type="close"
          titleIcon={modal == 'showQR' ? 'btnQr' : 'btnPen'}
          titleStyle={styles.titleStyle}
          title={
            modal == 'showQR'
              ? i18n.t('esim:showQR:title')
              : i18n.t('esim:manualInput:title')
          }
          body={this._modalBody(modal, subs)}
          onOkClose={() => this._showModal(false)}
          visible={showModal}
        />
        <SnackBar
          visible={showSnackBar}
          backgroundColor={colors.clearBlue}
          messageColor={colors.white}
          position={'bottom'}
          top={0}
          containerStyle={{borderRadius: 3, height: 48, marginHorizontal: 0}}
          autoHidingTime={timer.snackBarHidingTime}
          onClose={() => this.setState({showSnackBar: false})}
          textMessage={i18n.t('usim:failSnackBar')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: colors.whiteThree,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
  },
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  center: {
    marginTop: 20,
    alignSelf: 'center',
    marginVertical: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,
    paddingVertical: 13,
    paddingHorizontal: 13,
  },
  nolist: {
    marginVertical: '40%',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  cardExpiredBg: {
    backgroundColor: colors.whiteTwo,
    borderColor: colors.lightGrey,
    borderWidth: 1,
  },
  activeBottomBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usageListContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 3,
    padding: 20,
  },
  titleAndStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inactiveContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  usageTitleNormal: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 14 : 16,
    maxWidth: '70%',
    color: colors.warmGrey,
  },
  usageTitleBold: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 14 : 16,
    maxWidth: '70%',
    fontWeight: 'bold',
  },
  normal12WarmGrey: {
    ...appStyles.normal12Text,
    color: colors.warmGrey,
  },
  expiredBg: {
    backgroundColor: colors.whiteThree,
    borderRadius: 3,
    padding: 5,
    height: '90%',
  },
  normal14WarmGrey: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  btn: {
    width: '45%',
    paddingTop: 25,
  },
  btnTitle: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    marginTop: 10,
  },
  body: {
    ...appStyles.normal16Text,
    marginHorizontal: 30,
    marginTop: 10,
  },
  titleStyle: {
    marginHorizontal: 30,
    fontSize: 20,
  },
  esimInfoKey: {
    ...appStyles.normal16Text,
    color: colors.warmGrey,
  },
  btnCopy: {
    backgroundColor: colors.white,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.whiteTwo,
  },
});

const mapStateToProps = state => ({
  order: state.order.toObject(),
  account: state.account.toJS(),
  auth: accountActions.auth(state.account),
  noti: state.noti.toJS(),
  info: state.info.toJS(),
  loginPending:
    state.pender.pending[accountActions.LOGIN] ||
    state.pender.pending[accountActions.GET_ACCOUNT] ||
    false,
  pending: state.pender.pending[orderActions.GET_SUBS] || false,
  sync: state.sync.toJS(),
  lastTab: state.cart.get('lastTab').toJS(),
});

export default connect(
  mapStateToProps,
  dispatch => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(EsimScreen);
