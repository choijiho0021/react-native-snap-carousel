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

    toProductDetails = (data) => {
        if ( _.isArray(data)) {
            return api.success(data.map(item => item.body).join())
        }

        return api.failure(api.NOT_FOUND)
    }

    getPageByCategory = (name, abortController = undefined) => {
        if (_.isEmpty(name)) return api.reject( api.INVALID_ARGUMENT, `test name:${_.isEmpty(name)}`)

        const url = `${api.httpUrl(api.path.jsonapi.page)}?filter[field_category.name]=${name}&sort=-changed`
        return api.callHttpGet(url, this.toPage, { abortController })
    }

    getPageByTitle = (title, abortController = undefined) => {
        if (_.isEmpty(title)) return api.reject( api.INVALID_ARGUMENT, `test name:${_.isEmpty(title)}`)

        const url = `${api.httpUrl(api.path.jsonapi.page)}?filter[title]=${title}`
        return api.callHttpGet(url, this.toPage, { abortController })
    }    

    getProductDetails = (abortController = undefined) => {
        const url = `${api.httpUrl(api.path.productDetails)}?_format=json`
        return api.callHttpGet(url, this.toProductDetails, { abortController })
    }    
}

export default new PageAPI()