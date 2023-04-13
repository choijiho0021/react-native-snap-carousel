/* eslint-disable eqeqeq */
import _ from 'underscore';
import {retrieveData, storeData, removeData} from '@/utils/utils';
import {AccountAuth} from '@/redux/modules/account';
import api, {ApiResult} from './api';
import {RkbFile} from './accountApi';
import {SocialAuthInfo} from '@/components/SocialLogin';

const KEY_ICCID = 'account.iccid';

const KEY_MOBILE = 'account.mobile';

const KEY_PIN = 'account.pin';

const KEY_TOKEN = 'account.token';

const LOGOUT_TOKEN = 'logout.token';

export type RkbUser = {
  id?: string;
  isPushNotiEnabled?: boolean;
  userPictureUrl?: string;
  uid?: number;
  uuid?: string;
};

const toUser = (rsp): ApiResult<RkbUser> => {
  // jsonapi result
  // const userPictureUrl =
  //   _.isArray(data.included) && data.included.length > 0
  //     ? data.included[0].attributes?.uri?.url
  //     : '';

  if (rsp.result === 0) {
    return api.success(
      rsp.objects?.map((item) => ({
        ...item,
        uid: parseInt(item.uid, 10),
        isPushNotiEnabled: item.field_is_notification_enabled === 'O',
        // userPictureUrl,
      })),
    );
  }

  return api.failure(rsp.result);
};

export type RkbLogin = {
  current_user: {
    uid: string;
    name: string;
    roles?: string[];
  };
  csrf_token: string;
  logout_token: string;
  message?: string;
  pass?: string;
  cookie?: string;
};

const toLogin =
  (pass: string) =>
  (login: RkbLogin): ApiResult<RkbLogin> => {
    storeData(LOGOUT_TOKEN, login.logout_token);

    if (login.current_user) {
      return api.success([{...login, pass}]);
    }

    return api.failure(api.E_NOT_FOUND, login.message);
  };

const getToken = () => {
  return api.callHttpGet(
    api.httpUrl(api.path.token, ''),
    undefined,
    undefined,
    {isJson: false},
  ) as unknown as Promise<string>;
};

const clearCookies = () => {
  // CookieManager.clearAll(true);
};

const resetPw = ({user, pass}: AccountAuth) => {
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!pass)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: pass');

  return api.callHttp(
    `${api.httpUrl(api.path.resetPw)}?_format=hal_json`,
    {
      method: 'POST',
      body: JSON.stringify({
        name: {value: user},
        pass: {value: pass},
      }),
    },
    toUser,
  );
};

const logOut = async () => {
  const token = (await retrieveData(LOGOUT_TOKEN)) || '';
  if (token) {
    removeData(LOGOUT_TOKEN);
  }

  return api.callHttp(
    `${api.httpUrl(api.path.logout)}?token=${token}`,
    {
      method: 'POST',
    },
    (a) => a,
    {ignoreError: true},
  );
};

const getByName = ({name}: {name?: string}) => {
  if (!name)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: name');

  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.user)}/0?_format=json&name=${name}`,
    toUser,
  );
};

const getByMail = ({mail}: {mail: string}) => {
  if (!mail)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mail');

  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.user)}/0?_format=json&mail=${mail}`,
    toUser,
  );
};

const logInOnce = ({
  token,
  user,
  pass,
}: {
  token: string;
  user: string;
  pass: string;
}) => {
  return api.callHttp(
    `${api.httpUrl(api.path.login)}?_format=json`,
    {
      method: 'POST',
      headers: api.headers('json', {
        'X-CSRF-Token': token,
      }),
      body: JSON.stringify({
        name: user,
        pass,
      }),
    },
    toLogin(pass),
  );
};

const logIn = async ({
  user,
  pass,
  xcsrftoken,
}: {
  user: string;
  pass: string;
  xcsrftoken?: string;
}) => {
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!pass)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: pass');

  await logOut();

  let token = xcsrftoken;
  if (!token) {
    token = await getToken();
    console.log('@@@ try login', token);
  }

  const rsp = await logInOnce({token, user, pass});
  if (rsp.result == 0) return Promise.resolve(rsp);

  // 실패한 경우
  console.log('@@@ logout and try again');
  await logOut();
  return logInOnce({token, user, pass});
};

const update = ({
  uid,
  attributes,
  token,
}: {
  uid?: number;
  token?: string;
  attributes?: object;
}) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!uid) return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uid');
  if (_.isEmpty(attributes))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: attributes');

  return api.callHttp(
    api.httpUrl(api.path.rokApi.rokebi.user, ''),
    {
      method: 'POST',
      body: JSON.stringify({uid, ...attributes}),
      headers: api.withToken(token, 'json'),
    },
    toUser,
  );
};

const changePicture = ({
  uid,
  userPicture,
  token,
}: {
  uid: number;
  userPicture: RkbFile;
  token: string;
}) => {
  if (!uid) return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uid');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!userPicture)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: userPicture');

  return api.callHttp(
    api.httpUrl(api.path.rokApi.rokebi.user, ''),
    {
      method: 'POST',
      body: JSON.stringify({uid, userPicture}),
      headers: api.withToken(token, 'json'),
    },
    toUser,
  );
};

const sendSms = ({
  user,
  abortController,
}: {
  user: string;
  abortController: AbortController;
}) => {
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');

  return api.callHttp(
    `${api.rokHttpUrl(api.path.rokApi.auth.verify)}`,
    {
      method: 'POST',
      headers: api.headers('json'),
      body: JSON.stringify({
        mobile: user,
      }),
    },
    (rsp = {}) => {
      return rsp.result?.code === 0
        ? api.success([])
        : api.failure(api.FAILED, rsp.result?.error);
    },
    {abortController},
  );
};

export type RkbSocialLogin = {
  mobile: string;
  newUser: boolean;
};

const socialLogin = ({
  user,
  pass,
  kind,
  mobile,
  token,
  abortController,
}: SocialAuthInfo & {
  abortController?: AbortController;
}) => {
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!pass)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: pass');
  if (!kind)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: kind');

  return api.callHttp(
    `${api.rokHttpUrl(api.path.rokApi.auth.social)}`,
    {
      method: 'POST',
      headers: api.headers('json'),
      body: JSON.stringify({user, pass, kind, mobile, token}),
    },
    (rsp = {}) => {
      return rsp.result.code === 0
        ? api.success<RkbSocialLogin>([rsp.row as RkbSocialLogin])
        : api.failure<RkbSocialLogin>(api.FAILED, rsp.result?.error);
    },
    {abortController},
  );
};

const receiveGift = ({
  sender, // account userid
  gift, // subs uuid ( dynamic link 생성시에 넣은 uuid )
  iccid, // receiver iccid
  token,
}: {
  sender: string;
  gift: string;
  iccid: string;
  token?: string;
}) => {
  if (!sender || !gift || !iccid || !token) {
    return api.reject(
      api.E_INVALID_ARGUMENT,
      `missing parameter: sender: ${sender} gift:${gift} iccid:${iccid} token:${token}`,
    );
  }

  return api.callHttp(
    `${api.httpUrl(api.path.gift.content)}/0?_format=json`,
    {
      method: 'PATCH',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify({
        sender,
        receiver: iccid,
        gift,
      }),
    },
    (resp) => {
      return resp;
      // result: resp.status == '204' ? 0 : api.FAILED,
    },
  );
};

const confirmSmsCode = ({
  user,
  pass,
  abortController,
}: {
  user: string;
  pass: string;
  abortController: AbortController;
}) => {
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!pass)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: pass');

  return api.callHttp(
    `${api.rokHttpUrl(api.path.rokApi.auth.confirm)}`,
    {
      method: 'POST',
      headers: api.headers('json'),
      body: JSON.stringify({
        mobile: user,
        pin: pass,
      }),
    },
    (rsp = {}) => {
      return rsp.result.code === 0
        ? api.success(rsp.id)
        : api.failure(api.FAILED, rsp.result?.error);
    },
    {abortController},
  );
};

const signUp = ({
  user,
  pass,
  email,
  mktgOptIn = false,
  deviceModel,
  recommender,
}: {
  user?: string;
  pass?: string;
  email?: string;
  mktgOptIn?: boolean;
  deviceModel?: string;
  recommender?: string;
}) => {
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!pass)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: pass');

  return api.callHttp(
    `${api.rokHttpUrl(api.path.rokApi.user.create)}`,
    {
      method: 'POST',
      headers: api.headers('json'),
      body: JSON.stringify({
        mobile: user,
        pin: pass,
        email,
        mktgOptIn,
        deviceModel,
        recommender,
      }),
    },
    (rsp = {}) => {
      return rsp.result?.code === 0
        ? api.success(rsp.id)
        : api.failure(api.FAILED, rsp.result?.error);
    },
  );
};

const confirmEmail = ({
  email,
  abortController,
}: {
  email: string;
  abortController?: AbortController;
}) => {
  if (!email)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: email');

  return api.callHttp(
    `${api.rokHttpUrl(api.path.rokApi.auth.email)}`,
    {
      method: 'POST',
      headers: api.headers('json'),
      body: JSON.stringify({
        email,
      }),
    },
    ({result}) => {
      return result?.code === 0
        ? api.success([])
        : api.failure(result?.code, result?.error, result?.desc);
    },
    {abortController},
  );
};

const resign = async (
  {uid = 0, token}: {uid?: number; token?: string},
  reason?: string,
) => {
  if (uid <= 0 || !token) {
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: nid');
  }
  return api.callHttp(
    `${api.httpUrl(api.path.rokApi.rokebi.reg)}/${uid}`,
    {
      method: 'DELETE',
      headers: api.withToken(token),
      body: JSON.stringify({
        reason,
      }),
    },
    ({result}) => {
      return result?.code === 0
        ? api.success([])
        : api.failure(result?.code, result?.error, result?.desc);
    },
  );
};

export default {
  KEY_ICCID,
  KEY_MOBILE,
  KEY_PIN,
  KEY_TOKEN,
  getToken,
  clearCookies,
  resetPw,
  logOut,
  logIn,
  logInOnce,
  getByName,
  getByMail,
  update,
  receiveGift,
  changePicture,
  sendSms,
  confirmSmsCode,
  signUp,
  confirmEmail,
  socialLogin,
  resign,
};
