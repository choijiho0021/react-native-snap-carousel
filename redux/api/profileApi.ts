import _ from 'underscore';
import api, {ApiResult, DrupalNode, DrupalNodeJsonApi} from './api';

export type RkbProfile = {
  countryCode: string;
  province: string;
  city: string;
  zipCode: string;
  addressLine1: string;
  addressLine2: string;
  detailAddr: string;
  roadAddr: string;
  givenName: string;
  familyName: string;
  alias: string;
  recipient: string;
  prefix: string;
  recipientNumber: string;
  isBasicAddr: boolean;
  uuid: string;
};

const toCustomerProfile = (
  data: DrupalNode[] | DrupalNodeJsonApi,
): ApiResult<RkbProfile> => {
  if (_.isArray(data)) {
    const objects = data.map((item) => {
      const {
        country_code,
        administrative_area,
        locality,
        postal_code,
        address_line1,
        address_line2,
        organization,
        additional_name,
        given_name,
        family_name,
      } = item.address[0] || [];

      return {
        // langcode: 'ko',
        countryCode: country_code,
        province: administrative_area,
        city: locality,
        zipCode: postal_code,
        addressLine1: address_line1,
        addressLine2: address_line2,
        detailAddr: organization,
        roadAddr: additional_name,
        givenName: given_name,
        familyName: family_name,
        alias: item.field_alias && item.field_alias[0].value,
        recipient: item.field_recipient && item.field_recipient[0].value,
        prefix:
          item.field_recipient_number &&
          item.field_recipient_number[0].value.substring(0, 3),
        recipientNumber:
          item.field_recipient_number &&
          item.field_recipient_number[0].value.substring(3),
        isBasicAddr: item.is_default && item.is_default[0].value,
        uuid: item.uuid && item.uuid[0].value,
      };
    });
    return api.success(objects);
  }

  // JSON API로 데이터를 조회한 경우
  if (data.jsonapi && !!data.data) {
    const obj = _.isArray(data.data) ? data.data : [data.data];

    const objects = obj.map((item) => {
      const {
        country_code,
        administrative_area,
        locality,
        postal_code,
        address_line1,
        address_line2,
        organization,
        additional_name,
        given_name,
        family_name,
      } = item.attributes.address;

      return {
        // langcode: 'ko',
        countryCode: country_code,
        province: administrative_area,
        city: locality,
        zipCode: postal_code,
        addressLine1: address_line1,
        addressLine2: address_line2,
        detailAddr: organization,
        roadAddr: additional_name,
        givenName: given_name,
        familyName: family_name,
        alias: item.attributes.field_alias,
        recipient: item.attributes.field_recipient,
        prefix: item.attributes.field_recipient_number.substring(0, 3),
        recipientNumber: item.attributes.field_recipient_number.substring(3),
        isBasicAddr: item.attributes.is_default,
        uuid: item.id,
      };
    });

    return api.success(objects);
  }

  return api.failure(api.E_NOT_FOUND);
};

const getCustomerProfile = ({uid, token}: {uid?: number; token?: string}) => {
  if (!_.isNumber(uid))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uid');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttpGet(
    `${api.httpUrl(api.path.profile)}/user/${uid}?_format=json`,
    toCustomerProfile,
    api.withToken(token, 'json'),
  );
};

const getCustomerProfileById = ({id, token}: {id?: string; token?: string}) => {
  if (!id) return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: id');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttpGet(
    `${api.httpUrl(api.path.profile)}/id/${id}?_format=json`,
    toCustomerProfile,
    api.withToken(token, 'json'),
  );
};

const addOrUpdate = ({
  url,
  profile,
  method,
  token,
}: {
  url: string;
  profile: RkbProfile;
  method: 'POST' | 'PATCH';
  token?: string;
}) => {
  if (!url) return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter:url');
  if (!profile)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter:profile');
  if (!method)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter:method');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter:token');

  const headers = api.withToken(
    token,
    'vnd.api+json',
    method === 'PATCH' ? {Accept: 'application/vnd.api+json'} : undefined,
  );

  const body = {
    data: {
      type: 'profile--customer',
      id: method === 'PATCH' ? profile.uuid : undefined, // 업로드할 경우에만 필요
      attributes: {
        address: {
          langcode: 'ko',
          country_code: 'KR',
          administrative_area: profile.province, // 경기도
          locality: profile.city, // 성남시
          postal_code: profile.zipCode,
          address_line1: profile.addressLine1,
          address_line2: profile.addressLine2,
          organization: profile.detailAddr, // 상세주소
          additional_name: profile.roadAddr, // 도로명주소
          given_name: profile.recipient || profile.givenName,
          family_name: profile.recipient || profile.familyName,
        },
        field_recipient: profile.recipient,
        field_recipient_number: profile.recipientNumber,
        field_alias: profile.alias,
        is_default: profile.isBasicAddr,
      },
    },
  };

  return api.callHttp(
    url,
    {
      method,
      headers,
      body: JSON.stringify(body),
    },
    toCustomerProfile,
  );
};

const addCustomerProfile = ({
  profile,
  token,
}: {
  profile: RkbProfile;
  token?: string;
}) => {
  if (!profile)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter:profile');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter:token');

  const url = api.httpUrl(api.path.jsonapi.profile);

  return addOrUpdate({url, profile, method: 'POST', token});
};

const updateCustomerProfile = ({
  profile,
  token,
}: {
  profile: RkbProfile;
  token?: string;
}) => {
  const url = `${api.httpUrl(api.path.jsonapi.profile)}/${profile.uuid}`;
  return addOrUpdate({url, profile, method: 'PATCH', token});
};

// profile uuid
const delCustomerProfile = ({uuid, token}: {uuid: string; token?: string}) => {
  if (!uuid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uuid');

  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  const url = `${api.httpUrl(api.path.jsonapi.profile)}/${uuid}`;
  const headers = api.withToken(token, 'vnd.api+json');

  return api.callHttp(
    url,
    {
      method: 'DELETE',
      headers,
    },
    (resp) => ({
      result: resp.status === '204' ? 0 : api.FAILED,
      objects: [],
    }),
    {isJson: false},
  );
};

export default {
  getCustomerProfile,
  getCustomerProfileById,
  addCustomerProfile,
  addOrUpdate,
  updateCustomerProfile,
  delCustomerProfile,
};
