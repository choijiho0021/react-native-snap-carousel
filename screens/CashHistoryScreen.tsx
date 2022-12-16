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

type ParamList = {
  CashHistoryScreen: {};
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
});

type CashHistoryScreenProps = {
  navigation: MyPageScreenNavigationProp;
  account: AccountModelState;
  pending: boolean;

  action: {
    account: AccountAction;
  };
};

const CashHistoryScreen: React.FC<CashHistoryScreenProps> = ({
  action,
  account,
  pending,
}) => {
  const {iccid, token, balance, cashHistory, cashExpire} = account;
  const navigation = useNavigation();
  // const route = useRoute<RouteProp<ParamList, 'CashHistoryScreen'>>();

  // const [showModal, setShowModal] = useState(false);

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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={styles.header}>
        <AppBackButton
          title={i18n.t('acc:balance')}
          style={{width: '70%', height: 56}}
        />
      </View>

      <View>
        <AppText>{i18n.t('acc:myRemain')}</AppText>
        <View style={{flexDirection: 'row'}}>
          <AppText>{utils.numberToCommaString(balance || 0)}</AppText>

          <Pressable onPress={() => navigation.navigate('Recharge')}>
            <AppText>+{i18n.t('acc:goRecharge')}</AppText>
          </Pressable>
        </View>
      </View>

      {/* 30일 이내 소멸예정 캐시 모달  */}
      <Pressable onPress={() => navigation.navigate('Recharge')}>
        <AppText>{utils.numberToCommaString(balance || 0)}</AppText>
      </Pressable>

      <FlatList
        data={cashHistory}
        // ListHeaderComponent={header}
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
      modal: bindActionCreators(accountActions, dispatch),
    },
  }),
)(CashHistoryScreen);
