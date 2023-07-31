import _, {isArray} from 'underscore';
import moment from 'moment';
import i18n from '@/utils/i18n';
import api, {ApiResult, DrupalNode, DrupalNodeJsonApi} from './api';
import Env from '@/environment';

const {specialCategories} = Env.get();

const STATUS_ACTIVE = 'A'; // 사용중
const STATUS_INACTIVE = 'I'; // 미사용
export const STATUS_RESERVED = 'R'; // 사용 대기중
const STATUS_CANCELED = 'C'; // 취소
const STATUS_EXPIRED = 'E'; // 사용 기간 종료
const STATUS_USED = 'U'; // 사용 완료
export const STATUS_PENDING = 'P'; // 지연 , 상품 배송 중

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

// const priority = {
//   A: 6,
//   R: 5,
//   I: 4,
//   U: 3,
//   E: 2,
// };

export const cmiStatusCd = {
  1: 'R',
  2: 'E', // 사용여부와 관련 없이, 상품의 유효기간 만료
  3: 'A', // 사용완료된 상태여도 Active 리턴
  99: 'C',
};

export const quadcellStatusCd = {
  '0': 'R', // Inactivate - Ready to use
  '1': 'A', // Activated
  '2': 'U', // In “top-up-awaiting” window
  '3': 'U', // Locked
  '4': 'U', // Expired

  // '2': 'W', // In “top-up-awaiting” window
  // '3': 'L', // Locked
};

export const bcStatusCd = {
  0: 'R', // not used
  1: 'A', // in use
  2: 'U', // used
  3: 'C', // cancelled
};

export const getLatestExpireDateSubs = (a: RkbSubscription[]) =>
  a.reduce((latest, item) => {
    const itemExpireDate = moment(item?.expireDate);
    if (!latest || itemExpireDate.isAfter(moment(latest?.expireDate))) {
      return item;
    }
    return latest;
  }, a[0]);

export const getLatestPurchaseDateSubs = (a: RkbSubscription[]) =>
  a.reduce((latest, item) => {
    const itemPurchaseDate = moment(item?.purchaseDate);
    if (!latest || itemPurchaseDate.isAfter(moment(latest?.purchaseDate))) {
      return item;
    }
    return latest;
  }, a[0]);

export const isDisabled = (item: RkbSubscription) => {
  return (
    item.giftStatusCd === 'S' || moment(item.expireDate).isBefore(moment())
  );
};

// 선물안한 상품(구매,선물받음) - 구매일자별 정렬, 선물한 상품 구매일자별 정렬
export const sortSubs = (a: RkbSubscription[], b: RkbSubscription[]) => {
  if (a.length < 1 || b.length < 1) {
    console.log('@@@@ sortsubs params have empty array');
    return -1;
  }

  const lastExpireA = getLatestExpireDateSubs(a);
  const lastExpireB = getLatestExpireDateSubs(b);
  if (!isDisabled(lastExpireA) && isDisabled(lastExpireB)) return -1;

  if (
    isDisabled(lastExpireA) === isDisabled(lastExpireB) &&
    moment(getLatestPurchaseDateSubs(a).purchaseDate).isAfter(
      getLatestPurchaseDateSubs(b).purchaseDate,
    )
  ) {
    return -1;
  }

  return 1;
};

const toStatus = (v?: string) => {
  return code[v] ? i18n.t(`his:${code[v]}`) : v;
};

export type StatusObj = {
  statusCd?: string;
  endTime?: string;
};

export type UsageObj = {
  quota?: number;
  used?: number;
};

export type Usage = {
  status: StatusObj;
  usage: UsageObj;
};

export type RkbSubscription = {
  key: string;
  uuid: string;
  purchaseDate: string;
  expireDate: string;
  activationDate: string;
  provDate?: string;
  statusCd: string;
  status: string;
  giftStatusCd: string;
  type: string;
  isStore: boolean;

  tag?: string[];
  endDate?: string;
  country?: string[];
  prodName?: string;
  prodId?: string;
  prodNid?: string;
  prodDays?: string;
  nid?: string;
  actCode?: string;
  smdpAddr?: string;
  qrCode?: string;
  imsi?: string;
  subsIccid?: string;
  packageId?: string;
  subsOrderNo?: string;
  partner?: string;
  promoFlag?: string[];
  caution?: string;
  cautionList?: string[];
  noticeOption: string[];
  daily?: string;
  dataVolume?: string;

  refSubs?: string;
  prodType?: string;
  flagImage?: string;
  alias?: string;
  hide?: boolean;
};

const groupPartner = (partner: string) => {
  if (partner.startsWith('cmi')) return 'cmi';
  if (partner.startsWith('quadcell')) return 'quadcell';
  return partner;
};

const toSubs = (item) => ({
  key: item.uuid || '',
  uuid: item.uuid || '',
  purchaseDate: item.field_purchase_date || '',
  expireDate: item.field_expiration_date || '',
  activationDate: item.field_subs_activation_date || '',
  provDate: item.field_prov_time || '',
  endDate: item.field_subs_expiration_date || '',
  statusCd: item.field_status || '',
  status: toStatus(item.field_status) || '',
  tag: item.field_tag || [],
  giftStatusCd:
    giftCode[item.field_gift_status] || item.field_gift_status || '',
  country: item.field_country || '',
  prodName: item.title || '',
  prodId: item.product_uuid || '',
  prodNid: item.product_id || '',
  nid: item.nid || '',
  actCode: item.field_activation_code || '',
  smdpAddr: item.sm_dp_address || '',
  qrCode: item.qr_code || '',
  imsi: item.field_imsi || '',
  type: item.type || '',
  subsIccid: item.field_iccid || '',
  packageId: item.field_cmi_package_id || '',
  subsOrderNo: item.field_cmi_order_id || '',
  partner: groupPartner(item.field_ref_partner?.toLowerCase() || ''),
  promoFlag: item.field_special_categories
    ? item.field_special_categories
        .split(',')
        .map((v) => specialCategories[v.trim()])
        .filter((v) => !_.isEmpty(v))
    : [],
  caution: item.field_caution || '',
  cautionList: item.field_caution_list || [],
  noticeOption: item.field_notice_option || [],
  daily: item.field_daily,
  dataVolume: item.field_data_volume,
  refSubs: item.field_ref_subscription || '',
  prodType: item.product_type || '',
  prodDays: item.product_days || '',
  flagImage: item.field_flag_image || '',
  hide: item.field_hidden === '1',
});

const toSubscription =
  (isStore = false) =>
  (data: DrupalNode[] | DrupalNodeJsonApi): ApiResult<RkbSubscription> => {
    if (_.isArray(data)) {
      return api.success(
        data.map((d) => {
          const s = toSubs(d);
          s.isStore = isStore;
          return s;
        }),
      );
    }

    return api.failure(data.result || api.E_NOT_FOUND, data.desc || '');
  };

const toSubsUpdate = (data) => {
  if (data.result === 0 && isArray(data.objects)) {
    return api.success(
      data.objects.map((item) => ({
        nid: item.nid,
        uuid: item.uuid,
        iccid: item.iccid,
        // alias: item.alias?.startsWith('00001111') ? '' : item.alias,
        hide: item.hidden === '1',
      })),
    );
  }
  return data;
};

const toTagUpdate = (data) => {
  if (data.result === 0 && isArray(data.objects)) {
    return api.success(
      data.objects.map((item) => ({
        key: item.uuid,
        uuid: item.uuid,
        iccid: item.field_iccid,
        tag: item.field_tag,
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
  uuid,
  iccid,
  token,
  hidden,
}: {
  iccid: string;
  token: string;
  uuid?: string;
  hidden?: boolean;
}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.subs, '')}/${
      uuid || '0'
    }?_format=json&iccid=${iccid}&hidden=${hidden ? '1' : '0'}`,
    (resp) => {
      if (resp.result === 0) resp.objects = resp.objects.map(toSubs);
      return resp;
    },
    api.withToken(token, 'json'),
  );
};

const getStoreSubscription = ({
  mobile,
  token,
  hidden,
}: {
  mobile?: string;
  token?: string;
  hidden?: boolean;
}) => {
  if (!mobile)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mobile');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttpGet(
    `${api.httpUrl(api.path.storeSubs)}/${mobile}/${
      hidden ? 'all/1' : '1'
    }?_format=hal_json`,
    toSubscription(true),
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
    toSubscription(),
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
    toSubscription(),
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

const updateSubscriptionInfo = ({
  uuid, // subs uuid
  token,
  alias, // target status
  hide, // target status
}: {
  uuid: string;
  token: string;
  alias?: string;
  hide?: boolean;
}) => {
  if (!uuid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uuid');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttp(
    `${api.httpUrl(api.path.rokApi.rokebi.subs, '')}/${uuid}?_format=json`,
    {
      method: 'PATCH',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify({alias, hide}),
    },
    toSubsUpdate,
  );
};

const updateSubscriptionAndOrderTag = ({
  uuid, // subs or store order uuid
  tag, // target tag
  token,
}: {
  uuid: string;
  tag: string;
  token: string;
}) => {
  if (!uuid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uuid');
  if (!tag) return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: tag');

  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttp(
    `${api.httpUrl(api.path.rokApi.rokebi.tag, '')}/${uuid}?_format=json`,
    {
      method: 'PATCH',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify({tag}),
    },
    toTagUpdate,
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
    toSubscription(),
  );
};

// 그래프를 그리기 위해서 가져올 데이터
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
  orderId,
}: {
  iccid: string;
  orderId: string;
}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  if (!orderId)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: orderId');

  return api.callHttpGet<Usage>(
    `${api.rokHttpUrl(
      api.path.rokApi.pv.cmiUsage,
    )}&iccid=${iccid}&orderId=${orderId}`,
    (data) => data,
    new Headers({'Content-Type': 'application/json'}),
  );
};

const cmiGetSubsStatus = ({iccid}: {iccid: string}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');

  return api.callHttpGet(
    `${api.rokHttpUrl(api.path.rokApi.pv.cmiStatus)}&iccid=${iccid}`,
    toCmiStatus,
    new Headers({'Content-Type': 'application/json'}),
  );
};

// get usage data from svc server
// CMI API를 사용하는 경우
const quadcellGetData = ({
  imsi,
  key,
  query,
}: {
  imsi: string;
  key: 'quota' | 'info' | 'packlist' | 'hlrstate' | 'fupquota';
  query?: Record<string, string | number>;
}) => {
  if (!imsi)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: imsi');

  return api.callHttpGet(
    `${api.rokHttpUrl(`${api.path.rokApi.pv.quadcell}/imsi/${imsi}/${key}`)}${
      query ? `&${api.queryString(query)}` : ''
    }`,
    (data) => {
      if (data?.result?.code === 0) {
        return api.success(data?.objects);
      }
      return data;
    },
    new Headers({'Content-Type': 'application/json'}),
  );
};

const quadcellGetUsage = ({
  imsi,
  query,
}: {
  imsi: string;
  query?: Record<string, string | number>;
}) => {
  if (!imsi)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: imsi');

  return api.callHttpGet<Usage>(
    `${api.rokHttpUrl(
      `${api.path.rokApi.pv.quadcell}/usage/quota`,
    )}&imsi=${imsi}`,
    (data) => {
      if (data?.result?.code === 0) {
        return api.success(data?.objects);
      }
      return data;
    },
    new Headers({'Content-Type': 'application/json'}),
  );
};

// get usage bc data from svc server
const bcGetSubsUsage = ({
  subsIccid,
  orderId,
}: {
  subsIccid: string;
  orderId?: string;
}) => {
  if (!subsIccid || !orderId)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');

  if (!orderId)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: orderId');

  return api.callHttpGet(
    `${api.rokHttpUrl(`${api.path.rokApi.pv.bc}/dataUsage`)}&${api.queryString({
      iccid: subsIccid,
      orderId,
    })}`,
    (data) => {
      if (data?.result?.code === 0) {
        return api.success(data?.objects);
      }
      return data;
    },
    new Headers({'Content-Type': 'application/json'}),
  );
};

const getHkRegStatus = ({iccid, imsi}: {iccid: string; imsi: string}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  if (!imsi)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: imsi');

  return api.callHttpGet(
    `${api.rokHttpUrl(
      api.path.rokApi.pv.hkRegStatus,
    )}&iccid=${iccid}&imsi=${imsi}`,
    (data) => {
      if (data?.result?.code === 0) {
        return api.success(
          data.objects.himsis.map((item) => ({
            hkRegStatus: item.realRuleList[0].authStatus,
          })),
        );
      }
      return data;
    },
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
  GIFT_STATUS_RECEIVE,

  PAGE_SIZE,

  getSubscription,
  getStoreSubscription,
  getRkbTalkSubscription,
  addSubscription,
  otaSubscription,
  getOtaSubscription,
  updateSubscriptionInfo,
  updateSubscriptionAndOrderTag,
  updateSubscriptionGiftStatus,
  getSubsUsage,
  cmiGetSubsUsage,
  cmiGetSubsStatus,
  quadcellGetData,
  getHkRegStatus,
  bcGetSubsUsage,
  quadcellGetUsage,
};
