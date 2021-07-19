import {AnyAction} from 'redux';
import {combineReducers} from '@reduxjs/toolkit';
import {ThunkAction} from 'redux-thunk';

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
import status from './modules/status';

const reducers = {
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
  status,
  pender: penderReducer,
};

type BaseReducerMap<S> = {
  [K in keyof S]: (state: S[K], action: any) => S;
};

export type InferRootState<ReducerMap extends BaseReducerMap<S>, S = any> = {
  [K in keyof ReducerMap]: ReturnType<ReducerMap[K]>;
};
export type RootState = InferRootState<typeof reducers>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

/*
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

export type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;
export function isPendingAction(action: AnyAction): action is PendingAction {
  return action.type.endsWith('/pending');
}
*/

export default combineReducers(reducers);
