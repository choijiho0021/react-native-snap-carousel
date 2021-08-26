/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {Platform} from 'react-native';
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  RootState,
} from '@reduxjs/toolkit';
import _ from 'underscore';
import {batch} from 'react-redux';
import {API} from '@/redux/api';
import {removeData, retrieveData, storeData} from '@/utils/utils';
import Env from '@/environment';
import {RkbAccount, RkbFile, RkbImage} from '@/redux/api/accountApi';
import api, {ApiResult} from '@/redux/api/api';
import messaging from '@react-native-firebase/messaging';
import {actions as toastActions, reflectWithToast, Toast} from './toast';

const {esimApp} = Env.get();

const getToken = createAsyncThunk('account/getToken', API.User.getToken);
const logIn = createAsyncThunk('acccount/logIn', API.User.logIn);
const logOut = createAsyncThunk('account/logOut', API.User.logOut);
const clearCookies = createAsyncThunk(
  'account/clearCookie',
  API.User.clearCookies,
);
const getUserId = createAsyncThunk('account/getUserId', API.User.getByName);
const getAccount = createAsyncThunk(
  'account/getAccount',
  API.Account.getAccount,
);
const getAccountByUser = createAsyncThunk(
  'account/getAccountByUser',
  API.Account.getByUser,
);
const registerMobile = createAsyncThunk(
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

export type AccountModelState = {
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
  old_deviceToken?: string;
  old_fcmToken?: string;
  simCardName?: string;
  simCardImage?: string;
  isUsedByOther?: boolean;
  isPushNotiEnabled?: boolean;
};

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

const changeNotiToken = createAsyncThunk(
  'account/changeNotiToken',
  ({notiToken}: {notiToken?: string}, {dispatch, getState}) => {
    const {
      account: {token, deviceToken, userId},
    } = getState() as RootState;

    const attr = notiToken || deviceToken;
    const attributes = {
      field_device_token: Platform.OS === 'ios' ? attr : '',
      field_fcm_token: Platform.OS === 'android' ? attr : '',
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
  },
);

// export const clearCookies = (): AppThunk => (dispatch) => {
//   return dispatch(clearCookies0());
// };

const logInAndGetAccount = createAsyncThunk(
  'account/logInAndGetAccount',
  (
    {mobile, pin, iccid}: {mobile?: string; pin?: string; iccid?: string},
    {dispatch, getState},
  ) => {
    if (!mobile || !pin) {
      return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter');
    }

    return dispatch(logIn({user: mobile, pass: pin})).then(
      ({payload}) => {
        const {result, objects} = payload || {};
        if (result === 0 && objects && objects.length > 0) {
          const obj = objects[0];
          const token = obj.csrf_token;

          storeData(API.User.KEY_MOBILE, obj.current_user.name);
          storeData(API.User.KEY_PIN, pin);
          storeData(API.User.KEY_TOKEN, obj.csrf_token);

          // Account 정보를 가져온 후 Token 값이 다르면 Disconnect
          const getAccountWithDisconnect = (account: {
            iccid: string;
            token: string;
          }) => {
            Promise.resolve(dispatch(getAccount(account))).then(() => {
              const {
                account: {old_deviceToken},
              } = getState() as RootState;
              messaging()
                .getToken()
                .then((deviceToken) => {
                  if (old_deviceToken && deviceToken !== old_deviceToken) {
                    API.Noti.sendDisconnect({
                      mobile,
                      iccid: account.iccid,
                    }).then(() => dispatch(changeNotiToken({})));
                  }
                });
            });
          };
          // get ICCID account info
          if (iccid) {
            getAccountWithDisconnect({iccid, token});
          } else if (esimApp) {
            dispatch(
              registerMobile({iccid: 'esim', code: pin, mobile, token}),
            ).then(({payload: resp}) => {
              if (resp.result === 0)
                getAccountWithDisconnect({iccid: `00001111${mobile}`, token});
            });
          } else {
            // 가장 최근 사용한 SIM 카드 번호를 조회한다.
            dispatch(getAccountByUser({mobile, token})).then(
              ({payload}: {payload: ApiResult<RkbAccount>}) => {
                const {result: rst, objects: obj} = payload;
                if (rst === 0 && obj && obj[0]?.status === 'A') {
                  getAccountWithDisconnect({iccid: obj[0].iccid, token});
                }
              },
            );
          }

          dispatch(getUserId({name: obj.current_user.name, token}));
          return api.success([]);
        }
        return payload;
      },
      (err) => {
        console.log('login failed', err);
        dispatch(toastActions.push('reg:failedToLogIn'));
        return api.reject(api.E_INVALID_STATUS, 'failed to login');
      },
    );
  },
);

const uploadAndChangePicture = createAsyncThunk(
  'account/uploadAndChangePicture',
  (image: RkbImage, {dispatch, getState}) => {
    const {
      account: {userId, token, mobile},
    } = getState() as RootState;

    if (userId && mobile && token) {
      return dispatch(
        uploadPictureWithToast({image, user: mobile, token}),
      ).then(
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
  },
);

const updateAccountState = (
  state: AccountModelState,
  payload: AccountModelState,
) => {
  const newState = _.clone(state);
  if (payload.expDate) newState.expDate = payload.expDate;
  if (payload.actDate) newState.actDate = payload.actDate;
  if (payload.firstActDate) newState.firstActDate = payload.firstActDate;
  if (payload.userId) newState.userId = payload.userId;
  if (payload.iccid) newState.iccid = payload.iccid;
  if (payload.uuid) newState.uuid = payload.uuid;
  if (payload.mobile) newState.mobile = payload.mobile;
  if (payload.pin) newState.pin = payload.pin;
  if (payload.email) newState.email = payload.email;
  if (payload.token) newState.token = payload.token;
  if (payload.deviceToken) newState.deviceToken = payload.deviceToken;
  if (payload.old_deviceToken || payload.old_fcmToken)
    newState.old_deviceToken = payload.old_deviceToken || payload.old_fcmToken;

  if (payload.simCardName) newState.simCardName = payload.simCardName;
  if (payload.simCardImage) newState.simCardImage = payload.simCardImage;
  if (payload.isPushNotiEnabled)
    newState.isPushNotiEnabled = payload.isPushNotiEnabled;

  if (_.isNumber(payload.balance)) newState.balance = payload.balance;
  if (_.isNumber(payload.simPartnerId))
    newState.simPartnerId = payload.simPartnerId;
  if (_.isNumber(payload.nid)) newState.nid = payload.nid;
  if (_.isNumber(payload.uid)) newState.uid = payload.uid;

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

    builder.addCase(registerMobile.fulfilled, (state, action) => {
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
        state.userPictureUrl = objects[0].userPictureUrl;
      }
    });

    builder.addCase(changePicture.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (
        result === 0 &&
        objects &&
        objects.length > 0 &&
        objects[0].userPictureUrl
      ) {
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

const logout = createAsyncThunk('account/logout', async (param, {dispatch}) => {
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
});

const changeEmail = createAsyncThunk(
  'account/changeEmail',
  (mail: string, {dispatch, getState}) => {
    const {
      account: {userId, token, pin},
    } = getState() as RootState;

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
        return Promise.resolve(payload);
      },
      (err) => {
        console.log('failed to update email', err);
      },
    );
  },
);

const changePushNoti = createAsyncThunk(
  'account/changePushNoti',
  ({isPushNotiEnabled}: {isPushNotiEnabled: boolean}, {dispatch, getState}) => {
    const {
      account: {userId, token},
    } = getState() as RootState;

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
  },
);

const clearCurrentAccount = createAsyncThunk(
  'account/clearCurrentAccount',
  (param, {dispatch}) => {
    removeData(API.User.KEY_ICCID);

    batch(() => {
      dispatch(slice.actions.clearAccount());
    });
  },
);

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
  uploadPicture,
  registerMobile,
};
export type AccountAction = typeof actions;

export default slice.reducer as Reducer<AccountModelState, AnyAction>;
