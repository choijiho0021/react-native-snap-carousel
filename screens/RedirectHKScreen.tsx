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
import {HomeStackParamList, navigate} from '@/navigation/navigation';
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
import AppSnackBar from '@/components/AppSnackBar';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppTextJoin from '@/components/AppTextJoin';
import AppStyledText from '@/components/AppStyledText';

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
    ...appStyles.normal16Text,
    marginBottom: 10,
    color: colors.warmGrey,
  },
  guide: {
    ...appStyles.bold18Text,
    marginBottom: 16,
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
    paddingVertical: 36,
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
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
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
  showSnackBar: boolean;
  copyString: string;
};

class RedirectHKScreen extends Component<
  RedirectHKScreenProps,
  RedirectHKScreenState
> {
  carousel: React.LegacyRef<Carousel<CarouselIndex>>;

  constructor(props: RedirectHKScreenProps) {
    super(props);
    this.carousel = React.createRef();
    this.state = {activeSlide: 0, showSnackBar: false};
  }

  componentDidMount = async () => {
    const {navigation, route} = this.props;
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('redirectHK')} />,
      headerRight: () => (
        <AppSvgIcon
          name="btnCnter"
          style={styles.btnCnter}
          onPress={() =>
            navigate(navigation, route, 'EsimStack', {
              tab: 'HomeStack',
              screen: 'Contact',
            })
          }
        />
      ),
    });
  };

  copyToClipboard = (value?: string) => () => {
    if (value) {
      Clipboard.setString(value);
      this.setState({showSnackBar: true, copyString: value});
    }
  };

  renderGuideHK = ({item}: {item: CarouselIndex}) => {
    return (
      <Image
        style={styles.image}
        source={guideImage[item]}
        resizeMode="contain"
      />
    );
  };

  render() {
    const {params} = this.props.route;
    const {copyString} = this.state;
    const images = Object.keys(guideImage);
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <View style={{margin: 20}}>
            <AppStyledText
              textStyle={{
                ...appStyles.normal14Text,
                lineHeight: 20,
                letterSpacing: 0,
              }}
              text={i18n.t('redirectHK:info1')}
              format={{b: {color: colors.blue}}}
            />
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
              overflow="hidden"
              sliderWidth={sliderWidth}
              itemWidth={sliderWidth}
            />

            <Pagination
              dotsLength={images.length}
              activeDotIndex={this.state.activeSlide}
              dotContainerStyle={{width: 2, height: 15}}
              dotStyle={styles.dotStyle}
              inactiveDotStyle={styles.inactiveDotStyle}
              inactiveDotOpacity={0.4}
              inactiveDotScale={1.0}
              carouselRef={this.carousel}
              tappableDots={!_.isEmpty(this.carousel?.current)}
              containerStyle={{paddingTop: 16, paddingBottom: 0}}
            />
          </View>
          <View
            style={{paddingHorizontal: 20, marginBottom: 32, marginTop: 24}}>
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
                  titleStyle={[
                    appStyles.normal14Text,
                    {
                      color:
                        copyString === params[elm]
                          ? colors.clearBlue
                          : colors.black,
                    },
                  ]}
                  style={[
                    styles.btnCopy,
                    {
                      borderColor:
                        copyString === params[elm]
                          ? colors.clearBlue
                          : colors.lightGrey,
                    },
                  ]}
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
        <AppSnackBar
          visible={this.state.showSnackBar}
          onClose={() => this.setState({showSnackBar: false})}
          textMessage={i18n.t('redirectHK:copySuccess')}
          bottom={90}
        />
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
