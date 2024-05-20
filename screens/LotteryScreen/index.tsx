import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {RouteProp} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import {colors} from '@/constants/Colors';
import {bindActionCreators} from 'redux';
import i18n from '@/utils/i18n';
import {HomeStackParamList} from '@/navigation/navigation';
import AppText from '@/components/AppText';
import ScreenHeader from '@/components/ScreenHeader';
import AppSvgIcon from '@/components/AppSvgIcon';
import {appStyles} from '@/constants/Styles';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {API} from '@/redux/api';
import {RootState} from '@reduxjs/toolkit';
import AppIcon from '@/components/AppIcon';
import {
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import AppAlert from '@/components/AppAlert';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },

  shareIconBox: {
    width: 52,
    height: 52,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
  },
});

type LotteryScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Lottery'
>;
type LotteryScreenRouteProp = RouteProp<HomeStackParamList, 'Lottery'>;

type LotteryProps = {
  navigation: LotteryScreenNavigationProp;
  route: LotteryScreenRouteProp;
  count: number;
  account: AccountModelState;

  action: {
    // order: OrderAction;
    account: AccountAction;
    toast: ToastAction;
  };
};

export type LotteryCouponType = {
  cnt: number;
  title: string;
  desc: string;
  charm: string;
};

const LotteryScreen: React.FC<LotteryProps> = ({
  navigation,
  route,
  account: {iccid, token},
  action,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState('');
  const dispatch = useDispatch();
  // const [couponCnt, setCouponCnt] = useState(0);
  const [coupon, setCoupon] = useState<LotteryCouponType>({
    cnt: 0,
    title: '',
    desc: '',
    charm: '',
  });
  const ref = useRef<ViewShot>();

  const lotteryCoupon = useCallback(() => {
    // 조건이 필요하다.
    // 구매 목록 중에서 completed 된 것들 + lottery_coupon_start_date < created 가 있는 지
    API.Account.lotteryCoupon({
      iccid,
      token,
      prompt: 'lottery',
    }).then((resp) => {
      console.log('@@@@ resp : ', resp);

      const couponObj = resp.objects[0]?.coupon;

      if (resp.result === 0) {
        setCoupon({
          cnt: couponObj?.cnt || 0,
          title: couponObj?.display_name,
          desc: couponObj?.description,
          charm: resp.objects[0]?.charm,
        });

        setPhase(resp.objects[0]?.phrase);
        route?.params?.onPress(0);
        setIsLoading(false);

        // 3초후 쿠폰 결과도 보여달라는데?

        // 뽑기 , 임시로 3초 타임아웃
        setTimeout(() => {
          navigation.navigate('LotteryCoupon', {
            coupon: {
              cnt: couponObj?.cnt || 0, // 이걸로 성공/실패 구분 가능
              title: couponObj?.display_name,
              desc: couponObj?.description,
              charm: resp.objects[0]?.charm,
            },
          });
        }, 3000);
      } else {
        // 실패했을 땐 어떻게 해야할 지??
        // 네트워크 오류나 띄워줄까
      }
    });
  }, [iccid, token]);

  // 컴포넌트로 뗴야하나
  const hasAndroidPermission = useCallback(async () => {
    const permission =
      Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    const hasPermission = await check(permission);
    if (hasPermission === RESULTS.GRANTED) {
      return true;
    }

    AppAlert.confirm(i18n.t('settings'), i18n.t('acc:permPhoto'), {
      ok: () => openSettings(),
    });

    return false;
  }, []);

  const capture = useCallback(async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      action.toast.push('toast:perm:gallery');
      return;
    }

    ref.current?.capture().then((uri) => {
      CameraRoll.save(uri, {type: 'photo', album: i18n.t('rcpt:album')}).then(
        () => action.toast.push('rcpt:saved'),
      );
    });
  }, [action.toast, hasAndroidPermission]);

  const onClick = useCallback(() => {
    // 2초 동안 Loading 표시해주기 코드
    setIsLoading(true);

    // 뽑기 , 임시로 2초 타임아웃
    setTimeout(() => {
      lotteryCoupon();
    }, 2000);
  }, [lotteryCoupon]);

  const renderBody = useCallback(() => {
    if (isLoading) {
      return (
        <View style={{flex: 1, alignItems: 'center'}}>
          <AppText style={appStyles.bold20Text}>
            {i18n.t('esim:lottery:title')}
          </AppText>
          <View
            style={{
              flex: 8,
              justifyContent: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}>
              <AppText style={[appStyles.normal14Text, {textAlign: 'center'}]}>
                {`두구두구`}
              </AppText>
            </View>
          </View>
        </View>
      );
    }

    if (phase) {
      return (
        <>
          <View style={{flex: 1, alignItems: 'center'}}>
            <AppText style={appStyles.bold20Text}>
              {i18n.t('esim:lottery:title')}
            </AppText>
            {coupon?.cnt == 0 && (
              <AppText style={[appStyles.medium14, {marginTop: 10}]}>
                {i18n.t('esim:lottery:wait')}
              </AppText>
            )}
          </View>
          <View
            style={{
              flex: 8,
              justifyContent: 'center',
            }}>
            <ViewShot
              ref={ref}
              style={{
                backgroundColor: colors.greyish,
                height: 300,
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}>
              <AppText style={[appStyles.normal14Text, {textAlign: 'center'}]}>
                {`${phase}`}
              </AppText>
            </ViewShot>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                marginVertical: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Pressable onPress={capture}>
                  <AppIcon name="iconShare2" style={styles.shareIconBox} />
                </Pressable>
              </View>
              <View style={{flexDirection: 'row'}}>
                <AppIcon name="iconShare2" style={styles.shareIconBox} />
                <AppIcon name="iconShare2" style={styles.shareIconBox} />
              </View>
            </View>

            <Pressable
              style={{
                backgroundColor: colors.greyish,
                paddingHorizontal: 20,
                paddingVertical: 10,
                justifyContent: 'center',
              }}
              onPress={() => {
                navigation.popToTop();
                navigation.navigate('Coupon', {
                  test: 'hi',
                });
              }}>
              <AppText style={[appStyles.medium16, {textAlign: 'center'}]}>
                {i18n.t('esim:lottery:button:navi')}
              </AppText>
            </Pressable>
          </View>
        </>
      );
    }

    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{alignItems: 'center'}}>
          <AppText style={appStyles.bold20Text}>
            {i18n.t('esim:lottery:title')}
          </AppText>
        </View>
        <View>
          <AppText style={[appStyles.normal14Text, {textAlign: 'center'}]}>
            {i18n
              .t('esim:lottery:coupon:cnt')
              .replace('%d', route?.params?.count || 0)}
          </AppText>
          <Pressable
            style={{
              backgroundColor: colors.greyish,
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginTop: 40,
              justifyContent: 'center',
            }}
            onPress={onClick}>
            <AppText style={[appStyles.medium16, {textAlign: 'center'}]}>
              {i18n.t('esim:lottery:button')}
            </AppText>
          </Pressable>
        </View>
        <View
          style={{
            justifyContent: 'flex-end',
            paddingHorizontal: 10,
            marginBottom: 40,
            gap: 6,
          }}>
          <AppText style={appStyles.normal14Text}>
            {i18n.t('esim:lottery:notice')}
          </AppText>
        </View>
      </View>
    );
  }, [capture, isLoading, navigation, onClick, phase, route?.params?.count]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        // backHandler={backHandler}
        isStackTop
        renderRight={
          <AppSvgIcon
            name="closeModal"
            style={styles.btnCnter}
            onPress={() => {
              navigation.popToTop();
            }}
          />
        }
      />

      {/* // 메인화면 */}
      {renderBody()}
    </SafeAreaView>
  );
};

export default connect(
  ({account, order}: RootState) => ({
    order,
    account,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(LotteryScreen);
