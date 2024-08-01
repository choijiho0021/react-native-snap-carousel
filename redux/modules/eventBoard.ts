/* eslint-disable no-param-reassign */
import {AnyAction} from 'redux';
import {Reducer} from 'redux-actions';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {API} from '@/redux/api';
import {RkbEventBoard, RkbEventIssue} from '../api/eventBoardApi';
import {actions as ToastActions} from './toast';

const postEventIssue = createAsyncThunk(
  'eventBoard/postIssue',
  API.EventBoard.post,
);
const postEventAttach = createAsyncThunk(
  'eventBoard/postAttach',
  API.EventBoard.uploadAttachment,
);
const fetchEventIssueList = createAsyncThunk(
  'eventBoard/fetchIssueList',
  API.EventBoard.getIssueList,
);
const getEventIssueResp = createAsyncThunk(
  'eventBoard/getIssueResp',
  API.Board.getComments,
);

// 10 items per page
const PAGE_LIMIT = 10;
const PAGE_UPDATE = 0;

const postAndGetList = createAsyncThunk(
  'eventBoard/postAndGetList',
  (issue: RkbEventIssue, {dispatch, getState}) => {
    const {
      account: {uid, mobile, token},
    } = getState() as RootState;

    return dispatch(
      postEventAttach({images: issue.images, user: mobile, token}),
    ).then(({payload}) => {
      if (payload?.find((p) => p.result !== 0)) {
        dispatch(
          ToastActions.push({
            msg: 'event:fail:loading',
            toastIcon: 'bannerMarkToastError',
          }),
        );
        return Promise.reject(new Error('failed to post images'));
      }
      const images = payload ? payload.map((item) => item.objects[0]) : [];
      return dispatch(postEventIssue({...issue, images, token})).then(
        ({payload: resp}) => {
          if (resp.result === 0 && resp.objects.length > 0) {
            return dispatch(fetchEventIssueList({uid, token}));
          }
          return Promise.reject(new Error('failed to post issue'));
        },
        (err) => {
          return Promise.reject(new Error(`failed to post issue: ${err}`));
        },
      );
    });
  },
);

export interface EventBoardModelState {
  next: boolean;
  page: number;
  list: RkbEventBoard[];
  comment?: string;
}

const initialState: EventBoardModelState = {
  next: true,
  page: 0,
  list: [],
};

const slice = createSlice({
  name: 'eventBoard',
  initialState,
  reducers: {
    noMoreIssues: (state) => {
      return state;
    },

    nextIssueList: (state) => {
      state.page += 1;
    },

    resetIssueList: (state) => {
      state.next = true;
      state.page = 0;
      state.list = [];
    },

    resetIssueComment: (state) => {
      state.comment = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEventIssueList.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      const {list} = state;

      if (result === 0 && objects.length > 0) {
        // Status가 변경된 item을 찾아서 변경해 준다.
        const changedList = list.map((item) => {
          const findObjects = objects.find((org) => org.uuid === item.uuid);
          return findObjects !== undefined &&
            item.statusCode !== findObjects.statusCode
            ? findObjects
            : item;
        });

        const newList = objects.filter(
          (item) => changedList.findIndex((org) => org.uuid === item.uuid) < 0,
        );

        state.list = changedList
          .concat(newList)
          .sort((a, b) => (a.created < b.created ? 1 : -1));
        state.next =
          newList.length === PAGE_LIMIT || newList.length === PAGE_UPDATE;
      } else {
        state.next = false;
      }
    });

    builder.addCase(getEventIssueResp.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0) {
        // object.length == 0인 경우에도 comment를 overwrite 한다.
        state.comment = objects;
      }
    });
  },
});

const getIssueList = createAsyncThunk(
  'eventBoard/getIssueList',
  (reloadAlways = true, {dispatch, getState}) => {
    const {account, eventBoard} = getState() as RootState;
    const {uid, token} = account;

    if (reloadAlways) {
      dispatch(slice.actions.resetIssueList());
      return dispatch(fetchEventIssueList({uid, token, page: 0}));
    }

    // reloadAlways == false 이면 list가 비어있는 경우에만 다시 읽는다.
    if (eventBoard.list.length === 0)
      return dispatch(fetchEventIssueList({uid, token, page: 0}));

    return Promise.resolve();
  },
);

const getNextIssueList = createAsyncThunk(
  'eventBoard/getNextIssueList',
  (param, {dispatch, getState}) => {
    const {account, eventBoard, status} = getState() as RootState;
    const {uid, token} = account;
    const {next, page} = eventBoard;

    if (next && !status.pending[fetchEventIssueList.typePrefix]) {
      dispatch(slice.actions.nextIssueList());
      return dispatch(fetchEventIssueList({uid, token, page: page + 1}));
    }

    // no more list
    return dispatch(slice.actions.noMoreIssues());
  },
);

export const actions = {
  ...slice.actions,
  getIssueList,
  getNextIssueList,
  postAndGetList,
  postEventIssue,
  postEventAttach,
  fetchEventIssueList,
  getEventIssueResp,
};

export type EventBoardAction = typeof actions;

export default slice.reducer as Reducer<EventBoardModelState, AnyAction>;
