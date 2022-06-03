import Clipboard from '@react-native-community/clipboard';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  Linking,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import _ from 'underscore';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {actions as notiActions, NotiAction} from '@/redux/modules/noti';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import {
  actions as toastActions,
  Toast,
  ToastAction,
} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import {sliderWidth} from '@/constants/SliderEntry.style';

const {width} = Dimensions.get('window');

const guideImage = {
  step1: require('../assets/images/guide_HK/guideHK1.png'),
  step2: require('../assets/images/guide_HK/guideHK2.png'),
  step3: require('../assets/images/guide_HK/guideHK3.png'),
  step4: require('../assets/images/guide_HK/guideHK4.png'),
  step5: require('../assets/images/guide_HK/guideHK5.png'),
};

const styles = StyleSheet.create({
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  btnCopy: {
    backgroundColor: colors.white,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    marginLeft: 20,
    borderColor: colors.lightGrey,
  },
  keyTitle: {
    ...appStyles.normal18Text,
    marginBottom: 10,
    color: colors.warmGrey,
  },
  guide: {
    ...appStyles.bold18Text,
    marginVertical: 16,
  },
  copyBox: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  textUnderLine: {
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
  },
  guideContainer: {
    backgroundColor: colors.whiteSix,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.black,
  },
  inactiveDotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cccccc',
  },
  confirm: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    color: colors.white,
    textAlign: 'center',
  },
  confirmTitle: {
    ...appStyles.normal18Text,
    color: colors.white,
    textAlign: 'center',
    margin: 5,
  },
  image: {
    width: '100%',
    maxWidth: width - 40,
    // maxHeight: height,
    height: '100%',
    alignSelf: 'stretch',
  },
});

type RedirectHKScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Settings'
>;

type RedirectHKScreenRouteProp = RouteProp<HomeStackParamList, 'SimpleText'>;

type RedirectHKScreenProps = {
  navigation: RedirectHKScreenNavigationProp;
  route: RedirectHKScreenRouteProp;
  account: AccountModelState;
  action: {
    account: AccountAction;
    cart: CartAction;
    order: OrderAction;
    noti: NotiAction;
    toast: ToastAction;
  };
};
type CarouselIndex = 'step1' | 'step2' | 'step3' | 'step4';
type RedirectHKScreenState = {
  activeSlide: number;
};

class RedirectHKScreen extends Component<
  RedirectHKScreenProps,
  RedirectHKScreenState
> {
  carousel: React.LegacyRef<Carousel<CarouselIndex>>;

  constructor(props: RedirectHKScreenProps) {
    super(props);
    this.carousel = React.createRef();
    this.state = {activeSlide: 0};
  }

  componentDidMount = async () => {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('redirectHK')} />,
    });
  };

  copyToClipboard = (value?: string) => () => {
    if (value) {
      Clipboard.setString(value);
      // this.setState({copyString: value});
      this.props.action.toast.push(Toast.COPY_SUCCESS);
    }
  };

  renderGuideHK = ({item}: {item: CarouselIndex}) => {
    return (
      <Image
        style={styles.image}
        source={guideImage[item]}
        resizeMode="stretch"
      />
    );
  };

  render() {
    const {params} = this.props.route;
    const images = Object.keys(guideImage);
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <View style={{margin: 20}}>
            <AppText style={appStyles.normal14Text}>
              {i18n.t('redirectHK:info1')}
              <AppText
                style={[appStyles.normal14Text, {color: colors.clearBlue}]}>
                {i18n.t('redirectHK:info2')}
              </AppText>
            </AppText>

            <AppText style={[appStyles.bold14Text, {marginTop: 20}]}>
              {i18n.t('redirectHK:info3')}
            </AppText>
          </View>

          <View style={styles.guideContainer}>
            <AppText style={styles.guide}>{i18n.t('redirectHK:guide')}</AppText>
            <Carousel
              ref={this.carousel}
              data={images}
              renderItem={this.renderGuideHK}
              onSnapToItem={(index) => this.setState({activeSlide: index})}
              autoplay={false}
              useScrollView
              lockScrollWhileSnapping
              resizeMode="contain"
              // overflow='hidden'
              sliderWidth={sliderWidth}
              itemWidth={sliderWidth}
            />

            <Pagination
              dotsLength={images.length}
              activeDotIndex={this.state.activeSlide}
              dotContainerStyle={{width: 10, height: 15}}
              dotStyle={styles.dotStyle}
              inactiveDotStyle={styles.inactiveDotStyle}
              inactiveDotOpacity={0.4}
              inactiveDotScale={1.0}
              carouselRef={this.carousel}
              tappableDots={!_.isEmpty(this.carousel?.current)}
              // containerStyle={styles.pagination}
            />
          </View>
          <View style={{paddingHorizontal: 20, marginBottom: 32}}>
            {['iccid', 'orderNo'].map((elm) => (
              <View style={styles.copyBox}>
                <View style={{flex: 9}}>
                  <AppText style={styles.keyTitle}>
                    {i18n.t(`redirectHK:${elm}`)}
                  </AppText>
                  <View style={styles.textUnderLine}>
                    <AppText style={[appStyles.bold16Text]}>
                      {params[elm]}
                    </AppText>
                  </View>
                </View>
                <AppButton
                  title={i18n.t('copy')}
                  titleStyle={appStyles.normal14Text}
                  style={styles.btnCopy}
                  onPress={this.copyToClipboard(params[elm])}
                />
              </View>
            ))}
          </View>
          <AppButton
            style={styles.confirm}
            titleStyle={styles.confirmTitle}
            title={i18n.t('esim:redirectHKRegister')}
            onPress={async () => {
              // 홍콩 실명인증 웹 페이지
              await Linking.openURL(
                'https://global.cmlink.com/store/realname?LT=en',
              );
            }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, status}: RootState) => ({
    account,
    pending: status.pending[accountActions.logout.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(RedirectHKScreen);
