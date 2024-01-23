/* eslint-disable class-methods-use-this */
/* eslint-disable eqeqeq */
import {Buffer} from 'buffer';
import _ from 'underscore';
import Env from '@/environment';
import userApi from './userApi';
import {API} from '@/redux/api';
import {parseJson, retrieveData, storeData} from '@/utils/utils';
import store from '@/store';
import {actions as ToastActions, Toast} from '@/redux/modules/toast';

export type Langcode = 'ko' | 'en';
const {scheme, apiUrl, esimGlobal, rokApiUrl, cachePrefix} = Env.get();

const FAILED = -1000;
const E_NOT_FOUND = -1001;
const E_ACT_CODE_MISMATCH = -1002;
const E_INVALID_STATUS = -1003;
const E_STATUS_EXPIRED = -1004;
const E_INVALID_ARGUMENT = -1005;
const E_RESOURCE_NOT_FOUND = -1006;
const E_REQUEST_FAILED = -1007;
const E_ABORTED = -1008;
const E_DECODING_FAILED = -1009;
const E_INVALID_PARAMETER = -1016;
const API_STATUS_PREFAILED = 412;
const API_STATUS_INIT = 0;
const API_STATUS_TRYING = 1;
const API_STATUS_DONE = 2;
const API_STATUS_FAIL = 3;

const path = {
  jsonapi: {
    simPartner: 'jsonapi/taxonomy_term/bootstrap_sim_partner',
    user: 'jsonapi/user/user',
    board: 'jsonapi/node/contact_board',
    eventBoard: 'jsonapi/node/event_board',
    comment: 'jsonapi/comment/comment',
    profile: 'jsonapi/profile/customer',
    subscription: 'jsonapi/node/subscription',
    payment: 'jsonapi/node/payment',
    noti: 'jsonapi/node/notification',
    page: 'jsonapi/node/page',
    app: 'jsonapi/node/app_version',
  },
  account: 'json/account/list',
  accountOfUser: 'json/account/ofuser',
  noti: 'json/noti/list',
  prodByCntry: 'json/product/ccode',
  prodList: 'json/product/list',
  prodSku: 'json/product/sku',
  prodUuid: 'json/product/uuid',
  prodByLocalOp: 'json/product/localop2',
  prodCountry: 'json/country',
  localOp: 'json/localop/list',
  token: 'rest/session/token',
  userRegister: 'user/register',
  login: 'user/login',
  logout: 'user/logout',
  user: 'user',
  node: 'node',
  userByName: 'json/user/name',
  userByEmail: 'json/user/email',
  promotion: 'json/promotion/list',
  event: 'json/event/list',
  productDetails: 'json/product/details',
  prodDesc: 'json/product/desc',
  localopBody: 'json/localop',
  esimDev: 'json/esim/dev/list',
  file: 'json/file',

  recharge: 'rokebi/rch',
  resetPw: 'rokebi/user/pw',
  invite: 'rokebi/stat/invite',
  regMobile: 'rokebi/reg',
  promo: 'rokebi/promo',

  simCard: 'json/smc/list',
  cart: 'cart',
  order: 'json/orders',
  uploadFile: 'file/upload',
  board: 'json/contactboard',
  eventBoard: 'json/event/board',
  subscription: 'json/subs/more',
  storeSubs: 'json/store',
  rkbtalk: 'json/rkbtalk',
  profile: 'json/profile',
  extraCoupon: 'json/coupon/extra',

  gift: {
    content: 'rokebi/gift',
    images: 'rokebi/gift/images',
    web: 'gift',
  },

  commerce: {
    payment: 'commerce/payment',
    order: 'commerce/order',
  },

  rokApi: {
    auth: {
      verify: 'api/v1/auth/verify/sms',
      confirm: 'api/v1/auth/verify/sms/confirm',
      email: 'api/v1/auth/verify/email/confirm',
      social: 'api/v1/auth/social',
    },
    user: {
      create: 'api/v1/auth/user',
    },
    noti: {
      alimtalk: 'api/v1/noti/msg/alimtalk',
      log: 'api/v1/noti/log',
      user: 'api/v1/noti/user',
    },
    rokebi: {
      subs: 'rokebi/subs',
      usage: 'rokebi/usage/subs',
      call: 'rokebi/call',
      ota: 'rokebi/svc/ota',
      tag: 'rokebi/tag',
      reg: 'rokebi/reg',
      user: 'rokebi/user',
      account: 'rokebi/account',
      prodByCountry: 'rokebi/prod/bycntry',
      cash: 'rokebi/cash',
      payment: 'rokebi/payment',
      vbank: 'rokebi/payment/vbank',
      paymentRule: 'rokebi/payment/rule',
      calculateTotal: 'rokebi/order/calc',
      prodAddOn: 'rokebi/prod/addon',
      config: 'rokebi/config',
    },
    pv: {
      cmiUsage: 'api/v1/pvd/pv/cmi/v2/usage/quota',
      cmiStatus: 'api/v1/pvd/pv/cmi/v2/bundle/status',
      quadcell: 'api/v1/pvd/pv/quadcell',
      quadcell2: 'api/v1/pvd/pv/quadcell2',
      bc: 'api/v1/pvd/pv/bc',
      hkRegStatus: 'api/v1/pvd/pv/cmi/v2/status',
    },
  },
};

const httpUrl = (path0: string, lang: string = '') => {
  return lang == ''
    ? `${scheme}://${apiUrl}/${path0}`
    : `${scheme}://${apiUrl}/${lang}/${path0}`;
};

const httpImageUrl = (path0?: string) => {
  if (path0) {
    return `${scheme}://${apiUrl}/${path0}`;
  }
  return '';
};

const addrApiUrl = () => {
  return `${scheme}://www.juso.go.kr/addrlink/addrLinkApi.do`;
};

const rokHttpUrl = (path0: string, port?: number) => {
  return `${scheme}://${rokApiUrl}${port ? `:${port}` : ''}/${path0}?service=${
    esimGlobal ? 'global' : 'esim'
  }`;
};

const queryString = (obj?: Record<string, string | number>) => {
  if (!obj) return '';

  return Object.keys(obj)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&');
};

export type DrupalNode = {
  key: string;
  uuid: string;
  title: string;
  created: string;
  body?: string;
  [key: string]: string | undefined;
};
type DrupalAttribute = {
  field_is_notification_enabled?: boolean;
  uri?: {url: string; value: string};
} & {
  [key: string]: string;
};

export type DrupalNodeJsonApi = {
  jsonapi: {
    version: string;
  };
  data: {
    type: string;
    id: string;
    attributes: DrupalAttribute;
  }[];
  included?: {attributes: DrupalAttribute}[];
  uid: {value: string}[];
  uuid: {value: string}[];
  message?: string;
};

export type ApiResult<T> = {
  length: number;
  forEach(arg0: (item: any) => void): unknown;
  result: number;
  objects: T[];
  status?: number;
  message?: string;
  links?: string[];
};
const success = <T>(objects: T[], links: string[] = [], code = 0) =>
  ({
    result: code,
    objects,
    links,
  } as ApiResult<T>);

const failure = <T>(code: number, message?: string, status?: number) =>
  ({
    result: code,
    status,
    message,
  } as ApiResult<T>);

const headers = (contentType: string, header?: Record<string, string>) => {
  return new Headers({
    'Content-Type': `application/${contentType}`,
    ...header,
  });
};

const reject = (code: number, message?: string, status?: number) =>
  Promise.reject(failure(code, message, status));

export type ApiToken = {token: string; cookie?: string};

const withToken = (
  token: string,
  contentType = 'hal+json',
  header?: Record<string, string>,
) => {
  return new Headers({
    'X-CSRF-Token': token,
    'Content-Type': `application/${contentType}`,
    ...header,
  });
};

const basicAuth = (
  user: string,
  pass: string,
  contentType = 'hal+json',
  header?: Record<string, string>,
) => {
  const hdr = new Headers({
    'Content-Type': `application/${contentType}`,
    ...header,
  });

  if (user && pass) {
    hdr.append(
      'Authorization',
      `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`,
    );
  }
  return hdr;
};

type CallHttpCallback<T> = (js: any, cookie?: string | null) => ApiResult<T>;
type CallHttpOption = {
  isJson?: boolean;
  abortController?: AbortController;
  ignoreError?: boolean;
  timeout?: number;
};

export const cachedApi =
  <A, T>(key: string, apiToCall: (p: A) => Promise<T>) =>
  async (param: A, {fulfillWithValue}) => {
    const rsp = await apiToCall(param);
    if (rsp.result === 0) {
      storeData(cachePrefix + key, JSON.stringify(rsp));
    } else if (rsp.result === E_REQUEST_FAILED) {
      const cache = await retrieveData(cachePrefix + key);
      if (cache) return fulfillWithValue(parseJson(cache));
    }
    return fulfillWithValue(rsp);
  };

export const reloadOrCallApi =
  <A, T>(key: string, param: A, apiToCall: (p: A) => Promise<T>) =>
  async (reload: boolean, {fulfillWithValue}) => {
    if (!reload) {
      const cache = await retrieveData(cachePrefix + key);
      if (cache) return fulfillWithValue(parseJson(cache));
    }
    return cachedApi(key, apiToCall)(param, {fulfillWithValue});
  };

const callHttp = async <T>(
  url: string,
  param: object,
  callback: CallHttpCallback<T> = (a) => a,
  option: CallHttpOption = {isJson: true, ignoreError: false, timeout: 40000},
  retry: number = 0,
): Promise<ApiResult<T>> => {
  const config: RequestInit = {
    ...param,
    credentials: 'same-origin',
    // mode: 'no-cors',
  };
  const {timeout = 40000, ignoreError = false, isJson = true} = option;

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response: Response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(id);
    if (option.abortController && option.abortController.signal.aborted) {
      console.log('@@@ aborted');
      return failure(E_ABORTED, 'cancelled', 499);
    }

    // 403, 401에러의 경우 기존의 로그인 정보를 이용하여 재로그인 시도 후 재시도
    if (
      (response.status === 403 || response.status === 401) &&
      retry === 0 &&
      !url.includes('user/login') &&
      !url.includes('user/logout')
    ) {
      const user = await retrieveData(API.User.KEY_MOBILE, true);
      const pass = await retrieveData(API.User.KEY_PIN, true);
      const isLoggedIn = await userApi.logIn({user, pass});
      if (isLoggedIn.result === 0) {
        // get new x-csrf-token
        const {headers} = param;
        if (headers?.has('X-CSRF-Token')) {
          const xcsrftoken = await API.User.getToken();
          headers.set('X-CSRF-Token', xcsrftoken);
        }
        return await callHttp(
          url,
          {...param, headers},
          callback,
          option,
          retry + 1,
        );
      }
    }

    if (response.ok) {
      if (_.isFunction(callback)) {
        if (isJson) {
          if (response.status === 204) {
            // 204 -> no content
            return callback(response);
          }

          try {
            const js = await response.json();
            console.log('API response', url, response.status, js);
            return callback(js, response.headers.get('set-cookie'));
          } catch (ex) {
            return failure(
              E_DECODING_FAILED,
              `Failed to decode json:${ex.message}`,
              response.status,
            );
          }
        }
      }

      return await response.text();
    }

    if (isJson) {
      response
        .json()
        .then((json) => {
          console.log('failed. error:', url, JSON.stringify(json));
          return callback(json);
        })
        .catch((err) => {
          return failure(
            E_DECODING_FAILED,
            `Failed to decode json:${err.message}`,
            response.status,
          );
        });
    }

    return failure(FAILED, response.statusText, response.status);
  } catch (err) {
    console.log('@@@ request failed', err, url);
    if (!ignoreError) store.dispatch(ToastActions.push(Toast.NOT_LOADED));
    return failure(E_REQUEST_FAILED, 'API failed', 498);
  }
};

const callHttpGet = <T>(
  url: string,
  callback?: CallHttpCallback<T>,
  httpHeaders?: Record<string, string> | Headers,
  option: CallHttpOption = {isJson: true},
) => {
  return callHttp<T>(
    url,
    {method: 'GET', headers: httpHeaders},
    callback,
    option,
  );
};

const callHttpPost = <T>(
  url: string,
  body: string,
  httpHeaders?: Record<string, string> | Headers,
  callback?: CallHttpCallback<T>,
  option: CallHttpOption = {isJson: true},
) => {
  return callHttp<T>(
    url,
    {method: 'POST', headers: httpHeaders, body},
    callback,
    option,
  );
};

const missingParameters = (obj: object) => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => (_.isEmpty(value) ? acc.concat([key]) : acc),
    [] as string[],
  );
};

const toLangcode = (lang?: string): Langcode => {
  if (lang?.toLowerCase()?.includes('en')) return 'en';
  return 'ko';
};

export default {
  FAILED,
  E_NOT_FOUND,
  E_ACT_CODE_MISMATCH,
  E_INVALID_STATUS,
  E_STATUS_EXPIRED,
  E_INVALID_ARGUMENT,
  E_RESOURCE_NOT_FOUND,
  E_INVALID_PARAMETER,
  E_REQUEST_FAILED,
  E_ABORTED,
  E_DECODING_FAILED,
  API_STATUS_PREFAILED,
  API_STATUS_INIT,
  API_STATUS_TRYING,
  API_STATUS_DONE,
  API_STATUS_FAIL,

  path,

  httpUrl,
  httpImageUrl,
  addrApiUrl,
  rokHttpUrl,
  queryString,
  success,
  failure,
  headers,
  reject,
  withToken,
  basicAuth,
  callHttpGet,
  callHttpPost,
  callHttp,
  missingParameters,
  toLangcode,
  reloadOrCallApi,
};
