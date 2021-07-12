import {createAction, handleActions} from 'redux-actions';
import {pender} from 'redux-pender';
import _ from 'underscore';
import {API} from '@/submodules/rokebi-utils';
import {RkbBoard} from '@/submodules/rokebi-utils/api/boardApi';
import {auth} from './account';
import {AppThunk} from '..';

export const POST_ISSUE = 'rokebi/board/POST_ISSUE';
export const POST_ATTACH = 'rokebi/board/POST_ATTACH';
const NO_MORE_ISSUES = 'rokebi/board/NO_MORE_ISSUES';
export const FETCH_ISSUE_LIST = 'rokebi/board/FETCH_ISSUE_LIST';
export const GET_ISSUE_RESP = 'rokebi/board/GET_ISSUE_RESP';
const RESET_ISSUE_LIST = 'rokebi/board/RESET_ISSUE_LIST';
const NEXT_ISSUE_LIST = 'rokebi/board/NEXT_ISSUE_LIST';
const RESET_ISSUE_COMMENT = 'rokebi/board/RESET_ISSUE_COMMENT';

export const postIssue = createAction(POST_ISSUE, API.Board.post);
export const postAttach = createAction(
  GET_ISSUE_RESP,
  API.Board.uploadAttachment,
);
export const fetchIssueList = createAction(
  FETCH_ISSUE_LIST,
  API.Board.getIssueList,
);
export const getIssueResp = createAction(GET_ISSUE_RESP, API.Board.getComments);
const resetIssueList = createAction(RESET_ISSUE_LIST);
export const resetIssueComment = createAction(RESET_ISSUE_COMMENT);
const nextIssueList = createAction(NEXT_ISSUE_LIST);

export const getIssueList = (reloadAlways = true): AppThunk => (
  dispatch,
  getState,
) => {
  const {account, board} = getState();
  const {uid, token} = account;

  if (reloadAlways) {
    dispatch(resetIssueList());
    return dispatch(fetchIssueList(uid, {token}, 0));
  }

  // reloadAlways == false 이면 list가 비어있는 경우에만 다시 읽는다.
  if (board.list.length === 0) return dispatch(fetchIssueList(uid, {token}, 0));

  return Promise.resolve();
};

export const getNextIssueList = (): AppThunk => (dispatch, getState) => {
  const {account, board, pender: pender0} = getState();
  const {uid, token} = account;
  const {next, page} = board;
  const pending = pender0.pending[FETCH_ISSUE_LIST];

  if (next && !pending) {
    dispatch(nextIssueList());
    return dispatch(fetchIssueList(uid, {token}, page + 1));
  }

  // no more list
  return dispatch({type: NO_MORE_ISSUES});
};

// 10 items per page
const PAGE_LIMIT = 10;
const PAGE_UPDATE = 0;

export const postAndGetList = (issue, attachment): AppThunk => (
  dispatch,
  getState,
) => {
  const {account} = getState();
  const {uid} = account;
  const authObj = auth(account);

  return dispatch(postAttach(attachment, authObj)).then((rsp) => {
    const attach = rsp ? rsp.map((item) => item.objects[0]) : [];
    console.log('Failed to upload picture', rsp);
    return dispatch(postIssue(issue, attach, authObj)).then(
      (resp) => {
        if (resp.result === 0 && resp.objects.length > 0) {
          return dispatch(getIssueList(uid, authObj));
        }
        console.log('Failed to post issue', resp);
      },
      (err) => {
        console.log('Failed to post issue', err);
      },
    );
  });
};

export const actions = {
  getIssueResp,
  resetIssueComment,
  fetchIssueList,
  getIssueList,
  postAttach,
  postIssue,
  getNextIssueList,
};

export type BoardAction = typeof actions;

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

export default handleActions(
  {
    [NO_MORE_ISSUES]: (state) => {
      return state;
    },

    [NEXT_ISSUE_LIST]: (state) => {
      const {page} = state;
      return {
        ...state,
        page: page + 1,
      };
    },

    [RESET_ISSUE_LIST]: (state) => {
      return {
        ...state,
        next: true,
        page: 0,
        list: [],
      };
    },

    [RESET_ISSUE_COMMENT]: (state) => {
      return {
        ...state,
        comment: undefined,
      };
    },

    ...pender<BoardModelState>({
      type: FETCH_ISSUE_LIST,
      onSuccess: (state, action) => {
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
            (item) =>
              changedList.findIndex((org) => org.uuid === item.uuid) < 0,
          );

          return {
            ...state,
            list: changedList
              .concat(newList)
              .sort((a, b) => (a.created < b.created ? 1 : -1)),
            next:
              newList.length === PAGE_LIMIT || newList.length === PAGE_UPDATE,
          };
        }
        return {
          ...state,
          next: false,
        };
      },
    }),

    ...pender<BoardModelState>({
      type: GET_ISSUE_RESP,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0) {
          // object.length == 0인 경우에도 comment를 overwrite 한다.
          return {
            ...state,
            comment: objects,
          };
        }
        return state;
      },
    }),

    ...pender({
      type: POST_ATTACH,
    }),

    ...pender({
      type: POST_ISSUE,
    }),
  },
  initialState,
);
