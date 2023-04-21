/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {createSlice} from '@reduxjs/toolkit';

export type ModalModelState = {
  visible: boolean;
  render?: () => React.ReactElement;
};

const initialState: ModalModelState = {
  visible: false,
  render: undefined,
};

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    renderModal: (state, {payload}) => {
      state.visible = true;
      state.render = payload;
      return state;
    },
    closeModal: (state) => {
      state.visible = false;
      state.render = undefined;
      return state;
    },
  },
});

export const actions = {
  ...slice.actions,
};
export type ModalAction = typeof actions;

export default slice.reducer as Reducer<ModalModelState, AnyAction>;
