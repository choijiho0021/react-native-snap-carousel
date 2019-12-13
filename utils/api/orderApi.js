import _ from 'underscore'
import api from './api'
import utils from '../utils'

class OrderAPI {
    toDeliveryAddress = (data) => {
        console.log('delivery', data)
        if ( _.isArray(data)) {
            return api.success([])
        }

        if ( data.jsonapi) {
            const list = _.isArray(data.data) ? data.data : [data.data]
            return api.success(
                list.map(item => ({
                    uuid: item.id,
                    title: item.attributes.title,
                    details: item.attributes.field_detail_address,
                    jibunAddr: item.attributes.field_jibun_address,
                    mobile: item.attributes.field_mobile,
                    recipient: item.attributes.field_recipient,
                    roadAddr: item.attributes.field_road_address,
                    phone: item.attributes.field_telephone_nuber,
                    zipNo: item.attributes.field_zip,
                }))
            )
        }

        if ( data._links) {
            return api.success(
                [{
                    uuid: data.uuid[0].value,
                    title: data.title[0].value,
                    details: data.field_detail_address[0].value,
                    jibunAddr: data.field_jibun_address[0].value,
                    mobile: data.field_mobile[0].value,
                    recipient: data.field_recipient[0].value,
                    roadAddr: data.field_road_address[0].value,
                    phone: data.field_telephone_nuber[0].value,
                    zipNo: data.field_zip[0].value,
                }]
            )
        }

        return api.failure(api.NOT_FOUND)
    }

    toCustomerProfile = (data) => {
        // JSON API로 데이터를 조회한 경우 
        if ( ! _.isEmpty(data.jsonapi) && ! _.isEmpty(data.data)) {
            const obj = _.isArray(data.data) ? data.data : [data.data]

            const objects = obj.map(item => {
                const {
                    country_code,
                    administrative_area,
                    locality,
                    postal_code,
                    address_line1,
                    address_line2,
                    organization,
                    given_name,
                    family_name,
                } = item.attributes.address

                return {
                    //langcode: 'ko',
                    countryCode : country_code,
                    province: administrative_area,
                    city: locality,
                    zipCode: postal_code,
                    addressLine1: address_line1,
                    addressLine2: address_line2,
                    organization: organization,
                    givenName: given_name,
                    familyName: family_name,
                    alias: item.attributes.field_alias,
                    recipient: item.attributes.field_recipient,
                    recipientNumber : item.attributes.field_recipient_number,
                    isBasicAddr: item.attributes.is_default,
                    uuid: item.id,
                }
            
            })
            return api.success(objects)
        }
        return api.failure(api.NOT_FOUND)        
    }

    getCustomerProfile = ({token}) => {
        if ( _.isEmpty(token)) return api.reject( api.INVALID_ARGUMENT)
        
        const url = `${api.httpUrl(api.path.jsonapi.profile)}`
        const headers = api.withToken(token, 'vnd.api+json')

        return api.callHttp(url, {
            method: 'get',
            headers,
        }, this.toCustomerProfile)
    }

    addCustomerProfile = (profile, defaultProfile, {token}) => {
        if ( _.isEmpty(profile) || _.isEmpty(token) ) return api.reject( api.INVALID_ARGUMENT)
        
        const url = api.httpUrl(api.path.jsonapi.profile)
        const headers = api.withToken(token, 'vnd.api+json')
        const body = {
            data : {
                type: 'profile--customer',
                attributes: {
                    address: {
                        langcode: "ko",
                        country_code: "KR",
                        administrative_area: profile.province,   // 경기도 
                        locality: profile.city,                  // 성남시
                        postal_code: profile.zipCode,
                        address_line1: profile.addressLine1,
                        address_line2: profile.addressLine2 || ' ' || profile.detailAddr,
                        organization: defaultProfile.organization,
                        given_name: defaultProfile.givenName, 
                        family_name: defaultProfile.familyName, 
                    },
                    field_recipient : profile.recipient,
                    field_recipient_number : profile.recipientNumber,
                    field_alias : profile.alias,
                    field_basic_address : profile.isBasicAddr,
                    is_default: profile.isBasicAddr,
                }
            }
        }

        console.log('body', body)

        return api.callHttp(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }, this.toCustomerProfile)
    }

    updateCustomerProfile = ( profile, {userId, token}) => {
        if ( _.isEmpty(profile) || _.isEmpty(token) ) return api.reject(api.INVALID_ARGUMENT)
        const url = `${api.httpUrl(api.path.jsonapi.profile)}/${profile.uuid}`
        const headers = api.withToken(token, 'vnd.api+json', {
            'Accept': 'application/vnd.api+json'
        })
        const body = {
            data : {
                type: 'profile--customer',
                id: profile.uuid,
                attributes: {
                    address: {
                        langcode: "ko",
                        country_code: "KR",
                        administrative_area: profile.province,   // 경기도 
                        locality: profile.city,                  // 성남시
                        postal_code: profile.zipCode,
                        address_line1: profile.addressLine1,
                        address_line2: profile.addressLine2 || ' ' || profile.detailAddr,
                        organization: profile.organization || profile.alias,
                        given_name: profile.givenName || profile.recipient.substring(0,1), //'choi',//profile[0].givenName,
                        family_name: profile.familyName|| profile.recipient.substring(1), //'soojeong', //profile[0].familyName,
                    },
                    field_recipient : profile.recipient,
                    field_recipient_number : profile.recipientNumber,
                    field_alias : profile.alias,
                    field_basic_address : profile.isBasicAddr,
                    is_default: profile.isBasicAddr
                }
            }
        }

        return api.callHttp(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body)
        }, this.toCustomerProfile)
    }

    // profile uuid
    delCustomerProfile = (uuid, {token}) => {
        if ( _.isEmpty(uuid) || _.isEmpty(token) ) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.profile)}/${uuid}`
        const headers = api.withToken(token, 'vnd.api+json')

        return api.callHttp(url, {
            method: 'delete',
            headers,
        }, (resp) => ({
            result: resp.status == '204' ? 0 : api.FAILED
        }), false)

    }

    addDeliveryAddress = (addr, {user, pass}) => {
        if ( _.isEmpty(user) || _.isEmpty(pass) || _.isEmpty(addr)) return api.reject( api.INVALID_ARGUMENT)

        console.log('add ress', addr, user, pass)

        const url = `${api.httpUrl(api.path.jsonapi.addr)}`
        const headers = api.basicAuth(user, pass, 'vnd.api+json', {
            'Accept': 'application/vnd.api+json'
        })
        const body = {
            data : {
                type: 'node--delivery_address',
                attributes: {
                    title: {value: addr.title},
                    field_detail_address : {value: addr.details},
                    field_jibun_address : {value: addr.jibunAddr}, 
                    field_mobile: {value: addr.mobile},
                    field_recipient: {value: addr.recipient},
                    field_road_address: {value: addr.roadAddr},
                    field_telephone_nuber: {value: addr.phone},
                    field_zip: {value: addr.zipNo}
                }
            }
        }

        return api.callHttp(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }, this.toDeliveryAddress)

    }

    delDeliveryAddress = (uuid, {user, pass}) => {
        if ( _.isEmpty(user) || _.isEmpty(pass) || _.isEmpty(uuid)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.addr)}/${uuid}`
        const headers = api.basicAuth(user, pass)

        return api.callHttp(url, {
            method: 'delete',
            headers,
        }, (resp) => ({
            result: resp.status == '204' ? 0 : api.FAILED
        }), false)

    }

    chgDeliveryAddress = (uuid, addr, {user, pass}) => {
        if ( _.isEmpty(user) || _.isEmpty(pass) || _.isEmpty(uuid)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.addr)}/${uuid}`
        const headers = api.basicAuth(user, pass, 'vnd.api+json', {
            'Accept': 'application/vnd.api+json'
        })
        const body = {
            data : {
                type: 'node--delivery_address',
                id : uuid,
                attributes: {
                    title: {value: addr.title},
                    field_detail_address : {value: addr.details},
                    field_jibun_address : {value: addr.jibunAddr}, 
                    field_mobile: {value: addr.mobile},
                    field_recipient: {value: addr.recipient},
                    field_road_address: {value: addr.roadAddr},
                    field_telephone_nuber: {value: addr.phone},
                    field_zip: {value: addr.zipNo}
                }
            }
        }

        return api.callHttp(url, {
            method: 'patch',
            headers,
            body: JSON.stringify(body)
        }, this.toDeliveryAddress)
    }

    toOrder = (data) => {
        if ( _.isArray(data) && data.length > 0) {
            return api.success(
                data.map(item => ({
                    orderId: item.order_number,
                    orderDate: item.placed,
                    totalPrice: utils.stringToNumber( item.total_price__number),
                    orderItems: [{
                        title: item.title,
                        price: utils.stringToNumber( item.item_price)
                    }]
                })).reduce((acc,cur) => {
                    const idx = acc.findIndex(item => item.orderId == cur.orderId)
                    return ( idx < 0) ? acc.concat([cur]) :
                        acc.map(item => {
                            return (item.orderId == cur.orderId) ? {
                                ... item,
                                orderItems: item.orderItems.concat(cur.orderItems)
                            } : item
                        })
                }, []).sort((a,b) => a.orderDate < b.orderDate ? 1 : -1)
            )
        }

        return api.failure( api.NOT_FOUND)
    }

    getOrders = ({user}) => {
        const url = `${api.httpUrl(api.path.order)}/${user}?_format=json`
        const headers = api.headers({})

        return api.callHttp(url, {
            method: 'get',
            headers,
        }, this.toOrder)
    }
}

export default new OrderAPI()