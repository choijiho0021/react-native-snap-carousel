import React, {useCallback, useEffect, useState} from 'react';
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
  sortSubs,
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
    paddingHorizontal: 20,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#d2dfff',
    borderRadius: 3,
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
  esimHeader: {
    height: 56,
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

export const renderInfo = (navigation) => (
  <Pressable
    style={styles.usrGuideBtn}
    onPress={() => navigation.navigate('UserGuide')}>
    <View style={styles.rowCenter}>
      <AppSvgIcon name="newFlag" style={{marginRight: 8}} />
      <AppText style={styles.ifFirstText}>{i18n.t('esim:ifFirst')}</AppText>
    </View>
    <View style={styles.rowRight}>
      <AppText style={styles.moveToGuideText}>
        {i18n.t('esim:moveToGuide')}
      </AppText>
      <AppIcon name="iconArrowRightBlack" />
    </View>
  </Pressable>
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
  const [isPressClose, setIsPressClose] = useState(false);
  const [cmiUsage, setCmiUsage] = useState({});
  const [cmiStatus, setCmiStatus] = useState({});
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const isFocused = useIsFocused();
  const [subsList, setSubsList] = useState<RkbSubscription[][]>();

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

  const checkCmiData = useCallback(async (item: RkbSubscription) => {
    if (item?.subsIccid && item?.packageId) {
      const rsp = await API.Subscription.cmiGetSubsUsage({
        iccid: item?.subsIccid,
        orderId: item?.subsOrderNo || 'noOrderId',
      });

      const {result, userDataBundles, subscriberQuota} = rsp || {};

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
        return {status: {statusCd: 'U'}, usage: {}};
      }
      setCmiPending(false);
      return {status: {}, usage: {}};
    }
  }, []);

  const checkQuadcellData = useCallback(async (item: RkbSubscription) => {
    if (item?.imsi) {
      const quadcellStatus = await API.Subscription.quadcellGetData({
        imsi: item.imsi,
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
        imsi: item.imsi,
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
    async (item: RkbSubscription) => {
      setCmiPending(true);
      setSubs(item);

      let result = {status: {}, usage: {}};
      switch (item.partner) {
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
    ({item}: {item: RkbSubscription[]}) => {
      return (
        <EsimSubs
          key={item[0].key}
          mainSubs={item[0]}
          expired={new Date(item[0].expireDate) <= new Date()}
          onPressUsage={(subscription: RkbSubscription) =>
            onPressUsage(subscription)
          }
          setShowModal={(visible: boolean) => setShowModal(visible)}
          isCharged={item.length > 1}
          chargedSubs={item}
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
      setShowGiftModal(
        (!tm.isValid() || tm.add(7, 'day').isBefore(moment())) &&
          isFocused &&
          !isPressClose,
      );
    }
    checkShowModal();
  }, [isFocused, isPressClose]);

  useEffect(() => {
    setSubsList(
      Array.from(order.subs.sort(sortSubs), ([, subscription]) => subscription),
    );
  }, [order.subs]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[appStyles.header, styles.esimHeader]}>
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
        keyExtractor={(item) => item[item.length - 1].key.toString()}
        ListHeaderComponent={info}
        renderItem={renderSubs}
        // onRefresh={this.onRefresh}
        // refreshing={refreshing}
        extraData={subsList}
        contentContainerStyle={[
          {paddingBottom: 34},
          _.isEmpty(subsList) && {flex: 1},
        ]}
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
          setCmiPending(false);
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
