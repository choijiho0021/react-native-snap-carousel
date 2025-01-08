import moment, {Moment} from 'moment';
import * as Hangul from 'hangul-js';
import {ExpPointLog, PointHistory, TalkTariff} from '../modules/talk';
import api from './api';
import {utils} from '@/utils/utils';

// 함수 분리 필요?
const getVoucherPoint = ({iccid}: {iccid: string}) => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.voucher)}/${iccid}`,
  );
};

const getRatePerMinute = ({
  mobile,
  called,
}: {
  mobile: string;
  called: string;
}) => {
  return api.callHttpGet(
    `${api.httpUrl(
      api.path.rokApi.rokebi.talk,
    )}/${mobile}?_format=json&rate&called=${called}`,
  );
};

const getCheckFirstReward = ({iccid}: {iccid: string}) => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.point)}/${iccid}?reward`,
  );
};

export type TalkSign = 'register' | 'add' | 'deduct' | 'refund' | 'reward';

const patchVoucherPoint = ({
  iccid,
  token,
  sign,
}: {
  iccid: string;
  token: string;
  sign: TalkSign;
}) => {
  return api.callHttp(
    `${api.httpUrl(api.path.rokApi.rokebi.voucher)}/${iccid}?_format=json`,

    {
      method: 'PATCH',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify({
        sign,
      }),
    },
    (resp) => {
      return resp;
    },
  );
};

const getExpPointInfo = ({iccid, token}: {iccid: string; token: string}) => {
  return api.callHttpGet<ExpPointLog>(
    `${api.httpUrl(api.path.rokApi.rokebi.pointLog)}/${iccid}?exp=30&list`,
    (rsp) => rsp,
    api.withToken(token, 'json'),
  );
};

/*
[{
  "cc": "jp", 
  "code": "81", 
  "flag": "/sites/default/files/2024-10/jp.png", 
  "mobile": "150.00", 
  "name": "일본", 
  "wireline": "150.00"
}]
*/
type JsonTariff = {
  cc: string;
  code: string;
  name: string;
  flag: string;
  mobile: string;
  wireline: string;
  tz: string;
};

const getTariff = async () => {
  const rsp = await api.callHttpGet(
    `${api.httpUrl(api.path.tariff)}?_format=json`,
  );

  const a = rsp as unknown as JsonTariff[];
  return Object.fromEntries(
    a.map((t) => [
      t.code,
      {
        key: t.cc,
        code: t.code,
        name: t.name,
        chosung: Hangul.d(t.name, true)
          .map((c) => c[0])
          .join(''),
        flag: t.flag,
        mobile: utils.stringToNumber(t.mobile),
        wireline: utils.stringToNumber(t.wireline),
        tz: t.tz,
      } as TalkTariff,
    ]),
  );
};

// key: 04, 119
const getEmgInfo = async () => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.config)}/talk?_format=json`,
  );
};

export type HistType = 'add' | 'deduct' | 'all';

export type VoucherHistory = {
  diff: string;
  expire_at: Moment;
  create_dt: Moment;
  reason: string;
  ref_node: string;
  order_id: number;
  type: string;
};

// 전체 톡 포인트 조회 > iccid 기준으로 동작
const getVoucherHistory = ({
  iccid,
  token,
  sort,
  type,
}: {
  iccid: string;
  token?: string;
  sort?: string; // asc | desc
  type?: HistType; // add | deduct (default: 조회)
}) => {
  let cond = 'log';
  if (sort) cond += `&sort=${sort}`;
  if (type) cond += `&type=${type}`;

  return api.callHttpGet<VoucherHistory>(
    `${api.httpUrl(api.path.rokApi.rokebi.voucherLog)}/${iccid}?${cond}`,
    (rsp) => {
      return rsp.result === 0
        ? api.success(
            rsp.objects.log.map(
              (o) =>
                ({
                  ...o,
                  inc: o?.diff?.[0] !== '-' ? 'Y' : 'N',
                  diff: utils.stringToNumber(o.diff) || 0,
                  type: `voucher:${o?.reason}`,
                  create_dt: o.created ? moment.unix(o.created) : undefined, // 이름을 cash,point와 동일하게 맞춰줌
                  expire_dt: o.expire_at ? moment.unix(o.expire_at) : undefined,
                } as VoucherHistory),
            ),
          )
        : api.failure(rsp.result, rsp.error);
    },
    api.withToken(token, 'json'),
  );
};

export default {
  getVoucherPoint,
  getExpPointInfo,
  patchVoucherPoint,
  getVoucherHistory,
  getTariff,
  getEmgInfo,
  getRatePerMinute,
  getCheckFirstReward,
};
