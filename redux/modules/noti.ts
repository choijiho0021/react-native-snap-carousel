/* eslint-disable no-param-reassign */
import {createAsyncThunk, createAction, createSlice} from '@reduxjs/toolkit';
import moment from 'moment';
import {API} from '@/submodules/rokebi-utils';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {AppDispatch} from '@/store';
import {RkbNoti} from '@/submodules/rokebi-utils/api/notiApi';
import {AppThunk} from '..';

const getNotiList = createAsyncThunk('noti/getNotiList', API.Noti.getNoti);
const readNoti = createAsyncThunk('noti/readNoti', API.Noti.read);
// export const updateNoti = createAsyncThunk(UPDATE_NOTI, API.Noti.update);
const init = createAction('init');
const initAlimTalk = createAction('initAlimTalk');
const sendAlimTalk = createAsyncThunk(
  'noti/sendAlimTalk',
  API.Noti.sendAlimTalk,
  // (...args) => ({abortController: args.abortController}),
);
const sendLog = createAsyncThunk('noti/sendLog', API.Noti.sendLog);

const NOTI_TYPE_REPLY = 'reply';
const NOTI_TYPE_PYM = 'pym';
const NOTI_TYPE_ACCOUNT = 'account';
const NOTI_TYPE_USIM = 'usim';
const NOTI_TYPE_NOTI = 'noti';

const setAppBadge = (notiCount: number) => {
  PushNotificationIOS.setApplicationIconBadgeNumber(notiCount);
  // messaging().setBadge(notiCount);
};

const notiReadAndGet = ({
  uuid,
  mobile,
  token,
}: {
  uuid: string;
  mobile: string;
  token: string;
}): AppThunk => (dispatch: AppDispatch) => {
  return dispatch(readNoti({uuid, token})).then(
    (resp) => {
      if (resp.result === 0 && resp.objects.length > 0) {
        return dispatch(getNotiList({mobile}));
      }
      throw new Error('Failed to read Noti and Get notiList');
    },
    (err) => {
      throw err;
    },
  );
};

const initAndSendAlimTalk = ({
  mobile,
  abortController,
}: {
  mobile: string;
  abortController: AbortController;
}): AppThunk => (dispatch) => {
  dispatch(initAlimTalk());

  return dispatch(sendAlimTalk({mobile, abortController}));
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
  initAndSendAlimTalk,
  notiReadAndGet,
};

export type NotiAction = typeof actions;

export interface NotiModelState {
  notiList: RkbNoti[];
  lastSent?: Date;
  result?: number;
  lastRefresh?: moment.Moment;
}

const initialState: NotiModelState = {
  notiList: [],
};

const slice = createSlice({
  name: 'noti',
  initialState,
  reducers: {
    init: () => initialState,
    initAlimTalk: (state) => {
      state.result = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotiList.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;
      if (result === 0 && objects && objects.length > 0) {
        // appBadge 업데이트
        const badgeCnt = objects.filter((elm) => elm.isRead === 'F').length;
        setAppBadge(badgeCnt);

        state.notiList = objects;
        state.lastRefresh = moment();
      }
    });

    builder.addCase(sendAlimTalk.fulfilled, (state, {payload}) => {
      const {result} = payload || {};
      if (result === 0) {
        state.lastSent = new Date();
        state.result = result;
      } else {
        state.result = API.default.FAILED;
      }
    });

    builder.addCase(sendAlimTalk.rejected, (state) => {
      state.result = API.default.FAILED;
    });

    builder.addCase(readNoti.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0 && objects) {
        const notiList = state.notiList.map((elm) =>
          elm.uuid === objects[0].uuid ? {...elm, isRead: 'T'} : elm,
        );

        // appBadge 업데이트
        const badgeCnt = notiList.filter((elm) => elm.isRead === 'F').length;
        setAppBadge(badgeCnt);
        state.notiList = notiList;
      }
    });
  },
});

export default slice.reducer;
