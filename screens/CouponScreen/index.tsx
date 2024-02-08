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
import AppSvgIcon from '@/components/AppSvgIcon';
import CouponItem from './CouponItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  coupon: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderColor: colors.gray4,
    borderWidth: 1,
    borderRadius: 3,
    marginHorizontal: 20,
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  title: {
    ...appStyles.bold16Text,
    marginTop: 40,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 3,
    height: 40,
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 16,
  },
  regBtn: {
    width: 92,
    height: 40,
    borderRadius: 3,
    backgroundColor: colors.clearBlue,
  },
  bottom: {
    paddingVertical: 40,
    backgroundColor: colors.backGrey,
  },
  caution: {
    ...appStyles.medium14,
    marginHorizontal: 20,
    color: colors.warmGrey,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
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
  const [focused, setFocused] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    action.account.getMyCoupon({token}).finally(() => {
      setRefreshing(false);
    });
  }, [action.account, token]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const renderCoupon = useCallback(
    ({item}: {item: RkbCoupon}) => (
      <View style={styles.coupon}>
        <CouponItem item={item} />
      </View>
    ),
    [],
  );

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
      <View style={[styles.row, {marginTop: 24}]}>
        <View
          style={[
            styles.input,
            {borderColor: focused ? colors.clearBlue : colors.lightGrey},
          ]}>
          <AppTextInput
            style={{flex: 1}}
            placeholder={i18n.t('coupon:inputCode')}
            value={code}
            onChangeText={setCode}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {code.length > 0 && (
            <AppButton
              style={{justifyContent: 'flex-end', marginLeft: 10}}
              iconName="btnSearchCancel"
              onPress={() => setCode('')}
            />
          )}
        </View>
        <AppButton
          style={styles.regBtn}
          title={i18n.t('coupon:reg')}
          disabled={code.length < 1}
          onPress={regCoupon}
          titleStyle={[appStyles.semiBold16Text, {color: colors.white}]}
        />
      </View>
      <AppText style={styles.title}>{i18n.t('coupon:mine')}</AppText>
      <FlatList
        style={{flex: 1}}
        data={coupon}
        keyExtractor={(item) => item.id}
        renderItem={renderCoupon}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppSvgIcon name="imgCoupon" />
            <AppText style={[appStyles.bold14Text, {color: colors.warmGrey}]}>
              {i18n.t('coupon:none')}
            </AppText>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.clearBlue]} // android 전용
            tintColor={colors.clearBlue} // ios 전용
          />
        }
      />
      <View style={styles.bottom}>
        <View style={[styles.row, {marginBottom: 12}]}>
          <AppSvgIcon name="caution24" />
          <AppText key="noti" style={[appStyles.bold18Text, {marginLeft: 8}]}>
            {i18n.t('coupon:noti')}
          </AppText>
        </View>
        <AppText key="noti.1" style={styles.caution}>
          {i18n.t('coupon:noti:1')}
        </AppText>
        <AppText key="noti.2" style={styles.caution}>
          {i18n.t('coupon:noti:2')}
        </AppText>
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
