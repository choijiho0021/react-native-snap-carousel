import {combineReducers} from 'redux';
import {penderReducer} from 'redux-pender';
import account from './modules/account';
import product from './modules/product';
import sim from './modules/sim';
import noti from './modules/noti';
import order from './modules/order';
import profile from './modules/profile';
import cart from './modules/cart';
import board from './modules/board';
import info from './modules/info';
import sync from './modules/sync';
import toast from './modules/toast';
import promotion from './modules/promotion';

export default combineReducers({
  account,
  product,
  sim,
  order,
  profile,
  cart,
  noti,
  board,
  info,
  sync,
  toast,
  promotion,
  pender: penderReducer,
});
