/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {List as ImmutableList} from 'immutable';
import {AsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AnyAction} from 'redux';

import i18n from '@/utils/i18n';
import {AppDispatch} from '@/store';

export const Toast = {
  NOT_LOADED: i18n.t('toast:failedToLoad'),
  NOT_UPDATED: i18n.t('toast:failedToUpdate'),
  NOT_OPENED: i18n.t('toast:failedToOpen'),
  COPY_SUCCESS: i18n.t('toast:copySuccess'),
};

interface ToastModelState {
  messages: ImmutableList<string>;
}

const initialState: ToastModelState = {
  messages: ImmutableList<string>(),
};

const slice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    init: () => initialState,
    push: (state, action: PayloadAction<string>) => {
      const {messages} = state;
      const newMsg = action.payload || Toast.NOT_LOADED;

      if (!messages.contains(newMsg)) {
        state.messages = messages.push(newMsg);
      }
    },
    remove: (state, action) => {
      const {messages} = state;
      state.messages = messages.remove(0);
    },
  },
});

export const reflectWithToast = <T, S>(
  action: AsyncThunk<T, S, {}>,
  toastType: string,
) => (args: S) => (dispatch: AppDispatch) =>
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
