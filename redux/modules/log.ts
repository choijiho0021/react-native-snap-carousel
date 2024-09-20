/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {retrieveData, storeData} from '@/utils/utils';
import {AppDispatch} from '@/store';

export type LogModelState = {
  log: string;
};

export const initLog = createAsyncThunk('log/init', async () => {
  const data = await retrieveData('log');
  return data;
});

export const appendLog = createAsyncThunk(
  'log/appendLog',
  async (payload: string, {dispatch, getState}) => {
    const {log} = getState() as RootState;

    await storeData('log', log.log + payload);
    return payload;
  },
);

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
  extraReducers: (builder) => {
    builder.addCase(initLog.fulfilled, (state, action) => {
      state.log = action.payload; // 데이터를 상태에 추가할 수 있습니다.
    });
    builder.addCase(appendLog.fulfilled, (state, action) => {
      state.log += action.payload; // 데이터를 상태에 추가할 수 있습니다.
    });
  },
});

export const actions = {
  ...slice.actions,
};
export type LogAction = typeof actions;

export default slice.reducer as Reducer<LogModelState, AnyAction>;
