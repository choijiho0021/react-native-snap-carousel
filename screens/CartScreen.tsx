import {Map as ImmutableMap} from 'immutable';
import React, {Component} from 'react';
import {
  Alert,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SnackBar from 'react-native-snackbar-component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import CartItem from '@/components/CartItem';
import ChargeSummary from '@/components/ChargeSummary';
import {colors} from '@/constants/Colors';
import {isDeviceSize, windowHeight} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {timer} from '@/constants/Timer';
import {
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {
  actions as cartActions,
  CartAction,
  CartModelState,
} from '@/redux/modules/cart';
import api from '@/redux/api/api';
import i18n from '@/utils/i18n';
import {RootState} from '@/redux';
import utils from '@/redux/api/utils';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigation/navigation';
import {RouteProp} from '@react-navigation/native';
import {RkbOrderItem} from '@/redux/api/cartApi';
import {ProductModelState} from '@/redux/modules/product';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {Currency} from '@/redux/api/productApi';
import Env from '@/environment';

const {esimCurrency} = Env.get();
const sectionTitle = ['sim', 'product'];

const styles = StyleSheet.create({
  header: {
    ...appStyles.bold18Text,
    color: colors.black,
    marginTop: 30,
    marginLeft: 20,
  },
  sumBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  sectionTitle: {
    ...appStyles.subTitle,
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  btnBuy: {
    flex: 1,
    backgroundColor: colors.clearBlue,
  },
  btnBuyText: {
    ...appStyles.normal16Text,
    textAlign: 'center',
  },
  delete: {
    paddingVertical: 12,
    width: '10%',
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 52,
    borderTopColor: colors.lightGrey,
    borderTopWidth: 1,
  },
  button: {
    ...appStyles.button,
    width: 100,
    alignSelf: 'center',
  },
  emptyView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: isDeviceSize('small') ? 200 : 450,
  },
  emptyText: {
    textAlign: 'center',
  },
});

type CartScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Cart'>;

type CartScreenRouteProp = RouteProp<HomeStackParamList, 'Cart'>;

type CartScreenProps = {
  navigation: CartScreenNavigationProp;
  route: CartScreenRouteProp;

  cart: CartModelState;
  account: AccountModelState;
  product: ProductModelState;
  pending: boolean;

  action: {
    cart: CartAction;
  };
};

type ItemTotal = {cnt: number; price: Currency};
type ItemSection = {data: RkbOrderItem[]; title: string};
type CartScreenState = {
  section: ItemSection[];
  checked: ImmutableMap<string, boolean>;
  qty: ImmutableMap<string, number>;
  total: ItemTotal;
  showSnackBar: boolean;
};
class CartScreen extends Component<CartScreenProps, CartScreenState> {
  snackRef: React.RefObject<SnackBar>;

  constructor(props: CartScreenProps) {
    super(props);

    this.state = {
      section: [],
      checked: ImmutableMap<string, boolean>(),
      qty: ImmutableMap<string, number>(),
      total: {cnt: 0, price: utils.toCurrency(0, esimCurrency)},
      showSnackBar: false,
    };

    this.snackRef = React.createRef();

    this.onPurchase = this.onPurchase.bind(this);
    this.onChangeQty = this.onChangeQty.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.checkDeletedItem = this.checkDeletedItem.bind(this);
    this.calculate = this.calculate.bind(this);
    this.init = this.init.bind(this);
    this.sim = this.sim.bind(this);
    this.registerSimAlert = this.registerSimAlert.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('cart')} />,
    });

    this.init();
  }

  componentDidUpdate(prevProps: CartScreenProps) {
    const {cart, pending} = this.props;

    if (cart && cart !== prevProps.cart && cart.orderItems && !pending) {
      this.init();
    }
  }

  onChecked(key: string) {
    this.setState((state) => {
      const checked = state.checked.update(key, (value) => !value);
      const {qty} = state;
      const total = this.calculate(checked, qty);

      return {
        total,
        checked,
      };
    });
  }

  onPurchase() {
    const {section, qty, checked, total} = this.state;
    const dlvCost = this.getDlvCost(checked, qty, total, section);
    const {loggedIn, balance} = this.props.account;

    if (!loggedIn) {
      this.props.navigation.navigate('Auth');
    } else {
      const purchaseItems = section
        .reduce(
          (acc, cur) =>
            acc.concat(
              cur.data.filter(
                (item) => checked.get(item.key) && qty.get(item.key, 0) > 0,
              ),
            ),
          [] as RkbOrderItem[],
        )
        .map(
          (item) =>
            ({
              ...item,
              sku: item.prod.sku,
              variationId: item.prod.variationId,
              qty: qty.get(item.key),
            } as PurchaseItem),
        );

      this.props.action.cart
        .checkStockAndPurchase({purchaseItems, balance, dlvCost: dlvCost > 0})
        .then(({payload: resp}) => {
          if (resp.result === 0) {
            this.props.navigation.navigate('PymMethod', {mode: 'cart'});
          } else if (resp.result === api.E_RESOURCE_NOT_FOUND)
            AppAlert.info(`${resp.title} ${i18n.t('cart:soldOut')}`);
          else AppAlert.info(i18n.t('cart:systemError'));
        })
        .catch((err) => {
          console.log('failed to check stock', err);
        });
    }
  }

  onChangeQty(key: string, orderItemId: number, cnt: number) {
    this.setState((state) => {
      const qty = state.qty.set(key, cnt);
      const checked = state.checked.set(key, true);
      const total = this.calculate(checked, qty);
      return {
        qty,
        checked,
        total,
      };
    });

    const {orderId} = this.props.cart;
    if (orderItemId && orderId) {
      this.props.action.cart.cartUpdateQty({
        orderId,
        orderItemId,
        qty: cnt,
        abortController: new AbortController(),
      });
    }
  }

  isEmptyList = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={[styles.emptyText, {color: colors.black}]}>
          {i18n.t('cart:empty')}
        </Text>
      </View>
    );
  };

  getDlvCost = (
    checked: ImmutableMap<string, boolean>,
    qty: ImmutableMap<string, number>,
    total: ItemTotal,
    section: ItemSection[],
  ) => {
    const simList = section.find((item) => item.title === 'sim');
    return simList &&
      simList.data.findIndex(
        (item) => checked.get(item.key) && (qty.get(item.key) || 0) > 0,
      ) >= 0
      ? utils.dlvCost(total.price)
      : utils.toCurrency(0, total.price.currency);
  };

  section = (args: RkbOrderItem[][]) => {
    return args
      .map((item, idx) => ({
        title: sectionTitle[idx],
        data: item,
      }))
      .filter((item) => item.data.length > 0);
  };

  init() {
    const {orderItems} = this.props.cart;

    this.checkDeletedItem(orderItems);

    let {qty, checked} = this.state;
    const total = this.calculate(checked, qty);
    const list = orderItems.reduce(
      (acc, cur) => {
        return cur.type === 'sim_card'
          ? [acc[0].concat(cur), acc[1]]
          : [acc[0], acc[1].concat(cur)];
      },
      [[] as RkbOrderItem[], [] as RkbOrderItem[]],
    );

    this.setState({
      total,
      section: this.section(list),
    });

    orderItems.forEach((item) => {
      qty = qty.set(item.key, item.qty);
      checked = checked.update(item.key, (value) =>
        typeof value === 'undefined' ? true : value,
      );
    });

    this.setState({
      qty,
      checked,
    });
  }

  sim() {
    return this.props.cart.orderItems
      .filter(
        (item) =>
          item.prod.type === 'sim_card' &&
          this.state.checked.get(item.key) &&
          this.state.qty.get(item.key),
      )
      .map((item) => item.totalPrice)
      .reduce(
        (acc, cur) => utils.toCurrency(acc.value + cur.value, cur.currency),
        utils.toCurrency(0, 'KRW'),
      );
  }

  checkDeletedItem(items: RkbOrderItem[]) {
    const {prodList} = this.props.product;
    const toRemove = (items || {}).filter(
      (item) => typeof prodList.get(item.key) === 'undefined',
    );

    if (!_.isEmpty(toRemove)) {
      toRemove.forEach((item) => this.removeItem(item.key, item.orderItemId));
      this.setState({
        showSnackBar: true,
      });
    }
  }

  removeItem(key: string, orderItemId: number) {
    this.setState((state) => {
      const section = state.section?.map((item) => ({
        title: item.title,
        data: item.data.filter((i) => i.orderItemId !== orderItemId),
      }));
      const checked = state.checked.remove(key);
      const qty = state.qty.remove(key);
      const total = this.calculate(checked, qty, section);

      return {
        total,
        checked,
        qty,
        section,
      };
    });

    const {orderId} = this.props.cart;
    if (orderItemId && orderId) {
      this.props.action.cart.cartRemove({
        orderId,
        orderItemId,
      });
    }
  }

  renderItem = ({item}: {item: RkbOrderItem}) => {
    const {qty, checked} = this.state;
    const partnerId = this.props.product.prodList.get(item.key)?.partnerId;
    const imageUrl =
      partnerId && this.props.product.localOpList.get(partnerId)?.imageUrl;

    // return  item.key && <CartItem checked={checked.get(item.key) || false}
    return (
      <CartItem
        checked={checked.get(item.key, false)}
        onChange={(value) =>
          this.onChangeQty(item.key, item.orderItemId, value)
        }
        onDelete={() => this.removeItem(item.key, item.orderItemId)}
        onChecked={() => this.onChecked(item.key)}
        name={item.title}
        price={item.price}
        image={imageUrl}
        qty={qty.get(item.key, 0)}
      />
    );
  };

  calculate(
    checked: ImmutableMap<string, boolean>,
    qty: ImmutableMap<string, number>,
    section = this.state.section,
  ) {
    // 초기 기동시에는 checked = new Map() 으로 선언되어 있어서
    // checked.get() == undefined를 반환할 수 있다.
    // 따라서, checked.get() 값이 false인 경우(사용자가 명확히 uncheck 한 경우)에만 계산에서 제외한다.

    return section
      .reduce(
        (acc, cur) =>
          acc.concat(
            cur.data.filter((item) => checked.get(item.key) !== false),
          ),
        [] as RkbOrderItem[],
      )
      .map((item) => ({
        qty: qty.get(item.key, 0),
        price: item.price,
      }))
      .reduce(
        (acc, cur) => ({
          cnt: acc.cnt + cur.qty,
          price: {
            value:
              Math.round((acc.price.value + cur.qty * cur.price.value) * 100) /
              100,
            currency: cur.price.currency,
          } as Currency,
        }),
        {cnt: 0, price: utils.toCurrency(0, esimCurrency)},
      );
  }

  registerSimAlert() {
    Alert.alert(i18n.t('reg:ICCID'), i18n.t('reg:noICCID'), [
      {
        text: i18n.t('cancel'),
        // style: 'cancel',
      },
      {
        text: i18n.t('ok'),
        onPress: () => this.props.navigation.navigate('RegisterSim'),
      },
    ]);
  }

  render() {
    const {qty, checked, section, total, showSnackBar} = this.state;
    const {iccid} = this.props.account;
    const dlvCost = this.getDlvCost(checked, qty, total, section);
    const balance = this.props.account.balance || 0;
    const amount = utils.toCurrency(
      total.price.value + dlvCost.value,
      total.price.currency,
    );
    const pymPrice = utils.toCurrency(
      amount.value > balance ? amount.value - balance : 0,
      amount.currency,
    );

    const data = this.props.cart.orderItems?.find(
      (item) =>
        (item.prod || {}).type === 'roaming_product' &&
        this.state.checked.get(item.key),
    );

    return (
      <SafeAreaView style={styles.container}>
        <SectionList
          sections={section}
          renderItem={this.renderItem}
          extraData={[qty, checked]}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={() => this.isEmptyList()}
          ListFooterComponent={
            <ChargeSummary
              totalCnt={total.cnt}
              totalPrice={total.price}
              balance={balance}
              dlvCost={dlvCost}
            />
          }
        />
        <SnackBar
          ref={this.snackRef}
          visible={showSnackBar}
          backgroundColor={colors.clearBlue}
          textMessage={i18n.t('cart:remove')}
          messageColor={colors.white}
          position="top"
          top={windowHeight / 2}
          containerStyle={{borderRadius: 3, height: 48, marginHorizontal: 10}}
          actionText="X"
          actionStyle={{paddingHorizontal: 20}}
          accentColor={colors.white}
          autoHidingTime={timer.snackBarHidingTime}
          onClose={() => this.setState({showSnackBar: false})}
          actionHandler={() => {
            this.snackRef.current?.hideSnackbar();
          }}
        />
        <View style={styles.buttonBox}>
          <View style={styles.sumBox}>
            <Text style={[styles.btnBuyText, {color: colors.black}]}>
              {`${i18n.t('cart:pymAmount')}: `}
            </Text>
            <Text style={[styles.btnBuyText, {color: colors.black}]}>
              {utils.price(pymPrice)}
            </Text>
          </View>
          <AppButton
            style={styles.btnBuy}
            title={`${i18n.t('cart:purchase')} (${total.cnt})`}
            titleStyle={{
              ...appStyles.normal18Text,
              color: colors.white,
              textAlign: 'center',
              margin: 5,
            }}
            checkedColor={colors.white}
            disabled={total.price.value === 0}
            onPress={
              !_.isEmpty(!iccid && data)
                ? this.registerSimAlert
                : this.onPurchase
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, cart, sim, product, status}: RootState) => ({
    lastTab: cart.lastTab.toJS(),
    sim,
    product,
    cart,
    account,
    pending:
      status.pending[cartActions.cartAddAndGet.typePrefix] ||
      status.pending[cartActions.cartUpdateQty.typePrefix] ||
      status.pending[cartActions.cartRemove.typePrefix] ||
      status.pending[cartActions.checkStockAndPurchase.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(CartScreen);
