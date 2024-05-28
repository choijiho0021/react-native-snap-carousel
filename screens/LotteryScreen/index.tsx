import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import Share, {Social} from 'react-native-share';
import i18n from '@/utils/i18n';
import {HomeStackParamList} from '@/navigation/navigation';
import AppText from '@/components/AppText';
import LottieView from 'lottie-react-native';
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
import ShareLinkModal from '../ProductDetailScreen/components/ShareLinkModal';
import LinearGradient from 'react-native-linear-gradient';
import AppStyledText from '@/components/AppStyledText';

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

  motionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    width: 248,
    height: 248,
    position: 'relative',
  },
  lottieView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  appIcon: {
    width: 248,
    height: 248,
    position: 'absolute',
    top: 0,
    left: 0,
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
  const [showShareModal, setShowShareModal] = useState(false);
  const dispatch = useDispatch();
  // const [couponCnt, setCouponCnt] = useState(0);
  const [coupon, setCoupon] = useState<LotteryCouponType>({
    cnt: 0,
    title: '',
    desc: '',
    charm: '',
  });
  const ref = useRef<ViewShot>();
  const {count, fortune} = route?.params;
  const isHistory = useMemo(() => {
    return count === 0 && fortune;
  }, []);

  const lotteryCoupon = useCallback(() => {
    // 조건이 필요하다.
    // 구매 목록 중에서 completed 된 것들 + lottery_coupon_start_date < created 가 있는 지
    API.Account.lotteryCoupon({
      iccid,
      token,
      prompt: 'lottery',
    }).then((resp) => {
      console.log('@@@resp : ', resp);

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

  const shareInstaStory = useCallback(async () => {
    try {
      const uri = await ref.current?.capture?.();

      const image = Platform.OS === 'android' ? uri : `file://${uri}`;

      console.log('@@@ image를 값으로 찍으면 어떻게 될까? : ', image);

      if (uri) {
        const shareOptions = {
          stickerImage: image,
          backgroundBottomColor: '#fefefe',
          backgroundTopColor: '#906df4',
          social: Share.Social.INSTAGRAM_STORIES,
          appId: 'fb147522690488197',
        };
        const result = await Share.shareSingle(shareOptions);

        console.log('@@@@ result : ', result);
      } else {
        console.log('@@@  empty uri');
      }
    } catch (e) {
      console.log('@@@@ share error : ', e);
    }
  }, []);

  const onClick = useCallback(() => {
    // 2초 동안 Loading 표시해주기 코드
    setIsLoading(true);

    // 뽑기 , 임시로 2초 타임아웃
    setTimeout(() => {
      lotteryCoupon();
    }, 2000);
  }, [lotteryCoupon]);

  const loadingMotion = useCallback(() => {
    return (
      <View style={styles.motionContainer}>
        <View style={styles.overlayContainer}>
          <LottieView
            autoPlay
            loop
            style={styles.lottieView}
            source={require('@/assets/animation/lucky.json')}
            resizeMode="cover"
          />
          <AppIcon
            imgStyle={styles.appIcon}
            name="loadingLucky"
            mode="contain"
          />
        </View>
      </View>
    );
  }, []);

  const renderBody = useCallback(() => {
    if (isLoading) {
      // if (true) {
      return (
        <View style={{flex: 1, alignItems: 'center'}}>
          <View
            style={{
              justifyContent: 'center',
              marginTop: 60,
            }}>
            <View
              style={{
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}>
              <AppText
                style={[
                  appStyles.bold36Text,
                  {textAlign: 'center', lineHeight: 38},
                ]}>
                {`두근두근`}
              </AppText>
            </View>

            <View style={{marginTop: 104}}>{loadingMotion()}</View>
          </View>
        </View>
      );
    }

    // 어지럽다.. 코드 분할 하자
    if (phase || isHistory) {
      return (
        <>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: 'black',
                borderRadius: 99,
                paddingHorizontal: 16,
                paddingVertical: 3,
                marginTop: 72,
              }}>
              <AppText
                style={[
                  appStyles.medium14,
                  {color: colors.white, lineHeight: 20},
                ]}>
                {i18n.t('esim:lottery:title:history')}
              </AppText>
            </View>
            {coupon?.cnt == 0 && !isHistory && (
              <AppText style={[appStyles.medium14, {marginTop: 10}]}>
                {i18n.t('esim:lottery:wait')}
              </AppText>
            )}

            <View>
              <AppText
                style={[
                  appStyles.semiBold24Text,
                  {marginTop: 10, lineHeight: 30, color: colors.black},
                ]}>
                {`${phase || fortune}`}
              </AppText>
            </View>
          </View>
          <View
            style={{
              flex: 8,
              justifyContent: 'center',
            }}>
            <ViewShot
              ref={ref}
              options={{
                fileName: 'test',
                format: 'jpg',
                quality: 0.9,
              }}
              style={{
                backgroundColor: colors.greyish,
                height: 300,
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}>
              <AppText style={[appStyles.normal14Text, {textAlign: 'center'}]}>
                {`${phase || fortune}`}
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
                <AppIcon
                  onPress={() => {
                    setShowShareModal(true);
                  }}
                  name="iconShare2"
                  style={styles.shareIconBox}
                />
                <Pressable
                  onPress={() => {
                    shareInstaStory();
                  }}>
                  <AppIcon
                    name="iconShare2"
                    style={[styles.shareIconBox, {backgroundColor: 'grey'}]}
                  />
                </Pressable>
              </View>
            </View>

            {fortune && (
              <Pressable
                style={{
                  backgroundColor: colors.greyish,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  justifyContent: 'center',
                }}
                onPress={() => {
                  navigation.popToTop();
                  navigation.navigate('Coupon');
                }}>
                <AppText style={[appStyles.medium16, {textAlign: 'center'}]}>
                  {i18n.t('esim:lottery:button:navi')}
                </AppText>
              </Pressable>
            )}
          </View>
        </>
      );
    }

    // 코드 분할 해야겠는데 겁나 헷갈려 -> 뽑기 전 화면
    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{alignItems: 'center', marginTop: 32}}>
          <AppText
            style={[
              appStyles.bold18Text,
              {color: colors.blue, lineHeight: 26},
            ]}>
            {'랜덤 쿠폰까지!'}
          </AppText>
          <AppText
            style={[appStyles.bold36Text, {color: colors.black, marginTop: 6}]}>
            {i18n.t('esim:lottery:title')}
          </AppText>
          <AppStyledText
            text={`내 쿠폰 기회 : <h>${count}번</h>`}
            textStyle={[
              appStyles.bold18Text,
              {color: colors.black, lineHeight: 26, marginTop: 16},
            ]}
            format={{
              h: {color: colors.blue},
            }}
            numberOfLines={2}
          />
        </View>

        <AppIcon
          name="mainLucky"
          mode="contain"
          imgStyle={{width: 248, height: 248}}
        />

        <View>
          {/* 사라진 기획? {route?.params?.count > 1 && (
            <AppText style={[appStyles.normal14Text, {textAlign: 'center'}]}>
              {i18n
                .t('esim:lottery:coupon:cnt')
                .replace('%d', route?.params?.count || 0)}
            </AppText>
          )} */}

          <View
            style={{
              justifyContent: 'flex-end',
              marginHorizontal: 20,
              marginBottom: 20,
              gap: 6,
            }}>
            <AppText
              style={[
                appStyles.bold14Text,
                {color: colors.paleGray4, lineHeight: 20},
              ]}>
              {i18n.t('esim:lottery:notice')}
            </AppText>
          </View>
          <Pressable
            style={{
              backgroundColor: colors.blue,
              height: 52,
              borderRadius: 3,
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginHorizontal: 20,
              marginBottom: 16,
              justifyContent: 'center',
            }}
            onPress={onClick}>
            <AppText
              style={[
                appStyles.medium18,
                {
                  color: colors.white,
                  letterSpacing: 0,
                  lineHeight: 26,
                },
              ]}>
              {i18n.t('esim:lottery:button')}
            </AppText>
          </Pressable>
        </View>
      </View>
    );
  }, [capture, isLoading, navigation, onClick, phase, route?.params?.count]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#eeeeee', '#D0E9FF']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
        }}>
        <ScreenHeader
          // backHandler={backHandler}
          headerStyle={{backgroundColor: 'transparent'}}
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

        {/* 공유 어떻게 할지 정해지면 props 수정 필요 */}
        <ShareLinkModal
          visible={showShareModal}
          onClose={() => {
            setShowShareModal(false);
          }}
          params={{
            partnerId: route?.params?.partnerId,
            uuid: route?.params?.uuid,
            img: route?.params?.img,
            listPrice: route.params?.listPrice,
            price: route.params?.price,
          }}
        />
      </LinearGradient>
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
