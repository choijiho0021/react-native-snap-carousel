import { createAction, handleActions } from 'redux-actions'
import { Map, List } from 'immutable';
import { pender } from 'redux-pender'
import cartApi from '../../utils/api/cartApi'
import rechargeApi from '../../utils/api/rechargeApi'
import api from '../../utils/api/api';
import i18n from '../../utils/i18n';
import utils from '../../utils/utils';

import {getAccount} from './account'


const SET_CART_TOKEN = 'rokebi/cart/SET_CART_TOKEN'
const CART_FLYOUT_CLOSE = 'rokebi/cart/CART_FLYOUT_CLOSE'
const CART_FLYOUT_OPEN = 'rokebi/cart/CART_FLYOUT_OPEN'
const CART_FETCH = 'rokebi/cart/CART_FETCH'
const MAKE_PAYMENT = 'rokebi/cart/MAKE_PAYMENT'
const MAKE_ORDER = 'rokebi/cart/MAKE_ORDER'
const PURCHASE = 'rokebi/cart/PURCHASE'
const PYM_RESULT = 'rokebi/cart/PYM_RESULT'
const PUSH_LAST_TAB = 'rokebi/cart/PUSH_LAST_TAB'
const EMPTY = 'rokebi/cart/EMPTY'
const RESET = 'rokebi/cart/RESET'
const RECHARGE_ACCOUNT = 'rokebi/cart/RECHARGE_ACCOUNT'

export const CART_ADD = 'rokebi/cart/CART_ADD'
export const CART_REMOVE = 'rokebi/cart/CART_REMOVE'
export const CART_UPDATE = 'rokebi/cart/CART_UPDATE'

export const setCartToken = createAction((SET_CART_TOKEN))
export const cartFlyoutOpen = createAction(CART_FLYOUT_OPEN);
export const cartFlyoutClose = createAction(CART_FLYOUT_CLOSE);

export const cartFetch = createAction(CART_FETCH, cartApi.get) 
export const cartAdd = createAction(CART_ADD, cartApi.add) 
export const cartRemove = createAction(CART_REMOVE, cartApi.remove) 
export const cartUpdateQty = createAction(CART_UPDATE, cartApi.updateQty, (... args) => ({abortController:args.abortController})) 

export const purchase = createAction(PURCHASE)
export const makeOrder = createAction(MAKE_ORDER, cartApi.makeOrder) 
export const pymResult = createAction(PYM_RESULT)
export const empty = createAction(EMPTY)
export const reset = createAction(RESET)
export const rechargeAccount = createAction(RECHARGE_ACCOUNT, rechargeApi.add)

export const pushLastTab = createAction(PUSH_LAST_TAB)

export const payNorder = (result) => {
  return (dispatch,getState) => {
    const { account, cart } = getState(),
      token = account.get('token'),
      iccid = account.get('iccid'),
      auth = {
        token, iccid,
        mail: account.get('email'),
        user: account.get('mobile'),
      }

    // update payment result
    dispatch(pymResult(result))

    // remove ordered items from the cart
    const orderId = cart.get('orderId'),
      orderItems = cart.get('orderItems'),
      purchaseItems = cart.get('purchaseItems')

    // make order in the server
    // TODO : purchaseItem에 orderable, recharge가 섞여 있는 경우 문제가 될 수 있음 
    return dispatch(makeOrder( purchaseItems, result, auth)).then(
      resp => {
        if ( resp.result == 0 ) {
          // cart에서 item 삭제 
          orderItems.forEach(item => {
            if ( purchaseItems.findIndex(o => o.orderItemId == item.orderItemId) >= 0) {
              // remove ordered item
              dispatch( cartRemove({orderId, orderItemId:item.orderItemId}))
            }
          })

          if (purchaseItems.findIndex(item => item.type == 'rch') >= 0 || result.rokebi_cash > 0) {
            // 충전을 한 경우에는 account를 다시 읽어들인다.
            // balance에서 차감한 경우에도 다시 읽어들인다.
            return dispatch(getAccount(iccid, {token}))
          }
        }

        return resp
      }
    )
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
  console.log('failed')
  return state.set('result', Api.FAILED)
}

const initialState = Map({
  result: 0,
  orderId: undefined,
  orderItems: [],
  uuid: undefined,
  purchaseItems: [],
  pymReq: undefined,
  pymResult: undefined,
  lastTab: List(['Home'])
})

export default handleActions({

  [RESET]: (state,action) => {
    return initialState
  },

  // set last tab
  // 2개 리스트를 유지한다. 
  [PUSH_LAST_TAB]: (state,action) => {
    if(state.get('lastTab').first() == action.payload) return 

    return state.update('lastTab', value => {
      return (value.unshift(action.payload).setSize(2))})
  },

  // empty cart
  [EMPTY]: (state,action) => {
    return state.set('purchaseItems', [])
  },

  // 구매할 품목을 저장한다. 
  [PURCHASE]: (state,action) => {
    const {purchaseItems, dlvCost = false, balance = 0} = action.payload,
      total = (purchaseItems || []).reduce((sum, acc) => sum + acc.price * (acc.qty || 1), 0),
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

    // 배송비 포함 상품 합계
    const totalPrice = total + (dlvCost && utils.dlvCost(total)),
    // 계산해야하는 총액
    pymPrice = totalPrice > balance ? totalPrice - balance : 0,
    // 잔액 차감
    deduct = (totalPrice > balance) ? balance : totalPrice
    
    // purchaseItems에는 key, qty, price, title 정보 필요
    return state.set('purchaseItems', purchaseItems)
      .set('pymReq', pymReq)
      .set('pymPrice', pymPrice)
      .set('deduct', deduct)
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
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0 && objects[0].orderId == state.get('orderId')) {
        return state.update('orderItems', items => items.filter(item => item.orderItemId != objects[0].orderItemId))
      }
      return state
    }
  }),

  ... pender({
    type: CART_UPDATE,
    onSuccess,
    onCancel: (state, action) => {
      console.log('cancel update', state.toJS())
      return state
    }
  }),

  [CART_UPDATE + '_CANCEL']: (state,action) => {
    if ( action.meta.abortController) action.meta.abortController.abort()
    console.log('cancel update req', state.toJS(), action)
    return state
  },

  ... pender({
    type: MAKE_PAYMENT,
    onSuccess
  }),

  ... pender({
    type: MAKE_ORDER,
    onSuccess
  }),

  ... pender({
    type: RECHARGE_ACCOUNT,
  })

}, initialState)
