import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { pender } from 'redux-pender/lib/utils';
import productApi from '../../utils/api/productApi'
import * as ToastActions from './toast'

const  GET_PROD_LIST=      "rokebi/product/GET_PROD_LIST"

export const getProdList = createAction(GET_PROD_LIST, productApi.getProductByCntry)

const initialState = Map({
    prodList: Map()
})

const reflectWithToast =  (action) => (...args) => {
  return (dispatch, getState) => { 
    return dispatch(action(...args)).then(
      resp => {
        if (resp.result !== 0) {
          dispatch(ToastActions.push())
        }
        return resp
      },
      err => {
        dispatch(ToastActions.push())
        return err
      }
    )
  }
}

export const getProdListWithToast = reflectWithToast(getProdList)

export default handleActions({

  ... pender({
    type: GET_PROD_LIST,
    onSuccess: (state,action) => {
      const {result, objects} = action.payload

      if ( result == 0 && objects.length > 0) {
        return state.set('prodList', Map(objects.map(item => [item.key, item])))
      }
      return state
    }
  })

}, initialState)