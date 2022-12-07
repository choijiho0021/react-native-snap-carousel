/* eslint-disable no-param-reassign */
import {AnyAction} from 'redux';
import {Reducer} from 'redux-actions';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {API} from '@/redux/api';
import {RkbBoard, RkbIssue} from '@/redux/api/boardApi';

const postIssue = createAsyncThunk('board/postIssue', API.Board.post);
const postAttach = createAsyncThunk(
  'board/postAttach',
  API.Board.uploadAttachment,
);
const fetchIssueList = createAsyncThunk(
  'board/fetchIssueList',
  API.Board.getIssueList,
);
const getIssueResp = createAsyncThunk(
  'board/getIssueResp',
  API.Board.getComments,
);

// 10 items per page
const PAGE_LIMIT = 10;
const PAGE_UPDATE = 0;

const postAndGetList = createAsyncThunk(
  'board/postAndGetList',
  (issue: RkbIssue, {dispatch, getState}) => {
    const {
      account: {uid, mobile, token},
    } = getState() as RootState;

    return dispatch(
      postAttach({images: issue.images, user: mobile, token}),
    ).then(({payload}) => {
      const images = payload ? payload.map((item) => item.objects[0]) : [];
      return dispatch(postIssue({...issue, images, token})).then(
        ({payload: resp}) => {
          if (resp.result === 0 && resp.objects.length > 0) {
            return dispatch(fetchIssueList({uid, token}));
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
export interface BoardModelState {
  next: boolean;
  page: number;
  list: RkbBoard[];
  comment?: string;
}

const initialState: BoardModelState = {
  next: true,
  page: 0,
  list: [],
};

const slice = createSlice({
  name: 'board',
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
    builder.addCase(fetchIssueList.fulfilled, (state, action) => {
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

    builder.addCase(getIssueResp.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0) {
        // object.length == 0인 경우에도 comment를 overwrite 한다.
        state.comment = objects;
      }
    });
  },
});

const getIssueList = createAsyncThunk(
  'board/getIssueList',
  (reloadAlways = true, {dispatch, getState}) => {
    const {account, board} = getState() as RootState;
    const {uid, token} = account;

    if (reloadAlways) {
      dispatch(slice.actions.resetIssueList());
      return dispatch(fetchIssueList({uid, token, page: 0}));
    }

    // reloadAlways == false 이면 list가 비어있는 경우에만 다시 읽는다.
    if (board.list.length === 0)
      return dispatch(fetchIssueList({uid, token, page: 0}));

    return Promise.resolve();
  },
);

const getNextIssueList = createAsyncThunk(
  'board/getNextIssueList',
  (param, {dispatch, getState}) => {
    const {account, board, status} = getState() as RootState;
    const {uid, token} = account;
    const {next, page} = board;

    if (next && !status.pending[fetchIssueList.typePrefix]) {
      dispatch(slice.actions.nextIssueList());
      return dispatch(fetchIssueList({uid, token, page: page + 1}));
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
  postIssue,
  postAttach,
  fetchIssueList,
  getIssueResp,
};

export type BoardAction = typeof actions;

export default slice.reducer as Reducer<BoardModelState, AnyAction>;
