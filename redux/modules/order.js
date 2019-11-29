import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender'
import { Map, List } from 'immutable';
import orderApi from '../../utils/api/orderApi'

const  UPDATE_ADDRESS = 'rokebi/order/UPDATE_ADDRESS'
const  ADD_DELIVERY_ADDRESS_LIST = 'rokebi/order/ADD_DELIVERY_ADDRESS_LIST'
const  SELECT_ADDRESS = 'rokebi/order/SELECT_ADDRESS'
const  UPDATE_CUSTOMER_PROFILE = 'UPDATE_CUSTOMER_PROFILE'
const  GET_CUSTOMER_PROFILE = 'rokebi/order/GET_CUSTOMER_PROFILE'
const  ADD_CUSTOMER_PROFILE = 'rokebi/order/ADD_CUSTOMER_PROFILE'
export const  GET_ORDERS = 'rokebi/order/GET_ORDERS'

  // add address list
export const addDeliveryAddressList = createAction(ADD_DELIVERY_ADDRESS_LIST)
export const updateAddress = createAction(UPDATE_ADDRESS)
export const selectAddress = createAction(SELECT_ADDRESS) 
export const updateCustomerProfile = createAction(UPDATE_CUSTOMER_PROFILE)
export const getCustomerProfile = createAction(GET_CUSTOMER_PROFILE, orderApi.getCustomerProfile)
export const addCustomerProfile = createAction(ADD_CUSTOMER_PROFILE, orderApi.addCustomerProfile)
export const getOrders = createAction(GET_ORDERS, orderApi.getOrders)

const initialState = Map({
    addrList: List(),
    selectedAddrIdx: undefined,
    orders: List(),
    profile: [],
    addr: {}
})

export default handleActions({
  [ADD_DELIVERY_ADDRESS_LIST]: (state, action) => {
    return state.set('addrList', List(action.payload.addrList))
      .set('selectedAddrIdx', 0)
  },

  [UPDATE_ADDRESS]: (state, action) => {
    return state.update('addrList', list => list.map( item => {
      const payload = action.payload
      return item.uuid == payload.uuid ? {
          title : payload.title || item.title,
          details : payload.details || item.details,
          jibunAddr : payload.jibunAddr || item.jibunAddr,
          mobile : payload.mobile || item.mobile,
          recipient: payload.recipient || item.recipient,
          roadAddr: payload.roadAddr || item.roadAddr,
          phone: payload.phone || item.phone,
          zipNo: payload.zipNo || item.zipNo,
      } : item
    }))
  },

  [SELECT_ADDRESS]: (state, action) => {
    return state.set( 'selectedAddrIdx', state.get('addrList').findIndex(item => item.uuid == action.uuid))
  },

  [UPDATE_CUSTOMER_PROFILE]: (state, action) => {
    console.log('update customer profile!! action', action)
    return state.set('addr', action.payload)
  },

  ... pender({
    type: GET_ORDERS,
    onSuccess: (state, action) => {
      console.log('ACTION Payload', action.payload)
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        return state.set('orders', objects)
      }
      return state
    }
  }),

  ... pender({
    type: GET_CUSTOMER_PROFILE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      console.log('CUSTOMER PROFILE', objects)
      if (result == 0 && objects.length > 0) {
        return state.set('profile', objects)
      }
      return state
    }
  }),

  ... pender({
    type: ADD_CUSTOMER_PROFILE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      console.log('ADD CUSTOMER PROFILE!!', objects)
      if (result == 0 && objects.length > 0) {
        return state.set('profile', objects)
      }
      return state
    }
  })  

}, initialState)