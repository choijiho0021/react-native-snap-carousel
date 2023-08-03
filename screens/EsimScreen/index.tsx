import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
  RkbSubscription,
  StatusObj,
  UsageObj,
  Usage,
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
import EsimDraftSubs from './components/EsimDraftSubs';
import {RkbOrder} from '@/redux/api/orderApi';
import AppStyledText from '@/components/AppStyledText';
import {
  ModalModelState,
  actions as modalActions,
  ModalAction,
} from '@/redux/modules/modal';
import AppButton from '@/components/AppButton';

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
  divider10: {
    width: 375,
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  eidtMode: {
    ...appStyles.bold16Text,
    color: colors.clearBlue,
  },
  confirm: {
    ...appStyles.normal18Text,
    ...appStyles.confirm,
  },
  draftFrame: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginVertical: 24,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    shadowColor: colors.shadow2,
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  draftTitleFrame: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  draftTitle: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: colors.backGrey,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

type EsimScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<ParamListBase, string>;

  loginPending: boolean;
  pending: boolean;
  account: AccountModelState;
  modal: ModalModelState;
  order: OrderModelState;

  action: {
    order: OrderAction;
    account: AccountAction;
    modal: ModalAction;
  };
};

export const USAGE_TIME_INTERVAL = {
  cmi: 9,
  quadcell: 1,
  billionconnect: 1,
};

// state 값에 저장? 위치 고민하기
const SUBS_COUNT = 10;

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
  const [isEditMode, setIsEditMode] = useState(false);
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
  const tabBarHeight = useBottomTabBarHeight();

  const onRefresh = useCallback(
    // hidden : true (used 상태인 것들 모두) , false (pending, reserve 상태 포함 하여 hidden이 false 것들만)
    (hidden: boolean, reset?: boolean) => {
      if (iccid) {
        setRefreshing(true);

        if (reset) action.order.resetOffset();

        action.order
          .getSubsWithToast({iccid, token, hidden})
          .then(() => {
            action.account.getAccount({iccid, token});
            if (!hidden) {
              action.order.getOrders({
                user: mobile,
                token,
                state: 'validation',
                page: 0,
              });
            }
          })
          .finally(() => {
            setRefreshing(false);
            setIsFirstLoad(false);
          });
      }
    },
    [action.account, action.order, iccid, mobile, token],
  );

  useEffect(() => {
    if (isFocused) {
      onRefresh(isEditMode, true);
      setIsFirstLoad(true);
    }
  }, [action.order, isEditMode, isFocused, onRefresh]);

  const empty = useCallback(() => {
    return _.isEmpty(order.drafts) ? (
      <View style={styles.nolist}>
        <AppIcon name="emptyESIM" size={176} />
        <AppText style={styles.blueText}>
          {i18n.t(isEditMode ? 'his:edit:noUsage1' : 'his:noUsage1')}
        </AppText>
        <AppText style={{color: colors.warmGrey, textAlign: 'center'}}>
          {i18n.t(isEditMode ? 'his:edit:noUsage2' : 'his:noUsage2')}
        </AppText>
      </View>
    ) : (
      <></>
    );
  }, [isEditMode, order.drafts]);

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
          imsi: item.imsi,
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

  const days14ago = useMemo(() => moment().subtract(14, 'days'), []);

  const renderSubs = useCallback(
    ({item, index}: {item: RkbSubscription; index: number}) => (
      <EsimSubs
        key={item.key}
        flatListRef={flatListRef}
        index={index}
        mainSubs={item}
        showDetail={index === 0 && item.purchaseDate.isAfter(days14ago)}
        onPressUsage={onPressUsage}
        setShowModal={setShowModal}
        isEditMode={isEditMode}
      />
    ),
    [days14ago, isEditMode, onPressUsage],
  );

  const renderDraft = useCallback(
    (item: RkbOrder) => {
      return (
        <EsimDraftSubs
          key={item.key}
          draftOrder={item}
          onClick={(currentOrder) => {
            navigate(navigation, route, 'EsimStack', {
              tab: 'MyPageStack',
              initial: false,
              screen: 'Draft',
              params: {
                order: currentOrder,
              },
            });
          }}
        />
      );
    },
    [navigation, route],
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

          {order.drafts?.length > 0 && (
            <>
              <View style={styles.draftFrame}>
                <View style={styles.draftTitleFrame}>
                  <AppText style={appStyles.bold24Text}>
                    {i18n.t('esim:draftTitle')}
                  </AppText>
                  <View style={styles.draftTitle}>
                    <AppSvgIcon name="bell" />

                    <AppStyledText
                      text={i18n.t(`esim:draftNotice`)}
                      textStyle={{...appStyles.normal14Text}}
                      format={{
                        b: [appStyles.bold14Text, {color: colors.redError}],
                      }}
                    />
                  </View>
                </View>
                <View>{order.drafts?.map((item) => renderDraft(item))}</View>
              </View>

              <View style={styles.divider10} />
            </>
          )}
        </View>
      ),
    [balance, expDate, iccid, navigation, order.drafts, renderDraft],
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [iccid, mobile, navigation, route, token]);

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
    if (route && route.params) {
      const {iccid} = route.params;
      if (iccid) {
        /*
        const filter= order.subs
            ?.find((s) => s.subsIccid === iccid)
            ?.filter((s2) => s2.subsIccid === iccid) || [];

        const main = filter
          ?.filter((item) => item.type === 'esim_product')
          ?.sort((a, b) =>
            moment(a.purchaseDate).diff(moment(b.purchaseDate)),
          )[0];

        if (main) {
          const {expireDate} = filter?.reduce((oldest, current) =>
            oldest
              ? current.expireDate > oldest.expireDate
                ? current
                : oldest
              : current,
          );

          navigation.setParams({iccid: undefined});

          navigation.navigate('ChargeHistory', {
            mainSubs: main,
            chargeablePeriod: utils.toDateString(
              main?.expireDate,
              'YYYY.MM.DD',
            ),
            onPressUsage,
            isChargeable: !moment(main?.expireDate).isBefore(moment()),
            expireTime: expireDate,
          });
        }
        */
      }
    }
  }, [route]);

  const navigateToChargeType = useCallback(() => {
    setShowModal(false);
    setCmiStatus({});
    setCmiUsage({});
    setCmiPending(false);

    navigation.navigate('ChargeType', {
      mainSubs: subs,
      chargeablePeriod: utils.toDateString(subs?.expireDate, 'YYYY.MM.DD'),
      isChargeable: !subs?.expireDate.isBefore(moment()),
    });
  }, [navigation, subs]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[appStyles.header, styles.esimHeader]}>
        <AppText style={styles.title}>{i18n.t('esimList')}</AppText>
        {isEditMode ? null : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Pressable
              onPress={() => {
                action.modal.hideTabbar();
                setIsEditMode(true);
              }}>
              <AppText style={styles.eidtMode}>
                {i18n.t('esim:editMode')}
              </AppText>
            </Pressable>

            <AppSvgIcon
              name="btnCnter"
              style={styles.btnCnter}
              onPress={() => {
                navigate(navigation, route, 'EsimStack', {
                  tab: 'HomeStack',
                  screen: 'Contact',
                });
              }}
            />
          </View>
        )}
      </View>
      <FlatList
        ref={flatListRef}
        data={
          isEditMode
            ? order.subs
            : order.subs?.filter(
                (elm) => !elm.hide, // Pending 상태는 준비중으로 취급하고, 편집모드에서 숨실 수 없도록 한다.
              )
        }
        keyExtractor={(item) => item.nid}
        ListHeaderComponent={isEditMode ? undefined : info}
        renderItem={renderSubs}
        // onRefresh={this.onRefresh}
        // refreshing={refreshing}
        extraData={[isEditMode]}
        contentContainerStyle={[
          {paddingBottom: 34},
          _.isEmpty(order.subs) && _.isEmpty(order.drafts) && {flex: 1},
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
        // 종종 중복 호출이 발생
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (!order?.subsIsLast) onRefresh(isEditMode, false);
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing && !isFirstLoad}
            onRefresh={() => onRefresh(isEditMode, true)}
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
        onCancelClose={() => {
          setShowModal(false);
          setCmiStatus({});
          setCmiUsage({});
          setCmiPending(false);
        }}
        onOkClose={navigateToChargeType}
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

      {isEditMode && (
        <AppButton
          style={styles.confirm}
          title={i18n.t(
            order.subs.length >= 1
              ? 'esim:editMode:confirm'
              : 'esim:editMode:confirm:noList',
          )}
          onPress={() => {
            action.modal.showTabbar();
            setIsEditMode(false);
          }}
          type="primary"
        />
      )}
      <ChatTalk visible bottom={(isIOS ? 100 : 70) - tabBarHeight} />
    </SafeAreaView>
  );
};

export default connect(
  ({account, order, status, modal}: RootState) => ({
    order,
    account,
    modal,
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
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(EsimScreen);
