import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import _ from 'underscore'
import codePush from "react-native-code-push";

const INIT = "rokebi/sync/INIT"
const UPDATE = "rokebi/sync/UPDATE"
const COMPLETE = "rokebi/sync/COMPLETE"
const SKIP = "rokebi/sync/SKIP"
const PROGRESS = "rokebi/sync/PROGRESS"

export const init = createAction(INIT)
export const update = createAction(UPDATE)
export const complete = createAction(COMPLETE)
export const skip = createAction(SKIP)
export const progress = createAction(PROGRESS)

const initialState = Map({
    syncStatus: undefined,
    isCompleted: false,
    isUpdating: false,
    isSkipped: false,
    progress: false
})

export default handleActions({
    [INIT] : (state, action) => {
        return initialState
    },
    [UPDATE] : (state, action) => {
        const { syncStatus } = action.payload || {}
        return state.set('syncStatus', syncStatus)
            .set('isUpdating', [codePush.SyncStatus.DOWNLOADING_PACKAGE, codePush.SyncStatus.INSTALLING_UPDATE].includes(syncStatus))
    },
    [COMPLETE] : (state, action) => {
        return state.set('isCompleted', true)
            .set('progress', false)
    },
    [SKIP] : (state, action) => {
        return state.set('isSkipped', true)
    },
    [PROGRESS] : (state, action) => {
        return state.set('progress', true)
    },
}, initialState)