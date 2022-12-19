import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  ImageBackground,
  Pressable,
  Modal,
  RefreshControl,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {retrieveData, storeData, utils} from '@/utils/utils';
import {isDeviceSize, windowWidth} from '@/constants/SliderEntry.style';
import EsimModal from './EsimScreen/components/EsimModal';
import {getPromoFlagColor} from '@/redux/api/productApi';
import SplitText from '@/components/SplitText';
import Triangle from '@/components/Triangle';
import AppSvgIcon from '@/components/AppSvgIcon';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {RootState} from '@/redux';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
  CashHistory,
} from '@/redux/modules/account';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';

type ParamList = {
  CashHistoryScreen: {};
};

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
});

type CashHistoryScreenProps = {
  navigation: MyPageScreenNavigationProp;
  account: AccountModelState;
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
  pending,
}) => {
  const {iccid, token, balance, cashHistory, cashExpire} = account;
  const navigation = useNavigation();
  // const route = useRoute<RouteProp<ParamList, 'CashHistoryScreen'>>();

  const [orderType, setOrderType] = useState<OrderType>('latest');
  const [dataFilter, setDataFilter] = useState<string>('A');

  const orderTypeList: OrderType[] = useMemo(() => ['latest', 'old'], []);
  const filterList: string[] = useMemo(() => ['A', 'Y', 'N'], []);

  const getHistory = useCallback(() => {
    action.account.getCashHistory({iccid, token});
    action.account.getCashExpire({iccid, token});
  }, [action.account, iccid, token]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const renderItem = useCallback(({item}: {item: CashHistory}) => {
    return (
      <View>
        <AppText>{item.id}</AppText>
      </View>
    );
  }, []);

  const orderModalBody = useCallback(
    () => (
      <>
        <Pressable
          style={styles.sortModalContainer}
          onPress={() => action.modal.closeModal()}>
          <Pressable style={styles.sortModalContent}>
            <AppText style={appStyles.bold18Text}>
              {i18n.t(`cashHistory:orderType:${orderType}`)}
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
                        color:
                          orderType === elm ? colors.black : colors.warmGrey,
                      },
                    ]}>
                    {i18n.t(`cashHistory:orderType:${elm}`)}
                  </AppText>
                  {orderType === elm && <AppSvgIcon name="selected" />}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </>
    ),
    [action.modal, orderType, orderTypeList],
  );

  const renderHisHeader = useCallback(
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
    [action.modal, filterList, orderModalBody, orderType],
  );

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
          <AppText style={[appStyles.bold28Text]}>
            {utils.numberToCommaString(balance || 0)}
            {i18n.t('won')}
          </AppText>

          <Pressable
            style={styles.rechargeBox}
            onPress={() => navigation.navigate('Recharge')}>
            <AppText style={appStyles.normal14Text}>
              +{i18n.t('acc:goRecharge')}
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* 30일 이내 소멸예정 캐시 모달  */}
      <Pressable
        style={{
          marginHorizontal: 20,
          marginTop: 24,
          marginBottom: 32,
          padding: 16,
          backgroundColor: colors.backGrey,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onPress={() => navigation.navigate('Recharge')}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppText style={appStyles.bold14Text}>
            {i18n.t('cashHistory:myBalance')}
          </AppText>
          <AppText style={appStyles.normal14Text}>
            {i18n.t('cashHistory:in1Month')}
          </AppText>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppText
            style={[
              appStyles.bold18Text,
              {color: colors.redError, marginRight: 8},
            ]}>
            {utils.numberToCommaString(balance || 0)}
            {i18n.t('won')}
          </AppText>
          <AppSvgIcon name="rightArrow" />
        </View>
      </Pressable>

      <View style={styles.divider} />

      <FlatList
        data={cashHistory}
        ListHeaderComponent={renderHisHeader}
        // ListEmptyComponent={empty}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={pending}
            onRefresh={getHistory}
            colors={[colors.clearBlue]} // android 전용
            tintColor={colors.clearBlue} // ios 전용
          />
        }
      />
    </SafeAreaView>
  );
};

export default connect(
  ({account, status}: RootState) => ({
    account,
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
