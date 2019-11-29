import api from './api'
import _ from 'underscore'
import utils from '../utils';



class PaymentAPI {
    PAGE_SIZE = 10

    toPayment = (data) => {
        if ( data.jsonapi) {
            const obj = _.isArray(data.data) ? data.data : [data.data]

            return api.success( obj.map(item => ({
                type: item.type,
                uuid: item.id,
                nid : item.attributes.drupal_internal__nid,
                amount : utils.stringToNumber( item.attributes.field_amount),
                created : item.attributes.created,
                balance : utils.stringToNumber( item.attributes.field_balance),
                directPayment : utils.stringToNumber( item.attributes.field_direct_payment),
                paymentType : item.attributes.field_payment_type,
                purchase : item.relationships.field_ref_purchase.data.map( p => {
                    const found = data.included.find(a => a.id == p.id)
                    return {
                        ... p,
                        name : found ? found.attributes.title : undefined
                    }
                }),
                //updated : item.attributes.changed,
                //uid : item.relationships.uid.data.id,
                //ref_account : _.isEmpty(item.relationships.field_ref_account.data) ? undefined : item.relationships.field_ref_account.data.id
            })), data.links)
        }

        if ( data._links) {
            // hal+json format
            return api.success( [{
                uuid: data.uuid[0].value,
                amount : data.field_amount[0].value,
                created: data.created[0].value
            }])
        }

        return api.failure(api.NOT_FOUND)
    }

    getHistory = ( userId, {user, pass}, link) => {
        if ( _.isEmpty(userId) || _.isEmpty(user) || _.isEmpty(pass)) 
            return api.reject( api.INVALID_ARGUMENT, `test: userId:${userId} ${user}`)

        const url = link || `${api.httpUrl(api.path.jsonapi.payment)}?include=field_ref_purchase&` +
            `fields[node--payment]=field_amount,created,field_activation_date,field_balance,field_direct_payment,field_payment_type,field_ref_purchase,drupal_internal__nid&` +
            `fields[node--sim_purchase]=title&` +
            `fields[node--roaming_product]=title&sort=-created&page[limit]=${this.PAGE_SIZE}&filter[uid.id][value]=${userId}`
        const headers = api.basicAuth(user, pass, 'vnd.api+json')
        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toPayment)
    }

    get = (uuid, {user, pass}) => {
        if ( _.isEmpty(uuid) || _.isEmpty(user) || _.isEmpty(pass)) return api.reject( api.INVALID_ARGUMENT, `test: amount`)

        const url = `${api.httpUrl(api.path.payment)}/${uuid}?_format=hal_json`
        const headers = api.basicAuth(user, pass, 'hal+json')
        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toPayment)
    }

    recharge = (amount, auth) => {
        return this.add('R', amount, auth)
    }

    buyProduct = (product, auth) => {
        return this.add('P', product, auth)
    }

    add = (type, {amount, directPayment, prodList, simList, deliveryAddressId}, {user,pass}) => {
        if ( _.isEmpty(user) || _.isEmpty(pass)) return api.reject( api.INVALID_ARGUMENT, `Invalid auth: user(${user})`)

        if ( type == 'R') { // recharge
            if ( ! _.isNumber(amount)) return api.reject( api.INVALID_ARGUMENT, `Invalid parameter: amount(${amount})`)
        }
        else if ( type == 'P') {    // purchase
            if ( ! _.isNumber(amount) || ! _.isNumber(directPayment) ||( _.isEmpty(prodList) && _.isEmpty(simList)) )
                return api.reject( api.INVALID_ARGUMENT, `Invalid parameter: amount:(${amount}), directPayment:(${directPayment})`)
        }
        else return api.reject( api.INVALID_ARGUMENT, `Invalid parameter: type(${type})`)

        const url = `${api.httpUrl(api.path.payment)}?_format=hal_json`
        const headers = api.basicAuth(user, pass, 'hal+json') 
        const body = {
            type : {target_id: 'payment'},
            title: {value: `${(type == 'R') ? 'Recharge' : 'Purchase'}:${amount}`},
            body : JSON.stringify({prodList, simList}),
            field_amount: {value: amount},
            field_payment_type: {value: type},
        }

        if ( type == 'P') {
            body.field_direct_payment = directPayment
            body.deliveryAddressId = deliveryAddressId
        }


        return api.callHttp(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }, this.toPayment)
    }
}

export default new PaymentAPI()