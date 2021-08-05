/* eslint-disable eqeqeq */
import _ from 'underscore';
import CookieManager from '@react-native-cookies/cookies';
import {retrieveData, utils} from '@/utils/utils';
import {AccountAuth} from '@/redux/modules/account';
import api, {ApiResult, DrupalNode, DrupalNodeJsonApi} from './api';
import {RkbFile, RkbImage} from './accountApi';

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

const toUser = (data: DrupalNode[] | DrupalNodeJsonApi): ApiResult<RkbUser> => {
  if (_.isArray(data)) {
    return api.success(data);
  }

  if (!_.isEmpty(data.uid)) {
    return api.success([
      {
        uid: utils.stringToNumber(data.uid[0].value),
        uuid: data.uuid[0].value,
      },
    ]);
  }

  if (!_.isEmpty(data.jsonapi)) {
    // jsonapi result
    const obj = _.isArray(data.data) ? data.data : [data.data];
    const userPictureUrl =
      _.isArray(data.included) && data.included.length > 0
        ? data.included[0].attributes?.uri?.url
        : '';

    return api.success(
      obj.map((item) => ({
        ...item.attributes,
        id: item.id,
        isPushNotiEnabled: item.attributes?.field_is_notification_enabled,
        userPictureUrl,
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND, data.message);
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

// not used
const findUser = ({
  name,
  email,
  user,
  pass,
}: {
  name: string;
  email: string;
  user: string;
  pass: string;
}) => {
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');

  // const url = `${API.httpUrl(API.path.userList)}/${user}?_format=json`
  const url =
    `${api.httpUrl(api.path.jsonapi.user)}?` +
    'filter[agroup][group][conjunction]=OR&' +
    'filter[name][condition][path]=name&' +
    `filter[name][condition][value]=${name}&` +
    'filter[name][condition][memberOf]=agroup&' +
    'filter[email][condition][path]=mail&' +
    `filter[email][condition][value]=${email}&` +
    'filter[email][condition][memberOf]=agroup';

  return api.callHttpGet(url, toUser, api.basicAuth(user, pass));
};

const getToken = () => {
  return api.callHttpGet(api.httpUrl(api.path.token, ''));
};

const clearCookies = () => {
  CookieManager.clearAll(true);
  /*
    return CookieManager.getAll().then((cookies) => {
      console.log('CookieManager.getAll =>', cookies);
      Object.keys(cookies).forEach((c) =>
        CookieManager.clearByName('https://esim.rokebi.com', c).then(
          (success) => {
            console.log('CookieManager.clearAll =>', c, success);
          },
        ),
      );
    });
    */
};

// API for User
// not used
/*
    signUp = ({user, pass}) => {

        console.log('signUp', user, pass)

        if ( _.isEmpty(user) || _.isEmpty(pass)) 
            return api.reject( api.E_INVALID_ARGUMENT, `user or pass`)

        return this.getToken().then( token => {
            console.log('token', token)
            const url = `${api.httpUrl(api.path.userRegister)}?_format=hal_json`
            const headers = api.headers({
                "X-CSRF-Token": token,
            })
            const body = {
                _links: {
                    type : {
                        href : api.httpUrl('rest/type/user/user')
                    }
                },
                name:{value: user},
                pass:{value: pass},
                mail:{value: `${user}@rokebi.com`},
            }

            return api.callHttp(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            }, this.toUser)
        })
    }
    */

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

  return api.callHttp(`${api.httpUrl(api.path.logout)}?token=${token}`, {
    method: 'POST',
  });
};

const getByFilter = ({filter, token}: {filter: string; token?: string}) => {
  if (!token) {
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  }

  return api.callHttpGet(
    `${api.httpUrl(
      api.path.jsonapi.user,
      '',
    )}${filter}&include=user_picture&fields[user--user]=drupal_internal__uid,name,mail,field_fcm_token,field_device_token,field_is_notification_enabled&fields[file--file]=uri`,
    toUser,
    api.withToken(token, 'vnd.api+json'),
  );
};

const getByUUID = ({uuid, token}: {uuid: string; token?: string}) => {
  if (!uuid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uuid');

  return getByFilter({filter: `/${uuid}`, token});
};

const getByUid = ({uid, token}: {uid: string; token?: string}) => {
  if (!_.isNumber(uid) && _.isEmpty(uid)) {
    return api.reject(api.E_INVALID_ARGUMENT, 'invalid parameter: uid');
  }

  return getByFilter({filter: `?filter[uid][value]=${uid}`, token});
};

const getByName = ({name, token}: {name?: string; token?: string}) => {
  if (!name)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: name');

  return getByFilter({filter: `?filter[name][value]=${name}`, token});
};

const getByMail = ({mail, token}: {mail: string; token?: string}) => {
  if (!mail)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mail');

  return getByFilter({filter: `?filter[mail][value]=${mail}`, token});
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

  const login = () =>
    api.callHttp(
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

  const rsp = await login();
  if (rsp.result == 0) return Promise.resolve(rsp);

  // 실패한 경우
  console.log('@@@ logout and try again');
  await logOut(token);
  return login();
};

const update = ({
  userId,
  attributes,
  token,
}: {
  userId?: string;
  token?: string;
  attributes?: object;
}) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!userId)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: userId');
  if (_.isEmpty(attributes))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: attributes');

  return api.callHttp(
    `${api.httpUrl(api.path.jsonapi.user, '')}/${userId}`,
    {
      method: 'PATCH',
      headers: api.withToken(token, 'vnd.api+json'),
      body: JSON.stringify({
        data: {
          type: 'user--user',
          id: userId,
          attributes,
        },
      }),
    },
    toUser,
  );
};

const deleteUser = ({uid, token, user, pass}: AccountAuth & {uid: number}) => {
  const missing = api.missingParameters({uid, token, user, pass});
  if (missing.length > 0) {
    return api.reject(
      api.E_INVALID_ARGUMENT,
      `missing parameter: ${missing.join(',')}`,
    );
  }

  return api.callHttp(
    `${api.httpUrl(api.path.user)}/${uid}?_format=hal_json`,
    {
      method: 'DELETE',
      headers: api.basicAuth(user, pass, 'hal+json', {
        'X-CSRF-Token': token,
      }),
    },
    (resp) => ({
      result: resp.status == '204' ? 0 : api.FAILED,
    }),
    {isJson: false},
  );
};

const changePicture = ({
  userId,
  userPicture,
  image,
  token,
}: {
  userId: string;
  userPicture: RkbFile;
  image: RkbImage;
  token: string;
}) => {
  if (!userId)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: userId');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!userPicture)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: userPicture');

  const body = {
    data: {
      type: 'user--user',
      id: userId,
      relationships: {
        user_picture: {
          data: {
            type: 'file--image',
            id: userPicture.uuid,
            meta: {
              width: image.width,
              height: image.height,
            },
          },
        },
      },
    },
  };

  return api.callHttp(
    `${api.httpUrl(api.path.jsonapi.user, '')}/${userId}`,
    {
      method: 'PATCH',
      headers: api.withToken(token, 'vnd.api+json'),
      body: JSON.stringify(body),
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
  abortController,
}: {
  user: string;
  pass: string;
  kind: 'ios' | 'fb' | 'naver' | 'kakao' | 'google';
  mobile?: string;
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
      body: JSON.stringify({user, pass, kind, mobile}),
    },
    (rsp = {}) => {
      return rsp.result.code === 0
        ? api.success<RkbSocialLogin>([rsp.row as RkbSocialLogin])
        : api.failure<RkbSocialLogin>(api.FAILED, rsp.result?.error);
    },
    {abortController},
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
}: {
  user?: string;
  pass?: string;
  email?: string;
  mktgOptIn?: boolean;
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
    (rsp = {}) => {
      return rsp.result?.code === 0
        ? api.success([])
        : api.failure(rsp.result?.code, rsp.result?.desc, rsp.result?.error);
    },
    {abortController},
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
  getByFilter,
  getByUUID,
  getByUid,
  getByName,
  getByMail,
  update,
  deleteUser,
  changePicture,
  sendSms,
  confirmSmsCode,
  signUp,
  confirmEmail,
  socialLogin,
};
