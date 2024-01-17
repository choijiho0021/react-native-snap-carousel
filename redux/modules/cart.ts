/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {List as ImmutableList} from 'immutable';
import {AnyAction} from 'redux';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import _ from 'underscore';
import {API} from '@/redux/api';
import Env from '@/environment';
import {
  CouponInfo,
  OrderPromo,
  PaymentInfo,
  RkbOrderItem,
} from '@/redux/api/cartApi';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import api from '@/redux/api/api';
import {Currency} from '@/redux/api/productApi';
import {storeData, retrieveData, utils, parseJson} from '@/utils/utils';
import {actions as orderAction} from './order';
import {actions as accountAction} from './account';

const {esimCurrency} = Env.get();

const initCart = createAsyncThunk(
  'cart/initCart',
  async ({mobile}: {mobile?: string}) => {
    const oldData = await retrieveData(`${API.Cart.KEY_INIT_CART}.${mobile}`);
    return oldData;
  },
);

const calculateTotal = createAsyncThunk('cart/calc', API.Cart.calculateTotal);
const cartFetch = createAsyncThunk('cart/fetch', API.Cart.get);
const cartAdd = createAsyncThunk('cart/add', API.Cart.add);
const cartRemove = createAsyncThunk('cart/remove', API.Cart.remove);
const cartCheckStock = createAsyncThunk('cart/checkStock', API.Cart.checkStock);
const getOutOfStockTitle = createAsyncThunk(
  'cart/getOutOfStockTitle',
  API.Cart.getStockTitle,
);
const cartUpdateQty = createAsyncThunk('cart/update', API.Cart.updateQty);

const makeOrder = createAsyncThunk('cart/makeOrder', API.Cart.makeOrder);

const checkStock = createAsyncThunk(
  'cart/checkStock',
  ({purchaseItems}: {purchaseItems: PurchaseItem[]}, {dispatch}) => {
    return purchaseItems[0].type === 'product'
      ? dispatch(cartCheckStock({purchaseItems})).then(({payload: resp}) => {
          if (resp.result === 0) return resp;
          return dispatch(getOutOfStockTitle(resp));
        })
      : Promise.resolve({result: 0});
  },
);

const cartAddAndGet = createAsyncThunk(
  'cart/addAndGet',
  ({purchaseItems}: {purchaseItems: PurchaseItem[]}, {dispatch, getState}) => {
    const {
      account: {token},
    } = getState() as RootState;

    return dispatch(checkStock({purchaseItems}))
      .then(({payload: resp}) => {
        if (resp.result === 0) {
          return dispatch(cartAdd({purchaseItems, token}));
        }
        throw new Error('Soldout');
      })
      .then(({payload: rsp}) => {
        if (rsp.result === 0 && rsp.objects.length > 0) {
          return dispatch(cartFetch());
        }
        throw new Error('Failed to add products');
      })
      .then(({payload}) => payload)
      .catch(() => Promise.resolve({result: api.E_RESOURCE_NOT_FOUND}));
  },
);

const init = createAsyncThunk(
  'cart/init',
  async (param: {mobile?: string}, {dispatch}) => {
    await dispatch(initCart(param));
    await dispatch(cartFetch());
  },
);

const prepareOrder = createAsyncThunk(
  'cart/prepareOrder',
  (coupon: CouponInfo, {getState}) => {
    const {account, cart} = getState() as RootState;
    const {token, iccid, email, mobile} = account;
    const {purchaseItems, orderId, cartId, esimIccid, mainSubsId, isCart} =
      cart;

    return API.Cart.makeOrder({
      orderId: isCart ? cartId : orderId,
      items: purchaseItems,
      token,
      iccid,
      esimIccid,
      mainSubsId,
      user: mobile,
      mail: email,
      coupon,
    });
  },
);

export type PaymentReq = Record<
  'subtotal' | 'discount' | 'rkbcash',
  Currency | undefined
>;

export interface CartModelState {
  // cart data
  cartId?: number;
  cartItems: RkbOrderItem[];
  cartUuid?: string;

  // purchase data
  orderId?: number;
  purchaseItems: PurchaseItem[];
  pymReq?: PaymentReq;
  pymResult?: PaymentInfo;
  lastTab: ImmutableList<string>;
  pymPrice?: Currency; // total amount to pay
  esimIccid?: string;
  mainSubsId?: string;
  promo?: OrderPromo[];
  couponToApply?: string; // selected coupon
  isCart?: boolean; // true if purchased by cart, false if one time purchase
}

const initialState: CartModelState = {
  cartItems: [],
  purchaseItems: [],
  lastTab: ImmutableList<string>(['Home']),
};

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    // set last tab
    // 2개 리스트를 유지한다.
    pushLastTab: (state, action) => {
      const {lastTab} = state;
      if (lastTab.first() !== action.payload) {
        state.lastTab = lastTab.unshift(action.payload).setSize(2);
      }
    },
    // empty cart
    empty: (state) => {
      state.purchaseItems = [];
    },

    // 구매할 품목을 저장한다.
    purchase: (state, {payload}) => {
      const {esimIccid, purchaseItems, mainSubsId, isCart} = payload;

      const subtotal = utils.toCurrency(
        ((purchaseItems as PurchaseItem[]) || []).reduce(
          (acc, cur) => acc + cur.price.value * (cur.qty || 1),
          0,
        ),
        esimCurrency,
      );

      state.esimIccid = esimIccid;
      state.mainSubsId = mainSubsId;
      // purchaseItems에는 key, qty, price, title 정보 필요
      state.purchaseItems = purchaseItems;
      state.pymReq = {subtotal} as PaymentReq;
      state.pymPrice = subtotal;
      state.isCart = isCart;
    },

    // 결제 결과를 저장한다.
    pymResult: (state, action) => {
      const {purchaseItems, cartItems} = state;

      // orderItems에서 purchaseItem에 포함된 상품은 모두 제거한다.
      state.pymResult = action.payload;
      state.cartItems = cartItems.filter(
        (item) => purchaseItems.findIndex((p) => p.key === item.key) < 0,
      );
    },

    applyCoupon: (state, action) => {
      state.couponToApply = action.payload;

      // couponToApply == undefined 이면, discount도 undefined로 설정된다.
      const promo = state.promo?.find(
        (p) => p.coupon_id === state.couponToApply,
      );

      state.pymReq = {
        ...state.pymReq,
        discount: promo?.adj,
      };

      state.pymPrice = utils.toCurrency(
        (state.pymReq?.subtotal?.value || 0) +
          (state.pymReq?.discount?.value || 0) -
          (state.pymReq?.rkbcash?.value || 0),
        esimCurrency,
      );
    },

    deductRokebiCash: (state, action) => {
      const cash = action.payload;
      if (_.isNumber(cash)) {
        const total =
          (state.pymReq?.subtotal?.value || 0) +
          (state.pymReq?.discount?.value || 0);

        const min = Math.min(cash, total);

        state.pymReq = {
          ...state.pymReq,
          rkbcash: utils.toCurrency(min, esimCurrency),
        };

        state.pymPrice = utils.toCurrency(
          total - (state.pymReq?.rkbcash?.value || 0),
          esimCurrency,
        );
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(initCart.fulfilled, (state, {payload}) => {
      if (payload) {
        const obj = parseJson(payload);
        state.cartId = obj[0].orderId;
        state.cartItems = obj[0].orderItems.filter(
          (i) => i.type === 'esim_product',
        );
        state.cartUuid = obj[0].uuid;
      }
    });

    builder.addCase(cartFetch.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (objects) {
        storeData(
          `${API.Cart.KEY_INIT_CART}.${action?.meta?.arg?.mobile}`,
          JSON.stringify(objects),
        );
      }

      if (result === 0 && objects.length > 0) {
        state.cartId = objects[0].orderId;
        state.cartItems = objects[0].orderItems.filter(
          (i) => i.type === 'esim_product',
        );
        state.cartUuid = objects[0].uuid;
      } else {
        state.cartId = undefined;
        state.cartItems = [];
        state.cartUuid = undefined;
      }
    });

    // onfailure ->api 실패
    // onsuccess
    builder.addCase(cartAdd.rejected, (state) => {
      state.result = API.default.FAILED;
    });

    builder.addCase(cartAdd.fulfilled, (state, action) => {
      state.result = action.payload;
    });

    builder.addCase(cartRemove.fulfilled, (state, action) => {
      const {result, objects = []} = action.payload;
      const {cartId, cartItems} = state;

      if (result === 0 && objects.length > 0 && objects[0].orderId === cartId) {
        state.cartItems = cartItems.filter(
          (item) => item.orderItemId !== objects[0].orderItemId,
        );
      }
    });

    builder.addCase(cartUpdateQty.fulfilled, (state, action) => {
      const {result, objects = []} = action.payload;
      const {cartId} = state;

      if (result === 0 && objects.length > 0 && objects[0].orderId === cartId) {
        state.cartItems = objects[0].orderItems.filter(
          (i) => i.type === 'esim_product',
        );
      }
    });

    // builder.addCase(cartUpdate.fulfilled, onSuccess);
    // onCancel: (state) => {
    //   return state;
    // },

    builder.addCase(makeOrder.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0) {
        // update orderId
        state.orderId = objects[0]?.order_id;
      }
    });

    builder.addCase(prepareOrder.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects[0]) {
        state.orderId = objects[0].order_id;
        state.promo = objects[0].promo;
        state.couponToApply = state.promo?.reduce((acc, cur) => {
          if (!acc || cur.adj?.value < acc.adj?.value) return cur;
          return acc;
        }, undefined)?.coupon_id;

        // couponToApply == undefined 이면, discount도 undefined로 설정된다.
        const promo = state.promo?.find(
          (p) => p.coupon_id === state.couponToApply,
        );

        state.pymReq = {
          ...state.pymReq,
          discount: promo?.adj,
        };

        state.pymPrice = utils.toCurrency(
          (state.pymReq?.subtotal?.value || 0) +
            (state.pymReq?.discount?.value || 0) -
            (state.pymReq?.rkbcash?.value || 0),
          esimCurrency,
        );
      }
    });
  },
});

const checkStockAndMakeOrder = createAsyncThunk(
  'cart/checkStockAndMakeOrder',
  (info: PaymentInfo, {dispatch, getState}) => {
    const {account, cart} = getState() as RootState;
    const {token, iccid, email, mobile} = account;
    const {purchaseItems, cartId, orderId, esimIccid, mainSubsId, isCart} =
      cart;
    const coupon = cart.couponToApply
      ? ({id: [cart.couponToApply]} as CouponInfo)
      : undefined;

    // make order in the server
    // TODO : purchaseItem에 orderable, recharge가 섞여 있는 경우 문제가 될 수 있음
    return dispatch(checkStock({purchaseItems}))
      .then(({payload: res}) => {
        if (res.result === 0) {
          // 충전, 구매 모두 order 생성
          return dispatch(
            makeOrder({
              orderId: isCart ? cartId : orderId,
              items: purchaseItems,
              info,
              token,
              iccid,
              esimIccid,
              mainSubsId,
              user: mobile,
              mail: email,
              coupon,
            }),
          )
            .then((rsp) => {
              dispatch(slice.actions.purchase({purchaseItems}));
              return rsp.payload;
            })
            .catch((err) => {
              console.log('@@@ failed to make order', err);
              return Promise.resolve({result: api.E_INVALID_STATUS});
            });
        }
        return Promise.resolve({result: api.E_RESOURCE_NOT_FOUND});
      })
      .catch(() => {
        console.log('@@@ failed to check stock');
        return Promise.resolve({result: api.E_INVALID_STATUS});
      });
  },
);

const updateOrder = createAsyncThunk(
  'cart/updateOrder',
  (info: PaymentInfo, {dispatch, getState}) => {
    const {account, cart} = getState() as RootState;
    const {token, iccid, mobile} = account;
    // remove ordered items from the cart
    const {purchaseItems} = cart;

    dispatch(orderAction.getOrders({user: mobile, token, page: 0}));

    if (
      purchaseItems.find((item) => item.type === 'rch') ||
      info.rokebi_cash > 0
    ) {
      // 충전을 한 경우에는 account를 다시 읽어들인다.
      // balance에서 차감한 경우에도 다시 읽어들인다.
      // webhook에 의한 서버 처리 시간을 고려해서 5초후에 처리하는 걸로 변경함
      setTimeout(
        () => dispatch(accountAction.getAccount({iccid, token})),
        5000,
      );
    }

    // return cart state
    return dispatch(cartFetch());
  },
);

const payNorder = createAsyncThunk(
  'cart/payNorder',
  (info: PaymentInfo, {dispatch}) => {
    // update payment result
    dispatch(slice.actions.pymResult(info));

    // remove ordered items from the cart

    // make order in the server
    // TODO : purchaseItem에 orderable, recharge가 섞여 있는 경우 문제가 될 수 있음
    return dispatch(checkStockAndMakeOrder(info)).then(({payload: resp}) => {
      dispatch(updateOrder(info));
      return resp;
    });
  },
);

// 재고 확인 후 구매
// 이후 결제 과정을 거친다.
const checkStockAndPurchase = createAsyncThunk(
  'cart/checkStockAndPurchase',
  (
    {purchaseItems, isCart}: {purchaseItems: PurchaseItem[]; isCart: boolean},
    {dispatch},
  ) => {
    return dispatch(checkStock({purchaseItems})).then(({payload: resp}) => {
      if (resp.result === 0) {
        dispatch(slice.actions.purchase({purchaseItems, isCart}));
      }
      // 처리 결과는 reducer에 보내서 처리하지만, 결과는 resp를 반환한다.
      return resp;
    });
  },
);
/*
export default handleActions(
  {
    [`${CART_UPDATE}_CANCEL`]: (state, action) => {
      if (action.meta.abortController) action.meta.abortController.abort();
      return state;
    },
  },
  initialState,
);

*/

const makeEmpty = createAsyncThunk(
  'cart/empty',
  (params: {orderId: number; token: string}, {dispatch}) => {
    // dispatch(cartLock(params));
    dispatch(slice.actions.empty());
  },
);

export const actions = {
  ...slice.actions,
  cartFetch,
  cartUpdateQty,
  cartRemove,
  payNorder,
  cartAddAndGet,
  checkStockAndPurchase,
  init,
  initCart,
  checkStockAndMakeOrder,
  prepareOrder,
  updateOrder,
  makeEmpty,
  calculateTotal,
};
export type CartAction = typeof actions;

export default slice.reducer as Reducer<CartModelState, AnyAction>;
