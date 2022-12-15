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
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import AppSvgIcon from '@/components/AppSvgIcon';

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

  action: {
    account: AccountAction;
  };
};

const CashHistoryScreen: React.FC<CashHistoryScreenProps> = ({
  action,
  account = {iccid, token},
}) => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'CashHistoryScreen'>>();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    action.account.getCashHistory({iccid, token}).then((r) => {
      console.log('aaaaa ');
    });
  }, [action.account]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={styles.header}>
        <AppBackButton title={'캐시내역'} style={{width: '70%', height: 56}} />
      </View>
      <AppText>asdfasdf</AppText>
    </SafeAreaView>
  );
};

export default connect(
  ({account}: RootState) => ({
    account,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(CashHistoryScreen);
