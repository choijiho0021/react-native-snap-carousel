/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import _ from 'underscore';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import moment, {Moment} from 'moment';
import {API} from '@/redux/api';
import {CancelOrderParam, OrderItemType, RkbOrder} from '@/redux/api/orderApi';
import {
  RkbSubscription,
  sortSubs,
  STATUS_USED,
  SubscriptionParam,
} from '@/redux/api/subscriptionApi';
import {storeData, retrieveData, parseJson, utils} from '@/utils/utils';
import {reflectWithToast, Toast} from './toast';
import api, {cachedApi} from '@/redux/api/api';
import Env from '@/environment';

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
  async (param: SubscriptionParam) =>
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

export interface OrderModelState {
  orders: ImmutableMap<number, RkbOrder>;
  orderList: number[];
  subs: RkbSubscription[];
  drafts: RkbOrder[];
  usageProgress: object;
  page: number;
  subsOffset: number;
  subsIsLast: boolean;
}

const updateOrders = (state, orders, page) => {
  state.orders = orders;
  state.orderList = orders
    .sort((a, b) => utils.cmpMomentDesc(a.orderDate, b.orderDate))
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

const getNextSubs = createAsyncThunk(
  'order/getSubs',
  (param: SubscriptionParam, {getState, dispatch}) => {
    if (param.offset === undefined) {
      const {order} = getState() as RootState;
      param.offset = order.subsOffset;
    }
    return dispatch(getSubs(param));
  },
);

// 질문 필요 reflectWithToast
const getSubsWithToast = reflectWithToast(getSubs, Toast.NOT_LOADED);

const getOrders = createAsyncThunk(
  'order/getOrders',
  (
    param: {
      user?: string;
      token?: string;
      page?: number;
      state?: 'all' | 'validation';
    },
    {getState, dispatch},
  ) => {
    if (param.page === undefined) {
      const {order} = getState() as RootState;
      param.page = (order.page || 0) + 1;
    }

    return dispatch(getNextOrders(param));
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
  (params: CancelOrderParam, {dispatch}) => {
    return dispatch(cancelOrder(params)).then(({payload: resp}) => {
      if (resp.result === 0 && resp.objects?.length > 0) {
        return resp;
      }
      return {result: api.FAILED};
    });
  },
);

const mergeSubs = (org: RkbSubscription[], subs: RkbSubscription[]) => {
  if (subs.length === 0) {
    return org;
  }

  // Map으로 하는게 나을지도 모르겠다.
  const subsMap: Record<string, string> = subs.reduce((acc, sub) => {
    acc[sub.nid] = sub.nid;
    return acc;
  }, {} as Record<string, string>);

  return org
    .filter((o) => !subsMap[o.nid])
    .concat(subs)
    .sort(sortSubs);
};

export const isDraft = (state: string) => !(STATUS_USED === state);

export const isExpiredDraft = (orderDate: Moment) => {
  return moment().diff(orderDate, 'day') >= 7;
};

export const getCountItems = (items?: OrderItemType[], etc?: boolean) => {
  if (!items) return '';

  const result = items.reduce((acc, i) => acc + i.qty, 0);

  return etc ? (result - 1).toString() : result.toString();
};

// 적당한 위치 고민
export const PAGINATION_SUBS_COUNT = 10;

const initialState: OrderModelState = {
  orders: ImmutableMap<number, RkbOrder>(),
  drafts: [],
  orderList: [],
  subs: [],
  usageProgress: {},
  subsOffset: 0,
  page: 0,
  subsIsLast: false,
};

const slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },

    empty: (state) => {
      state.subsOffset = 0;
    },

    resetIsLast: (state) => {
      state.subsIsLast = false;
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
        if (objects) {
          state.drafts =
            objects
              .filter((r) => !isExpiredDraft(r.orderDate))
              .sort((a, b) => utils.cmpMomentDesc(a.orderDate, b.orderDate)) ||
            [];
        }

        // 기존 코드도 마찬가지, undefined.length 시도 -> promise rejection
      } else if (result === 0 && objects.length > 0) {
        // 기존에 있던 order에 새로운 order로 갱신
        const orders = ImmutableMap(state.orders).merge(
          objects.map((o) => [o.orderId, o]),
        );

        const orderCache = orders
          .sort((a, b) => utils.cmpMomentDesc(a.orderDate, b.orderDate))
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
        state.orders = orders.set(orderId, {
          ...order,
          state: objects[0].state,
        });
      }

      return state;
    });

    builder.addCase(updateSubsAndOrderTag.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      const {subs} = state;

      if (result === 0 && objects[0]) {
        const {uuid, tag} = objects[0];
        state.subs = subs.map((s) => {
          if (s.uuid === uuid) s.tag = tag;
          return s;
        });
      }
    });

    builder.addCase(updateSubsInfo.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      const {subs} = state;

      if (result === 0 && objects[0]) {
        state.subs = subs.map((s) => {
          if (objects.find((o) => o.uuid === s.uuid)) {
            s.hide = objects[0].hide;
          }
          return s;
        });
      }
    });

    builder.addCase(updateSubsGiftStatus.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      const {subs} = state;

      if (result === 0 && objects[0]) {
        state.subs = subs.map((item) => {
          if (item.nid === objects[0].nid) {
            item.giftStatusCd = objects[0].giftStatusCd;
          }
          return item;
        });
      }
    });

    builder.addCase(getSubs.fulfilled, (state, action) => {
      const {result, objects}: {objects: RkbSubscription[]} = action.payload;

      const {count = PAGINATION_SUBS_COUNT, offset} = action?.meta?.arg;

      if (result === 0) {
        // count default 10 설정되어 있음
        if (objects?.length < count) {
          state.subsIsLast = true;
        } else {
          state.subsOffset += count;
          state.subsIsLast = false;
        }

        if (offset === 0) {
          state.subs = objects;
        } else {
          // offset이 0이 아니라면 페이지네이션 중이니 merge로 한다
          state.subs = mergeSubs(state.subs, objects);
        }
      }

      // objects의 갯수가 카운트(한번에 가져오는 수)보다 적으면? isLast로 처리한다.

      // isLast를 return 햇을 때 화면에서 받아오면, 더이상 조회하지 않는다.
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

const resetOffset = createAsyncThunk(
  'order/resetOffset',
  (params, {dispatch}) => {
    dispatch(slice.actions.empty());
  },
);

export const actions = {
  ...slice.actions,
  getSubsWithToast,
  resetOffset,
  init,
  getSubs,
  getOrders,
  getNextSubs,
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
