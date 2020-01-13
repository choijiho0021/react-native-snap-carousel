import api from './api'
import _ from 'underscore'
import utils from '../utils'
import {Buffer} from 'buffer'

class AccountAPI {
    re = {
        'field_user': /user\/(\d+)/g
    }

    toAccount = (data) => {
        // REST API json/account/list/{id}로 조회하는 경우
        if ( _.isArray(data) && data.length > 0) {
            return api.success(
                data.map(item => ({
                    nid: utils.stringToNumber( item.nid),
                    uuid: item.uuid,
                    iccid: item.field_iccid,
                    expDate: item.field_expiration_date,
                    balance: utils.stringToNumber(item.field_balance) || 0,
                    simPartnerId: utils.stringToNumber( item.field_ref_sim_partner),
                    actDate: item.field_activation_date,
                    mobile: item.field_mobile,
                    deviceToken: item.field_device_token,
                    simCardName: item.sim_card_name,
                    simCardImage: item.sim_card_image,
                    userAccount: item.field_ref_user_account
                }))
            )
        }

        // REST API node/{nid}로 조회하는 경우 
        if (! _.isEmpty(data._links)) {
            const user = Object.keys( data._links).filter(item => item.endsWith('field_user'))
            console.log( 'account user', user, data._links[user[0]])
            let uid = undefined
            if (! _.isEmpty(user)) {
                const match = this.re.field_user.exec(data._links[user[0]][0].href)
                console.log( 'match', match)
                if (match) uid = match[1] 
            }

            
            return api.success([{
                nid: utils.stringToNumber( data.nid[0].value),
                uuid: data.uuid[0].value,
                iccid: data.field_iccid && data.field_iccid[0].value,
                expDate: data.field_expiration_date && data.field_expiration_date[0].value,
                balance: data.field_balance && utils.stringToNumber(data.field_balance[0].value) || 0,
                actDate: data.field_activation_date &&  data.field_activation_date[0].value,
                mobile: data.field_mobile && data.field_mobile[0].value,
                deviceToken: data.field_device_token && data.field_device_token[0].value,
                simPartnerId: undefined,
                uid 
            }])
        }

        // JSON API로 데이터를 조회한 경우 
        if ( ! _.isEmpty(data.jsonapi) && ! _.isEmpty(data.data)) {
            const obj = _.isArray(data.data) ? data.data : [data.data]
            return api.success( obj.map(item => ({
                nid: utils.stringToNumber( item.attributes.drupal_internal__nid),
                uuid: item.id,
                iccid: item.attributes.field_iccid,
                expDate: item.attributes.field_expiration_date,
                balance: utils.stringToNumber(item.attributes.field_balance) || 0,
                actDate: item.attributes.field_activation_date,
                mobile: item.attributes.field_mobile,
                deviceToken: item.attributes.field_device_token,
                simPartnerId: undefined,
                uid :undefined
            })))
        }

        return api.failure(api.NOT_FOUND)
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

    validateActCode = (iccid, actCode) => {
        if (_.isEmpty(iccid) || _.isEmpty(actCode)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.account)}/${iccid}/${actCode}?_format=json`
        return api.callHttpGet(url, this.toAccount)
    }

    getByUUID = (uuid) => {
        if (_.isEmpty(uuid)) return api.reject( api.INVALID_ARGUMENT, `test uuid:${_.isEmpty(uuid)}`)

        const url = `${api.httpUrl(api.path.jsonapi.account)}/${uuid}`
        return api.callHttpGet(url, this.toAccount)
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
        console.log("url999",url)
        console.log("body999",body)
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