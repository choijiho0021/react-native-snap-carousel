import _ from 'underscore'
import api from './api'
import i18n from '../i18n'

class SubscriptionAPI {
    PAGE_SIZE = 10

    code = {
        'A' : 'active',
        'I' : 'inactive',
        'E' : 'expired',
        'U' : 'used'
    }

    toString(val) {
        return typeof val === 'string' ? val : undefined
    }

    toStatus(code) {
        return i18n.t('his:' + this.code[code])
    }

    compare(a,b) {
        return a.purchaseDate.localeCompare(b.purchaseDate)
    }

    toSubscription = (data) => {
        console.log('subscription', data)
        if ( _.isArray(data)) {
            return api.success( data.map(item => ({
                key: item.uuid,
                uuid: item.uuid,
                purchaseDate: this.toString(item.field_purchase_date),
                activationDate: this.toString(item.field_subs_activation_date),
                expireDate: this.toString(item.field_subs_expiration_date),
                termDate: this.toString(item.field_subs_termination_date),
                statusCd: item.field_status,
                status: this.toStatus(item.field_status),
                prodName: item.title,
                prodId: item.product_uuid,
            })))
        }

        if ( data.jsonapi) {
            const obj = _.isArray(data.data) ? data.data : [data.data]

            return api.success( obj.map(item => ({
                key: item.id,
                uuid: item.id,
                purchaseDate: item.field_purchase_date,
                activationDate: item.field_subs_activation_date,
                expireDate: item.field_subs_expiration_date,
                staus: item.field_status
            })), data.links)
        }
        return {
            result: api.NOT_FOUND 
        }
    }

    getSubscription = (iccid, {token}) => {
        if ( _.isEmpty(iccid) || _.isEmpty(token)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.subscription)}/${iccid}?_format=hal_json`
        const headers = api.withToken(token)

        return api.callHttp(url, {
            method: 'get',
            headers,
        }, this.toSubscription)
    }


    /*
    getHistory = ( userId, {user, pass}, link) => {
        if ( _.isEmpty(userId) || _.isEmpty(user) || _.isEmpty(pass)) 
            return api.reject( api.INVALID_ARGUMENT, `test: userId:${userId} ${user}`)

        const url = link || `${api.httpUrl(api.path.jsonapi.subscription)}?fields[node--subscription]=created,field_activation_date,title&` +
            `sort=-created&page[limit]=${this.PAGE_SIZE}&filter[uid.id][value]=${userId}`
        const headers = api.basicAuth(user, pass, 'vnd.api+json')
        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toSubscription)
    }
    */


    addSubscription = (subs, {user, pass}) => {
        if ( _.isEmpty(user) || _.isEmpty(pass) || _.isEmpty(subs)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.subscription)}`
        const headers = api.basicAuth(user, pass, 'vnd.api+json', {
            'Accept': 'application/vnd.api+json'
        })
        const body = {
            data : {
                type: 'node--subscription',
                attributes : {
                    title: subs.title || user,
                    field_activation_date: subs.startDate
                },
                relationships: {
                    field_ref_product: {
                        data: {
                            type: 'node--roaming_product',
                            id: subs.uuid
                        }
                    }
                }
            }
        }

        return api.callHttp(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }, this.toSubscription)

    }

}

export default new SubscriptionAPI()