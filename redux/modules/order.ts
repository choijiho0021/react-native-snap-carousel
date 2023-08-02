/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import _, {get} from 'underscore';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import moment from 'moment';
import {API} from '@/redux/api';
import {CancelKeywordType, RkbOrder} from '@/redux/api/orderApi';
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

const getNextSubs = createAsyncThunk(
  'order/getSubs',
  (
    {
      iccid,
      token,
      uuid,
      hidden,
      count = 10,
      offset = undefined,
    }: SubscriptionParam,
    {getState, dispatch},
  ) => {
    if (offset !== undefined) {
      return dispatch(getSubs({iccid, token, uuid, hidden, count, offset}));
    }

    const {order} = getState();

    return dispatch(
      getSubs({
        iccid,
        token,
        uuid,
        hidden,
        count,
        offset: order.subsOffset,
      }),
    );
  },
);

// 질문 필요 reflectWithToast
const getSubsWithToast = reflectWithToast(getNextSubs, Toast.NOT_LOADED);

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

const mergeSubs = (org: RkbSubscription[], subs: RkbSubscription[]) => {
  if (subs.length === 0) {
    return org;
  }

  // Map으로 하는게 나을지도 모르겠다.
  const subsMap: {[nid: number]: RkbSubscription} = org.reduce((acc, sub) => {
    acc[sub.nid] = sub;
    return acc;
  }, {});

  subs.forEach((sub) => {
    subsMap[sub.nid] = sub;
  });
  return Object.values(subsMap).sort(sortSubs);
};

export const isDraft = (state: string) => !(STATUS_USED === state);

export const isExpiredDraft = (orderDate: string) => {
  return moment().diff(moment(orderDate), 'day') >= 7;
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
        const {key, tag} = objects[0];
        const changeSubs = subs.map((s) => {
          if (s.key === key) s.tag = tag;
          return s;
        });
        if (changeSubs) {
          state.subs = changeSubs;
        }
      }
    });

    builder.addCase(updateSubsInfo.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      const {subs} = state;

      if (result === 0 && objects[0]) {
        const changeSubs = subs.map((s) => {
          if (objects.map((elm) => elm.uuid).includes(s.uuid)) {
            s.hide = objects[0].hide;
          }
          return s;
        });

        if (changeSubs) {
          state.subs = changeSubs;
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

      // 현재 offset 확인하기
      const arg = action?.meta?.arg;

      // offset이 0이라면? overWrite한다
      if (result === 0) {
        if (objects?.length < PAGINATION_SUBS_COUNT) {
          state.subsIsLast = true;
        } else {
          state.subsOffset += PAGINATION_SUBS_COUNT;
          state.subsIsLast = false;
        }

        if (arg?.offset === 0) {
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
