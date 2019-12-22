import api from './api'
import _ from 'underscore'

class PageAPI {
    KEY_CONTRACT = 'Contract'

    toPage = (data) => {
        if ( _.isArray(data)) {
            return api.success(data)
        }

        if ( ! _.isEmpty(data.jsonapi)) {
            // jsonapi result
            const obj = _.isArray(data.data) ? data.data : [data.data]
            return api.success(obj.map(item => ({
                key: item.id,
                uuid: item.id,
                title: item.attributes.title,
                body: item.attributes.body.processed,
                created: item.attributes.created,
            })))
        }

        return api.failure(api.NOT_FOUND, data.message)
    }

    getPageByCategory = (name) => {
        if (_.isEmpty(name)) return api.reject( api.INVALID_ARGUMENT, `test name:${_.isEmpty(name)}`)

        const url = `${api.httpUrl(api.path.jsonapi.page)}?filter[field_category.name]=${name}`
        return api.callHttpGet(url, this.toPage)
    }
}

export default new PageAPI()