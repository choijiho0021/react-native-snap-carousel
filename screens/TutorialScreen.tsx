/* eslint-disable global-require */
import {RootState} from '@/redux';
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppEventsLogger} from 'react-native-fbsdk';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {getTrackingStatus} from 'react-native-tracking-transparency';
import {connect} from 'react-redux';
import _ from 'underscore';
import {colors} from '../constants/Colors';
import {sliderWidth} from '../constants/SliderEntry.style';
import {appStyles} from '../constants/Styles';
import Env from '../environment';
import * as accountActions from '../redux/modules/account';
import * as orderActions from '../redux/modules/order';
import i18n from '../utils/i18n';

const {esimApp} = Env.get();

const {width} = Dimensions.get('window');
const tutorialImages = esimApp
  ? {
      step1: require('../assets/images/esim/tutorial/step1/esimTutorial1.png'),
      step2: require('../assets/images/esim/tutorial/step2/esimTutorial2.png'),
      step3: require('../assets/images/esim/tutorial/step3/esimTutorial3.png'),
      step4: require('../assets/images/esim/tutorial/step4/esimTutorial4.png'),
    }
  : {
      step1: require('../assets/images/tutorial/step1/mT1.png'),
      step2: require('../assets/images/tutorial/step2/mT2.png'),
      step3: require('../assets/images/tutorial/step3/mT3.png'),
      step4: require('../assets/images/tutorial/step4/mT4.png'),
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

type TutorialScreenProps = {
  visible: boolean;
  onOkClose: () => void;
};

type TutorialScreenState = {
  activeSlide: number;
  images: {key: string}[];
};

class TutorialScreen extends Component<
  TutorialScreenProps,
  TutorialScreenState
> {
  carousel: React.RefObject<unknown>;

  constructor(props) {
    super(props);

    this.carousel = React.createRef();
    this.state = {
      activeSlide: 0,
      images: [{key: 'step1'}, {key: 'step2'}, {key: 'step3'}, {key: 'step4'}],
    };

    this.renderTutorial = this.renderTutorial.bind(this);
    this.skip = this.skip.bind(this);
    this.completed = this.completed.bind(this);
  }

  componentDidMount() {}

  renderTutorial = ({item}) => {
    return (
      <Image
        style={styles.image}
        source={tutorialImages[item.key]}
        resizeMode="cover"
      />
    );
  };

  skip = async () => {
    this.props.onOkClose();
    const status = await getTrackingStatus();
    if (status === 'authorized') AppEventsLogger.logEvent('튜토리얼 SKIP');
  };

  completed = async () => {
    this.props.onOkClose();
    const status = await getTrackingStatus();
    if (status === 'authorized')
      AppEventsLogger.logEvent('fb_mobile_tutorial_completion');
  };

  render() {
    const {images, activeSlide} = this.state;

    return (
      <Modal
        style={styles.container}
        animationType="slide"
        transparent={false}
        visible={this.props.visible}>
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
            carouselRef={this.carousel.current}
            tappableDots={!_.isEmpty(this.carousel.current)}
            containerStyle={styles.pagination}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 52,
          }}>
          {this.state.activeSlide === this.state.images.length - 1 ? (
            <View style={styles.bottom}>
              <TouchableOpacity
                style={[
                  styles.touchableOpacity,
                  {flex: 1, alignItems: 'center'},
                ]}
                onPress={() => this.completed()}>
                <Text style={styles.bottomText}>
                  {i18n.t('tutorial:close')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.bottom, {justifyContent: 'space-between'}]}>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => this.skip()}>
                <Text style={styles.bottomText}>{i18n.t('tutorial:skip')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => this.carousel.current?.snapToNext()}>
                <Text style={[styles.bottomText, {color: colors.clearBlue}]}>
                  {i18n.t('tutorial:next')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    );
  }
}

export default connect(({account, pender}: RootState) => ({
  account,
  auth: accountActions.auth(account),
  pending:
    pender.pending[orderActions.GET_ORDERS] ||
    pender.pending[accountActions.UPLOAD_PICTURE] ||
    false,
}))(TutorialScreen);
