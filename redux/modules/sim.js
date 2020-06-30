import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import _ from 'underscore'
import { pender } from 'redux-pender'
import { API } from 'Rokebi/submodules/rokebi-utils'

const  ADD_ICCID =          "rokebi/sim/ADD_ICCID"
export const  UPDATE_SIM_PARTNER = "rokebi/sim/UPDATE_SIM_PARTNER"
export const  GET_SIM_CARD_LIST =  "rokebi/sim/GET_SIM_CARD_LIST"

export const addIccid = createAction(ADD_ICCID)
export const updateSimPartner = createAction(UPDATE_SIM_PARTNER, API.SimCard.getSimPartnerByID)
export const getSimCardList = createAction(GET_SIM_CARD_LIST, API.SimCard.get)


const initialState = Map({
  iccid: undefined,
  simPartner: undefined,
  simList: []
})

export default handleActions({
  [ADD_ICCID]: (state, action) => {
    return state.set('iccid', action.payload.iccid)
  },

  ... pender({
    type: GET_SIM_CARD_LIST,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        return state.set('simList', objects)
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