import {createAction, handleActions} from 'redux-actions';
import {pender} from 'redux-pender';
import {Map as ImmutableMap} from 'immutable';
import _ from 'underscore';
import {API} from '@/submodules/rokebi-utils';
import {reflectWithToast} from '@/utils/utils';
import {AccountAuthType, getAccount} from './account';
import {AppThunk} from '..';

export const GET_ORDERS = 'rokebi/order/GET_ORDERS';
export const GET_ORDER_BY_ID = 'rokebi/order/GET_ORDER_BY_ID';
export const CANCEL_ORDER = 'rokebi/order/CANCEL_ORDER';
export const GET_SUBS = 'rokebi/order/GET_SUBS';
export const GET_SUBS_USAGE = 'rokebi/usage/subs';
export const UPDATE_SUBS_STATUS = 'rokebi/order/UPDATE_SUBS_STATUS';
const RESET = 'rokebi/order/RESET';

const getNextOrders = createAction(GET_ORDERS, API.Order.getOrders);
export const getOrderById = createAction(
  GET_ORDER_BY_ID,
  API.Order.getOrderById,
);
export const cancelOrder = createAction(CANCEL_ORDER, API.Order.cancelOrder);
export const getSubs = createAction(GET_SUBS, API.Subscription.getSubscription);
export const getSubsUsage = createAction(
  GET_SUBS_USAGE,
  API.Subscription.getSubsUsage,
);
export const updateSubsStatus = createAction(
  UPDATE_SUBS_STATUS,
  API.Subscription.updateSubscriptionStatus,
);
export const reset = createAction(RESET);

export const getSubsWithToast = reflectWithToast(getSubs);

interface OrderModelState {
  orders: object[];
  ordersIdx: ImmutableMap<string, number>;
  subs: object[];
  usageProgress: object;
  next: boolean;
  page: number;
}

export const checkAndGetOrderById = (
  auth: AccountAuthType,
  orderId: string,
): AppThunk => (dispatch, getState) => {
  const {order} = getState();

  if (order.ordersIdx.has(orderId)) return new Promise.resolve();
  return dispatch(getOrderById(auth, orderId));
};

export const getOrders = (auth: AccountAuthType, page: number): AppThunk => (
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
  auth: AccountAuthType,
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
  auth: AccountAuthType,
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

export const actions = {
  reset,
  getSubsWithToast,
  getOrders,
  updateOrders,
  updateStatusAndGetSubs,
  updateSubsStatus,
  cancelAndGetOrder,
};

export type OrderAction = typeof actions;

const initialState: OrderModelState = {
  orders: [],
  ordersIdx: ImmutableMap(),
  subs: [],
  usageProgress: {},
  next: true,
  page: -1,
};

export default handleActions(
  {
    [RESET]: () => {
      return initialState;
    },

    ...pender<OrderModelState>({
      type: GET_ORDERS,
      onSuccess: (state, action) => {
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
      },
    }),

    ...pender<OrderModelState>({
      type: GET_ORDER_BY_ID,
      onSuccess: (state, action) => {
        return updateOrders(state, action);
      },
    }),

    ...pender<OrderModelState>({
      type: CANCEL_ORDER,
      onSuccess: (state, action) => {
        return state;
      },
    }),

    ...pender<OrderModelState>({
      type: UPDATE_SUBS_STATUS,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;

        const {subs} = state;

        if (result === 0) {
          const idx = subs.findIndex(
            (item) => item.key === (objects[0] || {}).key,
          );

          if (!_.isEmpty(idx)) {
            subs[idx].statusCd = objects[0].statusCd;
            subs[idx].status = objects[0].status;
          }
          return {
            ...state,
            subs,
          };
        }
        return state;
      },
    }),

    ...pender<OrderModelState>({
      type: GET_SUBS,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0) {
          return {
            ...state,
            subs: objects,
          };
        }
        return state;
      },
    }),

    ...pender<OrderModelState>({
      type: GET_SUBS_USAGE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0) {
          return {
            ...state,
            usageProgress: objects,
          };
        }
        return state;
      },
    }),
  },
  initialState,
);
