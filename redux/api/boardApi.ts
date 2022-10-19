import _ from 'underscore';
import {Buffer} from 'buffer';
import i18n from '@/utils/i18n';
import api, {ApiResult} from './api';
import {RkbFile, RkbImage} from './accountApi';
import utils from '@/redux/api/utils';

export type BoardMsgStatus = 'Open' | 'Closed' | 'Processing';

const statusToString = (status: BoardMsgStatus) => {
  switch (status) {
    case 'Open':
      return i18n.t('board:open');
    case 'Closed':
      return i18n.t('board:closed');
    case 'Processing':
      return i18n.t('board:processing');
    default:
      return status;
  }
};

type DrupalBoard = {
  uuid: string;
  title: string;
  body: string;
  created: string;
  changed: string;
  [key: string]: string;
};

export type RkbBoard = {
  key: string;
  uuid: string;
  title: string;
  msg: string;
  created: string;
  changed: string;
  mobile: string;
  pin: string;
  statusCode: string;
  status: string;
  images: string[];
  replyImages: string[];
};

const toBoard = (data: DrupalBoard[]): ApiResult<RkbBoard> => {
  if (_.isArray(data)) {
    return api.success<RkbBoard>(
      data.map((item) => ({
        key: item.uuid,
        uuid: item.uuid,
        title: item.title || '',
        msg: item.body || '',
        created: item.created,
        changed: item.changed,
        mobile: item.field_mobile || '',
        pin: item.field_pin || '',
        statusCode: item.field_issue_status || 'O',
        status: statusToString(item.field_issue_status || 'O'), // pin, status, statusCode
        images: item.field_images.split(', ') || [],
        replyImages: item.field_reply_images.split(', ') || [],
      })),
    );
  }

  if (!_.isEmpty(data.jsonapi)) {
    // jsonapi result
    const obj = _.isArray(data.data) ? data.data : [data.data];

    return api.success(
      obj.map((item) => ({
        key: item.id,
        uuid: item.id,
        title: item.attributes.title || '',
        msg: item.attributes.body && item.attributes.body.value,
        created: item.attributes.created,
        mobile: item.attributes.field_mobile || '',
        pin: item.attributes.field_pin,
        statusCode: item.attributes.field_issue_status,
        status: statusToString(item.attributes.field_issue_status),
      })),
      data.links,
    );
  }

  return api.failure(api.E_NOT_FOUND, data.message);
};

const toComment = (data) => {
  if (_.isArray(data)) {
    return api.success(data);
  }
  if (!_.isEmpty(data.jsonapi)) {
    // jsonapi result
    const obj = _.isArray(data.data) ? data.data : [data.data];
    return api.success(
      obj.map((item) => {
        const userName =
          data.included &&
          data.included.find((a) => a.id === item.relationships.uid.data.id);

        return {
          uuid: item.id,
          title: item.attributes.subject || '',
          body:
            utils.htmlToString(item.attributes.comment_body.processed) || '',
          created: item.attributes.created,
          userName: userName && userName.attributes?.name,
        };
      }),
    );
  }

  return api.failure(api.E_NOT_FOUND, data.message);
};

const toFile = (data): ApiResult<RkbFile> => {
  if (!_.isEmpty(data._links)) {
    return api.success([
      {
        fid: data.fid[0].value,
        uuid: data.uuid[0].value,
      },
    ]);
  }
  return api.failure(api.E_NOT_FOUND);
};

// anonymous user 도 post 할 수 있으므로, token 값을 확인하지 않는다.
export type RkbIssue = {
  title: string;
  msg: string;
  mobile: string;
  pin: string;
  images: RkbImage[];
};

const post = ({
  title,
  msg,
  mobile,
  pin,
  images,
  token,
}: RkbIssue & {
  token?: string;
}) => {
  if (!title || !msg || !token)
    return api.reject(api.E_INVALID_ARGUMENT, 'empty title, body or token');

  const url = `${api.httpUrl(api.path.jsonapi.board)}`;
  const headers = api.withToken(token, 'vnd.api+json');
  const body = {
    data: {
      type: 'node--contact_board',
      attributes: {
        title: {value: title},
        body: {value: msg},
        field_mobile: {value: mobile.replace(/-/g, '')},
        field_pin: {value: pin},
      },
      relationships:
        images && images.length > 0
          ? {
              field_images: {
                data: images.map((item) => ({
                  type: 'file--image',
                  id: item.uuid,
                  meta: {
                    width: item.width,
                    height: item.height,
                  },
                })),
              },
            }
          : undefined,
    },
  };

  return api.callHttp(
    url,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
    toBoard,
  );
};

/*
const getByFilter = (filter, {user, pass}) => {
  if (_.isEmpty(user))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');

  if (_.isEmpty(pass))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: pass');

  return api.callHttpGet(
    `${api.httpUrl(api.path.jsonapi.board)}${filter}`,
    toBoard,
    api.basicAuth(user, pass, 'vnd.api+json'),
  );
};
*/

/* JSON API를 사용해서 구현했으나, uid에 의한 filtering이 안되서 제거함 
    getHistory = ({token}, link) => {
        const url = link || `${api.httpUrl(api.path.jsonapi.board)}?` +
            `fields[node--contact_board]=field_user_name,created,field_mobile,title,body,field_issue_status,field_pin&` +
            `sort=-created&page[limit]=${this.PAGE_SIZE}`
        const headers = api.withToken(token, 'vnd.api+json')

        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toBoard)
    }
    */

const getIssueList = ({
  uid = 0,
  token,
  page = 0,
}: {
  uid?: number;
  token?: string;
  page?: number;
}) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter:token');

  return api.callHttpGet(
    `${api.httpUrl(api.path.board)}/${uid}?_format=hal_json&page=${page}`,
    toBoard,
    api.withToken(token, 'vnd.api+json'),
  );
};

const getComments = ({uuid, token}: {uuid: string; token?: string}) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter:token');

  return api.callHttpGet(
    `${api.httpUrl(
      api.path.jsonapi.comment,
    )}?filter[entity_id.id][value]=${uuid}&fields[user--user]=name&include=uid`,
    toComment,
    api.withToken(token, 'vnd.api+json'),
  );
};

const uploadAttachment = ({
  images,
  user,
  token,
}: {
  images: RkbImage[];
  user?: string;
  token?: string;
}) => {
  // images가 없는 경우에는 성공으로 처리
  if (!_.isArray(images) || images.length === 0) return Promise.resolve([]);

  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  const url = `${api.httpUrl(
    api.path.uploadFile,
    '',
  )}/node/contact_board/field_images?_format=hal_json`;

  const posts = images.map((image) => {
    const headers = api.withToken(token, 'octet-stream', {
      'Content-Disposition': `file;filename="${user}_contact.${image.mime.replace(
        'image/',
        '',
      )}"`,
    });

    return api.callHttp(
      url,
      {
        method: 'POST',
        headers,
        body: Buffer.from(image.data, 'base64'),
      },
      toFile,
    );
  });
  return Promise.all(posts);
};

export default {
  statusToString,
  post,
  getIssueList,
  getComments,
  uploadAttachment,
};
