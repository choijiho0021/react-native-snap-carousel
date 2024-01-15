/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import _ from 'underscore';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import moment, {Moment} from 'moment';
import {API} from '@/redux/api';
import {
  CancelOrderParam,
  GetOrdersParam,
  OrderItemType,
  RkbOrder,
} from '@/redux/api/orderApi';
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

export const isBillionConnect = (sub?: RkbSubscription) =>
  sub?.partner === 'billionconnect';

const init = createAsyncThunk('order/init', async (mobile?: string) => {
  const oldData = await retrieveData(`${API.Order.KEY_INIT_ORDER}.${mobile}`);
  return oldData;
});

// cachedApi 수정한 후 지우기
const defaultReturn = (resp) => {
  return resp;
};

const subsReturn = (resp) => {
  if (
    resp.objects &&
    resp.objects.length > 0 &&
    typeof resp.objects[0].purchaseDate === 'string'
  ) {
    return {
      ...resp,
      objects: resp.objects.map((elm) => ({
        ...elm,
        purchaseDate: moment(elm.purchaseDate),
        expireDate: moment(elm.expireDate),
        provDate: moment(elm.provDate),
        startDate: moment(elm.startDate),
        lastExpireDate: moment(elm.lastExpireDate),
        lastProvDate: moment(elm.lastProvDate),
        activationDate: moment(elm?.activationDate),
      })),
    };
  }

  return resp;
};

const getOrderById = createAsyncThunk(
  'order/getOrderById',
  API.Order.getOrderById,
);

const draftOrder = createAsyncThunk('order/draftOrder', API.Order.draftOrder);
const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  API.Order.cancelOrder,
);

const getNotiSubs = createAsyncThunk(
  'order/getNotiSubs',
  async (param: SubscriptionParam, {getState}) => {
    if (param.offset === undefined) {
      const {order} = getState() as RootState;
      param.offset = order.subsOffset;
    }

    return cachedApi(
      `cache.subs.${param?.iccid}`,
      API.Subscription.getSubscription,
    )(param, {
      fulfillWithValue: defaultReturn,
    });
  },
);

const getSubs = createAsyncThunk(
  'order/getSubs',
  async (param: SubscriptionParam, {getState}) => {
    if (param.offset === undefined) {
      const {order} = getState() as RootState;
      param.offset = order.subsOffset;
    }

    if (param.reset) {
      param.offset = 0;
    }

    return cachedApi(
      `cache.subs.${param?.iccid}`,
      API.Subscription.getSubscription,
    )(param, {
      fulfillWithValue: subsReturn,
    });
  },
);

const subsReload = createAsyncThunk(
  'order/getSubs',
  async (param: SubscriptionParam, {getState, rejectWithValue}) => {
    const {order} = getState() as RootState;
    param.offset = 0;
    param.count = order.subs.length < 10 ? 10 : order.subs.length + 1;

    // 현재 sub의 수가 0이라면 리로드할 필요가 없음
    if (order.subs.length <= 0) {
      return rejectWithValue('Need not to get subs reload');
    }

    return cachedApi(
      `cache.subs.${param?.iccid}`,
      API.Subscription.getSubscription,
    )(param, {
      fulfillWithValue: defaultReturn,
    });
  },
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

const getOrderList = (orders) => {
  // state.orders = orders;
  return orders
    .sort((a, b) => utils.cmpMomentDesc(a.orderDate, b.orderDate))
    .keySeq()
    .toArray();
};

// 질문 필요 reflectWithToast
const getSubsWithToast = reflectWithToast(getSubs, Toast.NOT_LOADED, {
  '1': 'toast:esim:hide',
  '-1001': 'toast:esim:notExist',
});

const getOrders = createAsyncThunk(
  'order/getOrders',
  (param: GetOrdersParam, {getState}) => {
    if (param.page === undefined) {
      const {order} = getState() as RootState;
      param.page = order.page === undefined ? 0 : order.page + 1;
    }

    return API.Order.getOrders(param);
  },
);

const changeDraft = createAsyncThunk(
  'order/draftOrder',
  ({
    orderId,
    token,
    eid,
    imei2,
    activation_date,
  }: {
    orderId: number;
    token?: string;
    eid?: string;
    imei2?: string;
    activation_date?: string;
  }) => {
    return API.Order.draftOrder({orderId, token, eid, imei2, activation_date});
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

    resetOffset: (state) => {
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

      state.orders = orders;
      state.orderList = getOrderList(orders);
      state.page = 0;
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
            purchaseDate: moment(),
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
        if (objects) {
          state.drafts =
            objects
              .filter((r) => !isExpiredDraft(r.orderDate))
              .sort((a, b) => utils.cmpMomentDesc(a.orderDate, b.orderDate)) ||
            [];

          // 데이터가 빈 경우 [] 처리하기
        } else if (result === api.E_NOT_FOUND) {
          state.drafts = [];
        }
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

        state.orders = orders;
        state.orderList = getOrderList(orders);

        const {orderId, page} = action.meta.arg;
        if (!orderId && page !== undefined) state.page = page;
      }
    });

    builder.addCase(getOrderById.fulfilled, (state, action) => {
      const {objects, result} = action.payload;
      if (result === 0 && objects.length > 0) {
        const orders = ImmutableMap(state.orders).merge(
          objects.map((o) => [o.orderId, o]),
        );

        state.orders = orders;
        state.orderList = getOrderList(orders);
      }
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

    builder.addCase(getNotiSubs.fulfilled, (state, action) => {
      const {result, objects}: {objects: RkbSubscription[]} = action.payload;

      if (result === 0 && objects) {
        const maxExpiredDate: Moment = objects.reduce(
          (maxDate, obj) =>
            obj.expireDate && obj.expireDate.isAfter(maxDate)
              ? obj.expireDate
              : maxDate,
          moment('1900-01-01'),
        );

        const {subsIccid} = objects[0];

        if (objects.length > 1) {
          // 충전-연장 상품이 아닌 경우를 처리하지 못함.
          state.subs = state.subs.reduce((acc, cur) => {
            if (cur.statusCd === STATUS_USED) {
              if (cur.subsIccid === subsIccid) {
                return acc.concat([{...cur, lastExpireDate: maxExpiredDate}]);
              }
            } else if (objects.find((obj) => obj.nid === cur.nid)) return acc;

            return acc.concat([cur]);
          }, [] as RkbSubscription[]);
        } else {
          state.subs = state.subs
            .map((sub) =>
              sub.nid === objects[0].nid
                ? {...objects[0], lastExpireDate: maxExpiredDate}
                : sub,
            )
            .sort(sortSubs);
        }
      }
    });

    builder.addCase(getSubs.fulfilled, (state, action) => {
      const {result, objects}: {objects: RkbSubscription[]} = action.payload;

      const {count = PAGINATION_SUBS_COUNT, offset, reset} = action?.meta?.arg;

      if ([0, 1, -1001].includes(result) && objects) {
        // uuid param이 있으면 특정 상품 조회, offset 처리를 넘긴다.
        // count default 10 설정되어 있음
        if (objects?.length < count) {
          state.subsIsLast = true;
        } else {
          if (reset) {
            state.subsOffset = objects?.length;
            state.subsIsLast = false;
          } else state.subsOffset += objects?.length;
          state.subsIsLast = false;
        }

        if (offset === 0) {
          state.subs = objects.sort(sortSubs);
        } else {
          // offset이 0이 아니라면 페이지네이션 중이니 merge로 한다
          state.subs = mergeSubs(state.subs, objects);
        }
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
  subsReload,
  getNotiSubs,
  getOrders,
  getOrderById,
  updateSubsInfo,
  updateSubsAndOrderTag,
  updateSubsGiftStatus,
  cancelDraftOrder,
  changeDraft,
  cmiGetSubsUsage,
};

export type OrderAction = typeof actions;

export default slice.reducer as Reducer<OrderModelState, AnyAction>;
