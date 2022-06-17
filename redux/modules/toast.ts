/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AnyAction} from 'redux';

import {AppDispatch} from '@/store';

export const Toast = {
  NOT_LOADED: 'toast:failedToLoad',
  NOT_UPDATED: 'toast:failedToUpdate',
  NOT_OPENED: 'toast:failedToOpen',
  COPY_SUCCESS: 'toast:copySuccess',
};

interface ToastModelState {
  messages: string[];
}

const initialState: ToastModelState = {
  messages: [],
};

const slice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    init: () => initialState,
    push: (state, action: PayloadAction<string>) => {
      const {messages} = state;
      const newMsg = action.payload || Toast.NOT_LOADED;

      if (!messages.includes(newMsg)) {
        state.messages = messages.concat(newMsg);
      }
    },
    remove: (state) => {
      state.messages = state.messages.slice(1);
    },
  },
});

export const reflectWithToast =
  <T, S>(action: AsyncThunk<T, S, {}>, toastType: string) =>
  (args: S) =>
  (dispatch: AppDispatch) =>
    dispatch(action(args)).then(
      (resp) => {
        const result = resp.payload ? resp.payload.result : resp.result;
        if (result !== 0) {
          dispatch(slice.actions.push(toastType));
        }
        return resp;
      },
      (err) => {
        dispatch(slice.actions.push(toastType));
        return err;
      },
    );

export const actions = {...slice.actions, reflectWithToast};
export type ToastAction = typeof actions;

export default slice.reducer as Reducer<ToastModelState, AnyAction>;
