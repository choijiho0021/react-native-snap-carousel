import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Map as ImmutableMap} from 'immutable';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, SafeAreaView, SectionList, StyleSheet, View} from 'react-native';
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
import {ProductModelState} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import {actions as simActions, SimAction} from '@/redux/modules/sim';

const {esimCurrency} = Env.get();
const sectionTitle = ['sim', 'product'];

const styles = StyleSheet.create({
  sumBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // marginHorizontal: 30,
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
    borderTopColor: colors.lightGrey,
    borderTopWidth: 1,
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
    sim: SimAction;
  };
};

type ItemTotal = {cnt: number; price: Currency};
type ItemSection = {data: RkbOrderItem[]; title: string};

const CartScreen: React.FC<CartScreenProps> = (props) => {
  const {navigation, route, cart, account, product, pending, action} = props;
  const [section, setSection] = useState<ItemSection[]>([]);
  const [checked, setChecked] = useState(ImmutableMap<string, boolean>());
  const [qty, setQty] = useState(ImmutableMap<string, number>());
  const [total, setTotal] = useState({
    cnt: 0,
    price: utils.toCurrency(0, esimCurrency),
  });
  const [showSnackBar, setShowSnackbar] = useState(false);

  const onChecked = useCallback((key: string) => {
    setChecked((prev) => prev.update(key, (v) => !v));
  }, []);

  const getDlvCost = useCallback(
    (
      chk: ImmutableMap<string, boolean>,
      qt: ImmutableMap<string, number>,
      tot: ItemTotal,
      sec: ItemSection[],
    ) => {
      const simList = sec?.find((item) => item.title === 'sim');
      return simList &&
        simList.data.findIndex(
          (item) => chk.get(item.key) && (qt.get(item.key) || 0) > 0,
        ) >= 0
        ? utils.dlvCost(tot.price)
        : utils.toCurrency(0, tot?.price.currency);
    },
    [],
  );

  const onPurchase = useCallback(() => {
    const dlvCost = getDlvCost(checked, qty, total, section);
    const {loggedIn, balance} = account;

    if (!loggedIn) {
      navigation.navigate('Auth');
    } else {
      const purchaseItems = section
        ?.reduce(
          (acc, cur) =>
            acc.concat(
              cur.data?.filter(
                (item) => checked.get(item.key) && qty.get(item.key, 0) > 0,
              ),
            ),
          [] as RkbOrderItem[],
        )
        ?.map(
          (item) =>
            ({
              ...item,
              sku: item.prod.sku,
              variationId: item.prod.variationId,
              qty: qty.get(item.key),
            } as PurchaseItem),
        );

      // 충전구매 sim data제거
      action.sim.init();

      action.cart
        .checkStockAndPurchase({
          purchaseItems,
          balance,
          dlvCost: dlvCost.value > 0,
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
  }, [
    account,
    action.cart,
    action.sim,
    checked,
    getDlvCost,
    navigation,
    qty,
    section,
    total,
  ]);

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

  const sim = useCallback(() => {
    return cart.orderItems
      ?.filter(
        (item) =>
          item.prod.type === 'sim_card' &&
          checked.get(item.key) &&
          qty.get(item.key),
      )
      ?.map((item) => item.totalPrice)
      ?.reduce(
        (acc, cur) => utils.toCurrency(acc.value + cur.value, cur.currency),
        utils.toCurrency(0, 'KRW'),
      );
  }, [cart.orderItems, checked, qty]);

  const removeItem = useCallback(
    (key: string, orderItemId: number) => {
      setSection((prev) =>
        prev?.map((item) => ({
          title: item.title,
          data: item.data?.filter((i) => i.orderItemId !== orderItemId),
        })),
      );

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

  const checkDeletedItem = useCallback(
    (items: RkbOrderItem[]) => {
      const {prodList} = product;
      const toRemove = (items || []).filter(
        (item) => typeof prodList.get(item.key) === 'undefined',
      );

      if (!_.isEmpty(toRemove)) {
        toRemove.forEach((item) => removeItem(item.key, item.orderItemId));
        setShowSnackbar(true);
      }
    },
    [product, removeItem],
  );

  const renderItem = useCallback(
    ({item}: {item: RkbOrderItem}) => {
      const partnerId = product.prodList.get(item.key)?.partnerId;
      const imageUrl =
        partnerId && product.localOpList.get(partnerId)?.imageUrl;

      // return  item.key && <CartItem checked={checked.get(item.key) || false}
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
    [
      checked,
      onChangeQty,
      onChecked,
      product.localOpList,
      product.prodList,
      qty,
      removeItem,
    ],
  );

  const registerSimAlert = useCallback(() => {
    Alert.alert(i18n.t('reg:ICCID'), i18n.t('reg:noICCID'), [
      {
        text: i18n.t('cancel'),
        // style: 'cancel',
      },
      {
        text: i18n.t('ok'),
        onPress: () => navigation.navigate('RegisterSim'),
      },
    ]);
  }, [navigation]);

  const init = useCallback(() => {
    const {orderItems} = cart;

    checkDeletedItem(orderItems);

    const list = orderItems?.reduce(
      (acc, cur) => {
        return cur.type === 'sim_card'
          ? [acc[0].concat(cur), acc[1]]
          : [acc[0], acc[1].concat(cur)];
      },
      [[] as RkbOrderItem[], [] as RkbOrderItem[]],
    );

    setSection(
      list
        ?.map((item, idx) => ({
          title: sectionTitle[idx],
          data: item,
        }))
        ?.filter((item) => item.data.length > 0),
    );
    setQty((prev) =>
      orderItems.reduce((acc, cur) => acc.set(cur.key, cur.qty), prev),
    );
    setChecked((prev) =>
      orderItems.reduce(
        (acc, cur) => acc.update(cur.key, (v) => (v === undefined ? true : v)),
        prev,
      ),
    );
  }, [cart, checkDeletedItem]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('cart')} />,
    });

    init();
  }, [init, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      action.cart.cartFetch();
    }, [action.cart]),
  );

  useEffect(() => {
    if (cart?.orderItems && !pending) {
      init();
    }
  }, [cart?.orderItems, init, pending]);

  useEffect(() => {
    // 초기 기동시에는 checked = new Map() 으로 선언되어 있어서
    // checked.get() == undefined를 반환할 수 있다.
    // 따라서, checked.get() 값이 false인 경우(사용자가 명확히 uncheck 한 경우)에만 계산에서 제외한다.

    const tot = section
      ?.reduce(
        (acc, cur) =>
          acc.concat(
            cur.data?.filter((item) => checked.get(item.key) !== false),
          ),
        [] as RkbOrderItem[],
      )
      ?.map((item) => ({
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
  }, [checked, qty, section]);

  const dlvCost = useMemo(
    () => getDlvCost(checked, qty, total, section),
    [checked, getDlvCost, qty, section, total],
  );
  const balance = useMemo(() => account.balance || 0, [account.balance]);
  const pymPrice = useMemo(() => {
    const amount = total
      ? utils.toCurrency(
          total.price.value + dlvCost.value,
          total.price.currency,
        )
      : ({value: 0, currency: 'KRW'} as Currency);
    return utils.toCurrency(
      amount.value > balance ? amount.value - balance : 0,
      amount.currency,
    );
  }, [balance, dlvCost.value, total]);

  const data = useMemo(
    () =>
      cart.orderItems?.find(
        (item) =>
          (item.prod || {}).type === 'roaming_product' && checked.get(item.key),
      ),
    [cart.orderItems, checked],
  );

  return _.isEmpty(section) ? (
    empty()
  ) : (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={section}
        renderItem={renderItem}
        extraData={[qty, checked]}
        stickySectionHeadersEnabled={false}
        ListFooterComponent={
          <ChargeSummary
            totalCnt={total.cnt}
            totalPrice={total.price}
            balance={balance}
            dlvCost={dlvCost}
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
          onPress={
            !_.isEmpty(!account.iccid && data) ? registerSimAlert : onPurchase
          }
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
      sim: bindActionCreators(simActions, dispatch),
    },
  }),
)(CartScreen);
