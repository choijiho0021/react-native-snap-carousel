/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {retrieveData, storeData} from '@/utils/utils';

export type LogModelState = {
  log: string;
};

export const initLog = createAsyncThunk('log/init', async () => {
  const data = await retrieveData('log');
  return trimLog(data);
});

export const appendLog = createAsyncThunk(
  'log/appendLog',
  async (payload: string, {dispatch, getState}) => {
    const {log} = getState() as RootState;

    await storeData('log', trimLog(log.log + payload));
    return payload;
  },
);

function trimLog(str: string) {
  if (str.length > 300000) {
    const slice = str.slice(-300000);
    const index = slice.indexOf('$$$');
    if (index !== -1) {
      return slice.slice(index - 300000);
    }
    return slice.slice(-300000);
  }
  return str;
}

const initialState: LogModelState = {
  log: '',
};

const slice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    clear: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initLog.fulfilled, (state, action) => {
      state.log = action.payload;
    });
    builder.addCase(appendLog.fulfilled, (state, action) => {
      state.log = trimLog(state.log + action.payload);
    });
  },
});

export const actions = {
  ...slice.actions,
};
export type LogAction = typeof actions;

export default slice.reducer as Reducer<LogModelState, AnyAction>;
