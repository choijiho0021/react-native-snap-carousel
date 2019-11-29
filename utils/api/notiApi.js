import {
    Alert
} from 'react-native'
import api from './api'
import i18n from '../i18n';
import _ from 'underscore'
import utils from '../utils'



class NotiAPI {
    re = {
        'field_user': /user\/(\d+)/g
    }

    toNoti = (data) => {
        // REST API json/noti/list/{id}로 조회하는 경우
        console.log("data",data)
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
                    isRead:item.isRead
                }))
            )
        }

        // JSON API로 데이터를 조회한 경우 
        if ( ! _.isEmpty(data.jsonapi)) {
            const obj = _.isArray(data.data) ? data.data : [data.data]
            let objects = obj.map((item,idx) => ({
                title:item.attributes.title,
                body:item.attributes.field_body,
                created:item.attributes.created,
                notiType:item.attributes.field_noti_type,
                uuid:item.id,
                // mobile:item.attributes.name,
                isRead:item.attributes.field_isread
            }))
            console.log('Noti list', objects)
            return api.success(objects)
        }

        return api.failure(api.NOT_FOUND)
    }

    // ContentType Account
    getNoti = (mobile) => {
        if (_.isEmpty(mobile)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.noti)}/${mobile}?_format=json`
        console.log("noti url",url)

        return api.callHttpGet(url, this.toNoti)
    }

    update = ( uuid, attr, {token}) => {
        if ( _.isEmpty(uuid) || _.isEmpty(token) || _.isEmpty(attr) ) return api.reject(api.INVALID_ARGUMENT)

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
        if ( _.isEmpty(uuid) || _.isEmpty(auth)) return api.reject( api.INVALID_ARGUMENT)
        const attr = {field_isread: true}

        return this.update(uuid,attr,auth)
    }
}

export default new NotiAPI()