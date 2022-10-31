import _ from 'underscore';
import {Buffer} from 'buffer';
import utils from '@/redux/api/utils';
import api, {ApiResult, ApiToken, DrupalNode, DrupalNodeJsonApi} from './api';

export type RkbAccount = {
  nid: number;
  uuid: string;
  status?: string;
  expDate?: string;
  balance: number;
  actDate?: string;
  firstActDate?: string;
  mobile?: string;
  deviceToken?: string;
  fcmToken?: string;
  userAccount?: string;
  iccid?: string;
};

const toAccount = (
  data: DrupalNode[] | DrupalNodeJsonApi,
): ApiResult<RkbAccount> => {
  // REST API json/account/list/{id}로 조회하는 경우
  if (_.isArray(data) && data.length > 0) {
    return api.success(
      data.map((item) => ({
        nid: utils.stringToNumber(item.nid) || 0,
        uuid: item.uuid,
        iccid: item.field_iccid,
        status: item.field_status,
        expDate: item.field_expiration_date,
        balance: utils.stringToNumber(item.field_balance) || 0,
        actDate: item.field_activation_date,
        firstActDate: item.field_first_activation_date,
        mobile: item.field_mobile,
        old_deviceToken: item.field_device_token,
        old_fcmToken: item.field_fcm_token,
        userAccount: item.field_ref_user_account,
        isPushNotiEnabled: item.field_is_notification_enabled === 1,
      })),
    );
  }

  // REST API node/{nid}로 조회하는 경우
  if (!_.isEmpty(data._links) || !_.isEmpty(data.nid)) {
    return api.success([
      {
        nid: utils.stringToNumber(data.nid[0].value) || 0,
        uuid: data.uuid[0].value,
        iccid: data.title && data.title[0].value,
        status: data.field_status && data.field_status[0].value,
        expDate:
          data.field_expiration_date && data.field_expiration_date[0].value,
        balance:
          (data.field_balance &&
            utils.stringToNumber(data.field_balance[0].value)) ||
          0,
        actDate:
          data.field_activation_date && data.field_activation_date[0].value,
        firstActDate:
          data.field_first_activation_date &&
          data.field_first_activation_date[0].value,
        mobile: data.field_mobile && data.field_mobile[0].value,
        old_deviceToken:
          data.field_device_token && data.field_device_token[0].value,
        old_fcmToken: data.field_fcm_token && data.field_fcm_token[0].value,
      },
    ]);
  }

  // JSON API로 데이터를 조회한 경우
  if (!_.isEmpty(data.jsonapi) && !_.isEmpty(data.data)) {
    const obj = _.isArray(data.data) ? data.data : [data.data];
    return api.success(
      obj.map((item) => ({
        nid: utils.stringToNumber(item.attributes.drupal_internal__nid),
        uuid: item.id,
        iccid: item.title,
        status: item.field_status,
        expDate: item.attributes.field_expiration_date,
        balance: utils.stringToNumber(item.attributes.field_balance) || 0,
        actDate: item.attributes.field_activation_date,
        firstActDate: item.attributes.field_first_activation_date,
        mobile: item.attributes.field_mobile,
        old_deviceToken: item.attributes.field_device_token,
        old_fcmToken: item.attributes.field_fcm_token,
        isPushNotiEnabled: item.attributes.field_is_notification_enabled,
        uid: undefined,
      })),
    );
  }

  return api.failure(data.result || api.E_NOT_FOUND, data.desc || '', 200);
};

export type RkbFile = {
  fid: string;
  uuid: string;
  userPictureUrl?: string;
  width?: number;
  height?: number;
};
const toFile = (data): ApiResult<RkbFile> => {
  if (!_.isEmpty(data._links)) {
    return api.success([
      {
        fid: data.fid[0].value,
        uuid: data.uuid[0].value,
        userPictureUrl: data.uri[0].url,
      },
    ]);
  }
  return api.failure(api.E_NOT_FOUND);
};

// ContentType Account
const getAccount = ({iccid, token}: {iccid?: string; token?: string}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.account)}/${iccid}?_format=json`,
    (rsp) =>
      rsp.result === 0
        ? toAccount(rsp.objects)
        : api.failure(rsp.result, rsp.error),
    api.withToken(token, 'json'),
  );
};

const validateActCode = (iccid: string, actCode: string, {token}: ApiToken) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!actCode)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: actCode');

  return api.callHttpGet(
    `${api.httpUrl(api.path.account)}/${iccid}/${actCode}?_format=json`,
    toAccount,
    api.withToken(token, 'json'),
  );
};

const getByUser = ({mobile, token}: {mobile: string; token: string}) => {
  if (!mobile)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mobile');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttpGet(
    `${api.httpUrl(api.path.accountOfUser)}/${mobile}?_format=json`,
    toAccount,
    api.withToken(token, 'json'),
  );
};

const registerMobile = ({
  iccid,
  code,
  mobile,
  token,
}: {
  iccid?: string;
  code?: string;
  mobile?: string;
  token?: string;
}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  if (!code)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: code');
  if (!mobile)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mobile');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttp(
    api.httpUrl(api.path.regMobile),
    {
      method: 'POST',
      headers: api.withToken(token, 'json', {
        Accept: 'application/json',
      }),
      body: JSON.stringify({iccid, code, mobile}),
    },
    toAccount,
  );
};

/*
exif: null
localIdentifier: "CC95F08C-88C3-4012-9D6D-64A413D254B3/L0/001"
filename: "IMG_0006.HEIC"
width: 76
modificationDate: null
mime: "image/jpeg"
path: "/Users/bhtak/Library/Developer/CoreSimulator/Devices/27CA10AA-E5F9-4815-8C3C-CD7AE5ACF2B8/data/Containers/Data/Application/506E8AFC-C85C-42E7-A119-9BBDB3C6B554/tmp/react-native-image-crop-picker/B95406E7-C487-4209-92DD-9770AAD94DB9.jpg"
size: 5184
cropRect: {y: 0, width: 3024, height: 3024, x: 504}
data: "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"
sourceURL: "file:///Users/bhtak/Library/Developer/CoreSimulator/Devices/27CA10AA-E5F9-4815-8C3C-CD7AE5ACF2B8/data/Media/DCIM/100APPLE/IMG_0006.HEIC"
height: 76
creationDate: "1522437259"
*/
export type RkbImage = {
  uuid?: string;
  mime: string;
  data: string;
  width: number;
  height: number;
  size?: number;
};

const uploadPicture = ({
  image,
  user,
  token,
}: {
  image: RkbImage;
  user: string;
  token: string;
}) => {
  if (_.isEmpty(image))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: image');
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  const headers = api.headers('octet-stream', {
    'X-CSRF-Token': token,
    'Content-Disposition': `file;filename="${user}-${new Date().getTime()}.${image.mime.replace(
      'image/',
      '',
    )}"`,
  });

  return api.callHttp(
    `${api.httpUrl(
      api.path.uploadFile,
      '',
    )}/user/user/user_picture?_format=hal_json`,
    {
      method: 'POST',
      headers,
      body: Buffer.from(image.data, 'base64'),
    },
    toFile,
  );
};

export default {
  toAccount,
  toFile,
  getAccount,
  validateActCode,
  getByUser,
  registerMobile,
  uploadPicture,
};
