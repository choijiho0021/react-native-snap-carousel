import _ from 'underscore'
import api from './api'
import i18n from '../i18n'

class SubscriptionAPI {
    PAGE_SIZE = 10

    code = {
        'A' : 'active',
        'I' : 'inactive',
        'C' : 'canceled',
        'R' : 'reserved',
        'E' : 'expired',
        'U' : 'used'
    }

    getPriority (statusCd) {
        if(statusCd == 'A'){
            return 6
        }
        else if(statusCd == 'R'){
            return 5
        }
        else if(statusCd == 'I'){
            return 4
        }
        else if(statusCd == 'U'){
            return 3
        }
        else if(statusCd == 'E'){
            return 2
        }
        else return 1
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
        // const sortData = [].concat(data.filter(elm => elm.field_status == 'A'))
        //     .concat(data.filter(elm => elm.field_status == 'R'))
        //     .concat(data.filter(elm => elm.field_status == 'I'))
        //     .concat(data.filter(elm => elm.field_status == 'U'))
        //     .concat(data.filter(elm => elm.field_status == 'E'))

        let sortData = data

        //status 우선순위, 구입날짜별로 정렬
        if(data.length > 1) {
            sortData = data.sort((a,b) => {
                if(a.field_status == b.field_status && a.field_purchase_date > b.field_purchase_date){
                    return -1
                }
                else if(this.getPriority(a.field_status) > this.getPriority(b.field_status)) {
                    return -1
                }
                else {
                    return 1
                }
            })
        }

        if ( _.isArray(sortData)) {
            return api.success( sortData.map(item => ({
                key: item.uuid,
                uuid: item.uuid,
                purchaseDate: this.toString(item.field_purchase_date),
                expireDate: this.toString(item.field_expiration_date),
                activationDate: this.toString(item.field_subs_activation_date),
                endDate: this.toString(item.field_subs_expiration_date),
                statusCd: item.field_status,
                status: this.toStatus(item.field_status),
                country: item.field_country,
                prodName: item.title,
                prodId: item.product_uuid,
                nid: item.nid
            })))
        }

        if ( data.jsonapi) {
            const obj = _.isArray(sortData.data) ? sortData.data : [sortData.data]

            return api.success( obj.map(item => 
                console.log('usage item@@@@@', item)
                ({
                key: item.id,
                uuid: item.id,
                purchaseDate: item.field_purchase_date,
                activationDate: item.field_subs_activation_date,
                expireDate: item.field_subs_expiration_date,
                staus: item.field_status
            })), sortData.links)
        }

        return {
            result: api.NOT_FOUND 
        }
    }

    toSubsUpdate = (data) => {
        console.log('subscription update', data)
        if ( _.isArray(data)) {
            return api.success( data.map(item => ({
                key: item.uuid[0].value,
                uuid: item.uuid[0].value,
                statusCd: item.field_status[0].value,
                status: this.toStatus(item.field_status[0].value),
                prodName: item.title[0].value
                })
            ))
        }
        return {
            result: api.NOT_FOUND 
        }
    }

    toSubsUsage = (data) => {
        console.log('subscription usage', data)

        if(data.objects && data.objects.usage) {
            return api.success(data.objects.usage)
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

    updateSubscriptionStatus = (uuid, status, {token}, deact_prod_uuid = []) => {
        if ( _.isEmpty(uuid) || _.isEmpty(status) || _.isEmpty(token) ) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.rokApi.rokebi.subs,'')}/${uuid}?_format=json`
        const headers = api.withToken(token, 'json')
        const body = {
            status : status,
            deact_prod_uuid : _.isEmpty(deact_prod_uuid) ? undefined : deact_prod_uuid}
        
        return api.callHttp(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body)
        }, this.toSubsUpdate)
    }

    //그래프를 그리기 위해서 가져올 데이터
    getSubsUsage = (id, {token}) => {

        if ( _.isEmpty(id) || _.isEmpty(token)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.rokApi.rokebi.usage)}/${id}?_format=json`
        const headers = api.withToken(token)

        return api.callHttp(url, {
            method: 'get',
            headers,
        }, this.toSubsUsage)
    }
}

export default new SubscriptionAPI()