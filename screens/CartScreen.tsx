import {useFocusEffect, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Map as ImmutableMap} from 'immutable';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import CartItem from '@/components/CartItem';
import ChargeSummary from '@/components/ChargeSummary';
import {colors} from '@/constants/Colors';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
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
  checkAndLoadProdList,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import ChatTalk from '@/components/ChatTalk';
import ScreenHeader from '@/components/ScreenHeader';
import ButtonWithPrice from './EsimScreen/components/ButtonWithPrice';
import AppStyledText from '@/components/AppStyledText';
import {appStyles} from '@/constants/Styles';

const {esimCurrency, isIOS} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
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
  route: RouteProp<HomeStackParamList, 'Cart'>;

  cart: CartModelState;
  account: AccountModelState;
  product: ProductModelState;
  pending: boolean;

  action: {
    cart: CartAction;
    product: ProductAction;
  };
};

const CartScreen: React.FC<CartScreenProps> = ({
  navigation,
  route,
  cart: {cartId, cartItems},
  account: {loggedIn},
  product: {prodList, localOpList},
  action,
}) => {
  const [list, setList] = useState<RkbOrderItem[]>([]);
  const [checked, setChecked] = useState(ImmutableMap<string, boolean>());
  const [qty, setQty] = useState(ImmutableMap<string, number>());
  const [total, setTotal] = useState({
    cnt: 0,
    price: utils.toCurrency(0, esimCurrency),
  });
  const loading = useRef(false);
  const dispatch = useDispatch();

  const tabBarHeight = useBottomTabBarHeight();

  const disablePurchase = useMemo(
    () => total.price.value === 0,
    [total.price.value],
  );

  useEffect(() => {
    if (checked.size > 0) action.cart.saveChecked({checked});
  }, [action.cart, checked]);

  const onChecked = useCallback((key: string) => {
    setChecked((prev) => prev.update(key, (v) => !v));
  }, []);

  const onPurchase = useCallback(() => {
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
              type: item.type === 'esim_product' ? 'product' : item.type,
            } as PurchaseItem),
        );

      action.cart
        .dispatchPurchase({purchaseItems, isCart: true})
        .then(() => navigation.navigate('PymMethod', {mode: 'cart'}));
    }
  }, [action.cart, checked, list, loggedIn, navigation, qty]);

  const onChangeQty = useCallback(
    (key: string, orderItemId: number, cnt: number) => {
      if (cnt > 0 && cnt <= 10) {
        setQty((prev) => prev.set(key, cnt));
        setChecked((prev) => prev.set(key, true));

        if (orderItemId && cartId) {
          action.cart.cartUpdateQty({
            orderId: cartId,
            orderItemId,
            qty: cnt,
          });
        }
      }
    },
    [action.cart, cartId],
  );

  const empty = useCallback(
    () => (
      <SafeAreaView style={styles.container}>
        {route?.params?.showHeader && <ScreenHeader title={i18n.t('cart')} />}
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
          <ChatTalk visible bottom={(isIOS ? 100 : 70) - tabBarHeight} />
        </View>
      </SafeAreaView>
    ),
    [route?.params?.showHeader, tabBarHeight],
  );

  const removeItem = useCallback(
    (key: string, orderItemId: number) => {
      setList((prev) => prev?.filter((i) => i.orderItemId !== orderItemId));
      setChecked((prev) => prev.remove(key));
      setQty((prev) => prev.remove(key));

      if (orderItemId && cartId) {
        action.cart.cartRemove({
          orderId: cartId,
          orderItemId,
        });
      }
    },
    [action.cart, cartId],
  );

  const renderItem = useCallback(
    ({item}: {item: RkbOrderItem}) => {
      const partnerId = prodList.get(item.key)?.partnerId;

      const imageUrl = partnerId && localOpList.get(partnerId)?.imageUrl;

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
    [checked, localOpList, onChangeQty, onChecked, prodList, qty, removeItem],
  );

  useEffect(() => {
    setList(cartItems);
    setQty((prev) =>
      cartItems.reduce((acc, cur) => acc.set(cur.key, cur.qty), prev),
    );

    // checked 읽기
    if (cartItems && checked.size === 0) {
      setChecked((prev) =>
        cartItems.reduce(
          (acc, cur) => acc.update(cur.key, (v: any) => cur.checked),
          prev,
        ),
      );
    }

    checkAndLoadProdList(loading, cartItems, prodList, dispatch);
  }, [cartItems, checked.size, dispatch, prodList]);

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

  const pymPrice = useMemo(() => {
    const amount = total
      ? utils.toCurrency(total.price.value, total.price.currency)
      : ({value: 0, currency: 'KRW'} as Currency);
    return utils.toCurrency(amount.value, amount.currency);
  }, [total]);

  const priceTitle = useCallback(
    () => (
      <AppStyledText
        text={i18n.t('cart:purchase', {cnt: total.cnt})}
        textStyle={{
          ...appStyles.normal18Text,
          color: colors.white,
          textAlign: 'center',
          margin: 5,
        }}
        format={{b: {...appStyles.bold18Text, color: colors.white}}}
      />
    ),
    [total.cnt],
  );

  return _.isEmpty(list) ? (
    empty()
  ) : (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={i18n.t('cart')} />
      <FlatList
        data={list}
        renderItem={renderItem}
        extraData={[qty, checked]}
        ListFooterComponent={
          <ChargeSummary totalCnt={total.cnt} totalPrice={total.price} />
        }
      />
      <ButtonWithPrice
        amount={String(pymPrice.value) || '0'}
        currency={i18n.t('esim:charge:addOn:currency')}
        onPress={onPurchase}
        disable={disablePurchase}
        title={priceTitle()}
      />
      <ChatTalk visible bottom={(isIOS ? 100 : 70) - tabBarHeight} />
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
      false,
  }),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(CartScreen);
