/* eslint-disable global-require */
import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Analytics from 'appcenter-analytics';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import AppIcon from '@/components/AppIcon';
import {actions as accountActions} from '@/redux/modules/account';
import {actions as orderActions} from '@/redux/modules/order';
import {actions as infoActions, InfoAction} from '@/redux/modules/info';
import AppBackButton from '@/components/AppBackButton';
import AppFlatListItem from '@/components/AppFlatListItem';
import {sliderWidth} from '@/constants/SliderEntry.style';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {RootState} from '@/redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigation/navigation';
import {RkbInfo} from '@/redux/api/pageApi';

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

  action: {
    info: InfoAction;
  };
};

type GuideScreenState = {
  data: RkbInfo[];
  activeSlide: number;
  images: string[];
};

class GuideScreen extends Component<GuideScreenProps, GuideScreenState> {
  constructor(props: GuideScreenProps) {
    super(props);

    this.state = {
      data: [],
      activeSlide: 0,
      images: ['step1', 'step2', 'step3', 'step4'],
    };

    this.header = this.header.bind(this);
    this.footer = this.footer.bind(this);
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
    this.props.action.info
      .getInfoList('faq:tip')
      .then(({payload: resp}) => {
        if (resp.result === 0 && resp.objects.length > 0) {
          this.setState({
            data: resp.objects,
          });
        }
      })
      .catch((err) => {
        console.log('failed to get page', err);
      });
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
          <Text style={styles.tip}>{i18n.t('guide:tip')}</Text>
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
          <Text style={styles.faq}>{i18n.t('guide:detail')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {data, activeSlide} = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          data={data}
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
    auth: accountActions.auth(account),
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
