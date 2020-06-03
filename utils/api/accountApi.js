import api from './api'
import _ from 'underscore'
import utils from '../utils'
import {Buffer} from 'buffer'

class AccountAPI {
    re = {
        'field_user': /user\/(\d+)/g
    }

    E_NOT_FOUND =           -1001
    E_ACT_CODE_MISMATCH =   -1002
    E_INVALID_STATUS =      -1003
    E_STATUS_EXPIRED =      -1004
    E_MISSING_ARGUMENTS =   -1005


    toAccount = (data) => {
        // REST API json/account/list/{id}로 조회하는 경우
        if ( _.isArray(data) && data.length > 0) {
            return api.success(
                data.map(item => ({
                    nid: utils.stringToNumber( item.nid),
                    uuid: item.uuid,
                    iccid: item.field_iccid,
                    status: item.field_status,
                    expDate: item.field_expiration_date,
                    balance: utils.stringToNumber(item.field_balance) || 0,
                    simPartnerId: utils.stringToNumber( item.field_ref_sim_partner),
                    actDate: item.field_activation_date,
                    firstActDate: item.field_first_activation_date,
                    mobile: item.field_mobile,
                    deviceToken: item.field_device_token,
                    simCardName: item.sim_card_name,
                    simCardImage: item.sim_card_image,
                    userAccount: item.field_ref_user_account
                }))
            )
        }

        // REST API node/{nid}로 조회하는 경우 
        if (! _.isEmpty(data._links) || ! _.isEmpty(data.nid)) {
            return api.success([{
                nid: utils.stringToNumber( data.nid[0].value),
                uuid: data.uuid[0].value,
                iccid: data.title && data.title[0].value,
                status: data.field_status && data.field_status[0].value,
                expDate: data.field_expiration_date && data.field_expiration_date[0].value,
                balance: data.field_balance && utils.stringToNumber(data.field_balance[0].value) || 0,
                actDate: data.field_activation_date &&  data.field_activation_date[0].value,
                firstActDate: data.field_first_activation_date && data.field_first_activation_date[0].value,
                mobile: data.field_mobile && data.field_mobile[0].value,
                deviceToken: data.field_device_token && data.field_device_token[0].value,
                simPartnerId: undefined,
            }])
        }

        // JSON API로 데이터를 조회한 경우 
        if ( ! _.isEmpty(data.jsonapi) && ! _.isEmpty(data.data)) {
            const obj = _.isArray(data.data) ? data.data : [data.data]
            return api.success( obj.map(item => ({
                nid: utils.stringToNumber( item.attributes.drupal_internal__nid),
                uuid: item.id,
                iccid: item.title,
                status: item.field_status,
                expDate: item.attributes.field_expiration_date,
                balance: utils.stringToNumber(item.attributes.field_balance) || 0,
                actDate: item.attributes.field_activation_date,
                firstActDate: item.attributes.field_first_activation_date,
                mobile: item.attributes.field_mobile,
                deviceToken: item.attributes.field_device_token,
                simPartnerId: undefined,
                uid :undefined
            })))
        }

        return api.failure(data.result || api.NOT_FOUND, 200, data.desc || '')
    }

    toFile = (data) => {
        if ( ! _.isEmpty(data._links)) {
            return api.success(
                [{
                    fid: data.fid[0].value,
                    uuid: data.uuid[0].value
                }]
            )
        }
        return api.failure(api.NOT_FOUND)
    }

    // ContentType Account
    getAccount = (iccid, {token}) => {
        if (_.isEmpty(iccid) || _.isEmpty(token)) return api.reject( api.INVALID_ARGUMENT, `iccid:${iccid}, token:${token}`)

        const url = `${api.httpUrl(api.path.account)}/${iccid}?_format=json`
        const headers = api.withToken(token)
        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toAccount)
    }

    validateActCode = (iccid, actCode, {token}) => {
        if (_.isEmpty(iccid) || _.isEmpty(actCode)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.account)}/${iccid}/${actCode}?_format=json`
        const headers = api.withToken(token)
        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toAccount)
    }

    getByUUID = (uuid) => {
        if (_.isEmpty(uuid)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.account)}/${uuid}`
        return api.callHttpGet(url, this.toAccount)
    }

    getByUser = (mobile) => {
        if (_.isEmpty(mobile)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.accountOfUser)}/${mobile}?_format=json`
        return api.callHttpGet(url, this.toAccount)
    }

    registerMobile = (iccid, code, mobile, {token}) => {
        if (_.isEmpty(iccid) || _.isEmpty(code) || _.isEmpty(mobile)) return api.reject( api.INVALID_ARGUMENT)

        const url = api.httpUrl(api.path.regMobile)
        const headers = api.withToken(token, 'json', {
            'Accept': 'application/json'
        })
        return api.callHttp(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({ iccid, code, mobile})
        }, this.toAccount)
    }

    // Update User of ContentType Account
    update = ( uuid, attr, relation, {token}) => {
        if ( _.isEmpty(uuid) || _.isEmpty(token) || _.isEmpty(attr) ) return api.reject(api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.account)}/${uuid}`
        const headers = api.withToken(token, 'vnd.api+json', {
            'Accept': 'application/vnd.api+json'
        })
        const body = {
            data: {
                type: 'node--account',
                id: uuid,
                attributes: attr,
                relationships: relation
            }
        }
        return api.callHttp(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body)
        }, this.toAccount)
    }


    uploadPicture = ( image, {user, pass, token}) => {
        if ( _.isEmpty(user) || _.isEmpty(pass) || _.isEmpty(token)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.uploadFile, '')}/user/user/user_picture?_format=hal_json`
        const headers = api.headers({
            "X-CSRF-Token": token,
            "Content-Disposition":`file;filename="${user}.${image.mime.replace('image/', '')}"`
        }, 'octet-stream') 

        return api.callHttp(url, {
            method: 'POST',
            headers,
            body: Buffer.from( image.data, 'base64')
        }, this.toFile)
    // getProfile = (userId, {user, pass}) => {
    //     if ( _.isEmpty(userId)) return api.reject( api.INVALID_ARGUMENT)

    //     const url = `${api.httpUrl(api.path.jsonapi.user)}/${userId}/customer_profiles`
    //     const headers = api.basicAuth(user, pass, 'vnd.api+json')

    //     return api.callHttp(url, {
    //         method: 'GET',
    //         headers
    //     }, this.toAccount)
        
    }
}

export default new AccountAPI()