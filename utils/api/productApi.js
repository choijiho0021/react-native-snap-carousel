import _ from 'underscore'
import api from './api'
import utils from '../utils'
import country from '../country'
import i18n from '../i18n'

class ProductAPI {

    category = {
        "asia"   : "64",
        "europe" : "69",
        "usaAu" : "65",
        "multi" : "67"
        }

    promoFlag = {
        "53" : i18n.t('hot'),  // 운용자 추천
        "57" : i18n.t('sale')   // 할인 
    }

    toProduct = (data) => {
        if ( _.isArray(data)) {
            return api.success(
                data.map((item,idx) => ({
                    key: item.uuid,
                    uuid: item.uuid,
                    name: item.title,
                    price: utils.stringToNumber(item.price),
                    field_daily: item.field_daily == 'daily',
                    partnerId: item.partner_id,
                    categoryId: item.field_product_categories,
                    days: utils.stringToNumber(item.field_days),
                    variationId: item.variations && item.variations[0],
                    field_description : item.field_description,
                    promoFlag: item.field_special_categories.split(",").map(v => this.promoFlag[ v.trim() ]).filter(v => ! _.isEmpty(v)),
                    sku: item.sku,
                    idx: idx,
                })))
        }

        return api.failure(api.E_NOT_FOUND)
    }

    toLocalOp = (data) => {
        if ( _.isArray(data)) {
            return api.success(
                data.map(item => ({
                    key: item.nid,
                    name: item.title,
                    ccode: item.field_country.sort(),
                    apn: item.field_apn_setting,
                    imageUrl: item.field_image,
                    network: item.field_network,
                    weight: utils.stringToNumber(item.field_weight) || 0,
                    detail: item.body
                })))
        }

        return api.failure(api.E_NOT_FOUND)
    }

    toColumnList(list) {
        const result = []
        for( let elm of list) {
            if ( result.length > 0 && ! result[result.length-1].data[1]) {
                result[result.length-1].data[1] = elm
            }
            else {
                result.push({
                    key: elm[0].uuid,
                    data:[elm, undefined]
                })
            }
        }

        return result
    }

    getTitle(categoryId, localOp) {
        return categoryId == this.category.multi ? localOp.name : country.getName(localOp.ccode)[0];
    }

    getProduct = () => {
        const url = api.httpUrl(`${api.path.prodByCntry}?_format=hal_json`)
        return api.callHttpGet(url, this.toProduct)
    }

    getLocalOp = () => {
        const url = api.httpUrl(`${api.path.localOp}?_format=hal_json`)
        return api.callHttpGet(url, this.toLocalOp)
    }
}

export default new ProductAPI()