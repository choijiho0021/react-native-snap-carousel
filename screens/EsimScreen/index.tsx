import {RootState} from '@/redux';
import Clipboard from '@react-native-community/clipboard';
import React, {Component} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import SnackBar from 'react-native-snackbar-component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import {colors} from '@/constants/Colors';
import {Toast} from '@/constants/CustomTypes';
import {appStyles} from '@/constants/Styles';
import {timer} from '@/constants/Timer';
import {actions as accountActions} from '@/redux/modules/account';
import * as cartActions from '@/redux/modules/cart';
import * as infoActions from '@/redux/modules/info';
import * as notiActions from '@/redux/modules/noti';
import * as orderActions from '@/redux/modules/order';
import * as toastActions from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import {ToastAction} from '@/redux/modules/toast';
import CardInfo from './components/CardInfo';
import UsageItem from './components/UsageItem';

const styles = StyleSheet.create({
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  center: {
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
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
  titleAndStatus: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  btn: {
    width: '45%',
    paddingTop: 25,
  },
  titleStyle: {
    marginHorizontal: 20,
    fontSize: 20,
  },
  esimInfoKey: {
    ...appStyles.normal16Text,
    color: colors.warmGrey,
    marginBottom: 6,
  },
  btnCopy: (selected) => ({
    backgroundColor: colors.white,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: selected ? colors.clearBlue : colors.whiteTwo,
  }),
  btnCopyTitle: (selected) => ({
    ...appStyles.normal14Text,
    color: selected ? colors.clearBlue : colors.black,
  }),
  modalBody: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  normal16BlueText: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
  },
});

const showQR = (subs) => {
  return (
    <View style={styles.modalBody}>
      {_.isEmpty(subs.qrCode) ? (
        <View style={styles.center}>
          <Text>{i18n.t('esim:showQR:nothing')}</Text>
        </View>
      ) : (
        <View>
          <Text style={appStyles.normal16Text}>
            <Text style={styles.normal16BlueText}>
              {i18n.t('esim:showQR:frontBody')}
            </Text>
            {i18n.t('esim:showQR:endBody')}
          </Text>
          <View style={styles.center}>
            <QRCode value={subs.qrCode} />
          </View>
        </View>
      )}
    </View>
  );
};

const esimManualInputInfo = () => {
  return (
    <View style={{marginBottom: 20}}>
      <Text style={appStyles.normal16Text}>
        <Text style={styles.normal16BlueText}>
          {i18n.t('esim:manualInput:bodyPart1')}
        </Text>
        <Text style={appStyles.normal16Text}>
          {i18n.t('esim:manualInput:bodyPart2')}
        </Text>
        <Text style={styles.normal16BlueText}>
          {i18n.t('esim:manualInput:bodyPart3')}
        </Text>
        {i18n.t('esim:manualInput:bodyPart4')}
      </Text>
    </View>
  );
};

type EsimScreenProps = {
  action: {
    toast: ToastAction;
  };
};

class EsimScreen extends Component<EsimScreenProps> {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      showSnackBar: false,
      showModal: false,
      modal: undefined,
      subs: undefined,
      copyString: '',
    };

    this.init = this.init.bind(this);
    this.renderSubs = this.renderSubs.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.info = this.info.bind(this);
    this.showSnackBar = this.showSnackBar.bind(this);
    this.showModal = this.showModal.bind(this);
    this.modalBody = this.modalBody.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  componentDidMount() {
    const {
      account: {iccid},
      auth,
    } = this.props;

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <Text style={styles.title}>{i18n.t('esimList')}</Text>,
    });

    this.init(iccid, auth);
  }

  onRefresh() {
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
        .then(() => {
          this.props.action.account.getAccount(iccid, auth);
        })
        .finally(() => {
          this.setState({
            refreshing: false,
          });
        });
    }
  }

  modalBody = () => {
    const {modal, subs} = this.state;

    if (!subs) return null;

    if (modal === 'showQR') {
      return showQR(subs);
    }

    return (
      <View style={styles.modalBody}>
        {esimManualInputInfo()}
        {this.copyInfo(subs.smdpAddr, 'smdp')}
        {this.copyInfo(subs.actCode, 'actCode')}
      </View>
    );
  };

  copyToClipboard = (value) => () => {
    Clipboard.setString(value);
    this.setState({copyString: value});
    this.props.action.toast.push(Toast.COPY_SUCCESS);
  };

  empty = () => {
    if (this.props.pending) return null;

    return <Text style={styles.nolist}>{i18n.t('his:noUsage')}</Text>;
  };

  info() {
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

  showModal(flag, modal, subs) {
    this.setState({showModal: flag, modal, subs});
  }

  copyInfo(valToCopy, title) {
    const {copyString} = this.state;

    return (
      <View style={styles.titleAndStatus}>
        <View style={{flex: 1}}>
          <Text style={styles.esimInfoKey}>{i18n.t(`esim:${title}`)}</Text>
          <Text style={appStyles.normal16Text}>{valToCopy}</Text>
        </View>
        <AppButton
          title={i18n.t('copy')}
          titleStyle={styles.btnCopyTitle(copyString === valToCopy)}
          style={styles.btnCopy(copyString === valToCopy)}
          onPress={this.copyToClipboard(valToCopy)}
        />
      </View>
    );
  }

  showSnackBar() {
    this.setState({
      showSnackBar: true,
    });
  }

  init(iccid, auth) {
    if (iccid && auth) {
      this.props.action.order.getSubsWithToast(iccid, auth);
    }
  }

  renderSubs({item}) {
    return (
      <UsageItem
        key={item.key}
        item={item}
        auth={this.props.auth}
        expired={new Date(item.expireDate) <= new Date()}
        showSnackBar={this.showSnackBar}
        onPress={this.showModal}
      />
    );
  }

  render() {
    const {subs} = this.props.order;
    const {refreshing, showSnackBar, showModal, modal} = this.state;

    return (
      <View style={styles.container}>
        <View style={{backgroundColor: colors.whiteTwo}}>
          <FlatList
            data={subs}
            keyExtractor={(item) => item.key.toString()}
            ListHeaderComponent={this.info}
            ListEmptyComponent={this.empty}
            renderItem={this.renderSubs}
            // onRefresh={this.onRefresh}
            // refreshing={refreshing}
            extraData={subs}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                colors={[colors.clearBlue]} // android 전용
                tintColor={colors.clearBlue} // ios 전용
              />
            }
          />
          <AppActivityIndicator
            visible={this.props.pending || this.props.loginPending}
          />
        </View>
        <AppModal
          type="close"
          titleIcon={modal === 'showQR' ? 'btnQr' : 'btnPen'}
          titleStyle={styles.titleStyle}
          title={
            modal === 'showQR'
              ? i18n.t('esim:showQR:title')
              : i18n.t('esim:manualInput:title')
          }
          onOkClose={() => this.showModal(false)}
          visible={showModal}>
          {this.modalBody()}
        </AppModal>
        <SnackBar
          visible={showSnackBar}
          backgroundColor={colors.clearBlue}
          messageColor={colors.white}
          position="bottom"
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

export default connect(
  ({account, order, noti, info, pender, sync, cart}: RootState) => ({
    order,
    account,
    auth: accountActions.auth(account),
    noti,
    info,
    loginPending:
      pender.pending[accountActions.LOGIN] ||
      pender.pending[accountActions.GET_ACCOUNT] ||
      false,
    pending: pender.pending[orderActions.GET_SUBS] || false,
    sync,
    lastTab: cart.lastTab.toJS(),
  }),
  (dispatch) => ({
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
