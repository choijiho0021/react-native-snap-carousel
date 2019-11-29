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
                    imageUrl : item.field_images
                }))
            }
        }
        return {
            result: api.NOT_FOUND 
        }
    }

    getPromotion = () => {
        const url = `${api.httpUrl(api.path.featured)}?_format=hal_json`
        return api.callHttpGet(url, this.toPromotion)
    }
}

export default new PromotionAPI()