import _ from 'underscore'
import api from './api'
import utils from '../utils'
import AppAlert from '../../components/AppAlert'

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
                objects: data.map(item => ({
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
                    sku: item.sku
                }))
                .filter(item => ! _.isEmpty(item.ccode))
                // ccode가 NULL인 상품은 제외한다.
            }
        }
        return {
            result: api.NOT_FOUND 
        }
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