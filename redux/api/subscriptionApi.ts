import _, {isArray} from 'underscore';
import moment, {Moment} from 'moment';
import i18n from '@/utils/i18n';
import api, {ApiResult, DrupalNode, DrupalNodeJsonApi} from './api';
import {getLastExpireDate, isDraft} from '../modules/order';
import Env from '@/environment';
import {parseJson} from '@/utils/utils';

const {specialCategories} = Env.get();

export const STATUS_ACTIVE = 'A'; // 사용중
const STATUS_INACTIVE = 'I'; // 미사용
export const STATUS_RESERVED = 'R'; // 사용 대기중
const STATUS_CANCELED = 'C'; // 취소
export const STATUS_EXPIRED = 'E'; // 사용 기간 종료, 발권 실패
export const STATUS_USED = 'U'; // 사용 완료
export const STATUS_PENDING = 'P'; // 지연 , 상품 배송 중
export const STATUS_DRAFT = 'D'; // 발권중

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

export const dataStatusCd = {
  1: 'R',
  2: 'E', // 사용여부와 관련 없이, 상품의 유효기간 만료
  3: 'A', // 사용완료된 상태여도 Active 리턴
  99: 'C',
};

export const isDisabled = (item: RkbSubscription) => {
  return (
    item.giftStatusCd === 'S' ||
    (item.partner === 'ht' &&
      item?.lastExpireDate &&
      item.lastExpireDate.isBefore(moment())) ||
    (item?.cnt > 1
      ? item.lastExpireDate && item.lastExpireDate.isBefore(moment())
      : item.expireDate && item.expireDate.isBefore(moment()))
  );
};

const checkTimeOrder = (a: RkbSubscription, b: RkbSubscription) => {
  // a가 b보다 최신이라면 정배열, 그대로 둔다.
  return (a.lastProvDate || a.provDate || a.purchaseDate).isAfter(
    b.lastProvDate || b.provDate || b.purchaseDate,
  )
    ? -1
    : 1;
};

export const sortSubs = (a: RkbSubscription, b: RkbSubscription) => {
  if (!a || !b) {
    console.log('@@@@ sortsubs params have empty array');
    return -1;
  }

  const isDraftA = isDraft(a.statusCd);
  const isDraftB = isDraft(b.statusCd);

  if (isDraftA) {
    if (isDraftB) {
      // 둘다 발송중이면 시간 순으로 나열한다.
      return checkTimeOrder(a, b);
    }
    // 앞이 상품 발송중인데 뒤가 상품 발송중이 아니다. 정배열 상태
    return -1;
  }

  // 앞은 상품 발송중 아님, 뒤가 상품 발송중 -> 정배열 아님, 뒤집는다.
  if (isDraftB) {
    return 1;
  }

  // 앞과 뒤 모두 상품 발송 중이 아닌 경우
  const isDisabledA = isDisabled(a);
  const isDisabledB = isDisabled(b);

  if (isDisabledA) {
    // 앞과 뒤 모두 비활성화 상태 -> 시간순으로 정렬한다.
    if (isDisabledB) {
      return checkTimeOrder(a, b);
    }
    // 앞 비활성화, 뒤가 활성화인 경우 -> 정배열 아님, 뒤집는다.
    return 1;
  }

  // 앞 활성화, 뒤가 비활성화인 경우 -> 정배열 상태
  if (isDisabledB) {
    return -1;
  }
  // 앞 활성화, 뒤 활성화 -> 정배열 상태
  return checkTimeOrder(a, b);
};

export const toStatus = (v?: string) => {
  return code[v] ? i18n.t(`his:${code[v]}`) : v;
};

export type StatusObj = {
  orderId?: string | undefined;
  statusCd?: string;
  endTime?: string;
};

export type UsageObj = {
  quota?: number;
  used?: number;
  remain?: number;
  totalUsed?: number;
};

export type UsageOptionObj = {
  mode?: String[]; // stu: 상태값 출력, usa: 현재 사용량 보여줌, end : 상품 종료시간 보여줌
  ret?: string;
};

export type Usage = {
  status: StatusObj;
  usage: UsageObj;
  usageOption: UsageOptionObj;
};

export enum AddOnOptionType {
  NEVER = 'N',
  ADD_ON = 'A',
  EXTENSTION = 'E',
  BOTH = 'B',
}

export type storeNameType = 'N' | 'W' | 'B';

export type RkbSubscription = {
  nid: string;
  key: string;
  uuid: string;
  purchaseDate: Moment;
  expireDate: Moment;
  provDate?: Moment;
  lastProvDate?: Moment;
  activationDate?: Moment;
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
  actCode?: string;
  smdpAddr?: string;
  qrCode?: string;
  imsi?: string;
  imei2?: string;
  eid?: string;
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
  clMtd?: string;

  refSubs?: string;
  flagImage?: string;
  alias?: string;
  hide?: boolean;
  cnt?: number;
  lastExpireDate?: Moment;
  startDate?: Moment;
  addOnOption?: AddOnOptionType;
  resetTime?: string;
  localOpId?: string;
  extLocalOps?: string[];
  storeName?: storeNameType;
  storeOrderId?: string;
};

export const getMoment = (str: string) =>
  str ? moment(str).tz('Asia/Seoul') : undefined;

// get usage data from svc server
// CMI API를 사용하는 경우
const cmiGetSubsUsage = ({
  iccid,
  orderId,
  imsi,
}: {
  iccid: string;
  orderId: string;
  imsi?: string;
}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  if (!orderId)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: orderId');

  return api.callHttpGet<Usage>(
    `${api.rokHttpUrl(
      api.path.rokApi.pv.cmiUsage,
    )}&iccid=${iccid}&orderId=${orderId}&imsi=${imsi}`,
    (data) => data,
    new Headers({'Content-Type': 'application/json'}),
  );
};

const quadcellGetUsage = ({
  imsi,
  partner,
  usage = 'y',
}: {
  imsi: string;
  partner: string;
  usage?: string;
}) => {
  if (!imsi)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: imsi');

  const path =
    partner === 'quadcell2'
      ? api.path.rokApi.pv.quadcell2
      : api.path.rokApi.pv.quadcell;

  return api.callHttpGet<Usage>(
    `${api.rokHttpUrl(`${path}/usage/quota`)}&imsi=${imsi}&usage=${usage}`,
    (data) => data,
    new Headers({'Content-Type': 'application/json'}),
  );
};

// get usage bc data from svc server
const bcGetSubsUsage = ({
  subsIccid,
  orderId,
  localOpId,
}: {
  subsIccid: string;
  orderId?: string;
  localOpId?: string;
}) => {
  if (!subsIccid || !orderId)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');

  if (!orderId)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: orderId');

  return api.callHttpGet<Usage>(
    `${api.rokHttpUrl(
      `${api.path.rokApi.pv.bc}/usage/quota`,
    )}&${api.queryString({
      iccid: subsIccid,
      orderId,
      localOpId: localOpId || '0',
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

const checkCmiData = async (
  item: RkbSubscription,
): Promise<{
  status: StatusObj;
  usage: UsageObj;
  usageOption: UsageOptionObj;
}> => {
  if (item?.subsIccid && item?.packageId) {
    const {result, objects} = await cmiGetSubsUsage({
      iccid: item?.subsIccid,
      imsi: item?.imsi,
      orderId: item?.subsOrderNo || 'noOrderId',
    });

    if (result?.code === 0 && objects.length > 0) return objects[0];
  }
  return {
    status: {statusCd: undefined, endTime: undefined},
    usage: {
      quota: undefined,
      used: undefined,
      remain: undefined,
      totalUsed: undefined,
    },
    usageOption: {
      mode: ['stu', 'usa', 'end'],
    },
  };
};

const checkQuadcellData = async (item: RkbSubscription): Promise<Usage> => {
  if (item?.imsi) {
    const {result, objects} = await quadcellGetUsage({
      imsi: item.imsi,
      partner: item.partner!,
    });

    if (result?.code === 0 && objects.length > 0) return objects[0];
  }
  return {
    status: {statusCd: undefined, endTime: undefined},
    usage: {
      quota: undefined,
      used: undefined,
      remain: undefined,
      totalUsed: undefined,
    },
    usageOption: {
      mode: ['stu', 'usa', 'end'],
    },
  };
};

const checkBcData = async (
  item: RkbSubscription,
): Promise<{
  status: StatusObj;
  usage: UsageObj;
  usageOption: UsageOptionObj;
}> => {
  if (item?.subsIccid) {
    const {result, objects} = await bcGetSubsUsage({
      subsIccid: item.subsIccid,
      orderId: item.subsOrderNo,
      localOpId: item.localOpId,
    });

    if (result === 0 && objects.length > 0) return objects[0];
  }

  return {
    status: {statusCd: undefined, endTime: undefined},
    usage: {
      quota: undefined,
      used: undefined,
      remain: undefined,
      totalUsed: undefined,
    },
    usageOption: {
      mode: ['stu', 'end'],
    },
  };
};

export const checkUsage = async (item: RkbSubscription) => {
  let result = {status: {}, usage: {}, usageOption: {}};

  switch (item.partner) {
    case 'cmi':
    case 'cmi2':
      result = await checkCmiData(item);
      break;
    case 'quadcell':
    case 'quadcell2':
      result = await checkQuadcellData(item);
      break;
    case 'billionconnect':
      result = await checkBcData(item);
      break;
    case 'ht':
      result = {
        status: {
          statusCd: 'A',
          endTime: moment(item.activationDate)
            ?.add(Number(item.prodDays) - 1, 'days')
            ?.endOf('day'),
        },
        usage: {quota: 0, used: 0, remain: 0, totalUsed: 0},
        usageOption: {
          mode: ['end'],
        },
      };
      break;
    // mosaji, baycon 사용랴 조회 사용 불가 (기본값)
    default:
      result = {
        status: {
          statusCd: 'A',
        },
        usage: {quota: 0, used: 0, remain: 0, totalUsed: 0},
        usageOption: {
          mode: [],
        },
      };
      break;
  }
  return result;
};

const toSubscription = (
  data: DrupalNode[] | DrupalNodeJsonApi,
): ApiResult<RkbSubscription> => {
  if (data.jsonapi) {
    const obj = _.isArray(data.data) ? data.data : [data.data];

    return api.success(
      obj.map((item) => ({
        key: item.id,
        uuid: item.id,
        purchaseDate: getMoment(item.field_purchase_date),
        expireDate: getMoment(item.field_subs_expiration_date),
        statusCd: item.field_status,
        giftStatusCd:
          giftCode[item.attributes?.field_gift_status] ||
          item.attributes?.field_gift_status ||
          '',
        status: toStatus(item.field_status),
        type: item.type,
      })),
      data.links,
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

const toSubsUsage = (data: {
  objects: {usage: UsageObj};
}): ApiResult<UsageObj> => {
  if (data.objects && data.objects.usage) {
    return api.success([data.objects.usage]);
  }

  return api.failure(api.E_NOT_FOUND);
};

// tb-esim.rokebi.com/rokebi/subs/0?_format=json&hidden=1&iccid=0000111101010002000&count=40
// tb-esim.rokebi.com/rokebi/subs/0?_format=json&iccid=0000111101010002000&count=40

export type SubscriptionParam = {
  iccid: string;
  token: string;
  subsId?: string;
  uuid?: string;
  hidden?: boolean;
  count?: number;
  offset?: number;
  reset?: boolean;
};

const subsFulfillWithValue = (resp) => {
  if ([0, 1].includes(resp.result)) {
    resp.objects = resp.objects.map((o) => ({
      ...o,
      provDate: getMoment(o.provDate),
      lastProvDate: getMoment(o.lastProvDate),
      activationDate: getMoment(o.activationDate),
      cnt: parseInt(o.cnt || '0', 10),
      lastExpireDate: getLastExpireDate(o),
      startDate: getMoment(o.startDate),
      promoFlag: o?.promoFlag
        ?.map((p: string) => specialCategories[p.trim()])
        .filter((v) => !_.isEmpty(v)),

      partner: o.partner,
      clMtd: o.clMtd,
      status: toStatus(o.field_status),
      purchaseDate: getMoment(o.purchaseDate),
      expireDate: getMoment(o.expireDate),
    }));
  }
  return resp;
};

const getSubscription = ({
  uuid,
  iccid,
  subsId,
  token,
  hidden,
  count = 10,
  offset = 0,
}: SubscriptionParam) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  const url = `${api.httpUrl(api.path.rokApi.rokebi.subs)}/${
    uuid || '0'
  }?_format=json${hidden ? '' : '&hidden=0'}${
    subsId && subsId !== '0' ? `&subsId=${subsId}` : ''
  }&iccid=${iccid}&count=${count}&offset=${offset}&ver=v2`;

  return api.callHttpGet(
    url,
    (resp) => subsFulfillWithValue(resp),
    api.withToken(token, 'json'),
  );
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
    `${api.httpUrl(api.path.rokApi.rokebi.subs)}/${uuid}?_format=json`,
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
    `${api.httpUrl(api.path.rokApi.rokebi.tag)}/${uuid}?_format=json`,
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
    toSubscription,
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
const getCmiCardInfo = ({iccid}: {iccid: string}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');

  return api.callHttpGet(
    `${api.rokHttpUrl(api.path.rokApi.pv.cmiCardInfo)}&iccid=${iccid}`,
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

const cmiGetStatus = ({iccid}: {iccid: string}) => {
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: iccid');

  return api.callHttpGet<Usage>(
    `${api.rokHttpUrl(api.path.rokApi.pv.cmiUsage)}&iccid=${iccid}&usage=n`,
    (data) => data,
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

export default {
  CALL_PRODUCT,

  code,
  dataStatusCd,

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
  updateSubscriptionInfo,
  updateSubscriptionAndOrderTag,
  updateSubscriptionGiftStatus,
  getSubsUsage,
  getCmiCardInfo,
  cmiGetSubsUsage,
  cmiGetSubsStatus,
  cmiGetStatus,
  quadcellGetData,
  getHkRegStatus,
  bcGetSubsUsage,
  quadcellGetUsage,
};
