import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender'
import { Map, List } from 'immutable';
import orderApi from '../../utils/api/orderApi'
import findEngAddress from '../../utils/findEngAddress';

const  UPDATE_ADDRESS = 'rokebi/order/UPDATE_ADDRESS'
const  ADD_DELIVERY_ADDRESS_LIST = 'rokebi/order/ADD_DELIVERY_ADDRESS_LIST'
const  SELECT_ADDRESS = 'rokebi/order/SELECT_ADDRESS'
const  UPDATE_PROFILE_ADDRESS = 'rokebi/order/UPDATE_PROFILE_ADDRESS'
const  GET_CUSTOMER_PROFILE = 'rokebi/order/GET_CUSTOMER_PROFILE'
const  ADD_CUSTOMER_PROFILE = 'rokebi/order/ADD_CUSTOMER_PROFILE'
const  UPDATE_CUSTOMER_PROFILE = 'rokebi/order/UPDATE_CUSTOMER_PROFILE'
const  DELETE_CUSTOMER_PROFILE = 'rokebi/order/DELETE_CUSTOMER_PROFILE'
export const  GET_ORDERS = 'rokebi/order/GET_ORDERS'

  // add address list
export const addDeliveryAddressList = createAction(ADD_DELIVERY_ADDRESS_LIST)
export const updateAddress = createAction(UPDATE_ADDRESS)
export const selectAddress = createAction(SELECT_ADDRESS) 
export const updateProfileAddress = createAction(UPDATE_PROFILE_ADDRESS)
export const getCustomerProfile = createAction(GET_CUSTOMER_PROFILE, orderApi.getCustomerProfile)
export const addCustomerProfile = createAction(ADD_CUSTOMER_PROFILE, orderApi.addCustomerProfile)
export const updateCustomerProfile = createAction(UPDATE_CUSTOMER_PROFILE, orderApi.updateCustomerProfile)
export const delCustomerProfile = createAction(DELETE_CUSTOMER_PROFILE, orderApi.delCustomerProfile)
export const getOrders = createAction(GET_ORDERS, orderApi.getOrders)

const initialState = Map({
    addrList: List(),
    selectedAddrIdx: undefined,
    orders: List(),
    profile: [],
    addr: {}
})

export const profileDelAndGet = (uuid ,account) => {
  return (dispatch,getState) => {
    
    return dispatch(delCustomerProfile(uuid ,account)).then(
      resp => {
        if (resp.result == 0 ) {
          return dispatch(getCustomerProfile(account))
        }
        throw new Error('Failed to delete Profile')
      },
      err => {
        throw err
      })
  }
}


export default handleActions({
  [ADD_DELIVERY_ADDRESS_LIST]: (state, action) => {
    return state.set('addrList', List(action.payload.addrList))
      .set('selectedAddrIdx', 0)
  },

  // redux에만 저장.
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

  [UPDATE_PROFILE_ADDRESS]: (state, action) => {
    console.log('update profile address!! action', action)
    return state.set('addr', {
      ... action.payload,
      // provinceCd : findEngAddress.city[provinceNumber]
    })
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
      
      if (result == 0 && objects.length > 0) {
        return state.set('profile', 
          objects.filter(item => item.isBasicAddr).concat(objects.filter(item => !item.isBasicAddr)))
      }
      return state
    }
  }),

  ... pender({
    type: ADD_CUSTOMER_PROFILE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload

      if (result == 0 && objects.length > 0) {
        return state.update('profile', 
          value => objects[0].isBasicAddr ? objects.concat(value) : value.concat(objects))  
      }
      return state
    }
  }),

  ... pender({
    type: UPDATE_CUSTOMER_PROFILE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload

      if (result == 0 && objects.length > 0) {
        console.log('pender update', objects)
        const profile = state.get('profile')
        const idx = profile.findIndex(item => item.uuid == objects[0].uuid)
        profile[idx] = objects[0]

        return state.update('profile', 
          value => value.filter(item => item.isBasicAddr).concat(value.filter(item => !item.isBasicAddr)))
      }
      return state
    }
  }),    

  // ... pender({
  //   type: DELETE_CUSTOMER_PROFILE,
  //   onSuccess: (state, action) => {
  //     const {result, objects} = action.payload

  //     if (result == 0) {
  //       return state.update('profile', 
  //         value => value.filter(item => item.uuid != objects[0].uuid))
  //     }
  //     return state
  //   }
  // }),  

}, initialState)