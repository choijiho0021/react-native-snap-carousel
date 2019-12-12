import { createAction, handleActions } from 'redux-actions'
import { Map } from 'immutable';
import { pender } from 'redux-pender'
import cartApi from '../../utils/api/cartApi'


const SET_CART_TOKEN = 'rokebi/cart/SET_CART_TOKEN'
const CART_FLYOUT_CLOSE = 'rokebi/cart/CART_FLYOUT_CLOSE'
const CART_FLYOUT_OPEN = 'rokebi/cart/CART_FLYOUT_OPEN'
const CART_FETCH = 'rokebi/cart/CART_FETCH'
const MAKE_PAYMENT = 'rokebi/cart/MAKE_PAYMENT'
export const CART_ADD = 'rokebi/cart/CART_ADD'
export const CART_REMOVE = 'rokebi/cart/CART_REMOVE'
export const CART_UPDATE = 'rokebi/cart/CART_UPDATE'

export const setCartToken = createAction((SET_CART_TOKEN))
export const cartFlyoutOpen = createAction(CART_FLYOUT_OPEN);
export const cartFlyoutClose = createAction(CART_FLYOUT_CLOSE);

export const cartFetch = createAction(CART_FETCH, cartApi.get) 
export const cartAdd = createAction(CART_ADD, cartApi.add) 
export const cartRemove = createAction(CART_REMOVE, cartApi.remove) 
export const cartUpdate = createAction(CART_UPDATE, cartApi.update) 
export const makePayment = createAction(MAKE_PAYMENT, cartApi.makePayment) 

export const cartAddAndGet = (prodList) => {
  return (dispatch,getState) => {
    const { account } = getState()
    return dispatch(cartAdd(prodList)).then(
      resp => {
        if (resp.result == 0 && resp.objects.length > 0) {
          return dispatch(cartFetch())
        }
        throw new Error('Failed to add products')
      },
      err => {
        throw err
      })
  }
}

const onSuccess = (state, action) => {
  const {result, objects} = action.payload
  if (result == 0 && objects.length > 0) {
    return Map(objects[0]).set('result',result)
  }
  return state.set('result',result)
}

const onFailure = (state,action) => {
  return state.set(result,api.API_FAILED)
}

const initialState = Map({
  result:0
})

export default handleActions({
  ... pender({
    type: CART_FETCH,
    onSuccess
  }),
//onfailure ->api 실패
//onsuccess
  ... pender({
    type: CART_ADD,
    onFailure,
    onSuccess : (state, action) => {
      const {result} = action.payload
      return state.set('result',result)
    }
  }),

  ... pender({
    type: CART_REMOVE,
    onSuccess
  }),

  ... pender({
    type: CART_UPDATE,
    onSuccess
  }),

  ... pender({
    type: MAKE_PAYMENT,
    onSuccess
  })

}, initialState)
