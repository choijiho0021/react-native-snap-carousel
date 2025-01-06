/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {retrieveData, storeData} from '@/utils/utils';

export type LogModelState = {
  log: string;
  talkLog: string;
};

export const initLog = createAsyncThunk('log/init', async () => {
  const data = await retrieveData('log');
  return trimLog(data);
});

export const initTalkLog = createAsyncThunk('log/talkInit', async () => {
  const data = await retrieveData('talkLog');
  return trimTalkLog(data);
});

export const appendLog = createAsyncThunk(
  'log/appendLog',
  async (payload: string, {dispatch, getState}) => {
    const {log} = getState() as RootState;

    await storeData('log', trimLog(log.log + payload));
    return payload;
  },
);

export const appendTalkLog = createAsyncThunk(
  'log/appendTalkLog',
  async (payload: string, {dispatch, getState}) => {
    const {log} = getState() as RootState;

    await storeData('talkLog', trimTalkLog(log.talkLog + payload));
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

function trimTalkLog(str: string) {
  if (str.length > 500000) {
    const slice = str.slice(-500000);
    const index = slice.indexOf('$$$');
    if (index !== -1) {
      return slice.slice(index - 500000);
    }
    return slice.slice(-500000);
  }
  return str;
}

const initialState: LogModelState = {
  log: '',
  talkLog: '',
};

const slice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    clear: (state, action) => {
      if (action.payload === 'talkLog') state.talkLog = '';
      else state.log = '';

      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initLog.fulfilled, (state, action) => {
      state.log = action.payload;
    });
    builder.addCase(appendLog.fulfilled, (state, action) => {
      state.log = trimLog(state.log + action.payload);
    });
    builder.addCase(initTalkLog.fulfilled, (state, action) => {
      state.talkLog = action.payload;
    });
    builder.addCase(appendTalkLog.fulfilled, (state, action) => {
      state.talkLog = trimTalkLog(state.talkLog + action.payload);
    });
  },
});

export const actions = {
  ...slice.actions,
};
export type LogAction = typeof actions;

export default slice.reducer as Reducer<LogModelState, AnyAction>;
