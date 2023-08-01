/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import _ from 'underscore';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import moment from 'moment';
import {API} from '@/redux/api';
import {CancelKeywordType, RkbOrder} from '@/redux/api/orderApi';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {storeData, retrieveData, parseJson, utils} from '@/utils/utils';
import {reflectWithToast, Toast} from './toast';
import api, {cachedApi} from '@/redux/api/api';
import Env from '@/environment';
import {ProdDesc} from '@/screens/CancelOrderScreen/CancelResult';

const {specialCategories} = Env.get();

const getNextOrders = createAsyncThunk('order/getOrders', API.Order.getOrders);

const init = createAsyncThunk('order/init', async (mobile?: string) => {
  const oldData = await retrieveData(`${API.Order.KEY_INIT_ORDER}.${mobile}`);
  return oldData;
});

const getOrderById = createAsyncThunk(
  'order/getOrderById',
  API.Order.getOrderById,
);

const draftOrder = createAsyncThunk('order/draftOrder', API.Order.draftOrder);
const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  API.Order.cancelOrder,
);

const getSubs = createAsyncThunk(
  'order/getSubs',
  async (param: {iccid?: string; token?: string; hidden?: boolean}) =>
    cachedApi(`cache.subs.${param?.iccid}`, API.Subscription.getSubscription)(
      param,
      {
        fulfillWithValue: (value) => value,
      },
    ),
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

export interface OrderModelState {
  orders: ImmutableMap<number, RkbOrder>;
  orderList: number[];
  subs: RkbSubscription[];
  drafts: RkbOrder[];
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
    {
      user,
      token,
      page,
      state,
    }: {
      user?: string;
      token?: string;
      page?: number;
      state?: 'all' | 'validation';
    },
    {getState, dispatch},
  ) => {
    if (page !== undefined) {
      return dispatch(getNextOrders({user, token, page, state}));
    }

    const {order} = getState() as RootState;
    return dispatch(
      getNextOrders({user, token, page: (order.page || 0) + 1, state}),
    );
  },
);

const changeDraft = createAsyncThunk(
  'order/draftOrder',
  ({orderId, token}: {orderId: number; token?: string}) => {
    return API.Order.draftOrder({orderId, token});
  },
);

const cancelDraftOrder = createAsyncThunk(
  'order/cancelOrder',
  (
    {
      orderId,
      token,
      reason,
    }: {orderId?: number; token?: string; reason?: CancelKeywordType},
    {dispatch},
  ) => {
    return dispatch(cancelOrder({orderId, token, reason})).then(
      ({payload: resp}) => {
        if (resp.result === 0 && resp.objects?.length > 0) {
          return resp;
        }
        return {result: api.FAILED};
      },
    );
  },
);

const mergeSubs = (
  org: ImmutableMap<string, RkbSubscription[]>,
  subs: RkbSubscription[],
) => {
  const subsToMap: ImmutableMap<string, RkbSubscription[]> = subs.reduce(
    (acc, s) => {
      return s.subsIccid
        ? acc.update(s.subsIccid, (pre) =>
            (
              pre?.filter((elm) => {
                return elm.uuid !== s.uuid;
              }) || []
            )
              .concat(s)
              .sort((subs1, subs2) =>
                subs1.purchaseDate > subs2.purchaseDate ? 1 : -1,
              ),
          )
        : acc;
    },
    org,
  );

  return subsToMap;
};

export const isExpiredDraft = (orderDate: string) => {
  return moment().diff(moment(orderDate), 'day') >= 7;
};

export const getCountProds = (prods: ProdDesc[]) => {
  return prods.reduce((acc, p) => acc + p.qty, 0).toString();
};

const initialState: OrderModelState = {
  orders: ImmutableMap<number, RkbOrder>(),
  drafts: [],
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
    builder.addCase(init.fulfilled, (state, {payload}) => {
      const orders = ImmutableMap(
        payload ? parseJson(payload).map((o) => [o.orderId, o]) : [],
      ).merge(state.page === 0 ? [] : state.orders);

      if (orders) {
        updateOrders(state, orders, 0);
      }
    });

    builder.addCase(draftOrder.fulfilled, (state, action) => {
      const {objects = [], result} = action.payload;

      const orderId = action?.meta?.arg.orderId;
      const subs: RkbSubscription[] = objects[0]?.subs;

      if (
        result === 0 &&
        objects.length > 0 &&
        objects[0]?.state === 'completed'
      ) {
        // Esim 새로고침 대신 성공한 order만 drafts에서 뺀다.
        state.drafts = state.drafts.filter((d) => d.orderId !== orderId);

        // 함수로 뺄 지 고민
        state.subs = state.subs.concat(
          subs.map((o) => ({
            ...o,
            statusCd: o?.field_status,
            flagImage: o?.field_flag_image,
            prodName: utils.extractProdName(o?.title),
            promoFlag: o?.field_special_categories
              ? o.field_special_categories
                  .split(',')
                  .map((v) => specialCategories[v.trim()])
                  .filter((v) => !_.isEmpty(v))
              : [],
          })),
        );
      }
    });

    builder.addCase(getOrders.fulfilled, (state, action) => {
      const {objects, result} = action.payload;

      if (action.meta.arg?.state === 'validation') {
        // 이전과 달리 동작하는 이유, 2번째 object undefined 일때  undefined.filter 시도
        // promise rejection으로 2번째 undefined을 state.drafts에 저장 안함
        // 2번 호출 원인 분석 필요
        state.drafts =
          objects
            .filter((r) => !isExpiredDraft(r.orderDate))
            .sort((a, b) => {
              return a.orderDate < b.orderDate ? 1 : -1;
            }) || [];

        // 기존 코드도 마찬가지, undefined.length 시도 -> promise rejection
      } else if (result === 0 && objects.length > 0) {
        // 기존에 있던 order에 새로운 order로 갱신
        const orders = ImmutableMap(state.orders).merge(
          objects.map((o) => [o.orderId, o]),
        );

        const orderCache = orders
          .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
          .valueSeq()
          .toArray()
          .slice(0, 10);

        storeData(
          `${API.Order.KEY_INIT_ORDER}.${action.meta.arg.user}`,
          JSON.stringify(orderCache),
        );

        updateOrders(state, orders, action.meta.arg.page);
      }
    });

    builder.addCase(getOrderById.fulfilled, (state) => {
      // return updateOrders(state, action);
      // TODO: 다시 구현 필요
      return state;
    });

    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      const {orders} = state;

      const orderId = action?.meta?.arg?.orderId;

      const order = orders.get(orderId);

      state.drafts = state.drafts.filter((d) => d.orderId !== orderId);

      if (result === 0 && objects[0]?.state && order) {
        const updateOrder = orders.set(orderId, {
          ...order,
          state: objects[0].state,
        });
        state.orders = updateOrder;
      }

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
        if (subsIccid) {
          state.subs = subs.set(iccid, subsIccid);
        }
      }
    });

    builder.addCase(updateSubsInfo.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      const {subs} = state;

      if (result === 0 && objects[0]) {
        const changeSubs = subs.get(objects[0]?.iccid)?.map((s) => {
          if (objects.map((elm) => elm.uuid).includes(s.uuid)) {
            s.hide = objects[0].hide;
          }
          return s;
        });

        if (changeSubs) {
          state.subs = subs.set(objects[0].iccid, changeSubs);
        }
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
      const {result, objects}: {objects: RkbSubscription[]} = action.payload;

      console.log('@@@ get subs', action?.meta?.arg);
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

    builder.addCase(cmiGetSubsUsage.fulfilled, (state) => {
      return state;
    });
  },
});

export const actions = {
  ...slice.actions,
  getSubsWithToast,
  init,
  getSubs,
  getOrders,
  updateSubsInfo,
  updateSubsAndOrderTag,
  updateSubsGiftStatus,
  cancelDraftOrder,
  checkAndGetOrderById,
  changeDraft,
  cmiGetSubsUsage,
};

export type OrderAction = typeof actions;

export default slice.reducer as Reducer<OrderModelState, AnyAction>;
