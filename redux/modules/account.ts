/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {Platform} from 'react-native';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'underscore';
import {batch} from 'react-redux';
import {API} from '@/submodules/rokebi-utils';
import {removeData, retrieveData, storeData} from '@/utils/utils';
import Env from '@/environment';
import {
  RkbAccount,
  RkbFile,
  RkbImage,
} from '@/submodules/rokebi-utils/api/accountApi';
import {ApiResult} from '@/submodules/rokebi-utils/api/api';
import {RkbLogin} from '@/submodules/rokebi-utils/api/userApi';
import {AppDispatch} from '@/store';
import {AppThunk} from '..';
import {actions as toastActions, reflectWithToast, Toast} from './toast';

const {esimApp} = Env.get();

const getToken = createAsyncThunk('account/getToken', API.User.getToken);
const logIn = createAsyncThunk('acccount/logIn', API.User.logIn);
const logOut = createAsyncThunk('account/logOut', API.User.logOut);
const clearCookies0 = createAsyncThunk(
  'account/clearCookie',
  API.User.clearCookies,
);
const getUserId = createAsyncThunk('account/getUserId', API.User.getByName);
export const getAccount = createAsyncThunk(
  'account/getAccount',
  API.Account.getAccount,
);
const getAccountByUser = createAsyncThunk(
  'account/getAccountByUser',
  API.Account.getByUser,
);
const registerMobile0 = createAsyncThunk(
  'account/registerMobile',
  API.Account.registerMobile,
);
const uploadPicture = createAsyncThunk(
  'account/uploadPicture',
  API.Account.uploadPicture,
);
const changePicture = createAsyncThunk(
  'account/changePicture',
  API.User.changePicture,
);
const changeUserAttr = createAsyncThunk(
  'account/changeUserAttr',
  API.User.update,
);

const changeUserAttrWithToast = reflectWithToast(
  changeUserAttr,
  Toast.NOT_UPDATED,
);
const uploadPictureWithToast = reflectWithToast(
  uploadPicture,
  Toast.NOT_UPDATED,
);
const changePictureWithToast = reflectWithToast(
  changePicture,
  Toast.NOT_UPDATED,
);

export interface AccountModelState {
  expDate?: string;
  balance?: number;
  email?: string;
  mobile?: string;
  token?: string;
  simPartnerId?: number;
  actDate?: string;
  firstActDate?: string;
  userId?: string;
  uid?: number;
  uuid?: string;
  iccid?: string;
  nid?: number;
  pin?: string;
  loggedIn?: boolean;
  userPicture?: RkbFile;
  userPictureUrl?: string;
  deviceToken?: string;
  simCardName?: string;
  simCardImage?: string;
  isUsedByOther?: boolean;
  isPushNotiEnabled?: string;
}

export type AccountAuth = {
  user?: string;
  pass?: string;
  token?: string;
};

export const auth = (state: AccountModelState): AccountAuth => ({
  user: state.mobile,
  pass: state.pin,
  token: state.token,
});

export const changeNotiToken = (): AppThunk => async (
  dispatch: AppDispatch,
  getState,
) => {
  const {
    account: {token, deviceToken, userId},
  } = getState();

  const attributes = {
    field_device_token: Platform.OS === 'ios' ? deviceToken : '',
    field_fcm_token: Platform.OS === 'android' ? deviceToken : '',
  };

  return dispatch(changeUserAttr({userId, attributes, token})).then(
    (rsp) => {
      const result = rsp.payload ? rsp.payload.result : rsp.result;
      if (result === 0) {
        console.log('Token is updated');
      }
    },
    (err) => {
      console.log('failed to update noti token', err);
    },
  );
};

export const registerMobile = ({
  iccid,
  code,
  mobile,
}: {
  iccid: string;
  code: string;
  mobile: string;
}): AppThunk => (dispatch: AppDispatch, getState) => {
  const {
    account: {token},
  } = getState();

  return dispatch(registerMobile0({iccid, code, mobile, token})).then(
    ({payload}: {payload: ApiResult<RkbAccount>}) => {
      if (payload.result === 0) {
        return dispatch(getAccount({iccid, token}));
      }
      return payload;
    },
    (err) => {
      console.log('failed to register mobile', err);
      return {
        result: -1,
      };
    },
  );
};

export const clearCookies = (): AppThunk => (dispatch) => {
  return dispatch(clearCookies0());
};

export const logInAndGetAccount = ({
  mobile,
  pin,
  iccid,
}: {
  mobile: string;
  pin: string;
  iccid?: string;
}): AppThunk => (dispatch: AppDispatch) => {
  return dispatch(logIn({user: mobile, pass: pin})).then(
    // ({payload}: {payload: ApiResult<RkbLogin>}) => {
    (rsp) => {
      const {result, objects} = rsp?.payload || {};
      if (result === 0 && objects && objects.length > 0) {
        const obj = objects[0];
        const token = obj.csrf_token;

        storeData(API.User.KEY_MOBILE, obj.current_user.name);
        storeData(API.User.KEY_PIN, pin);
        storeData(API.User.KEY_TOKEN, obj.csrf_token);

        // get ICCID account info
        if (iccid) {
          dispatch(getAccount({iccid, token}));
        } else if (esimApp) {
          dispatch(registerMobile({iccid: 'esim', code: pin, mobile}));
        } else {
          // 가장 최근 사용한 SIM 카드 번호를 조회한다.
          dispatch(getAccountByUser({mobile, token})).then(
            ({payload}: {payload: ApiResult<RkbAccount>}) => {
              const {result: rst, objects: obj} = payload;
              if (rst === 0 && obj && obj[0]?.status === 'A') {
                storeData(API.User.KEY_ICCID, obj[0].iccid);
                dispatch(getAccount({iccid: obj[0].iccid, token}));
              }
            },
          );
        }

        // iccid 상관 없이 로그인마다 토큰 업데이트
        dispatch(getUserId({name: obj.current_user.name, token})).then(() =>
          dispatch(changeNotiToken()),
        );
      }
    },
    (err) => {
      dispatch(toastActions.push());
      console.log('login failed', err);
    },
  );
};

export const uploadAndChangePicture = (image: RkbImage): AppThunk => (
  dispatch: AppDispatch,
  getState,
) => {
  const {
    account: {userId, token, mobile},
  } = getState();

  if (userId && mobile && token) {
    return dispatch(uploadPictureWithToast({image, user: mobile, token})).then(
      ({payload}: {payload: ApiResult<RkbFile>}) => {
        const {result, objects} = payload;
        if (result === 0 && objects && objects.length > 0) {
          return dispatch(
            changePictureWithToast({
              userId,
              image,
              userPicture: objects[0],
              token,
            }),
          );
        }
        console.log('Failed to upload picture', payload);
      },
      (err) => {
        console.log('Failed to upload picture', err);
      },
    );
  }

  return Promise.reject();
};

const updateAccountState = (state: AccountModelState, payload: object) => {
  const newState = _.clone(state);

  [
    'expDate',
    'actDate',
    'firstActDate',
    'userId',
    'iccid',
    'uuid',
    'mobile',
    'pin',
    'email',
    'token',
    'deviceToken',
    'simCardName',
    'simCardImage',
  ].forEach((key) => {
    if (!_.isEmpty(payload[key])) newState[key] = payload[key];
  });

  ['balance', 'simPartnerId', 'nid', 'uid'].forEach((key) => {
    if (_.isNumber(payload[key])) newState[key] = payload[key];
  });

  ['isPushNotiEnabled'].forEach((key) => {
    if (payload[key]) newState[key] = payload[key];
  });

  newState.isUsedByOther = undefined;
  return newState;
};

const initialState: AccountModelState = {
  loggedIn: false,
};

const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    signUp: (state, action: PayloadAction<{email: string}>) => {
      state.email = action.payload.email;
    },
    updateAccount: (state, action: PayloadAction<AccountModelState>) => {
      return updateAccountState(state, action.payload);
    },
    resetAccount: () => initialState,
    clearAccount: (state) => ({
      ...state,
      expDate: undefined,
      balance: undefined,
      simPartnerId: undefined,
      actDate: undefined,
      firstActDate: undefined,
      userId: undefined,
      uid: undefined,
      uuid: undefined,
      iccid: undefined,
      nid: undefined,
      simCardName: undefined,
      simCardImage: undefined,
      isUsedByOther: undefined,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(logIn.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0 && objects && objects.length > 0) {
        const obj = objects[0];
        state.token = obj.csrf_token;
        state.mobile = obj.current_user.name;
        state.uid = Number(obj.current_user.uid);
        state.pin = obj.pass;
        state.loggedIn = true;
      } else {
        state.token = undefined;
        state.loggedIn = false;
      }
    });

    builder.addCase(logIn.rejected, (state) => {
      state.token = undefined;
      state.loggedIn = false;
    });

    builder.addCase(getUserId.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0 && objects && objects.length > 0) {
        state.userId = objects[0].id;
        state.email = objects[0].mail;
        state.isPushNotiEnabled = objects[0].isPushNotiEnabled;
        state.userPictureUrl = objects[0].userPictureUrl;
      }
    });

    builder.addCase(registerMobile0.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0 && objects && objects.length > 0) {
        storeData(API.User.KEY_ICCID, objects[0].iccid);
        return updateAccountState(state, objects[0]);
      }
      return state;
    });

    builder.addCase(getAccount.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0 && objects && objects.length > 0) {
        if (objects[0].status === 'A') {
          // Active status
          const {mobile} = state;
          if (!_.isEmpty(mobile) && mobile !== objects[0].mobile) {
            // mobile 번호가 다르면, ICCID는 다른 단말에 할당된 것이므로 무시한다.
            return {
              ...state,
              isUsedByOther: true,
            };
          }
          storeData(API.User.KEY_ICCID, objects[0].iccid);
          return updateAccountState(state, objects[0]);
        }

        // invalid status
        removeData(API.User.KEY_ICCID);
      }
      return state;
    });

    builder.addCase(uploadPicture.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0 && objects && objects.length > 0) {
        // update picture file id
        [state.userPicture] = objects;
      }
    });

    builder.addCase(changePicture.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0 && objects && objects.length > 0) {
        state.userPictureUrl = objects[0].userPictureUrl;
      }
    });

    builder.addCase(
      getToken.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.token = action.payload;
      },
    );
  },
});

export const logout = (): AppThunk => async (dispatch) => {
  const token = await retrieveData(API.User.KEY_TOKEN);

  removeData(API.User.KEY_ICCID);
  removeData(API.User.KEY_MOBILE);
  removeData(API.User.KEY_PIN);
  removeData(API.User.KEY_TOKEN);

  batch(() => {
    // 먼저 로그아웃 한다.
    dispatch(logOut(token));

    dispatch(slice.actions.resetAccount());
    // reset 한 후에 token을 다시 읽어 온다.
    dispatch(getToken());
  });
};

export const changeEmail = (mail: string): AppThunk => (
  dispatch: AppDispatch,
  getState,
) => {
  const {
    account: {userId, token, pin},
  } = getState();
  const attributes = {
    mail,
    pass: {
      existing: pin,
    },
  };

  return dispatch(changeUserAttrWithToast({userId, token, attributes})).then(
    ({payload}) => {
      if (payload.result === 0) {
        return dispatch(slice.actions.updateAccount({email: mail}));
      }
    },
    (err) => {
      console.log('failed to update email', err);
    },
  );
};

export const changePushNoti = ({
  isPushNotiEnabled,
}: {
  isPushNotiEnabled: boolean;
}): AppThunk => (dispatch: AppDispatch, getState) => {
  const {
    account: {userId, token},
  } = getState();
  const attributes = {
    field_is_notification_enabled: isPushNotiEnabled,
  };

  return dispatch(changeUserAttrWithToast({userId, token, attributes})).then(
    ({payload}) => {
      if (payload.result === 0) {
        return dispatch(slice.actions.updateAccount({isPushNotiEnabled}));
      }
      return Promise.reject();
    },
  );
};

export const clearCurrentAccount = (): AppThunk => (dispatch) => {
  removeData(API.User.KEY_ICCID);

  batch(() => {
    dispatch(slice.actions.clearAccount());
  });
};

export const actions = {
  ...slice.actions,
  clearCookies,
  auth,
  logInAndGetAccount,
  getToken,
  clearCurrentAccount,
  uploadAndChangePicture,
  logout,
  changeEmail,
  changeNotiToken,
  getAccount,
  getUserId,
  changePushNoti,
};
export type AccountAction = typeof actions;

export default slice.reducer as Reducer<AccountModelState, AnyAction>;
