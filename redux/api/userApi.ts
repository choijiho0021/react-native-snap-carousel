/* eslint-disable eqeqeq */
import _ from 'underscore';
import {retrieveData} from '@/utils/utils';
import {AccountAuth} from '@/redux/modules/account';
import api, {ApiResult} from './api';
import {RkbFile} from './accountApi';
import {SocialAuthInfo} from '@/components/SocialLogin';

const KEY_ICCID = 'account.iccid';

const KEY_MOBILE = 'account.mobile';

const KEY_PIN = 'account.pin';

const KEY_TOKEN = 'account.token';

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
  );
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

const logOut = async (token: string) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

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

const logIn = async ({user, pass}: {user: string; pass: string}) => {
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!pass)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: pass');

  let token = await retrieveData(KEY_TOKEN);
  if (token) {
    /*  bhtak 2021/07/17
    기존 login token을 다시 사용하는 경우, 실제 단말에서는 제대로 동작하지 않는 경우가 많아서 아래 루틴은 사용하지 않도록 처리함
    항상 로그아웃 후 다시 로그인 하도록 처리 
    const res = await getByName({name: user, token});
    if (
      res.result === 0 &&
      res.objects.length > 0 &&
      res.objects[0].drupal_internal__uid
    ) {
      console.log('@@@ reuse token', token);
      // x-csrf-token은 새로운 값으로 갱신한다.
      token = await getToken();

      // 로그인 세션이 남아 있는 경우, 기존 정보를 가지고 로그인 처리
      const uid = res.objects[0]?.drupal_internal__uid;
      const login: ApiResult<RkbLogin> = {
        result: 0,
        objects: [
          {
            csrf_token: token,
            current_user: {
              name: user,
              uid,
            },
            pass,
            logout_token: '',
          },
        ],
      };
      return Promise.resolve(login);
    }
    */
    // 기존 token을 데이터 조회에 실패한 경우에는 로그아웃 후 다시 로그인
    console.log('@@@ logout token', token);
    await logOut(token);
  }

  // 로그인 token이 없는 경우
  /* bhtak 2021/07/21 clearCookie()는 제대로 동작을 안해서, login 실패하면 logout 후에 다시 시도하는 것으로 변경함
  await clearCookies();

  const cookies = await CookieManager.getAll();
  console.log('@@@ cookie', cookies);
  */

  token = await getToken();
  console.log('@@@ try login', token);

  const rsp = await logInOnce({token, user, pass});
  if (rsp.result == 0) return Promise.resolve(rsp);

  // 실패한 경우
  console.log('@@@ logout and try again');
  await logOut(token);
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
