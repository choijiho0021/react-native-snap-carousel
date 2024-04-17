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
import {HomeStackParamList, goBack} from '@/navigation/navigation';
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
import api from '@/redux/api/api';
import moment from 'moment';
import Env from '@/environment';
import ScreenHeader from '@/components/ScreenHeader';
import {useRoute} from '@react-navigation/native';
import BackbuttonHandler from '@/components/BackbuttonHandler';

const {isIOS} = Env.get();

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
    color: colors.warmGrey,
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  middleDot: {
    ...appStyles.medium14,
    color: colors.warmGrey,
    marginHorizontal: 8,
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
  navigation,
}) => {
  const [code, setCode] = useState('');
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [focused, setFocused] = useState(false);
  const [bottom, setBottom] = useState(20);
  const route = useRoute();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    action.account.getMyCoupon({token}).finally(() => {
      setRefreshing(false);
    });
  }, [action.account, token]);
  // 완료창에서 뒤로가기 시 확인과 똑같이 처리한다.

  BackbuttonHandler({
    navigation,
    onBack: () => {
      navigation.popToTop();
      goBack(navigation, route);
      return true;
    },
  });

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      if (isIOS) setBottom(e.endCoordinates.height + 20);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', (e) => {
      if (isIOS) setBottom(20);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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

          const endDate = resp.objects?.[0]?.endDate;
          const now = moment();

          if (now.isSame(endDate, 'day')) {
            setMessage(i18n.t('coupon:reg:succ:1dayLeft'));
          } else {
            setMessage(i18n.t('coupon:reg:succ'));
          }
          dispatch(action.account.getMyCoupon({token}));
        } else if (resp.result === api.E_RESOURCE_NOT_FOUND) {
          setMessage(i18n.t('coupon:reg:fail:norsc'));
        } else if (resp.result === api.E_ALREADY_EXIST) {
          setMessage(i18n.t('coupon:reg:fail:duplicated'));
        } else {
          setMessage(i18n.t('coupon:reg:fail'));
        }
      });
    }
  }, [action.account, code, dispatch, iccid, token]);

  const renderCaution = useCallback(
    () => (
      <View style={styles.bottom}>
        <View style={[styles.row, {marginBottom: 12}]}>
          <AppSvgIcon name="caution24" />
          <AppText key="noti" style={[appStyles.bold18Text, {marginLeft: 8}]}>
            {i18n.t('coupon:noti')}
          </AppText>
        </View>

        {[1, 2].map((elm) => (
          <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <AppText key="dot1" style={styles.middleDot}>
              {i18n.t('middleDot')}
            </AppText>
            <AppText key="noti.1" style={styles.caution}>
              {i18n.t(`coupon:noti:${elm}`)}
            </AppText>
          </View>
        ))}
      </View>
    ),
    [],
  );

  const renderListHeader = useCallback(
    (value: string, changing: boolean) => (
      <>
        <View style={[styles.row, {marginTop: 24}]}>
          <View
            style={[
              styles.input,
              {borderColor: changing ? colors.clearBlue : colors.lightGrey},
            ]}>
            <AppTextInput
              style={{flex: 1}}
              placeholder={i18n.t('coupon:inputCode')}
              value={value}
              onChangeText={setCode}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {value.length > 0 && focused && (
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
            disabled={value.length < 1}
            onPress={regCoupon}
            disabledOnPress={regCoupon}
            disabledCanOnPress
            titleStyle={[appStyles.semiBold16Text, {color: colors.white}]}
          />
        </View>
        <AppText style={styles.title}>{i18n.t('coupon:mine')}</AppText>
      </>
    ),
    [focused, regCoupon],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={appStyles.header}>
        <AppBackButton title={i18n.t('mypage:coupon')} />
      </View>
      <FlatList
        style={{flex: 1}}
        data={coupon}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={renderCoupon}
        ListHeaderComponent={renderListHeader(code, focused)}
        ListFooterComponent={renderCaution}
        ListFooterComponentStyle={{
          flex: 1,
          justifyContent: 'flex-end',
        }}
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

      <AppSnackBar
        visible={!!message}
        textMessage={message}
        onClose={() => setMessage('')}
        bottom={bottom}
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
