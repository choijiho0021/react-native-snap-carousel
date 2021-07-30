/* eslint-disable no-param-reassign */
import {API} from '@/redux/api';
import {RkbInfo} from '@/redux/api/pageApi';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Reducer} from 'react';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';

const getInfoList = createAsyncThunk(
  'info/getInfoList',
  API.Page.getPageByCategory,
);

const getInfoByTitle = createAsyncThunk(
  'info/getInfoByTitle',
  API.Page.getPageByTitle,
);

export interface InfoModelState {
  infoMap: ImmutableMap<string, RkbInfo[]>;
}

const initialState: InfoModelState = {
  infoMap: ImmutableMap<string, RkbInfo[]>(),
};

const slice = createSlice({
  name: 'info',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getInfoList.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0) {
        state.infoMap = state.infoMap.set(action.meta.arg, objects || []);
      }
    });
    builder.addCase(getInfoByTitle.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0) {
        state.infoMap = state.infoMap.set(action.meta.arg, objects || []);
      }
    });
  },
});

export const actions = {
  getInfoList,
  getInfoByTitle,
};

export type InfoAction = typeof actions;

export default slice.reducer as Reducer<InfoModelState, AnyAction>;
