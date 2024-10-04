import moment from 'moment';
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

const getPointHistory = ({
  iccid,
  mobile,
  token,
}: {
  iccid?: string;
  mobile?: string;
  token?: string;
}) => {
  return api.callHttpGet<PointHistory>(
    iccid
      ? `${api.httpUrl(api.path.rokApi.rokebi.pointLog)}/${iccid}`
      : `${api.httpUrl(api.path.rokApi.rokebi.pointLog)}/${mobile}?real`,
    (rsp) => {
      return rsp.result === 0
        ? api.success(
            rsp.objects.tpnt_log
              .map(
                (o) =>
                  ({
                    ...o,
                    created: o.created ? moment(o.created) : undefined,
                  } as PointHistory),
              )
              .sort((a, b) => moment(b.created).diff(moment(a.created))),
          )
        : api.failure(rsp.result, rsp.error);
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
