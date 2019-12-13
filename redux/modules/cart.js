import { createAction, handleActions } from 'redux-actions'
import { Map } from 'immutable';
import { pender } from 'redux-pender'
import cartApi from '../../utils/api/cartApi'
import api from '../../utils/api/api';


const SET_CART_TOKEN = 'rokebi/cart/SET_CART_TOKEN'
const CART_FLYOUT_CLOSE = 'rokebi/cart/CART_FLYOUT_CLOSE'
const CART_FLYOUT_OPEN = 'rokebi/cart/CART_FLYOUT_OPEN'
const CART_FETCH = 'rokebi/cart/CART_FETCH'
const MAKE_PAYMENT = 'rokebi/cart/MAKE_PAYMENT'
const MAKE_ORDER = 'rokebi/cart/MAKE_ORDER'
const PURCHASE = 'rokebi/cart/PURCHASE'
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

export const purchase = createAction(PURCHASE)
export const makePayment = createAction(MAKE_PAYMENT, cartApi.makePayment) 
export const makeOrder = createAction(MAKE_ORDER, cartApi.makeOrder) 

export const order = (items) => {
  return (dispatch,getState) => {
    const { account } = getState(),
      auth = {
        token: account.get('token'),
        mail: account.get('email'),
        user: account.get('mobile')
      }

    return dispatch(makeOrder(items, auth))
  }
}

export const cartAddAndGet = (prodList) => {
  return (dispatch) => {
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
    return state .set('result',result)
      .set( 'orderId', objects[0].orderId)
      .set( 'orderItems', objects[0].orderItems)
      .set( 'uuid', objects[0].uuid)
  }
  return state.set('result',result)
}

const onFailure = (state, action) => {
  return state.set('result', api.API_FAILED)
}

const initialState = Map({
  result:0,
  orderId:undefined,
  orderItems:[],
  uuid:undefined,
  purchaseItems:[]
})

export default handleActions({

  // 구매할 품목을 저장한다. 
  [PURCHASE]: (state,action) => {
    // purchaseItems에는 key, qty, price, title 정보 필요
    return state.set('purchaseItems', action.payload)
  },

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
  }),

  ... pender({
    type: MAKE_ORDER,
    onSuccess
  })

}, initialState)
