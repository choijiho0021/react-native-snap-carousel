import {Platform} from 'react-native';
import {createAction, handleActions} from 'redux-actions';
import {pender} from 'redux-pender';
import _ from 'underscore';
import {batch} from 'react-redux';
import {API} from '@/submodules/rokebi-utils';
import {
  reflectWithToast,
  removeData,
  retrieveData,
  storeData,
} from '@/utils/utils';
import {Toast} from '@/constants/CustomTypes';
import Env from '@/environment';
import {AppThunk} from '..';
import {actions as toastActions} from './toast';

const {esimApp} = Env.get();

const SIGN_UP = 'rokebi/account/SIGN_UP';
export const UPDATE_ACCOUNT = 'rokebi/account/UPDATE_ACCOUNT';
const RESET_ACCOUNT = 'rokebi/account/RESET_ACCOUNT';
const GET_USER_ID = 'rokebi/account/GET_USER_ID';
export const GET_ACCOUNT = 'rokebi/account/GET_ACCOUNT';
const GET_ACCOUNT_BY_USER = 'rokebi/account/GET_ACCOUNT_BY_USER';
const GET_ACCOUNT_BY_UUID = 'rokebi/account/GET_ACCOUNT_BY_UUID';
const ACTIVATE_ACCOUNT = 'rokebi/account/ACTIVATE_ACCOUNT';
export const LOGIN = 'rokebi/account/LOGIN';
export const LOGOUT = 'rokebi/account/LOGOUT';
export const CLEAR_COOKIES = 'rokebi/account/CLEAR_COOKIES';
export const GET_ALL_COOKIES = 'rokebi/account/GET_ALL_COOKIES';
export const UPLOAD_PICTURE = 'rokebi/account/UPLOAD_PICTURE';
export const CHANGE_PICTURE = 'rokebi/account/CHANGE_PICTURE';
const GET_TOKEN = 'rokebi/account/GET_TOKEN';
export const CHANGE_ATTR = 'rokebi/account/CHANGE_ATTR';
const REGISTER_MOBILE = 'rokebi/account/REGISTER_MOBILE';
const CLEAR_ACCOUNT = 'rokebi/account/CLEAR_ACCOUNT';

export const getToken = createAction(GET_TOKEN, API.User.getToken);
export const updateAccount = createAction(UPDATE_ACCOUNT);
const resetAccount = createAction(RESET_ACCOUNT);
export const signUp = createAction(SIGN_UP);
const logIn = createAction(LOGIN, API.User.logIn);
const logOut = createAction(LOGOUT, API.User.logOut);
const clearCookies0 = createAction(CLEAR_COOKIES, API.User.clearCookies);
export const getUserId = createAction(GET_USER_ID, API.User.getByName);
export const getAccount = createAction(GET_ACCOUNT, API.Account.getAccount);
const getAccountByUser = createAction(
  GET_ACCOUNT_BY_USER,
  API.Account.getByUser,
);
export const getAccountByUUID = createAction(
  GET_ACCOUNT_BY_UUID,
  API.Account.getByUUID,
);
export const activateAccount = createAction(
  ACTIVATE_ACCOUNT,
  API.Account.update,
);
const registerMobile0 = createAction(
  REGISTER_MOBILE,
  API.Account.registerMobile,
);
const uploadPicture = createAction(UPLOAD_PICTURE, API.Account.uploadPicture);
const changePicture = createAction(CHANGE_PICTURE, API.User.changePicture);
const changeUserAttr = createAction(CHANGE_ATTR, API.User.update);
const clearAccount = createAction(CLEAR_ACCOUNT);

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
  userPicture?: string;
  userPictureUrl?: string;
  deviceToken?: string;
  simCardName?: string;
  simCardImage?: string;
  isUsedByOther?: boolean;
  isPushNotiEnabled?: boolean;
}

export type AccountAuthType = {
  user?: string;
  pass?: string;
  token?: string;
};

export const auth = (state: AccountModelState): AccountAuthType => ({
  user: state.mobile,
  pass: state.pin,
  token: state.token,
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

    dispatch(resetAccount());
    // reset 한 후에 token을 다시 읽어 온다.
    dispatch(getToken());
  });
};

export const changeEmail = (mail: string): AppThunk => (dispatch, getState) => {
  const {account} = getState();
  const authObj = auth(account);
  const attr = {
    mail,
    pass: {
      existing: authObj.pass,
    },
  };

  return dispatch(changeUserAttrWithToast(account.userId, authObj, attr)).then(
    (resp) => {
      if (resp.result === 0) {
        return dispatch(updateAccount({email: mail}));
      }
    },
    (err) => {
      console.log('failed to update email', err);
    },
  );
};

export const changeNotiToken = (): AppThunk => async (dispatch, getState) => {
  const {account} = getState();
  const fcmToken = Platform.OS === 'android' ? account.deviceToken : '';
  const deviceToken = Platform.OS === 'ios' ? account.deviceToken : '';

  const authObj = auth(account);
  const attr = {
    field_device_token: deviceToken,
    field_fcm_token: fcmToken,
  };

  return dispatch(changeUserAttr(account.userId, authObj, attr)).then(
    (resp) => {
      if (resp.result === 0) {
        console.log('Token is updated');
      }
    },
    (err) => {
      console.log('failed to update noti token', err);
    },
  );
};

export const changePushNoti = ({
  isPushNotiEnabled,
}: {
  isPushNotiEnabled: boolean;
}): AppThunk => (dispatch, getState) => {
  const {account} = getState();
  const authObj = auth(account);
  const attr = {
    field_is_notification_enabled: isPushNotiEnabled,
  };

  return dispatch(changeUserAttrWithToast(account.userId, authObj, attr)).then(
    (resp) => {
      if (resp.result === 0) {
        return dispatch(updateAccount({isPushNotiEnabled}));
      }
      return Promise.reject();
    },
  );
};

export const registerMobile = (
  iccid: string,
  code: string,
  mobile: string,
): AppThunk => (dispatch, getState) => {
  const {account} = getState();
  const authObj = auth(account);

  return dispatch(registerMobile0(iccid, code, mobile, authObj)).then(
    (resp) => {
      if (resp.result === 0) {
        return dispatch(getAccount(iccid, authObj));
      }
      console.log('failed to register mobile resp:', resp);
      return resp;
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

export const logInAndGetAccount = (
  mobile: string,
  pin: string,
  iccid?: string,
): AppThunk => (dispatch) => {
  return dispatch(logIn(mobile, pin)).then(
    (resp) => {
      if (resp.result === 0 && resp.objects.length > 0) {
        const obj = resp.objects[0];
        const token = {token: obj.csrf_token};

        storeData(API.User.KEY_MOBILE, obj.current_user.name);
        storeData(API.User.KEY_PIN, pin);
        storeData(API.User.KEY_TOKEN, obj.csrf_token);

        // get ICCID account info
        if (iccid) {
          dispatch(getAccount(iccid, token)).then((rsp) => {
            console.log('resp register', rsp);
          });
        } else if (esimApp) {
          dispatch(registerMobile('esim', pin, mobile));
        } else {
          // 가장 최근 사용한 SIM 카드 번호를 조회한다.
          dispatch(getAccountByUser(mobile, token)).then((rsp) => {
            if (
              rsp.result === 0 &&
              rsp.objects.length > 0 &&
              rsp.objects[0].status === 'A'
            ) {
              storeData(API.User.KEY_ICCID, rsp.objects[0].iccid);
              dispatch(getAccount(rsp.objects[0].iccid, token));
            }
          });
        }

        // iccid 상관 없이 로그인마다 토큰 업데이트
        return dispatch(getUserId(obj.current_user.name, token)).then((rsp) => {
          console.log('user resp', rsp);
          dispatch(changeNotiToken());
        });
      }
    },
    (err) => {
      dispatch(toastActions.push());
      console.log('login failed', err);
    },
  );
};

export const uploadAndChangePicture = (image: string): AppThunk => (
  dispatch,
  getState,
) => {
  const {account} = getState();
  return dispatch(uploadPictureWithToast(image, auth(account))).then(
    (resp) => {
      if (resp.result === 0 && resp.objects.length > 0) {
        return dispatch(
          changePictureWithToast(
            account.userId,
            resp.objects[0],
            auth(account),
          ),
        );
      }
      console.log('Failed to upload picture', resp);
    },
    (err) => {
      console.log('Failed to upload picture', err);
    },
  );
};

export const clearCurrentAccount = (): AppThunk => (dispatch) => {
  removeData(API.User.KEY_ICCID);

  batch(() => {
    dispatch(clearAccount());
  });
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

export const actions = {
  changeNotiToken,
  getAccount,
  clearCurrentAccount,
  logInAndGetAccount,
  updateAccount,
  logout,
  getUserId,
  uploadAndChangePicture,
  changeEmail,
  auth,
  clearCookies,
  getToken,
};
export type AccountAction = typeof actions;

const initialState: AccountModelState = {
  loggedIn: false,
};

export default handleActions<AccountModelState>(
  {
    [SIGN_UP]: (state, {payload}) => {
      return {
        ...state,
        email: payload.email,
      };
    },

    [UPDATE_ACCOUNT]: (state, {payload}) => {
      return updateAccountState(state, payload);
    },

    [RESET_ACCOUNT]: () => {
      return initialState;
    },

    [CLEAR_ACCOUNT]: (state) => {
      return {
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
      };
    },

    ...pender<AccountModelState>({
      type: LOGIN,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0 && objects.length > 0) {
          const obj = objects[0];
          return {
            ...state,
            token: obj.csrf_token,
            mobile: obj.current_user.name,
            uid: obj.current_user.uid,
            pin: obj.pass,
            loggedIn: true,
          };
        }
        return {
          ...state,
          token: undefined,
          loggedIn: false,
        };
      },
      onFailure: (state) => {
        return {
          ...state,
          token: undefined,
          loggedIn: false,
        };
      },
    }),

    ...pender({
      type: GET_USER_ID,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0 && objects.length > 0) {
          return {
            ...state,
            userId: objects[0].id,
            email: objects[0].mail,
            isPushNotiEnabled: objects[0].isPushNotiEnabled,
            userPictureUrl: objects[0].userPictureUrl,
          };
        }
        return state;
      },
    }),

    ...pender({
      type: REGISTER_MOBILE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0 && objects.length > 0) {
          storeData(API.User.KEY_ICCID, objects[0].iccid);
          return updateAccountState(state, objects[0]);
        }
        return state;
      },
    }),

    ...pender({
      type: GET_ACCOUNT,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0 && objects.length > 0) {
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
      },
    }),

    ...pender({
      type: UPLOAD_PICTURE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0 && objects.length > 0) {
          // update picture file id
          return {
            ...state,
            userPicture: objects[0],
          };
        }
        return state;
      },
    }),

    ...pender({
      type: CHANGE_PICTURE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0 && objects.length > 0) {
          return {
            ...state,
            userPictureUrl: objects[0].userPictureUrl,
          };
        }
        return state;
      },
    }),

    ...pender({
      type: GET_TOKEN,
      onSuccess: (state, action) => {
        return {
          ...state,
          token: action.payload,
        };
      },
    }),
  },
  initialState,
);
