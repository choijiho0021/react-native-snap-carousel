/* eslint-disable class-methods-use-this */
/* eslint-disable eqeqeq */
import {Buffer} from 'buffer';
import _ from 'underscore';
import i18n from '@/utils/i18n';
import Env from '@/environment';

export type Langcode = 'ko' | 'en';
const {scheme, apiUrl, appId, esimGlobal, rokApiUrl} = Env.get();

const FAILED = -1000;
const E_NOT_FOUND = -1001;
const E_ACT_CODE_MISMATCH = -1002;
const E_INVALID_STATUS = -1003;
const E_STATUS_EXPIRED = -1004;
const E_INVALID_ARGUMENT = -1005;
const E_RESOURCE_NOT_FOUND = -1006;
const API_STATUS_PREFAILED = 412;
const API_STATUS_INIT = 0;
const API_STATUS_TRYING = 1;
const API_STATUS_DONE = 2;
const API_STATUS_FAIL = 3;

const path = {
  jsonapi: {
    product: 'jsonapi/node/product',
    account: 'jsonapi/node/account',
    recharge: 'jsonapi/node/recharge',
    simPartner: 'jsonapi/taxonomy_term/bootstrap_sim_partner',
    user: 'jsonapi/user/user',
    board: 'jsonapi/node/contact_board',
    comment: 'jsonapi/comment/comment',
    profile: 'jsonapi/profile/customer',
    addr: 'jsonapi',
    subscription: 'jsonapi/node/subscription',
    payment: 'jsonapi/node/payment',
    noti: 'jsonapi/node/notification',
    page: 'jsonapi/node/page',
  },
  account: 'json/account/list',
  accountOfUser: 'json/account/ofuser',
  noti: 'json/noti/list',
  prodByCntry: 'json/product/ccode',
  prodList: 'json/product/list',
  prodSku: 'json/product/sku',
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
  productDetails: 'json/product/details',
  localopBody: 'json/localop',
  esimDev: 'json/esim/dev/list',

  recharge: 'rokebi/rch',
  resetPw: 'rokebi/user/pw',
  invite: 'rokebi/stat/invite',
  regMobile: 'rokebi/reg',
  promo: 'rokebi/promo',

  simCard: 'json/smc/list',
  cart: 'cart',
  gift: 'gift',
  giftImages: 'rokebi/gift/images',
  order: 'json/orders',
  uploadFile: 'file/upload',
  board: 'json/contactboard',
  subscription: 'json/subs',
  rkbtalk: 'json/rkbtalk',
  profile: 'json/profile',

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
    },
    pv: {
      cmiUsage: 'api/v1/pvd/pv/cmi/v2/usage',
    },
  },
};

const httpUrl = (path0: string, lang: string = i18n.locale) => {
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
  return `${scheme}://${rokApiUrl}:${port || 80}/${path0}?service=${
    esimGlobal ? 'global' : appId
  }`;
};

const queryString = (obj: Record<string, string | number>) => {
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
type CallHttpOption = {isJson?: boolean; abortController?: AbortController};

const callHttp = async <T>(
  url: string,
  param: object,
  callback?: CallHttpCallback<T>,
  option: CallHttpOption = {isJson: true},
): Promise<ApiResult<T>> => {
  const config: RequestInit = {
    ...param,
    credentials: 'same-origin',
    // mode: 'no-cors',
  };

  if (option.abortController) {
    config.signal = option.abortController.signal;
  }
  if (typeof option.isJson === 'undefined') {
    option.isJson = true;
  }

  console.log('call API', url, config);

  try {
    const response: Response = await fetch(url, config);
    if (option.abortController && option.abortController.signal.aborted) {
      return failure(FAILED, 'cancelled', 499);
    }

    if (response.ok) {
      if (_.isFunction(callback)) {
        if (option.isJson) {
          if (response.status === 204) {
            // 204 -> no content
            return callback(response);
          }

          try {
            const js = await response.json();
            console.log('API response', response.status, js);
            return callback(js, response.headers.get('set-cookie'));
          } catch (ex) {
            return failure(
              FAILED,
              `Failed to decode json:${ex.message}`,
              response.status,
            );
          }
        }
      }

      return await response.text();
    }
    if (option.isJson) {
      response
        .json()
        .then((json) => {
          console.log('response:', JSON.stringify(json));
        })
        .catch((err) => {
          return failure(
            FAILED,
            `Failed to decode json:${err.message}`,
            response.status,
          );
        });
    }
    return failure(FAILED, response.statusText, response.status);
  } catch (err) {
    console.log('API failed', err, url);
    return failure(FAILED, 'API failed', 498);
  }
};

const callHttpGet = <T>(
  url: string,
  callback?: CallHttpCallback<T>,
  headers?: Record<string, string> | Headers,
  option: CallHttpOption = {isJson: true},
) => {
  return callHttp<T>(url, {method: 'GET', headers}, callback, option);
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
  callHttp,
  missingParameters,
  toLangcode,
};
