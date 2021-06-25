import {API} from '@/submodules/rokebi-utils';
import {RkbInfo} from '@/submodules/rokebi-utils/api/pageApi';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const getInfoList = createAsyncThunk(
  'info/getInfoList',
  API.Page.getPageByCategory,
);
export const getHomeInfoList = createAsyncThunk(
  'info/getHomeInfoList',
  API.Page.getPageByCategory,
);

export const actions = {
  getInfoList,
  getHomeInfoList,
};

export type InfoAction = typeof actions;

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

export default slice.reducer;
