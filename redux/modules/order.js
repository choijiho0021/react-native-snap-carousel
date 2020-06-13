import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender'
import { Map } from 'immutable';
import orderApi from '../../utils/api/orderApi'
import subscriptionApi from '../../utils/api/subscriptionApi';
import utils from '../../utils/utils';

export const GET_ORDERS = 'rokebi/order/GET_ORDERS'
export const GET_ORDER_BY_ID = 'rokebi/order/GET_ORDER_BY_ID'
export const CANCEL_ORDER = 'rokebi/order/CANCEL_ORDER'
export const GET_SUBS = 'rokebi/order/GET_SUBS'
export const GET_SUBS_USAGE = 'rokebi/usage/subs' 
export const UPDATE_USAGE = 'rokebi/order/UPDATE_USAGE'
export const UPDATE_SUBS_TO_CASH = 'rokebi/subs/UPDATE_SUBS_TO_CASH'
const  RESET = 'rokebi/order/RESET'

const getNextOrders = createAction(GET_ORDERS, orderApi.getOrders)
export const getOrderById = createAction(GET_ORDER_BY_ID, orderApi.getOrderById)
export const cancelOrder = createAction(CANCEL_ORDER, orderApi.cancelOrder)
export const getSubs = createAction(GET_SUBS, subscriptionApi.getSubscription)
export const getSubsUsage = createAction(GET_SUBS_USAGE, subscriptionApi.getSubsUsage)
export const updateUsageStatus = createAction(UPDATE_USAGE, subscriptionApi.updateSubscriptionStatus)
export const updateSubsToCash = createAction(UPDATE_SUBS_TO_CASH, subscriptionApi.toRokebiCash)
export const reset = createAction(RESET)

export const getSubsWithToast = utils.reflectWithToast(getSubs)

export const checkAndGetOrderById = (auth, orderId) => {
  return (dispatch, getState) => {
    const { order } = getState()

    if ( order.get('ordersIdx').has(orderId)) return new Promise.resolve()
    return dispatch( getOrderById(auth, orderId))
  }
}

export const getOrders = (auth) => {
  return (dispatch, getState) => {
    const { order } = getState()
    const isPageZero = order.get('page') <= 0 || typeof order.get('page') === 'undefined'

    if ( isPageZero ) return dispatch( getNextOrders(auth, 0))
    else if ( order.get('next')) return dispatch( getNextOrders(auth, order.get('page') +1))
    else return new Promise.resolve()
  }
}

const initialState = Map({
  orders: [],
  ordersIdx: Map(),
  usage: [],
  usageProgress: {},
  next: true,
  page: -1
})

function updateOrders( state, action) {
  const {result, objects} = action.payload

  if (result == 0 && objects.length > 0) {
    const orders = state.get('orders')
    let ordersIdx = state.get('ordersIdx')

    // add to the order list if not exist
    objects.forEach(item => {
      if ( ordersIdx.has(item.orderId)) {
        // replace the element
        orders[ordersIdx.get(item.orderId)] = item
      }
      else {
        orders.push(item)
      }
    });

    orders.sort((a, b) => b.orderId - a.orderId).forEach((item, idx) => {
      ordersIdx = ordersIdx.set(item.orderId, idx)
    })
    return state.set('orders', orders).set('ordersIdx', ordersIdx)
  }

  return state
}

export default handleActions({
  [RESET]: () => {
    return initialState
  },

  ... pender({
    type: GET_ORDERS,
    onSuccess: (state, action) => {
      const {objects, links} = action.payload

      return updateOrders(state, action)
        .set('next', objects && objects.length == orderApi.ORDER_PAGE_ITEMS)
        .update('page', page => links && (typeof links[0] !== 'undefined') ? links[0] : page)
    }
  }),

  ... pender({
    type: GET_ORDER_BY_ID,
    onSuccess: (state, action) => {
      return updateOrders(state, action)
    }
  }),

  ... pender({
    type: CANCEL_ORDER,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      console.log('CANCEL_ORDER', result, objects, state, action)

      return state
    }
  }),

  ... pender({
    type: UPDATE_USAGE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
    
      let usage = state.get('usage')
      
      objects.map(elm => {
        const idx = usage.findIndex(item => item.uuid == elm.uuid)

        usage[idx].status = elm.status
        usage[idx].statusCd = elm.statusCd
      })

      if (result == 0) {
        return state.set('usage', usage)
      }
      return state
    }
  }),

  ... pender({
    type: GET_SUBS,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0) {
        return state.set('usage', objects)
      }
      return state
    }
  }),

  ... pender({
    type: GET_SUBS_USAGE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0) {
        return state.set('usageProgress', objects)
      }
      return state
    }
  }),

  ... pender({
    type: UPDATE_SUBS_TO_CASH,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0) {
        return state.set('usage', objects)
      }
      return state
    }
  }),

}, initialState)