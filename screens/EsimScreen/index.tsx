import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
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
  bcStatusCd,
  cmiStatusCd,
  RkbSubscription,
  sortSubs,
  StatusObj,
  UsageObj,
  Usage,
  getLatestExpireDateSubs,
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
import ChatTalk from '@/components/ChatTalk';
import {utils} from '@/utils/utils';

const {esimGlobal, isIOS} = Env.get();

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
    alignItems: 'center',
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
    ...appStyles.semiBold15Text,
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

export const USAGE_TIME_INTERVAL = {
  cmi: 9,
  quadcell: 1,
  billionconnect: 1,
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
  const flatListRef = useRef<FlatList>();
  const [subsList, setSubsList] = useState<RkbSubscription[][]>();
  const tabBarHeight = useBottomTabBarHeight();

  const init = useCallback(
    (initInfo: {iccid?: string; mobile?: string; token?: string}) => {
      const {iccid: initIccid, mobile: initMobile, token: initToken} = initInfo;

      if (initIccid && initToken) {
        action.order.getSubsWithToast({iccid: initIccid, token: initToken});
      }
      if (initMobile && initToken && !esimGlobal) {
        action.order.getStoreSubsWithToast({
          mobile: initMobile,
          token: initToken,
        });
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
          if (!esimGlobal) {
            action.order.getStoreSubsWithToast({mobile, token});
          }
          action.account.getAccount({iccid, token});
        })
        .finally(() => {
          setRefreshing(false);
          setIsFirstLoad(false);
        });
    }
  }, [action.account, action.order, iccid, mobile, token]);

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

  const checkCmiData = useCallback(
    async (
      item: RkbSubscription,
    ): Promise<{status: StatusObj; usage: UsageObj}> => {
      if (item?.subsIccid && item?.packageId) {
        const {result, objects} = await API.Subscription.cmiGetSubsUsage({
          iccid: item?.subsIccid,
          orderId: item?.subsOrderNo || 'noOrderId',
        });

        if (result?.code === 0 && objects.length > 0) return objects[0];
      }
      return {
        status: {statusCd: undefined, endTime: undefined},
        usage: {quota: undefined, used: undefined},
      };
    },
    [],
  );

  const checkQuadcellData = useCallback(
    async (item: RkbSubscription): Promise<Usage> => {
      if (item?.imsi) {
        const {result, objects} = await API.Subscription.quadcellGetUsage({
          // imsi: item.imsi,
          imsi: '454070042536493',
        });

        if (result === 0 && objects.length > 0) return objects[0];
      }
      return {
        status: {statusCd: undefined, endTime: undefined},
        usage: {quota: undefined, used: undefined},
      };
    },
    [],
  );

  const checkBcData = useCallback(
    async (
      item: RkbSubscription,
    ): Promise<{status: StatusObj; usage: UsageObj}> => {
      if (item?.subsIccid) {
        const resp = await API.Subscription.bcGetSubsUsage({
          subsIccid: item.subsIccid,
          orderId: item.subsOrderNo,
        });

        if (
          resp?.result === 0 &&
          resp?.objects?.tradeCode === '1000' &&
          resp?.objects?.tradeData?.subOrderList?.length > 0
        ) {
          const planInfo = resp.objects.tradeData?.subOrderList[0];

          const bcStatus: StatusObj = {
            statusCd: bcStatusCd[planInfo.planStatus],
            endTime: moment(planInfo.planEndTime, 'YYYY-MM-DD HH:mm:ss')
              .add(USAGE_TIME_INTERVAL.billionconnect, 'h')
              .format('YYYY-MM-DD HH:mm:ss'),
          };

          const usage = planInfo.usageInfoList.reduce(
            (acc, cur) => acc + Number(cur.usageAmt),
            0,
          );

          const bcUsage: UsageObj = {
            quota: Number(planInfo.highFlowSize) / 1024 || 0, // Mb
            used: usage / 1024 || 0, // Mb
          };

          return {status: bcStatus, usage: bcUsage};
        }
      }
      return {
        status: {statusCd: undefined, endTime: undefined},
        usage: {quota: undefined, used: undefined},
      };
    },
    [],
  );

  const onPressUsage = useCallback(
    async (item: RkbSubscription) => {
      setCmiPending(true);
      setSubs(item);

      let result = {status: {}, usage: {}};
      switch (item.partner) {
        case 'cmi':
          result = await checkCmiData(item);
          break;
        case 'quadcell':
          result = await checkQuadcellData(item);
          break;
        case 'billionconnect':
          result = await checkBcData(item);
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
    [checkBcData, checkCmiData, checkQuadcellData],
  );

  const renderSubs = useCallback(
    ({item, index}: {item: RkbSubscription[]; index: number}) => {
      return (
        <EsimSubs
          key={item[0].key}
          flatListRef={flatListRef}
          index={index}
          mainSubs={item[0]}
          chargedSubs={item}
          expired={moment(getLatestExpireDateSubs(item).expireDate).isBefore(
            moment(),
          )}
          isChargeExpired={moment(item[0].expireDate).isBefore(moment())}
          isCharged={item.length > 1}
          showDetail={
            index === 0 &&
            moment(item[item.length - 1].purchaseDate).isAfter(
              moment().subtract(14, 'days'),
            )
          }
          onPressUsage={(subscription: RkbSubscription) =>
            onPressUsage(subscription)
          }
          setShowModal={(visible: boolean) => setShowModal(visible)}
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
    setSubsList(order.subs.valueSeq().toArray().sort(sortSubs));
  }, [order.subs]);

  useEffect(() => {
    if (route && route.params) {
      const {iccid} = route.params;
      if (iccid) {
        const filter: RkbSubscription[] =
          subsList
            ?.find((s) => s[0].subsIccid === iccid)
            ?.filter((s2) => s2.subsIccid === iccid) || [];

        const main = filter
          ?.filter((item) => item.prodType === 'esim_product')
          ?.sort((a, b) =>
            moment(a.purchaseDate).diff(moment(b.purchaseDate)),
          )[0];

        if (main) {
          const {expireDate} = filter?.reduce((oldest, current) => {
            const oldestDateObj = new Date(oldest.expireDate);
            const currentDateObj = new Date(current.expireDate);

            if (currentDateObj > oldestDateObj) {
              return current;
            }
            return oldest;
          });

          navigation.setParams({iccid: undefined});

          navigation.navigate('ChargeHistory', {
            mainSubs: main,
            chargeablePeriod: utils.toDateString(
              main?.expireDate,
              'YYYY.MM.DD',
            ),
            onPressUsage,
            chargedSubs: filter,
            isChargeable: !moment(main?.expireDate).isBefore(moment()),
            expireTime: expireDate,
          });
        }
      }
    }
  }, [navigation, onPressUsage, route, subsList]);

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
        ref={flatListRef}
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
        onScrollToIndexFailed={(rsp) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef?.current?.scrollToIndex({
              index: rsp.index,
              animated: true,
            });
          });
        }}
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
      {!esimGlobal && (
        <GiftModal
          visible={showGiftModal}
          onOkClose={() => {
            setShowGiftModal(false);
            setIsPressClose(true);
          }}
        />
      )}
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('service:ready')}
        bottom={10}
      />
      <ChatTalk visible bottom={(isIOS ? 100 : 70) - tabBarHeight} />
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
