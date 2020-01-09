import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import _ from 'underscore'

const INIT = "rokebi/sync/INIT"
const UPDATE = "rokebi/sync/UPDATE"
const COMPLETE = "rokebi/sync/COMPLETE"

export const init = createAction(INIT)
export const update = createAction(UPDATE)
export const complete = createAction(COMPLETE)

const initialState = Map({
    syncStatus: undefined,
    isCompleted: false
})

export default handleActions({
    [INIT] : (state, action) => {
        return initialState
    },
    [UPDATE] : (state, action) => {
        const { syncStatus } = action.payload || {}
        return state.set('syncStatus', syncStatus)
    },
    [COMPLETE] : (state, action) => {
        return state.set('isCompleted', true)
    }
}, initialState)