import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { pender } from 'redux-pender'
import boardApi from '../../utils/api/boardApi';
import _ from 'underscore'
import {auth} from './account'

export const POST_ISSUE =   'rokebi/board/POST_ISSUE'
export const POST_ATTACH =   'rokebi/board/POST_ATTACH'
const NO_MORE_ISSUES =   'rokebi/board/NO_MORE_ISSUES'
export const FETCH_ISSUE_LIST =   'rokebi/board/FETCH_ISSUE_LIST'
export const GET_ISSUE_RESP =   'rokebi/board/GET_ISSUE_RESP'
const RESET_ISSUE_LIST =   'rokebi/board/RESET_ISSUE_LIST'
const NEXT_ISSUE_LIST =   'rokebi/board/NEXT_ISSUE_LIST'

export const postIssue = createAction(POST_ISSUE, boardApi.post)
export const postAttach = createAction(GET_ISSUE_RESP, boardApi.uploadAttachment)
export const fetchIssueList = createAction(FETCH_ISSUE_LIST, boardApi.getIssueList)
export const getIssueResp = createAction(GET_ISSUE_RESP, boardApi.getComments)
const resetIssueList = createAction(RESET_ISSUE_LIST)
const nextIssueList = createAction(NEXT_ISSUE_LIST)

export const getIssueList = () => {
  return (dispatch,getState) => {
    const { account } = getState(),
      uid = account.get('uid'),
      token = account.get('token')

    dispatch(resetIssueList())

    return dispatch(fetchIssueList(uid, {token}, 0))
  }
}

export const getNextIssueList = () => {
  return (dispatch,getState) => {
    const { account, board, pender } = getState(),
      uid = account.get('uid'),
      token = account.get('token'),
      next = board.get('next'),
      page = board.get('page'),
      pending = pender.pending[FETCH_ISSUE_LIST]

    if (next && !pending) {
      dispatch(nextIssueList())
      return dispatch(fetchIssueList(uid, {token}, page+1))
    }

    // no more list
    return dispatch({type:NO_MORE_ISSUES})
  }
}

// 10 items per page
const PAGE_LIMIT = 10

export const postAndGetList = (issue, attachment) => {
  return (dispatch,getState) => {
    const { account } = getState(),
      uid = account.get('uid'),
      authObj = auth(account)

    return dispatch(postAttach(attachment, authObj)).then( 
      rsp => {
        const attach = rsp ? rsp.map(item => item.objects[0]) : []
        console.log('Failed to upload picture', rsp)
        return dispatch(postIssue(issue, attach, authObj)).then(
          resp => {
            if (resp.result == 0 && resp.objects.length > 0) {
              return dispatch(getIssueList( uid, authObj))
            }
            console.log('Failed to post issue', resp)
          },
          err => {
            console.log('Failed to post issue', err)
          })
      }
    )
  }
}



const initialState = Map({
  'next': true,
  'page' : 0,
  'list': [],
  'comment': undefined
})

export default handleActions({
  [NO_MORE_ISSUES] : (state, action) => {
    return state
  },

  [NEXT_ISSUE_LIST] : (state, action) => {
    return state.update( 'page', value => value +1)
  },

  [RESET_ISSUE_LIST]: (state, action) => {
    return state.set('next', true).set('page', 0)
  },

  ... pender({
    type: FETCH_ISSUE_LIST,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      const list = state.get('list')
      if (result == 0 && objects.length > 0) {
        const newList = objects.filter(item => list.findIndex(org => org.uuid == item.uuid) < 0)

        return state.set('list', list.concat(newList).sort((a,b) => a.created < b.created ? 1 : -1))
          .set('next', newList.length == PAGE_LIMIT)
      }
      return state.set('next', false)
    }
  }),

  ... pender({
    type: GET_ISSUE_RESP,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0) {
        // object.length == 0인 경우에도 comment를 overwrite 한다. 
        return state.set('comment', objects)
      }
      return state
    }
  }),

  ... pender({
    type: POST_ATTACH,
  }),

  ... pender({
    type: POST_ISSUE
  })
}, initialState)
