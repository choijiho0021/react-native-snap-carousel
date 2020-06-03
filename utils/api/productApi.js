import _ from 'underscore'
import api from './api'
import utils from '../utils'
import AppAlert from '../../components/AppAlert'
import country from '../country'

class ProductAPI {

    category = {
        "asia"   : "64",
        "europe" : "69",
        "usaAu" : "65",
        "multi" : "67"
        }

    toProduct = (data) => {
        if ( _.isArray(data)) {
            return {
                result: 0,
                objects: data.map((item,idx) => ({
                    key: item.uuid,
                    uuid: item.uuid,
                    name: item.title,
                    price: utils.stringToNumber(item.price),
                    ccode: item.field_ccode,
                    field_daily: item.field_daily,
                    partnerName: item.partner_name,
                    apn: item.field_apn_setting,
                    network: item.field_network,
                    imageUrl: item.product_image || item.operator_image,
                    category: item.operator_image,
                    categoryId: item.field_product_categories,
                    days: item.field_days,
                    variationId: item.variations && item.variations[0],
                    field_description : item.field_description,
                    body : item.body,
                    sku: item.sku,
                    idx: idx
                }))
                .filter(item => ! _.isEmpty(item.ccode))
                // ccode가 NULL인 상품은 제외한다.
            }
        }
        return {
            result: Api.E_NOT_FOUND 
        }
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

    getTitle(prod) {
        return prod.categoryId == this.category.multi ? prod.partnerName : country.getName(prod.ccode)[0];
    }

    getProduct = () => {
        const url = api.httpUrl(api.path.product)
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                return this.toProduct(json)
            }).catch(err => {
                AppAlert.error( err)
            })
    }

    getProductByCntry = (category = 'all', ccode = "all") => {
        const url = api.httpUrl(`${api.path.prodByCntry}/${category}/${ccode}?_format=hal_json`)
        return api.callHttpGet(url, this.toProduct)
    }
}

export default new ProductAPI()