import _ from 'underscore';
import Env from '@/environment';
import api, {ApiResult} from './api';
import {RkbInfo} from './pageApi';

const {cachePrefix} = Env.get();

const KEY_INIT_LIST = `${cachePrefix}noti.initList`;

export type RkbNoti = RkbInfo & {
  bodyTitle?: string;
  notiType?: string;
  isRead?: string;
  format?: string;

  summary?: string;
  mobile?: string;
};

const jsonContentType = {'Content-Type': 'application/json'};

type RkbNotiJson = {
  title: string;
  body: string;
  created: string;
  ntype: string;
  uuid: string;
  mobile: string;
  isRead: string;
  fmt: string;
};
const toNoti = (resp: ApiResult<RkbNotiJson>): ApiResult<RkbNoti> => {
  if (resp.result === 0) {
    return api.success(
      resp.objects.map((item) => ({
        key: item.uuid,
        title: item.title,
        body: item.body,
        created: item.created,
        notiType: item.ntype,
        uuid: item.uuid,
        mobile: item.mobile,
        isRead: item.isRead || 'F',
        format: item.fmt === 'T' ? 'text' : 'html',
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND);
};

// ContentType Account
const getNoti = ({mobile}: {mobile?: string}) => {
  if (!mobile)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mobile');

  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.noti)}/${mobile}?_format=json`,
    toNoti,
    jsonContentType,
  );
};

const read = ({uuid, token}: {uuid: string; token?: string}) => {
  if (!uuid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uuid');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttp(
    `${api.httpUrl(api.path.rokApi.rokebi.noti)}/${uuid}`,
    {
      method: 'PATCH',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify({isRead: true}),
    },
    toNoti,
  );
};

const sendAlimTalk = ({
  mobile,
  abortController,
}: {
  mobile: string;
  abortController: AbortController;
}) => {
  if (!mobile)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mobile');

  const url = `${api.rokHttpUrl(api.path.rokApi.noti.alimtalk)}`;
  const headers = new Headers(jsonContentType);
  const body = {
    mobile,
    tmplId: 'alimtalk_test',
  };

  return api.callHttp(
    url,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
    (data = {}) => {
      if (_.size(data.result) > 0 && data.result.code === 0) {
        return api.success([]);
      }
      return api.failure(api.FAILED, data.result?.error);
    },
    {abortController},
  );
};

const sendLog = ({mobile, message}: {mobile: string; message: string}) => {
  if (!mobile)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mobile');

  const url = `${api.rokHttpUrl(api.path.rokApi.noti.log)}`;
  const headers = new Headers(jsonContentType);
  const body = {
    mobile,
    message,
  };

  return api.callHttp(
    url,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
    (data = {}) => {
      if (_.size(data.result) > 0 && data.result.code === 0) {
        return api.success([]);
      }
      return api.failure(api.FAILED, data.result?.error);
    },
  );
};

const sendDisconnect = ({mobile, iccid}: {mobile: string; iccid: string}) => {
  if (!mobile)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mobile');

  const url = `${api.rokHttpUrl(
    `${api.path.rokApi.noti.user}/${mobile}/account/disconnect`,
  )}`;

  const headers = new Headers(jsonContentType);
  const body = {
    iccid,
  };

  return api.callHttp(
    url,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
    (data = {}) => {
      if (_.size(data.result) > 0 && data.result.code === 0) {
        return api.success([]);
      }
      return api.failure(api.FAILED, data.result?.error);
    },
  );
};

export default {
  getNoti,
  read,
  sendAlimTalk,
  sendLog,
  sendDisconnect,
  KEY_INIT_LIST,
};
