import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender'
import { Map, List } from 'immutable';
import profileApi from '../../utils/api/profileApi'

const  UPDATE_PROFILE_ADDRESS = 'rokebi/order/UPDATE_PROFILE_ADDRESS'
const  GET_CUSTOMER_PROFILE = 'rokebi/order/GET_CUSTOMER_PROFILE'
const  ADD_CUSTOMER_PROFILE = 'rokebi/order/ADD_CUSTOMER_PROFILE'
const  UPDATE_CUSTOMER_PROFILE = 'rokebi/order/UPDATE_CUSTOMER_PROFILE'
const  DELETE_CUSTOMER_PROFILE = 'rokebi/order/DELETE_CUSTOMER_PROFILE'
const  SELECTED_ADDR = 'rokebi/order/SELECTED_ADDR'

  // add address list
export const updateProfileAddress = createAction(UPDATE_PROFILE_ADDRESS)
export const getCustomerProfile = createAction(GET_CUSTOMER_PROFILE, profileApi.getCustomerProfile)
export const addCustomerProfile = createAction(ADD_CUSTOMER_PROFILE, profileApi.addCustomerProfile)
export const updateCustomerProfile = createAction(UPDATE_CUSTOMER_PROFILE, profileApi.updateCustomerProfile)
export const delCustomerProfile = createAction(DELETE_CUSTOMER_PROFILE, profileApi.delCustomerProfile)
export const selectedAddr = createAction(SELECTED_ADDR)

const initialState = Map({
  // selectedAddrIdx: undefined,
  selectedAddr: undefined,
  profile: [],
  addr: {}
})

export const profileDelAndGet = (uuid ,auth) => {
  return (dispatch,getState) => {
    const {profile} = getState()
    const deleted = profile.get('profile').find(item => item.uuid == uuid)
    const updateProfile = profile.get('profile').find(item => item.uuid != uuid)
    
    return dispatch(delCustomerProfile(uuid ,auth)).then(
      resp => {
        if (resp.result == 0 ) {
          
          if( deleted && deleted.isBasicAddr && updateProfile) {
            return dispatch(updateCustomerProfile({
              ...updateProfile,
              isBasicAddr: true
            }, auth)).then(
              res => {
              return dispatch(getCustomerProfile(auth))
              }
            )
          }
          return dispatch(getCustomerProfile(auth))
        }
        throw new Error('Failed to delete Profile')
      },
      err => {
        throw err
      })
  }
}


export const profileAddAndGet = (profile, defaultProfile, auth) => {
  return (dispatch,getState) => {
    
    return dispatch(addCustomerProfile(profile, defaultProfile, auth)).then(
      resp => {
        return dispatch(getCustomerProfile(auth))     
      },
      err => {
        throw err
      })
  }
}

const _sortProfile = (a,b) => a.isBasicAddr ? -1 : b.isBasicAddr ? 1 : a.alias.localeCompare(b.alias)

export default handleActions({

  // addr uuid
  [SELECTED_ADDR]: (state,action) => {
    return state.set('selectedAddr', action.payload)
  },  

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
      
      if (result == 0 && objects.length >= 0) {
        // const list = state.get('profile')
        // const idx = list.findIndex(item => item.isBasicAddr)
        // if(idx>0){
        //   const tmp = Object.assign({}, list[0])
        //   list[0] = list[idx]
        //   list[idx] = tmp
        // }

        // const list = state.get('profile')
        // const idx = list.findIndex(item => item.isBasicAddr)
        // if(idx > 0){

          return state.set('profile', objects.sort(_sortProfile))
        // }
      }
      return state
    }
  }),

  ... pender({
    type: ADD_CUSTOMER_PROFILE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload

      console.log('@@@@@ pender')
      if (result == 0 && objects.length > 0) {
        return state.update('profile', 
          value => objects.concat(value).sort(_sortProfile))  
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