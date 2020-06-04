import _ from 'underscore'
import api from './api'

class PromotionAPI {
    toPromotion = (data) => {
        if ( _.isArray(data)) {
            return {
                result: 0,
                objects: data.map(item => ({
                    uuid: item.uuid,
                    title: item.title,
                    imageUrl : item.field_image,
                    product_uuid : item.field_product_uuid,   // product variation id
                    notice: item.field_ref_content ? {
                        title: item.field_notice_title,
                        body: item.field_notice_body 
                    } : null 
                }))
            }
        }
        return {
            result: api.NOT_FOUND 
        }
    }

    getPromotion = () => {
        const url = `${api.httpUrl(api.path.promotion)}?_format=hal_json`
        console.log("aaaaa",url)
        return api.callHttpGet(url, this.toPromotion)
    }
}

export default new PromotionAPI()