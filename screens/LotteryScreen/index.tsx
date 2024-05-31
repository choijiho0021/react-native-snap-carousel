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
import {connect} from 'react-redux';
import {RouteProp} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import Env from '@/environment';
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
  Fortune,
  actions as accountActions,
} from '@/redux/modules/account';
import {API} from '@/redux/api';
import {RootState} from '@reduxjs/toolkit';
import AppIcon from '@/components/AppIcon';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import {SharePlatfromType} from '../ProductDetailScreen/components/ShareLinkModal';
import LotteryModal from './component/LotteryModal';
import {captureScreen, utils} from '@/utils/utils';
import LotteryShareModal from './component/LotteryShareModal';
import RenderBeforeLottery from './component/RenderBeforeLottery';
import RenderLoadingLottery from './component/RenderLoadingLottery';

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

  dividerSmall: {
    borderRightWidth: 1,
    marginVertical: 15,
    height: 20,
    marginBottom: 0,
    borderColor: colors.whiteEight,
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
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 0,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 63,
    marginBottom: 35,
  },

  naviCouponBtn: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },
  naviCouponBtnText: {
    ...appStyles.bold18Text,
    textAlign: 'center',
    color: colors.white,
    lineHeight: 26,
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
  ['#C9AAD7', '#B382CA'],
  ['#F3C0B7', '#ECA092'],
  ['#8FD3EE', '#43B5E2'],
  ['#A8D2C8', '#63CDB4'],
  ['#E2CBB0', '#DDB486'],
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

  // const ref = useRef<ViewShot>();
  const ref = useRef<ViewShot>();
  const {count, fortune} = route?.params;

  // 이게 정확히 무슨 기능?
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
          cnt: couponObj?.cnt || 0, // 이걸로 쿠폰 결과 알 수 있음?
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

  const onShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const renderTitleAndPhase = useCallback(() => {
    return (
      <View style={{alignItems: 'center'}}>
        <View style={styles.lotteryResultTitleBox}>
          <AppText
            style={[appStyles.medium14, {color: colors.white, lineHeight: 20}]}>
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
    );
  }, [coupon?.cnt, fortune?.text, isHistory, phase?.text]);

  // 이미지 공유용 뷰샷 따로 넣어놓기
  const shareView = useCallback(() => {
    return (
      <ViewShot
        ref={ref}
        style={{position: 'absolute', left: -1700}}
        options={{
          fileName: 'test',
          format: 'png',
          quality: 0.9,
        }}>
        <LinearGradient
          // Background Linear Gradient
          colors={GRADIENT_COLOR_LIST[screenNum]}
        />
        {renderTitleAndPhase()}
        <View style={styles.imageContainer}>
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
    );
  }, [renderTitleAndPhase, screenNum]);

  const shareInstaStory = useCallback(async () => {
    try {
      const uri = await ref.current?.capture?.();

      const image = Platform.OS === 'android' ? uri : `file://${uri}`;

      console.log('@@@@ image : ', image);
      // ['rgb(201, 170, 215)', 'rgb(179, 130, 202)'],

      if (uri) {
        const shareOptions = {
          stickerImage: image,
          backgroundBottomColor: GRADIENT_COLOR_LIST[screenNum][1],
          backgroundTopColor: GRADIENT_COLOR_LIST[screenNum][0],
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
  }, [screenNum]);

  const onClick = useCallback(() => {
    // 2초 동안 Loading 표시해주기 코드
    setIsLoading(true);

    // 뽑기 , 임시로 2초 타임아웃
    setTimeout(() => {
      lotteryCoupon();
    }, 2000);
  }, [lotteryCoupon]);

  const renderShareButton = useCallback(
    (text: string, appIcon: string, onPress: any) => {
      return (
        <Pressable onPress={onPress}>
          <View style={styles.btnBox}>
            <AppIcon name={appIcon} style={styles.shareIconBox} />
            <AppText style={styles.btnText}>{text}</AppText>
          </View>
        </Pressable>
      );
    },
    [],
  );

  const renderAfterLottery = useCallback(() => {
    return (
      <>
        <View>
          {renderTitleAndPhase()}
          <View
            style={[
              styles.imageContainer,
              {
                marginTop: 32,
              },
            ]}>
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
        </View>
        <View style={styles.btnContainer}>
          {renderShareButton(
            i18n.t('esim:lottery:share:img'),
            'btnShare1',
            () => captureScreen(ref, action.toast),
          )}

          <View style={styles.dividerSmall} />

          {renderShareButton(
            i18n.t('esim:lottery:share:sns'),
            'btnShare2',
            onShare,
          )}

          <View style={styles.dividerSmall} />

          {renderShareButton(
            i18n.t('esim:lottery:share:story'),
            'btnShareInsta',
            () => shareInstaStory(),
          )}
        </View>

        <View
          style={{
            paddingHorizontal: 20,
          }}>
          {fortune?.text && (
            <Pressable
              style={styles.naviCouponBtn}
              onPress={() => {
                navigation.popToTop();
                navigation.navigate('Coupon');
              }}>
              <AppText style={styles.naviCouponBtnText}>
                {i18n.t('esim:lottery:button:navi')}
              </AppText>
            </Pressable>
          )}
        </View>
      </>
    );
  }, [
    action.toast,
    fortune?.text,
    navigation,
    onShare,
    renderShareButton,
    renderTitleAndPhase,
    screenNum,
    shareInstaStory,
  ]);

  const renderBody = useCallback(() => {
    if (isLoading) {
      // if (true) {
      return <RenderLoadingLottery />;
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

    return <RenderBeforeLottery count={count} onClick={onClick} />;
  }, [
    count,
    isHistory,
    isLoading,
    onClick,
    phase?.text,
    renderAfterLottery,
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

  const getBase64 = useCallback((imgLink: string) => {
    let imagePath = null;
    const {fs} = RNFetchBlob;

    return RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', imgLink)
      .then((resp) => {
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(async (base64Data) => {
        const base64Image = `data:image/jpeg;base64,${base64Data}`;

        return base64Image;
      });
  }, []);

  const onShareMore = useCallback(
    async (link, imgLink) => {
      try {
        console.log('@@ link : ', link);

        getBase64(imgLink).then(async (base64) => {
          const base64Image = `data:image/jpeg;base64,${base64}`;

          await Share.open({
            // title: i18n.t('rtitle'),
            urls: [base64Image],
            subject: 'Check out this image!',
            message: `내용에 링크를 넣어보자.`,
          }).then((r) => {
            console.log('onShare success');
          });
        });
      } catch (e) {
        console.log('onShare fail : ', e);
      }
    },
    [getBase64],
  );

  const onPressShareMore = useCallback(
    async (shareLink, imgLink) => {
      if (shareLink) {
        onShareMore(shareLink, imgLink);
      }
    },
    [onShareMore],
  );

  const onPressShareMessage = useCallback(
    async (msg: string, imgLink: string) => {
      getBase64(imgLink).then((base64) => {
        try {
          const shareOptions = {
            social: Share.Social.SMS,
            message: '내용내용내용',
            title: '타이틀이 의미가 있나?',
            url: base64,
            recipient: '',
          };
          Share.shareSingle(shareOptions).then((result) => {
            console.log('@@@@ result : ', result);
          });
        } catch (e) {
          console.log('@@@@ share error : ', e);
        }
      });
    },

    [getBase64],
  );

  const sharePlatform = useCallback(
    (pictureUrl: string, type: string, link: string) => {
      const serverImageUrl = API.default.httpImageUrl(pictureUrl);

      console.log('@@@ serverImageUrl : ', serverImageUrl);

      // more , sms, kakao 때만 동적 링크 필요
      if (['more', 'sms', 'kakao'].includes(type)) {
        return API.Promotion.buildLinkFortune({
          imageUrl: serverImageUrl || '',
          link,
          desc: i18n.t('esim:lottery:share:desc'),
        }).then(async (url) => {
          console.log('@@@ 만들어진 url 링크 확인 : ', url);

          if (type === 'kakao') {
            onPressShareKakaoForFortune(url, serverImageUrl || '');
          } else if (type === 'more') {
            onPressShareMore(url, serverImageUrl);
          } else if (type === 'sms') {
            console.log('@@@ sms');
            onPressShareMessage(url, serverImageUrl);
          }
        });
      }
    },
    [onPressShareKakaoForFortune, onPressShareMessage, onPressShareMore],
  );
  // 공유 관련 코드 따로 컴포넌트 파서 사용하자..
  const onSharePress = useCallback(
    async (type: SharePlatfromType) => {
      // TODO : 서버에서 받은 값을 넣어줘야겠다.

      console.log('@@@ onSharePress');

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
            sharePlatform(pictureUrl, type, link);
          } else {
            uploadImage().then((url) => {
              sharePlatform(url, type, link);
            });
          }
        }
      });

      if (type === 'insta') {
        shareInstaStory();

        return 'insta send success';
      }
    },
    [iccid, shareInstaStory, sharePlatform, token, uploadImage],
  );

  return (
    <SafeAreaView style={styles.container}>
      {shareView()}
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
        onClose={() => setShowCouponModal(false)}
      />

      {/* 공유 어떻게 할지 정해지면 props 수정 필요 */}
      <LotteryShareModal
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
