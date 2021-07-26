/* eslint-disable no-param-reassign */
import {API} from '@/redux/api';
import {RkbInfo} from '@/redux/api/pageApi';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Reducer} from 'react';
import {AnyAction} from 'redux';

const getInfoList = createAsyncThunk(
  'info/getInfoList',
  API.Page.getPageByCategory,
);
const getHomeInfoList = createAsyncThunk(
  'info/getHomeInfoList',
  API.Page.getPageByCategory,
);

export interface InfoModelState {
  infoList: RkbInfo[];
  homeInfoList: RkbInfo[];
}

const initialState: InfoModelState = {
  infoList: [],
  homeInfoList: [],
};

const slice = createSlice({
  name: 'info',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getInfoList.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0) {
        state.infoList = objects || [];
      }
    });
    builder.addCase(getHomeInfoList.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0) {
        state.homeInfoList = objects || [];
      }
    });
  },
});

export const actions = {
  getInfoList,
  getHomeInfoList,
};

export type InfoAction = typeof actions;

export default slice.reducer as Reducer<InfoModelState, AnyAction>;
