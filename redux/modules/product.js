import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';

const  ADD_PRODUCT=        "rokebi/product/ADD_PRODUCT"
const  SET_DATE=           "rokebi/product/SET_DATE"
const  SEL_CNTRY=          "rokebi/product/SEL_CNTRY"
const  UPD_PROD_LSIT=      "rokebi/product/UPD_PROD_LIST"
const  INS_TO_CART=        "rokebi/product/INS_TO_CART"
const  DEL_FROM_CART=      "rokebi/product/DEL_FROM_CART"
const  CHG_PROD_QTY=       "rokebi/product/CHG_PROD_QTY"

export const addProduct = createAction(ADD_PRODUCT)
export const setDate = createAction(SET_DATE)
export const selectCountry = createAction(SEL_CNTRY)
export const updProdList = createAction(UPD_PROD_LSIT)
export const insProdToCart = createAction(INS_TO_CART)
export const delProdFromCart = createAction(DEL_FROM_CART)
export const chgProdQty = createAction(CHG_PROD_QTY)

export const prodInfo = ({uuid, prodList}) => {
  const idx = prodList && prodList.findIndex(item => item.uuid == uuid)
  return (idx >= 0) ? {
    variationId: prodList[idx].variationId,
    qty: 1
  } : {}
}


const initialState = Map({
    name: undefined,    // selected product name
    startDate: undefined,
    uuid: undefined,
    idx: undefined,
    prodList: List(),
    cart: List(),
})

export default handleActions({
  [ADD_PRODUCT] : (state, action) => {
    return state.set('uuid', action.payload.uuid)
      .set('name', action.payload.name)
  },

  [SET_DATE] : (state, action) => {
    return state.set('startDate', action.payload.date)
  },

  [SEL_CNTRY]: (state, action) => {
    // 로밍 국가를 선택한 경우이다. product name, start date를 초기화한다 
    const idx = state.get('prodList').findIndex(item => item.uuid == action.payload.uuid)
    if ( idx.length >= 0) {
      state = state.set('name', idx[0].name)
    }

    return state.set('uuid', action.payload.uuid)
      .set('idx', idx)
      .set('startDate', (new Date()).toISOString().split('T')[0])
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

  [INS_TO_CART]: (state, action) => {
    // 현재 state.uuid가 가리키는 상품을 카트에 넣는다. 
    const uuid = state.get('uuid'),
      newElm = {
        uuid,
        qty: 1,
        startDate: state.get('startDate'),
      }

    let cart = state.get('cart')
    const idx = cart.findIndex(item => item.uuid == uuid)
    if (idx >= 0) cart = cart.delete(idx)
    return state.set('cart', cart.push(newElm))
  },

  [DEL_FROM_CART]: (state, action) => {
    return state.update('cart', cart => cart.filter(item => item.uuid !== action.payload.uuid))
  },

  [CHG_PROD_QTY]: (state, action) => {
    return state.update('cart', cart => cart.map(item => item.uuid == action.payload.uuid ? 
      { ... item, qty:action.payload.qty} : item))
  }


}, initialState)