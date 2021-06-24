import {RkbNoti} from '@/submodules/rokebi-utils/api/notiApi';
import {createAction} from 'redux-actions';
import handleActions from '../handleActions';

const UPDATE_ISREAD = 'rokebi/noti/UPDATE_ISREAD';
const GET_NOTI_LIST = 'rokebi/noti/GET_NOTI_LIST';
const SELECT_NOTI = 'rokebi/noti/SELECT_NOTI';

const getNotiList = createAction(GET_NOTI_LIST, (notiList) => ({
  notiList,
}));
const updateIsRead = createAction(UPDATE_ISREAD, (isread) => ({
  isread,
}));

const selectNoti = createAction(SELECT_NOTI, (uuid) => ({
  uuid,
}));

const actions = {
  getNotiList,
  updateIsRead,
  selectNoti,
};

export type NotiAction = typeof actions;

export type NotiModelState = {
  notiList: RkbNoti[];
  uuid?: string;
  isread?: string;
};

const initialNoti: NotiModelState = {
  notiList: [],
  uuid: undefined,
  isread: undefined,
};

export default handleActions(
  {
    [GET_NOTI_LIST]: (state, {payload}) => {
      return {
        ...state,
        notiList: payload.notiList,
      };
    },
    [SELECT_NOTI]: (state, {payload}) => {
      return {
        ...state,
        uuid: payload.uuid,
      };
    },

    [UPDATE_ISREAD]: (state, {payload}) => {
      return {
        ...state,
        isread: payload.isread,
      };
    },
  },
  initialNoti,
);
