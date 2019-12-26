import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender'
import { Map, List } from 'immutable';
import orderApi from '../../utils/api/orderApi'

export const  GET_ORDERS = 'rokebi/order/GET_ORDERS'
const  RESET = 'rokebi/order/RESET'

export const getOrders = createAction(GET_ORDERS, orderApi.getOrders)
export const reset = createAction(RESET)

const initialState = Map({
    orders: List(),
})

export default handleActions({
  [RESET]: (state, action) => {
    return state.set('orders', List())
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

}, initialState)