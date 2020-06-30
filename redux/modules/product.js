import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { pender } from 'redux-pender/lib/utils';
import utils from '../../utils/utils'
import { API } from 'Rokebi/submodules/rokebi-utils'

const  GET_PROD_LIST=      "rokebi/product/GET_PROD_LIST"
const  GET_LOCAL_OP_LIST=      "rokebi/product/GET_LOCAL_OP_LIST"
export const  SET_PROD_OF_COUNTRY=      "rokebi/product/SET_PROD_OF_COUNTRY"
export const  SET_SORTED_PROD_LIST=      "rokebi/product/SET_SORTED_PROD_LIST"
export const  GET_PROD_DETAIL=      "rokebi/product/GET_PROD_DETAIL"

const getProd = createAction(GET_PROD_LIST, API.Product.getProduct)
const getLocalOp = createAction(GET_LOCAL_OP_LIST, API.Product.getLocalOp)
const getProdDetailPage = createAction(GET_PROD_DETAIL, API.Page.getProductDetails)
export const setProdOfCountry = createAction(SET_PROD_OF_COUNTRY)
export const setSortedProdList = createAction(SET_SORTED_PROD_LIST)

export const getProdDetail = (controller) => {
  return (dispatch, getState) => {
    const {product} = getState()
    if (product.get('detail') == '') return dispatch(getProdDetailPage(controller))
    return new Promise.resolve()
  }
}

createAction(GET_PROD_DETAIL, API.Page.getProductDetails)

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
    prodOfCountry:[],
    sortedProdList:[],
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
  }),

  [SET_SORTED_PROD_LIST] : (state, action) => {
    return state.set('sortedProdList', action.payload)
  },

  [SET_PROD_OF_COUNTRY] : (state, action) => {
    return state.set('prodOfCountry', action.payload)
  },
}, initialState)