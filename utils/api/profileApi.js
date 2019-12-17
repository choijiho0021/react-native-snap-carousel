import _ from 'underscore'
import api from './api'

class ProfileAPI {
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
                        address_line2: profile.addressLine2 + ' ' + profile.detailAddr,
                        organization: defaultProfile.organization,
                        given_name: defaultProfile.givenName || profile.recipient, 
                        family_name: defaultProfile.familyName || profile.recipient, 
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

    updateCustomerProfile = ( profile, { token}) => {
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

}

export default new ProfileAPI()