import _ from 'underscore';
import i18n from '@/utils/i18n';
import utils from '@/redux/api/utils';
import api, {ApiResult, DrupalNode} from './api';
import {Currency} from './productApi';
import {parseJson} from '@/utils/utils';

const ORDER_PAGE_ITEMS = 10;

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

export type RkbPayment = {
  amount: Currency;
  paymentGateway: string;
  paymentMethod: string;
  remote_id?: string;
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
  state?: string;
  orderItems: {title: string; qty: number; price: number}[];
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
          const balanceCharge = paymentList.find(
            (value) => value.payment_gateway === 'rokebi_cash',
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
            balanceCharge: utils.toCurrency(
              balanceCharge
                ? utils.stringToNumber(balanceCharge.amount__number) || 0
                : 0,
              totalPrice.currency,
            ),
          } as RkbOrder;
        })
        .sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1)),
      [page],
    );
  }

  return api.failure(api.E_NOT_FOUND);
};

const getOrders = ({
  user,
  token,
  page = 0,
}: {
  user?: string;
  token?: string;
  page?: number;
}) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');

  return api.callHttpGet(
    `${api.httpUrl(api.path.order, '')}/${user}?_format=json&page=${page}`,
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

const cancelOrder = ({orderId, token}: {orderId?: number; token?: string}) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');
  if (!_.isNumber(orderId))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: orderId');

  return api.callHttp(
    `${api.httpUrl(api.path.commerce.order, '')}/${orderId}?_format=json`,
    {
      method: 'DELETE',
      headers: api.withToken(token, 'json'),
    },
    (resp) => ({
      result: resp.status === '204' ? 0 : api.FAILED,
      objects: [],
    }),
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

  deliveryText,
  shipmentState,
  consentItem,
  getOrders,
  getOrderById,
  cancelOrder,
  deliveryTrackingUrl,
};
