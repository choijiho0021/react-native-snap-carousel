import analytics, {firebase} from '@react-native-firebase/analytics';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useState, useEffect, useRef, useMemo} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {AppEventsLogger, Settings} from 'react-native-fbsdk-next';
import {Pagination} from 'react-native-snap-carousel';

import LinearGradient from 'react-native-linear-gradient';
import {
  getTrackingStatus,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import {RouteProp} from '@react-navigation/native';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {
  actions as promotionActions,
  PromotionAction,
} from '@/redux/modules/promotion';
import {AccountModelState} from '@/redux/modules/account';
import {LinkModelState} from '../redux/modules/link';
import AppCarousel, {AppCarouselRef} from '@/components/AppCarousel';
import {MAX_WIDTH, sliderWidth} from '@/constants/SliderEntry.style';
import {ModalAction} from '@/redux/modules/modal';
import AppButton from '@/components/AppButton';

const {esimGlobal} = Env.get();

const tutorialImages = esimGlobal
  ? {
      step1: require(`../assets/images/en/esim/t1.png`),
      step2: require(`../assets/images/en/esim/t2.png`),
      step3: require(`../assets/images/en/esim/t3.png`),
    }
  : Platform.OS === 'ios'
  ? {
      step1: require(`../assets/images/esim/tutorial/esimTutorial_1.png`),
      step2: require(`../assets/images/esim/tutorial/esimTutorial_2.png`),
      step3: require(`../assets/images/esim/tutorial/esimTutorial_3.png`),
      step4: require(`../assets/images/esim/tutorial/esimTutorial_4.png`),
      step5: require(`../assets/images/esim/tutorial/esimTutorial_5.png`),
    }
  : {
      step1: require(`../assets/images/esim/tutorial/esimTutorial_1_AOS.png`),
      step2: require(`../assets/images/esim/tutorial/esimTutorial_2_AOS.png`),
      step3: require(`../assets/images/esim/tutorial/esimTutorial_3.png`),
      step4: require(`../assets/images/esim/tutorial/esimTutorial_4.png`),
      step5: require(`../assets/images/esim/tutorial/esimTutorial_5.png`),
    };

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  dotStyle: {
    width: 20,
    height: 6,
    borderRadius: 3.5,
    backgroundColor: colors.clearBlue,
  },
  inactiveDotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lightGrey,
  },
  image: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    height: '100%',
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  reasonButtonText: {
    ...appStyles.medium18,
    color: colors.black,
    lineHeight: 26,
    letterSpacing: 0,
  },
  reasonButton: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: colors.lightGrey,
  },

  boldText: {
    ...appStyles.bold18Text,
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0,
  },
  gradientStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -52,
  },
});

type TutorialScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Tutorial'
>;

type EsimScreenRouteProp = RouteProp<HomeStackParamList, 'Tutorial'>;

type TutorialScreenProps = {
  route: EsimScreenRouteProp;
  navigation: TutorialScreenNavigationProp;
  account: AccountModelState;
  link: LinkModelState;
  action: {
    promotion: PromotionAction;
    modal: ModalAction;
  };
};

type CarouselIndex = 'step1' | 'step2' | 'step3' | 'step4' | 'step5';

const TutorialScreen: React.FC<TutorialScreenProps> = (props) => {
  const {navigation} = props;
  const [activeSlide, setActiveSlide] = useState(0);
  const [status, setStatus] = useState<TrackingStatus>();
  const images = useMemo(() => Object.keys(tutorialImages), []);
  const carouselRef = useRef<AppCarouselRef>(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    getTrackingStatus().then(setStatus);
  }, [navigation]);

  useEffect(() => {
    const trackingFc = async () => {
      if (status === 'authorized') {
        await firebase.analytics().setAnalyticsCollectionEnabled(true);
        await Settings.setAdvertiserTrackingEnabled(true);

        analytics().logEvent(
          `${esimGlobal ? 'global' : 'esim'}_tutorial_begin`,
        );
      }
    };
    trackingFc();
  }, [status]);

  const renderTutorial = useCallback(
    ({item}: {item: CarouselIndex}) => (
      <View style={{flex: 1, alignItems: 'center', width: sliderWidth}}>
        <Image
          style={styles.image}
          source={tutorialImages[item]}
          resizeMode="contain"
        />
      </View>
    ),
    [],
  );

  const move = useCallback(() => {
    const {params} = props?.route;
    const {stack, screen, naviParams} = params || {};
    if (stack && screen) {
      navigation.popToTop();
      navigation.navigate(stack, {screen, params: naviParams});
    } else {
      navigation.navigate('Home');
    }
  }, [navigation, props]);

  const skip = useCallback(() => {
    if (status === 'authorized') AppEventsLogger.logEvent('튜토리얼 SKIP');
    move();
  }, [move, status]);

  const completed = useCallback(() => {
    if (status === 'authorized') {
      AppEventsLogger.logEvent('fb_mobile_tutorial_completion');
      analytics().logEvent(
        `${esimGlobal ? 'global' : 'esim'}_tutorial_complete`,
      );
    }
    move();
  }, [move, status]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <AppCarousel
          carouselRef={carouselRef}
          data={images}
          renderItem={renderTutorial}
          onSnapToItem={setActiveSlide}
          sliderWidth={dimensions.width}
        />
        <Pagination
          dotsLength={images.length}
          activeDotIndex={activeSlide}
          dotContainerStyle={{width: 5, height: 15}}
          dotStyle={styles.dotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1.0}
          // carouselRef={carouselRef}
          // tappableDots={!_.isEmpty(carouselRef?.current)}
          containerStyle={styles.pagination}
        />
      </View>
      {/* <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'red']} // 투명에서 흰색으로 그라디언트 색상 설정
        style={styles.gradientStyle}>
        <View
          style={{
            height: 30,

            // overflow: 'hidden',
            // backgroundColor: 'linear-gradient(to bottom, transparent, white)',
            backgroundColor: 'red',
          }}
        />
      </LinearGradient> */}

      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 52,
          marginBottom: 20,
        }}>
        {activeSlide === images.length - 1 ? (
          <>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'white']} // 투명에서 흰색으로 그라디언트 색상 설정
              style={styles.gradientStyle}
            />
            <View style={styles.bottom}>
              <AppButton
                style={[
                  styles.reasonButton,
                  {
                    backgroundColor: colors.clearBlue,
                    borderWidth: 0,
                  },
                ]}
                title={i18n.t('tutorial:close')}
                titleStyle={[styles.boldText, {color: 'white'}]}
                disableStyle={{borderWidth: 0}}
                onPress={() => completed()}
              />
              {/* <Pressable
              style={[styles.touchableOpacity, {flex: 1, alignItems: 'center'}]}
              onPress={() => completed()}>
              
              <AppText style={styles.bottomText}>
                {i18n.t('tutorial:close')}
              </AppText>
            </Pressable> */}
            </View>
          </>
        ) : (
          <>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'white']} // 투명에서 흰색으로 그라디언트 색상 설정
              style={styles.gradientStyle}
            />
            <View style={[styles.bottom, {justifyContent: 'space-between'}]}>
              {/* <Pressable style={styles.touchableOpacity} onPress={() => skip()}>
              <AppText style={styles.bottomText}>
                {i18n.t('tutorial:skip')}
              </AppText>
            </Pressable> */}
              <AppButton
                key="buttonSkip"
                style={[styles.reasonButton, {marginRight: 12}]}
                titleStyle={[styles.reasonButtonText]}
                onPress={() => skip()}
                title={i18n.t('tutorial:skip')}
              />

              <AppButton
                key="buttonNext"
                style={[
                  styles.reasonButton,
                  {
                    backgroundColor: colors.clearBlue,
                    borderColor: colors.clearBlue,
                  },
                ]}
                titleStyle={[styles.boldText, {color: 'white'}]}
                onPress={() => carouselRef.current?.snapToNext()}
                title={i18n.t('tutorial:next')}
              />
              {/* <Pressable
              style={styles.touchableOpacity}
              onPress={() => carouselRef.current?.snapToNext()}>
              <AppText style={[styles.bottomText, {color: colors.clearBlue}]}>
                {i18n.t('tutorial:next')}
              </AppText>
            </Pressable> */}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default connect(
  ({account, link, promotion}: RootState) => ({
    account,
    link,
    promotion,
  }),
  (dispatch) => ({
    action: {
      promotion: bindActionCreators(promotionActions, dispatch),
    },
  }),
)(TutorialScreen);
