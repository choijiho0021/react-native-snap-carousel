import _ from 'underscore';
import i18n from '@/utils/i18n';
import utils from '@/redux/api/utils';
import api, {ApiResult, DrupalNode} from './api';
import {Currency} from './productApi';
import {parseJson} from '@/utils/utils';
import Env from '@/environment';

const {cachePrefix} = Env.get();

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

export type RkbOrder = {
  key: string;
  orderId: number;
  orderNo: string;
  orderDate?: string;
  orderType?: string;
  totalPrice?: Currency;
  profileId?: string;
  trackingCode?: string;
  trackingCompany?: string;
  shipmentState?: string;
  memo?: string;
  state?: OrderState;
  orderItems: OrderItemType[];
  usageList: {status: string; nid: string}[];
  paymentList: RkbPayment[];
  dlvCost: Currency;
  balanceCharge: Currency;
};

const toOrder = (data: DrupalNode[], page?: number): ApiResult<RkbOrder> => {
  if (_.isArray(data) && data.length > 0) {
    return api.success(
      data
        .map((item) => {
          const paymentList = parseJson(item.payment_list) || [];
          const balanceCharge = paymentList
            .filter((value) =>
              ['rokebi_cash', 'rokebi_point'].includes(value.payment_gateway),
            )
            .reduce(
              (acc, cur) => acc + utils.stringToNumber(cur.amount__number),
              0,
            );
          const totalPrice = utils.stringToCurrency(item.total_price__number); // 배송비 불포함 금액

          return {
            key: item.order_id || '',
            orderId: utils.stringToNumber(item.order_id) || 0,
            orderNo: item.order_number || '',
            orderDate: item.placed,
            orderType: item.type,
            totalPrice,
            profileId: item.profile_id,
            trackingCode: item.tracking_code,
            trackingCompany: item.tracking_company,
            shipmentState: item.shipment_state,
            memo: item.memo || '',
            state: item.state,
            orderItems: (parseJson(item.order_items) || []).map((value) => ({
              title: value.title,
              qty: parseInt(value.quantity, 10),
              price: utils.stringToNumber(value.total_price__number),
              uuid: value?.uuid,
            })),
            usageList: (parseJson(item.usage_list) || []).map((value) => ({
              status: value.field_status,
              nid: value.nid,
            })),
            paymentList: paymentList.map((value) => ({
              amount: utils.stringToCurrency(value.amount__number),
              paymentGateway: value.payment_gateway,
              paymentMethod: value.payment_method, // 결제 수단
              remote_id: value.remote_id,
            })),
            dlvCost: utils.stringToCurrency(item.dlv_cost),
            balanceCharge: utils.toCurrency(balanceCharge, totalPrice.currency),
          } as RkbOrder;
        })
        .sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1)),
      [page],
    );
  }

  return api.failure(api.E_NOT_FOUND);
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

  const body = JSON.stringify({status: 'R'});

  return api.callHttp(
    url,
    {
      method: 'PATCH',
      headers: api.withToken(token, 'json'),
      body,
    },
    (resp) => {
      return resp;
    },
  );
};

const getOrders = ({
  user,
  token,
  page = 0,
  state = 'all',
}: {
  user?: string;
  token?: string;
  page?: number;
  state?: 'all' | 'validation';
}) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');

  return api.callHttpGet(
    `${api.httpUrl(
      api.path.order,
      '',
    )}/${user}/all/${state}?_format=json&page=${page}`,
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
  orderId?: number;
}) => {
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!_.isNumber(orderId))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: orderId');

  return api.callHttpGet(
    `${api.httpUrl(api.path.order, '')}/${user}/${orderId}?_format=json`,
    (resp) => toOrder(resp),
    api.withToken(token, 'json'),
  );
};

const cancelOrder = ({
  orderId,
  token,
  reason,
}: {
  orderId?: number;
  token?: string;
  reason?: string;
}) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!_.isNumber(orderId))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: orderId');

  return api.callHttp(
    `${api.httpUrl(api.path.commerce.order, '')}/${orderId}?_format=json`,
    {
      method: 'DELETE',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify({
        reason,
      }),
    },
    (resp) => {
      return resp;
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
