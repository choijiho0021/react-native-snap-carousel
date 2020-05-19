import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import { pender } from 'redux-pender/lib/utils';
import productApi from '../../utils/api/productApi'

const  ADD_PRODUCT=        "rokebi/product/ADD_PRODUCT"
const  SET_DATE=           "rokebi/product/SET_DATE"
const  UPD_PROD_LSIT=      "rokebi/product/UPD_PROD_LIST"
const  GET_PROD_LIST=      "rokebi/product/GET_PROD_LIST"

export const addProduct = createAction(ADD_PRODUCT)
export const setDate = createAction(SET_DATE)
export const updProdList = createAction(UPD_PROD_LSIT)
export const getProdList = createAction(GET_PROD_LIST, productApi.getProductByCntry)

const initialState = Map({
    uuid: undefined,
    idx: undefined,
    prodList: List(),
})

export default handleActions({
  [ADD_PRODUCT] : (state, action) => {
    return state.set('uuid', action.payload.uuid)
      .set('name', action.payload.name)
  },

  [SET_DATE] : (state, action) => {
    return state.set('startDate', action.payload.date)
  },

  [UPD_PROD_LSIT]: (state, action) => {
    var prodList = action.payload.prodList.reduce((acc, item) => {
        // remove duplicated item
        if ( acc.findIndex(elm => elm.uuid == item.uuid) < 0)
            return acc.concat([item])
        return acc
    }, [])

    return ( prodList.length > 0) ? 
      state.set('prodList', prodList)
        .set('idx', 0)
        .set('name', prodList[0].name)
        .set('uuid', prodList[0].uuid) : state
  },

  ... pender({
    type: GET_PROD_LIST,
    onSuccess: (state,action) => {
      const {result, objects} = action.payload

      if ( result == 0 && objects.length > 0) {
        return state.set('prodList', List(objects))
      }
      return state
    }
  })

}, initialState)