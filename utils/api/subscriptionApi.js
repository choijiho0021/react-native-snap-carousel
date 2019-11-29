import _ from 'underscore'
import api from './api'

class SubscriptionAPI {
    PAGE_SIZE = 10

    toSubscription = (data) => {
        console.log('subscription', data)
        if ( _.isArray(data)) {
            return {
                result: 0,
                objects: []
            }
        }

        if ( data.jsonapi) {
            const obj = _.isArray(data.data) ? data.data : [data.data]

            return api.success( obj.map(item => ({
                type: item.type,
                uuid: item.id,
                title: item.attributes.title,
                created : item.attributes.created,
                activationDate: item.field_activation_date,
            })), data.links)
        }
        return {
            result: api.NOT_FOUND 
        }
    }

    getSubscription = (userId, {user, pass}) => {
        if ( _.isEmpty(user) || _.isEmpty(pass) || _.isEmpty(userId)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.subscription)}?filter[uid.id][value]=${userId}`
        const headers = api.basicAuth(user, pass, 'vnd.api+json')

        return api.callHttp(url, {
            method: 'get',
            headers,
        }, this.toSubscription)
    }


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