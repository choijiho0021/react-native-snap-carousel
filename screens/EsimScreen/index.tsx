import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppIcon from '@/components/AppIcon';
import AppSnackBar from '@/components/AppSnackBar';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {navigate} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {
  cmiStatusCd,
  quadcellStatusCd,
  RkbSubscription,
} from '@/redux/api/subscriptionApi';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {
  actions as orderActions,
  OrderAction,
  OrderModelState,
} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import CardInfo from './components/CardInfo';
import EsimSubs from './components/EsimSubs';
import EsimModal, {ModalType} from './components/EsimModal';
import GiftModal from './components/GiftModal';
import AppSvgIcon from '@/components/AppSvgIcon';
import ChargeModal from './components/ChargeModal';

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
  nolist: {
    flex: 1,
    justifyContent: 'center',
  },
  blueText: {
    color: colors.clearBlue,
    textAlign: 'center',
    marginTop: 20,
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },
  usrGuideBtn: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 6,
    paddingHorizontal: 20,
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.iceBlue,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

type EsimScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<ParamListBase, string>;

  loginPending: boolean;
  pending: boolean;
  account: AccountModelState;
  order: OrderModelState;

  action: {
    order: OrderAction;
    account: AccountAction;
  };
};

const EsimScreen: React.FC<EsimScreenProps> = ({
  navigation,
  route,
  action,
  account: {loggedIn, iccid, token, balance, expDate},
  order,
  pending,
  loginPending,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState<ModalType>('');
  const [subs, setSubs] = useState<RkbSubscription>();
  const [cmiPending, setCmiPending] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [isPressClose, setIsPressClose] = useState(false);
  const [cmiUsage, setCmiUsage] = useState({});
  const [cmiStatus, setCmiStatus] = useState({});
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const isFocused = useIsFocused();

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
          setIsFirstLoad(false);
        });
    }
  }, [action.account, action.order, iccid, token]);

  useEffect(() => {
    if (isFocused) {
      onRefresh();
      setIsFirstLoad(true);
    }
  }, [isFocused, onRefresh]);

  const empty = useCallback(
    () => (
      <View style={styles.nolist}>
        <AppIcon name="emptyESIM" size={176} />
        <AppText style={styles.blueText}>{i18n.t('his:noUsage1')}</AppText>
        <AppText style={{color: colors.warmGrey, textAlign: 'center'}}>
          {i18n.t('his:noUsage2')}
        </AppText>
      </View>
    ),
    [],
  );

  const info = useCallback(
    () =>
      esimGlobal ? null : (
        <View>
          <CardInfo
            iccid={iccid}
            balance={balance}
            expDate={expDate}
            navigation={navigation}
          />
          <Pressable
            style={styles.usrGuideBtn}
            onPress={() => navigation.navigate('UserGuide')}>
            <View style={styles.rowCenter}>
              <AppSvgIcon name="flag" style={{marginRight: 11}} />
              <AppText style={appStyles.normal16Text}>
                {i18n.t('esim:moveToGuide')}
              </AppText>
            </View>

            <AppIcon name="iconArrowRightBlack" />
          </Pressable>
        </View>
      ),
    [balance, expDate, iccid, navigation],
  );

  const checkCmiData = useCallback(async (item: RkbSubscription) => {
    if (item?.subsIccid && item?.packageId) {
      const rsp = await API.Subscription.cmiGetSubsUsage({
        iccid: item?.subsIccid,
        packageId: item?.packageId,
      });

      const {result, userDataBundles, subscriberQuota} = rsp;

      if (result?.code === 0 && userDataBundles && userDataBundles[0]) {
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
        setCmiUsage({
          quota: Number(subscriberQuota?.qtavalue) || 0, // Mb
          used: Number(subscriberQuota?.qtaconsumption) || 0, // Mb
        });
      } else if (!item.subsOrderNo || userDataBundles?.length === 0) {
        setCmiStatus({
          statusCd: 'U',
        });
      }
      setCmiPending(false);
    }
  }, []);

  const checkQuadcellData = useCallback(async (item: RkbSubscription) => {
    if (item?.imsi) {
      await API.Subscription.quadcellGetData({
        imsi: item.imsi,
        key: 'hlrstate',
      }).then((state) => {
        if (state.result === 0) {
          API.Subscription.quadcellGetData({
            imsi: item.imsi,
            key: 'info',
          }).then((info) => {
            if (info.result === 0) {
              const statusCd =
                !_.isUndefined(state?.objects?.hlrState) &&
                quadcellStatusCd[state?.objects?.hlrState];

              const end = moment(info?.objects?.effTime, 'YYYYMMDDHHmmss')
                .add(1, 'h')
                .format('YYYY-MM-DD HH:mm:ss');
              const exp = moment(info?.objects?.expTime, 'YYYYMMDDHHmmss').add(
                1,
                'h',
              );

              const isReserved = statusCd === 'A' && exp > moment().add(1, 'y');
              const isExpired = statusCd === 'A' && exp < moment();

              setCmiStatus({
                // eslint-disable-next-line no-nested-ternary
                statusCd: isReserved ? 'R' : isExpired ? 'U' : statusCd,
                endTime: exp.format('YYYY.MM.DD HH:mm:ss') || end,
              });
            }
          });
        }
      });

      await API.Subscription.quadcellGetData({
        imsi: item.imsi,
        key: 'quota',
      }).then(async (rsp) => {
        if (rsp.result === 0) {
          setCmiUsage({
            quota: Number(rsp?.objects?.packQuotaList[0]?.totalQuota) || 0, // Mb
            used: Number(rsp?.objects?.packQuotaList[0]?.consumedQuota), // Mb
          });
        }
      });
    }
  }, []);

  const onPressUsage = useCallback(
    async (item: RkbSubscription) => {
      setShowModal(true);
      setCmiPending(true);
      setModal('usage');
      setSubs(item);

      switch (item.partner) {
        case 'CMI':
          await checkCmiData(item);
          break;
        case 'Quadcell':
          await checkQuadcellData(item);
          break;
        default:
          await checkCmiData(item);
          break;
      }
      setCmiPending(false);
    },
    [checkCmiData, checkQuadcellData],
  );

  const onPressCharge = useCallback(() => {
    setShowModal(true);
    setModal('charge');
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
          onPressUsage={() => onPressUsage(item)}
          onPressCharge={() => onPressCharge()}
        />
      );
    },
    [onPressCharge, onPressUsage],
  );

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppText style={styles.title}>{i18n.t('esimList')}</AppText>
      ),
      headerRight: () => (
        <AppSvgIcon
          name="btnCnter"
          style={styles.btnCnter}
          onPress={() =>
            navigate(navigation, route, 'EsimStack', {
              tab: 'HomeStack',
              screen: 'Contact',
            })
          }
        />
      ),
    });
    init({iccid, token});
  }, [iccid, init, navigation, route, token]);

  useEffect(() => {
    async function checkShowModal() {
      const item = await AsyncStorage.getItem('gift.show.modal');
      const tm = moment(item, 'YYYY-MM-DD HH:mm:ss');
      if (
        (!tm.isValid() || tm.add(7, 'day').isBefore(moment())) &&
        isFocused &&
        !isPressClose
      ) {
        setShowGiftModal(true);
      } else {
        setShowGiftModal(false);
      }
    }
    checkShowModal();
  }, [isFocused, isPressClose]);

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
            refreshing={refreshing && !isFirstLoad}
            onRefresh={onRefresh}
            colors={[colors.clearBlue]} // android 전용
            tintColor={colors.clearBlue} // ios 전용
          />
        }
      />
      <AppActivityIndicator
        visible={isFirstLoad && (pending || loginPending || refreshing)}
      />
      <EsimModal
        visible={showModal}
        modal={modal}
        subs={subs}
        cmiPending={cmiPending}
        cmiUsage={cmiUsage}
        cmiStatus={cmiStatus}
        onOkClose={() => {
          setShowModal(false);
          setCmiStatus({});
          setCmiUsage({});
        }}
      />
      <GiftModal
        visible={showGiftModal}
        onOkClose={() => {
          setShowGiftModal(false);
          setIsPressClose(true);
        }}
      />
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('usim:failSnackBar')}
      />
      <ChargeModal
        visible={showChargeModal}
        onOkClose={() => {
          setShowChargeModal(false);
          setIsPressClose(true);
        }}
      />
    </View>
  );
};

export default connect(
  ({account, order, status}: RootState) => ({
    order,
    account,
    loginPending:
      status.pending[accountActions.logInAndGetAccount.typePrefix] ||
      status.pending[accountActions.getAccount.typePrefix] ||
      false,
    pending:
      status.pending[orderActions.getSubs.typePrefix] ||
      status.pending[orderActions.cmiGetSubsUsage.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(EsimScreen);
