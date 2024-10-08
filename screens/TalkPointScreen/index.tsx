import {useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppPrice from '@/components/AppPrice';
import AppSnackBar from '@/components/AppSnackBar';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {HistType} from '@/redux/api/talkApi';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
  CashExpire,
  CashHistory,
  SectionData,
} from '@/redux/modules/account';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import {
  actions as talkActions,
  PointHistory,
  TalkAction,
  TalkModelState,
} from '@/redux/modules/talk';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';

const {esimCurrency} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
    height: 56,
  },
  hisHeader: {
    flexDirection: 'row',
    marginBottom: 24,
    marginTop: 32,
    marginHorizontal: 20,
  },
  orderTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 62,
  },
  sortModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    marginHorizontal: 0,
  },
  sortModalContent: {
    padding: 20,
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  filter: {
    // width: 89,
    paddingHorizontal: 14,
    paddingVertical: 5,
    height: 34,
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okButton: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
  expPtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 4,
  },
  sectionItemContainer: {
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  expPtBox: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.backGrey,
  },
  showExpPtBox: {
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 16,
    backgroundColor: colors.deepGreen,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    ...appStyles.bold18Text,
    lineHeight: 30,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.white,
  },
  contentContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topGradient: {
    width: '100%',
    height: 30,
  },
  bottomGradient: {
    width: '100%',
    height: 30,
    position: 'absolute',
    bottom: 72,
  },
  okBtnContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  divider: {
    backgroundColor: colors.whiteTwo,
    height: 10,
    width: '100%',
  },
  historyTitleText: {
    ...appStyles.bold18Text,
    lineHeight: 22,
    color: colors.black,
    flex: 1,
  },
  selectedTypeText: {
    ...appStyles.bold18Text,
    lineHeight: 22,
    color: colors.clearBlue,
  },
  normalText: {
    ...appStyles.medium18,
    lineHeight: 22,
    color: colors.black,
  },
  detailText: {
    ...appStyles.medium14,
    color: colors.warmGrey,
  },
  dateText: {
    ...appStyles.normal16Text,
    paddingTop: 15,
    marginRight: 20,
    width: 47,
    lineHeight: 24,
    color: colors.black,
  },
  pointBox: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
  },
  pointRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expText: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.warmGrey,
  },
  filterView: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  topPtBox: {
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 24,
    marginTop: 24,
    marginHorizontal: 20,
    height: 104,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: colors.green500,
  },
  pointText: {
    ...appStyles.bold28Text,
    fontFamily: 'Roboto-Regular',
    color: colors.white,
    marginTop: 4,
  },
  expBoldText: {
    ...appStyles.bold14Text,
    lineHeight: 24,
    color: colors.white,
    opacity: 0.72,
  },
  expNormalText: {
    ...appStyles.normal14Text,
    lineHeight: 24,
    color: colors.white,
    opacity: 0.72,
  },
});

type TalkPointScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'TalkPoint'
>;

type TalkPointScreenProps = {
  navigation: TalkPointScreenNavigationProp;
  talk: TalkModelState;
  account: AccountModelState;
  pending: boolean;

  action: {
    talk: TalkAction;
    account: AccountAction;
    modal: ModalAction;
  };
};

type OrderType = 'latest' | 'old';

const TalkPointScreen: React.FC<TalkPointScreenProps> = ({
  navigation,
  talk,
  action,
  account,
  pending,
}) => {
  const {
    realMobile,
    iccid,
    token,
    balance,
    cashHistory = [],
    cashExpire,
    expirePt = 0,
  } = account;
  const {pointHistory = []} = talk;
  const [point, setPoint] = useState<number>(0);

  const [orderType, setOrderType] = useState<OrderType>('latest');
  const [dataFilter, setDataFilter] = useState<string>('A');
  const [showSnackBar, setShowSnackbar] = useState(false);
  const isModalBeginDrag = useRef(false);
  const isTop = useRef(true);
  const sectionRef = useRef<SectionList>(null);

  const modalAnimatedValue = useRef(new Animated.Value(56)).current;
  const animatedValue = useRef(new Animated.Value(170)).current;
  const animatedTextHeight = useRef(new Animated.Value(20)).current;
  const dividerAnimatedHeight = useRef(new Animated.Value(0)).current;
  const dividerAnimatedMargin = useRef(new Animated.Value(0)).current;

  const orderTypeList: OrderType[] = useMemo(() => ['latest', 'old'], []);
  const filterList: string[] = useMemo(() => ['A', 'Y', 'N'], []);

  useEffect(() => {}, []);

  const getPoint = useCallback(() => {
    if (realMobile) {
      API.TalkApi.getTalkPoint({mobile: realMobile}).then((rsp) => {
        if (rsp?.result === 0) {
          setPoint(rsp?.objects?.tpnt);
        }
      });
    }
  }, [realMobile]);

  useFocusEffect(
    React.useCallback(() => {
      getPoint();
      return () => {};
    }, [getPoint]),
  );

  const beginDragAnimation = useCallback(
    (v: boolean) => {
      isModalBeginDrag.current = v;
      Animated.timing(modalAnimatedValue, {
        toValue: isModalBeginDrag.current ? 56 : 194, // 56는 헤더 높이값, 168은 캐시잔액 높이값
        duration: 500,
        useNativeDriver: false,
      }).start();
    },
    [modalAnimatedValue],
  );

  const runAnimation = useCallback(
    (v: boolean) => {
      isTop.current = v;

      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: isTop.current ? 170 : 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedTextHeight, {
          toValue: isTop.current ? 20 : 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(dividerAnimatedHeight, {
          toValue: isTop.current ? 0 : 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(dividerAnimatedMargin, {
          toValue: isTop.current ? 0 : 24,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
    },
    [
      animatedTextHeight,
      animatedValue,
      dividerAnimatedHeight,
      dividerAnimatedMargin,
    ],
  );

  const sectionData = useMemo(() => pointHistory, [pointHistory]);

  const getType = useCallback((key?: string) => {
    if (key === 'Y') return 'add';
    if (key === 'N') return 'deduct';
    return 'all';
  }, []);

  const getHistory = useCallback(
    ({sort, type}: {sort?: string; type?: HistType}) => {
      action.talk.getPointHistory({
        iccid,
        token,
        sort,
        type,
      });
    },
    [action.talk, iccid, token],
  );

  useEffect(() => {
    getHistory({});
  }, [getHistory]);

  const renderSectionItem = useCallback(
    ({
      item,
      index,
      section,
    }: {
      item: PointHistory;
      index: number;
      section: SectionData;
    }) => {
      const predate =
        index > 0
          ? moment.unix(section.data[index - 1].created).format('MM.DD')
          : '';
      const date = moment.unix(item.created).format('MM.DD');

      const {diff} = item;
      const plus = diff?.[0] !== '-';

      const type = plus
        ? 'add'
        : item.reason.toLocaleLowerCase().includes('exp')
        ? 'expired'
        : 'used';

      return (
        <Pressable
          style={[styles.sectionItemContainer, {height: plus ? 74 : 54}]}>
          <View
            style={{
              flexDirection: 'row',
              height: plus ? 74 : 54,
            }}>
            <AppText style={styles.dateText}>
              {index > 0 && predate === date ? '' : date}
            </AppText>
            <View style={styles.pointBox}>
              <View style={styles.pointRow}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <AppText style={[appStyles.bold16Text, {lineHeight: 30}]}>
                    {i18n.t(`talk:point:history:${type}`)}
                  </AppText>
                </View>

                <AppPrice
                  price={utils.toCurrency(diff, 'P')}
                  balanceStyle={[
                    appStyles.bold18Text,
                    {
                      color: plus ? colors.clearBlue : colors.redError,
                      lineHeight: 30,
                    },
                  ]}
                  currencyStyle={[
                    appStyles.bold16Text,
                    {
                      color: plus ? colors.clearBlue : colors.redError,
                      lineHeight: 30,
                    },
                  ]}
                  showPlus
                />
              </View>
              {plus && (
                <AppText style={styles.expText}>
                  {i18n.t(`talk:point:expireDate`)}
                  {moment.unix(item?.expire_at).format('YYYY.MM.DD')}
                </AppText>
              )}
            </View>
          </View>
        </Pressable>
      );
    },
    [],
  );

  const renderEmpty = useCallback(() => {
    // 종 있는 부분 적용 필요
    if (dataFilter === 'A')
      // return (
      //   <View style={{alignItems: 'center'}}>
      //     <AppSvgIcon name="threeDotsBig" style={{marginBottom: 16}} />
      //     <AppText style={{...appStyles.normal16Text, color: colors.warmGrey}}>
      //       {i18n.t(`talk:point:empty:${dataFilter}`)}
      //     </AppText>
      //   </View>
      // );
      return (
        <View style={{alignItems: 'center'}}>
          <AppSvgIcon name="threeDotsBig" style={{marginBottom: 16}} />
          <AppText style={{...appStyles.normal16Text, color: colors.warmGrey}}>
            {i18n.t(`talk:point:empty:${dataFilter}`)}
          </AppText>
        </View>
      );
  }, [dataFilter]);

  const renderExpireItem = useCallback((item: CashExpire) => {
    const dDay = item.expire_dt?.diff(moment(), 'days');
    return (
      <View key={item.create_dt.unix()} style={styles.expPtContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppText
            style={[
              appStyles.medium16,
              {color: colors.warmGrey, marginRight: 6},
            ]}>
            {item.expire_dt?.format('YYYY.MM.DD') + i18n.t('sim:until')}
          </AppText>
          <AppText style={[appStyles.bold14Text, {color: colors.redError}]}>
            {`D-${dDay}`}
          </AppText>
        </View>

        <AppPrice
          price={utils.toCurrency(
            utils.stringToNumber(item.point) || 0,
            esimCurrency,
          )}
          balanceStyle={[appStyles.bold18Text, {color: colors.clearBlue}]}
          currencyStyle={[appStyles.bold16Text, {color: colors.clearBlue}]}
        />
      </View>
    );
  }, []);

  const orderModalBody = useCallback(
    () => (
      <Pressable
        style={styles.sortModalContainer}
        onPress={() => action.modal.closeModal()}>
        <Pressable style={styles.sortModalContent}>
          <AppText style={[appStyles.bold18Text, {lineHeight: 24}]}>
            {i18n.t(`talk:point:sort:orderType`)}
          </AppText>
          <View style={{marginTop: 28}}>
            {orderTypeList.map((elm) => (
              <Pressable
                key={elm}
                onPress={() => {
                  setOrderType(elm);
                  const sort = elm === 'latest' ? 'desc' : 'asc';
                  getHistory({type: getType(dataFilter), sort});
                  action.modal.closeModal();
                }}
                style={styles.orderTypeItem}>
                <AppText
                  style={
                    orderType === elm
                      ? styles.selectedTypeText
                      : styles.normalText
                  }>
                  {i18n.t(`talk:point:sort:${elm}`)}
                </AppText>
                {orderType === elm && <AppSvgIcon name="selected" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
        <SafeAreaView style={{backgroundColor: colors.white}} />
      </Pressable>
    ),
    [action.modal, dataFilter, getHistory, getType, orderType, orderTypeList],
  );

  const expirePtModalBody = useCallback(
    () => (
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
        <SafeAreaView style={{backgroundColor: 'transparent'}} />

        <View style={{flex: 1}}>
          <Animated.ScrollView
            onScrollBeginDrag={() => beginDragAnimation(true)}
            stickyHeaderIndices={[0]}
            style={{
              flex: 1,
              backgroundColor: colors.white,
              marginTop: modalAnimatedValue,
            }}>
            <LinearGradient
              colors={[colors.white, 'rgba(255, 255, 255, 0.1)']}
              style={styles.topGradient}
            />
            <AppText
              style={[
                appStyles.bold20Text,
                {marginHorizontal: 20, marginTop: 28, marginBottom: 24},
              ]}>
              {i18n.t('cashHistory:expireModalTitle')}
            </AppText>

            <View style={styles.expPtBox}>
              <AppText style={appStyles.bold14Text}>
                {i18n.t('cashHistory:expirePt')}
              </AppText>
              <AppPrice
                price={utils.toCurrency(expirePt || 0, esimCurrency)}
                balanceStyle={[appStyles.bold18Text, {color: colors.redError}]}
                currencyStyle={[appStyles.bold16Text, {color: colors.redError}]}
              />
            </View>

            <View style={{marginBottom: 30}}>
              {cashExpire?.map((elm) => renderExpireItem(elm))}
            </View>
          </Animated.ScrollView>

          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', colors.white]}
            style={styles.bottomGradient}
          />
          <View style={styles.okBtnContainer}>
            <AppButton
              style={styles.okButton}
              title={i18n.t('ok')}
              type="primary"
              onPress={() => {
                action.modal.closeModal();
                beginDragAnimation(false);
              }}
            />
          </View>
        </View>
        <SafeAreaView style={{backgroundColor: colors.white}} />
      </View>
    ),
    [
      modalAnimatedValue,
      expirePt,
      cashExpire,
      beginDragAnimation,
      renderExpireItem,
      action.modal,
    ],
  );

  const onPressFilter = useCallback(
    (key: string) => {
      setDataFilter(key);
      const sort = orderType === 'latest' ? 'desc' : 'asc';
      getHistory({type: getType(key), sort});
      // 데이터 없을 때 호출하면 앱이 죽음
      if (sectionData?.length > 0)
        sectionRef.current?.scrollToLocation({itemIndex: 0, sectionIndex: 0});
    },
    [getHistory, getType, orderType, sectionData?.length],
  );

  const renderFilter = useCallback(
    () => (
      <View style={styles.filterView}>
        {filterList.map((elm) => (
          <Pressable
            onPress={() => onPressFilter(elm)}
            key={elm}
            style={[
              styles.filter,
              {
                backgroundColor:
                  dataFilter === elm ? colors.clearBlue : colors.white,
                borderColor:
                  dataFilter === elm ? colors.clearBlue : colors.lightGrey,
              },
            ]}>
            <AppText
              style={[
                appStyles.bold14Text,
                {color: dataFilter === elm ? colors.white : colors.black},
              ]}>
              {i18n.t(`talk:point:filter:${elm}`)}
            </AppText>
          </Pressable>
        ))}
      </View>
    ),
    [dataFilter, filterList, onPressFilter],
  );

  const showExpirePt = useCallback(() => {
    if (expirePt <= 0) setShowSnackbar(true);
    else {
      action.modal.renderModal(() => expirePtModalBody());
    }
  }, [action.modal, expirePt, expirePtModalBody]);

  const renderTop = useCallback(() => {
    return (
      <>
        <View style={styles.topPtBox}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <AppText style={[appStyles.roboto14Text, {color: colors.white}]}>
              {i18n.t('talk:point:hold')}
            </AppText>
            <AppSvgIcon name="rokebiLogoSmall" />
          </View>
          <AppPrice
            price={utils.toCurrency(point || 0, 'P')}
            balanceStyle={styles.pointText}
            currencyStyle={styles.pointText}
          />
        </View>
        <Pressable style={styles.showExpPtBox} onPress={() => showExpirePt()}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AppText style={styles.expBoldText}>
              {i18n.t('talk:point:expirePt')}
            </AppText>
            <AppText style={styles.expNormalText}>
              {i18n.t('cashHistory:in1Month')}
            </AppText>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AppPrice
              price={utils.toCurrency(expirePt || 0, 'P')}
              balanceStyle={[
                appStyles.bold18Text,
                {color: colors.white, lineHeight: 24},
              ]}
              currencyStyle={[
                appStyles.bold16Text,
                {
                  color: colors.white,
                  lineHeight: 22,
                },
              ]}
            />
            <AppSvgIcon name="rightArrowWhite10" style={{marginLeft: 8}} />
          </View>
        </Pressable>
      </>
    );
  }, [expirePt, point, showExpirePt]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton title="톡포인트" />
      </View>

      {renderTop()}

      {/* 30일 이내 소멸예정 캐시 모달  */}
      <Animated.View
        style={{
          overflow: 'hidden', // height: animatedValue,
        }}>
        <View style={styles.divider} />

        <View key="header" style={styles.hisHeader}>
          <AppText style={styles.historyTitleText}>
            {i18n.t('talk:point:used:history')}
          </AppText>
          <Pressable
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => action.modal.renderModal(orderModalBody)}>
            <AppText
              style={[
                appStyles.medium14,
                {color: colors.black, marginRight: 4},
              ]}>
              {i18n.t(`cashHistory:orderType:${orderType}`)}
            </AppText>
            <AppSvgIcon name="sortTriangle" style={{marginRight: 8}} />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          backgroundColor: colors.whiteTwo,
          height: dividerAnimatedHeight,
          marginHorizontal: dividerAnimatedMargin,
          marginBottom: dividerAnimatedMargin,
        }}
      />

      {renderFilter()}

      <SectionList
        ref={sectionRef}
        sections={sectionData}
        contentContainerStyle={
          sectionData.length > 0 ? undefined : styles.contentContainerStyle
        }
        renderItem={renderSectionItem}
        renderSectionHeader={({section: {title}}) => (
          <AppText style={styles.sectionHeader}>
            {i18n.t(`year`, {year: title})}
          </AppText>
        )}
        stickySectionHeadersEnabled
        ListEmptyComponent={() => renderEmpty()}
        onScrollEndDrag={({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => {
          if (isTop.current && y > 178) runAnimation(false);
          else if (!isTop.current && y <= 0) runAnimation(true);
        }}
        overScrollMode="never"
        bounces={false}
      />
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('cashHistory:snackbar')}
      />

      <AppActivityIndicator visible={pending || false} />
    </SafeAreaView>
  );
};

export default connect(
  ({account, talk, status}: RootState) => ({
    account,
    talk,
    pending:
      status.pending[talkActions.getPointHistory.typePrefix] ||
      status.pending[accountActions.getCashExpire.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      talk: bindActionCreators(talkActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(TalkPointScreen);
