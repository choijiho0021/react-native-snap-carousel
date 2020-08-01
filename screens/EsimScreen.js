import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, RefreshControl} from 'react-native';

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
import _ from 'underscore';
import AppButton from '../components/AppButton';
import {isDeviceSize} from '../constants/SliderEntry.style';
import AppActivityIndicator from '../components/AppActivityIndicator';
import {snackBarHidingTime} from '../constants/Timer';
import subsApi from '../submodules/rokebi-utils/api/subscriptionApi';
import AppModal from '../components/AppModal';
import QRCode from 'react-native-qrcode-svg';

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
          <AppButton
            style={styles.btn}
            onPress={() => onPress(true, 'showQR', item)}
            title={i18n.t('esim:showQR')}
            titleStyle={styles.btnTitle}
          />
          <AppButton
            style={styles.btn}
            onPress={() => onPress(true, 'manual', item)}
            title={i18n.t('esim:manualInput')}
            titleStyle={styles.btnTitle}
          />
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
      headerLeft: () => <Text style={styles.title}>{i18n.t('usim')}</Text>,
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
  }

  componentDidMount() {
    const {
      account: {iccid},
      auth,
    } = this.props;

    this._init(iccid, auth);
  }

  componentDidUpdate(prevProps) {
    const {
        account: {iccid},
        auth,
        lastTab,
        loginPending,
      } = this.props,
      routeName = this.props.route.name,
      isFocusedToUsimTab =
        (lastTab[0] || '').startsWith(routeName) &&
        lastTab[0] !== prevProps.lastTab[0];

    if (
      (isFocusedToUsimTab && !loginPending) ||
      (prevProps.account.iccid && iccid !== prevProps.account.iccid)
    ) {
      this._init(iccid, auth);
    }
  }

  _init(iccid, auth) {
    if (iccid && auth) {
      this.props.action.order.getSubsWithToast(iccid, auth);
    } else {
      this.props.navigation.navigate('RegisterSim', {back: 'Home'});
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
          <Text style={styles.body}>{i18n.t('esim:showQR:body')}</Text>
          <View style={styles.center}>
            <QRCode value={subs.smdpAddr + subs.actCode} />
          </View>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.body}>{i18n.t('esim:manualInput:body')}</Text>
        <View style={styles.titleAndStatus}>
          <View>
            <Text>{i18n.t('esim:smdp')}</Text>
            <Text>{subs.smdpAddr}</Text>
          </View>
          <AppButton title={i18n.t('copy')} />
        </View>
        <View style={styles.titleAndStatus}>
          <View>
            <Text>{i18n.t('esim:actCode')}</Text>
            <Text>{subs.actCode}</Text>
          </View>
          <AppButton title={i18n.t('copy')} />
        </View>
      </View>
    );
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
          type="info"
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
          autoHidingTime={snackBarHidingTime}
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
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
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
    },
  }),
)(EsimScreen);
