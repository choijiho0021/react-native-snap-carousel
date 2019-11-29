import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import _ from 'underscore'
import { pender } from 'redux-pender'
import simCardApi from '../../utils/api/simCardApi';

const  ADD_ICCID =          "rokebi/sim/ADD_ICCID"
export const  UPDATE_SIM_PARTNER = "rokebi/sim/UPDATE_SIM_PARTNER"
const  ADD_SIM_TO_CART =    "rokebi/sim/ADD_SIM_TO_CART"
const  UPDATE_SIM_CARD_LIST =  "rokebi/sim/UPDATE_SIM_CARD_LIST"
export const  GET_SIM_CARD_LIST =  "rokebi/sim/GET_SIM_CARD_LIST"

export const addIccid = createAction(ADD_ICCID)
export const updateSimPartner = createAction(UPDATE_SIM_PARTNER, simCardApi.getSimPartnerByID)
export const addSimToCart = createAction(ADD_SIM_TO_CART)
export const updateSimCardList = createAction(UPDATE_SIM_CARD_LIST)
export const getSimCardList = createAction(GET_SIM_CARD_LIST, simCardApi.get)


const initialState = Map({
  iccid: undefined,
  simPartner: undefined,
  simList: List(),
  cart: List(),
})

export default handleActions({
  [ADD_ICCID]: (state, action) => {
    return state.set('iccid', action.payload.iccid)
  },

  [ADD_SIM_TO_CART]: (state, action) => {
    // find sim card data
    if ( state.get('simList').findIndex(item => item.uuid === action.payload.uuid) < 0) return state

    let cart = state.get('cart')
    const idx = cart.findIndex(item => item.uuid === action.uuid)
    // new item to the cart
    if ( idx >= 0) cart = cart.delete(idx)

    return state.set('cart', cart.push(action.payload))
  },

  [UPDATE_SIM_CARD_LIST]: (state, action) => {
    return _.isArray(action.payload.list) ? state.set('simList', action.payload.simList) : state
  },

  ... pender({
    type: GET_SIM_CARD_LIST,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        return state.set('simList', List(action.payload.objects))
      }
      return state
    }
  }),

  ... pender({
    type: UPDATE_SIM_PARTNER,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        return state.set('simPartner', objects[0])
      }
      return state
    }
  })

}, initialState)