import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {RouteProp} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import LinearGradient from 'react-native-linear-gradient';
import {
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import Env from '@/environment';
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
  Fortune,
  actions as accountActions,
} from '@/redux/modules/account';
import {API} from '@/redux/api';
import {RootState} from '@reduxjs/toolkit';
import AppIcon from '@/components/AppIcon';
import {
  actions as toastActions,
  ToastAction,
  actions,
} from '@/redux/modules/toast';
import AppAlert from '@/components/AppAlert';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ShareLinkModal, {
  SharePlatfromType,
} from '../ProductDetailScreen/components/ShareLinkModal';
import AppStyledText from '@/components/AppStyledText';
import LotteryModal from './component/LotteryModal';
import {RkbImage} from '@/redux/api/accountApi';
import {utils} from '@/utils/utils';
import RNFetchBlob from 'rn-fetch-blob';

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
    width: 20,
    height: 20,
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
  dividerSmall: {
    borderRightWidth: 1,
    marginVertical: 15,
    height: 20,
    marginBottom: 0,
    borderColor: colors.whiteEight,
  },
  appIcon: {
    width: 248,
    height: 248,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  btnBox: {
    alignItems: 'center',
    gap: 10,
  },
  btnText: {
    ...appStyles.medium14,
    color: colors.white,
  },
  lotteryResultTitleBox: {
    backgroundColor: 'black',
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 3,
    marginTop: 0,
  },
  fortuneText: {
    ...appStyles.semiBold24Text,
    marginTop: 10,
    lineHeight: 30,
    color: colors.black,
    textAlign: 'center',
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

const GRADIENT_COLOR_LIST = [
  ['rgb(201, 170, 215)', 'rgb(179, 130, 202)'],
  ['rgb(243, 192, 183)', 'rgb(236, 160, 146)'],
  ['rgb(143, 211,238)', 'rgb(67,181,226)'],
  ['rgb(168, 210,200)', 'rgb(99, 205, 180)'],
  ['rgb(226,203,176)', 'rgb(221,180,134)'],
];

const {isProduction} = Env.get();

const LotteryScreen: React.FC<LotteryProps> = ({
  navigation,
  route,
  account: {iccid, token, mobile},
  action,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<Fortune>({text: '', num: 0});
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(''); // params 으로도 받아야함.

  const dispatch = useDispatch();

  const [coupon, setCoupon] = useState<LotteryCouponType>({
    // cnt: 0,
    // title: '',
    // desc: '',
    // charm: '',
    charm: 'sites/default/files/coupon_clover.png',
    cnt: 0,
    desc: '테스트',
    title: '2% 추첨 쿠폰',
  });
  const ref = useRef<ViewShot>();
  const {count, fortune} = route?.params;
  const isHistory = useMemo(() => {
    return count === 0 && fortune?.text;
  }, [count, fortune?.text]);

  const screenNum = useMemo(
    () => phase?.num || fortune?.num,
    [fortune?.num, phase?.num],
  );

  useEffect(() => {
    console.log('phase : ', phase);
    console.log('@@@ screenNum : ', screenNum);
  }, [phase, screenNum]);

  const uploadImage = useCallback(async () => {
    const uri = await ref.current?.capture?.();
    const image = Platform.OS === 'android' ? uri : `file://${uri}`;

    const convertImage = await utils.convertFileURLtoRkbImage(image);

    // image upload
    API.Account.uploadFortuneImage({
      image: convertImage,
      user: mobile,
      token,
    }).then((resp) => {
      if (resp?.result === 0) {
        const serverImageUrl = API.default.httpImageUrl(
          resp?.objects[0]?.userPictureUrl,
        );

        // fortune Image 필드 갱신
        API.Account.lotteryCoupon({
          iccid,
          token,
          prompt: 'image',
          fid: parseInt(resp?.objects[0]?.fid, 10), // ref_fortune 값에 넣을 데이터, imageUrl은 리덕스 처리해야하나...
        }).then((resp) => {
          if (resp?.result === 0) return serverImageUrl;
        });
      }

      return '';
    });
  }, [iccid, mobile, token]);

  const lotteryCoupon = useCallback(async () => {
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

        console.log('@@@ resp.objects[0] : ', resp.objects[0]);
        setPhase({text: resp.objects[0]?.phrase, num: resp.objects[0]?.num});
        route?.params?.onPress(0);
        setIsLoading(false);

        // 3초후 쿠폰 결과도 보여달라는데?

        // {"charm": "sites/default/files/temp_charm.png", "cnt": 0, "desc": "테스트", "title": "2% 추첨 쿠폰"}

        console.log('@@@ params : ', {
          cnt: couponObj?.cnt || 0, // 이걸로 성공/실패 구분 가능
          title: couponObj?.display_name,
          desc: couponObj?.description,
          charm: resp.objects[0]?.charm,
        });

        // 뽑기 , 임시로 3초 타임아웃
        setTimeout(() => {
          setShowCouponModal(true);
        }, 3000);
      } else {
        // 실패했을 땐 어떻게 해야할 지??
        // 네트워크 오류나 띄워줄까
      }
    });
  }, [iccid, route?.params, token]);

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

  const onShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const shareInstaStory = useCallback(async (imageParam: string) => {
    try {
      const uri = await ref.current?.capture?.();

      const image =
        imageParam || (Platform.OS === 'android' ? uri : `file://${uri}`);

      console.log('@@@@ image : ', image);

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

  const renderLoading = useCallback(
    () => (
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
              {i18n.t('esim:lottery:loading')}
            </AppText>
          </View>
          <View style={{marginTop: 104}}>{loadingMotion()}</View>
        </View>
      </View>
    ),
    [loadingMotion],
  );

  const renderAfterLottery = useCallback(() => {
    return (
      <>
        <ViewShot
          ref={ref}
          options={{
            fileName: 'test',
            format: 'png',
            quality: 0.9,
          }}>
          <View style={{alignItems: 'center'}}>
            <View style={styles.lotteryResultTitleBox}>
              <AppText
                style={[
                  appStyles.medium14,
                  {color: colors.white, lineHeight: 20},
                ]}>
                {i18n.t('esim:lottery:title:history')}
              </AppText>
            </View>
            {coupon?.cnt === 0 && !isHistory && (
              <AppText style={[appStyles.medium14, {marginTop: 10}]}>
                {i18n.t('esim:lottery:wait')}
              </AppText>
            )}

            <View>
              <AppText style={styles.fortuneText}>
                {`${phase?.text || fortune?.text}`}
              </AppText>
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
              marginTop: 32,
            }}>
            <Image
              style={{
                width: 242,
                height: 242,
              }}
              source={{
                uri: API.default.httpImageUrl(
                  `sites/default/files/img/fortune_card${screenNum}.png`,
                ),
              }}
            />
          </View>
        </ViewShot>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginHorizontal: 20,
            marginTop: 63,
            marginBottom: 35,
          }}>
          <Pressable onPress={capture}>
            <View style={styles.btnBox}>
              <AppIcon name="btnShare1" style={styles.shareIconBox} />
              <AppText style={styles.btnText}>{'이미지 저장'}</AppText>
            </View>
          </Pressable>

          <View style={styles.dividerSmall} />

          <Pressable onPress={onShare}>
            <View style={styles.btnBox}>
              <AppIcon name="btnShare2" style={styles.shareIconBox} />
              <AppText style={styles.btnText}>{'SNS 공유'}</AppText>
            </View>
          </Pressable>

          <View style={styles.dividerSmall} />
          <Pressable
            onPress={() => {
              shareInstaStory();
            }}>
            <View style={styles.btnBox}>
              <AppIcon name="btnShareInsta" style={styles.shareIconBox} />
              <AppText style={styles.btnText}>{'스토리 공유'}</AppText>
            </View>
          </Pressable>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
          }}>
          {fortune?.text && (
            <Pressable
              style={{
                paddingHorizontal: 20,
                paddingVertical: 13,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.white,
              }}
              onPress={() => {
                navigation.popToTop();
                navigation.navigate('Coupon');
              }}>
              <AppText
                style={[
                  appStyles.bold18Text,
                  {
                    textAlign: 'center',
                    color: colors.white,
                    lineHeight: 26,
                  },
                ]}>
                {i18n.t('esim:lottery:button:navi')}
              </AppText>
            </Pressable>
          )}
        </View>
      </>
    );
  }, [
    capture,
    coupon?.cnt,
    fortune?.text,
    isHistory,
    navigation,
    onShare,
    phase?.text,
    screenNum,
    shareInstaStory,
  ]);

  const renderBeforeLottery = useCallback(() => {
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
  }, [count, onClick]);

  const renderBody = useCallback(() => {
    if (isLoading) {
      // if (true) {
      return (
        <>
          <LinearGradient
            // Background Linear Gradient
            colors={['#eeeeee', '#D0E9FF']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: '100%',
            }}
          />
          {renderLoading()}
        </>
      );
    }

    if (phase?.text || isHistory) {
      return (
        <>
          <LinearGradient
            // Background Linear Gradient
            colors={GRADIENT_COLOR_LIST[screenNum]}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: '100%',
            }}
          />
          {renderAfterLottery()}
        </>
      );
    }

    return (
      <>
        <LinearGradient
          // Background Linear Gradient
          colors={['#eeeeee', '#D0E9FF']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '100%',
          }}
        />
        {renderBeforeLottery()}
      </>
    );
  }, [
    isHistory,
    isLoading,
    phase,
    renderAfterLottery,
    renderBeforeLottery,
    renderLoading,
    screenNum,
  ]);

  // TODO : Share 관련된 것만 따로 뺼 것
  const onPressShareKakaoForFortune = useCallback(
    async (link: string, imgUrl: string) => {
      console.log('@@@@ kakaoShare image Url 전달 : ', imgUrl);

      const resp = await KakaoSDK.KakaoShareLink.sendCustom({
        templateId: isProduction ? 107765 : 108427,
        templateArgs: [
          {key: 'dynamicLink', value: link},
          {
            key: 'image',
            value: imgUrl,
          },
        ],
      });

      console.log('@@@ onPressKakao Result : ', resp);
    },

    [],
  );

  const onShareMore = useCallback(async (link) => {
    try {
      console.log('@@ link : ', link);
      await Share.open({
        title: i18n.t('rtitle'),
        url: link,
        message: `내용에 링크를 넣어보자.`,
      }).then((r) => {
        console.log('onShare success ');
      });
    } catch (e) {
      console.log('onShare fail : ', e);
    }
  }, []);

  const onPressShareMore = useCallback(
    (shareLink) => {
      if (shareLink) onShareMore(shareLink);
    },
    [onShareMore],
  );

  const sharePlatform = useCallback(
    (pictureUrl: string, type: string) => {
      const serverImageUrl = API.default.httpImageUrl(pictureUrl);

      console.log('@@@ serverImageUrl : ', serverImageUrl);

      // more , sms, kakao 때만 동적 링크 필요
      if (['more', 'sms', 'kakao'].includes(type)) {
        return API.Promotion.buildLinkFortune({
          imageUrl: serverImageUrl || '',
          link,
          desc: i18n.t('esim:lotterty:share:desc'),
        }).then(async (url) => {
          console.log('@@@ 만들어진 url 링크 확인 : ', url);

          if (type === 'kakao') {
            onPressShareKakaoForFortune(url, serverImageUrl || '');
          } else if (type === 'more') {
            onPressShareMore(url);
          }
        });
      }
    },
    [onPressShareKakaoForFortune, onPressShareMore],
  );
  // 공유 관련 코드 따로 컴포넌트 파서 사용하자..
  const onSharePress = useCallback(
    async (type: SharePlatfromType) => {
      // TODO : 서버에서 받은 값을 넣어줘야겠다.

      console.log('@@@ onSharePress');
      // uploadImage();

      const link = `http://tb.rokebi.com?${encodeURIComponent(
        'linkPath=ozCS&recommender=411d33bb-0bb6-4244-9b01-d5309233229f',
      )}`;
      API.Account.lotteryCoupon({
        iccid,
        token,
        prompt: 'image',
      }).then((resp) => {
        console.log('@@@ lotteryCoupon resp : ', resp);

        if (resp.result === 0) {
          const pictureUrl = resp?.objects[0]
            ? resp?.objects[0]?.userPictureUrl
            : '';

          if (pictureUrl) {
            sharePlatform(pictureUrl, type);
          } else {
            uploadImage().then((url) => {
              sharePlatform(url, type);
            });
          }
        }
      });

      if (type === 'insta') {
        shareInstaStory(image);

        return 'insta send success';
      }
    },
    [iccid, shareInstaStory, sharePlatform, token, uploadImage],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        // backHandler={backHandler}
        headerStyle={{backgroundColor: 'transparent', zIndex: 10}}
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

      <LotteryModal
        visible={showCouponModal}
        coupon={coupon}
        onClose={setShowCouponModal}
      />

      {/* 공유 어떻게 할지 정해지면 props 수정 필요 */}
      <ShareLinkModal
        mode="fortune"
        params={{
          img: API.default.httpImageUrl(
            `sites/default/files/img/fortune_card${screenNum}.png`,
          ),
        }}
        onPress={onSharePress} // 여기다가 종합셋트 만들어야하나
        onShareInsta={shareInstaStory}
        visible={showShareModal}
        onClose={() => {
          setShowShareModal(false);
        }}
      />
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
