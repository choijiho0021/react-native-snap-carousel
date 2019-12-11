import api from './api'
import _ from 'underscore'
import i18n from '../i18n'
import {Buffer} from 'buffer'


class BoardAPI {
    PAGE_SIZE = 10

    statusToString = (status) => {
        return (status == 'O') ? i18n.t('board:open') :
            (status == 'C') ? i18n.t('board:closed') :
            (status == 'P') ? i18n.t('board:processing') : status
    }

    toBoard = (data) => {
        if ( _.isArray(data)) {
            return api.success(data.map(item => ({
                key: item.uuid[0].value,
                uuid: item.uuid[0].value,
                title: item.title[0].value || '',
                msg: item.body[0].processed,
                created: item.created[0].value,
                mobile: item.field_mobile[0].value || '',
                pin: item.field_pin[0].value,
                statusCode: item.field_issue_status[0].value,
                status: this.statusToString(item.field_issue_status[0].value),
            })))
        }

        if ( ! _.isEmpty(data.jsonapi)) {
            // jsonapi result
            const obj = _.isArray(data.data) ? data.data : [data.data]

            return api.success(obj.map(item => ({
                key: item.id,
                uuid: item.id,
                title: item.attributes.title || '',
                msg: item.attributes.body && item.attributes.body.value,
                created: item.attributes.created,
                mobile: item.attributes.field_mobile || '',
                pin: item.attributes.field_pin,
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

    toFile = (data) => {
        if ( ! _.isEmpty(data._links)) {
            return api.success(
                [{
                    fid: data.fid[0].value,
                    uuid: data.uuid[0].value
                }]
            )
        }
        return api.failure(api.NOT_FOUND)
    }

    // anonymous user 도 post 할 수 있으므로, token 값을 확인하지 않는다. 
    post = ({title,msg,mobile,pin}, images, {token}) => {
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
                    field_mobile: {value:mobile.replace(/-/g, '')},
                    field_pin: {value:pin}
                },
            }
        }

        if ( images && images.length > 0) {
            body.data.relationships = {
                field_images: {
                    data: images.map(item => 
                        ({
                            type: "file--file",
                            id: item.uuid,
                            meta: {
                                width: item.width,
                                height: item.height
                            }
                        })
                    )
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

    /* JSON API를 사용해서 구현했으나, uid에 의한 filtering이 안되서 제거함 
    getHistory = ({token}, link) => {
        const url = link || `${api.httpUrl(api.path.jsonapi.board)}?` +
            `fields[node--contact_board]=field_user_name,created,field_mobile,title,body,field_issue_status,field_pin&` +
            `sort=-created&page[limit]=${this.PAGE_SIZE}`
        const headers = api.withToken(token, 'vnd.api+json')

        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toBoard)
    }
    */

    getIssueList = ( uid = "0", {token}, link) => {
        const url = link || `${api.httpUrl(api.path.board)}/${uid}?_format=hal_json`
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


    uploadAttachment = ( images, {user, token}) => {
        if ( ! _.isArray(images) || images.length == 0) return Promise.resolve([])

        const url = `${api.httpUrl(api.path.uploadFile, '')}/node/contact_board/field_images?_format=hal_json`

        const posts = images.map( image => {
            const headers = api.withToken( token, 'octet-stream', {
                "Content-Disposition":`file;filename="${user}_contact.${image.mime.replace('image/', '')}"`
            })

            return () => api.callHttp(url, {
                method: 'POST',
                headers,
                body: Buffer.from( image.data, 'base64')
            }, this.toFile)
        })

        return posts.reduce((p, post) => 
            p.then( result => post().then(Array.prototype.concat.bind(result))), Promise.resolve([]))
    }

}

export default new BoardAPI()