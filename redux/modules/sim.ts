/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {API} from '@/redux/api';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RkbSimCard} from '../api/simCardApi';

export const updateSimPartner = createAsyncThunk(
  'sim/updateSimPartner',
  API.SimCard.getSimPartnerByID,
);
export const getSimCardList = createAsyncThunk(
  'sim/getSimCardList',
  API.SimCard.getSimCardList,
);
export interface SimModelState {
  iccid?: string;
  esimIccid?: string;
  simPartner?: string;
  simList: RkbSimCard[];
}

const initialState: SimModelState = {
  simList: [],
  // esimIccid: '89852340003821181279', 테스트용
};

const slice = createSlice({
  name: 'sim',
  initialState,
  reducers: {
    init: () => {
      return initialState;
    },
    addIccid: (state, action) => {
      state.iccid = action.payload.iccid;
    },
    update: (state, action) => ({
      ...state,
      ...action.payload,
    }),
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
  getSimCardList,
};

export type SimAction = typeof actions;

export default slice.reducer as Reducer<SimModelState, AnyAction>;
