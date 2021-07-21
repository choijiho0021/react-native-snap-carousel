/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {List as ImmutableList} from 'immutable';
import {AnyAction} from 'redux';
import {API} from '@/submodules/rokebi-utils';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import Env from '@/environment';
import {RkbOrderItem} from '@/submodules/rokebi-utils/api/cartApi';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {PurchaseItem} from '@/submodules/rokebi-utils/models/purchaseItem';
import {PaymentResult} from '@/submodules/rokebi-utils/models/paymentResult';
import {getOrders} from './order';
import {getAccount} from './account';

const {esimApp} = Env.get();

export const cartFetch = createAsyncThunk('cart/fetch', API.Cart.get);
export const cartAdd = createAsyncThunk('cart/add', API.Cart.add);
export const cartRemove = createAsyncThunk('cart/remove', API.Cart.remove);
const cartCheckStock = createAsyncThunk('cart/checkStock', API.Cart.checkStock);
const getOutOfStockTitle = createAsyncThunk(
  'cart/getOutOfStockTitle',
  API.Cart.getStockTitle,
);
export const cartUpdateQty = createAsyncThunk(
  'cart/update',
  API.Cart.updateQty,
);

export const makeOrder = createAsyncThunk('cart/makeOrder', API.Cart.makeOrder);
export const rechargeAccount = createAsyncThunk(
  'cart/rechargeAccount',
  API.Recharge.add,
);

const checkStock = createAsyncThunk(
  'cart/checkStock',
  ({purchaseItems}: {purchaseItems: PurchaseItem[]}, {dispatch, getState}) => {
    const {
      account: {token},
    } = getState() as RootState;

    return esimApp
      ? dispatch(cartCheckStock({purchaseItems, token})).then(
          ({payload: resp}) => {
            if (resp.result === 0) return resp;
            return dispatch(getOutOfStockTitle(resp));
          },
        )
      : Promise.resolve({result: 0});
  },
);

export const cartAddAndGet = createAsyncThunk(
  'cart/addAndGet',
  (purchaseItems: PurchaseItem[], {dispatch}) => {
    return dispatch(checkStock({purchaseItems})).then((resp) => {
      if (resp.result === 0) {
        return dispatch(cartAdd({purchaseItems})).then(
          (rsp) => {
            if (rsp.result === 0 && rsp.objects.length > 0) {
              return dispatch(cartFetch());
            }
            throw new Error('Failed to add products');
          },
          (err) => {
            throw err;
          },
        );
      }
      return resp;
    });
  },
);

export type PaymentReq = {key: string; title: string; amount: number};

export interface CartModelState {
  result: number;
  orderId?: number;
  orderItems: RkbOrderItem[];
  uuid?: string;
  purchaseItems: PurchaseItem[];
  pymReq?: PaymentReq[];
  pymResult?: object;
  lastTab: ImmutableList<string>;
  pymPrice?: number;
  deduct?: number;
}

const onSuccess = (state, action) => {
  const {result, objects} = action.payload;
  state.result = result;
  if (result === 0 && objects.length > 0) {
    state.orderId = objects[0].orderId;
    state.orderItems = objects[0].orderItems;
    state.uuid = objects[0].uuid;
  }
};

const initialState: CartModelState = {
  result: 0,
  orderId: undefined,
  orderItems: [],
  uuid: undefined,
  purchaseItems: [],
  pymReq: undefined,
  pymResult: undefined,
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
    purchase: (state, action) => {
      const {purchaseItems, dlvCost = false, balance = 0} = action.payload;
      const total = (purchaseItems || []).reduce(
        (sum, acc) => sum + acc.price * (acc.qty || 1),
        0,
      );
      const pymReq = [
        {
          key: 'total',
          title: i18n.t('price'),
          amount: total,
        },
      ];

      if (dlvCost)
        pymReq.push({
          key: 'dlvCost',
          title: i18n.t('cart:dlvCost'),
          amount: utils.dlvCost(total),
        });

      // 배송비 포함 상품 합계
      const totalPrice = total + (dlvCost && utils.dlvCost(total));
      // 계산해야하는 총액
      // 잔액 차감

      // purchaseItems에는 key, qty, price, title 정보 필요
      state.purchaseItems = purchaseItems;
      state.pymReq = pymReq;
      state.pymPrice = totalPrice > balance ? totalPrice - balance : 0;
      state.deduct = totalPrice > balance ? balance : totalPrice;
    },

    // 결제 결과를 저장한다.
    pymResult: (state, action) => {
      const {purchaseItems, orderItems} = state;

      // orderItems에서 purchaseItem에 포함된 상품은 모두 제거한다.
      state.pymResult = action.payload;
      state.orderItems = orderItems.filter(
        (item) => purchaseItems.findIndex((p) => p.key === item.key) < 0,
      );
    },
  },

  extraReducers: (builder) => {
    builder.addCase(cartFetch.fulfilled, onSuccess);

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
      const {orderId, orderItems} = state;
      if (
        result === 0 &&
        objects.length > 0 &&
        objects[0].orderId === orderId
      ) {
        state.orderItems = orderItems.filter(
          (item) => item.orderItemId !== objects[0].orderItemId,
        );
      }
    });

    // builder.addCase(cartUpdate.fulfilled, onSuccess);
    // onCancel: (state) => {
    //   return state;
    // },

    builder.addCase(makeOrder.fulfilled, onSuccess);

    builder.addCase(rechargeAccount.fulfilled, onSuccess);
  },
});

export const payNorder = createAsyncThunk(
  'cart/payNorder',
  (result: PaymentResult, {dispatch, getState}) => {
    const {account, cart} = getState() as RootState;
    const {token, iccid, email, mobile} = account;

    // update payment result
    dispatch(slice.actions.pymResult(result));

    // remove ordered items from the cart
    const {orderId, orderItems, purchaseItems} = cart;

    // make order in the server
    // TODO : purchaseItem에 orderable, recharge가 섞여 있는 경우 문제가 될 수 있음
    return dispatch(checkStock({purchaseItems})).then(({payload: res}) => {
      if (res.result === 0) {
        return dispatch(
          makeOrder({
            items: purchaseItems,
            result,
            token,
            iccid,
            user: mobile,
            mail: email,
          }),
        ).then((resp) => {
          if (resp.result === 0) {
            dispatch(getOrders({user: mobile, token, page: 0}));
            // cart에서 item 삭제
            orderItems.forEach((item) => {
              if (
                purchaseItems.find((o) => o.orderItemId === item.orderItemId)
              ) {
                // remove ordered item
                dispatch(cartRemove({orderId, orderItemId: item.orderItemId}));
              }
            });

            if (
              purchaseItems.find((item) => item.type === 'rch') ||
              result.rokebi_cash > 0
            ) {
              // 충전을 한 경우에는 account를 다시 읽어들인다.
              // balance에서 차감한 경우에도 다시 읽어들인다.
              return dispatch(getAccount({iccid, token}));
            }
          }
          return resp;
        });
      }
      return res;
    });
  },
);

export const checkStockAndPurchase = createAsyncThunk(
  'cart/checkStockAndPurchase',
  (
    {
      purchaseItems,
      balance,
      dlvCost = false,
    }: {purchaseItems: PurchaseItem[]; balance?: number; dlvCost?: boolean},
    {dispatch},
  ) => {
    return dispatch(checkStock({purchaseItems})).then(({payload: resp}) => {
      console.log('@@@ check stock', resp);
      if (resp.result === 0) {
        dispatch(slice.actions.purchase({purchaseItems, dlvCost, balance}));
      }
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

export const actions = {
  ...slice.actions,
  cartFetch,
  cartUpdateQty,
  cartRemove,
  payNorder,
  cartAddAndGet,
  checkStockAndPurchase,
};
export type CartAction = typeof actions;

export default slice.reducer as Reducer<CartModelState, AnyAction>;
