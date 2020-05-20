import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import { pender } from 'redux-pender/lib/utils';
import productApi from '../../utils/api/productApi'

const  GET_PROD_LIST=      "rokebi/product/GET_PROD_LIST"

export const getProdList = createAction(GET_PROD_LIST, productApi.getProductByCntry)

const initialState = Map({
    prodList: Map()
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
  })

}, initialState)