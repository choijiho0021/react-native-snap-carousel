import _ from 'underscore';
import {Buffer} from 'buffer';
import i18n from '@/utils/i18n';
import api, {ApiResult, DrupalNode} from './api';
import {RkbImage} from './accountApi';
import {DrupalBoard, RkbBoardBase, RkbIssueBase, toFile} from './boardApi';
import {EventParamImagesType} from '@/components/BoardMsgAdd';

export type EventBoardMsgStatus = 'o' | 'r' | 's' | 'f';

export type EventImagesInfo = {
  target_id: string;
  width: string;
  height: string;
};

export type RkbEventBoard = RkbBoardBase & {
  link: string[];
  imagesInfo: EventImagesInfo[];
  rejectReason: string[];
  otherReason: string;
};

const toEventBoard = (data: DrupalBoard[]): ApiResult<RkbEventBoard> => {
  if (_.isArray(data)) {
    return api.success<RkbEventBoard>(
      data.map((item) => {
        let info: EventImagesInfo[] = [];
        if (
          !!item.field_images_info &&
          item.field_images_info.split(', ').length > 0
        ) {
          info = item.field_images_info.split(', ').map((info) => {
            const obj = {};
            info
              .replace(/[{}]/g, '')
              .split(',')
              .forEach((i) => {
                const [key, value] = i.split(':');
                obj[key] = value;
              });

            // JavaScript 객체를 JSON 형식으로 변환
            return obj;
          });
        }
        return {
          key: item.uuid,
          uuid: item.uuid,
          title: item.title || '',
          msg: item.body || '',
          created: item.created,
          changed: item.changed,
          statusCode: item.field_event_status.toLowerCase() || 'o',
          status: item.field_event_status
            ? i18n.t(`event:${item.field_event_status.toLowerCase()}`)
            : '',
          images: item.field_images ? item.field_images.split(', ') : [],
          link: item.field_text_link ? item.field_text_link.split(', ') : [],
          imagesInfo: info,
          rejectReason: item.field_event_reject_reason
            ? item.field_event_reject_reason.split(', ')
            : [],
          otherReason: item.field_other_reason || '',
        };
      }),
    );
  }

  return api.failure(api.E_NOT_FOUND, data.message);
};

// anonymous user 도 post 할 수 있으므로, token 값을 확인하지 않는다.
export type RkbEventIssue = RkbIssueBase & {
  link: {value: string}[];
  eventUuid: string;
  eventStatus: string;
  paramImages?: EventParamImagesType[];
};

type DrupalImageFile = {
  filename: string;
  uuid: string;
  fid: string;
};

const toParamImg = (data: DrupalImageFile[]): ApiResult<string[]> => {
  if (_.isArray(data)) {
    return api.success<string[]>(data.map((d) => d.uuid));
  }
};

const getImgUuid = ({
  targetIdList,
  token,
}: {
  targetIdList: string[];
  token: string;
}) => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.file)}/${targetIdList.join(', ')}?_format=hal_json`,
    toParamImg,
    api.withToken(token, 'vnd.api+json'),
  );
};

type EventImagesDataType = {
  type: string;
  id?: string;
  meta?: {
    width?: number;
    height?: number;
  };
};
const post = async ({
  title,
  msg,
  images,
  link,
  eventUuid,
  token,
  eventStatus,
  paramImages,
}: RkbEventIssue & {
  token?: string;
}) => {
  if (!title || !msg || !token)
    return api.reject(api.E_INVALID_ARGUMENT, 'empty title, body or token');

  let field_images_data: EventImagesDataType[] = [];

  if (paramImages && paramImages.length > 0) {
    const targetIdList = paramImages.map((p) => p.imagesInfo.target_id);
    const {objects} = await getImgUuid({targetIdList, token});

    field_images_data = field_images_data.concat(
      paramImages.map((item, idx) => ({
        type: 'file--image',
        id: objects[idx].toString(),
        meta: {
          width: Number(item.imagesInfo.width),
          height: Number(item.imagesInfo.height),
        },
      })),
    );
  }

  if (images && images.length > 0) {
    field_images_data = field_images_data.concat(
      images.map((item) => ({
        type: 'file--image',
        id: item.uuid,
        meta: {
          width: item.width,
          height: item.height,
        },
      })),
    );
  }

  console.log('@@@@ field_images_data', field_images_data);

  const url = `${api.httpUrl(api.path.jsonapi.eventBoard)}`;
  const headers = api.withToken(token, 'vnd.api+json');
  const body = {
    data: {
      type: 'node--evnet_board',
      attributes: {
        title: {value: title},
        body: {value: msg},
        field_text_link: link,
        field_event_status: {value: eventStatus},
      },
      relationships:
        field_images_data.length > 0
          ? {
              field_images: {
                data: field_images_data,
              },
              field_ref_event: {
                data: {
                  type: 'node--event',
                  id: eventUuid,
                },
              },
            }
          : {
              field_ref_event: {
                data: {
                  type: 'node--event',
                  id: eventUuid,
                },
              },
            },
    },
  };

  return api.callHttp(
    url,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
    toEventBoard,
  );
};

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
    `${api.httpUrl(api.path.eventBoard)}/${uid}?_format=hal_json&page=${page}`,
    toEventBoard,
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
  )}/node/event_board/field_images?_format=hal_json`;

  const posts = images.map((image) => {
    const headers = api.withToken(token, 'octet-stream', {
      'Content-Disposition': `file;filename="${user}_event.${image.mime.replace(
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
  post,
  getIssueList,
  uploadAttachment,
};
