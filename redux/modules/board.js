import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { pender } from 'redux-pender'
import boardApi from '../../utils/api/boardApi';
import _ from 'underscore'

const POST_ISSUE =   'rokebi/board/POST_ISSUE'
const NO_MORE_ISSUES =   'rokebi/board/NO_MORE_ISSUES'
export const GET_ISSUE_LIST =   'rokebi/board/GET_ISSUE_LIST'
export const GET_ISSUE_RESP =   'rokebi/board/GET_ISSUE_RESP'

export const postIssue = createAction(POST_ISSUE, boardApi.post)
export const getIssueList = createAction(GET_ISSUE_LIST, boardApi.getHistory)
export const getIssueResp = createAction(GET_ISSUE_RESP, boardApi.getComments)

export const getNextIssueList = () => {
  return (dispatch,getState) => {
    const { account, board, pender } = getState(),
      token = account.get('token'),
      next = board.get('next'),
      pending = pender.pending[GET_ISSUE_LIST]

    console.log('next', next)
    if ( next && ! pending) return dispatch(getIssueList({token}, next))
    return dispatch({type: NO_MORE_ISSUES})
  }
}

export const postAndGetList = (issue) => {
  return (dispatch,getState) => {
    const { account } = getState(),
      token = account.get('token')

    return dispatch(postIssue(issue, {token})).then(
      resp => {
        if (resp.result == 0 && resp.objects.length > 0) {
          return dispatch(getIssueList( {token}))
        }
        console.log('Failed to upload picture', resp)
      },
      err => {
        console.log('Failed to upload picture', err)
      })
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
  })
}, initialState)
