import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender'
import { Map, List } from 'immutable';
import orderApi from '../../utils/api/orderApi'
import subscriptionApi from '../../utils/api/subscriptionApi';

export const GET_ORDERS = 'rokebi/order/GET_ORDERS'
export const GET_USAGE = 'rokebi/order/usage'
export const GET_SUBS_USAGE = 'rokebi/usage/subs' 
export const UPDATE_USAGE = 'rokebi/order/UPDATE_USAGE'
export const UPDATE_SUBS_TO_CASH = 'rokebi/subs/UPDATE_SUBS_TO_CASH'
const  RESET = 'rokebi/order/RESET'

export const getOrders = createAction(GET_ORDERS, orderApi.getOrders)
export const getUsage = createAction(GET_USAGE, subscriptionApi.getSubscription)
export const getSubsUsage = createAction(GET_SUBS_USAGE, subscriptionApi.getSubsUsage)
export const updateUsageStatus = createAction(UPDATE_USAGE, subscriptionApi.updateSubscriptionStatus)
export const updateSubsToCash = createAction(UPDATE_SUBS_TO_CASH, subscriptionApi.toRokebiCash)
export const reset = createAction(RESET)

const initialState = Map({
    orders: [],
    usage: [],
    usageProgress: {}
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
    type: UPDATE_USAGE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      console.log("objects",objects)
    
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
    type: GET_USAGE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      console.log("objects",objects)
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
      console.log("objects",objects)
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
      console.log("objects",objects)
      if (result == 0) {
        return state.set('usage', usage)
      }
      return state
    }
  }),

}, initialState)