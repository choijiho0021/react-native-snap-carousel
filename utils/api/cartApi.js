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
        const url = `${api.httpUrl(api.path.payment, '')}/create/${orderId}?_format=json`
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
}

export default new CartAPI()