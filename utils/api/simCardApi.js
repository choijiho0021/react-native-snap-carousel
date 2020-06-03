import api from './api'
import _ from 'underscore'
import utils from '../utils';



class SimCardAPI {
    re = /<[^>]*>?/gm

    toSimCard = (data) => {
        if ( _.isArray(data)) {
            return api.success( data.map(item => ({
                key: item.uuid,
                uuid : item.uuid,
                variationId: item.variations && item.variations[0],
                sku: item.sku,
//                    nid: item.nid[0].value,
                name: item.title,
//                    created: item.created[0].value,
//                    desc: item.body[0].processed.replace(this.re, ''),
//                    model: item.model[0].value,
                balance: utils.stringToNumber( item.field_balance),
                price: utils.stringToNumber( item.list_price__number),
                imageUrl: item.field_images
            })))
        }

        return api.failure(api.E_NOT_FOUND)
    }

    toSimPartner = (data) => {
        if ( data.jsonapi) {
            const obj = _.isArray(data.data) ? data.data[0] : data.data,
                attr = obj.attributes
            return api.success(
                [{
                    uuid: obj.id,
                    tid: attr.drupal_internal__tid,
                    name: attr.name,
                    mccmnc: attr.field_mcc_mnc
                }])
        }

        return api.failure(api.E_NOT_FOUND)
    }


    get = () => {
        const url = `${api.httpUrl(api.path.simCard)}?_format=hal_json`
        return api.callHttpGet(url, this.toSimCard)
    }

    getSimPartnerByID = (tid) => {
        if (! _.isNumber(tid)) return api.reject(api.E_INVALID_ARGUMENT, `test tid:${_.isNumber(tid)}`)

        const url = `${api.httpUrl(api.path.jsonapi.simPartner)}?filter[tid]=${tid}`
        return api.callHttpGet(url, this.toSimPartner)
    }

}

export default new SimCardAPI()