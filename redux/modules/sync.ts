import {createAction, handleActions} from 'redux-actions';
import codePush from 'react-native-code-push';

const INIT = 'rokebi/sync/INIT';
const UPDATE = 'rokebi/sync/UPDATE';
const COMPLETE = 'rokebi/sync/COMPLETE';
const SKIP = 'rokebi/sync/SKIP';
const PROGRESS = 'rokebi/sync/PROGRESS';

export const init = createAction(INIT);
export const update = createAction(UPDATE);
export const complete = createAction(COMPLETE);
export const skip = createAction(SKIP);
export const progress = createAction(PROGRESS);

export const actions = {
  init,
  update,
  complete,
  skip,
  progress,
};
export type SyncAction = typeof actions;

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

export default handleActions(
  {
    [INIT]: (state, action) => {
      return initialState;
    },

    [UPDATE]: (state, action) => {
      const {syncStatus} = action.payload || {};
      return {
        ...state,
        syncStatus,
        isUpdating: [
          codePush.SyncStatus.DOWNLOADING_PACKAGE,
          codePush.SyncStatus.INSTALLING_UPDATE,
        ].includes(syncStatus),
      };
    },
    [COMPLETE]: (state, action) => {
      return {
        ...state,
        isCompleted: true,
        progress: false,
      };
    },
    [SKIP]: (state, action) => {
      return {
        ...state,
        isSkipped: true,
      };
    },
    [PROGRESS]: (state, action) => {
      return {
        ...state,
        progress: true,
      };
    },
  },
  initialState,
);
