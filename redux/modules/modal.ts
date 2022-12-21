/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'underscore';
import {ReactElement} from 'react';

export type ModalModelState = {
  visible?: boolean;
  content?: ReactElement<any, any>;
};

const updateModalState = (state: ModalModelState, payload: ModalModelState) => {
  const newState = _.clone(state);
  newState.visible = payload.visible;
  newState.content = payload.content;

  return newState;
};

const initialState: ModalModelState = {
  visible: false,
  content: undefined,
};

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<ModalModelState>) => {
      return updateModalState(state, {...action.payload, visible: true});
    },
    closeModal: () => {
      return {visible: false, content: undefined};
    },
    resetModal: (state) => ({
      ...initialState,
      ...state,
    }),
  },
});

export const actions = {
  ...slice.actions,
};
export type ModalAction = typeof actions;

export default slice.reducer as Reducer<ModalModelState, AnyAction>;
