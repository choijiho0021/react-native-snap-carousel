import {PointHistory} from '../modules/talk';
import api from './api';

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
      return rsp;
    },
    api.withToken(token, 'json'),
  );
};

export default {
  getChannelInfo,
  getTalkPoint,
  patchTalkPoint,
  getPointHistory,
};
