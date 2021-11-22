/* eslint-disable no-param-reassign */
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {Reducer} from 'react';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import {RkbInfo} from '@/redux/api/pageApi';
import {API} from '@/redux/api';

const getInfoList = createAsyncThunk(
  'info/getInfoList',
  API.Page.getPageByCategory,
);

const getInfoByTitle = createAsyncThunk(
  'info/getInfoByTitle',
  API.Page.getPageByTitle,
);

const getItem = createAsyncThunk(
  'info/getItem',
  async (cmd: string, {dispatch, getState}) => {
    const {
      info: {infoMap},
    } = getState() as RootState;

    if (infoMap.size === 0) {
      const infoList = await dispatch(getInfoList('info'));
      // getInfoList가 성공한 경우
      if (infoList?.meta?.requestStatus === 'fulfilled') {
        return infoList?.payload?.objects.find((elm) => elm.uuid === cmd);
      }
      return {};
    }

    return infoMap.get('info').find((elm) => elm.uuid === cmd);
  },
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
  getItem,
};

export type InfoAction = typeof actions;

export default slice.reducer as Reducer<InfoModelState, AnyAction>;
