import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender'
import { Map, List } from 'immutable';
import orderApi from '../../utils/api/orderApi'

export const  GET_ORDERS = 'rokebi/order/GET_ORDERS'

export const getOrders = createAction(GET_ORDERS, orderApi.getOrders)

const initialState = Map({
    orders: List(),
})

export default handleActions({
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