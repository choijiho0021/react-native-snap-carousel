import {createAction, handleActions} from 'redux-actions';
import {pender} from 'redux-pender';
import {Map} from 'immutable';
import utils from '../../utils/utils';
import {getAccount} from './account';
import {API} from 'Rokebi/submodules/rokebi-utils';
import _ from 'underscore';

export const GET_ORDERS = 'rokebi/order/GET_ORDERS';
export const GET_ORDER_BY_ID = 'rokebi/order/GET_ORDER_BY_ID';
export const CANCEL_ORDER = 'rokebi/order/CANCEL_ORDER';
export const GET_SUBS = 'rokebi/order/GET_SUBS';
export const GET_SUBS_USAGE = 'rokebi/usage/subs';
export const UPDATE_USAGE = 'rokebi/order/UPDATE_USAGE';
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
  UPDATE_USAGE,
  API.Subscription.updateSubscriptionStatus,
);
export const reset = createAction(RESET);

export const getSubsWithToast = utils.reflectWithToast(getSubs);

export const checkAndGetOrderById = (auth, orderId) => {
  return (dispatch, getState) => {
    const {order} = getState();

    if (order.get('ordersIdx').has(orderId)) return new Promise.resolve();
    return dispatch(getOrderById(auth, orderId));
  };
};

export const getOrders = (auth, page) => {
  return (dispatch, getState) => {
    const {order} = getState();

    if (typeof page !== 'undefined') return dispatch(getNextOrders(auth, page));
    else if (order.get('next'))
      return dispatch(getNextOrders(auth, order.get('page') + 1));
    else return new Promise.resolve();
  };
};

export const cancelAndGetOrder = (orderId, auth) => {
  return (dispatch, getState) => {
    const {account} = getState(),
      iccid = account.get('iccid');

    return dispatch(cancelOrder(orderId, auth)).then(resp => {
      // 결제취소요청 후 항상 order를 가져온다
      return dispatch(getOrderById(auth, orderId)).then(val => {
        if (resp.result == 0) {
          if (val.result == 0) {
            dispatch(getAccount(iccid, auth));
            return val;
          } else {
            return {
              ...val,
              result: 1,
            };
          }
        } else {
          if (val.result == 0) {
            return {
              ...val,
              result: 1,
            };
          } else return resp;
        }
      });
    });
  };
};

// usage status 변환 후
export const updateStatusAndGetSubs = (
  uuid,
  targetStatus,
  auth,
  deact_prod_uuid,
) => {
  return (dispatch, getState) => {
    const {account} = getState(),
      iccid = account.get('iccid');

    return dispatch(
      updateSubsStatus(uuid, targetStatus, auth, deact_prod_uuid),
    ).then(resp => {
      // 결제취소요청 후 항상 order를 가져온다
      if (resp.result == 0) {
        return dispatch(getSubs(iccid, auth));
      } else {
        return resp;
      }
    });
  };
};

const initialState = Map({
  orders: [],
  ordersIdx: Map(),
  usage: [],
  usageProgress: {},
  next: true,
  page: -1,
});

function updateOrders(state, action) {
  const {result, objects} = action.payload;

  if (result == 0 && objects.length > 0) {
    const isPageZero =
        (objects[0] || []).key >= ((state.get('orders')[0] || []).key || -1),
      orders = isPageZero
        ? state.get('orders').slice(0, API.Order.ORDER_PAGE_ITEMS)
        : state.get('orders'),
      page = isPageZero ? -1 : state.get('page');

    let ordersIdx = state.get('ordersIdx');

    // add to the order list if not exist
    objects.forEach(item => {
      if (ordersIdx.has(item.orderId)) {
        // replace the element
        orders[ordersIdx.get(item.orderId)] = item;
      } else {
        orders.push(item);
        ordersIdx = ordersIdx.set(item.orderId, orders.length - 1);
      }
    });

    ordersIdx = Map(
      orders
        .sort((a, b) => b.orderId - a.orderId)
        .map((a, idx) => [a.orderId, idx]),
    );
    return state
      .set('orders', orders)
      .set('ordersIdx', ordersIdx)
      .set('page', page);
  }

  return state;
}

export default handleActions(
  {
    [RESET]: () => {
      return initialState;
    },

    ...pender({
      type: GET_ORDERS,
      onSuccess: (state, action) => {
        const {objects, links} = action.payload;

        return updateOrders(state, action)
          .set('next', objects && objects.length == API.Order.ORDER_PAGE_ITEMS)
          .update('page', page =>
            links && typeof links[0] !== 'undefined' ? links[0] : page,
          );
      },
    }),

    ...pender({
      type: GET_ORDER_BY_ID,
      onSuccess: (state, action) => {
        return updateOrders(state, action);
      },
    }),

    ...pender({
      type: CANCEL_ORDER,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        console.log('CANCEL_ORDER', result, objects, state, action);

        return state;
      },
    }),

    ...pender({
      type: UPDATE_USAGE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;

        let usage = state.get('usage');

        if (result == 0) {
          const idx = usage.findIndex(
            item => item.key == (objects[0] || {}).key,
          );

          if (!_.isEmpty(idx)) {
            usage[idx].statusCd = objects[0].statusCd;
            usage[idx].status = objects[0].status;
          }
          return state.set('usage', usage);
        }
        return state;
      },
    }),

    ...pender({
      type: GET_SUBS,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result == 0) {
          console.log('@@get_subs', result, objects);
          return state.set('usage', objects);
        }
        return state;
      },
    }),

    ...pender({
      type: GET_SUBS_USAGE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result == 0) {
          return state.set('usageProgress', objects);
        }
        return state;
      },
    }),
  },
  initialState,
);
