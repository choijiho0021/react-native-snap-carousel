import _ from 'underscore';
import moment, {Moment} from 'moment';
import i18n from '@/utils/i18n';
import utils from '@/redux/api/utils';
import api, {ApiResult} from './api';
import {Currency} from './productApi';
import Env from '@/environment';

const {cachePrefix, esimCurrency} = Env.get();

const ORDER_PAGE_ITEMS = 10;
const KEY_INIT_ORDER = `${cachePrefix}order.init`;

const deliveryText = [
  {
    key: i18n.t('pym:notSelected'),
    value: i18n.t('pym:notSelected'),
  },
  {
    key: i18n.t('pym:tel'),
    value: i18n.t('pym:toTel'),
  },
  {
    key: i18n.t('pym:frontDoor'),
    value: i18n.t('pym:atFrontDoor'),
  },
  {
    key: i18n.t('pym:deliveryBox'),
    value: i18n.t('pym:toDeliveryBox'),
  },
  {
    key: i18n.t('pym:security'),
    value: i18n.t('pym:toSecurity'),
  },
  {
    key: i18n.t('pym:input'),
    value: i18n.t('pym:input'),
  },
];

const shipmentState = {
  DRAFT: 'draft',
  READY: 'ready',
  SHIP: 'shipped',
  CANCEL: 'canceled',
};

const consentItem = {
  1: 'privacy',
  2: 'paymentAgency',
};
export type CancelKeywordType = 'changed' | 'mistake' | 'complain' | 'etc' | '';

export type NotiPymType = 'NOTI_PAYMENT' | 'CANCEL_PAYMENT';

export type RkbPayment = {
  amount: Currency;
  paymentGateway: string;
  paymentMethod: string;
  remote_id?: string;
};

export type OrderState =
  | 'completed'
  | 'validation'
  | 'canceled'
  | 'draft'
  | 'completed';

export type OrderItemType = {
  title: string;
  qty: number;
  price: number;
  uuid: string;
};

export type OrderPolicyType = 'immediate_order' | 'refundable' | 'default';

export type RkbOrder = {
  key: string;
  orderId: number;
  orderNo: string;
  orderDate?: Moment;
  orderType?: OrderPolicyType;
  subtotal: Currency;
  discount: Currency;
  deductBalance: Currency;
  totalPrice: Currency;
  state?: OrderState;
  orderItems: OrderItemType[];
  usageList: {status: string; nid: string}[];
  paymentList: RkbPayment[];
};

// server response format
type RkbOrderJson = {
  id: string;
  no: string;
  placed: string;
  type: string;
  state: string;
  subtotal: string;
  adj: string;
  total: string;
  item: {
    title: string;
    qty: number;
    price: number;
    uuid: string;
    type: string;
  }[];
  pym: {
    amt: string;
    pg: string;
    pm: string;
    id: string;
  }[];
  subs: {
    nid: string;
    status: string;
  }[];
};

const toOrder = (
  data: ApiResult<RkbOrderJson>,
  page?: number,
): ApiResult<RkbOrder> => {
  if (data.result === 0) {
    return api.success(
      data.objects
        .map((item) => {
          const deductBalance = item.pym
            .filter((value) =>
              ['rokebi_cash', 'rokebi_point'].includes(value.pg),
            )
            .reduce(
              (acc, cur) => acc + (utils.stringToNumber(cur.amt) || 0),
              0,
            );

          return {
            key: item.id || '',
            orderId: utils.stringToNumber(item.id) || 0,
            orderNo: item.no || '',
            orderDate: item.placed ? moment(item.placed) : undefined,
            orderType: item.type,
            state: item.state,
            subtotal: utils.stringToCurrency(item.subtotal),
            discount: utils.stringToCurrency(item.adj),
            deductBalance: utils.toCurrency(deductBalance, esimCurrency),
            totalPrice: utils.stringToCurrency(item.total),
            orderItems: item.item,
            usageList: item.subs,
            paymentList: item.pym.map((p) => ({
              amount: utils.stringToCurrency(p.amt),
              paymentGateway: p.pg,
              paymentMethod: p.pm,
              remote_id: p.id,
            })),
          } as RkbOrder;
        })
        .sort((a, b) => utils.cmpMomentDesc(a.orderDate, b.orderDate)),
      [page],
    );
  }

  return api.failure(data?.result || api.E_NOT_FOUND, data?.desc || '');
};

const draftOrder = ({orderId, token}: {orderId?: number; token?: string}) => {
  if (!orderId) {
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter : orderId');
  }
  if (!token) {
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter : token');
  }

  const url = `${api.httpUrl(
    api.path.commerce.order,
    '',
  )}/${orderId}?_format=json`;

  return api.callHttp(url, {
    method: 'PATCH',
    headers: api.withToken(token, 'json'),
    body: JSON.stringify({status: 'R'}),
  });
};

export type GetOrdersParam = {
  user?: string;
  token?: string;
  page?: number;
  orderId?: string;
  state?: 'all' | 'validation';
  orderType?: 'all' | 'refundable';
};

const getOrders = ({
  user,
  token,
  page = 0,
  state = 'all',
  orderId = '0',
  orderType = 'all',
}: GetOrdersParam) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');

  return api.callHttpGet(
    `${api.httpUrl(
      api.path.commerce.order,
      '',
    )}/${orderId}?_format=json&page=${page}&state=${state}&type=${orderType}`,
    (resp) => toOrder(resp, page),
    api.withToken(token, 'json'),
  );
};

const getOrderById = ({
  user,
  token,
  orderId,
}: {
  user?: string;
  token?: string;
  orderId?: string;
}) => {
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!orderId)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: orderId');

  return api.callHttpGet(
    `${api.httpUrl(api.path.commerce.order, '')}/${orderId}?_format=json`,
    (resp) => toOrder(resp),
    api.withToken(token, 'json'),
  );
};

export type CancelOrderParam = {
  orderId?: number;
  token?: string;
  reason?: CancelKeywordType;
};

const cancelOrder = ({orderId, token, reason}: CancelOrderParam) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!_.isNumber(orderId))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: orderId');

  return api.callHttp(
    `${api.httpUrl(api.path.commerce.order, '')}/${orderId}?_format=json`,
    {
      method: 'DELETE',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify({reason}),
    },
  );
};

const deliveryTrackingUrl = (company: string, trackingCode?: string) => {
  switch (company) {
    // 지금은 CJ 주소만 있음. 다른 회사 주소 확인 필요
    case 'CJ':
    default:
      return `https://www.cjlogistics.com/ko/tool/parcel/newTracking?gnbInvcNo=${trackingCode}`;
  }
};

export default {
  ORDER_PAGE_ITEMS,
  KEY_INIT_ORDER,

  deliveryText,
  shipmentState,
  consentItem,
  getOrders,
  getOrderById,
  cancelOrder,
  draftOrder,
  deliveryTrackingUrl,
};
