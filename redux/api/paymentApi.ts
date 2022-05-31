import {Platform} from 'react-native';
import _ from 'underscore';
import Env from '@/environment';
import api, {ApiResult, DrupalNodeJsonApi} from './api';
import {utils} from '@/utils/utils';

const {esimApp, esimGlobal} = Env.get();

const PAGE_SIZE = 10;

export type PaymentMethod = {
  key: string;
  method: string;
  title: string;
  icon?: string;
  language?: string;
};
const method = esimGlobal
  ? [
      [
        // {
        //   key: 'eximbay',
        //   method: 'card',
        //   title: 'pym:ccard',
        //   language: 'en',
        // },
        {
          key: 'paypal',
          method: 'card',
          title: 'pym:paypal',
          language: 'en_US',
          icon: 'paypal',
        },
      ],
    ]
  : [
      [
        {
          key: 'html5_inicis',
          method: 'card',
          title: 'pym:ccard',
        },
        {
          key: 'html5_inicis',
          method: 'ssgpay',
          title: 'pym:ssgpay',
          icon: 'ssgpay',
        },
        {
          key: 'html5_inicis',
          method: 'lpay',
          title: 'pym:lpay',
          icon: 'lpay',
        },
      ] as PaymentMethod[],
      [
        {
          key: 'html5_inicis',
          method: 'kakaopay',
          title: 'pym:kakao',
          icon: 'kakao',
        },
        {
          key: 'html5_inicis',
          method: 'tosspay',
          title: 'pym:toss',
          icon: 'toss',
        },
        {
          key: 'html5_inicis',
          method: 'payco',
          title: 'pym:payco',
          icon: 'payco',
        },
      ] as PaymentMethod[],
      [
        // {
        //   // method 확인
        //   key: 'html5_inicis',
        //   method: 'trans',
        //   title: 'pym:bank',
        // },
        {
          // 확인필요
          key: 'naverco',
          method: 'naverco',
          title: 'pym:naver',
          icon: 'naver',
        },
        !esimApp
          ? {
              key: 'danal',
              method: 'phone',
              title: 'pym:mobile',
            }
          : undefined,
      ] as PaymentMethod[],
      [
        Platform.OS === 'android'
          ? {
              key: 'html5_inicis',
              method: 'samsung',
              title: 'pym:samsung',
              icon: 'samsung',
            }
          : undefined,
      ] as PaymentMethod[],
    ];

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

const toToken = (data) => {
  return data;
};

const getImpToken = () => {
  const headers = {
    'Content-Type': `application/json`,
  };

  const imp_key = '0272408165941078';
  const imp_secret =
    'GzwsCZGCcrRFvKS8jOCqRniysvG1PDpwdWZPVFs77kNC4FLouoPmL7VdDBftfE0sB0iwGKEN5sq98cyC';
  // impkey, secret formdata append (Production / Development)

  return api.callHttp(
    `https://api.iamport.kr/users/getToken`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({imp_key, imp_secret}),
    },
    toToken,
  );
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

export default {
  method,

  getHistory,
  getImpToken,
  getUid,
};
