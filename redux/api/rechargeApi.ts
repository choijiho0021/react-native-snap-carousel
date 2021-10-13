import _ from 'underscore';
import {utils} from '@/utils/utils';
import api, {ApiResult} from './api';

const PAGE_SIZE = 10;

export type RkbRecharge = {
  type?: string;
  uuid: string;
  amount: number;
  created: string;
};

const toRecharge = (data): ApiResult<RkbRecharge> => {
  if (data.jsonapi) {
    const obj = _.isArray(data.data) ? data.data : [data.data];

    return api.success(
      obj.map((item) => ({
        type: item.type,
        uuid: item.id,
        // nid : item.attributes.drupal_internal__nid,
        amount: utils.stringToNumber(item.attributes.field_amount),
        created: item.attributes.created,
        //updated : item.attributes.changed,
        //uid : item.relationships.uid.data.id,
        //ref_account : _.isEmpty(item.relationships.field_ref_account.data) ? undefined : item.relationships.field_ref_account.data.id
      })),
      data.links,
    );
  }

  if (data._links) {
    // hal+json format
    return api.success([
      {
        uuid: data.uuid[0].value,
        amount: data.field_amount[0].value,
        created: data.created[0].value,
      },
    ]);
  }

  return api.failure(api.E_NOT_FOUND);
};

/* not used
        use the function below.
    add = ({amount}, {user,pass}) => {
        if ( ! _.isNumber(amount) || _.isEmpty(user) || _.isEmpty(pass)) return api.reject( api.E_INVALID_ARGUMENT, `test: amount`)

        const url = `${api.httpUrl(api.path.jsonapi.recharge)}`
        const headers = api.basicAuth(user, pass, 'vnd.api+json')
        const body = {
            data: {
                type: 'node--recharge',
                attributes: {
                    title : `recharge ${amount}`,
                    field_amount : `${amount}`
                }
            }
        }

        return api.callHttp(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }, this.toRecharge)
    }
    */

const getHistory = ({
  userId,
  user,
  pass,
  link,
}: {
  userId: string;
  user: string;
  pass: string;
  link: string;
}) => {
  if (!userId)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: userId');

  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');

  if (!pass)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: pass');

  return api.callHttpGet(
    link ||
      `${api.httpUrl(
        api.path.jsonapi.recharge,
        '',
      )}?fields[node--recharge]=field_amount,created&sort=-created&page[limit]=${PAGE_SIZE}&filter[uid.id][value]=${userId}`,
    toRecharge,
    api.basicAuth(user, pass, 'vnd.api+json'),
  );
};

const get = ({
  uuid,
  user,
  pass,
}: {
  uuid: string;
  user: string;
  pass: string;
}) => {
  if (!uuid)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: uuid');

  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');

  if (!pass)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: pass');

  return api.callHttpGet(
    `${api.httpUrl(api.path.recharge, '')}/${uuid}?_format=hal_json`,
    toRecharge,
    api.basicAuth(user, pass, 'hal+json'),
  );
};

const add = ({
  iccid,
  // iccidId,
  amount,
  token,
}: {
  iccid: string;
  iccidId: string;
  amount: number;
  token: string;
}) => {
  if (!_.isNumber(amount))
    return api.reject(api.E_INVALID_ARGUMENT, 'invalid parameter: amount');
  if (!iccid)
    return api.reject(api.E_INVALID_ARGUMENT, 'invalid parameter: iccid');
  // if (!iccidId)
  // return api.reject(api.E_INVALID_ARGUMENT, 'invalid parameter: iccidId');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'invalid parameter: token');

  const url = `${api.httpUrl(api.path.recharge, '')}?_format=hal_json`;
  const headers = api.withToken(token, 'hal+json');
  const body = {
    type: {target_id: 'recharge'},
    title: {value: `recharge:${amount}`},
    field_amount: {value: amount},
    field_account: {value: iccid},
  };

  return api.callHttp(
    url,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
    toRecharge,
  );
};

export default {
  getHistory,
  get,
  add,
};
