/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import _ from 'underscore';
import {API} from '@/submodules/rokebi-utils';
import {reflectWithToast} from '@/utils/utils';
import {RkbOrder} from '@/submodules/rokebi-utils/api/orderApi';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RkbSubscription} from '@/submodules/rokebi-utils/api/subscriptionApi';
import {AccountAuth, getAccount} from './account';
import {AppThunk} from '..';

export const GET_ORDERS = 'rokebi/order/GET_ORDERS';
export const GET_ORDER_BY_ID = 'rokebi/order/GET_ORDER_BY_ID';
export const CANCEL_ORDER = 'rokebi/order/CANCEL_ORDER';
export const GET_SUBS = 'rokebi/order/GET_SUBS';
export const GET_SUBS_USAGE = 'rokebi/usage/subs';
export const UPDATE_SUBS_STATUS = 'rokebi/order/UPDATE_SUBS_STATUS';

const getNextOrders = createAsyncThunk(GET_ORDERS, API.Order.getOrders);
export const getOrderById = createAsyncThunk(
  GET_ORDER_BY_ID,
  API.Order.getOrderById,
);
export const cancelOrder = createAsyncThunk(
  CANCEL_ORDER,
  API.Order.cancelOrder,
);
export const getSubs = createAsyncThunk(
  GET_SUBS,
  API.Subscription.getSubscription,
);
export const getSubsUsage = createAsyncThunk(
  GET_SUBS_USAGE,
  API.Subscription.getSubsUsage,
);
export const updateSubsStatus = createAsyncThunk(
  UPDATE_SUBS_STATUS,
  API.Subscription.updateSubscriptionStatus,
);

export const getSubsWithToast = reflectWithToast(getSubs);

export interface OrderModelState {
  orders: RkbOrder[];
  ordersIdx: ImmutableMap<number, number>;
  subs: RkbSubscription[];
  usageProgress: object;
  next: boolean;
  page: number;
}

export const checkAndGetOrderById = (
  auth: AccountAuth,
  orderId: number,
): AppThunk => (dispatch, getState) => {
  const {order} = getState();

  if (order.ordersIdx.has(orderId)) return Promise.resolve();
  return dispatch(getOrderById(auth, orderId));
};

export const getOrders = (auth: AccountAuth, page: number): AppThunk => (
  dispatch,
  getState,
) => {
  const {order} = getState();

  if (typeof page !== 'undefined') return dispatch(getNextOrders(auth, page));
  if (order.next) return dispatch(getNextOrders(auth, order.page + 1));
  return new Promise.resolve();
};

export const cancelAndGetOrder = (
  orderId: string,
  auth: AccountAuth,
): AppThunk => (dispatch, getState) => {
  const {account} = getState();
  const {iccid} = account;

  return dispatch(cancelOrder(orderId, auth)).then((resp) => {
    // 결제취소요청 후 항상 order를 가져온다
    return dispatch(getOrderById(auth, orderId)).then((val) => {
      if (resp.result === 0) {
        if (val.result === 0) {
          dispatch(getAccount(iccid, auth));
          return val;
        }
        return {
          ...val,
          result: 1,
        };
      }
      if (val.result === 0) {
        return {
          ...val,
          result: 1,
        };
      }
      return resp;
    });
  });
};

// subs status 변환 후
export const updateStatusAndGetSubs = (
  uuid: string,
  targetStatus: string,
  auth: AccountAuth,
): AppThunk => (dispatch, getState) => {
  const {account} = getState();
  const {iccid} = account;

  return dispatch(updateSubsStatus(uuid, targetStatus, auth)).then((resp) => {
    // 결제취소요청 후 항상 order를 가져온다
    if (resp.result === 0) {
      return dispatch(getSubs(iccid, auth));
    }
    return resp;
  });
};

function updateOrders(state: OrderModelState, {payload}) {
  const {result, objects} = payload;

  if (result === 0 && objects.length > 0) {
    const isPageZero =
      (objects[0] || []).key >= ((state.orders[0] || []).key || -1);
    const orders = isPageZero
      ? state.orders.slice(0, API.Order.ORDER_PAGE_ITEMS)
      : state.orders;
    const page = isPageZero ? -1 : state.page;

    let {ordersIdx} = state;

    // add to the order list if not exist
    objects.forEach((item) => {
      if (ordersIdx.has(item.orderId)) {
        // replace the element
        orders[ordersIdx.get(item.orderId)] = item;
      } else {
        orders.push(item);
        ordersIdx = ordersIdx.set(item.orderId, orders.length - 1);
      }
    });

    ordersIdx = ImmutableMap(
      orders
        .sort((a, b) => b.orderId - a.orderId)
        .map((a, idx) => [a.orderId, idx]),
    );
    return {
      ...state,
      orders,
      ordersIdx,
      page,
    };
  }

  return state;
}

const initialState: OrderModelState = {
  orders: [],
  ordersIdx: ImmutableMap(),
  subs: [],
  usageProgress: {},
  next: true,
  page: -1,
};

const slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNextOrders.fulfilled, (state, action) => {
      const {objects, links} = action.payload;

      const newState = updateOrders(state, action);
      return {
        ...newState,
        next: objects && objects.length === API.Order.ORDER_PAGE_ITEMS,
        page:
          links && typeof (links || [])[0] !== 'undefined'
            ? (links || [])[0]
            : newState.page,
      };
    });

    builder.addCase(getOrderById.fulfilled, (state, action) => {
      return updateOrders(state, action);
    });

    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      return state;
    });

    builder.addCase(updateSubsStatus.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      const {subs} = state;

      if (result === 0) {
        const idx = subs.findIndex((item) => item.key === objects[0]?.key);

        if (!_.isEmpty(idx)) {
          subs[idx].statusCd = objects[0]?.statusCd;
          subs[idx].status = objects[0]?.status;
        }
        return {
          ...state,
          subs,
        };
      }
      return state;
    });

    builder.addCase(getSubs.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0) {
        state.subs = objects;
      }
    });

    builder.addCase(getSubsUsage.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0) {
        state.usageProgress = objects;
      }
    });
  },
});

export const actions = {
  ...slice.actions,
  getSubsWithToast,
  getOrders,
  updateOrders,
  updateStatusAndGetSubs,
  updateSubsStatus,
  cancelAndGetOrder,
  checkAndGetOrderById,
};

export type OrderAction = typeof actions;

export default slice.reducer as Reducer<OrderModelState, AnyAction>;
