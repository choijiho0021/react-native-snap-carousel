import moment from 'moment';
import * as Hangul from 'hangul-js';
import {ExpPointLog, PointHistory, TalkTariff} from '../modules/talk';
import api from './api';
import {utils} from '@/utils/utils';

// get my coupons
const getChannelInfo = ({mobile}: {mobile: string}) => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.talk)}/${mobile}?_format=json`,
  );
};

// 함수 분리 필요?
const getTalkPoint = ({
  mobile,
  isReal = true,
}: {
  mobile: string;
  isReal?: boolean;
}) => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.point)}/${mobile}${
      isReal ? '?real' : ''
    }`,
  );
};

export type TalkSign = 'add' | 'deduct' | 'refund' | 'charge' | 'reward';

const patchTalkPoint = ({
  mobile,
  token,
  sign,
}: {
  mobile: string;
  token: string;
  sign: TalkSign;
}) => {
  return api.callHttp(
    `${api.httpUrl(api.path.rokApi.rokebi.point)}/${mobile}?real`,
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

// 전체 톡 포인트 조회 > iccid 기준으로 동작
const getPointHistory = ({
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

  return api.callHttpGet<PointHistory>(
    `${api.httpUrl(api.path.rokApi.rokebi.pointLog)}/${iccid}?${cond}`,
    (rsp) => {
      return rsp.result === 0
        ? api.success(
            rsp.objects.log.map(
              (o) =>
                ({
                  ...o,
                  created: o.created ? moment.unix(o.created) : undefined,
                  expire_at: o.expire_at ? moment.unix(o.expire_at) : undefined,
                } as PointHistory),
            ),
          )
        : api.failure(rsp.result, rsp.error);
    },
    api.withToken(token, 'json'),
  );
};

export default {
  getChannelInfo,
  getTalkPoint,
  getExpPointInfo,
  patchTalkPoint,
  getPointHistory,
  getTariff,
  getEmgInfo,
};
