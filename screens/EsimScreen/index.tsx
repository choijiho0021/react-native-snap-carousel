import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Pressable,
  SafeAreaView,
  AppState,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {isDefined} from 'validate.js';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList, navigate} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {
  RkbSubscription,
  AddOnOptionType,
  STATUS_USED,
  STATUS_EXPIRED,
  checkUsage,
} from '@/redux/api/subscriptionApi';
import {
  AccountAction,
  AccountModelState,
  Fortune,
  actions as accountActions,
  isFortuneHistory,
} from '@/redux/modules/account';
import {
  actions as orderActions,
  OrderAction,
  OrderModelState,
  PAGINATION_SUBS_COUNT,
} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
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
import BackbuttonHandler from '@/components/BackbuttonHandler';
import LotteryButton from '../LotteryScreen/component/LotteryButton';
import Triangle from '@/components/Triangle';
import {windowWidth} from '@/constants/SliderEntry.style';
import TalkRewardModal from '../RkbTalk/component/TalkRewardModal';
import talkApi from '@/redux/api/talkApi';

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
    marginTop: 24,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.whiteFive,
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
    ...appStyles.semiBold16Text,
    lineHeight: 20,
    color: colors.black,
  },
  moveToGuideText: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
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

    elevation: 12,
    shadowColor: colors.shadow3,
    shadowRadius: 12,
    shadowOpacity: 0.15,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  draftTitleFrame: {
    marginHorizontal: 16,
    borderRadius: 3,
    marginTop: 24,
    marginBottom: 8,
  },
  draftTitle: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: colors.backGrey,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 3,
  },
  draftNotiText: {
    ...appStyles.normal14Text,
    lineHeight: 22,
  },
  draftNotiBoldText: {
    ...appStyles.bold14Text,
    color: colors.redError,
    lineHeight: 22,
  },

  tooltipContainer: {
    zIndex: 100,
    width: 252,
    position: 'absolute',
    left: windowWidth / 2 - 128,
  },
  tooltipContent: {
    flexDirection: 'row',
    backgroundColor: colors.violet500,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    borderWidth: 0,
    padding: 16,
  },
  tooltipText: {
    ...appStyles.bold14Text,
    color: colors.white,
    lineHeight: 20,
    textAlign: 'center',
  },
});

type EsimScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Esim'>;
type EsimScreenRouteProp = RouteProp<HomeStackParamList, 'Esim'>;

type EsimScreenProps = {
  navigation: EsimScreenNavigationProp;
  route: EsimScreenRouteProp;

  account: AccountModelState;
  modal: ModalModelState;
  order: OrderModelState;

  action: {
    order: OrderAction;
    account: AccountAction;
    modal: ModalAction;
  };
};

// export const USAGE_TIME_INTERVAL = {
//   cmi: 9,
//   quadcell: 1,
//   billionconnect: 1,
// };

export const renderInfo = (navigation, isReserving, fortune?: Fortune) => {
  // 근데 발송중 말고 운세 다시보기로 바뀌면 출력 안해야 정상 아닌가? 질문 필요
  if (fortune && isReserving && !isFortuneHistory(fortune))
    return (
      <View style={{height: 62, marginTop: 24}}>
        <View style={styles.tooltipContainer}>
          <View style={styles.tooltipContent}>
            <AppText style={styles.tooltipText}>
              {i18n.t('esim:lottery:tooltip1')}
            </AppText>
            <AppSvgIcon name="emojiCoupon" />
            <AppText style={styles.tooltipText}>
              {i18n.t('esim:lottery:tooltip2')}
            </AppText>
            <AppSvgIcon name="emojiCoupon" />
            <AppText style={styles.tooltipText}>
              {i18n.t('esim:lottery:tooltip3')}
            </AppText>
          </View>
          <View style={{alignItems: 'flex-end', marginRight: 120}}>
            <AppIcon name="triangle14" />
          </View>
        </View>
      </View>
    );

  return (
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
      </View>
    </Pressable>
  );
};

const EsimScreen: React.FC<EsimScreenProps> = ({
  navigation,
  route,
  action,
  account: {iccid, mobile, token, fortune, isReceivedReward},
  order,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState<boolean>(false);
  const [subs, setSubs] = useState<RkbSubscription>();
  const [usageLoading, setUsageLoading] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState<boolean | undefined>();
  const [isPressClose, setIsPressClose] = useState(false);
  const [dataUsage, setDataUsage] = useState({});
  const [dataStatus, setDataStatus] = useState({});
  const [dataUsageOption, setDataUsageOption] = useState({});
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showUsageSubsId, setShowUsageSubsId] = useState<string | undefined>();
  const isFocused = useIsFocused();
  const flatListRef = useRef<FlatList>(null);
  const tabBarHeight = useBottomTabBarHeight();
  const appState = useRef('unknown');
  const [isChargeable, setIsChargeable] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isVisibleReward, setIsVisibleReward] = useState(false);

  const [subsData, firstUsedIdx] = useMemo(
    () => {
      const list = order.subs?.filter((elm) =>
        isEditMode
          ? [STATUS_USED, STATUS_EXPIRED].includes(elm.statusCd)
          : !elm.hide,
      );
      return [list, list.findIndex((o) => o.statusCd === STATUS_USED)];
    }, // Pending 상태는 준비중으로 취급하고, 편집모드에서 숨길 수 없도록 한다.
    [isEditMode, order.subs],
  );

  const isReserving = useMemo(
    () => subsData?.findIndex((r) => r?.statusCd === 'R') !== -1,
    [subsData],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setShowUsageModal(false);
      setShowGiftModal(false);
    });

    return unsubscribe;
  }, [navigation]);

  const showModal = useMemo(() => {
    if (showUsageModal && isDefined(showGiftModal)) return 'usage';
    if (!showUsageModal && showGiftModal) return 'gift';

    return 'noModal';
  }, [showGiftModal, showUsageModal]);

  useEffect(() => {
    // EsimScreen 에서만 getSubs 초기화
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isFocused
      ) {
        action.order.getSubs({
          iccid,
          token,
          offset: 0,
          count: PAGINATION_SUBS_COUNT,
          hidden: isEditMode,
          reset: true,
        });
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [action.order, iccid, isEditMode, isFocused, token]);

  const getOrders = useCallback(
    (hidden: boolean) => {
      if (!hidden) {
        action.order.getOrders({
          user: mobile,
          token,
          state: 'validation',
          orderType: 'refundable',
          page: 0,
        });
      }
    },
    [action.order, mobile, token],
  );

  const checkLottery = useCallback(() => {
    action.account.checkLottery({iccid, token, prompt: 'check'});
  }, [action.account, iccid, token]);

  const onPressUsage = useCallback(
    async (item: RkbSubscription, isChargeableParam?: boolean) => {
      setUsageLoading(true);
      setSubs(item);

      const result = await checkUsage(item);

      setIsChargeable(isChargeableParam!);
      setDataStatus(result.status);
      setDataUsage(result.usage);
      setDataUsageOption(result.usageOption);
      setUsageLoading(false);
      return result;
    },
    [],
  );

  const onRefresh = useCallback(
    // hidden : true (used 상태인 것들 모두) , false (pending, reserve 상태 포함 하여 hidden이 false 것들만)
    (hidden: boolean, reset?: boolean, subsId?: string, actionStr?: string) => {
      if (iccid) {
        setRefreshing(true);

        action.order
          .getSubsWithToast({iccid, token, hidden, subsId, reset})
          .then(() => {
            action.account.getAccount({iccid, token});
            getOrders(hidden);

            // hidden이 False 일 때만 해주면 되나?
            checkLottery();

            setIsFirstLoad(false);
          })
          .finally(() => {
            setRefreshing(false);
          });
      }
    },
    [action.account, action.order, checkLottery, getOrders, iccid, token],
  );

  const getIsChargeable = useCallback((sub: RkbSubscription) => {
    return (
      sub?.addOnOption &&
      sub.addOnOption !== AddOnOptionType.NEVER &&
      !(sub.expireDate && sub.expireDate.isBefore(moment())) &&
      sub.partner !== 'billionconnect'
    );
  }, []);

  useEffect(() => {
    if (showUsageSubsId && !isEditMode) {
      const index = subsData?.findIndex((elm) => elm.nid === showUsageSubsId);

      if (index >= 0) {
        setShowUsageModal(true);
        onPressUsage(subsData[index], getIsChargeable(subsData[index]));
        flatListRef?.current?.scrollToIndex({index, animated: true});
      }
    }
  }, [getIsChargeable, isEditMode, onPressUsage, showUsageSubsId, subsData]);

  const getSubsAction = useCallback(
    async (subsId?: string, actionStr?: string, subsIccid?: string) => {
      navigation.setParams({
        actionStr: undefined,
      });

      if (actionStr === 'reload') {
        action.order.subsReload({
          iccid: iccid!,
          token: token!,
          hidden: false,
        });
        getOrders(false);
        checkLottery();
      } else if (actionStr === 'showUsage') {
        const index = subsData?.findIndex((elm) => elm.nid === subsId);

        if (index >= 0) {
          setSelectedIdx(index);
          setShowUsageModal(true);
          onPressUsage(subsData[index], getIsChargeable(subsData[index]));
          flatListRef?.current?.scrollToIndex({index, animated: true});
        } else {
          const rsp = await action.order.getSubsWithToast({
            iccid,
            token,
            hidden: false,
            subsId,
            reset: true,
          });

          // 스크롤 이동 및 사용량 조회 모달 보여주도록 추가 필요
          if (rsp?.payload?.result === 0) {
            setShowUsageSubsId(subsId);
          }
        }
      } else if (actionStr === 'navigate') {
        if (subsIccid) {
          const main = order.subs?.find((s) => s.subsIccid === subsIccid);
          if (main) {
            if ((main.cnt || 0) > 1) {
              navigation.navigate('ChargeHistory', {
                mainSubs: main,
                chargeablePeriod: utils.toDateString(
                  main?.expireDate,
                  'YYYY.MM.DD',
                ),
                isChargeable: !main.expireDate?.isBefore(moment()),
              });
            }
          } else {
            action.order
              .getNotiSubs({
                iccid: iccid!,
                token: token!,
                uuid: subsIccid,
              })
              .then((elm) => {
                const subsList: RkbSubscription[] = elm.payload.objects;

                if (subsList.length > 1) {
                  const mainSubs = subsList.reduce(
                    (min, current) =>
                      current.type === 'esim_product' &&
                      moment(current.purchaseDate).isBefore(
                        moment(min.purchaseDate),
                      )
                        ? current
                        : min,
                    subsList[0],
                  );

                  navigation.navigate('ChargeHistory', {
                    mainSubs: mainSubs!,
                    chargeablePeriod: utils.toDateString(
                      mainSubs?.expireDate,
                      'YYYY.MM.DD',
                    ),
                    isChargeable: !mainSubs?.expireDate?.isBefore(moment()),
                  });
                }
              });
          }
        }
      } else if (actionStr === 'scrollToTop') {
        flatListRef?.current?.scrollToOffset({animated: true, offset: 0});
      }
    },
    [
      action.order,
      checkLottery,
      getIsChargeable,
      getOrders,
      iccid,
      navigation,
      onPressUsage,
      order.subs,
      subsData,
      token,
    ],
  );

  // 첫 리워드 조건 체크용
  useEffect(() => {
    if (isFocused && isReceivedReward !== undefined && isReceivedReward === 0) {
      setIsVisibleReward(true);
    }
  }, [action.account, mobile, isReceivedReward, isFocused]);

  useEffect(() => {
    const {subsId, actionStr} = route?.params || {};

    if (isFirstLoad) {
      // actionStr = reload, esim 최초 진입 시 subs 중복 호출 현상 방지
      if (actionStr === 'reload')
        navigation.setParams({
          actionStr: undefined,
        });
      else onRefresh(false, true, subsId, actionStr);
    }
  }, [route?.params, isFirstLoad, iccid, onRefresh, navigation]);

  useEffect(() => {
    const {subsId, actionStr, iccid: subsIccid} = route?.params || {};

    if (!isFirstLoad && actionStr) {
      getSubsAction(subsId, actionStr, subsIccid);
    }
  }, [route?.params, isFirstLoad, iccid, getSubsAction]);

  const empty = useCallback(() => {
    return _.isEmpty(order.drafts) || isEditMode ? (
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

  const days14ago = useMemo(() => moment().subtract(14, 'days'), []);

  const renderSubs = useCallback(
    ({item, index}: {item: RkbSubscription; index: number}) => (
      <EsimSubs
        key={item.key}
        flatListRef={flatListRef}
        index={index}
        mainSubs={item}
        showDetail={
          ((index === firstUsedIdx || index === selectedIdx) &&
            item.statusCd === STATUS_USED &&
            item.purchaseDate.isAfter(days14ago)) ||
          route?.params?.subsId === item.nid
        }
        onPressUsage={onPressUsage}
        setShowUsageModal={setShowUsageModal}
        isEditMode={isEditMode}
      />
    ),
    [
      days14ago,
      firstUsedIdx,
      isEditMode,
      onPressUsage,
      route?.params?.subsId,
      selectedIdx,
    ],
  );

  const renderDraft = useCallback(
    (item: RkbOrder, isLast) => {
      return (
        <EsimDraftSubs
          key={item.key}
          draftOrder={item}
          isLast={isLast}
          onClick={(currentOrder) => {
            navigate(navigation, route, 'EsimStack', {
              tab: 'MyPageStack',
              initial: false,
              screen:
                currentOrder.usageList.findIndex((elm) => elm.pid === 'ht') >= 0
                  ? 'DraftUs'
                  : 'Draft',
              params: {
                orderId: currentOrder?.orderId,
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
        <View
          style={{
            flex: 1,
            backgroundColor: colors.white,
          }}>
          {renderInfo(navigation, isReserving, fortune)}
          <LotteryButton
            subsData={subsData}
            navigation={navigation}
            fortune={fortune}
          />
          {order.drafts?.length > 0 && (
            <>
              <View style={styles.draftFrame}>
                <View style={styles.draftTitleFrame}>
                  <AppText style={appStyles.bold24Text}>
                    {i18n.t('esim:draftTitle')}
                  </AppText>
                  <View style={styles.draftTitle}>
                    <AppSvgIcon style={{marginRight: 8}} name="bell" />

                    <AppStyledText
                      text={i18n.t(`esim:draftNotice`)}
                      textStyle={styles.draftNotiText}
                      format={{
                        b: styles.draftNotiBoldText,
                      }}
                    />
                  </View>
                </View>
                <View>
                  {order.drafts?.map((item, idx) =>
                    renderDraft(item, order.drafts?.length === idx + 1),
                  )}
                </View>
              </View>

              <View style={styles.divider10} />
            </>
          )}
        </View>
      ),
    [fortune, isReserving, navigation, order.drafts, renderDraft, subsData],
  );

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

  const setEditMode = useCallback(
    (v: boolean) => {
      flatListRef.current?.scrollToOffset({animated: false, offset: 0});
      setIsEditMode(v);
      onRefresh(v, true);
    },
    [onRefresh],
  );

  BackbuttonHandler({
    navigation,
    onBack: () => {
      if (isEditMode) {
        setEditMode(false);
        action.modal.showTabbar();
      } else if (navigation.canGoBack()) {
        navigation.goBack();
      }
      return true;
    },
  });

  const navigateToChargeType = useCallback(() => {
    setShowUsageModal(false);
    setDataStatus({});
    setDataUsage({});
    setUsageLoading(false);

    // 사용량 모달 -> 충전하기
    // 다른 충전하기 버튼과 덜라 cnt 2 이상이여도 달리 충전 이력 화면으로 안들어가고 있다.
    if (subs)
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
                setEditMode(true);
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
        data={subsData}
        keyExtractor={(item) => item.nid}
        ListHeaderComponent={isEditMode ? undefined : info}
        renderItem={renderSubs}
        initialNumToRender={30}
        extraData={[isEditMode, subsData, selectedIdx]}
        contentContainerStyle={[
          {paddingBottom: 34},
          _.isEmpty(subsData) &&
            (_.isEmpty(order.drafts) || isEditMode) && {
              flexGrow: 1,
            },
        ]}
        ListEmptyComponent={empty}
        onScrollToIndexFailed={(rsp) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 1500));
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
          if (!order?.subsIsLast && order?.subs?.length > 0) {
            navigation.setParams({
              subsId: undefined,
              iccid: undefined,
              actionStr: undefined,
            });
            onRefresh(isEditMode, false);
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh(isEditMode, true)}
            colors={[colors.clearBlue]} // android 전용
            tintColor={colors.clearBlue} // ios 전용
          />
        }
      />
      <EsimModal
        visible={showModal === 'usage'}
        subs={subs}
        usageLoading={usageLoading}
        dataUsage={dataUsage}
        dataStatus={dataStatus}
        dataUsageOption={dataUsageOption}
        onCancelClose={() => {
          setShowUsageModal(false);
          setDataStatus({});
          setDataUsage({});
          setUsageLoading(false);
        }}
        isChargeableData={isChargeable}
        onOkClose={navigateToChargeType}
      />

      <TalkRewardModal
        visible={isVisibleReward}
        onClick={() => {
          action.account.resetFirstReward(); // 모달창 반복 출력 방지
          setIsVisibleReward(false);
        }}
      />
      {!esimGlobal && (
        <GiftModal
          visible={showModal === 'gift'}
          onOkClose={() => {
            setShowGiftModal(false);
            setIsPressClose(true);
          }}
        />
      )}
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
            setEditMode(false);
          }}
          type="primary"
        />
      )}
      <ChatTalk visible bottom={(isIOS ? 100 : 70) - tabBarHeight} />
    </SafeAreaView>
  );
};

export default connect(
  ({account, order, modal}: RootState) => ({
    order,
    account,
    modal,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(EsimScreen);
