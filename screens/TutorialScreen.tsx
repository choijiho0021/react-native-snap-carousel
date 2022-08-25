/* eslint-disable global-require */
import analytics, {firebase} from '@react-native-firebase/analytics';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useState, useEffect, useRef, useMemo} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {AppEventsLogger, Settings} from 'react-native-fbsdk';
import {Pagination} from 'react-native-snap-carousel';
import {
  getTrackingStatus,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import {RouteProp} from '@react-navigation/native';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
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

const {esimGlobal} = Env.get();

const tutorialImages = esimGlobal
  ? {
      step1: require(`../assets/images/esim/tutorial/step1/t1.png`),
      step2: require(`../assets/images/esim/tutorial/step2/t2.png`),
      step3: require(`../assets/images/esim/tutorial/step3/t3.png`),
    }
  : {
      step1: require(`../assets/images/esim/tutorial/step1/esimTutorial1.png`),
      step2: require(`../assets/images/esim/tutorial/step2/esimTutorial2.png`),
      step3: require(`../assets/images/esim/tutorial/step3/esimTutorial3.png`),
      step4: require(`../assets/images/esim/tutorial/step4/esimTutorial4.png`),
    };

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  dotStyle: {
    width: 20,
    height: 6,
    borderRadius: 3.5,
    backgroundColor: colors.goldenYellow,
  },
  inactiveDotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    // alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    height: 'auto',
    // height: '100%'
  },
  image: {
    width: '100%',
    maxWidth: 375,
    // maxHeight: height,
    height: '100%',
  },
  text: {
    ...appStyles.bold18Text,
    color: colors.white,
    marginTop: 40,
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  bottomText: {
    ...appStyles.normal16Text,
    letterSpacing: 0.22,
    // lineHeight: 15,
    marginHorizontal: 30,
    textAlignVertical: 'center',
  },
  bottom: {
    // backgroundColor:colors.black,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  touchableOpacity: {
    height: '100%',
    justifyContent: 'center',
  },
});

type TutorialScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Tutorial'
>;

type TutorialScreenRouteProp = RouteProp<HomeStackParamList, 'Tutorial'>;

type TutorialScreenProps = {
  navigation: TutorialScreenNavigationProp;
  route: TutorialScreenRouteProp;

  account: AccountModelState;
  link: LinkModelState;
  action: {
    promotion: PromotionAction;
  };
};

type CarouselIndex = 'step1' | 'step2' | 'step3' | 'step4';

const TutorialScreen: React.FC<TutorialScreenProps> = (props) => {
  const {navigation, route, account, link, action} = props;
  const {recommender, gift} = link;
  const [activeSlide, setActiveSlide] = useState(0);
  const [status, setStatus] = useState<TrackingStatus>();
  const images = useMemo(() => Object.keys(tutorialImages), []);
  const carouselRef = useRef<AppCarouselRef>(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

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

  useEffect(() => {
    return () => {
      if (recommender && gift) {
        if (!account.loggedIn) {
          action.promotion.saveGiftAndRecommender({
            recommender,
            gift,
          });

          navigation.navigate('EsimStack', {
            screen: 'RegisterMobile',
          });
        }
      }
    };
  }, [account.loggedIn, action.promotion, gift, navigation, recommender]);

  const renderTutorial = useCallback(
    ({item}: {item: CarouselIndex}) => (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image
          style={styles.image}
          source={tutorialImages[item]}
          resizeMode="cover"
        />
      </View>
    ),
    [],
  );

  const skip = useCallback(() => {
    if (status === 'authorized') AppEventsLogger.logEvent('튜토리얼 SKIP');
    route.params.popUp();
    navigation.goBack();
  }, [navigation, route.params, status]);

  const completed = useCallback(() => {
    if (status === 'authorized') {
      AppEventsLogger.logEvent('fb_mobile_tutorial_completion');
      analytics().logEvent(
        `${esimGlobal ? 'global' : 'esim'}_tutorial_complete`,
      );
    }
    route.params.popUp();
    navigation.goBack();
  }, [navigation, route.params, status]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <AppCarousel
          carouselRef={carouselRef}
          data={images}
          renderItem={renderTutorial}
          onSnapToItem={setActiveSlide}
          sliderWidth={dimensions.width}
          optimize={false}
        />

        <Pagination
          dotsLength={images.length}
          activeDotIndex={activeSlide}
          dotContainerStyle={{width: 10, height: 15}}
          dotStyle={styles.dotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1.0}
          // carouselRef={carouselRef}
          // tappableDots={!_.isEmpty(carouselRef?.current)}
          containerStyle={styles.pagination}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 52,
        }}>
        {activeSlide === images.length - 1 ? (
          <View style={styles.bottom}>
            <Pressable
              style={[styles.touchableOpacity, {flex: 1, alignItems: 'center'}]}
              onPress={() => completed()}>
              <AppText style={styles.bottomText}>
                {i18n.t('tutorial:close')}
              </AppText>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.bottom, {justifyContent: 'space-between'}]}>
            <Pressable style={styles.touchableOpacity} onPress={() => skip()}>
              <AppText style={styles.bottomText}>
                {i18n.t('tutorial:skip')}
              </AppText>
            </Pressable>
            <Pressable
              style={styles.touchableOpacity}
              onPress={() => carouselRef.current?.snapToNext()}>
              <AppText style={[styles.bottomText, {color: colors.clearBlue}]}>
                {i18n.t('tutorial:next')}
              </AppText>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default connect(
  ({account, link, promotion}: RootState) => ({account, link, promotion}),
  (dispatch) => ({
    action: {
      promotion: bindActionCreators(promotionActions, dispatch),
    },
  }),
)(TutorialScreen);
