import Clipboard from '@react-native-community/clipboard';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import moment from 'moment';
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
import {API} from '@/redux/api';
import {cmiStatusCd, RkbSubscription} from '@/redux/api/subscriptionApi';
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
import UsageItem from '@/screens/UsimScreen/components/UsageItem';
import i18n from '@/utils/i18n';
import CardInfo from './components/CardInfo';
import EsimSubs from './components/EsimSubs';
import {ProductModelState} from '@/redux/modules/product';

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

type EsimScreenProps = {
  navigation: EsimScreenNavigationProp;

  loginPending: boolean;
  pending: boolean;
  account: AccountModelState;
  order: OrderModelState;
  product: ProductModelState;

  action: {
    toast: ToastAction;
    order: OrderAction;
    account: AccountAction;
  };
};

export type ModalType = 'showQR' | 'manual' | 'usage';
const modalTitleIcon = {showQR: 'btnQr', manual: 'btnPen', usage: undefined};

const EsimScreen: React.FC<EsimScreenProps> = ({
  account: {iccid, token, balance, expDate},
  navigation,
  action,
  order,
  product: {prodList},
  pending,
  loginPending,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState<ModalType>('');
  const [subs, setSubs] = useState<RkbSubscription>();
  const [copyString, setCopyString] = useState('');
  const [cmiUsage, setCmiUsage] = useState({});
  const [cmiStatus, setCmiStatus] = useState({});
  const modalHeadTitle = useMemo(() => {
    switch (modal) {
      case 'showQR':
        return i18n.t('esim:showQRTitle');

      case 'manual':
        return i18n.t('esim:manualInputTitle');

      default:
        return undefined;
    }
  }, [modal]);

  const init = useCallback(
    ({iccid, token}: {iccid?: string; token?: string}) => {
      if (iccid && token) {
        action.order.getSubsWithToast({iccid, token});
      }
    },
    [action.order],
  );

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

  const modalBody = useCallback(() => {
    if (!subs) return null;
    // const cmiUsage = {
    //   subscriberQuota: {
    //     qtavalue: '512000',
    //     qtabalance: '73042',
    //     qtaconsumption: '438958',
    //   },
    //   // 여기가 []면 미사용
    //   historyQuota: [
    //     {time: '20211222', qtaconsumption: '376.44', mcc: '452'},
    //     {time: '20211221', qtaconsumption: '1454.78', mcc: '452'},
    //   ],
    //   result: {code: 0},
    //   // 여기가 []면 미사용
    //   trajectoriesList: [
    //     {
    //       mcc: '452',
    //       country: 'Vietnam',
    //       beginTime: '20211221',
    //       useTime: '20220120',
    //       himsi: '454120382118109',
    //     },
    //   ],
    // };

    switch (modal) {
      case 'showQR':
        return showQR(subs);

      case 'manual':
        return (
          <View style={styles.modalBody}>
            {esimManualInputInfo()}
            {copyInfo('smdp', subs.smdpAddr)}
            {copyInfo('actCode', subs.actCode)}
          </View>
        );

      default: {
        const quota = cmiUsage?.quota;
        const used = cmiUsage?.used;
        const statusCd =
          _.isEmpty(quota) && !_.isEmpty(used) ? 'U' : cmiStatus?.statusCd;

        // usage
        return (
          cmiStatus &&
          cmiUsage && (
            <UsageItem
              item={subs}
              onPress={() => {}}
              showSnackbar={() => {}}
              usage={{quota, used}}
              cmiStatusCd={statusCd}
              endTime={cmiStatus?.endTime}
            />
          )
        );
      }
    }
  }, [cmiStatus, cmiUsage, copyInfo, modal, subs]);

  const onPressUsage = useCallback(
    async (item: RkbSubscription) => {
      // {"subscriberQuota":{"qtavalue":"512000","qtabalance":"73042","qtaconsumption":"438958"},"historyQuota":[{"time":"20211222","qtaconsumption":"376.44","mcc":"452"},{"time":"20211221","qtaconsumption":"1454.78","mcc":"452"}],"result":{"code":0},"trajectoriesList":[{"mcc":"452","country":"Vietnam","beginTime":"20211221","useTime":"20220120","himsi":"454120382118109"}]}
      setShowModal(true);
      setModal('usage');
      setSubs(item);
      let usageRsp = {};

      if (item?.subsIccid && item?.packageId) {
        await API.Subscription.cmiGetSubsUsage({
          iccid: item?.subsIccid,
          packageId: item?.packageId,
        }).then(async (rsp) => {
          usageRsp = rsp;
          if (rsp?.result === 0 && rsp?.objects) {
            const daily = item.prodId && prodList.get(item.prodId)?.field_daily;
            const subscriberQuota = rsp?.objects?.find(
              (v) => !_.isEmpty(v?.subscriberQuota),
            )?.subscriberQuota;

            const used = rsp.objects.reduce((acc, cur) => {
              // himsi
              if (!_.isEmpty(cur?.subscriberQuota))
                return (
                  acc + Number(cur?.subscriberQuota?.qtaconsumption) / 1024
                );
              // vimsi
              if (daily)
                return (
                  acc +
                  Number(
                    cur?.historyQuota?.find(
                      (v) => v?.time === moment().format('YYYYMMDD'),
                    )?.qtaconsumption || 0,
                  )
                );

              return (
                acc +
                cur?.historyQuota.reduce(
                  (a, c) => a + Number(c?.qtaconsumption),
                  0,
                )
              );
            }, 0);

            setCmiUsage({
              quota: Number(subscriberQuota?.qtavalue) / 1024, // Mb
              used, // Mb
            });
          }
        });

        // expire time은 사용시작 이후에 발생
        // 사용 시작 했고, expireTime을 지났어도 'E' 로 바뀌지 않음.  endTime이후 'E'
        await API.Subscription.cmiGetSubsStatus({
          iccid: item.subsIccid,
        }).then((rsp) => {
          const userDataBundles = rsp?.objects?.userDataBundles;
          if (rsp?.result === 0 && userDataBundles[0]) {
            const statusCd =
              !_.isUndefined(userDataBundles[0]?.status) &&
              cmiStatusCd[userDataBundles[0]?.status];
            const end = moment(userDataBundles[0]?.endTime)
              .add(9, 'h')
              .format('YYYY.MM.DD HH:mm:ss');
            const exp = moment(userDataBundles[0]?.expireTime).add(9, 'h');
            const now = moment();

            const isExpired = statusCd === 'A' && exp < now;
            // cancel 된 후, 다른 사용자에게 iccid가 넘어갔을 경우 packageId로 확인
            const isUsedByOther =
              userDataBundles[0]?.dataBundleId !== item.packageId;

            setCmiStatus({
              statusCd: isExpired || isUsedByOther ? 'U' : statusCd,
              endTime: exp.format('YYYY.MM.DD HH:mm:ss') || end,
            });
          } else if (
            // cancel되고 다른 사용자에게 iccid가 할당되지 않은 상태
            usageRsp?.result === 0 &&
            _.isEmpty(usageRsp?.objects) &&
            rsp?.result === 0
          ) {
            if (userDataBundles.length === 0) {
              setCmiStatus({
                statusCd: 'U',
              });
            }
          }
        });
      }
    },
    [prodList],
  );

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
          onPressUsage={() => onPressUsage(item)}
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

  const esimModal = useCallback(() => {
    return (
      <AppModal
        type="close"
        justifyContent="flex-end"
        titleIcon={modalTitleIcon[modal]}
        titleStyle={styles.titleStyle}
        title={modalHeadTitle}
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
    );
  }, [modal, modalBody, modalHeadTitle, showModal]);

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
      {esimModal()}
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('usim:failSnackBar')}
      />
    </View>
  );
};

export default connect(
  ({account, order, noti, info, status, sync, cart, product}: RootState) => ({
    order,
    account,
    auth: accountActions.auth(account),
    noti,
    info,
    product,
    loginPending:
      status.pending[accountActions.logInAndGetAccount.typePrefix] ||
      status.pending[accountActions.getAccount.typePrefix] ||
      false,
    pending:
      status.pending[orderActions.getSubs.typePrefix] ||
      status.pending[orderActions.cmiGetSubsUsage.typePrefix] ||
      false,
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
