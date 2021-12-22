import Clipboard from '@react-native-community/clipboard';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppButton from '@/components/AppButton';
import AppColorText from '@/components/AppColorText';
import AppIcon from '@/components/AppIcon';
import AppModal from '@/components/AppModal';
import AppSnackBar from '@/components/AppSnackBar';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
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
import CardInfo from './components/CardInfo';
import EsimSubs from './components/EsimSubs';
import {API} from '@/redux/api';

const {esimGlobal} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
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
    justifyContent: 'center',
    paddingBottom: 60,
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

const EsimScreen: React.FC<EsimScreenProps> = ({
  account: {iccid, token, balance, expDate},
  navigation,
  action,
  order,
  pending,
  loginPending,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState<ModalType>();
  const [subs, setSubs] = useState<RkbSubscription>();
  const [copyString, setCopyString] = useState('');

  const onRefresh = useCallback(() => {
    if (iccid) {
      setRefreshing(true);

      action.order
        .getSubsWithToast({iccid, token})
        .then(() => {
          action.account.getAccount({iccid, token});
        })
        .finally(() => {
          setRefreshing(false);
        });
    }
  }, [action.account, action.order, iccid, token]);

  const copyToClipboard = useCallback(
    (value?: string) => () => {
      console.log('@@@ copy', value);
      if (value) {
        Clipboard.setString(value);
        setCopyString(value);
        action.toast.push(Toast.COPY_SUCCESS);
      }
    },
    [action.toast],
  );

  const empty = useCallback(() => {
    return (
      <View style={styles.nolist}>
        <AppIcon name="emptyESIM" />
        <AppText style={styles.blueText}>{i18n.t('his:noUsage1')}</AppText>
        <AppText style={{color: colors.warmGrey, textAlign: 'center'}}>
          {i18n.t('his:noUsage2')}
        </AppText>
      </View>
    );
  }, []);

  const info = useCallback(() => {
    if (esimGlobal) return null;

    return (
      <CardInfo
        iccid={iccid}
        balance={balance}
        expDate={expDate}
        navigation={navigation}
      />
    );
  }, [balance, expDate, iccid, navigation]);

  const copyInfo = useCallback(
    (title: string, valToCopy?: string) => {
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
            onPress={copyToClipboard(valToCopy)}
          />
        </View>
      );
    },
    [copyString, copyToClipboard],
  );

  const init = useCallback(
    ({iccid, token}: {iccid?: string; token?: string}) => {
      if (iccid && token) {
        action.order.getSubsWithToast({iccid, token});
      }
    },
    [action.order],
  );

  const modalBody = useCallback(() => {
    if (!subs) return null;

    if (modal === 'showQR') {
      return showQR(subs);
    }

    return (
      <View style={styles.modalBody}>
        {esimManualInputInfo()}
        {copyInfo('smdp', subs.smdpAddr)}
        {copyInfo('actCode', subs.actCode)}
      </View>
    );
  }, [copyInfo, modal, subs]);

  const onPressUsage = useCallback(() => {
    console.log('@@@ check usage');

    API.Subscription.cmiGetSubsUsage({
      iccid: '89852340003821181097',
      packageId: 'D190129023743_83416',
    });
  }, []);

  const renderSubs = useCallback(
    ({item}: {item: RkbSubscription}) => {
      return (
        <EsimSubs
          key={item.key}
          item={item}
          expired={new Date(item.expireDate) <= new Date()}
          onPressQR={(qr: boolean) => {
            setShowModal(true);
            setModal(qr ? 'showQR' : 'manual');
            setSubs(item);
          }}
          onPressUsage={onPressUsage}
        />
      );
    },
    [onPressUsage],
  );

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppText style={styles.title}>{i18n.t('esimList')}</AppText>
      ),
    });
    init({iccid, token});
  }, [iccid, init, navigation, token]);

  return (
    <View style={styles.container}>
      <FlatList
        data={order.subs}
        keyExtractor={(item) => item.key.toString()}
        ListHeaderComponent={info}
        renderItem={renderSubs}
        // onRefresh={this.onRefresh}
        // refreshing={refreshing}
        extraData={order.subs}
        contentContainerStyle={_.isEmpty(order.subs) && {flex: 1}}
        ListEmptyComponent={empty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.clearBlue]} // android 전용
            tintColor={colors.clearBlue} // ios 전용
          />
        }
      />
      <AppActivityIndicator visible={pending || loginPending} />
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
        onOkClose={() => setShowModal(false)}
        visible={showModal}>
        {modalBody()}
      </AppModal>
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('usim:failSnackBar')}
      />
    </View>
  );
};

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
