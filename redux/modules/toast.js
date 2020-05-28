import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import _ from 'underscore'
import { AppToastType } from '../../components/AppToast'

const INIT = "rokebi/toast/INIT"
const PUSH = "rokebi/toast/PUSH"
const REMOVE = "rokebi/toast/REMOVE"

export const init = createAction(INIT)
export const push = createAction(PUSH)
export const remove = createAction(REMOVE)

const initialState = Map({
    messages: List()
})

export default handleActions({
    [INIT] : (state, action) => {
        return initialState
    },
    [PUSH] : (state, action) => {
        const messages = state.get('messages'),
            newMsg = action.payload || AppToastType.NOT_LOADED
        if ( ! messages.contains(newMsg) ) {
            state = state.set('messages', messages.push(action.payload))
        }
        return state
    },
    [REMOVE] : (state, action) => {
        const messages = state.get('messages')
        return state.set('messages', messages.remove(0))
    }
}, initialState)