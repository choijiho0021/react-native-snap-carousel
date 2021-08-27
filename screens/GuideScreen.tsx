/* eslint-disable global-require */
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppFlatListItem from '@/components/AppFlatListItem';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {sliderWidth} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {actions as accountActions} from '@/redux/modules/account';
import {
  actions as infoActions,
  InfoAction,
  InfoModelState,
} from '@/redux/modules/info';
import {actions as orderActions} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingVertical: 20,
    paddingRight: 20,
    marginLeft: 7,
  },
  dotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  tipBox: {
    flex: 1,
    height: 71,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    borderBottomColor: colors.whiteTwo,
    borderBottomWidth: 1,
    marginLeft: 20,
    marginTop: 30,
  },
  tip: {
    ...appStyles.bold18Text,
    alignSelf: 'center',
    marginLeft: 10,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  image: {
    width: sliderWidth,
    height: 390,
    alignSelf: 'center',
  },
  text: {
    ...appStyles.bold18Text,
    color: colors.white,
    marginTop: 40,
  },
  faq: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
    textAlign: 'center',
  },
  faqBox: {
    height: 48,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,
    marginVertical: 30,
    marginHorizontal: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  footer: {
    marginBottom: 30,
  },
});

const guideImages = {
  step1: require('../assets/images/guide/step1/img.png'),
  step2: require('../assets/images/guide/step2/img.png'),
  step3: require('../assets/images/guide/step3/img.png'),
  step4: require('../assets/images/guide/step4/img.png'),
};

type GuideScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Guide'
>;

type GuideScreenProps = {
  navigation: GuideScreenNavigationProp;

  pending: boolean;
  info: InfoModelState;

  action: {
    info: InfoAction;
  };
};

type GuideScreenState = {
  activeSlide: number;
  images: string[];
};

class GuideScreen extends Component<GuideScreenProps, GuideScreenState> {
  constructor(props: GuideScreenProps) {
    super(props);

    this.state = {
      activeSlide: 0,
      images: ['step1', 'step2', 'step3', 'step4'],
    };

    this.header = this.header.bind(this);
    this.footer = this.footer.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('guide:title')} />,
    });

    Analytics.trackEvent('Page_View_Count', {page: 'Guide'});
    this.refreshData();
  }

  refreshData() {
    const {infoMap} = this.props.info;
    if (!infoMap.has('faq:tip')) {
      this.props.action.info.getInfoList('faq:tip');
    }
  }

  header() {
    const {images, activeSlide} = this.state;

    return (
      <View>
        <Carousel
          data={images}
          renderItem={({item}) => (
            <Image
              style={styles.image}
              source={guideImages[item]}
              resizeMode="cover"
            />
          )}
          onSnapToItem={(index) => this.setState({activeSlide: index})}
          autoplay={false}
          loop
          useScrollView
          lockScrollWhileSnapping
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
        />

        <Pagination
          dotsLength={images.length}
          activeDotIndex={activeSlide}
          dotStyle={styles.dotStyle}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1.0}
          containerStyle={styles.pagination}
        />

        <View style={styles.tipBox}>
          <AppIcon name="specialTip" />
          <AppText style={styles.tip}>{i18n.t('guide:tip')}</AppText>
        </View>
      </View>
    );
  }

  footer() {
    return (
      <View style={styles.footer}>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.faqBox}
          onPress={() => this.props.navigation.navigate('Faq')}>
          <AppText style={styles.faq}>{i18n.t('guide:detail')}</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {activeSlide} = this.state;
    const {infoMap} = this.props.info;

    return (
      <View style={styles.container}>
        <FlatList
          data={infoMap.get('faq:tip', [])}
          renderItem={({item}) => (
            <AppFlatListItem key={item.key} item={item} />
          )}
          extraData={activeSlide}
          ListHeaderComponent={this.header}
          ListFooterComponent={this.footer}
        />
        <AppActivityIndicator visible={this.props.pending} />
      </View>
    );
  }
}

export default connect(
  ({account, status}: RootState) => ({
    account,
    pending:
      status.pending[orderActions.getOrders.typePrefix] ||
      status.pending[accountActions.uploadPicture.typePrefix] ||
      status.pending[infoActions.getInfoList.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(GuideScreen);
