import _ from 'underscore';
import api, {ApiResult, DrupalNode, DrupalNodeJsonApi} from './api';
import {RkbInfo} from './pageApi';
import Config from 'react-native-config';

export type RkbNoti = RkbInfo & {
  bodyTitle?: string;
  notiType?: string;
  isRead?: string;
  format?: string;

  summary?: string;
  mobile?: string;
};

const jsonContentType = {'Content-Type': 'application/json'};

const toNoti = (data: DrupalNode[] | DrupalNodeJsonApi): ApiResult<RkbNoti> => {
  // REST API json/noti/list/{id}로 조회하는 경우
  if (_.isArray(data)) {
    return api.success(
      data.map((item, idx) => ({
        key: `${idx}`,
        title: item.title,
        body: item.body,
        created: item.created,
        notiType: item.noti_type,
        uuid: item.uuid,
        mobile: item.name,
        isRead: item.isRead,
        format: item.field_format === 'T' ? 'text' : 'html',
        summary: item.summary,
      })),
    );
  }

  // JSON API로 데이터를 조회한 경우
  if ((<DrupalNodeJsonApi>data).jsonapi) {
    const obj = _.isArray(data.data) ? data.data : [data.data];
    const objects = obj.map((item) => ({
      title: item.attributes.title,
      body: item.attributes.body,
      created: item.attributes.created,
      notiType: item.attributes.field_noti_type,
      key: item.id,
      uuid: item.id,
      // mobile:item.attributes.name,
      isRead: item.attributes.field_isread,
      format: item.attributes.field_format,
    }));

    return api.success(objects);
  }

  return api.failure(api.E_NOT_FOUND);
};

// ContentType Account
const getNoti = ({mobile}: {mobile?: string}) => {
  if (!mobile)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mobile');

  return api.callHttpGet(
    `${api.httpUrl(api.path.noti)}/${mobile}?_format=json`,
    toNoti,
    jsonContentType,
  );
};

const update = ({
  uuid,
  attributes,
  token,
}: {
  uuid?: string;
  token?: string;
  attributes?: object;
}) => {
  if (!uuid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uuid');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (_.isEmpty(attributes))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: attributes');

  const body = {
    data: {
      type: 'node--notification',
      id: uuid,
      attributes,
    },
  };

  return api.callHttp(
    `${api.httpUrl(api.path.jsonapi.noti)}/${uuid}`,
    {
      method: 'PATCH',
      headers: api.withToken(token, 'vnd.api+json'),
      body: JSON.stringify(body),
    },
    toNoti,
  );
};

const read = ({uuid, token}: {uuid: string; token?: string}) => {
  if (!uuid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uuid');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return update({uuid, attributes: {field_isread: true}, token});
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

  const url =
    Config.NODE_ENV === 'production'
      ? `${api.rokHttpUrl(
          `${api.path.rokApi.noti.user}/${mobile}/account/disconnect`,
        )}`
      : `http://tb-svcapp-noti.rokebi.com/${api.path.rokApi.noti.user}/${mobile}/account/disconnect?service=esim`;
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
  update,
  read,
  sendAlimTalk,
  sendLog,
  sendDisconnect,
};
