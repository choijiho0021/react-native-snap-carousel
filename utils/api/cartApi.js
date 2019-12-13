import _ from 'underscore'
import api from './api'
import utils from '../utils'

class CartAPI {
    toCart = (data) => {
        const list = _.isArray(data) ? data : _.isObject(data) ? [data] : undefined
        if ( list && list.length > 0) {

            return api.success(
                list.map(item => ({
                    uuid: item.uuid,
                    orderId: item.order_id,
                    totalPrice: item.total_price && utils.stringToNumber( item.total_price.number),
                    orderItems: item.order_items && item.order_items.filter(o => _.isObject(o))
                        .map( o => ({
                            orderItemId: o.order_item_id,
                            uuid: o.uuid, 
                            key: o.purchased_entity && o.purchased_entity.uuid,
                            prod: o.purchased_entity && {
                                variationId: o.purchased_entity.variation_id,
                                uuid: o.purchased_entity.uuid,
                                type: o.purchased_entity.type,
                                sku: o.purchased_entity.sku,
                            },
                            title: o.title,
                            qty: utils.stringToNumber( o.quantity),
                            price: o.unit_price && utils.stringToNumber( o.unit_price.number),
                            totalPrice: o.total_price && utils.stringToNumber( o.total_price.number)
                        }))
                }))
            )
        }

        return api.failure(api.NOT_FOUND)
    }

    get = () => {
        const url = `${api.httpUrl(api.path.cart, '')}?_format=json`
        const headers = api.headers()
        return api.callHttp(url, {
            method: 'get',
            headers,
        }, this.toCart)
    }

    add = (prodList) => {
        const url = `${api.httpUrl(api.path.cart, '')}/add?_format=json`
        const headers = api.headers({}, 'json')
        const body = prodList.map(item => ({
            purchased_entity_type: 'commerce_product_variation',
            purchased_entity_id: item.variationId,
            quantity: item.qty
        }))

        return api.callHttp(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }, this.toCart)
    }

    remove = (orderId, orderItemId) => {
        const url = `${api.httpUrl(api.path.cart, '')}/${orderId}/items/${orderItemId}?_format=json`
        const headers = api.headers({}, 'json')

        return api.callHttp(url, {
            method: 'delete',
            headers,
        }, this.toCart)
 
    }

    update = (orderId, orderItemId, qty) => {
        const url = `${api.httpUrl(api.path.cart, '')}/${orderId}/items?_format=json`
        const headers = api.headers({}, 'json')
        const body = {
            [orderItemId]: { quantity: qty}
        }

        return api.callHttp(url, {
            method: 'patch',
            headers,
            body: JSON.stringify(body)
        }, this.toCart)
    }

    /*
       *   $data = [
   *     'gateway' => 'paypal_test', // required. Commerce Payment Gateway name .
   *     'type' => 'paypal_ec', // required. Commerce Payment Type name.
   *     'details' => [], // optional. Payment details associated with the payment.
   *     'capture' => FALSE, // optional. Defines if the payment has to be finalized.
   *   ];
   * */
    makePayment = (orderId, {token}) => {
        const url = `${api.httpUrl(api.path.commerce.payment, '')}/create/${orderId}?_format=json`
        const headers = api.withToken( token, 'json')
        const body = {
            gateway: 'iamport',
            type: 'paypal',
            capture: true
        }

        return api.callHttp(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }, this.toCart)
    }

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

    makeOrder = (items, {mobile, mail, token}) => {
        const url = `${api.httpUrl(api.path.commerce.order, '')}/create?_format=json`
        const headers = api.withToken( token, 'json')
        const body = {
            order: {
                order_items: items.map(item => ({
                    quantity: item.qty,
                    purchased_entity : {
                        sku : item.sku
                    }
                })),
            },
            user: {
                mail,
                name: mobile
            },
        }

        return api.callHttp(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }, this.toCart)
 
    }
}

export default new CartAPI()