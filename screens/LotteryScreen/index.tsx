import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
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
import {RootState} from '@reduxjs/toolkit';
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
import AppIcon from '@/components/AppIcon';
import LotteryModal from './component/LotteryModal';
import {captureScreen} from '@/utils/utils';
import LotteryShareModal from './component/LotteryShareModal';
import RenderBeforeLottery from './component/RenderBeforeLottery';
import RenderLoadingLottery from './component/RenderLoadingLottery';
import BackbuttonHandler from '@/components/BackbuttonHandler';
import AppSnackBar from '@/components/AppSnackBar';

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
    marginBottom: 32,
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
  gradientContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '115%',
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

const IMAGE_WIDTH = 242;

const LotteryScreen: React.FC<LotteryProps> = ({
  navigation,
  route,
  account: {iccid, token, mobile, fortune},
  action,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<Fortune>({text: '', num: 0, count: 0});
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState('');

  const [coupon, setCoupon] = useState<LotteryCouponType>({
    cnt: 0,
    title: '',
    desc: '',
    charm: '',
  });

  BackbuttonHandler({
    navigation,
    route,
    onBack: () => {
      if (isLoading) return true;
      setShowShareModal(false);
      navigation.goBack();
      return true;
    },
  });

  const ref = useRef<ViewShot>();
  // 다시보기 구분하는 코드
  const isHistory = useMemo(() => {
    return fortune?.count === 0 && fortune?.text && phase?.text === '';
  }, [fortune?.count, fortune?.text, phase?.text]);

  const screenNum = useMemo(() => {
    return phase?.num || fortune?.num || 0;
  }, [fortune, phase?.num]);

  useEffect(() => {
    if (isHistory) {
      // 2초 동안 Loading 표시해주기 코드
      setIsLoading(true);

      // 뽑기 , 임시로 2초 타임아웃
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [isHistory]);

  const lotteryCoupon = useCallback(async () => {
    API.Account.lotteryCoupon({
      iccid,
      token,
      prompt: 'lottery',
    }).then((resp) => {
      const couponObj = resp.objects[0]?.coupon;

      if (resp.result === 0) {
        setCoupon({
          cnt: couponObj?.cnt || 0,
          title: couponObj?.display_name,
          desc: couponObj?.description,
          charm: resp.objects[0]?.charm,
        });

        setPhase({
          text: resp.objects[0]?.phrase,
          num: resp.objects[0]?.num,
          count: couponObj?.cnt || 0,
        });

        setIsLoading(false);

        // 뽑기 , 임시로 3초 타임아웃
        setTimeout(() => {
          action.account.checkLottery({iccid, token, prompt: 'check'});

          setShowCouponModal(true);
        }, 3000);
      } else {
        // 실패했을 땐 어떻게 해야할 지??
      }
    });
  }, [action.account, iccid, token]);

  const onShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const renderTitleAndPhase = useCallback(() => {
    return (
      <View style={{alignItems: 'center', width: IMAGE_WIDTH}}>
        <View style={styles.lotteryResultTitleBox}>
          <AppText
            style={[appStyles.medium14, {color: colors.white, lineHeight: 20}]}>
            {i18n.t('esim:lottery:title:history')}
          </AppText>
        </View>
        <View>
          <AppText style={styles.fortuneText}>
            {`${phase?.text || fortune?.text}`}
          </AppText>
        </View>
      </View>
    );
  }, [fortune?.text, phase?.text]);

  // 이미지 공유용 뷰샷 따로 넣어놓기
  const shareView = useCallback(() => {
    return (
      <ViewShot
        ref={ref}
        style={{
          position: 'absolute',
          left: -1700,
        }}
        options={{
          fileName: 'test',
          format: 'png',
          quality: 0.9,
        }}>
        <LinearGradient
          style={styles.gradientContainer}
          // Background Linear Gradient
          colors={GRADIENT_COLOR_LIST[screenNum]}
        />
        <View style={{paddingVertical: 120, paddingHorizontal: 40}}>
          {renderTitleAndPhase()}
          <View style={[styles.imageContainer, {marginTop: 20}]}>
            <Image
              style={{
                width: 200,
                height: 200,
              }}
              source={{
                uri: API.default.httpImageUrl(
                  `sites/default/files/img/fortune_card${screenNum}.png`,
                ),
              }}
            />
          </View>
        </View>
      </ViewShot>
    );
  }, [renderTitleAndPhase, screenNum]);

  const shareInstaStory = useCallback(async () => {
    try {
      const uri = await ref.current?.capture?.();

      if (uri) {
        const shareOptions = {
          stickerImage: uri,
          // ImageBackground: image,
          backgroundBottomColor: colors.black,
          backgroundTopColor: colors.black,
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
      <View style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                width: IMAGE_WIDTH,
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
            () =>
              captureScreen(ref).then((r) => {
                if (r) setShowSnackbar(r);
              }),
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

        <View style={{paddingHorizontal: 20, marginBottom: 16}}>
          {fortune?.text && phase?.count > 0 && (
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
      </View>
    );
  }, [
    fortune?.text,
    navigation,
    onShare,
    phase?.count,
    renderShareButton,
    renderTitleAndPhase,
    screenNum,
    shareInstaStory,
  ]);

  const renderBody = useCallback(() => {
    if (isLoading) {
      return <RenderLoadingLottery />;
    }

    if (phase?.text || isHistory) {
      return (
        <>
          <LinearGradient
            // Background Linear Gradient
            colors={GRADIENT_COLOR_LIST[screenNum]}
            style={styles.gradientContainer}
          />
          {renderAfterLottery()}
        </>
      );
    }

    return <RenderBeforeLottery count={fortune?.count} onClick={onClick} />;
  }, [
    fortune,
    isHistory,
    isLoading,
    onClick,
    phase?.text,
    renderAfterLottery,
    screenNum,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      {shareView()}
      {!isLoading && (
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
      )}
      {/* // 메인화면 */}
      {renderBody()}

      <LotteryModal
        visible={showCouponModal}
        coupon={coupon}
        onClose={() => setShowCouponModal(false)}
      />

      {/* 공유 어떻게 할지 정해지면 props 수정 필요 */}
      <LotteryShareModal
        captureRef={ref}
        account={{iccid, token, mobile}}
        params={{
          img: API.default.httpImageUrl(
            `sites/default/files/img/fortune_card${screenNum}.png`,
          ),
        }}
        onShareInsta={shareInstaStory}
        visible={showShareModal}
        onClose={() => {
          setShowShareModal(false);
        }}
      />

      <AppSnackBar
        visible={showSnackbar !== ''}
        onClose={() => setShowSnackbar('')}
        textMessage={i18n.t(showSnackbar)}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({account, order}: RootState) => ({
    account,
    order,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(LotteryScreen);
