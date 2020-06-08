import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { pender } from 'redux-pender/lib/utils';
import productApi from '../../utils/api/productApi'
import utils from '../../utils/utils'
import pageApi from '../../utils/api/pageApi';

const  GET_PROD_LIST=      "rokebi/product/GET_PROD_LIST"
const  GET_LOCAL_OP_LIST=      "rokebi/product/GET_LOCAL_OP_LIST"
export const  GET_PROD_DETAIL=      "rokebi/product/GET_PROD_DETAIL"

const getProd = createAction(GET_PROD_LIST, productApi.getProduct)
const getLocalOp = createAction(GET_LOCAL_OP_LIST, productApi.getLocalOp)
const getProdDetailPage = createAction(GET_PROD_DETAIL, pageApi.getProductDetails)

export const getProdDetail = (controller) => {
  return (dispatch, getState) => {
    const {product} = getState()
    if (product.get('detail') == '') return dispatch(getProdDetailPage(controller))
    return new Promise.resolve()
  }
}

createAction(GET_PROD_DETAIL, pageApi.getProductDetails)

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
    detail: ''
})

export default handleActions({

  ... pender({
    type: GET_PROD_DETAIL,
    onSuccess: (state,action) => {
      const {result, objects} = action.payload

      if ( result == 0 && objects.length > 0) {
        return state.set('detail', objects)
      }
      return state
    }
  }),

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