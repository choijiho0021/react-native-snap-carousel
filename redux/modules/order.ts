/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import _ from 'underscore';
import {API} from '@/submodules/rokebi-utils';
import {RkbOrder} from '@/submodules/rokebi-utils/api/orderApi';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {RkbSubscription} from '@/submodules/rokebi-utils/api/subscriptionApi';
import {getAccount} from './account';
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
  orders: ImmutableMap<number, RkbOrder>;
  orderList: number[];
  subs: RkbSubscription[];
  usageProgress: object;
  page: number;
}

export const checkAndGetOrderById = createAsyncThunk(
  'order/checkAndGetOrderById',
  (
    {user, token, orderId}: {user?: string; token?: string; orderId?: number},
    {dispatch, getState},
  ) => {
    const {order} = getState() as RootState;

    if (orderId && !order.orders.has(orderId))
      return dispatch(getOrderById({user, token, orderId}));
    return undefined;
  },
);

export const getOrders = createAsyncThunk(
  'order/getOrders',
  (
    {user, token, page}: {user?: string; token?: string; page?: number},
    {dispatch, getState},
  ) => {
    const {order} = getState() as RootState;

    if (page !== undefined) return dispatch(getNextOrders({user, token, page}));
    return dispatch(getNextOrders({user, token, page: (order.page || 0) + 1}));
  },
);

export const cancelAndGetOrder = createAsyncThunk(
  'order/cancelAndGetOrder',
  (
    {orderId, token}: {orderId?: number; token?: string},
    {dispatch, getState},
  ) => {
    const {
      account: {iccid},
    } = getState() as RootState;

    return dispatch(cancelOrder({orderId, token})).then(({payload: resp}) => {
      // 결제취소요청 후 항상 order를 가져온다
      return dispatch(getOrderById({orderId, token})).then(({payload: val}) => {
        if (resp.result === 0) {
          if (val.result === 0) {
            dispatch(getAccount({iccid, token}));
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
  },
);

// subs status 변환 후
/* not used
export const updateStatusAndGetSubs = createAsyncThunk(
  'order/updateStatusAndGetSubs',
  (
    {uuid, status, token}: {uuid: string; status: string; token: string},
    {dispatch, getState},
  ) => {
    const {
      account: {iccid},
    } = getState() as RootState;

    return dispatch(updateSubsStatus({uuid, status, token})).then(
      ({payload: resp}) => {
        // 결제취소요청 후 항상 order를 가져온다
        if (resp.result === 0) {
          return dispatch(getSubs({iccid, token}));
        }
        return resp;
      },
    );
  },
);
*/

const initialState: OrderModelState = {
  orders: ImmutableMap<number, RkbOrder>(),
  orderList: [],
  subs: [],
  usageProgress: {},
  page: 0,
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
      const {objects, result} = action.payload;

      if (result === 0 && objects.length > 0) {
        const orders = ImmutableMap(objects.map((o) => [o.orderId, o])).merge(
          state.orders,
        );

        state.orders = orders;
        state.orderList = orders
          .keySeq()
          .toArray()
          .sort((a, b) => b - a);
        state.page = action.meta.arg.page;
      }
    });

    builder.addCase(getOrderById.fulfilled, (state, action) => {
      // return updateOrders(state, action);
      // TODO: 다시 구현 필요
      return state;
    });

    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      return state;
    });

    builder.addCase(updateSubsStatus.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      const {subs} = state;

      if (result === 0 && objects[0]) {
        const idx = subs.findIndex((item) => item.key === objects[0]?.key);

        if (!_.isEmpty(idx)) {
          subs[idx].statusCd = objects[0]?.statusCd;
          subs[idx].status = objects[0]?.status;
        }
        state.subs = subs;
      }
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
  getSubs,
  getOrders,
  updateSubsStatus,
  cancelAndGetOrder,
  checkAndGetOrderById,
};

export type OrderAction = typeof actions;

export default slice.reducer as Reducer<OrderModelState, AnyAction>;
