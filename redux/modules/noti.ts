import {createAction, handleActions} from 'redux-actions';
import _ from 'underscore';
import {pender} from 'redux-pender';
import moment from 'moment';
import {API} from '@/submodules/rokebi-utils';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {AppThunk} from '..';
import {AccountAuthType} from './account';

export const GET_NOTI_LIST = 'rokebi/noti/GET_NOTI_LIST';
const READ_NOTI = 'rokebi/noti/READ_NOTI';
const UPDATE_NOTI = 'rokebi/noti/UPDATE_NOTI';
const INIT = 'rokebi/noti/INIT';

const INIT_ALIM_TALK = 'rokebi/noti/INIT_ALIM_TALK';
const SEND_ALIM_TALK = 'rokebi/noti/SEND_ALIM_TALK';
const SEND_LOG = 'rokebi/noti/SEND_LOG';

export const getNotiList = createAction(GET_NOTI_LIST, API.Noti.getNoti);
export const readNoti = createAction(READ_NOTI, API.Noti.read);
export const updateNoti = createAction(UPDATE_NOTI, API.Noti.update);
export const init = createAction(INIT);
const initAlimTalk = createAction(INIT_ALIM_TALK);
const sendAlimTalk = createAction(
  SEND_ALIM_TALK,
  API.Noti.sendAlimTalk,
  (...args) => ({abortController: args.abortController}),
);
export const sendLog = createAction(SEND_LOG, API.Noti.sendLog);

export const NOTI_TYPE_REPLY = 'reply';
export const NOTI_TYPE_PYM = 'pym';
export const NOTI_TYPE_ACCOUNT = 'account';
export const NOTI_TYPE_USIM = 'usim';
export const NOTI_TYPE_NOTI = 'noti';

const setAppBadge = async (notiCount) => {
  PushNotificationIOS.setApplicationIconBadgeNumber(notiCount);
  // messaging().setBadge(notiCount);
};

export const notiReadAndGet = (
  uuid: string,
  mobile: string,
  auth: AccountAuthType,
): AppThunk => (dispatch) => {
  return dispatch(readNoti(uuid, auth)).then(
    (resp) => {
      if (resp.result === 0 && resp.objects.length > 0) {
        return dispatch(getNotiList(mobile));
      }
      throw new Error('Failed to read Noti and Get notiList');
    },
    (err) => {
      throw err;
    },
  );
};

export const initAndSendAlimTalk = ({mobile, abortController}): AppThunk => (
  dispatch,
) => {
  dispatch(initAlimTalk());

  return dispatch(sendAlimTalk(mobile, abortController));
};

export const actions = {
  NOTI_TYPE_ACCOUNT,
  NOTI_TYPE_NOTI,
  NOTI_TYPE_PYM,
  NOTI_TYPE_REPLY,
  NOTI_TYPE_USIM,
  sendLog,
  getNotiList,
  init,
  readNoti,
};

export type NotiAction = typeof actions;

interface NotiModelState {
  notiList: object[];
  lastSent?: Date;
  result?: number;
  lastRefresh?: moment.Moment;
}

const initialState: NotiModelState = {
  notiList: [],
};

export default handleActions(
  {
    [INIT]: () => {
      return initialState;
    },

    ...pender<NotiModelState>({
      type: GET_NOTI_LIST,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0 && objects.length > 0) {
          // appBadge 업데이트
          const badgeCnt = objects.filter((elm) => elm.isRead === 'F').length;
          setAppBadge(badgeCnt);

          return {
            ...state,
            notiList: objects,
            lastRefresh: moment(),
          };
        }
        return state;
      },
    }),

    [INIT_ALIM_TALK]: (state) => {
      return {
        ...state,
        result: undefined,
      };
    },

    ...pender<NotiModelState>({
      type: SEND_ALIM_TALK,
      onSuccess: (state, action) => {
        const {result} = action.payload || {};
        if (result === 0) {
          return {
            ...state,
            lastSent: new Date(),
            result,
          };
        }
        return {
          ...state,
          result: API.default.FAILED,
        };
      },
      onFailure: (state) => {
        return {
          ...state,
          result: API.default.FAILED,
        };
      },
      onCancel: (state) => {
        return state;
      },
    }),

    ...pender<NotiModelState>({
      type: READ_NOTI,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;

        const notiList = state.notiList.map((elm) =>
          elm.uuid === objects[0].uuid ? {...elm, isRead: 'T'} : elm,
        );

        if (state && result === 0) {
          // appBadge 업데이트
          const badgeCnt = notiList.filter((elm) => elm.isRead === 'F').length;
          setAppBadge(badgeCnt);
          return {
            ...state,
            notiList,
          };
        }
        return state;
      },
    }),

    [`${SEND_ALIM_TALK}_CANCEL`]: (state, action) => {
      if (action.meta.abortController) action.meta.abortController.abort();
      console.log('cancel send alimtalk req', state, action);
      return state;
    },
  },
  initialState,
);
