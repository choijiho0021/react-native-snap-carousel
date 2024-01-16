import _ from 'underscore';
import Env from '@/environment';
import {utils} from '@/utils/utils';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import api, {ApiResult, DrupalNode} from './api';
import {Currency, CurrencyCode} from './productApi';
import {API} from '.';
import {OrderPolicyType} from './orderApi';

const {esimCurrency, cachePrefix} = Env.get();

const KEY_INIT_CART = `${cachePrefix}cart.initList`;

export type RkbOrderItem = {
  orderItemId: number;
  uuid: string;
  key: string;
  type: string;
  prod: {
    type: string;
    variationId: string;
    uuid: string;
    sku: string;
  };
  title: string;
  qty: number;
  price: Currency;
  totalPrice: Currency;
};

export type RkbCart = {
  uuid: string;
  orderId: number;
  totalPrice: number;
  orderItems: RkbOrderItem[];
};

const toCart = (data: DrupalNode): ApiResult<RkbCart> => {
  const list = _.isArray(data) ? data : _.isObject(data) ? [data] : undefined;
  if (list && list.length > 0) {
    return api.success(
      list.map((item) => ({
        uuid: item.uuid,
        orderId: item.order_id,
        totalPrice:
          item.total_price && utils.stringToNumber(item.total_price.number),
        orderItems: item.order_items
          ?.filter((o) => _.isObject(o))
          .map((o) => ({
            orderItemId: o.order_item_id,
            uuid: o.uuid,
            key: o.purchased_entity && o.purchased_entity.uuid,
            type: o.purchased_entity && o.purchased_entity.type,
            prod: o.purchased_entity && {
              type: o.purchased_entity.type,
              variationId: o.purchased_entity.variation_id,
              uuid: o.purchased_entity.uuid,
              sku: o.purchased_entity.sku,
            },
            title: o.title,
            qty: utils.stringToNumber(o.quantity),
            price: o.unit_price && utils.priceToCurrency(o.unit_price),
            totalPrice: o.total_price && utils.priceToCurrency(o.total_price),
          })),
      })),
    );
  }

  return api.failure(api.E_NOT_FOUND);
};

const getStockTitle = (resp) => {
  const result = {
    ...resp,
    title: resp?.objects?.map((i) => `* ${i.title}\n`).join(''),
  };
  return result;
};

export type RkbStock = {
  variationId: string;
  qty: number;
  stock: number;
  lack: number;
  title?: string;
};

const toStock =
  (purchaseItems: PurchaseItem[]) =>
  (resp): ApiResult<RkbStock> => {
    return api.success(
      resp.objects.map((item) => ({
        variationId: item.purchased_entity_id,
        qty: item.quantity,
        stock: item.stock,
        lack: item.quantity - item.stock,
        title: purchaseItems.find(
          (p) => p.variationId === item.purchased_entity_id,
        )?.title,
      })),
      [],
      resp.result,
    );
  };

const get = () => {
  return api.callHttpGet(
    `${api.httpUrl(api.path.cart, '')}?_format=json`,
    toCart,
    api.headers('hal+json'),
  );
};

const add = ({
  purchaseItems,
  token,
}: {
  purchaseItems: PurchaseItem[];
  token?: string;
}) => {
  if (!purchaseItems)
    return api.reject(
      api.E_INVALID_ARGUMENT,
      'missing parameter: purchaseItems',
    );

  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttp(
    `${api.httpUrl(api.path.cart, '')}/add?_format=json`,
    {
      method: 'POST',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify(
        purchaseItems.map((item) => ({
          purchased_entity_type: 'commerce_product_variation',
          purchased_entity_id: item.variationId,
          quantity: item.qty,
        })),
      ),
    },
    toCart,
  );
};

const checkStock = async ({purchaseItems}: {purchaseItems: PurchaseItem[]}) => {
  if (!purchaseItems)
    return api.reject(
      api.E_INVALID_ARGUMENT,
      'missing parameter: purchaseItems',
    );

  const token = await API.User.getToken();

  return api.callHttp(
    `${api.httpUrl(api.path.cart, '')}/stock?_format=json`,
    {
      method: 'POST',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify(
        purchaseItems.map((item) => ({
          purchased_entity_type: 'commerce_product_variation',
          purchased_entity_id: item.variationId,
          quantity: item.qty,
        })),
      ),
    },
    toStock(purchaseItems),
  );
};

const remove = ({
  orderId,
  orderItemId,
}: {
  orderId: number;
  orderItemId: number;
}) => {
  const url = `${api.httpUrl(
    api.path.cart,
    '',
  )}/${orderId}/items/${orderItemId}?_format=json`;
  const headers = api.headers('json');

  return api.callHttp(
    url,
    {
      method: 'DELETE',
      headers,
    },
    (response) => {
      if (response.status === 204)
        return api.success([
          {
            orderId,
            orderItemId,
          },
        ]);
      return api.failure(api.E_NOT_FOUND);
    },
  );
};

const updateQty = ({
  orderId,
  orderItemId,
  qty,
  abortController,
}: {
  orderId: number;
  orderItemId: number;
  qty: number;
  abortController: AbortController;
}) => {
  const url = `${api.httpUrl(api.path.cart, '')}/${orderId}/items?_format=json`;
  const headers = api.headers('json');
  const body = {
    [orderItemId]: {quantity: qty},
  };

  return api.callHttp(
    url,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    },
    toCart,
    {abortController},
  );
};

/*
 *   $data = [
 *     'gateway' => 'paypal_test', // required. Commerce Payment Gateway name .
 *     'type' => 'paypal_ec', // required. Commerce Payment Type name.
 *     'details' => [], // optional. Payment details associated with the payment.
 *     'capture' => FALSE, // optional. Defines if the payment has to be finalized.
 *   ];
 * */
/* not used
    makePayment = (orderId, {token}) => {
        const url = `${api.httpUrl(api.path.commerce.payment, '')}/create/${orderId}?_format=json`
        const headers = api.withToken( token, 'json')
        const body = {
            gateway: 'iamport',
            type: 'paypal',
            capture: true
        }

        return api.callHttp(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }, this.toCart)
    }
    */

/*
 *
 * @RestResource(
 *   id = "commerce_decoupled_checkout_order_create",
 *   label = @Translation("Commerce Order create"),
 *   uri_paths = {
 *     "create" = "/commerce/order/create"
 *   }
 * )
 *    'order' => [
 *      'type' => 'default', // optional. Order bundle name. Defaults to "default".
 *      'email' => 'customer@example.com', // optional. Defaults to user email.
 *      'store' => 1, // optional. Store ID. Defaults to the default store in the system.
 *      'field_name' => 'value', // optional. Any additional order field value.
 *      'order_items' => [ // optional.
 *        [
 *          'type' => 'default', // optional. Order item bundle name. Defaults to "default".
 *          'title' => '', // optional, defaults to referenced purchasable entity label.
 *          'quantity' => 1, // optional. Defaults to 1.
 *          'unit_price' => [ // optional. Only if need to override product price. Defaults to purchased_entity price * quantity.
 *            'number' => 5, // required if unit_price is defined.
 *            'currency_code' => // required if unit_price is defined.
 *          ],
 *          'purchased_entity' => [ // required if order_items is defined.
 *            'sku' => 'PRODUCT_SKU', // required. Product variation SKU.
 *          ],
 *          'field_name' => 'value', // optional. Any additional order item field value.
 *        ],
 *      ],
 *    ],
 *    // User profile associated with the order.
 *    'profile' => [
 *      'type' => 'customer', // optional. Profile bundle name. Defaults to "customer".
 *      'status' => FALSE, // optional. Activates profile after creation. Defaults to FALSE.
 *      'field_name' => 'value', // optional. Any additional profile field value.
 *    ],
 *    // A user account associated with the transaction.
 *    // Creates a new user if didn't not exist, or uses existing one.
 *    // In the second case fields WILL NOT be updated.
 *    'user' => [
 *      'mail' => 'user@example.com', // required.
 *      'name' => 'Kate',  // optional. User account name. Defaults to email value.
 *      'status' => FALSE, // optional. Actives user account after creation. Defaults to FALSE.
 *      'field_name' => 'value', // optional. Any additional user field value.
 *    ],
 *    // If you want to process the payment alongside with order submission,
 *    // then fill in the details of this field. Otherwise you can skip it
 *    // and use other REST endpoints to handle payments separately.
 *    'payment' => [
 *      'gateway' => 'paypal_test', // required. Commerce Payment Gateway name.
 *      'type' => 'paypal_ec', // required. Commerce Payment Type name.
 *      'details' => [], // optional. Payment details associated with the payment.
 *    ],
 *  ];
 */
export type PaymentInfo = {
  memo?: string;
  profile_uuid?: string;
  payment_type: string;
  merchant_uid: string;
  amount: number;
  rokebi_cash: number;
  dlvCost?: number;
  currency_code?: CurrencyCode;
  captured: boolean;
};

export type CouponInfo = {
  id: string[];
};

// order에 promotion(coupon)을 적용한 결과
export type OrderPromo = {
  coupon_id: string; // coupon id
  promo_id: string;
  title?: string;
  total: Currency;
  adj?: Currency;
};

const makeOrder = ({
  items,
  info,
  user,
  mail,
  token,
  iccid,
  esimIccid,
  orderId,
  mainSubsId,
  coupon,
}: {
  items: PurchaseItem[];
  info?: PaymentInfo;
  user?: string;
  mail?: string;
  token?: string;
  iccid?: string;
  esimIccid?: string;
  orderId?: number;
  mainSubsId?: string;
  coupon?: CouponInfo;
}) => {
  if (_.isEmpty(items))
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: items');

  if (!user)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: user');

  if (!mail)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: mail');

  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  if (
    items.findIndex((item) => item.type !== 'sim_card') >= 0 &&
    _.isEmpty(iccid)
  ) {
    // SIM card 이외의 상품 구매시에는 ICCID가 필요함
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: ICCID');
  }

  // 연장하기는 mainSubsId 값이 존재, 연장하기는 환불 불가능
  const orderType: OrderPolicyType =
    mainSubsId ||
    items.findIndex((item) => ['add_on_product', 'rch'].includes(item.type)) >=
      0
      ? 'immediate_order'
      : 'refundable';

  const body = {
    iccid,
    esimIccid,
    mainSubsId,
    order: {
      orderId,
      type: orderType,
      order_items: items.map((item) => ({
        quantity: item.qty,
        purchased_entity: {
          sku: item.sku,
        },
      })),
    },
    user: {
      mail,
      name: user,
    },
    payment: info
      ? {
          gateway: 'iamport',
          type: info.payment_type,
          details: {
            merchant_uid: info.merchant_uid,
            captured: info.captured,
          },
          amount: info.amount,
          rokebi_cash: info.rokebi_cash,
          shipping_cost: info.dlvCost,
          currency_code: info.currency_code || esimCurrency,
        }
      : null,
    coupon,
  };

  return api.callHttp(
    `${api.httpUrl(api.path.commerce.order, '')}?_format=json`,
    {
      method: 'POST',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify(body),
    },
    (resp) => {
      if (resp.result === 0 && resp.objects?.order_id) {
        // order_id 값이 있으면 성공한 것으로 간주한다.
        return api.success([
          {
            order_id: resp.objects.order_id,
            promo: Object.entries(resp.objects.promo)
              .map(
                ([k, v]) =>
                  ({
                    promo_id: k,
                    coupon_id: v.id,
                    title: v.title,
                    total: utils.stringToCurrency(v.total),
                    adj: utils.stringToCurrency(v.adj),
                  } as OrderPromo),
              )
              .filter((d) => !!d.adj),
          },
        ]);
      }
      if (resp.result === api.E_STATUS_EXPIRED) {
        return api.failure<PurchaseItem>(resp.result, resp.desc);
      }
      return api.failure<PurchaseItem>(-1, 'no result');
    },
  );
};

const calculateTotal = ({
  items,
  coupons,
  token,
}: {
  items: PurchaseItem[];
  coupons: string[];
  token?: string;
}) => {
  if (!token)
    return api.reject(api.E_INVALID_ARGUMENT, 'missing parameter: token');

  return api.callHttp(
    `${api.httpUrl(api.path.rokApi.rokebi.calculateTotal, '')}?_format=json`,
    {
      method: 'POST',
      headers: api.withToken(token, 'json'),
      body: JSON.stringify({
        coupons,
        order_items: items.map((item) => ({
          quantity: item.qty,
          purchased_entity_id: item.variationId,
        })),
      }),
    },
    (resp) => {
      if (resp.order_id?.length > 0) {
        // order_id 값이 있으면 성공한 것으로 간주한다.
        return api.success([resp]);
      }
      return api.failure<PurchaseItem>(-1, 'no result');
    },
  );
};

export default {
  toCart,
  getStockTitle,
  get,
  add,
  checkStock,
  remove,
  updateQty,
  makeOrder,
  calculateTotal,
  KEY_INIT_CART,
};
