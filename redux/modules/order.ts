/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import _ from 'underscore';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {API} from '@/redux/api';
import {RkbOrder} from '@/redux/api/orderApi';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {storeData, retrieveData, parseJson} from '@/utils/utils';
import {actions as accountAction} from './account';
import {reflectWithToast, Toast} from './toast';
import {cachedApi} from '@/redux/api/api';

const init = createAsyncThunk('order/init', async (mobile?: string) => {
  const oldData = await retrieveData(`${API.Order.KEY_INIT_ORDER}.${mobile}`);
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
  async (param: {iccid?: string; token?: string; prodType?: string}) =>
    cachedApi(`cache.subs.${param?.iccid}`, API.Subscription.getSubscription)(
      param,
      {
        fulfillWithValue: (value) => value,
      },
    ),
);

const getStoreSubs = createAsyncThunk(
  'order/getStoreSubs',
  async (param: {mobile?: string; token?: string}) =>
    cachedApi(
      `cache.store.${param?.mobile}`,
      API.Subscription.getStoreSubscription,
    )(param, {
      fulfillWithValue: (value) => value,
    }),
);

const getSubsUsage = createAsyncThunk(
  'order/getSubsUsage',
  API.Subscription.getSubsUsage,
);
const updateSubsInfo = createAsyncThunk(
  'order/updateSubsInfo',
  API.Subscription.updateSubscriptionInfo,
);
const updateSubsAndOrderTag = createAsyncThunk(
  'order/updateSubsAndOrderTag',
  API.Subscription.updateSubscriptionAndOrderTag,
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
  const subsToMap: ImmutableMap<string, RkbSubscription[]> = subs.reduce(
    (acc, s) =>
      s.subsIccid
        ? acc.update(s.subsIccid, (pre) =>
            (pre?.filter((elm) => elm.uuid !== s.uuid) || [])
              .concat(s)
              .sort((subs1, subs2) =>
                subs1.purchaseDate > subs2.purchaseDate ? 1 : -1,
              ),
          )
        : acc,
    org,
  );

  return subsToMap;
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
        payload ? parseJson(payload).map((o) => [o.orderId, o]) : [],
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
          const orderCache = orders
            .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
            .valueSeq()
            .toArray()
            .slice(0, 10);

          storeData(
            `${API.Order.KEY_INIT_ORDER}.${action.meta.arg.user}`,
            JSON.stringify(orderCache),
          );
        }

        updateOrders(state, orders, action.meta.arg.page);
      }
    });

    builder.addCase(getOrderById.fulfilled, (state) => {
      // return updateOrders(state, action);
      // TODO: 다시 구현 필요
      return state;
    });

    builder.addCase(cancelOrder.fulfilled, (state) => {
      return state;
    });

    builder.addCase(updateSubsAndOrderTag.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      const {subs} = state;

      if (result === 0 && objects[0]) {
        const {key, tag, iccid} = objects[0];
        const subsIccid = subs.get(iccid)?.map((s) => {
          if (s.key === key) s.tag = tag;
          return s;
        });
        if (subsIccid) subs.set(iccid, subsIccid);
        state.subs = subs;
      }
    });

    builder.addCase(updateSubsInfo.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      const {subs} = state;

      if (result === 0 && objects[0]) {
        const idx = subs.findIndex((item) => item.key === objects[0]?.key);

        if (!_.isEmpty(idx)) {
          subs[idx].alias = objects[0]?.alias;
          subs[idx].hide = objects[0]?.hide;
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

    builder.addCase(cmiGetSubsUsage.fulfilled, (state) => {
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
  getStoreSubs,
  getOrders,
  updateSubsInfo,
  updateSubsAndOrderTag,
  updateSubsGiftStatus,
  cancelAndGetOrder,
  checkAndGetOrderById,
  cmiGetSubsUsage,
};

export type OrderAction = typeof actions;

export default slice.reducer as Reducer<OrderModelState, AnyAction>;
