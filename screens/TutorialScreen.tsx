/* eslint-disable global-require */
import analytics, {firebase} from '@react-native-firebase/analytics';
import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {AppEventsLogger, Settings} from 'react-native-fbsdk';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  getTrackingStatus,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import _ from 'underscore';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import i18n from '@/utils/i18n';
import {sliderWidth} from '@/constants/SliderEntry.style';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {
  PromotionModelState,
  actions as promotionActions,
  PromotionAction,
} from '@/redux/modules/promotion';
import {AccountModelState} from '@/redux/modules/account';

const {esimApp, esimGlobal} = Env.get();

const {width} = Dimensions.get('window');
const esimImages = esimGlobal
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
const tutorialImages = esimApp
  ? esimImages
  : {
      step1: require('../assets/images/usim/tutorial/step1/mT1.png'),
      step2: require('../assets/images/usim/tutorial/step2/mT2.png'),
      step3: require('../assets/images/usim/tutorial/step3/mT3.png'),
      step4: require('../assets/images/usim/tutorial/step4/mT4.png'),
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
    maxWidth: width,
    // maxHeight: height,
    height: '100%',
    alignSelf: 'stretch',
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
  promotion: PromotionModelState;
  action: {
    promotion: PromotionAction;
  };
};

type CarouselIndex = 'step1' | 'step2' | 'step3' | 'step4';
type TutorialScreenState = {
  activeSlide: number;
  status?: TrackingStatus;
};

class TutorialScreen extends Component<
  TutorialScreenProps,
  TutorialScreenState
> {
  carousel: React.LegacyRef<Carousel<CarouselIndex>>;

  constructor(props: TutorialScreenProps) {
    super(props);

    this.carousel = React.createRef();
    this.state = {
      activeSlide: 0,
    };

    this.renderTutorial = this.renderTutorial.bind(this);
    this.skip = this.skip.bind(this);
    this.completed = this.completed.bind(this);
  }

  async componentDidMount() {
    this.props.navigation.setOptions({
      headerShown: false,
    });

    this.setState({
      status: await getTrackingStatus(),
    });

    if (this.state.status === 'authorized') {
      await firebase.analytics().setAnalyticsCollectionEnabled(true);
      await Settings.setAdvertiserTrackingEnabled(true);

      analytics().logEvent(`${esimGlobal ? 'global' : 'esim'}_tutorial_begin`);
    }
  }

  componentWillUnmount() {
    dynamicLinks()
      .getInitialLink()
      .then(async (l) => {
        if (l?.url) {
          const url = l?.url.split(/[;?&]/);
          url.shift();
          const param = url.map((elm) => `"${elm.replace('=', '":"')}"`);
          const json = JSON.parse(`{${param.join(',')}}`);

          if (l?.url.includes('recommender')) {
            if (!this.props.account.loggedIn) {
              this.props.action.promotion.saveGiftAndRecommender({
                recommender: json?.recommender,
                gift: json?.gift,
              });

              this.props.navigation.navigate('EsimStack', {
                screen: 'RegisterMobile',
              });
            }
          }
        }
      });
  }

  renderTutorial = ({item}: {item: CarouselIndex}) => {
    return (
      <Image
        style={styles.image}
        source={tutorialImages[item]}
        resizeMode="cover"
      />
    );
  };

  skip = () => {
    if (this.state.status === 'authorized')
      AppEventsLogger.logEvent('튜토리얼 SKIP');
    this.props.route.params.popUp();
    this.props.navigation.goBack();
  };

  completed = async () => {
    if (this.state.status === 'authorized') {
      AppEventsLogger.logEvent('fb_mobile_tutorial_completion');
      analytics().logEvent(
        `${esimGlobal ? 'global' : 'esim'}_tutorial_complete`,
      );
    }
    this.props.route.params.popUp();
    this.props.navigation.goBack();
  };

  render() {
    const {activeSlide} = this.state;
    const images = Object.keys(tutorialImages);

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Carousel
            ref={this.carousel}
            data={images}
            renderItem={this.renderTutorial}
            onSnapToItem={(index) => this.setState({activeSlide: index})}
            autoplay={false}
            // loop
            useScrollView
            lockScrollWhileSnapping
            // resizeMode='stretch'
            // overflow='hidden'
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
            // itemHeight={sliderHeight*0.5}
          />

          <Pagination
            dotsLength={images.length}
            activeDotIndex={activeSlide}
            dotContainerStyle={{width: 10, height: 15}}
            dotStyle={styles.dotStyle}
            inactiveDotStyle={styles.inactiveDotStyle}
            inactiveDotOpacity={0.4}
            inactiveDotScale={1.0}
            carouselRef={this.carousel}
            tappableDots={!_.isEmpty(this.carousel?.current)}
            containerStyle={styles.pagination}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 52,
          }}>
          {this.state.activeSlide === images.length - 1 ? (
            <View style={styles.bottom}>
              <Pressable
                style={[
                  styles.touchableOpacity,
                  {flex: 1, alignItems: 'center'},
                ]}
                onPress={() => this.completed()}>
                <AppText style={styles.bottomText}>
                  {i18n.t('tutorial:close')}
                </AppText>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.bottom, {justifyContent: 'space-between'}]}>
              <Pressable
                style={styles.touchableOpacity}
                onPress={() => this.skip()}>
                <AppText style={styles.bottomText}>
                  {i18n.t('tutorial:skip')}
                </AppText>
              </Pressable>
              <Pressable
                style={styles.touchableOpacity}
                onPress={() => this.carousel?.current?.snapToNext()}>
                <AppText style={[styles.bottomText, {color: colors.clearBlue}]}>
                  {i18n.t('tutorial:next')}
                </AppText>
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, promotion}: RootState) => ({account, promotion}),
  (dispatch) => ({
    action: {
      promotion: bindActionCreators(promotionActions, dispatch),
    },
  }),
)(TutorialScreen);
