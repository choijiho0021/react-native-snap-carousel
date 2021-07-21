/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {API} from '@/submodules/rokebi-utils';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const updateSimPartner = createAsyncThunk(
  'sim/updateSimPartner',
  API.SimCard.getSimPartnerByID,
);
export const getSimCardList = createAsyncThunk(
  'sim/getSimCardList',
  API.SimCard.get,
);
export interface SimModelState {
  iccid?: string;
  simPartner?: string;
  simList: object[];
}

const initialState: SimModelState = {
  simList: [],
};

const slice = createSlice({
  name: 'sim',
  initialState,
  reducers: {
    addIccid: (state, action) => {
      state.iccid = action.payload.iccid;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getSimCardList.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0 && objects.length > 0) {
        state.simList = objects;
      }
    });

    builder.addCase(updateSimPartner.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0 && objects.length > 0) {
        state.simPartner = objects[0];
      }
    });
  },
});

export const actions = {
  ...slice.actions,
  updateSimPartner,
};

export type SimAction = typeof actions;

export default slice.reducer as Reducer<SimModelState, AnyAction>;
