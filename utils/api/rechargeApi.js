import api from './api'
import _ from 'underscore'
import utils from '../utils';



class RechargAPI {
    PAGE_SIZE = 10

    toRecharge = (data) => {
        if ( data.jsonapi) {
            const obj = _.isArray(data.data) ? data.data : [data.data]

            return api.success( obj.map(item => ({
                type: item.type,
                uuid: item.id,
                //nid : item.attributes.drupal_internal__nid,
                amount : utils.stringToNumber( item.attributes.field_amount),
                created : item.attributes.created,
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

    /* not used
        use the function below.
    add = ({amount}, {user,pass}) => {
        if ( ! _.isNumber(amount) || _.isEmpty(user) || _.isEmpty(pass)) return api.reject( api.INVALID_ARGUMENT, `test: amount`)

        const url = `${api.httpUrl(api.path.jsonapi.recharge)}`
        const headers = api.basicAuth(user, pass, 'vnd.api+json')
        const body = {
            data: {
                type: 'node--recharge',
                attributes: {
                    title : `recharge ${amount}`,
                    field_amount : `${amount}`
                }
            }
        }

        return api.callHttp(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }, this.toRecharge)
    }
    */

    getHistory = ( userId, {user, pass}, link) => {
        if ( _.isEmpty(userId) || _.isEmpty(user) || _.isEmpty(pass)) 
            return api.reject( api.INVALID_ARGUMENT, `test: userId:${userId} ${user}`)

        const url = link || `${api.httpUrl(api.path.jsonapi.recharge)}?fields[node--recharge]=field_amount,created&` +
            `sort=-created&page[limit]=${this.PAGE_SIZE}&filter[uid.id][value]=${userId}`
        const headers = api.basicAuth(user, pass, 'vnd.api+json')
        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toRecharge)
    }

    get = (uuid, {user, pass}) => {
        if ( _.isEmpty(uuid) || _.isEmpty(user) || _.isEmpty(pass)) return api.reject( api.INVALID_ARGUMENT, `test: amount`)

        const url = `${api.httpUrl(api.path.recharge)}/${uuid}?_format=hal_json`
        const headers = api.basicAuth(user, pass, 'hal+json')
        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toRecharge)
    }

    add = ({amount}, {user,pass}) => {
        if ( ! _.isNumber(amount) || _.isEmpty(user) || _.isEmpty(pass)) return api.reject( api.INVALID_ARGUMENT, `test: amount`)

        const url = `${api.httpUrl(api.path.recharge)}?_format=hal_json`
        const headers = api.basicAuth(user, pass, 'hal+json') 
        const body = {
            type : {target_id: 'recharge'},
            title:{value: 'test'},
            field_amount:{value: amount},
            field_account:{value: user}
        }

        return api.callHttp(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }, this.toRecharge)
    }
}

export default new RechargAPI()