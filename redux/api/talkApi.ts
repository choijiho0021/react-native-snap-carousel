import moment from 'moment';
import {ExpPointLog, PointHistory, TalkTariff} from '../modules/talk';
import api from './api';
import {utils} from '@/utils/utils';

// get my coupons
const getChannelInfo = ({mobile}: {mobile: string}) => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.talk)}/${mobile}?_format=json`,
  );
};

const getTalkPoint = ({mobile}: {mobile: string}) => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.point)}/${mobile}?real`,
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
    `${api.httpUrl(api.path.rokApi.rokebi.point)}/${mobile}?_format=json`,
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
};

const getTariff = async () => {
  const rsp = await api.callHttpGet(
    `${api.httpUrl(api.path.tariff)}?_format=json`,
  );

  const a = rsp as unknown as JsonTariff[];
  return Object.fromEntries(
    a.map((t) => [
      t.cc,
      {
        code: t.code,
        name: t.name,
        flag: t.flag,
        mobile: utils.stringToNumber(t.mobile),
        wireline: utils.stringToNumber(t.wireline),
      } as TalkTariff,
    ]),
  );
};

export type HistType = 'add' | 'deduct' | 'all';

const getPointHistory = ({
  iccid,
  mobile,
  token,
  sort,
  type,
}: {
  iccid?: string;
  mobile?: string;
  token?: string;
  sort?: string;
  type?: HistType;
}) => {
  let cond = 'log';
  if (sort) cond += `&sort=${sort}`;
  if (type) cond += `&type=${type}`;

  return api.callHttpGet<PointHistory>(
    iccid
      ? `${api.httpUrl(api.path.rokApi.rokebi.pointLog)}/${iccid}?${cond}`
      : `${api.httpUrl(api.path.rokApi.rokebi.pointLog)}/${mobile}?real`,
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
};
