import {useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Map as ImmutableMap} from 'immutable';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppSnackBar from '@/components/AppSnackBar';
import AppText from '@/components/AppText';
import CartItem from '@/components/CartItem';
import ChargeSummary from '@/components/ChargeSummary';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import api from '@/redux/api/api';
import {RkbOrderItem} from '@/redux/api/cartApi';
import {Currency} from '@/redux/api/productApi';
import utils from '@/redux/api/utils';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as cartActions,
  CartAction,
  CartModelState,
} from '@/redux/modules/cart';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';

const {esimCurrency} = Env.get();

const styles = StyleSheet.create({
  sumBox: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: colors.lightGrey,
    borderTopWidth: 1,
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
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 52,
  },
  emptyView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emptyText: {
    textAlign: 'center',
  },
});

type CartScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Cart'>;

type CartScreenProps = {
  navigation: CartScreenNavigationProp;

  cart: CartModelState;
  account: AccountModelState;
  product: ProductModelState;
  pending: boolean;

  action: {
    cart: CartAction;
    product: ProductAction;
  };
};

const CartScreen: React.FC<CartScreenProps> = (props) => {
  const {navigation, cart, account, product, pending, action} = props;
  const [list, setList] = useState<RkbOrderItem[]>([]);
  const [checked, setChecked] = useState(ImmutableMap<string, boolean>());
  const [qty, setQty] = useState(ImmutableMap<string, number>());
  const [total, setTotal] = useState({
    cnt: 0,
    price: utils.toCurrency(0, esimCurrency),
  });
  const [showSnackBar, setShowSnackbar] = useState(false);
  const loading = useRef(false);

  const onChecked = useCallback((key: string) => {
    setChecked((prev) => prev.update(key, (v) => !v));
  }, []);

  const onPurchase = useCallback(() => {
    const {loggedIn, balance} = account;

    if (!loggedIn) {
      navigation.navigate('Auth');
    } else {
      const purchaseItems = list
        .filter((item) => checked.get(item.key) && qty.get(item.key, 0) > 0)
        .map(
          (item) =>
            ({
              ...item,
              sku: item.prod.sku,
              variationId: item.prod.variationId,
              qty: qty.get(item.key),
            } as PurchaseItem),
        );

      action.cart
        .checkStockAndPurchase({
          purchaseItems,
          balance,
          dlvCost: false,
        })
        .then(({payload: resp}) => {
          if (resp.result === 0) {
            navigation.navigate('PymMethod', {mode: 'cart'});
          } else if (resp.result === api.E_RESOURCE_NOT_FOUND)
            AppAlert.info(`${resp.title} ${i18n.t('cart:soldOut')}`);
          else AppAlert.info(i18n.t('cart:systemError'));
        })
        .catch((err) => {
          console.log('failed to check stock', err);
        });
    }
  }, [account, action.cart, checked, list, navigation, qty]);

  const onChangeQty = useCallback(
    (key: string, orderItemId: number, cnt: number) => {
      setQty((prev) => prev.set(key, cnt));
      setChecked((prev) => prev.set(key, true));

      const {orderId} = cart;
      if (orderItemId && orderId) {
        action.cart.cartUpdateQty({
          orderId,
          orderItemId,
          qty: cnt,
          abortController: new AbortController(),
        });
      }
    },
    [action.cart, cart],
  );

  const empty = useCallback(
    () => (
      <View style={styles.emptyView}>
        <AppIcon name="emptyCart" />
        <View style={{marginTop: 20}}>
          <AppText style={[styles.emptyText, {color: colors.clearBlue}]}>
            {i18n.t('cart:empty1')}
          </AppText>
          <AppText style={[styles.emptyText, {color: colors.warmGrey}]}>
            {i18n.t('cart:empty2')}
          </AppText>
        </View>
      </View>
    ),
    [],
  );

  const removeItem = useCallback(
    (key: string, orderItemId: number) => {
      setList((prev) => prev?.filter((i) => i.orderItemId !== orderItemId));
      setChecked((prev) => prev.remove(key));
      setQty((prev) => prev.remove(key));

      const {orderId} = cart;
      if (orderItemId && orderId) {
        action.cart.cartRemove({
          orderId,
          orderItemId,
        });
      }
    },
    [action.cart, cart],
  );

  const renderItem = useCallback(
    ({item}: {item: RkbOrderItem}) => {
      const partnerId = product.prodList.get(item.key)?.partnerId;

      const imageUrl =
        partnerId && product.localOpList.get(partnerId)?.imageUrl;

      return (
        <CartItem
          checked={checked.get(item.key, false)}
          onChange={(value) => onChangeQty(item.key, item.orderItemId, value)}
          onDelete={() => removeItem(item.key, item.orderItemId)}
          onChecked={() => onChecked(item.key)}
          name={item.title}
          price={item.price}
          image={imageUrl}
          qty={qty.get(item.key, 0)}
        />
      );
    },
    [checked, onChangeQty, onChecked, product, qty, removeItem],
  );

  useEffect(() => {
    const {orderItems} = cart;

    setList(orderItems);
    setQty((prev) =>
      orderItems.reduce((acc, cur) => acc.set(cur.key, cur.qty), prev),
    );
    setChecked((prev) =>
      orderItems.reduce(
        (acc, cur) => acc.update(cur.key, (v) => (v === undefined ? true : v)),
        prev,
      ),
    );

    if (!loading.current) {
      orderItems.forEach((i) => {
        if (!product.prodList.has(i.key)) {
          // action.product.getProdBySku(i.prod.sku);
          console.log('@@@ i.prod.uuid', i.prod.uuid);
          action.product.getProdByUuid(i.prod.uuid);
          loading.current = true;
        }
      });
    }
  }, [action.product, cart, product.prodList]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('cart')} />,
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      action.cart.cartFetch();
      loading.current = false;
    }, [action.cart]),
  );

  useEffect(() => {
    // 초기 기동시에는 checked = new Map() 으로 선언되어 있어서
    // checked.get() == undefined를 반환할 수 있다.
    // 따라서, checked.get() 값이 false인 경우(사용자가 명확히 uncheck 한 경우)에만 계산에서 제외한다.

    const tot = list
      .filter((item) => checked.get(item.key) !== false)
      .map((item) => ({
        qty: qty.get(item.key, 0),
        price: item.price,
      }))
      ?.reduce(
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

    setTotal(tot);
  }, [checked, list, qty]);

  const balance = useMemo(() => account.balance || 0, [account.balance]);
  const pymPrice = useMemo(() => {
    const amount = total
      ? utils.toCurrency(total.price.value, total.price.currency)
      : ({value: 0, currency: 'KRW'} as Currency);
    return utils.toCurrency(
      amount.value > balance ? amount.value - balance : 0,
      amount.currency,
    );
  }, [balance, total]);

  return _.isEmpty(list) ? (
    empty()
  ) : (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={list}
        renderItem={renderItem}
        extraData={[qty, checked]}
        ListFooterComponent={
          <ChargeSummary
            totalCnt={total.cnt}
            totalPrice={total.price}
            balance={balance}
          />
        }
      />
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('cart:remove')}
      />
      <View style={styles.buttonBox}>
        <View style={styles.sumBox}>
          <AppText style={[styles.btnBuyText, {color: colors.black}]}>
            {`${i18n.t('cart:pymAmount')}: `}
          </AppText>
          <AppText style={[styles.btnBuyText, {color: colors.black}]}>
            {utils.price(pymPrice)}
          </AppText>
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
          type="primary"
          checkedColor={colors.white}
          disabled={total.price.value === 0}
          onPress={onPurchase}
        />
      </View>
    </SafeAreaView>
  );
};

export default connect(
  ({account, cart, product, status}: RootState) => ({
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
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(CartScreen);
