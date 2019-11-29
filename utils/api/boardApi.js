import api from './api'
import _ from 'underscore'
import i18n from '../i18n'


class BoardAPI {
    PAGE_SIZE = 10

    statusToString = (status) => {
        return (status == 'O') ? i18n.t('board:open') :
            (status == 'C') ? i18n.t('board:closed') :
            (status == 'P') ? i18n.t('board:processing') : status
    }

    toBoard = (data) => {
        if ( _.isArray(data)) {
            return api.success(data)
        }

        if ( ! _.isEmpty(data.jsonapi)) {
            // jsonapi result
            const obj = _.isArray(data.data) ? data.data : [data.data]

            return api.success(obj.map(item => ({
                uuid: item.id,
                title: item.attributes.title || '',
                msg: item.attributes.body && item.attributes.body.value,
                created: item.attributes.created,
                mobile: item.attributes.field_mobile || '',
                userName: item.attributes.field_user_name || '',
                email: item.attributes.field_email || '',
                statusCode: item.attributes.field_issue_status,
                status: this.statusToString(item.attributes.field_issue_status),
            })), data.links)
        }

        return api.failure(api.NOT_FOUND, data.message)
    }

    toComment = (data) => {
        if ( _.isArray(data)) {
            return api.success(data)
        }

        if ( ! _.isEmpty(data.jsonapi)) {
            // jsonapi result
            const obj = _.isArray(data.data) ? data.data : [data.data]

            return api.success(obj.map(item => {
                const userName = data.included && data.included.find(a => a.id == item.relationships.uid.data.id)
                return {
                    uuid: item.id,
                    title: item.attributes.subject || '',
                    body: item.attributes.comment_body.processed.replace( /(<([^>]+)>)/ig, '') || '',
                    created: item.attributes.created,
                    userName: userName && userName.attributes.name
                }
            }))
        }

        return api.failure(api.NOT_FOUND, data.message)
    }

    post = ({title,msg,mobile}, {token}) => {
        if (_.isEmpty(title) || _.isEmpty(msg) || _.isEmpty(token))
            return api.reject( api.INVALID_ARGUMENT, 'empty title or body')

        const url = `${api.httpUrl(api.path.jsonapi.board)}`
        const headers = api.withToken(token, 'vnd.api+json')
        const body = {
            data : {
                type: 'node--contact_board',
                attributes: {
                    title: {value: title},
                    body: {value: msg},
                    field_mobile: {value:mobile},
                }
            }
        }

        return api.callHttp(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }, this.toBoard)
    }

    getByFilter = (filter, {user, pass}) => {
        if ( _.isEmpty(user) || _.isEmpty(pass)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.board)}${filter}`
        const headers = api.basicAuth(user, pass, 'vnd.api+json')

        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toBoard)
    }

    getHistory = ({token}, link) => {
        const url = link || `${api.httpUrl(api.path.jsonapi.board)}?` +
            `fields[node--contact_board]=field_user_name,created,field_mobile,title,body,field_issue_status&` +
            `sort=-created&page[limit]=${this.PAGE_SIZE}`
        const headers = api.withToken(token, 'vnd.api+json')

        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toBoard)
    }

    getComments = (uuid, {token}) => {
        const url = `${api.httpUrl(api.path.jsonapi.comment)}?filter[entity_id.id][value]=${uuid}` +
            `&fields[user--user]=name&include=uid`
        const headers = api.withToken(token, 'vnd.api+json')

        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toComment)

    }

}

export default new BoardAPI()