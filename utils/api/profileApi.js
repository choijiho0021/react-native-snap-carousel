import _ from 'underscore'
import api from './api'

class ProfileAPI {
    toCustomerProfile = (data) => {
        // JSON API로 데이터를 조회한 경우 
        if ( ! _.isEmpty(data.jsonapi) && ! _.isUndefined(data.data)) {
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
                    detailAddr: item.field_detail_address,
                    organization: organization,
                    givenName: given_name,
                    familyName: family_name,
                    alias: item.attributes.field_alias,
                    recipient: item.attributes.field_recipient,
                    recipientNumber : item.attributes.field_recipient_number,
                    isBasicAddr: item.attributes.is_default,
                    detailAddr: item.attributes.field_detail_address,
                    uuid: item.id,
                }
            
            })
            console.log('obj', obj)
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

        return this.addOrUpdate(url, profile, defaultProfile, 'post', token)
    }

    addOrUpdate = (url, profile, defaultProfile = {}, method, token) => {
        if ( _.isEmpty(url) || _.isEmpty(profile) || _.isEmpty(method) || _.isEmpty(token) ) return api.reject(api.INVALID_ARGUMENT)

        console.log('profile add or update', profile)
        const headers = 
        method=='patch'?
        api.withToken(token, 'vnd.api+json', {
            'Accept': 'application/vnd.api+json'
        }):api.withToken(token, 'vnd.api+json')
        const body = {
            data : {
                type: 'profile--customer',
                id: method == 'patch' ? profile.uuid : undefined, // 업로드할 경우에만 필요
                attributes: {
                    address: {
                        langcode: "ko",
                        country_code: "KR",
                        administrative_area: profile.province,   // 경기도 
                        locality: profile.city,                  // 성남시
                        postal_code: profile.zipCode,
                        address_line1: profile.addressLine1,
                        address_line2: profile.addressLine2,
                        organization: defaultProfile.organization ||profile.organization || profile.alias,
                        given_name: defaultProfile.givenName || profile.givenName || profile.recipient, //.substring(0,1), //'choi',//profile[0].givenName,
                        family_name: defaultProfile.familyName || profile.familyName|| profile.recipient//.substring(1), //'soojeong', //profile[0].familyName,
                    },
                    field_recipient : profile.recipient,
                    field_recipient_number : profile.recipientNumber,
                    field_alias : profile.alias,
                    field_detail_address : profile.detailAddr,
                    field_selected_address : profile.isBasicAddr,
                    is_default: profile.isBasicAddr
                }
            }
        }

        return api.callHttp(url, {
            method: method,
            headers,
            body: JSON.stringify(body)
        }, this.toCustomerProfile)
    }
    updateCustomerProfile = ( profile, {token}) => {
        const url = `${api.httpUrl(api.path.jsonapi.profile)}/${profile.uuid}`
        return this.addOrUpdate( url, profile, {}, 'patch', token)

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