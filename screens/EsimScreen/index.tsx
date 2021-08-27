import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppButton from '@/components/AppButton';
import AppColorText from '@/components/AppColorText';
import AppIcon from '@/components/AppIcon';
import AppModal from '@/components/AppModal';
import AppSnackBar from '@/components/AppSnackBar';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions} from '@/redux/modules/cart';
import {actions as infoActions} from '@/redux/modules/info';
import {actions as notiActions} from '@/redux/modules/noti';
import {
  actions as orderActions,
  OrderAction,
  OrderModelState,
} from '@/redux/modules/order';
import {
  actions as toastActions,
  Toast,
  ToastAction,
} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import Clipboard from '@react-native-community/clipboard';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import CardInfo from './components/CardInfo';
import EsimSubs from './components/EsimSubs';

const styles = StyleSheet.create({
  container: {flex: 1},
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
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
    fontSize: 20,
  },
  esimInfoKey: {
    ...appStyles.normal16Text,
    color: colors.warmGrey,
    marginBottom: 6,
  },
  btnCopy: {
    backgroundColor: colors.white,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  modalBody: {
    marginVertical: 20,
  },
  normal16BlueText: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
  },
  blueText: {
    color: colors.clearBlue,
    textAlign: 'center',
    marginTop: 20,
  },
});

const showQR = (subs: RkbSubscription) => {
  return (
    <View style={styles.modalBody}>
      {_.isEmpty(subs.qrCode) ? (
        <View style={styles.center}>
          <AppText>{i18n.t('esim:showQR:nothing')}</AppText>
        </View>
      ) : (
        <View>
          <AppColorText
            style={appStyles.normal16Text}
            text={i18n.t('esim:showQR:body')}
          />
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
      <AppColorText
        style={appStyles.normal16Text}
        text={i18n.t('esim:manualInput:body')}
      />
    </View>
  );
};

type EsimScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Esim'>;

type EsimScreenRouteProp = RouteProp<HomeStackParamList, 'Esim'>;

type EsimScreenProps = {
  navigation: EsimScreenNavigationProp;
  route: EsimScreenRouteProp;

  loginPending: boolean;
  pending: boolean;
  account: AccountModelState;
  order: OrderModelState;

  action: {
    toast: ToastAction;
    order: OrderAction;
    account: AccountAction;
  };
};

export type ModalType = 'showQR' | 'manual';

type EsimScreenState = {
  refreshing: boolean;
  showSnackBar: boolean;
  showModal: boolean;
  modal?: ModalType;
  subs?: RkbSubscription;
  copyString: string;
};

class EsimScreen extends Component<EsimScreenProps, EsimScreenState> {
  constructor(props: EsimScreenProps) {
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
    this.showModal = this.showModal.bind(this);
    this.modalBody = this.modalBody.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  componentDidMount() {
    const {
      account: {iccid, token},
    } = this.props;

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppText style={styles.title}>{i18n.t('esimList')}</AppText>
      ),
    });

    this.init({iccid, token});
  }

  onRefresh() {
    const {
      account: {iccid, token},
    } = this.props;

    if (iccid) {
      this.setState({
        refreshing: true,
      });

      this.props.action.order
        .getSubsWithToast({iccid, token})
        .then(() => {
          this.props.action.account.getAccount({iccid, token});
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
        {this.copyInfo('smdp', subs.smdpAddr)}
        {this.copyInfo('actCode', subs.actCode)}
      </View>
    );
  };

  copyToClipboard = (value?: string) => () => {
    console.log('@@@ copy', value);
    if (value) {
      Clipboard.setString(value);
      this.setState({copyString: value});
      this.props.action.toast.push(Toast.COPY_SUCCESS);
    }
  };

  empty = () => {
    if (this.props.pending) return null;

    return (
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row'}}>{this.info()}</View>
        <View style={styles.nolist}>
          <AppIcon name="emptyESIM" />
          <AppText style={styles.blueText}>{i18n.t('his:noUsage1')}</AppText>
          <AppText style={{color: colors.warmGrey, textAlign: 'center'}}>
            {i18n.t('his:noUsage2')}
          </AppText>
        </View>
      </View>
    );
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

  showModal(flag: boolean, modal?: ModalType, subs?: RkbSubscription) {
    this.setState({showModal: flag, modal, subs});
  }

  copyInfo(title: string, valToCopy?: string) {
    const {copyString} = this.state;
    const selected = copyString === valToCopy;

    return (
      <View style={styles.titleAndStatus}>
        <View style={{flex: 1}}>
          <AppText style={styles.esimInfoKey}>
            {i18n.t(`esim:${title}`)}
          </AppText>
          <AppText style={appStyles.normal16Text}>{valToCopy}</AppText>
        </View>
        <AppButton
          title={i18n.t('copy')}
          titleStyle={[
            appStyles.normal14Text,
            {color: selected ? colors.clearBlue : colors.black},
          ]}
          style={[
            styles.btnCopy,
            {
              borderColor: selected ? colors.clearBlue : colors.whiteTwo,
            },
          ]}
          onPress={this.copyToClipboard(valToCopy)}
        />
      </View>
    );
  }

  init({iccid, token}: {iccid?: string; token?: string}) {
    if (iccid && token) {
      this.props.action.order.getSubsWithToast({iccid, token});
    }
  }

  renderSubs({item}: {item: RkbSubscription}) {
    return (
      <EsimSubs
        key={item.key}
        item={item}
        expired={new Date(item.expireDate) <= new Date()}
        onPress={(qr: boolean) =>
          this.showModal(true, qr ? 'showQR' : 'manual', item)
        }
      />
    );
  }

  render() {
    const {subs} = this.props.order;
    const {refreshing, showSnackBar, showModal, modal} = this.state;

    return _.isEmpty(subs) ? (
      this.empty()
    ) : (
      <View style={styles.container}>
        <View style={{backgroundColor: colors.whiteTwo}}>
          <FlatList
            data={subs}
            keyExtractor={(item) => item.key.toString()}
            ListHeaderComponent={this.info}
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
          justifyContent="flex-end"
          titleIcon={modal === 'showQR' ? 'btnQr' : 'btnPen'}
          titleStyle={styles.titleStyle}
          title={
            modal === 'showQR'
              ? i18n.t('esim:showQR:title')
              : i18n.t('esim:manualInput:title')
          }
          contentStyle={{
            marginHorizontal: 0,
            backgroundColor: 'white',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            padding: 20,
          }}
          onOkClose={() => this.showModal(false)}
          visible={showModal}>
          {this.modalBody()}
        </AppModal>
        <AppSnackBar
          visible={showSnackBar}
          onClose={() => this.setState({showSnackBar: false})}
          textMessage={i18n.t('usim:failSnackBar')}
        />
      </View>
    );
  }
}

export default connect(
  ({account, order, noti, info, status, sync, cart}: RootState) => ({
    order,
    account,
    auth: accountActions.auth(account),
    noti,
    info,
    loginPending:
      status.pending[accountActions.logInAndGetAccount.typePrefix] ||
      status.pending[accountActions.getAccount.typePrefix] ||
      false,
    pending: status.pending[orderActions.getSubs.typePrefix] || false,
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
