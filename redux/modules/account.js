import {Platform} from 'react-native';
import {createAction, handleActions} from 'redux-actions';
import {Map} from 'immutable';
import {pender} from 'redux-pender';
import _ from 'underscore';
import utils from '../../utils/utils';
import {batch} from 'react-redux';
import * as ToastActions from './toast';
import {Toast} from '../../constants/CustomTypes';
import {API} from 'Rokebi/submodules/rokebi-utils';

const SIGN_UP = 'rokebi/account/SIGN_UP';
export const UPDATE_ACCOUNT = 'rokebi/account/UPDATE_ACCOUNT';
const RESET_ACCOUNT = 'rokebi/account/RESET_ACCOUNT';
const GET_USER_ID = 'rokebi/account/GET_USER_ID';
export const GET_ACCOUNT = 'rokebi/account/GET_ACCOUNT';
const GET_ACCOUNT_BY_USER = 'rokebi/account/GET_ACCOUNT_BY_USER';
const GET_ACCOUNT_BY_UUID = 'rokebi/account/GET_ACCOUNT_BY_UUID';
const ACTIVATE_ACCOUNT = 'rokebi/account/ACTIVATE_ACCOUNT';
export const LOGIN = 'rokebi/account/LOGIN';
const UPLOAD_PICTURE = 'rokebi/account/UPLOAD_PICTURE';
const CHANGE_PICTURE = 'rokebi/account/CHANGE_PICTURE';
const GET_TOKEN = 'rokebi/account/GET_TOKEN';
export const CHANGE_ATTR = 'rokebi/account/CHANGE_ATTR';
const REGISTER_MOBILE = 'rokebi/account/REGISTER_MOBILE';
const CLEAR_ACCOUNT = 'rokebi/account/CLEAR_ACCOUNT';

export const getToken = createAction(GET_TOKEN, API.User.getToken);
export const updateAccount = createAction(UPDATE_ACCOUNT);
const resetAccount = createAction(RESET_ACCOUNT);
export const signUp = createAction(SIGN_UP);
const logIn = createAction(LOGIN, API.User.logIn);
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

const changeUserAttrWithToast = utils.reflectWithToast(
  changeUserAttr,
  Toast.NOT_UPDATED,
);
const uploadPictureWithToast = utils.reflectWithToast(
  uploadPicture,
  Toast.NOT_UPDATED,
);
const changePictureWithToast = utils.reflectWithToast(
  changePicture,
  Toast.NOT_UPDATED,
);

export const logout = () => {
  return dispatch => {
    utils.removeData(API.User.KEY_ICCID);
    utils.removeData(API.User.KEY_MOBILE);
    utils.removeData(API.User.KEY_PIN);

    batch(() => {
      dispatch(resetAccount());
      // reset 한 후에 token을 다시 읽어 온다.
      dispatch(getToken());
    });
  };
};

export const changeEmail = mail => {
  return (dispatch, getState) => {
    const {account} = getState(),
      authObj = auth(account),
      attr = {
        mail,
        pass: {
          existing: authObj.pass,
        },
      };

    return dispatch(
      changeUserAttrWithToast(account.get('userId'), authObj, attr),
    ).then(
      resp => {
        if (resp.result == 0) {
          return dispatch(updateAccount({email: mail}));
        }
      },
      err => {
        console.log('failed to update email', err);
      },
    );
  };
};

export const changeNotiToken = () => {
  return async (dispatch, getState) => {
    const {account} = getState();
    const fcmToken = account.get('fcmToken');

    const authObj = auth(account),
      attr = {
        field_fcm_token: fcmToken,
      };

    return dispatch(changeUserAttr(account.get('userId'), authObj, attr)).then(
      resp => {
        if (resp.result == 0) {
          console.log('Token is updated');
        }
      },
      err => {
        console.log('failed to update noti token', err);
      },
    );
  };
};

export const changePushNoti = ({isPushNotiEnabled}) => {
  return (dispatch, getState) => {
    const {account} = getState(),
      authObj = auth(account),
      attr = {
        field_is_notification_enabled: isPushNotiEnabled,
      };

    return dispatch(
      changeUserAttrWithToast(account.get('userId'), authObj, attr),
    ).then(resp => {
      if (resp.result === 0) {
        return dispatch(updateAccount({isPushNotiEnabled}));
      }
      return Promise.reject();
    });
  };
};

export const registerMobile = (iccid, code, mobile) => {
  return (dispatch, getState) => {
    const {account} = getState(),
      authObj = auth(account);
    return dispatch(registerMobile0(iccid, code, mobile, authObj)).then(
      resp => {
        if (resp.result == 0) {
          return dispatch(getAccount(iccid, authObj));
        }
        console.log('failed to register mobile resp:', resp);
        return resp;
      },
      err => {
        console.log('failed to register mobile', err);
        return {
          result: -1,
        };
      },
    );
  };
};

export const logInAndGetAccount = (mobile, pin, iccid) => {
  return (dispatch, getState) => {
    return dispatch(logIn(mobile, pin)).then(
      resp => {
        if (resp.result == 0 && resp.objects.length > 0) {
          const obj = resp.objects[0],
            token = {token: obj.csrf_token};

          utils.storeData(API.User.KEY_MOBILE, obj.current_user.name);
          utils.storeData(API.User.KEY_PIN, pin);

          // get ICCID account info
          if (iccid) {
            dispatch(getAccount(iccid, token)).then(resp => {
              console.log('resp register', resp);
            });
          } else {
            // 가장 최근 사용한 SIM 카드 번호를 조회한다.
            dispatch(getAccountByUser(mobile, token)).then(resp => {
              if (
                resp.result == 0 &&
                resp.objects.length > 0 &&
                resp.objects[0].status == 'A'
              ) {
                utils.storeData(API.User.KEY_ICCID, resp.objects[0].iccid);
                dispatch(getAccount(resp.objects[0].iccid, token));
              }
            });
          }

          //iccid 상관 없이 로그인마다 토큰 업데이트
          return dispatch(getUserId(obj.current_user.name, token)).then(
            resp => {
              console.log('user resp', resp);
              dispatch(changeNotiToken());
            },
          );
        }
      },
      err => {
        dispatch(ToastActions.push());
        console.log('login failed', err);
      },
    );
  };
};

export const uploadAndChangePicture = image => {
  return (dispatch, getState) => {
    const {account} = getState();
    return dispatch(uploadPictureWithToast(image, auth(account))).then(
      resp => {
        if (resp.result == 0 && resp.objects.length > 0) {
          return dispatch(
            changePictureWithToast(
              account.get('userId'),
              resp.objects[0],
              auth(account),
            ),
          );
        }
        console.log('Failed to upload picture', resp);
      },
      err => {
        console.log('Failed to upload picture', err);
      },
    );
  };
};

export const clearCurrentAccount = () => {
  return dispatch => {
    utils.removeData(API.User.KEY_ICCID);

    batch(() => {
      dispatch(clearAccount());
    });
  };
};

export const auth = state => ({
  user: state.get('mobile'),
  pass: state.get('pin'),
  token: state.get('token'),
});

const updateAccountState = (state, payload) => {
  const {
    expDate,
    balance,
    simPartnerId,
    actDate,
    firstActDate,
    userId,
    simCardImage,
    simCardName,
    iccid,
    uuid,
    nid,
    uid,
    mobile,
    pin,
    email,
    token,
    fcmToken,
    isPushNotiEnabled,
  } = payload;

  if (!_.isEmpty(expDate)) state = state.set('expDate', expDate);
  if (_.isNumber(balance)) state = state.set('balance', balance);
  if (_.isNumber(simPartnerId)) state = state.set('simPartnerId', simPartnerId);
  if (!_.isEmpty(actDate)) state = state.set('actDate', actDate);
  if (!_.isEmpty(firstActDate)) state = state.set('firstActDate', firstActDate);
  if (!_.isEmpty(userId)) state = state.set('userId', userId);
  if (!_.isEmpty(iccid)) state = state.set('iccid', iccid);
  if (!_.isEmpty(uuid)) state = state.set('uuid', uuid);
  if (_.isNumber(nid)) state = state.set('nid', nid);
  if (_.isNumber(uid)) state = state.set('uid', uid);
  if (!_.isEmpty(mobile)) state = state.set('mobile', mobile);
  if (!_.isEmpty(pin)) state = state.set('pin', pin);
  if (!_.isEmpty(email)) state = state.set('email', email);
  if (!_.isEmpty(token)) state = state.set('token', token);
  if (!_.isEmpty(fcmToken)) state = state.set('fcmToken', fcmToken);
  if (!_.isEmpty(simCardName)) state = state.set('simCardName', simCardName);
  if (!_.isEmpty(simCardImage)) state = state.set('simCardImage', simCardImage);
  if (!_.isUndefined(isPushNotiEnabled))
    state = state.set('isPushNotiEnabled', isPushNotiEnabled);

  state = state.set('isUsedByOther', undefined);

  return state;
};

const initialState = Map({
  expDate: undefined,
  balance: undefined,
  email: undefined,
  mobile: undefined,
  token: undefined,
  simPartnerId: undefined,
  actDate: undefined,
  firstActDate: undefined,
  userId: undefined,
  uid: undefined,
  uuid: undefined,
  iccid: undefined,
  nid: undefined,
  pin: undefined,
  loggedIn: false,
  userPicture: undefined,
  userPictureUrl: undefined,
  fcmToken: undefined,
  simCardName: undefined,
  simCardImage: undefined,
  isUsedByOther: undefined,
  isPushNotiEnabled: undefined,
});

export default handleActions(
  {
    [SIGN_UP]: (state, action) => {
      return state.set('email', action.payload.email);
    },

    [UPDATE_ACCOUNT]: (state, action) => {
      return updateAccountState(state, action.payload);
    },

    [RESET_ACCOUNT]: (state, action) => {
      return initialState;
    },

    [CLEAR_ACCOUNT]: (state, action) => {
      return state
        .set('expDate', undefined)
        .set('balance', undefined)
        .set('expDate', undefined)
        .set('simPartnerId', undefined)
        .set('actDate', undefined)
        .set('firstActDate', undefined)
        .set('userId', undefined)
        .set('uid', undefined)
        .set('uuid', undefined)
        .set('iccid', undefined)
        .set('nid', undefined)
        .set('simCardName', undefined)
        .set('simCardImage', undefined)
        .set('isUsedByOther', undefined);
    },

    ...pender({
      type: LOGIN,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result == 0 && objects.length > 0) {
          const obj = objects[0];
          return state
            .set('token', obj.csrf_token)
            .set('mobile', obj.current_user.name)
            .set('uid', obj.current_user.uid)
            .set('pin', obj.pass)
            .set('loggedIn', true);
        }
        return state.set('token', undefined).set('loggedIn', false);
      },
      onFailure: (state, action) => {
        return state.set('token', undefined).set('loggedIn', false);
      },
    }),

    ...pender({
      type: GET_USER_ID,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result == 0 && objects.length > 0) {
          return state
            .set('userId', objects[0].id)
            .set('email', objects[0].mail)
            .set('isPushNotiEnabled', objects[0].isPushNotiEnabled)
            .set('userPictureUrl', objects[0].userPictureUrl);
        }
        return state;
      },
    }),

    ...pender({
      type: REGISTER_MOBILE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result == 0 && objects.length > 0) {
          utils.storeData(API.User.KEY_ICCID, objects[0].iccid);
          return updateAccountState(state, objects[0]);
        }
        return state;
      },
    }),

    ...pender({
      type: GET_ACCOUNT,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result == 0 && objects.length > 0) {
          if (objects[0].status == 'A') {
            // Active status
            const mobile = state.get('mobile');
            if (!_.isEmpty(mobile) && mobile != objects[0].mobile) {
              // mobile 번호가 다르면, ICCID는 다른 단말에 할당된 것이므로 무시한다.
              return state.set('isUsedByOther', true);
            }
            utils.storeData(API.User.KEY_ICCID, objects[0].iccid);
            return updateAccountState(state, objects[0]);
          }

          // invalid status
          utils.removeData(API.User.KEY_ICCID);
        }
        return state;
      },
    }),

    ...pender({
      type: UPLOAD_PICTURE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result == 0 && objects.length > 0) {
          // update picture file id
          return state.set('userPicture', objects[0]);
        }
        return state;
      },
    }),

    ...pender({
      type: CHANGE_PICTURE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result == 0 && objects.length > 0) {
          return state.set('userPictureUrl', objects[0].userPictureUrl);
        }
        return state;
      },
    }),

    ...pender({
      type: GET_TOKEN,
      onSuccess: (state, action) => {
        return state.set('token', action.payload);
      },
    }),
  },
  initialState,
);
