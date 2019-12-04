import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { pender } from 'redux-pender'
import boardApi from '../../utils/api/boardApi';
import _ from 'underscore'
import {auth} from './account'

export const POST_ISSUE =   'rokebi/board/POST_ISSUE'
export const POST_ATTACH =   'rokebi/board/POST_ATTACH'
const NO_MORE_ISSUES =   'rokebi/board/NO_MORE_ISSUES'
export const GET_ISSUE_LIST =   'rokebi/board/GET_ISSUE_LIST'
export const GET_ISSUE_RESP =   'rokebi/board/GET_ISSUE_RESP'

export const postIssue = createAction(POST_ISSUE, boardApi.post)
export const postAttach = createAction(GET_ISSUE_RESP, boardApi.uploadAttachment)
export const getIssueList = createAction(GET_ISSUE_LIST, boardApi.getHistory)
export const getIssueResp = createAction(GET_ISSUE_RESP, boardApi.getComments)

export const getNextIssueList = () => {
  return (dispatch,getState) => {
    const { account, board, pender } = getState(),
      token = account.get('token'),
      next = board.get('next'),
      pending = pender.pending[GET_ISSUE_LIST]

    if ( next && ! pending) return dispatch(getIssueList({token}, next))
    return dispatch({type: NO_MORE_ISSUES})
  }
}

export const postAndGetList = (issue, attachment) => {
  return (dispatch,getState) => {
    const { account } = getState(),
      authObj = auth(account)

    return dispatch(postAttach(attachment, authObj)).then( 
      rsp => {
        const attach = rsp ? rsp.map(item => item.objects[0]) : []
        return dispatch(postIssue(issue, attach, authObj)).then(
          resp => {
            if (resp.result == 0 && resp.objects.length > 0) {
              return dispatch(getIssueList( authObj))
            }
            console.log('Failed to upload picture', resp)
          },
          err => {
            console.log('Failed to upload picture', err)
          })
      }
    )
  }
}



const initialState = Map({
  'next': undefined,
  'list': [],
  'comment': undefined
})

export default handleActions({
  [NO_MORE_ISSUES] : (state, action) => {
    return state
  },

  ... pender({
    type: GET_ISSUE_LIST,
    onSuccess: (state, action) => {
      const {result, objects, links} = action.payload
      const list = state.get('list')
      if (result == 0 && objects.length > 0) {
        const next = _.isEmpty(links.next) ? undefined : links.next.href
        const newList = objects.filter(item => list.findIndex(org => org.uuid == item.uuid) < 0)

        return state.set('next', next).set('list', list.concat(newList).sort((a,b) => a.created < b.created ? 1 : -1))
      }
      return state
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
