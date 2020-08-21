import {createAction, handleActions} from 'redux-actions';
import {Map, List} from 'immutable';
import _ from 'underscore';
import {pender} from 'redux-pender';
import moment from 'moment';
import {API} from 'Rokebi/submodules/rokebi-utils';

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

const setAppBadge = notiCount => {
  if (Platform.OS == 'android') {
    const firebase = require('react-native-firebase');

    firebase.notifications().setBadge(notiCount);
  } else if (Platform.OS == 'ios') {
    // PushNotificationIOS.setApplicationIconBadgeNumber(notiCount);
  }
};

export const notiReadAndGet = (uuid, mobile, auth) => {
  return (dispatch, getState) => {
    return dispatch(readNoti(uuid, auth)).then(
      resp => {
        if (resp.result == 0 && resp.objects.length > 0) {
          return dispatch(getNotiList(mobile));
        }
        throw new Error('Failed to read Noti and Get notiList');
      },
      err => {
        throw err;
      },
    );
  };
};

export const initAndSendAlimTalk = ({mobile, abortController}) => {
  return (dispatch, getState) => {
    dispatch(initAlimTalk());

    return dispatch(sendAlimTalk(mobile, abortController));
  };
};

const initialState = Map({
  notiList: [],
  lastSent: undefined,
  result: undefined,
  lastRefresh: undefined,
});

export default handleActions(
  {
    [INIT]: (state, action) => {
      return initialState;
    },

    ...pender({
      type: GET_NOTI_LIST,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result == 0 && objects.length > 0) {
          //appBadge 업데이트
          const badgeCnt = objects.filter(elm => elm.isRead == 'F').length;
          setAppBadge(badgeCnt);

          return state.set('notiList', objects).set('lastRefresh', moment());
        }
        return state;
      },
    }),

    [INIT_ALIM_TALK]: (state, action) => {
      return state.set('result', undefined);
    },

    ...pender({
      type: SEND_ALIM_TALK,
      onSuccess: (state, action) => {
        const {result} = action.payload || {};
        if (result === 0) {
          return state.set('lastSent', new Date()).set('result', result);
        }
        return state.set('result', API.default.FAILED);
      },
      onFailure: (state, action) => {
        return state.set('result', API.default.FAILED);
      },
      onCancel: (state, action) => {
        return state;
      },
    }),

    ...pender({
      type: READ_NOTI,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        const notiList = state
          .toJS()
          .notiList.map(elm =>
            elm.uuid == objects[0].uuid ? {...elm, isRead: 'T'} : elm,
          );

        if (state && result == 0) {
          //appBadge 업데이트
          const badgeCnt = notiList.filter(elm => elm.isRead == 'F').length;
          setAppBadge(badgeCnt);
          return state.set('notiList', notiList);
        }
        return state;
      },
    }),

    [SEND_ALIM_TALK + '_CANCEL']: (state, action) => {
      if (action.meta.abortController) action.meta.abortController.abort();
      console.log('cancel send alimtalk req', state.toJS(), action);
      return state;
    },
  },
  initialState,
);
