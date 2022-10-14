/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import _, {result} from 'underscore';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {API} from '@/redux/api';
import {RkbOrder} from '@/redux/api/orderApi';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {storeData, retrieveData} from '@/utils/utils';
import {actions as accountAction} from './account';
import {reflectWithToast, Toast} from './toast';
import {concat} from 'react-native-reanimated';

const init = createAsyncThunk('order/init', async () => {
  const oldData = await retrieveData(API.Order.KEY_INIT_ORDER);
  return oldData;
});

const getNextOrders = createAsyncThunk('order/getOrders', API.Order.getOrders);
const getOrderById = createAsyncThunk(
  'order/getOrderById',
  API.Order.getOrderById,
);
const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  API.Order.cancelOrder,
);
const getSubs = createAsyncThunk(
  'order/getSubs',
  API.Subscription.getSubscription,
);
const getStoreSubs = createAsyncThunk(
  'order/getStoreSubs',
  API.Subscription.getStoreSubscription,
);
const getSubsUsage = createAsyncThunk(
  'order/getSubsUsage',
  API.Subscription.getSubsUsage,
);
const updateSubsStatus = createAsyncThunk(
  'order/updateSubsStatus',
  API.Subscription.updateSubscriptionStatus,
);
const updateSubsGiftStatus = createAsyncThunk(
  'order/updateSubsGiftStatus',
  API.Subscription.updateSubscriptionGiftStatus,
);
const cmiGetSubsUsage = createAsyncThunk(
  'order/cmiGetSubsUsage',
  API.Subscription.cmiGetSubsUsage,
);

const getSubsWithToast = reflectWithToast(getSubs, Toast.NOT_LOADED);
const getStoreSubsWithToast = reflectWithToast(getStoreSubs, Toast.NOT_LOADED);

export interface OrderModelState {
  orders: ImmutableMap<number, RkbOrder>;
  orderList: number[];
  subs: ImmutableMap<string, RkbSubscription[]>;
  usageProgress: object;
  page: number;
}

const updateOrders = (state, orders, page) => {
  state.orders = orders;
  state.orderList = orders
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
    .keySeq()
    .toArray();
  state.page = page;
};

const checkAndGetOrderById = createAsyncThunk(
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

const getOrders = createAsyncThunk(
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

const cancelAndGetOrder = createAsyncThunk(
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
            dispatch(accountAction.getAccount({iccid, token}));
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
const mergeSubs = (
  org: ImmutableMap<string, RkbSubscription[]>,
  subs: RkbSubscription[],
) => {
  // org
  //   .concat(subs.filter((s) => !org.find((o) => o.uuid === s.uuid)))
  //   .sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate));

  const subsToMap: ImmutableMap<string, RkbSubscription[]> = subs.reduce(
    (acc, s) => {
      return s.subsIccid
        ? acc.update(s.subsIccid, (pre) => (pre ? pre.concat(s) : [s]))
        : acc;
    },
    ImmutableMap<string, RkbSubscription[]>(),
  );

  console.log('@@@@org', org);
  console.log('@@@@subs', subs);

  // return org.mergeWith((oldVal, newVal) => oldVal.concat(newVal), subsToMap);
  return org.merge(subsToMap);
};

const initialState: OrderModelState = {
  orders: ImmutableMap<number, RkbOrder>(),
  orderList: [],
  subs: ImmutableMap(),
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
    builder.addCase(init.fulfilled, (state, {payload}) => {
      const orders = ImmutableMap(
        payload ? JSON.parse(payload).map((o) => [o.orderId, o]) : [],
      ).merge(state.page === 0 ? [] : state.orders);

      if (orders) {
        updateOrders(state, orders, 0);
      }
    });

    builder.addCase(getNextOrders.fulfilled, (state, action) => {
      const {objects, result} = action.payload;

      // if (result === 0) {
      //   const orders = ImmutableMap(objects.map((o) => [o.orderId, o])).merge(
      //     state.page === 0 ? [] : state.orders,
      if (result === 0 && objects.length > 0) {
        // 기존에 있던 order에 새로운 order로 갱신
        const orders = ImmutableMap(state.orders).merge(
          objects.map((o) => [o.orderId, o]),
        );

        if (orders && orders.size <= 10) {
          storeData(API.Order.KEY_INIT_ORDER, JSON.stringify(objects));
        }

        updateOrders(state, orders, action.meta.arg.page);
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

    builder.addCase(updateSubsGiftStatus.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      const {subs} = state;

      if (result === 0 && objects[0]) {
        state.subs = subs.map((item) => {
          if (item.key === objects[0]?.key) {
            item.giftStatusCd = objects[0].giftStatusCd;
          }
          return item;
        });
      }
    });

    builder.addCase(getSubs.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0) {
        state.subs = mergeSubs(state.subs, objects);
      }
    });

    builder.addCase(getStoreSubs.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      console.log('@@@ store', objects);
      if (result === 0) {
        state.subs = mergeSubs(state.subs, objects);
      }
    });

    builder.addCase(getSubsUsage.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0) {
        state.usageProgress = objects;
      }
    });

    builder.addCase(cmiGetSubsUsage.fulfilled, (state, action) => {
      return state;
    });
  },
});

export const actions = {
  ...slice.actions,
  getSubsWithToast,
  getStoreSubsWithToast,
  init,
  getSubs,
  getOrders,
  updateSubsStatus,
  updateSubsGiftStatus,
  cancelAndGetOrder,
  checkAndGetOrderById,
  cmiGetSubsUsage,
};

export type OrderAction = typeof actions;

export default slice.reducer as Reducer<OrderModelState, AnyAction>;
