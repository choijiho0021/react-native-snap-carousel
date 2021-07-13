/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import _ from 'underscore';
import {API} from '@/submodules/rokebi-utils';
import {RkbOrder} from '@/submodules/rokebi-utils/api/orderApi';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RkbSubscription} from '@/submodules/rokebi-utils/api/subscriptionApi';
import {AccountAuth, getAccount} from './account';
import {AppThunk} from '..';
import {reflectWithToast, Toast} from './toast';

const getNextOrders = createAsyncThunk('order/getOrders', API.Order.getOrders);
export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  API.Order.getOrderById,
);
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  API.Order.cancelOrder,
);
export const getSubs = createAsyncThunk(
  'order/getSubs',
  API.Subscription.getSubscription,
);
export const getSubsUsage = createAsyncThunk(
  'order/getSubsUsage',
  API.Subscription.getSubsUsage,
);
export const updateSubsStatus = createAsyncThunk(
  'order/updateSubsStatus',
  API.Subscription.updateSubscriptionStatus,
);

export const getSubsWithToast = reflectWithToast(getSubs, Toast.NOT_LOADED);

export interface OrderModelState {
  orders: RkbOrder[];
  ordersIdx: ImmutableMap<number, number>;
  subs: RkbSubscription[];
  usageProgress: object;
  next: boolean;
  page: number;
}

export const checkAndGetOrderById = ({
  user,
  token,
  orderId,
}: {
  user?: string;
  token?: string;
  orderId?: number;
}): AppThunk => (dispatch, getState) => {
  const {order} = getState();

  if (order.ordersIdx.has(orderId)) return Promise.resolve();
  return dispatch(getOrderById({user, token, orderId}));
};

export const getOrders = ({
  user,
  token,
  page,
}: {
  user: string;
  token: string;
  page: number;
}): AppThunk => (dispatch, getState) => {
  const {order} = getState();

  if (typeof page !== 'undefined')
    return dispatch(getNextOrders({user, token, page}));
  if (order.next)
    return dispatch(getNextOrders({user, token, page: order.page + 1}));
  return Promise.resolve();
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
