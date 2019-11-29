import actions from "./actions";

export const initialNoti = () => ({
    notiList:[],
    uuid : undefined,
    isread : undefined
})

export const notiReducer = (state=initialNoti(), action) => {
    switch (action.type) {
        case actions.GET_NOTI_LIST:
            return {
                ... state,
                notiList:action.notiList
            }
        case actions.SELECT_NOTI:
            return {
                ... state,
                uuid : action.uuid
            }

        case actions.UPDATE_ISREAD:
            return {
                ...state,
                isread:action.isread
            }
    }

    return state;
}