import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import _ from 'underscore'
import { pender } from 'redux-pender'
import notiAPI from '../../utils/api/notiApi';

const  GET_NOTI_LIST =  "rokebi/noti/GET_NOTI_LIST"
const  READ_NOTI = "rokebi/noti/READ_NOTI"
const  UPDATE_NOTI =  "rokebi/noti/UPDATE_NOTI"
const  INIT = "rokebi/noti/INIT"

export const getNotiList = createAction(GET_NOTI_LIST, notiAPI.getNoti)
export const readNoti = createAction(READ_NOTI, notiAPI.read)
export const updateNoti = createAction(UPDATE_NOTI, notiAPI.update)
export const init = createAction(INIT)

export const notiReadAndGet = (uuid,mobile,auth) => {
  return (dispatch,getState) => {
    return dispatch(readNoti(uuid,auth)).then(
      resp => {
        if (resp.result == 0 && resp.objects.length > 0) {
          return dispatch(getNotiList(mobile))
        }
        throw new Error('Failed to read Noti and Get notiList')
      },
      err => {
        throw err
      })
  }
}

const initialState = Map({
  notiList: []
})


export default handleActions({

  [INIT] : (state, action) => {
    return initialState
  },

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