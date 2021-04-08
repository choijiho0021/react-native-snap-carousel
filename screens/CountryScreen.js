/* eslint-disable consistent-return */
import React, {Component, memo} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Image,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Analytics from 'appcenter-analytics';
import _ from 'underscore';
import SnackBar from 'react-native-snackbar-component';
import {API} from '../submodules/rokebi-utils';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import * as productActions from '../redux/modules/product';
import * as cartActions from '../redux/modules/cart';
import * as accountActions from '../redux/modules/account';
import AppButton from '../components/AppButton';
import AppIcon from '../components/AppIcon';
import AppBackButton from '../components/AppBackButton';
import {colors} from '../constants/Colors';
import AppPrice from '../components/AppPrice';
import AppCartButton from '../components/AppCartButton';
import {
  windowWidth,
  device,
  windowHeight,
} from '../constants/SliderEntry.style';
import AppActivityIndicator from '../components/AppActivityIndicator';
import {timer} from '../constants/Timer';
import api from '../submodules/rokebi-utils/api/api';
import AppAlert from '../components/AppAlert';
import Env from '../environment';

const {esimApp} = Env.get();
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
    marginVertical: 7,
    marginHorizontal: 20,
    flexDirection: 'row',
    // justifyContent:'space-between',
    padding: 15,
    alignItems: 'center',
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
    marginBottom: 30,
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
    width: 80,
  },
  textView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  badge: {
    position: 'absolute',
    right: 0,
    marginRight: 20,
    width: 38,
    height: 22,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.tomato,
    alignItems: 'center',
    paddingTop: 2,
  },
  badgeText: {
    color: colors.tomato,
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 16,
  },
});

const CountryListItem0 = ({item, selected, onPress}) => {
  let borderColor = {};
  let color = {};

  if (selected === item.uuid) {
    borderColor = {borderColor: colors.clearBlue};
    color = {color: colors.clearBlue};
  }

  return (
    <Pressable onPress={onPress(item.uuid)}>
      <View>
        <View key="product" style={[styles.card, borderColor]}>
          <View key="text" style={styles.textView}>
            <Text
              key="name"
              style={[
                windowWidth > device.small.window.width
                  ? appStyles.bold16Text
                  : appStyles.bold14Text,
                color,
              ]}>
              {item.name}
            </Text>
          </View>
          <View key="priceText" style={styles.appPrice}>
            <AppPrice
              key="price"
              price={item.price}
              balanceStyle={styles.priceStyle}
              wonStyle={styles.wonStyle}
            />
          </View>
        </View>
        {!_.isEmpty(item.promoFlag) && (
          <View style={styles.badge}>
            <Text key="name" style={styles.badgeText}>
              {i18n.t(item.promoFlag[0])}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const CountryListItem = memo(CountryListItem0);

const CountryBackButton = ({navigation, product}) => {
  const {localOpList, prodOfCountry} = product;
  const title =
    prodOfCountry && prodOfCountry.length > 0
      ? API.Product.getTitle(
          prodOfCountry[0].categoryId[0],
          localOpList.get(prodOfCountry[0].partnerId),
        )
      : '';

  return <AppBackButton navigation={navigation} title={title} />;
};

const BackButton = connect((state) => ({product: state.product.toObject()}))(
  memo(CountryBackButton),
);

function soldOut(resp, message) {
  if (resp.result === api.E_RESOURCE_NOT_FOUND) {
    AppAlert.info(resp.title + i18n.t(message));
  } else {
    AppAlert.info(i18n.t('cart:systemError'));
  }
}

class CountryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prodData: [],
      selected: undefined,
      imageUrl: undefined,
      title: undefined,
      showSnackBar: false,
      localOpDetails: undefined,
      pending: false,
      disabled: false,
      isFocused: true,
    };

    this.snackRef = React.createRef();
    this.onPressBtnCart = this.onPressBtnCart.bind(this);
    this.onPressBtnPurchase = this.onPressBtnPurchase.bind(this);
    this.onPressBtnRegCard = this.onPressBtnRegCard.bind(this);
    this.selectedProduct = this.selectedProduct.bind(this);
    this.onPress = this.onPress.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <BackButton
          navigation={this.props.navigation}
          route={this.props.route}
        />
      ),
      headerRight: () => (
        <AppCartButton onPress={() => this.props.navigation.navigate('Cart')} />
      ),
    });

    const {localOpList, prodOfCountry} = this.props.product;
    const localOp = localOpList.get(prodOfCountry[0].partnerId) || {};

    if (prodOfCountry) {
      this.setState({
        prodData: prodOfCountry,
        imageUrl: localOp.imageUrl,
        localOpDetails: localOp.detail,
        selected: prodOfCountry[0].uuid,
        title: API.Product.getTitle(prodOfCountry[0], localOp),
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  componentDidUpdate() {
    if (this.props.navigation.isFocused() !== this.state.isFocused) {
      this.setValue('isFocused', this.props.navigation.isFocused());
      if (this.props.navigation.isFocused()) {
        this.onPress(this.state.selected);
      }
    }
  }

  setValue = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  onPress = (uuid) => () => {
    this.setState({selected: uuid});
    if (
      (this.props.cart.orderItems || []).find((v) => v.key === uuid)?.qty >=
      PURCHASE_LIMIT
    ) {
      this.setState({disabled: true});
    } else {
      this.setState({disabled: false});
    }
  };

  selectedProduct = (selected) => {
    return API.Product.toPurchaseItem(
      this.props.product.prodList.get(selected),
    );
  };

  onPressBtnCart = () => {
    const {selected} = this.state;
    const {loggedIn} = this.props.account;

    // 다른 버튼 클릭으로 스낵바 종료될 경우, 재출력 안되는 부분이 있어 추가
    this.setState({
      showSnackBar: false,
    });

    Analytics.trackEvent('Click_cart');

    if (!loggedIn) {
      return this.props.navigation.navigate('Auth');
    }

    if (selected) {
      this.setState({
        pending: true,
      });

      this.props.action.cart
        .cartAddAndGet([this.selectedProduct(selected)])
        .then((resp) => {
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
        })
        .finally(() => {
          this.setState({
            pending: false,
          });
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
        .checkStockAndPurchase([this.selectedProduct(selected)], balance)
        .then((resp) => {
          if (resp.result === 0) {
            this.props.navigation.navigate('PymMethod', {
              mode: 'Roaming Product',
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

  renderItem = ({item}) => {
    return (
      <CountryListItem
        item={item}
        selected={this.state.selected}
        onPress={this.onPress}
      />
    );
  };

  render() {
    const {iccid, loggedIn} = this.props.account;
    const {
      prodData,
      imageUrl,
      localOpDetails,
      title,
      selected,
      showSnackBar,
    } = this.state;

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'never', bottom: 'always'}}>
        <Image
          style={styles.box}
          source={{uri: API.default.httpImageUrl(imageUrl)}}
        />

        <Pressable
          onPress={() =>
            this.props.navigation.navigate('ProductDetail', {
              title,
              img: imageUrl,
              localOpDetails,
            })
          }>
          <View style={styles.detail}>
            <Text
              style={
                windowWidth > device.small.window.width
                  ? appStyles.normal14Text
                  : appStyles.normal12Text
              }>
              {i18n.t('country:detail')}
            </Text>
            <AppIcon
              style={{marginRight: 20}}
              name="iconArrowRight"
              size={10}
            />
          </View>
        </Pressable>

        <View style={styles.divider} />

        <View style={{flex: 1}}>
          <FlatList
            data={prodData}
            renderItem={this.renderItem}
            extraData={selected}
          />
        </View>
        {/* useNativeDriver 사용 여부가 아직 추가 되지 않아 warning 발생중 */}
        <SnackBar
          ref={this.snackRef}
          visible={showSnackBar}
          backgroundColor={colors.clearBlue}
          messageColor={colors.white}
          position="top"
          top={windowHeight / 2}
          containerStyle={{borderRadius: 3, height: 48, marginHorizontal: 0}}
          actionText="X"
          actionStyle={{paddingHorizontal: 20}}
          accentColor={colors.white}
          autoHidingTime={timer.snackBarHidingTime}
          onClose={() => this.setState({showSnackBar: false})}
          actionHandler={() => {
            this.snackRef.current.hideSnackbar();
          }}
          textMessage={i18n.t('country:addCart')}
        />
        {iccid || (esimApp && loggedIn) ? (
          <View style={styles.buttonBox}>
            <AppButton
              style={styles.btnCart}
              title={i18n.t('cart:toCart')}
              titleStyle={styles.btnCartText}
              disabled={this.state.pending || this.state.disabled}
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
            <Text style={styles.regCard}>{i18n.t('reg:card')}</Text>
          </View>
        )}
        <AppActivityIndicator visible={this.state.pending} />
      </SafeAreaView>
    );
  }
}

export default connect(
  (state) => ({
    product: state.product.toObject(),
    cart: state.cart.toJS(),
    account: state.account.toJS(),
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(CountryScreen);
