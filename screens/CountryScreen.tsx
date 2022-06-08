/* eslint-disable consistent-return */
import analytics, {firebase} from '@react-native-firebase/analytics';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {Component, memo} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {Settings} from 'react-native-fbsdk';
import {
  getTrackingStatus,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import {ViewStyle} from 'react-native';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppCartButton from '@/components/AppCartButton';
import AppPrice from '@/components/AppPrice';
import AppSnackBar from '@/components/AppSnackBar';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {device, windowWidth} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import api, {ApiResult} from '@/redux/api/api';
import {RkbProduct} from '@/redux/api/productApi';
import {
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {
  actions as cartActions,
  CartAction,
  CartModelState,
} from '@/redux/modules/cart';
import {
  actions as productActions,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';

const {esimApp, esimGlobal} = Env.get();
const PURCHASE_LIMIT = 10;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  box: {
    height: 150,
    // resizeMode: 'cover'
  },
  buttonBox: {
    flexDirection: 'row',
    // position:"absolute",
    // bottom:0
  },
  btnCart: {
    width: '50%',
    height: 52,
    backgroundColor: '#ffffff',
    borderColor: colors.lightGrey,
    borderTopWidth: 1,
  },
  btnCartText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.black,
  },
  btnBuy: {
    width: '50%',
    height: 52,
    backgroundColor: colors.clearBlue,
  },
  btnBuyText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.white,
  },
  card: {
    height: windowWidth > device.small.window.width ? 71 : 60,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    // marginVertical: 7,
    marginHorizontal: 20,
    padding: 15,
    flexDirection: 'row',
  },
  detail: {
    height: windowWidth > device.small.window.width ? 48 : 36,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.black,
    marginVertical: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    paddingLeft: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
    marginTop: 32,
  },
  priceStyle: {
    height: 24,
    // fontFamily: "Roboto",
    fontSize: windowWidth > device.small.window.width ? 20 : 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0.19,
    textAlign: 'right',
    color: colors.black,
  },
  wonStyle: {
    height: 24,
    // fontFamily: "Roboto",
    fontSize: windowWidth > device.small.window.width ? 14 : 12,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0.19,
    color: colors.black,
  },
  regCard: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    textAlignVertical: 'bottom',
    width: '100%',
  },
  regCardView: {
    width: '100%',
    height: 52,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: colors.lightGrey,
  },
  appPrice: {
    alignItems: 'flex-end',
    marginLeft: 10,
    width: esimGlobal ? 60 : 80,
    justifyContent: 'center',
  },
  textView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  badge: {
    // position: 'absolute',
    // right: 0,
    // marginRight: 20,
    // width: 38,
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 2,
    // backgroundColor: colors.white,
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: colors.tomato,
    alignItems: 'center',
    paddingTop: 2,

    marginLeft: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 16,
  },
  itemDivider: {
    marginHorizontal: 40,
    height: 1,
    backgroundColor: colors.whiteTwo,
  },
  sectionHeader: {
    paddingTop: 32,
    paddingBottom: 20,
    marginHorizontal: 20,
    backgroundColor: colors.white,
  },
});
const toVolumeStr = (volume: number) => {
  if (volume <= 1000) return `${volume}MB`;
  return `${volume / 1024}GB`;
};

const CountryListItem0 = ({
  item,
  position,
  onPress,
}: {
  item: RkbProduct;
  position?: string;
  onPress: (v: string) => () => void;
}) => {
  const color = {
    color: item.field_daily === 'total' ? colors.purplyBlue : colors.clearBlue,
  };
  const title =
    item.field_daily === 'total'
      ? toVolumeStr(Number(item.volume))
      : item.days + i18n.t('day');
  let myStyle: ViewStyle = {};

  switch (position) {
    case 'head':
      myStyle = {borderBottomColor: 'white'};
      break;
    case 'middle':
      myStyle = {borderTopColor: 'white', borderBottomColor: 'white'};
      break;
    case 'tail':
      myStyle = {borderTopColor: 'white'};
      break;
    default:
      myStyle = {borderTopColor: 'white'};
      break;
  }

  return (
    <Pressable onPress={onPress(item.uuid)}>
      <View key="product" style={[styles.card, myStyle]}>
        <View key="text" style={styles.textView}>
          <View style={{flexDirection: 'row'}}>
            <AppText
              key="name"
              style={[
                windowWidth > device.small.window.width
                  ? appStyles.bold16Text
                  : appStyles.bold14Text,
                color,
              ]}>
              {title}
            </AppText>
            {!_.isEmpty(item.promoFlag) && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      item.promoFlag[0] === 'hot'
                        ? colors.tomato
                        : colors.clearBlue,
                  },
                ]}>
                <AppText key="name" style={styles.badgeText}>
                  {i18n.t(item.promoFlag[0])}
                </AppText>
              </View>
            )}
          </View>

          <AppText
            key="desc"
            style={[
              windowWidth > device.medium.window.width
                ? appStyles.normal14Text
                : appStyles.normal12Text,
              {marginTop: 5},
            ]}>
            {item.field_description}
          </AppText>
        </View>
        <View key="priceText" style={styles.appPrice}>
          <AppPrice
            key="price"
            price={item.price}
            balanceStyle={styles.priceStyle}
            currencyStyle={styles.wonStyle}
          />
        </View>
      </View>
      <View style={styles.itemDivider} />
    </Pressable>
  );
};

const CountryListItem = memo(CountryListItem0);

function soldOut(payload: ApiResult<any>, message: string) {
  if (payload.result === api.E_RESOURCE_NOT_FOUND) {
    AppAlert.info(i18n.t(message));
  } else {
    AppAlert.info(i18n.t('cart:systemError'));
  }
}

const position = (idx, arr) => {
  if (idx === 0) return 'head';
  if (idx === arr.length - 1) return 'tail';
  return 'middle';
};

type CountryScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Country'
>;

type CountryScreenRouteProp = RouteProp<HomeStackParamList, 'Country'>;

type CountryScreenProps = {
  navigation: CountryScreenNavigationProp;
  route: CountryScreenRouteProp;
  product: ProductModelState;
  cart: CartModelState;
  account: AccountModelState;
  pending: boolean;

  action: {
    cart: CartAction;
  };
};

type CountryScreenState = {
  prodData: {title: string; data: RkbProduct[]}[];
  selected?: string;
  imageUrl?: string;
  title?: string;
  showSnackBar: boolean;
  localOpDetails?: string;
  disabled: boolean;
  isFocused: boolean;
  status?: TrackingStatus;
  partnerId?: string;
};
class CountryScreen extends Component<CountryScreenProps, CountryScreenState> {
  constructor(props: CountryScreenProps) {
    super(props);

    this.state = {
      prodData: [],
      selected: undefined,
      imageUrl: undefined,
      title: undefined,
      showSnackBar: false,
      localOpDetails: undefined,
      disabled: false,
      isFocused: true,
      partnerId: undefined,
    };

    this.snackRef = React.createRef();
    this.onPressBtnCart = this.onPressBtnCart.bind(this);
    this.onPressBtnPurchase = this.onPressBtnPurchase.bind(this);
    this.onPressBtnRegCard = this.onPressBtnRegCard.bind(this);
    this.selectedProduct = this.selectedProduct.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  async componentDidMount() {
    const {navigation, route, product} = this.props;
    const {localOpList, prodOfCountry} = product;
    const prodList =
      prodOfCountry.length > 0 ? prodOfCountry : route.params?.prodOfCountry;

    const localOp = localOpList.get(prodList[0]?.partnerId);
    const title =
      prodList && prodList.length > 0
        ? API.Product.getTitle(localOpList.get(prodList[0]?.partnerId))
        : '';

    this.setState({partnerId: prodList[0]?.partnerId});
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={title} />,
      headerRight: () => (
        <AppCartButton onPress={() => navigation.navigate('Cart')} />
      ),
    });

    const prodData = prodList.reduce((carry, el) => {
      const daily = el.field_daily;

      if (carry[daily] === undefined) {
        carry[daily] = [];
      }

      carry[daily].push(el);
      return carry;
    }, {});

    if (!_.isEmpty(prodList)) {
      this.setState({
        prodData: [
          {title: 'daily', data: prodData.daily || []},
          {title: 'total', data: prodData.total || []},
        ],
        imageUrl: localOp?.imageUrl,
        localOpDetails: localOp?.detail,
        selected: prodList[0]?.uuid,
        title,
        status: await getTrackingStatus(),
      });
    }
  }

  shouldComponentUpdate(
    nextProps: CountryScreenProps,
    nextState: CountryScreenState,
  ) {
    return this.props !== nextProps || this.state !== nextState;
  }

  componentDidUpdate() {
    const isFocused = this.props.navigation.isFocused();

    if (isFocused !== this.state.isFocused) {
      this.setState({isFocused});
      if (isFocused) {
        // bhtak 아래 함수는 아무런 효과가 없을 것 같은데..
        this.onPress(this.state.selected);
      }
    }
  }

  onPress = (uuid?: string) => () => {
    this.setState({selected: uuid});
    if (
      (this.props.cart.orderItems?.find((v) => v.key === uuid)?.qty || 0) >=
      PURCHASE_LIMIT
    ) {
      this.setState({disabled: true});
    } else {
      this.setState({disabled: false});
    }
  };

  selectedProduct = (selected: string) => {
    const prod = API.Product.toPurchaseItem(
      this.props.product.prodList.get(selected),
    );
    return prod ? [prod] : [];
  };

  onPressBtnCart = async () => {
    const {selected, status} = this.state;
    const {loggedIn} = this.props.account;

    // 다른 버튼 클릭으로 스낵바 종료될 경우, 재출력 안되는 부분이 있어 추가
    this.setState({
      showSnackBar: false,
    });

    const purchaseItems = this.selectedProduct(selected);

    if (status === 'authorized') {
      Analytics.trackEvent('Click_cart');
      await firebase.analytics().setAnalyticsCollectionEnabled(true);
      await Settings.setAdvertiserTrackingEnabled(true);

      analytics().logEvent(`${esimGlobal ? 'global' : 'esim'}_to_cart`, {
        item: purchaseItems[0].title,
        count: 1,
      });
    }

    if (!loggedIn) {
      return this.props.navigation.navigate('Auth');
    }

    if (selected) {
      this.props.action.cart
        .cartAddAndGet({purchaseItems: this.selectedProduct(selected)})
        .then(({payload: resp}) => {
          console.log('@@@ add and get', resp);
          if (resp.result === 0) {
            this.setState({
              showSnackBar: true,
            });
            if (
              resp.objects[0].orderItems.find((v) => v.key === selected).qty >=
              PURCHASE_LIMIT
            ) {
              this.setState({disabled: true});
            }
          } else {
            soldOut(resp, 'cart:notToCart');
          }
        });
    }
  };

  onPressBtnPurchase = () => {
    const {selected} = this.state;
    const {loggedIn, balance} = this.props.account;

    // 다른 버튼 클릭으로 스낵바 종료될 경우, 재출력 안되는 부분이 있어 추가
    this.setState({
      showSnackBar: false,
    });

    Analytics.trackEvent('Click_purchase');

    if (!loggedIn) {
      return this.props.navigation.navigate('Auth');
    }

    if (selected) {
      // 구매 품목을 갱신한다.
      this.props.action.cart
        .checkStockAndPurchase({
          purchaseItems: this.selectedProduct(selected),
          balance,
        })
        .then(({payload: resp}) => {
          if (resp.result === 0) {
            this.props.navigation.navigate('PymMethod', {
              mode: 'roaming_product',
            });
          } else {
            soldOut(resp, 'cart:soldOut');
          }
        })
        .catch((err) => {
          console.log('failed to check stock', err);
        });
    }
  };

  onPressBtnRegCard = () => {
    const {loggedIn} = this.props.account;

    Analytics.trackEvent('Click_regCard');

    if (!loggedIn) {
      return this.props.navigation.navigate('Auth');
    }

    this.props.navigation.navigate('RegisterSim');
  };

  renderItem = ({
    item,
    index,
    section,
  }: {
    item: RkbProduct;
    index: number;
    section: {title; data};
  }) => {
    return (
      <CountryListItem
        item={item}
        onPress={this.onPress}
        position={position(index, section.data)}
      />
    );
  };

  render() {
    const {
      account: {iccid, loggedIn},
      pending,
    } = this.props;
    const {
      prodData,
      imageUrl,
      localOpDetails,
      title,
      selected,
      showSnackBar,
      disabled,
      partnerId,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {imageUrl && (
          <Image
            style={styles.box}
            source={{uri: API.default.httpImageUrl(imageUrl)}}
          />
        )}

        {/* <Pressable
          onPress={() =>
            this.props.navigation.navigate('ProductDetail', {
              title,
              img: imageUrl,
              localOpDetails,
              partnerId,
            })
          }>
          <View style={styles.detail}>
            <AppText
              style={
                windowWidth > device.small.window.width
                  ? appStyles.normal14Text
                  : appStyles.normal12Text
              }>
              {i18n.t('country:detail')}
            </AppText>
            <AppIcon
              style={{marginRight: 20}}
              name="iconArrowRight"
              size={10}
            />
          </View>
        </Pressable> */}

        <View style={{flex: 1}}>
          <SectionList
            sections={prodData}
            // keyExtractor={(item, index) => item + index}
            renderItem={this.renderItem}
            renderSectionHeader={({section: {title, data}}) =>
              data.length >= 1 ? (
                <View style={styles.sectionHeader}>
                  <AppText
                    style={{
                      ...appStyles.bold20Text,
                    }}>
                    {i18n.t(`country:${title}`)}
                  </AppText>
                </View>
              ) : null
            }
            renderSectionFooter={({section: {title, data}}) =>
              title === 'daily' && prodData[1].data.length >= 1 ? (
                <View style={styles.divider} />
              ) : null
            }
          />
        </View>
        {/* useNativeDriver 사용 여부가 아직 추가 되지 않아 warning 발생중 */}
        <AppSnackBar
          visible={showSnackBar}
          onClose={() => this.setState({showSnackBar: false})}
          textMessage={i18n.t('country:addCart')}
        />
        {iccid || (esimApp && loggedIn) ? (
          <View style={styles.buttonBox}>
            <AppButton
              style={styles.btnCart}
              title={i18n.t('cart:toCart')}
              titleStyle={styles.btnCartText}
              disabled={pending || disabled}
              disableColor={colors.black}
              disableBackgroundColor={colors.whiteTwo}
              onPress={this.onPressBtnCart}
            />
            <AppButton
              style={styles.btnBuy}
              title={i18n.t('cart:buy')}
              titleStyle={styles.btnBuyText}
              onPress={this.onPressBtnPurchase}
            />
          </View>
        ) : (
          <View style={styles.buttonBox}>
            <AppButton
              style={styles.regCardView}
              title={loggedIn ? i18n.t('reg:card') : i18n.t('err:login')}
              titleStyle={styles.regCard}
              onPress={this.onPressBtnRegCard}
            />
            <AppText style={styles.regCard}>{i18n.t('reg:card')}</AppText>
          </View>
        )}
        <AppActivityIndicator visible={pending} />
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, cart, product, status}: RootState) => ({
    product,
    cart,
    account,
    pending:
      status.pending[cartActions.cartAddAndGet.typePrefix] ||
      status.pending[cartActions.checkStockAndPurchase.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(CountryScreen);
