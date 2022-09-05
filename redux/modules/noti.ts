/* eslint-disable no-param-reassign */
import {createAsyncThunk, createAction, createSlice} from '@reduxjs/toolkit';
import moment from 'moment';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Reducer} from 'react';
import {AnyAction} from 'redux';
import ShortcutBadge from 'react-native-app-badge';
import {Platform} from 'react-native';
import {storeData, retrieveData} from '@/utils/utils';
import {RkbNoti} from '@/redux/api/notiApi';
import {API} from '@/redux/api';

const NOTI_TYPE_REPLY = 'reply';
const NOTI_TYPE_INVITE = 'invite';
const NOTI_TYPE_PYM = 'pym';
const NOTI_TYPE_ACCOUNT = 'account';
const NOTI_TYPE_PROVISION = 'provision';
const NOTI_TYPE_USIM = 'usim';
const NOTI_TYPE_NOTI = 'noti';

const initNotiList = createAsyncThunk('noti/initNotiList', async () => {
  const oldData = await retrieveData(API.Noti.KEY_INIT_LIST);
  return oldData;
});

const getNotiList = createAsyncThunk('noti/getNotiList', API.Noti.getNoti);
const readNoti = createAsyncThunk('noti/readNoti', API.Noti.read);
// export const updateNoti = createAsyncThunk(UPDATE_NOTI, API.Noti.update);
const initAlimTalk = createAction('initAlimTalk');
const sendAlimTalk = createAsyncThunk(
  'noti/sendAlimTalk',
  API.Noti.sendAlimTalk,
);
const sendLog = createAsyncThunk('noti/sendLog', API.Noti.sendLog);

const init = createAsyncThunk(
  'noti/init',
  async (param: {mobile?: string}, {dispatch}) => {
    await dispatch(initNotiList());
    await dispatch(getNotiList(param));
  },
);

const setAppBadge = (notiCount: number) => {
  if (Platform.OS === 'ios')
    PushNotificationIOS.setApplicationIconBadgeNumber(notiCount);
  else {
    ShortcutBadge.setCount(notiCount);
  }
  // messaging().setBadge(notiCount);
};

const notiReadAndGet = createAsyncThunk(
  'noti/readAndGet',
  (
    {
      uuid,
      mobile,
      token,
    }: {
      uuid: string;
      mobile: string;
      token: string;
    },
    {dispatch},
  ) => {
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
  },
);

const initAndSendAlimTalk = createAsyncThunk(
  'noti/initAndSendAlimTalk',
  (
    {
      mobile,
      abortController,
    }: {
      mobile: string;
      abortController: AbortController;
    },
    {dispatch},
  ) => {
    return dispatch(initAlimTalk()).then(() =>
      dispatch(sendAlimTalk({mobile, abortController})),
    );
  },
);

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
    reset: () => initialState,
    initAlimTalk: (state) => {
      state.result = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initNotiList.fulfilled, (state, {payload}) => {
      state.notiList = JSON.parse(payload) || [];
    });

    builder.addCase(getNotiList.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;
      if (result === 0 && objects && objects.length > 0) {
        // appBadge 업데이트
        try {
          const badgeCnt = objects.filter((elm) => elm.isRead === 'F').length;
          setAppBadge(badgeCnt);
        } catch (e) {
          console.log('Noti Badge error : ', e);
        }
        storeData(API.Noti.KEY_INIT_LIST, JSON.stringify(objects));

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

export const actions = {
  ...slice.actions,
  NOTI_TYPE_ACCOUNT,
  NOTI_TYPE_PROVISION,
  NOTI_TYPE_NOTI,
  NOTI_TYPE_PYM,
  NOTI_TYPE_REPLY,
  NOTI_TYPE_INVITE,
  NOTI_TYPE_USIM,
  sendLog,
  getNotiList,
  readNoti,
  initAndSendAlimTalk,
  notiReadAndGet,
  sendAlimTalk,
  initNotiList,
  init,
};

export type NotiAction = typeof actions;

export default slice.reducer as Reducer<NotiModelState, AnyAction>;
