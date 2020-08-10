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
      <View
        style={{backgroundColor: colors.whiteTwo, margin: 20, marginTop: 30}}>
        <Text style={{...appStyles.bold18Text}}>{i18n.t('usim:esimList')}</Text>
      </View>
    );
  }
}
const colorMap = {
  [subsApi.STATUS_ACTIVE]: [colors.tomato, true],
  [subsApi.STATUS_RESERVED]: [colors.clearBlue, false],
  [subsApi.STATUS_INACTIVE]: [colors.black, false],
};

class UsageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      statusColor: colors.warmGrey,
      isActive: false,
      disableBtn: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextProps.item, this.props.item) ||
      this.state.disableBtn != nextState.disableBtn
    );
  }

  componentDidUpdate() {
    if (this.state.disableBtn) {
      setTimeout(() => {
        this.setState({
          disableBtn: false,
        });
      }, 5000);
    }
  }

  render() {
    const {item, onPress} = this.props;
    const [statusColor, isActive] = colorMap.hasOwnProperty(item.statusCd)
      ? colorMap[item.statusCd]
      : [colors.warmGrey, false];

    return (
      <View style={styles.usageListContainer}>
        <View style={{backgroundColor: colors.white}}>
          <View style={styles.titleAndStatus}>
            <Text
              key={item.key}
              style={[
                styles.usageTitleNormal,
                {fontWeight: isActive ? 'bold' : 'normal'},
              ]}>
              {item.prodName}
            </Text>
            <Text
              key={item.nid}
              style={[styles.usageStatus, {color: statusColor}]}>
              {' '}
              • {item.status}
            </Text>
          </View>
        </View>
        <View style={styles.inactiveContainer}>
          <Text style={appStyles.normal12Text}>
            {i18n.t('usim:usablePeriod')}
          </Text>
          <Text style={styles.usagePeriod}>{`${utils.toDateString(
            item.purchaseDate,
            'YYYY-MM-DD',
          )} ~ ${item.expireDate}`}</Text>
        </View>
        <View style={styles.activeBottomBox}>
          <TouchableOpacity
            onPress={() => onPress(true, 'showQR', item)}
            style={{alignItems: 'center', flex: 1}}>
            <AppIcon key="btnQr" name="btnQr" />
            <Text style={{marginVertical: 10}}>{i18n.t('esim:showQR')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onPress(true, 'manual', item)}
            style={{alignItems: 'center', flex: 1}}>
            <AppIcon key="btnPen" name="btnPen" />
            <Text style={{marginVertical: 10}}>
              {i18n.t('esim:manualInput')}
            </Text>
          </TouchableOpacity>

          {/* <AppButton
            style={styles.btn}
            onPress={() => onPress(true, 'showQR', item)}
            title={i18n.t('esim:showQR')}
            titleStyle={styles.btnTitle}
          /> */}

          {/* <AppButton
            style={styles.btn}
            onPress={() => onPress(true, 'manual', item)}
            title={i18n.t('esim:manualInput')}
            titleStyle={styles.btnTitle}
          /> */}
        </View>
      </View>
    );
  }
}

class EsimScreen extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <Text style={styles.title}>{i18n.t('esim:purchaseList')}</Text>
      ),
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
  activeBottomBox: {
    height: 50,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  usageListContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  titleAndStatus: {
    flexDirection: 'row',
    marginHorizontal: 30,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inactiveContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
    justifyContent: 'space-between',
  },
  usageTitleNormal: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 14 : 16,
    maxWidth: '70%',
  },
  usageStatus: {
    ...appStyles.bold14Text,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  usagePeriod: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  btn: {
    width: 160,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 24,
    marginBottom: 40,
    marginTop: 25,
  },
  btnTitle: {
    ...appStyles.bold16Text,
    textAlign: 'center',
    color: colors.clearBlue,
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
