import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { pender } from 'redux-pender/lib/utils';
import productApi from '../../utils/api/productApi'
import utils from '../../utils/utils'

const  GET_PROD_LIST=      "rokebi/product/GET_PROD_LIST"
const  GET_LOCAL_OP_LIST=      "rokebi/product/GET_LOCAL_OP_LIST"

const getProd = createAction(GET_PROD_LIST, productApi.getProduct)
const getLocalOp = createAction(GET_LOCAL_OP_LIST, productApi.getLocalOp)

export const getProdList = () => {
  return (dispatch) => {
    return dispatch(getProd()).then(_ => {
      return dispatch(getLocalOp())
    })
  }
}

export const getProdListWithToast = utils.reflectWithToast(getProdList)

const initialState = Map({
    prodList: Map(),
    localOpList: Map(),
})

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
  }),

  ... pender({
    type: GET_LOCAL_OP_LIST,
    onSuccess: (state,action) => {
      const {result, objects} = action.payload

      if ( result == 0 && objects.length > 0) {
        return state.set('localOpList', Map(objects.map(item => [item.key, item])))
      }
      return state
    }
  })

}, initialState)