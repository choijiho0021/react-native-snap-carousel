import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import _ from 'underscore'
import { pender } from 'redux-pender'
import notiAPI from '../../utils/api/notiApi';

const  GET_NOTI_LIST =  "rokebi/noti/GET_NOTI_LIST"
const  READ_NOTI = "rokebi/noti/READ_NOTI"
const  UPDATE_NOTI =  "rokebi/noti/UPDATE_NOTI"

export const getNotiList = createAction(GET_NOTI_LIST, notiAPI.getNoti)
export const readNoti = createAction(READ_NOTI, notiAPI.read)
export const updateNoti = createAction(UPDATE_NOTI, notiAPI.update)

const initialState = Map({
  notiList: []
})

export default handleActions({

  ... pender({
    type: GET_NOTI_LIST,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        return state.set('notiList', objects)
      }
      return state
    }
  }),
}, initialState)