import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';

import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import * as productActions from '../redux/modules/product';
import * as cartActions from '../redux/modules/cart';
import * as accountActions from '../redux/modules/account';
import {bindActionCreators} from 'redux';
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
import Analytics from 'appcenter-analytics';
import _ from 'underscore';
import AppActivityIndicator from '../components/AppActivityIndicator';
import SnackBar from 'react-native-snackbar-component';
import {API} from 'Rokebi/submodules/rokebi-utils';
import {timer} from '../constants/Timer';
import api from '../submodules/rokebi-utils/api/api';
import AppAlert from '../components/AppAlert';

class CountryListItem extends PureComponent {
  render() {
    const {item, selected, onPress} = this.props;
    let borderColor = {},
      color = {};

    if (selected == item.uuid) {
      borderColor = {borderColor: colors.clearBlue};
      color = {color: colors.clearBlue};
    }

    return (
      <TouchableOpacity onPress={onPress(item.uuid)}>
        <View>
          <View key={'product'} style={[styles.card, borderColor]}>
            <View key={'text'} style={styles.textView}>
              <Text
                key={'name'}
                style={[
                  windowWidth > device.small.window.width
                    ? appStyles.bold16Text
                    : appStyles.bold14Text,
                  color,
                ]}>
                {item.name}
              </Text>
            </View>
            <View key={'priceText'} style={styles.appPrice}>
              <AppPrice
                key={'price'}
                price={item.price}
                balanceStyle={styles.priceStyle}
                wonStyle={styles.wonStyle}
              />
            </View>
          </View>
          {!_.isEmpty(item.promoFlag) && (
            <View style={styles.badge}>
              <Text key={'name'} style={styles.badgeText}>
                {item.promoFlag[0]}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

class CountryBackButton extends PureComponent {
  render() {
    const {navigation, product} = this.props,
      {localOpList} = product,
      prodOfCountry = this.props.product.prodOfCountry,
      title =
        prodOfCountry && prodOfCountry.length > 0
          ? API.Product.getTitle(
              prodOfCountry[0].categoryId,
              localOpList.get(prodOfCountry[0].partnerId),
            )
          : '';

    return <AppBackButton navigation={navigation} title={title} />;
  }
}

let BackButton = connect(state => ({product: state.product.toObject()}))(
  CountryBackButton,
);

class CountryScreen extends Component {
  constructor(props) {
    super(props);

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

    this.state = {
      prodData: [],
      selected: undefined,
      imageUrl: undefined,
      title: undefined,
      showSnackBar: false,
      localOpDetails: undefined,
      pending: false,
    };

    this.snackRef = React.createRef();
  }

  componentDidMount() {
    const prodOfCountry = this.props.product.prodOfCountry,
      {localOpList} = this.props.product,
      localOp = localOpList.get(prodOfCountry[0].partnerId) || {};

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

  _onPress = uuid => () => {
    this.setState({selected: uuid});
  };

  _onPressBtn = key => () => {
    const {selected} = this.state;
    const {loggedIn, balance} = this.props.account;

    // 다른 버튼 클릭으로 스낵바 종료될 경우, 재출력 안되는 부분이 있어 추가
    this.setState({
      showSnackBar: false,
    });

    Analytics.trackEvent('Click_' + key);

    if (!loggedIn) {
      this.props.navigation.navigate('Auth');
    } else {
      if (selected) {
        const prod = this.props.product.prodList.get(selected),
          addProduct = prod
            ? {
                title: prod.name,
                variationId: prod.variationId,
                price: prod.price,
                qty: 1,
                key: prod.uuid,
                sku: prod.sku,
                imageUrl: prod.imageUrl,
                type: 'product',
              }
            : {};

        switch (key) {
          case 'cart':
            this.setState({
              pending: true,
            });
            this.props.action.cart
              .cartAddAndGet([addProduct])
              .then(resp => {
                if (resp.result == 0) {
                  this.setState({
                    showSnackBar: true,
                  });
                } else if (resp.result === api.E_RESOURCE_NOT_FOUND) {
                  AppAlert.info(i18n.t('cart:notToCart'));
                }
              })
              .catch(err => {
                console.log('failed to get page', key, err);
              })
              .finally(_ => {
                this.setState({
                  pending: false,
                });
              });
            break;
          case 'purchase':
            this.props.action.cart
              .checkStock([addProduct])
              .then(resp => {
                if (resp.result === api.E_RESOURCE_NOT_FOUND) {
                  AppAlert.info(i18n.t('cart:soldOut'));
                } else if (resp.result == 0) {
                  // 구매 품목을 갱신한다.
                  this.props.action.cart.purchase({
                    purchaseItems: [addProduct],
                    balance,
                  });
                  this.props.navigation.navigate('PymMethod', {
                    mode: 'Roaming Product',
                  });
                }
              })
              .catch(err => {
                console.log('failed to check stock', err);
              });
            break;
          case 'regCard':
            this.props.navigation.navigate('RegisterSim');
        }
      }
    }
  };

  _renderItem = ({item}) => {
    return (
      <CountryListItem
        item={item}
        selected={this.state.selected}
        onPress={this._onPress}
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

        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('ProductDetail', {
              title: title,
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
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={{flex: 1}}>
          <FlatList
            data={prodData}
            renderItem={this._renderItem}
            extraData={selected}
          />
        </View>
        {/* useNativeDriver 사용 여부가 아직 추가 되지 않아 warning 발생중 */}
        <SnackBar
          ref={this.snackRef}
          visible={showSnackBar}
          backgroundColor={colors.clearBlue}
          messageColor={colors.white}
          position={'top'}
          top={windowHeight / 2}
          containerStyle={{borderRadius: 3, height: 48, marginHorizontal: 0}}
          actionText={'X'}
          actionStyle={{paddingHorizontal: 20}}
          accentColor={colors.white}
          autoHidingTime={timer.snackBarHidingTime}
          onClose={() => this.setState({showSnackBar: false})}
          actionHandler={() => {
            this.snackRef.current.hideSnackbar();
          }}
          textMessage={i18n.t('country:addCart')}
        />
        {iccid ? (
          <View style={styles.buttonBox}>
            <AppButton
              style={styles.btnCart}
              title={i18n.t('cart:toCart')}
              titleStyle={styles.btnCartText}
              disabled={this.state.pending}
              disableColor={colors.black}
              disableBackgroundColor={colors.whiteTwo}
              onPress={this._onPressBtn('cart')}
            />
            <AppButton
              style={styles.btnBuy}
              title={i18n.t('cart:buy')}
              titleStyle={styles.btnBuyText}
              onPress={this._onPressBtn('purchase')}
            />
          </View>
        ) : (
          <View style={styles.buttonBox}>
            <AppButton
              style={styles.regCardView}
              title={loggedIn ? i18n.t('reg:card') : i18n.t('err:login')}
              titleStyle={styles.regCard}
              onPress={this._onPressBtn('regCard')}
            />
            <Text style={styles.regCard}>{i18n.t('reg:card')}</Text>
          </View>
        )}
        <AppActivityIndicator visible={this.state.pending} />
      </SafeAreaView>
    );
  }
}

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
  rowDirection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  descBox: {
    marginTop: 15,
    marginRight: 5,
    marginLeft: 5,
  },
  descKey: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 15,
    flex: 3,
  },
  descValue: {
    fontSize: 12,
    textAlign: 'left',
    padding: 3,
    marginLeft: 15,
    flex: 7,
  },
  bottomBtn: {
    position: 'absolute',
    bottom: 0,
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

const mapStateToProps = state => ({
  product: state.product.toObject(),
  cart: state.cart.toJS(),
  account: state.account.toJS(),
});

export default connect(
  mapStateToProps,
  dispatch => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(CountryScreen);
