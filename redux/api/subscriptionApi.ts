import _, {isArray} from 'underscore';
import i18n from '@/utils/i18n';
import api, {ApiResult, DrupalNode, DrupalNodeJsonApi} from './api';

const STATUS_ACTIVE = 'A'; // 사용중
const STATUS_INACTIVE = 'I'; // 미사용
export const STATUS_RESERVED = 'R'; // 사용 대기중
const STATUS_CANCELED = 'C'; // 취소
const STATUS_EXPIRED = 'E'; // 사용 기간 종료
const STATUS_USED = 'U'; // 사용 완료

const GIFT_STATUS_SEND = 'S'; // 선물 완료
const GIFT_STATUS_RECEIVE = 'R'; // 선물 받기 완료

const PAGE_SIZE = 10;
const CALL_PRODUCT = 'rokebi_call_product';

export const code = {
  A: 'active',
  I: 'inactive',
  C: 'canceled',
  R: 'reserved',
  E: 'expired',
  U: 'used',
};

export const giftCode = {
  Send: 'S',
  Receive: 'R',
};

const priority = {
  A: 6,
  R: 5,
  I: 4,
  U: 3,
  E: 2,
};

export const cmiStatusCd = {
  1: 'R',
  2: 'E', // 사용여부와 관련 없이, 상품의 유효기간 만료
  3: 'A', // 사용완료된 상태여도 Active 리턴
  99: 'C',
};

const sortSubs = (a, b) => {
  // status 우선순위, 구입날짜별로 정렬
  if (a.statusCd === b.statusCd && a.purchaseDate > b.purchaseDate) {
    return -1;
  }

  if ((priority[a.statusCd] || 1) > (priority[b.statusCd] || 1)) {
    return -1;
  }

  return 1;
};

const toStatus = (v?: string) => {
  return code[v] ? i18n.t(`his:${code[v]}`) : v;
};

const compare = (a, b) => {
  return a.purchaseDate.localeCompare(b.purchaseDate);
};

export type RkbSubscription = {
  key: string;
  uuid: string;
  purchaseDate: string;
  expireDate: string;
  activationDate: string;
  statusCd: string;
  status: string;
  giftStatusCd: string;
  type: string;

  endDate?: string;
  country?: string;
  prodName?: string;
  prodId?: string;
  nid?: string;
  actCode?: string;
  smdpAddr?: string;
  qrCode?: string;
  imsi?: string;
  subsIccid?: string;
  packageId?: string;
};

const toSubscription = (
  data: DrupalNode[] | DrupalNodeJsonApi,
): ApiResult<RkbSubscription> => {
  if (_.isArray(data)) {
    return api.success(
      data
        .map((item) => ({
          key: item.uuid || '',
          uuid: item.uuid || '',
          purchaseDate: item.field_purchase_date || '',
          expireDate: item.field_expiration_date || '',
          activationDate: item.field_subs_activation_date || '',
          endDate: item.field_subs_expiration_date || '',
          statusCd: item.field_status || '',
          status: toStatus(item.field_status) || '',
          giftStatusCd:
            giftCode[item.field_gift_status] || item.field_gift_status || '',
          country: item.field_country || '',
          prodName: item.title || '',
          prodId: item.product_uuid || '',
          nid: item.nid || '',
          actCode: item.field_activation_code || '',
          smdpAddr: item.sm_dp_address || '',
          qrCode: item.qr_code || '',
          imsi: item.field_imsi || '',
          type: item.type || '',
          subsIccid: item.field_iccid || '',
          packageId: item.field_cmi_package_id || '',
        }))
        .sort(sortSubs),
    );
  }

  if (data.jsonapi) {
    const obj = _.isArray(data.data) ? data.data : [data.data];

    return api.success(
      obj
        .map((item) => {
          return {
            key: item.id,
            uuid: item.id,
            purchaseDate: item.field_purchase_date,
            activationDate: item.field_subs_activation_date,
            expireDate: item.field_subs_expiration_date,
            statusCd: item.field_status,
            giftStatusCd:
              giftCode[item.attributes?.field_gift_status] ||
              item.attributes?.field_gift_status ||
              '',
            status: item.field_status,
            type: item.type,
          };
        })
        .sort(sortSubs),
      data.links,
    );
  }

  return api.failure(data.result || api.E_NOT_FOUND, data.desc || '');
};

const toSubsUpdate = (data) => {
  if (data.result === 0 && isArray(data.objects)) {
    return api.success(
      data.objects.map((item) => ({
        key: item.uuid[0].value,
        uuid: item.uuid[0].value,
        statusCd: item.field_status[0].value,
        status: toStatus(item.field_status[0].value),
        giftStatusCd:
          giftCode[item.field_gift_status] || item.field_gift_status || '',
        prodName: item.title[0].value,
      })),
    );
  }
  return data;
};

const toCmiStatus = (data) => {
  if (data?.result?.code === 0) {
    return api.success({
      userDataBundles: data?.objects?.userDataBundles,
    });
  }
  return data;
};

export type RkbSubsUsage = {
  quota: number;
  used: number;
};
const toSubsUsage = (data: {
  objects: {usage: RkbSubsUsage};
}): ApiResult<RkbSubsUsage> => {
  if (data.objects && data.objects.usage) {
    return api.success([data.objects.usage]);
  }

  return api.failure(api.E_NOT_FOUND);
};

const getSubscription = ({
  iccid,
  token,
  prodType,
}: {
  iccid?: string;
  token?: string;
  prodType?: string;
}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttpGet(
    `${api.httpUrl(api.path.subscription)}/${iccid}${
      prodType ? `/${prodType}` : ''
    }?_format=hal_json`,
    toSubscription,
    api.withToken(token, 'hal+json'),
  );
};

const getRkbTalkSubscription = ({
  iccid,
  token,
}: {
  iccid: string;
  token: string;
}) => {
  return getSubscription({iccid, token, prodType: 'rokebi_call_product'});
};

const addSubscription = ({
  subs,
  user,
  pass,
}: {
  subs: RkbSubscription;
  user?: string;
  pass?: string;
}) => {
  if (!subs)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: subs');
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!pass)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: pass');

  const url = `${api.httpUrl(api.path.jsonapi.subscription)}`;
  const headers = api.basicAuth(user, pass, 'vnd.api+json', {
    Accept: 'application/vnd.api+json',
  });
  const body = {
    data: {
      type: 'node--subscription',
      attributes: {
        title: subs.title || user,
        field_activation_date: subs.startDate,
      },
      relationships: {
        field_ref_product: {
          data: {
            type: 'node--roaming_product',
            id: subs.uuid,
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
    toSubscription,
  );
};

const otaSubscription = ({
  iccid,
  mccmnc,
  user,
  pass,
  method = 'POST',
}: {
  iccid: string;
  mccmnc: string;
  user: string;
  pass: string;
  method?: string;
}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  if (!mccmnc)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mccmnc');
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!pass)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: pass');

  return api.callHttp(
    `${api.httpUrl(
      api.path.rokApi.rokebi.ota,
      '',
    )}/${iccid}/${mccmnc}?_format=json`,
    {
      method,
      headers: api.basicAuth(user, pass, 'json'),
    },
    toSubscription,
  );
};

const getOtaSubscription = ({
  iccid,
  mccmnc,
  user,
  pass,
}: {
  iccid: string;
  mccmnc: string;
  user: string;
  pass: string;
}) => {
  return otaSubscription({iccid, mccmnc, user, pass, method: 'GET'});
};

const updateSubscriptionStatus = ({
  uuid, // subs uuid
  status, // target status
  token,
}: {
  uuid: string;
  status: string;
  token: string;
}) => {
  if (!uuid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uuid');
  if (!status)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: status');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttp(
    `${api.httpUrl(api.path.rokApi.rokebi.subs, '')}/${uuid}?_format=json`,
    {
      method: 'PATCH',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify({status}),
    },
    toSubsUpdate,
  );
};

const updateSubscriptionGiftStatus = ({
  uuid,
  giftStatus,
  token,
}: {
  uuid: string;
  giftStatus: string;
  token: string;
}) => {
  if (!uuid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uuid');
  if (!giftStatus)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: giftStatus');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  const body = {
    data: {
      type: 'node--subscription',
      id: uuid,
      attributes: {
        field_gift_status: giftStatus,
      },
    },
  };

  return api.callHttp(
    `${api.httpUrl(api.path.jsonapi.subscription)}/${uuid}`,
    {
      method: 'PATCH',
      headers: api.withToken(token, 'vnd.api+json', {
        Accept: 'application/vnd.api+json',
      }),
      body: JSON.stringify(body),
    },
    toSubscription,
  );
};

//그래프를 그리기 위해서 가져올 데이터
// rokebi drupal 서버에서 수집한 CDR을 기반으로 처리하는 경우
const getSubsUsage = ({id, token}: {id?: string; token?: string}) => {
  if (!id) return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: id');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.usage)}/${id}?_format=json`,
    toSubsUsage,
    api.withToken(token),
  );
};

// get usage data from svc server
// CMI API를 사용하는 경우
const cmiGetSubsUsage = ({
  iccid,
  packageId,
}: {
  iccid: string;
  packageId: string;
}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  if (!packageId)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: packageId');

  return api.callHttpGet(
    `${api.rokHttpUrl(
      api.path.rokApi.pv.cmiUsage,
      5000,
    )}&iccid=${iccid}&packageId=${packageId}&quota`,
    (data) => {
      if (data?.result?.code === 0) {
        return api.success(data?.objects);
      }
      return data;
    },
    new Headers({'Content-Type': 'application/json'}),
  );
};

const cmiGetSubsStatus = ({iccid}: {iccid: string}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');

  return api.callHttpGet(
    `${api.rokHttpUrl(api.path.rokApi.pv.cmiStatus, 5000)}&iccid=${iccid}`,
    toCmiStatus,
    new Headers({'Content-Type': 'application/json'}),
  );
};

// rokebi call products
/* not used
const toRokebiProd = (data) => {
  if (_.isArray(data)) {
    return api.success(
      data.map((item) => ({
        subsId: item.subs_id,
        key: item.id,
        purchaseDate: utils.toDate(item.field_purchase_date),
        expireDate: utils.toDate(item.field_expiration_date),
        activationDate: utils.toDate(item.field_subs_activation_date),
        endDate: utils.toDate(item.field_subs_expiration_date),
        statusCd: item.field_status,
        status: toStatus(item.field_status),
        prodName: item.product_name,
        callTime: utils.stringToNumber(item.call_time),
        iccid: item.iccid,
        number070: item.field_070_number,
        localOpId: item.field_ref_local_operator,
        prodId: item.field_ref_product,
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND);
};
*/

/* not used
const toSubs = (data) => {
  if (data.nid) {
    return api.success([
      {
        nid: data.nid[0].value,
      },
    ]);
  }

  return api.failure(api.E_NOT_FOUND);
};
*/

/* not used
const getActiveRkbTalkProd = (iccid, {token}, abortController) => {
  if (_.isEmpty(iccid)) {
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  }

  if (_.isEmpty(token)) {
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  }

  return api.callHttpGet(
    `${api.httpUrl(api.path.rkbtalk, '')}/list/${iccid}/A?_format=json`,
    toRokebiProd,
    api.withToken(token),
    {
      abortController,
    },
  );
};
*/

/* not used
const reactivateRkbTalkProd = (
  iccid,
  subsId,
  mobile,
  {token},
  abortController,
) => {
  if (_.isEmpty(iccid) || _.isEmpty(subsId) || _.isEmpty(token)) {
    return api.reject(api.E_INVALID_ARGUMENT);
  }

  const url = `${api.httpUrl(
    api.path.rokApi.rokebi.call,
    '',
  )}/${iccid}/${subsId}?_format=json`;
  const headers = api.withToken(token, 'json');

  return api.callHttp(
    url,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({userName: mobile}),
    },
    toSubs,
    {
      abortController,
    },
  );
};

const remainingTime = (endDate: Moment) => {
  if (endDate) {
    const diff = endDate.diff(moment(), 'minutes');
    return `${Math.floor(diff / 60)}${i18n.t('hour')} ${
      diff > 10 * 60 ? '' : (diff % 60) + i18n.t('min')
    } ${i18n.t('call:timeLeft')}`;
  }
  return '';
};
*/

export default {
  CALL_PRODUCT,

  code,
  cmiStatusCd,

  STATUS_ACTIVE,
  STATUS_INACTIVE,
  STATUS_RESERVED,
  STATUS_CANCELED,
  STATUS_EXPIRED,
  STATUS_USED,

  GIFT_STATUS_SEND,

  getSubscription,
  getRkbTalkSubscription,
  addSubscription,
  otaSubscription,
  getOtaSubscription,
  updateSubscriptionStatus,
  updateSubscriptionGiftStatus,
  getSubsUsage,
  cmiGetSubsUsage,
  cmiGetSubsStatus,
};
