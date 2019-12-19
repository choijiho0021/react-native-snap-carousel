import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import _ from 'underscore'
import { pender } from 'redux-pender'
import pageApi from '../../utils/api/pageApi';

const  GET_INFO_LIST =  "rokebi/info/GET_INFO_LIST"

export const getInfoList = createAction(GET_INFO_LIST, pageApi.getPageByCategory)

const initialState = Map({
  infoList: []
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
}, initialState)