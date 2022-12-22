import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Pressable,
  SectionList,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {utils} from '@/utils/utils';
import AppSvgIcon from '@/components/AppSvgIcon';
import {RootState} from '@/redux';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
  CashHistory,
  CashExpire,
  SectionData,
} from '@/redux/modules/account';
import {OrderModelState} from '@/redux/modules/order';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import AppSnackBar from '@/components/AppSnackBar';
import AppPrice from '@/components/AppPrice';
import Env from '@/environment';
import AppButton from '@/components/AppButton';

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
  },
  myRemain: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  balanceBox: {
    flexDirection: 'row',
    marginTop: 9,
    justifyContent: 'space-between',
  },
  rechargeBox: {
    flexDirection: 'row',
    borderColor: colors.lightGrey,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  divider: {
    backgroundColor: colors.whiteTwo,
    height: 10,
    width: '100%',
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
    width: 89,
    height: 34,
    borderRadius: 100,
    borderColor: colors.lightGrey,
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
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 12,
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
    marginTop: 24,
    marginBottom: 32,
    padding: 16,
    backgroundColor: colors.backGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    ...appStyles.bold18Text,
    paddingHorizontal: 20,
    paddingVertical: 12,
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
});

type CashHistoryScreenProps = {
  navigation: CashHistoryScreenProps;
  account: AccountModelState;
  order: OrderModelState;
  pending: boolean;

  action: {
    account: AccountAction;
    modal: ModalAction;
  };
};

type OrderType = 'latest' | 'old';

const CashHistoryScreen: React.FC<CashHistoryScreenProps> = ({
  action,
  account,
  order,
  pending,
}) => {
  const {
    iccid,
    token,
    balance,
    cashHistory = [],
    cashExpire,
    expirePt = 0,
  } = account;
  const navigation = useNavigation();

  const [orderType, setOrderType] = useState<OrderType>('latest');
  const [dataFilter, setDataFilter] = useState<string>('A');
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [isBeginDrag, setIsBeginDrag] = useState(false);
  const [expirePtmodalPosY, setExpirePtmodalPosY] = useState(56);

  const animatedValue = useRef(new Animated.Value(0)).current;

  const orderTypeList: OrderType[] = useMemo(() => ['latest', 'old'], []);
  const filterList: string[] = useMemo(() => ['A', 'Y', 'N'], []);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isBeginDrag ? 56 : expirePtmodalPosY,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, expirePtmodalPosY, isBeginDrag]);

  const applyFilter = useCallback(
    (arr: any[]) =>
      arr.filter((elm2) => elm2.inc === dataFilter || dataFilter === 'A'),
    [dataFilter],
  );

  const bReverse = useCallback((arr: any[], b: boolean) => {
    if (b) return arr.reverse();
    return arr;
  }, []);

  const sectionData = useMemo(() => {
    const isAsc = orderType === 'old';

    return bReverse(
      cashHistory.map((elm) => ({
        title: elm.title,
        data: bReverse(applyFilter(elm.data), isAsc),
      })),
      isAsc,
    ).filter((elm: SectionData) => elm.data.length > 0);
  }, [applyFilter, bReverse, cashHistory, orderType]);

  const getHistory = useCallback(() => {
    action.account.getCashHistory({iccid, token});
    action.account.getCashExpire({iccid, token});
  }, [action.account, iccid, token]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const renderSectionItem = useCallback(
    ({
      item,
      index,
      section,
    }: {
      item: CashHistory;
      index: number;
      section: SectionData;
    }) => {
      const predate =
        index > 0
          ? moment(section.data[index - 1].create_dt).format('MM.DD')
          : '';
      const date = moment(item.create_dt).format('MM.DD');
      return (
        <Pressable
          style={styles.sectionItemContainer}
          onPress={() => {
            if (item.order_id) {
              const ord = order.orders.get(Number(item.order_id));
              if (ord) {
                navigation.navigate('PurchaseDetail', {
                  detail: ord,
                });
              }
            }
          }}>
          <AppText style={[appStyles.medium14, {marginRight: 23, width: 50}]}>
            {index > 0 && predate === date ? '' : date}
          </AppText>
          <View style={{flex: 1}}>
            <AppText style={appStyles.bold16Text}>
              {i18n.t(`cashHistory:type:${item.type}`)}
            </AppText>
            <AppText style={[appStyles.medium14, {color: colors.warmGrey}]}>
              {date}
            </AppText>
          </View>

          <AppPrice
            price={utils.toCurrency(
              utils.stringToNumber(item.diff) || 0,
              esimCurrency,
            )}
            balanceStyle={[
              appStyles.bold18Text,
              {color: item.inc === 'Y' ? colors.clearBlue : colors.redError},
            ]}
            currencyStyle={[
              appStyles.bold16Text,
              {color: item.inc === 'Y' ? colors.clearBlue : colors.clearBlue},
            ]}
            showPlus
          />
        </Pressable>
      );
    },
    [],
  );

  const renderEmpty = useCallback(() => {
    return (
      <View style={{alignItems: 'center'}}>
        <AppSvgIcon name="threeDots" style={{marginBottom: 20}} />
        <AppText style={{...appStyles.medium14, color: colors.warmGrey}}>
          {i18n.t(`cashHistory:empty`)}
        </AppText>
      </View>
    );
  }, []);

  const renderExpireItem = useCallback((item: CashExpire) => {
    const expireDate = moment(item.expire_dt);

    const dDay = expireDate.diff(moment(), 'days');
    return (
      <View
        key={utils.generateKey(item.create_dt)}
        style={styles.expPtContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppText
            style={[
              appStyles.medium16,
              {color: colors.warmGrey, marginRight: 6},
            ]}>
            {expireDate.format('YYYY.MM.DD')}까지
          </AppText>
          <AppText style={[appStyles.bold14Text, {color: colors.redError}]}>
            D-{dDay}
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
          <AppText style={appStyles.bold18Text}>
            {i18n.t(`cashHistory:orderType`)}
          </AppText>
          <View style={{marginTop: 30}}>
            {orderTypeList.map((elm) => (
              <Pressable
                key={elm}
                onPress={() => {
                  setOrderType(elm);
                  action.modal.closeModal();
                }}
                style={styles.orderTypeItem}>
                <AppText
                  style={[
                    appStyles.normal18Text,
                    {
                      color: orderType === elm ? colors.black : colors.warmGrey,
                    },
                  ]}>
                  {i18n.t(`cashHistory:orderType:${elm}`)}
                </AppText>
                {orderType === elm && <AppSvgIcon name="selected" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
        <SafeAreaView style={{backgroundColor: colors.white}} />
      </Pressable>
    ),
    [action.modal, orderType, orderTypeList],
  );

  const expirePtModalBody = useCallback(
    () => (
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
        <SafeAreaView style={{backgroundColor: 'transparent'}} />

        <View style={{flex: 1}}>
          <Animated.ScrollView
            onScrollBeginDrag={() => {
              setIsBeginDrag(true);
            }}
            stickyHeaderIndices={[0]}
            style={{
              flex: 1,
              backgroundColor: colors.white,
              marginTop: animatedValue,
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
                setIsBeginDrag(false);
              }}
            />
          </View>
        </View>
        <SafeAreaView style={{backgroundColor: colors.white}} />
      </View>
    ),
    [action.modal, animatedValue, cashExpire, expirePt, renderExpireItem],
  );

  const renderFilter = useCallback(
    () => (
      <View>
        <View key="header" style={styles.hisHeader}>
          <AppText
            style={[appStyles.bold18Text, {color: colors.black, flex: 1}]}>
            {i18n.t('cashHistory:useHistory')}
          </AppText>
          <Pressable
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => action.modal.showModal({content: orderModalBody()})}>
            <AppText
              style={[
                appStyles.medium14,
                {color: colors.black, marginRight: 8},
              ]}>
              {i18n.t(`cashHistory:orderType:${orderType}`)}
            </AppText>
            <AppSvgIcon name="sortTriangle" style={{marginRight: 8}} />
          </Pressable>
        </View>

        <View style={{flexDirection: 'row', marginHorizontal: 20}}>
          {filterList.map((elm) => (
            <Pressable
              onPress={() => setDataFilter(elm)}
              key={elm}
              style={[
                styles.filter,
                {
                  backgroundColor:
                    dataFilter === elm ? colors.clearBlue : colors.white,
                },
              ]}>
              <AppText
                style={[
                  appStyles.bold14Text,
                  {color: dataFilter === elm ? colors.white : colors.warmGrey},
                ]}>
                {i18n.t(`cashHistory:filter:${elm}`)}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
    ),
    [action.modal, dataFilter, filterList, orderModalBody, orderType],
  );

  const showExpirePt = useCallback(() => {
    if (expirePt <= 0) setShowSnackbar(true);
    else {
      action.modal.showModal({content: expirePtModalBody()});
    }
  }, [action.modal, expirePt, expirePtModalBody]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton
          title={i18n.t('acc:balance')}
          style={{width: '70%', height: 56}}
        />
      </View>

      <View style={styles.myRemain}>
        <AppText style={appStyles.normal14Text}>
          {i18n.t('cashHistory:myBalance')}
        </AppText>
        <View style={styles.balanceBox}>
          <AppPrice
            price={utils.toCurrency(balance || 0, esimCurrency)}
            balanceStyle={[appStyles.bold28Text, {color: colors.black}]}
            currencyStyle={[appStyles.bold26Text, {color: colors.black}]}
          />

          <Pressable
            style={styles.rechargeBox}
            onPress={() => navigation.navigate('Recharge')}>
            <AppSvgIcon name="cashHistoryPlus" style={{marginRight: 4}} />
            <AppText style={appStyles.normal14Text}>
              {i18n.t('acc:goRecharge')}
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* 30일 이내 소멸예정 캐시 모달  */}
      <Pressable
        style={styles.showExpPtBox}
        onPress={() => showExpirePt()}
        onLayout={(event) =>
          setExpirePtmodalPosY(
            event.nativeEvent.layout.y - event.nativeEvent.layout.height || 165,
          )
        }>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppText style={appStyles.bold14Text}>
            {i18n.t('cashHistory:expirePt')}
          </AppText>
          <AppText style={appStyles.normal14Text}>
            {i18n.t('cashHistory:in1Month')}
          </AppText>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppPrice
            price={utils.toCurrency(expirePt || 0, esimCurrency)}
            balanceStyle={[appStyles.bold18Text, {color: colors.redError}]}
            currencyStyle={[appStyles.bold16Text, {color: colors.redError}]}
          />
          <AppSvgIcon name="rightArrow" />
        </View>
      </Pressable>

      <View style={styles.divider} />

      {renderFilter()}

      <SectionList
        sections={sectionData}
        contentContainerStyle={
          sectionData.length > 1 ? {} : styles.contentContainerStyle
        }
        renderItem={renderSectionItem}
        renderSectionHeader={({section: {title}}) => (
          <AppText style={styles.sectionHeader}>
            {i18n.t(`year`, {year: title})}
          </AppText>
        )}
        ListEmptyComponent={() => renderEmpty()}
      />
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('cashHistory:snackbar')}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({account, order, status}: RootState) => ({
    account,
    order,
    pending:
      status.pending[accountActions.getCashHistory.typePrefix] ||
      status.pending[accountActions.getCashExpire.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(CashHistoryScreen);
