import {AnyAction} from 'redux';
import {combineReducers} from '@reduxjs/toolkit';
import {ThunkAction} from 'redux-thunk';

import account from './modules/account';
import product from './modules/product';
import noti from './modules/noti';
import order from './modules/order';
import profile from './modules/profile';
import cart from './modules/cart';
import board from './modules/board';
import eventBoard from './modules/eventBoard';
import info from './modules/info';
import sync from './modules/sync';
import toast from './modules/toast';
import promotion from './modules/promotion';
import status from './modules/status';
import link from './modules/link';
import modal from './modules/modal';

const reducers = {
  account,
  product,
  order,
  profile,
  cart,
  noti,
  eventBoard,
  board,
  info,
  sync,
  toast,
  promotion,
  status,
  link,
  modal,
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
