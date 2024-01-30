import React, {memo, useCallback, useEffect, useState} from 'react';
import {bindActionCreators} from 'redux';
import {
  FlatList,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {connect, useDispatch} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import AppBackButton from '@/components/AppBackButton';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import AppText from '@/components/AppText';
import {RkbCoupon} from '@/redux/api/accountApi';
import {appStyles} from '@/constants/Styles';
import AppTextInput from '@/components/AppTextInput';
import AppButton from '@/components/AppButton';
import {API} from '@/redux/api';
import AppSnackBar from '@/components/AppSnackBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  coupon: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  title: {
    ...appStyles.h1,
    margin: 20,
  },
});

type CouponScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Coupon'
>;

type CouponProps = {
  navigation: CouponScreenNavigationProp;

  account: AccountModelState;

  action: {
    account: AccountAction;
  };
};

const CouponScreen: React.FC<CouponProps> = ({
  action,
  account: {token, coupon, iccid},
}) => {
  const [code, setCode] = useState('');
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    action.account.getMyCoupon({token}).finally(() => {
      setRefreshing(false);
    });
  }, [action.account, token]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const renderCoupon = useCallback(({item}: {item: RkbCoupon}) => {
    return (
      <View style={styles.coupon}>
        <AppText>{item.prName}</AppText>
        <AppText>{item.prDisp}</AppText>
        <AppText>{item.startDate?.toString()}</AppText>
      </View>
    );
  }, []);

  const regCoupon = useCallback(() => {
    if (!code) {
      setMessage(i18n.t('coupon:empty'));
    } else {
      Keyboard.dismiss();
      API.Account.registerCoupon({code, iccid, token}).then((resp) => {
        if (resp.result === 0) {
          setCode('');
          dispatch(action.account.getMyCoupon({token}));
          setMessage(i18n.t('coupon:reg:succ'));
        } else {
          setMessage(i18n.t('coupon:reg:fail'));
        }
      });
    }
  }, [action.account, code, dispatch, iccid, token]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={appStyles.header}>
        <AppBackButton title={i18n.t('mypage:coupon')} />
      </View>
      <View style={styles.row}>
        <AppTextInput
          placeholder={i18n.t('coupon:inputCode')}
          value={code}
          onChangeText={setCode}
        />
        <AppButton
          title={i18n.t('coupon:reg')}
          disabled={code.length < 1}
          onPress={regCoupon}
        />
      </View>
      <AppText style={styles.title}>{i18n.t('coupon:mine')}</AppText>
      <FlatList
        style={{flex: 1}}
        data={coupon}
        keyExtractor={(item) => item.id}
        renderItem={renderCoupon}
        ItemSeparatorComponent={<View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.clearBlue]} // android 전용
            tintColor={colors.clearBlue} // ios 전용
          />
        }
      />
      <View style={{marginHorizontal: 20}}>
        <AppText key="noti">{i18n.t('coupon:noti')}</AppText>
        <AppText key="noti.1">{i18n.t('coupon:noti:1')}</AppText>
        <AppText key="noti.2">{i18n.t('coupon:noti:2')}</AppText>
      </View>
      <AppSnackBar
        visible={!!message}
        textMessage={message}
        onClose={() => setMessage('')}
      />
    </SafeAreaView>
  );
};

export default memo(
  connect(
    ({account}: RootState) => ({account}),
    (dispatch) => ({
      action: {
        account: bindActionCreators(accountActions, dispatch),
      },
    }),
  )(CouponScreen),
);
