import api from './api'
import _ from 'underscore'

class NotiAPI {
    re = {
        'field_user': /user\/(\d+)/g
    }

    toNoti = (data) => {
        // REST API json/noti/list/{id}로 조회하는 경우
        if ( data && data.length > 0) {
            return api.success(
                data.map((item,idx) => ({
                    key:idx+ '',
                    title:item.title,
                    body:item.body,
                    created:item.created,
                    notiType:item.noti_type,
                    uuid:item.uuid,
                    mobile:item.name,
                    isRead:item.isRead,
                    format:item.field_format == 'T' ? 'text' : 'html',
                    summary:item.summary
                }))
            )
        }

        // JSON API로 데이터를 조회한 경우 
        if ( ! _.isEmpty(data.jsonapi)) {
            const obj = _.isArray(data.data) ? data.data : [data.data]
            let objects = obj.map((item,idx) => ({
                title:item.attributes.title,
                body:item.attributes.body,
                created:item.attributes.created,
                notiType:item.attributes.field_noti_type,
                uuid:item.id,
                // mobile:item.attributes.name,
                isRead:item.attributes.field_isread,
                format:item.attributes.field_format
            }))
            console.log('Noti list', objects)
            return api.success(objects)
        }

        return api.failure(Api.E_NOT_FOUND)
    }

    // ContentType Account
    getNoti = (mobile) => {
        if (_.isEmpty(mobile)) return api.reject( Api.E_INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.noti)}/${mobile}?_format=json`
        console.log("noti url",url)

        return api.callHttpGet(url, this.toNoti)
    }

    update = ( uuid, attr, {token}) => {
        if ( _.isEmpty(uuid) || _.isEmpty(token) || _.isEmpty(attr) ) return api.reject(Api.E_INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.noti)}/${uuid}`
        const headers = api.withToken(token, 'vnd.api+json')
        const body = {
            data: {
                type: 'node--notification',
                id: uuid,
                attributes: attr
            }
        }

        return api.callHttp(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body)
        }, this.toNoti)
    }

    read = (uuid,auth) => {
        if ( _.isEmpty(uuid) || _.isEmpty(auth)) return api.reject( Api.E_INVALID_ARGUMENT)
        const attr = {field_isread: true}

        return this.update(uuid,attr,auth)
    }

    sendAlimTalk = (mobile, abortController) => {
        if ( _.isEmpty(mobile) ) return api.reject( Api.E_INVALID_ARGUMENT)

        const url = `${api.rokHttpUrl(api.path.rokApi.noti.alimtalk)}`,
        headers = api.basicAuth(undefined, undefined, 'json'),
        body = {
            mobile,
            tmplId: 'alimtalk_test'
        }

        return api.callHttp(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }, (data = {}) => {
            if ( _.size(data.result) > 0 && data.result.code === 0) {
                return api.success();
            }
            else {
                return api.failure(api.FAILED, undefined, (data.result || {}).error);
            }
        }, {abortController})
    }

    sendLog = (mobile, message) => {
        if ( _.isEmpty(mobile) ) return api.reject( Api.E_INVALID_ARGUMENT)

        const url = `${api.rokHttpUrl(api.path.rokApi.noti.log)}`,
        headers = api.basicAuth(undefined, undefined, 'json'),
        body = {
            mobile,
            message
        }

        return api.callHttp(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }, (data = {}) => {
            if ( _.size(data.result) > 0 && data.result.code === 0) {
                return api.success();
            }
            else {
                return api.failure(api.FAILED, undefined, (data.result || {}).error);
            }
        })
    }
}

export default new NotiAPI()