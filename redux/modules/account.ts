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
import messaging from '@react-native-firebase/messaging';
import {Moment} from 'moment';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
import {API} from '@/redux/api';
import {removeData, retrieveData, storeData} from '@/utils/utils';
import {RkbFile, RkbImage} from '@/redux/api/accountApi';
import api, {ApiResult} from '@/redux/api/api';
import {actions as toastActions, reflectWithToast, Toast} from './toast';
import {actions as orderActions} from './order';
import {actions as promotionActions} from './promotion';
import {actions as notiActions} from './noti';
import Env from '@/environment';
import userApi from '@/redux/api/userApi';

const {cachePrefix} = Env.get();

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

const getCashHistory = createAsyncThunk(
  'account/getCashHistory',
  API.Account.getCashHistory,
);

const getCashExpire = createAsyncThunk(
  'account/getCashExpire',
  API.Account.getCashExpire,
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

const receiveGift = createAsyncThunk(
  'account/receiveGift',
  API.User.receiveGift,
);

const receiveAndGetGift = createAsyncThunk(
  'account/receiveAndGetGift',
  ({sender, gift}: {sender: string; gift: string}, {dispatch, getState}) => {
    const {
      account: {iccid, token},
    } = getState() as RootState;

    return dispatch(receiveGift({sender, gift, iccid, token})).then(
      ({payload}) => {
        if (payload?.result?.code === 0) {
          dispatch(promotionActions.removeGiftAndRecommender({sender, gift}));
          return dispatch(orderActions.getSubsWithToast({iccid, token}));
        }
        return undefined;
      },
    );
  },
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

// * CashHistory type
// * - cash_add : 프로모션으로 캐시 추가
// * - cash_recharge : 충전 구매
// * - cash_refund : 고객 센터에서 캐시 추가
// * - point_refund : 고객 센터에서 포인트 추가
// * - cash_deduct : 캐시 사용
// * - point_deduct : 포인트 사용
// * - point_add : 포인트 지급
// * - point_exp : 포인트 소멸

export type SectionData = {title: string; data: CashHistory[]};
export type CashHistory = {
  account_id: string;
  after: string;
  before: string;
  create_dt: Moment;
  created: string;
  diff: number;
  expire_dt: Moment;
  field: string;
  id: string;
  inc: string;
  log_id: string;
  order: string;
  order_id: string;
  order_title: string;
  point_id: string;
  product: string;
  type: string;
};

export type CashExpire = {
  create_dt: Moment;
  expire_dt: Moment;
  point: string;
};

export type AccountModelState = {
  expDate?: string;
  balance?: number;
  email?: string;
  mobile?: string;
  token?: string;
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
  deviceModel?: string;
  isSupportDev?: boolean;
  isFirst?: boolean;
  cashHistory?: SectionData[];
  cashExpire?: CashExpire[];
  isNewUser?: boolean;
  expirePt?: number;
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
  (param: string, {dispatch, getState}) => {
    const {
      account: {token, deviceToken, uid, deviceModel},
    } = getState() as RootState;

    const pushToken = param || deviceToken || '';

    const attributes = {
      field_device_token: Platform.OS === 'ios' ? pushToken : '',
      field_fcm_token: Platform.OS === 'android' ? pushToken : '',
      field_device_model: deviceModel,
      field_app_version: `${VersionCheck.getCurrentVersion()}(${DeviceInfo.getBuildNumber()})`,
    };

    return dispatch(changeUserAttr({uid, attributes, token})).then(
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
    {
      mobile,
      pin,
      iccid,
    }: {
      mobile?: string;
      pin?: string;
      iccid?: string;
    },
    {dispatch, getState},
  ) => {
    if (!mobile || !pin) {
      return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter');
    }

    const {
      promotion: {
        receive: {sender, gift},
      },
    } = getState() as RootState;

    return dispatch(logIn({user: mobile, pass: pin}))
      .then(async ({payload: {result, objects}}) => {
        if (result === 0 && objects && objects.length > 0) {
          const obj = objects[0];

          await storeData(API.User.KEY_MOBILE, obj.current_user.name, true);
          await storeData(API.User.KEY_PIN, pin, true);

          // Account 정보를 가져온 후 Token 값이 다르면 Disconnect
          const getAccountWithDisconnect = (account: {
            iccid: string;
            token: string;
          }) => {
            dispatch(getAccount(account)).then(() => {
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
                    }).then(() => dispatch(changeNotiToken(deviceToken)));
                  } else {
                    dispatch(changeNotiToken(deviceToken));
                  }
                });
            });
          };

          const token = await userApi.getToken();

          // get ICCID account info
          if (iccid) {
            getAccountWithDisconnect({iccid, token});
          } else {
            await dispatch(
              registerMobile({iccid: 'esim', code: pin, mobile, token}),
            ).then(({payload: resp}) => {
              if (resp?.result === 0) {
                if (sender && gift && resp?.objects[0]?.iccid) {
                  dispatch(getUserId({name: resp?.objects[0]?.mobile})).then(
                    ({payload: resp2}) => {
                      if (resp2?.result === 0) {
                        if (resp2?.objects[0]?.id !== sender)
                          dispatch(receiveAndGetGift({sender, gift}));
                      }
                    },
                  );
                }
                getAccountWithDisconnect({iccid: `00001111${mobile}`, token});
              }
            });
          }

          dispatch(getUserId({name: obj.current_user.name}));
          dispatch(notiActions.getNotiList({mobile: obj.current_user.name}));
          return api.success([]);
        }
        return {result, objects};
      })
      .catch((err) => {
        console.log('@@@ login failed', err);
        dispatch(toastActions.push('reg:failedToLogIn'));
        return api.reject(api.E_INVALID_STATUS, 'failed to login');
      });
  },
);

const uploadAndChangePicture = createAsyncThunk(
  'account/uploadAndChangePicture',
  (image: RkbImage, {dispatch, getState}) => {
    const {
      account: {uid, token, mobile},
    } = getState() as RootState;

    if (uid && mobile && token) {
      return dispatch(
        uploadPictureWithToast({image, user: mobile, token}),
      ).then(
        ({payload}: {payload: ApiResult<RkbFile>}) => {
          const {result, objects} = payload;
          if (result === 0 && objects && objects.length > 0) {
            return dispatch(
              changePictureWithToast({
                uid,
                userPicture: objects[0],
                token,
              }),
            );
          }
          console.log('Failed to upload picture', payload);
          return Promise.reject();
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
  if (payload.isPushNotiEnabled !== undefined)
    newState.isPushNotiEnabled = payload.isPushNotiEnabled;
  if (payload.deviceModel) newState.deviceModel = payload.deviceModel;
  if (payload.isSupportDev !== undefined)
    newState.isSupportDev = payload.isSupportDev;

  if (payload.isFirst !== undefined) newState.isFirst = payload.isFirst;

  if (_.isNumber(payload.balance)) newState.balance = payload.balance;
  if (_.isNumber(payload.nid)) newState.nid = payload.nid;
  if (_.isNumber(payload.uid)) newState.uid = payload.uid;

  newState.isUsedByOther = undefined;
  newState.isNewUser = payload.isNewUser;

  return newState;
};

const initialState: AccountModelState = {
  loggedIn: false,
  isFirst: false,
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
    resetAccount: (state) => ({
      ...initialState,
      isSupportDev: state.isSupportDev,
    }),
    setCacheMode: (state, action: PayloadAction<AccountModelState>) => {
      const {iccid, mobile, pin, token} = action?.payload;
      return {...state, loggedIn: true, iccid, mobile, pin, token};
    },
    clearAccount: (state) => ({
      ...state,
      expDate: undefined,
      balance: undefined,
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
      isNewUser: undefined,
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
        state.userId = objects[0].uuid;
        state.email = objects[0].mail;
        state.isPushNotiEnabled = objects[0].isPushNotiEnabled;
        state.userPictureUrl = objects[0].userPictureUrl;
      }
    });

    builder.addCase(registerMobile.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0 && objects && objects.length > 0) {
        storeData(API.User.KEY_ICCID, objects[0].iccid, true);
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
          storeData(API.User.KEY_ICCID, objects[0].iccid, true);
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

    builder.addCase(getCashHistory.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects && objects.length > 0) {
        const group = objects.reduce((acc, cur) => {
          const year = cur.create_dt?.format('YYYY');
          const idx = acc.findIndex((elm) => elm.title === year);

          if (idx <= -1) {
            acc.push({title: year, data: [cur] as CashHistory[]});
          } else {
            const orderidx = acc[idx].data.findIndex(
              (elm) =>
                elm.order_id &&
                elm.order_id === cur.order_id &&
                elm.type === cur.type,
            );
            if (orderidx >= 0) {
              acc[idx].data[orderidx].diff += cur.diff;
            } else {
              acc[idx].data?.push(cur);
            }
          }
          return acc;
        }, [] as SectionData[]);

        state.cashHistory = group;
      }

      return state;
    });

    builder.addCase(getCashExpire.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects && objects.length > 0) {
        state.cashExpire = objects;
        state.expirePt = objects.reduce(
          (acc, cur) => acc + Number(cur.point),
          0,
        );
      } else {
        state.expirePt = 0;
      }

      return state;
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
  removeData(`${API.Noti.KEY_INIT_LIST}.${API.User.KEY_MOBILE}`);
  removeData(`${API.Order.KEY_INIT_ORDER}.${API.User.KEY_MOBILE}`);
  removeData(`${API.Cart.KEY_INIT_CART}.${API.User.KEY_MOBILE}`);
  removeData(`${cachePrefix}cache.subs`);
  removeData(`${cachePrefix}cache.store`);

  batch(() => {
    // 먼저 로그아웃 한다.
    dispatch(logOut(token));

    dispatch(slice.actions.resetAccount());
    // reset 한 후에 token을 다시 읽어 온다.
    dispatch(getToken());

    // reset noti
    dispatch(notiActions.reset());
  });
});

const changeEmail = createAsyncThunk(
  'account/changeEmail',
  (mail: string, {dispatch, getState}) => {
    const {
      account: {uid, token},
    } = getState() as RootState;

    return dispatch(
      changeUserAttrWithToast({uid, token, attributes: {mail}}),
    ).then(
      ({payload}) => {
        if (payload.result === 0) {
          dispatch(slice.actions.updateAccount({email: mail}));
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
      account: {uid, token},
    } = getState() as RootState;

    const attributes = {
      field_is_notification_enabled: isPushNotiEnabled,
    };

    return dispatch(changeUserAttrWithToast({uid, token, attributes})).then(
      ({payload}) => {
        console.log('@@@ push noti', payload);
        if (payload.result === 0) {
          return dispatch(slice.actions.updateAccount({isPushNotiEnabled}));
        }
        return Promise.reject();
      },
    );
  },
);

export const actions = {
  ...slice.actions,
  clearCookies,
  auth,
  logInAndGetAccount,
  receiveAndGetGift,
  getToken,
  uploadAndChangePicture,
  logout,
  logOut,
  changeEmail,
  changeNotiToken,
  getAccount,
  getCashHistory,
  getCashExpire,
  getUserId,
  changePushNoti,
  uploadPicture,
  registerMobile,
};
export type AccountAction = typeof actions;

export default slice.reducer as Reducer<AccountModelState, AnyAction>;
