/* eslint-disable no-param-reassign */
import {AnyAction} from 'redux';
import {createAction, Reducer} from 'redux-actions';
import {API} from '@/submodules/rokebi-utils';
import {RkbBoard, RkbIssue} from '@/submodules/rokebi-utils/api/boardApi';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AppDispatch} from '@/store';
import {AppThunk} from '..';

export const postIssue = createAsyncThunk('board/postIssue', API.Board.post);
export const postAttach = createAsyncThunk(
  'board/postAttach',
  API.Board.uploadAttachment,
);
export const fetchIssueList = createAsyncThunk(
  'board/fetchIssueList',
  API.Board.getIssueList,
);
export const getIssueResp = createAsyncThunk(
  'board/getIssueResp',
  API.Board.getComments,
);
export const resetIssueComment = createAction('board/resetIssueComment');

// 10 items per page
const PAGE_LIMIT = 10;
const PAGE_UPDATE = 0;

export const postAndGetList = (issue: RkbIssue): AppThunk<Promise<void>> => (
  dispatch: AppDispatch,
  getState,
) => {
  const {
    account: {uid, mobile, token},
  } = getState();

  return dispatch(postAttach({images: issue.images, user: mobile, token})).then(
    ({payload}) => {
      console.log('upload picture', payload);
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
    },
  );
};
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
      state.page = state.page + 1;
    },
    resetIssueList: (state) => {
      return {
        ...state,
        next: true,
        page: 0,
        list: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIssueList.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      const {list} = state;

      if (result === 0 && objects.length > 0) {
        //Status가 변경된 item을 찾아서 변경해 준다.
        const changedList = list.map((item) => {
          const findObjects = objects.find((org) => org.uuid === item.uuid);
          if (
            findObjects !== undefined &&
            item.statusCode !== findObjects.statusCode
          ) {
            return findObjects;
          }
          return item;
        });

        const newList = objects.filter(
          (item) => changedList.findIndex((org) => org.uuid === item.uuid) < 0,
        );

        return {
          ...state,
          list: changedList
            .concat(newList)
            .sort((a, b) => (a.created < b.created ? 1 : -1)),
          next: newList.length === PAGE_LIMIT || newList.length === PAGE_UPDATE,
        };
      }
      return {
        ...state,
        next: false,
      };
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

export const getIssueList = (reloadAlways = true): AppThunk => (
  dispatch,
  getState,
) => {
  const {account, board} = getState();
  const {uid, token} = account;

  if (reloadAlways) {
    dispatch(slice.actions.resetIssueList());
    return dispatch(fetchIssueList({uid, token, page: 0}));
  }

  // reloadAlways == false 이면 list가 비어있는 경우에만 다시 읽는다.
  if (board.list.length === 0)
    return dispatch(fetchIssueList({uid, token, page: 0}));

  return Promise.resolve();
};

export const getNextIssueList = (): AppThunk => (dispatch, getState) => {
  const {account, board, pender: pender0} = getState();
  const {uid, token} = account;
  const {next, page} = board;
  // const pending = pender0.pending[FETCH_ISSUE_LIST];
  const pending = false;

  if (next && !pending) {
    dispatch(slice.actions.nextIssueList());
    return dispatch(fetchIssueList({uid, token, page: page + 1}));
  }

  // no more list
  return dispatch(slice.actions.noMoreIssues());
};

export const actions = {
  ...slice.actions,
  getIssueResp,
  resetIssueComment,
  getIssueList,
  postAttach,
  postIssue,
  getNextIssueList,
  postAndGetList,
};

export type BoardAction = typeof actions;

export default slice.reducer as Reducer<BoardModelState, AnyAction>;
