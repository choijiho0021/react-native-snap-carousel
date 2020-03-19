import getEnvVars from '../../environment'
const { apiUrl, rokApiUrl, scheme } = getEnvVars();
import {Buffer} from 'buffer'
import _ from 'underscore'
import i18n from '../i18n'
//import fetch from 'cross-fetch'

class Api {
    NOT_FOUND             = -1000
    FAILED                = -1001
    INVALID_ARGUMENT      = -1002
    API_FAILED            = -1003

    API_STATUS_INIT    = 0
    API_STATUS_TRYING  = 1
    API_STATUS_DONE    = 2
    API_STATUS_FAIL    = 3

    path = {
        jsonapi : {
            product: 'jsonapi/node/product',
            account: 'jsonapi/node/account',
            recharge: 'jsonapi/node/recharge',
            simPartner: 'jsonapi/taxonomy_term/bootstrap_sim_partner',
            user: 'jsonapi/user/user',
            board: 'jsonapi/node/contact_board',
            comment: 'jsonapi/comment/comment',
            profile: 'jsonapi/profile/customer',
            addr: 'jsonapi',
            subscription: 'jsonapi/node/subscription',
            payment: 'jsonapi/node/payment',
            noti: 'jsonapi/node/notification',
            page: 'jsonapi/node/page',
        },
        account: 'json/account/list',
        accountOfUser: 'json/account/ofuser',
        noti: 'json/noti/list',
        prodByCntry: 'json/product/ccode',
        token: 'rest/session/token',
        userRegister: 'user/register',
        login: 'user/login',
        user: 'user',
        node: 'node',
        userByName: 'json/user/name',
        userByEmail: 'json/user/email',
        featured: 'json/featured/list',

        recharge: 'rokebi/rch',
        resetPw: 'rokebi/user/pw',
        regMobile: 'rokebi/reg',

        simCard: 'json/smc/list',
        cart: 'cart',
        order: 'json/orders',
        uploadFile: 'file/upload',
        board: 'json/contactboard',
        subscription: 'json/subs',
        profile: 'json/profile',

        commerce: {
            payment: 'commerce/payment',
            order: 'commerce/order',
        },

        rokApi: {
            auth: {
                verify: 'api/v1/auth/verify/sms',
                confirm: 'api/v1/auth/verify/sms/confirm',
                email: 'api/v1/auth/verify/email/confirm'
            },
            user: {
                create: 'api/v1/auth/user'
            },
            noti: {
                alimtalk: 'api/v1/noti/msg/alimtalk',
                log: 'api/v1/noti/log'
            },
            rokebi: {
                subs: 'rokebi/subs'
            }
        }
    }

    httpUrl = (path, lang = i18n.lang) => {
        return (lang == '') ? `${scheme}://${apiUrl}/${path}` : `${scheme}://${apiUrl}/${lang}/${path}` 
    }

    httpImageUrl = (path) => {
        return `${scheme}://${apiUrl}/${path}` 
    }

    addrApiUrl = () => {
        return `${scheme}://www.juso.go.kr/addrlink/addrLinkApi.do`
    }

    rokHttpUrl = ( path ) => {
        return `${scheme}://${rokApiUrl}/${path}`
    }

    queryString(obj) {
        return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&')
    }

    success( objects, links=[]) {
        return {
            result : 0,
            objects,
            links
        }
    }

    failure( code, status, message) {
        return {
            result : code,
            status,
            message,
        }
    }

    headers(header, contentType = 'hal+json') {
        return new Headers({
            "Content-Type": `application/${contentType}`,
            ... header,
        })
    }

    reject( code, status, message) {
        return Promise.reject( this.failure(code, status, message))
    }

    withToken( token, contentType = 'hal+json', header = {}) {
        const hdr = {
            "X-CSRF-Token": token,
            "Content-Type": `application/${contentType}`,
            ... header
        }

        return new Headers(hdr)
    }

    basicAuth( user, pass, contentType = 'hal+json', header = {}) {
        const hdr ={
            "Content-Type": `application/${contentType}`,
            ... header
        }

        if ( user && pass) {
            hdr.Authorization = "Basic " + Buffer.from(user + ":" + pass).toString('base64')
        }

        return new Headers(hdr)
    }

    callHttpGet(url, callback, option = { isJson:true, abortController:undefined}) {
        return this.callHttp( url, { method: 'GET'}, callback, option)
    }

    callHttp(url, param, callback, option = { isJson:true, abortController:undefined}) {
        const config = {
            ... param,
            credentials: 'same-origin' 
            //mode: 'no-cors',
        }

        if ( option.abortController) config.signal = option.abortController.signal
        if ( typeof option.isJson === 'undefined') option.isJson = true

        console.log('call HTTP', url, config)

        return fetch(url, config).then(response => {
            console.log('result url:', url, response.status, response.ok)
            if ( option.abortController && option.abortController.signal.aborted) {
                return this.failure(this.FAILED, '499', 'cancelled')
            }

            if ( response.ok) {
                if ( _.isFunction(callback)) {
                    if ( response.status != 204 && option.isJson) {
                        return response.json().then(json => {
                            console.log('response:', JSON.stringify(json))
                            return callback(json)
                        }).catch(err => {
                            return this.failure( this.FAILED, response.status, 'Failed to decode json:' + err.message)
                        })
                    }

                    return callback(response)
                }
                return response.text()
            }
            if ( option.isJson) {
                response.json().then(json => {
                    console.log('response:', JSON.stringify(json))
                }).catch(err => {
                    return this.failure( this.FAILED, response.status, 'Failed to decode json:' + err.message)
                })
            }
            return this.failure(this.FAILED, response.status, response.statusText)
        }).catch(err => {
            console.log('API failed', err)
            return this.failure(this.API_FAILED, '498', 'API failed')
        })
    }

}

export default new Api()