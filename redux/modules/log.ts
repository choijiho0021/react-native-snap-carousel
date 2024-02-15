/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {createSlice} from '@reduxjs/toolkit';

export type LogModelState = {
  log: string;
};

const initialState: LogModelState = {
  log: '',
};

const slice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    append: (state, {payload}) => {
      state.log += payload;
      return state;
    },
    clear: (state) => {
      state.log = '';
      return state;
    },
  },
});

export const actions = {
  ...slice.actions,
};
export type LogAction = typeof actions;

export default slice.reducer as Reducer<LogModelState, AnyAction>;
