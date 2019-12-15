import { createAction, handleActions } from 'redux-actions'
import { Map } from 'immutable';
import { pender } from 'redux-pender'
import cartApi from '../../utils/api/cartApi'
import api from '../../utils/api/api';
import i18n from '../../utils/i18n';
import utils from '../../utils/utils';


const SET_CART_TOKEN = 'rokebi/cart/SET_CART_TOKEN'
const CART_FLYOUT_CLOSE = 'rokebi/cart/CART_FLYOUT_CLOSE'
const CART_FLYOUT_OPEN = 'rokebi/cart/CART_FLYOUT_OPEN'
const CART_FETCH = 'rokebi/cart/CART_FETCH'
const MAKE_PAYMENT = 'rokebi/cart/MAKE_PAYMENT'
const MAKE_ORDER = 'rokebi/cart/MAKE_ORDER'
const PURCHASE = 'rokebi/cart/PURCHASE'
const PYM_RESULT = 'rokebi/cart/PYM_RESULT'
const SET_LAST_TAB = 'rokebi/cart/SET_LAST_TAB'
const EMPTY = 'rokebi/cart/EMPTY'

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
export const pymResult = createAction(PYM_RESULT)
export const empty = createAction(EMPTY)

export const setLastTab = createAction(SET_LAST_TAB)

export const payNorder = (result) => {
  return (dispatch,getState) => {
    const { account, cart } = getState(),
      auth = {
        token: account.get('token'),
        mail: account.get('email'),
        user: account.get('mobile')
      }

    // update payment result
    dispatch(pymResult(result))

    // remove ordered items from the cart
    const orderId = cart.get('orderId'),
      orderItems = cart.get('orderItems'),
      purchaseItems = cart.get('purchaseItems')

    purchaseItems.forEach(item => {
      if ( orderItems.findIndex(o => o.orderItemId == item.orderItemId) >= 0) {
        // remove ordered item
        dispatch( cartRemove( orderId, item.orderItemId))
      }
    })

    // make order in the server
    return dispatch(makeOrder( purchaseItems, result, auth))
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
  result: 0,
  orderId: undefined,
  orderItems: [],
  uuid: undefined,
  purchaseItems: [],
  pymReq: undefined,
  pymResult: undefined,
  lastTab: 'HomeStack'
})

export default handleActions({

  // set last tab
  [SET_LAST_TAB]: (state,action) => {
    return state.set('lastTab', action.payload)
  },

  // empty cart
  [EMPTY]: (state,action) => {
    return state.set('purchaseItems', [])
  },

  // 구매할 품목을 저장한다. 
  [PURCHASE]: (state,action) => {
    const {purchaseItems, dlvCost = false} = action.payload,
      total = (purchaseItems || []).reduce((sum, acc) => sum + acc.price * acc.qty, 0),
      pymReq = [
        {
          key: 'total',
          title: i18n.t('price'),
          amount: total
        }
      ]

    if ( dlvCost ) pymReq.push({
      key: 'dlvCost',
      title: i18n.t('cart:dlvCost'),
      amount: utils.dlvCost(total)
    })

    // purchaseItems에는 key, qty, price, title 정보 필요
    return state.set('purchaseItems', purchaseItems)
      .set('pymReq', pymReq)
  },

  // 결제 결과를 저장한다.
  [PYM_RESULT]: (state,action) => {
    const purchaseItems = state.get('purchaseItems')

    // orderItems에서 purchaseItem에 포함된 상품은 모두 제거한다. 
    return state.set('pymResult', action.payload)
      .update('orderItems', value => value.filter(item => purchaseItems.findIndex(p => p.key == item.key) < 0))
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
