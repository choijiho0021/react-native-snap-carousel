import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
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
import {ProductModelState} from '@/redux/modules/product';
import EsimModal, {ModalType} from './components/EsimModal';
import GiftModal from './components/GiftModal';
import AppSvgIcon from '@/components/AppSvgIcon';

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
    paddingBottom: 60,
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
});

type EsimScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<ParamListBase, string>;

  loginPending: boolean;
  pending: boolean;
  account: AccountModelState;
  order: OrderModelState;
  product: ProductModelState;

  action: {
    order: OrderAction;
    account: AccountAction;
  };
};

const EsimScreen: React.FC<EsimScreenProps> = ({
  navigation,
  route,
  action,
  account: {iccid, token, balance, expDate},
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
  const [cmiPending, setCmiPending] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [cmiUsage, setCmiUsage] = useState({});
  const [cmiStatus, setCmiStatus] = useState({});
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

  const empty = useCallback(
    () => (
      <View style={styles.nolist}>
        <AppIcon name="emptyESIM" />
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
        <CardInfo
          iccid={iccid}
          balance={balance}
          expDate={expDate}
          navigation={navigation}
        />
      ),
    [balance, expDate, iccid, navigation],
  );

  const getCmiSubsUsage = useCallback(
    async (usageIccid, packageId, childOrderId, item) => {
      const rsp = await API.Subscription.cmiGetSubsUsage({
        iccid: usageIccid,
        packageId,
        childOrderId,
      });

      if (rsp?.result === 0 && rsp?.objects) {
        const daily = item.prodId && prodList.get(item.prodId)?.field_daily;
        const subscriberQuota = rsp?.objects?.find(
          (v) => !_.isEmpty(v?.subscriberQuota),
        )?.subscriberQuota;

        const used = rsp.objects.reduce((acc: number, cur) => {
          // himsi
          if (!_.isEmpty(cur?.subscriberQuota))
            return (
              acc + Number(cur?.subscriberQuota?.qtaconsumption || 0) / 1024
            );
          // vimsi
          if (daily === 'daily') {
            return (
              acc +
              Number(
                cur?.historyQuota?.find(
                  (v) => v?.time === moment().format('YYYYMMDD'),
                )?.qtaconsumption || 0,
              )
            );
          }

          return (
            acc +
            cur?.historyQuota.reduce((a, c) => a + Number(c?.qtaconsumption), 0)
          );
        }, 0);

        setCmiUsage({
          quota: Number(subscriberQuota?.qtavalue) || 0, // Mb
          used, // Mb
        });
      }
    },
    [prodList],
  );

  const checkCmiData = useCallback(
    async (item: RkbSubscription) => {
      // {"subscriberQuota":{"qtavalue":"512000","qtabalance":"73042","qtaconsumption":"438958"},"historyQuota":[{"time":"20211222","qtaconsumption":"376.44","mcc":"452"},{"time":"20211221","qtaconsumption":"1454.78","mcc":"452"}],"result":{"code":0},"trajectoriesList":[{"mcc":"452","country":"Vietnam","beginTime":"20211221","useTime":"20220120","himsi":"454120382118109"}]}
      const usageRsp = {};

      if (item?.subsIccid && item?.packageId) {
        // expire time은 사용시작 이후에 발생
        // 사용 시작 했고, expireTime을 지났어도 'E' 로 바뀌지 않음.  endTime이후 'E'
        await API.Subscription.cmiGetSubsStatus({
          iccid: item.subsIccid,
        }).then(async (rsp) => {
          const userDataBundles = rsp?.objects?.userDataBundles;
          if (rsp?.result === 0 && userDataBundles[0]) {
            await getCmiSubsUsage(
              item?.subsIccid,
              item?.packageId,
              userDataBundles[0]?.subscriptionKey,
              item,
            );

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
        // setCmiPending(false);
      }
    },
    [getCmiSubsUsage],
  );

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
      if (!tm.isValid() || tm.add(7, 'day').isBefore(moment()))
        setShowGiftModal(true);
    }
    checkShowModal();
  }, []);

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
        onOkClose={() => setShowGiftModal(false)}
      />
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('usim:failSnackBar')}
      />
    </View>
  );
};

export default connect(
  ({account, order, status, product}: RootState) => ({
    order,
    account,
    product,
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
