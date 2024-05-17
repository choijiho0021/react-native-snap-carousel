import {StackNavigationProp} from '@react-navigation/stack';
import React, {
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {RouteProp, useRoute} from '@react-navigation/native';
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

type CouponProps = {
  cnt: number;
  title: string;
  desc: string;
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
  const [coupon, setCoupon] = useState<CouponProps>({
    cnt: 0,
    title: '',
    desc: '',
  });
  const ref = useRef<ViewShot>();

  useEffect(() => {
    console.log('@@@ route : ', route);
  }, [route]);

  useEffect(() => {
    console.log('@@@ coupon : ', coupon);
  }, [coupon]);

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
        console.log('@@@ resp1 : ', resp.objects[0]?.phrase);
        console.log('@@@ resp1.coupon : ', couponObj?.display_name);
        console.log('@@@ resp1.coupon : ', couponObj?.description);
        setCoupon({
          cnt: couponObj?.cnt || 0,
          title: couponObj?.display_name,
          desc: couponObj?.description,
        });

        setPhase(resp.objects[0]?.phrase);
        setIsLoading(false);
        // dispatch(action.account.getMyCoupon({token})); // 필요한가?
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
    console.log('@@@ 뽑기 실행');

    // 2초 동안 Loading 표시해주기 코드
    setIsLoading(true);

    // 뽑기 , 임시로 2초 타임아웃
    setTimeout(() => {
      lotteryCoupon();
      // 3초후 쿠폰 결과도 보여달라는데?
    }, 2000);
  }, [lotteryCoupon]);

  const renderBody = useCallback(() => {
    if (isLoading) {
      return (
        <View style={{flex: 1, alignItems: 'center'}}>
          <AppText style={appStyles.bold20Text}>{'이번 여행 운세는?'}</AppText>
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
              {'이번 여행 운세는?'}
            </AppText>
            {coupon?.cnt == 0 && (
              <AppText style={[appStyles.medium14, {marginTop: 10}]}>
                {'쿠폰 당첨 결과도 곧 나와요! // 쿠폰 당첨 결과 나오면 미노출'}
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
                {'쿠폰함 바로가기'}
              </AppText>
            </Pressable>
          </View>
        </>
      );
    }

    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{alignItems: 'center'}}>
          <AppText style={appStyles.bold20Text}>{'이번 여행 운세는?'}</AppText>
        </View>
        <View>
          <AppText style={[appStyles.normal14Text, {textAlign: 'center'}]}>
            {'열어보지 않은 쿠폰이 %d개 있네요.\n당첨 여부를 확인해보세요!'.replace(
              '%d',
              route?.params?.count || 0,
            )}
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
              {'여행 운세와 랜덤 쿠폰 뽑기'}
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
            {'- 쿠폰 당첨 기회는 발권당 1번 부여됩니다.'}
          </AppText>
          <AppText style={appStyles.normal14Text}>
            {
              '- 여행 운세 및 쿠폰을 확인하지 않으면 쿠폰 당첨 기회가 누적되며, 확인 시 누적된 기회가 일괄 소진됩니다.'
            }
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
            onPress={() => navigation.goBack()}
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
