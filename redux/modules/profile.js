import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender'
import { Map, List } from 'immutable';
import profileApi from '../../utils/api/profileApi'

const  UPDATE_PROFILE_ADDRESS = 'rokebi/order/UPDATE_PROFILE_ADDRESS'
const  GET_CUSTOMER_PROFILE = 'rokebi/order/GET_CUSTOMER_PROFILE'
const  ADD_CUSTOMER_PROFILE = 'rokebi/order/ADD_CUSTOMER_PROFILE'
const  UPDATE_CUSTOMER_PROFILE = 'rokebi/order/UPDATE_CUSTOMER_PROFILE'
const  DELETE_CUSTOMER_PROFILE = 'rokebi/order/DELETE_CUSTOMER_PROFILE'

  // add address list
export const updateProfileAddress = createAction(UPDATE_PROFILE_ADDRESS)
export const getCustomerProfile = createAction(GET_CUSTOMER_PROFILE, profileApi.getCustomerProfile)
export const addCustomerProfile = createAction(ADD_CUSTOMER_PROFILE, profileApi.addCustomerProfile)
export const updateCustomerProfile = createAction(UPDATE_CUSTOMER_PROFILE, profileApi.updateCustomerProfile)
export const delCustomerProfile = createAction(DELETE_CUSTOMER_PROFILE, profileApi.delCustomerProfile)

const initialState = Map({
  selectedAddrIdx: undefined,
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

  [UPDATE_PROFILE_ADDRESS]: (state, action) => {
    console.log('update profile address!! action', action)
    return state.set('addr', {
      ... action.payload,
      // provinceCd : findEngAddress.city[provinceNumber]
    })
  },

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

}, initialState)