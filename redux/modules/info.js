import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import _ from 'underscore'
import { pender } from 'redux-pender'
import { API } from 'Rokebi/submodules/rokebi-utils'

const  GET_INFO_LIST =  "rokebi/info/GET_INFO_LIST"
const  GET_HOME_INFO_LIST = "rokebi/info/GET_HOME_INFO_LIST"

export const getInfoList = createAction(GET_INFO_LIST, API.Page.getPageByCategory)
export const getHomeInfoList = createAction(GET_HOME_INFO_LIST, API.Page.getPageByCategory)

const initialState = Map({
  infoList: [],
  homeInfoList: []
})


export default handleActions({

  ... pender({
    type: GET_INFO_LIST,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        return state.set('infoList', objects)
      }
      return state
    }
  }),

  ... pender({
    type: GET_HOME_INFO_LIST,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        return state.set('homeInfoList', objects)
      }
      return state
    }
  }),
}, initialState)