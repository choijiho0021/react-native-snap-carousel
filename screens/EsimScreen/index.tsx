import React, {useCallback, useEffect, useState} from 'react';
import {Map as ImmutableMap} from 'immutable';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Pressable,
  SafeAreaView,
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
import EsimModal from './components/EsimModal';
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
    backgroundColor: '#d2dfff',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'right',
  },
  ifFirstText: {
    ...appStyles.normal15Text,
    lineHeight: 20,
    color: '#001c65',
  },
  moveToGuideText: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    color: '#001c65',
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

export type SubsListType = {
  subsIccid: string;
  subscription: RkbSubscription[];
};

export const renderInfo = (navigation) => (
  <View style={styles.usrGuideBtn}>
    <View style={styles.rowCenter}>
      <AppSvgIcon name="newFlag" style={{marginRight: 8}} />
      <AppText style={styles.ifFirstText}>{i18n.t('esim:ifFirst')}</AppText>
    </View>
    <Pressable
      style={styles.rowRight}
      onPress={() => navigation.navigate('UserGuide')}>
      <AppText style={styles.moveToGuideText}>
        {i18n.t('esim:moveToGuide')}
      </AppText>
      <AppIcon name="iconArrowRightBlack" />
    </Pressable>
  </View>
);

const EsimScreen: React.FC<EsimScreenProps> = ({
  navigation,
  route,
  action,
  account: {iccid, mobile, token, balance, expDate},
  order,
  pending,
  loginPending,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [subs, setSubs] = useState<RkbSubscription>();
  const [cmiPending, setCmiPending] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [isPressClose, setIsPressClose] = useState(false);
  const [cmiUsage, setCmiUsage] = useState({});
  const [cmiStatus, setCmiStatus] = useState({});
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const isFocused = useIsFocused();
  const [subsList, setSubsList] = useState<SubsListType[]>();

  const init = useCallback(
    ({
      iccid,
      mobile,
      token,
    }: {
      iccid?: string;
      mobile?: string;
      token?: string;
    }) => {
      if (iccid && token) {
        action.order.getSubsWithToast({iccid, token});
      }
      if (mobile && token && !esimGlobal) {
        action.order.getStoreSubsWithToast({mobile, token});
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
          {renderInfo(navigation)}
        </View>
      ),
    [balance, expDate, iccid, navigation],
  );

  const checkCmiData = useCallback(async (item: SubsListType) => {
    const lastIdx = item.subscription.length - 1;
    if (item?.subsIccid && item?.subscription[lastIdx].packageId) {
      const rsp = await API.Subscription.cmiGetSubsUsage({
        iccid: item?.subsIccid,
        packageId: item?.subscription[lastIdx].packageId,
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
          userDataBundles[0]?.dataBundleId !==
          item.subscription[lastIdx].packageId;

        // setCmiStatus({
        //   statusCd: isExpired || isUsedByOther ? 'U' : statusCd,
        //   endTime: exp.format('YYYY.MM.DD HH:mm:ss') || end,
        // });
        // setCmiUsage({
        //   quota: Number(subscriberQuota?.qtavalue) || 0, // Mb
        //   used: Number(subscriberQuota?.qtaconsumption) || 0, // Mb
        // });

        const tempCmiStatus = {
          statusCd: isExpired || isUsedByOther ? 'U' : statusCd || {},
          endTime: exp.format('YYYY.MM.DD HH:mm:ss') || end,
        };

        const tempCmiUsage = {
          quota: Number(subscriberQuota?.qtavalue) || 0, // Mb
          used: Number(subscriberQuota?.qtaconsumption) || 0, // Mb
        };

        return {status: tempCmiStatus, usage: tempCmiUsage};
      }
      if (!item.subsOrderNo || userDataBundles?.length === 0) {
        // setCmiStatus({
        //   statusCd: 'U',
        // });
        return {status: {statusCd: 'U'}, usage: {}};
      }
      setCmiPending(false);
      return {status: {}, usage: {}};
    }
  }, []);

  const checkQuadcellData = useCallback(async (item: SubsListType) => {
    const lastIdx = item.subscription.length - 1;
    if (item?.subscription[lastIdx].imsi) {
      const quadcellStatus = await API.Subscription.quadcellGetData({
        imsi: item.subscription[lastIdx].imsi,
        key: 'hlrstate',
      }).then(async (state) => {
        if (state.result === 0) {
          const tempCmiStatus = await API.Subscription.quadcellGetData({
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

              // setCmiStatus({
              //   // eslint-disable-next-line no-nested-ternary
              //   statusCd: isReserved ? 'R' : isExpired ? 'U' : statusCd,
              //   endTime: exp.format('YYYY.MM.DD HH:mm:ss') || end,
              // });

              return {
                // eslint-disable-next-line no-nested-ternary
                statusCd: isReserved ? 'R' : isExpired ? 'U' : statusCd,
                endTime: exp.format('YYYY.MM.DD HH:mm:ss') || end,
              };
            }
          });
          return tempCmiStatus;
        }
      });

      const quadcellUsage = await API.Subscription.quadcellGetData({
        imsi: item.subscription[lastIdx].imsi,
        key: 'quota',
      }).then(async (rsp) => {
        if (rsp.result === 0) {
          // setCmiUsage({
          //   quota: Number(rsp?.objects?.packQuotaList[0]?.totalQuota) || 0, // Mb
          //   used: Number(rsp?.objects?.packQuotaList[0]?.consumedQuota), // Mb
          // });
          return {
            quota: Number(rsp?.objects?.packQuotaList[0]?.totalQuota) || 0, // Mb
            used: Number(rsp?.objects?.packQuotaList[0]?.consumedQuota), // Mb
          };
        }
      });
      return {status: quadcellStatus, usage: quadcellUsage};
    }
  }, []);

  const onPressUsage = useCallback(
    async (item: SubsListType) => {
      const lastIdx = item.subscription.length - 1;
      setShowModal(true);
      setCmiPending(true);
      setSubs(item.subscription[lastIdx]);

      let result = {status: {}, usage: {}};
      switch (item.subscription[lastIdx].partner) {
        case 'CMI':
          result = await checkCmiData(item);
          break;
        case 'Quadcell':
          result = await checkQuadcellData(item);
          break;
        default:
          result = await checkCmiData(item);
          break;
      }
      setCmiStatus(result.status);
      setCmiUsage(result.usage);
      setCmiPending(false);
      return result;
    },
    [checkCmiData, checkQuadcellData],
  );

  const renderSubs = useCallback(
    ({item}: {item: SubsListType}) => {
      const lastIdx = item.subscription.length - 1;
      return (
        <EsimSubs
          key={item.subscription[lastIdx].key}
          item={item.subscription[lastIdx]}
          expired={
            new Date(item.subscription[lastIdx].expireDate) <= new Date()
          }
          onPressUsage={() => onPressUsage(item)}
          isCharged={item.subscription.length > 1}
          chargedSubs={item.subscription.length > 1 ? item.subscription : []}
        />
      );
    },
    [onPressUsage],
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    init({iccid, mobile, token});
  }, [iccid, init, mobile, navigation, route, token]);

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

  useEffect(() => {
    setSubsList(
      Array.from(
        order.subs.sortBy((s) => s[s.length - 1].purchaseDate).reverse(),
        ([subsIccid, subscription]) => ({
          subsIccid,
          subscription,
        }),
      ),
    );
  }, [order.subs]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={appStyles.header}>
        <AppText style={styles.title}>{i18n.t('esimList')}</AppText>
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
      </View>
      <FlatList
        data={subsList}
        keyExtractor={(item) =>
          item.subscription[item.subscription.length - 1].key.toString()
        }
        ListHeaderComponent={info}
        renderItem={renderSubs}
        // onRefresh={this.onRefresh}
        // refreshing={refreshing}
        extraData={subsList}
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
        item={subs}
      />
    </SafeAreaView>
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
