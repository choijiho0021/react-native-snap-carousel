import _ from 'underscore';
import Env from '@/environment';
import api, {ApiResult, DrupalNodeJsonApi} from './api';
import {utils} from '@/utils/utils';
import {RkbReceipt} from '@/screens/ReceiptScreen';

const {esimGlobal, isProduction, impKey, impSecret} = Env.get();

const PAGE_SIZE = 10;

export type PaymentMethod = {
  key: string;
  method: string;
  icon?: string;
  language?: string;
};
const method: Record<string, PaymentMethod> = esimGlobal
  ? {
      'pym:ccard': {
        key: 'eximbay',
        method: 'card',
        language: 'en',
      },
      'pym:paypal': {
        key: 'paypal',
        method: 'card',
        language: 'en',
        icon: 'paypal',
      },
    }
  : {
      'pym:ccard': {
        key: 'html5_inicis',
        method: 'card',
      },
      'pym:bank': {
        key: 'html5_inicis',
        method: 'trans',
      },
      'pym:kakao': {
        key: 'html5_inicis',
        method: 'kakaopay',
        icon: 'kakao',
      },
      'pym:toss': {
        key: 'html5_inicis',
        method: 'tosspay',
        icon: 'toss',
      },
      'pym:payco': {
        key: 'html5_inicis',
        method: 'payco',
        icon: 'payco',
      },
      'pym:naver': {
        key: 'html5_inicis',
        method: 'naverpay',
        icon: 'naver',
        // language: 'ko',
      },
      'pym:ssgpay': {
        key: 'html5_inicis',
        method: 'ssgpay',
        icon: 'ssgpay',
      },
      'pym:lpay': {
        key: 'html5_inicis',
        method: 'lpay',
        icon: 'lpay',
      },
      'pym:samsung': {
        key: 'html5_inicis',
        method: 'samsung',
        icon: 'samsung',
      },
    };

type RkbPayment = {
  type?: string;
  uuid: string;
  nid?: number;
  amount?: number;
  created: string;
  balance?: number;
  directPayment?: number;
  paymentType?: string;
  purchase?: object[];
};

const toPayment = (data: DrupalNodeJsonApi): ApiResult<RkbPayment> => {
  if (data.jsonapi) {
    const obj = _.isArray(data.data) ? data.data : [data.data];

    return api.success(
      obj.map((item) => ({
        type: item.type,
        uuid: item.id,
        nid: utils.stringToNumber(item.attributes.drupal_internal__nid),
        amount: utils.stringToNumber(item.attributes.field_amount),
        created: item.attributes.created,
        balance: utils.stringToNumber(item.attributes.field_balance),
        directPayment: utils.stringToNumber(
          item.attributes.field_direct_payment,
        ),
        paymentType: item.attributes.field_payment_type,
        purchase: item.relationships.field_ref_purchase.data.map((p) => {
          const found = data.included.find((a) => a.id === p.id);
          return {
            ...p,
            name: found ? found.attributes.title : undefined,
          };
        }),
        // updated : item.attributes.changed,
        // uid : item.relationships.uid.data.id,
        // ref_account : _.isEmpty(item.relationships.field_ref_account.data) ? undefined : item.relationships.field_ref_account.data.id
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

  const url =
    link ||
    `${api.httpUrl(api.path.jsonapi.payment)}?include=field_ref_purchase&` +
      `fields[node--payment]=field_amount,created,field_activation_date,field_balance,field_direct_payment,field_payment_type,field_ref_purchase,drupal_internal__nid&` +
      `fields[node--sim_purchase]=title&` +
      `fields[node--roaming_product]=title&sort=-created&page[limit]=${PAGE_SIZE}&filter[uid.id][value]=${userId}`;

  return api.callHttpGet(
    url,
    toPayment,
    api.basicAuth(user, pass, 'vnd.api+json'),
  );
};

const toPayCheck = (data) => {
  return data.response.map((item) => ({
    ...item,
    success: item.status === 'paid',
  }));
};

const getRokebiPayment = ({key, token}: {key: string; token: string}) => {
  return api.callHttp(
    `${api.httpUrl(api.path.rokApi.rokebi.payment, '')}?_format=json`,
    {
      method: 'POST',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify({pym_id: key}),
    },
  );
};

const getRokebiPaymentRule = ({token}: {token: string}) => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.rokApi.rokebi.paymentRule, '')}?_format=json`,
    (v) => v,
    api.withToken(token, 'json'),
  );
};

const getRokebiPaymentReceipt = ({
  key,
  token,
}: {
  key: string;
  token: string;
}) => {
  return api.callHttp(
    `${api.httpUrl(api.path.rokApi.rokebi.payment, '')}?_format=json`,
    {
      method: 'POST',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify({pym_id: key, receipt: true}),
    },
    (rsp) => {
      if (rsp.result === 0) {
        if (rsp.objects[0]) {
          const {amount, card_num, card_name} = rsp.objects[0];
          return api.success([
            {
              amount: parseFloat(amount),
              card_number: card_num,
              card_name,
              name: '',
            } as RkbReceipt,
          ]);
        }
        return api.failure(-1);
      }
      return api.failure(rsp.code);
    },
  );
};

const getImpToken = () => {
  const headers = {
    'Content-Type': `application/json`,
  };

  const imp_key = isProduction ? impKey : '9603012818567165';
  const imp_secret = isProduction
    ? impSecret
    : '21d8ef6b4daa18f5b0b305f7087066cd24f429a4f5b77c907bb4d260a03d257bb05219242bddf802';

  return api.callHttp(`https://api.iamport.kr/users/getToken`, {
    method: 'POST',
    headers,
    body: JSON.stringify({imp_key, imp_secret}),
  });
};

const getUid = ({uid, token}: {uid: string; token?: string}) => {
  if (!uid) return api.reject(api.E_INVALID_ARGUMENT, `missing parameter: uid`);
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, `missing parameter: token`);

  const headers = {
    'X-ImpTokenHeader': token,
    'Content-Type': `application/hal+json`,
  };
  return api.callHttpGet(
    `https://api.iamport.kr/payments?imp_uid[]=${uid}`,
    toPayCheck,
    headers,
  );
};

const getMerchantId = ({id, token}: {id: string; token?: string}) => {
  if (!id) return api.reject(api.E_INVALID_ARGUMENT, `missing parameter: id`);
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, `missing parameter: token`);

  const headers = {
    'X-ImpTokenHeader': token,
    'Content-Type': `application/hal+json`,
  };
  return api.callHttpGet(
    `https://api.iamport.kr/payments/find/${id}`,
    (v) => v,
    headers,
  );
};

export default {
  method,

  getHistory,
  getImpToken,
  getUid,
  getMerchantId,
  getRokebiPayment,
  getRokebiPaymentRule,
  getRokebiPaymentReceipt,
};
