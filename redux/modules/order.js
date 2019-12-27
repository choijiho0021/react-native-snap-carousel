import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender'
import { Map, List } from 'immutable';
import orderApi from '../../utils/api/orderApi'
import subscriptionApi from '../../utils/api/subscriptionApi';

export const  GET_ORDERS = 'rokebi/order/GET_ORDERS'
export const GET_USAGE = 'rokebi/order/usage'
const  RESET = 'rokebi/order/RESET'

export const getOrders = createAction(GET_ORDERS, orderApi.getOrders)
export const getUsage = createAction(GET_USAGE, subscriptionApi.getSubscription)
export const reset = createAction(RESET)

const initialState = Map({
    orders: [],
    usage: []
})

export default handleActions({
  [RESET]: (state, action) => {
    return state.set('orders', []).set('usage', [])
  },

  ... pender({
    type: GET_ORDERS,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        return state.set('orders', objects)
      }
      return state
    }
  }),

  ... pender({
    type: GET_USAGE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        return state.set('usage', objects)
      }
      return state
    }
  }),

}, initialState)