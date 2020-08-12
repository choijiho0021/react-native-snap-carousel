import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import {colors} from '../constants/Colors';
import * as orderActions from '../redux/modules/order';
import * as accountActions from '../redux/modules/account';
import _ from 'underscore';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {sliderWidth} from '../constants/SliderEntry.style';
import getEnvVars from '../environment';
const {esimApp} = getEnvVars();

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

class TutorialScreen extends Component {
  constructor(props) {
    super(props);
    this.carousel = React.createRef();
    this.state = {
      data: [],
      activeSlide: 0,
      modalVisible: true,
      images: [{key: 'step1'}, {key: 'step2'}, {key: 'step3'}, {key: 'step4'}],
    };

    this._renderTutorial = this._renderTutorial.bind(this);
  }

  componentDidMount() {}

  _renderTutorial({item}) {
    return (
      <Image
        style={styles.image}
        source={tutorialImages[item.key]}
        resizeMode="cover"
      />
    );
  }

  render() {
    const {images, activeSlide} = this.state;

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          // onRequestClose={() => {
          //   Alert.alert('Modal has been closed.');
          // }}
        >
          <View style={{flex: 1}}>
            <Carousel
              ref={this.carousel}
              data={images}
              renderItem={this._renderTutorial}
              onSnapToItem={index => this.setState({activeSlide: index})}
              autoplay={false}
              loop={true}
              useScrollView={true}
              lockScrollWhileSnapping={true}
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
            {this.state.activeSlide == this.state.images.length - 1 ? (
              <View style={styles.bottom}>
                <TouchableOpacity
                  style={[
                    styles.touchableOpacity,
                    {flex: 1, alignItems: 'center'},
                  ]}
                  onPress={() => this.setState({modalVisible: false})}>
                  <Text style={styles.bottomText}>
                    {i18n.t('tutorial:close')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.bottom, {justifyContent: 'space-between'}]}>
                <TouchableOpacity
                  style={styles.touchableOpacity}
                  onPress={() => this.setState({modalVisible: false})}>
                  <Text style={styles.bottomText}>
                    {i18n.t('tutorial:skip')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.touchableOpacity}
                  onPress={() => this.carousel.current.snapToNext()}>
                  <Text style={[styles.bottomText, {color: colors.clearBlue}]}>
                    {i18n.t('tutorial:next')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Modal>
      </View>
    );
  }
}

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

const mapStateToProps = state => ({
  account: state.account.toJS(),
  auth: accountActions.auth(state.account),
  pending:
    state.pender.pending[orderActions.GET_ORDERS] ||
    state.pender.pending[accountActions.UPLOAD_PICTURE] ||
    false,
});

export default connect(mapStateToProps)(TutorialScreen);
