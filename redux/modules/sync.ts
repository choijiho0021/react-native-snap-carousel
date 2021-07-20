/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import codePush from 'react-native-code-push';
import {AnyAction} from 'redux';
import {createSlice} from '@reduxjs/toolkit';

export interface SyncModelState {
  syncStatus?: codePush.SyncStatus;
  isCompleted: boolean;
  isUpdating: boolean;
  isSkipped: boolean;
  progress: boolean;
}

const initialState: SyncModelState = {
  isCompleted: false,
  isUpdating: false,
  isSkipped: false,
  progress: false,
};

const slice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    init: () => {
      return initialState;
    },
    update: (state, action) => {
      const {syncStatus} = action.payload || {};
      state.syncStatus = syncStatus;
      state.isUpdating = [
        codePush.SyncStatus.DOWNLOADING_PACKAGE,
        codePush.SyncStatus.INSTALLING_UPDATE,
      ].includes(syncStatus);
    },
    complete: (state) => {
      state.isCompleted = true;
      state.progress = false;
    },
    skip: (state) => {
      state.isSkipped = true;
    },
    progress: (state) => {
      state.progress = true;
    },
  },
});

export const {actions} = slice;
export type SyncAction = typeof actions;
export default slice.reducer as Reducer<SyncModelState, AnyAction>;
