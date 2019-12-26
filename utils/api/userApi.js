import api from './api'
import _ from 'underscore'
const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking')

function clearCookies () {
    RCTNetworking.clearCookies((cleared) => {
        console.log('Cookies cleared, had cookies=' + cleared.toString())
    })
}

class UserAPI {
    KEY_ICCID = 'account.iccid'
    KEY_MOBILE = 'account.mobile'
    KEY_PIN = 'account.pin'

    toUser = (data) => {
        if ( _.isArray(data)) {
            return api.success(data)
        }

        if ( ! _.isEmpty(data.uid)) {
            return api.success(
                [{
                    uid: data.uid[0].value,
                    uuid: data.uuid[0].value
                }])
        }

        if ( ! _.isEmpty(data.jsonapi)) {
            // jsonapi result
            const obj = _.isArray(data.data) ? data.data : [data.data]
            const userPictureUrl = _.isArray(data.included) &&
                data.included.length > 0 &&
                data.included[0].attributes &&
                data.included[0].attributes.uri &&
                data.included[0].attributes.uri.url

            return api.success(obj.map(item => ({
                ... item.attributes,
                id: item.id,
                userPictureUrl
            })))
        }

        return api.failure(api.NOT_FOUND, data.message)
    }

    toLogin = (pass, login) => {
        if ( login.current_user) {
            return api.success([{ ...login, pass }])
        }

        return api.failure( api.NOT_FOUND, login.message)
    }

    getUserByName = (name) => {
        if (_.isEmpty(name)) return api.reject( api.INVALID_ARGUMENT, `test name:${_.isEmpty(name)}`)

        const url = `${api.httpUrl(api.path.userByName)}/${name}?_format=json`
        return api.callHttpGet(url, this.toUser)
    }

    getUserByEmail = (mail) => {
        if (_.isEmpty(mail)) return api.reject( api.INVALID_ARGUMENT, `test name:${_.isEmpty(mail)}`)

        const url = `${api.httpUrl(api.path.userByEmail)}/${mail}?_format=json`
        return api.callHttpGet(url, this.toUser)
    }

    // not used
    findUser = (name, email, {user, pass}) => {
        if (_.isEmpty(user)) return api.reject( api.INVALID_ARGUMENT, `test user:${_.isEmpty(user)}`)

        //const url = `${API.httpUrl(API.path.userList)}/${user}?_format=json`
        const url = `${api.httpUrl(api.path.jsonapi.user)}?`+
            `filter[agroup][group][conjunction]=OR&` +
            `filter[name][condition][path]=name&` +
            `filter[name][condition][value]=${name}&` +
            `filter[name][condition][memberOf]=agroup&` +
            `filter[email][condition][path]=mail&` +
            `filter[email][condition][value]=${email}&` +
            `filter[email][condition][memberOf]=agroup` 

        const headers = api.basicAuth(user, pass) 

        return api.callHttp(url, {
            method: 'GET',
            headers
        },this.toUser)
    }

    getToken = (token) => {
        if ( token) {
            return new Promise.resolve(token)
        }

        clearCookies()

        const url = api.httpUrl(api.path.token, '')
        return api.callHttpGet(url)
    }

    // API for User
    // not used
    /*
    signUp = ({user, pass}) => {

        console.log('signUp', user, pass)

        if ( _.isEmpty(user) || _.isEmpty(pass)) 
            return api.reject( api.INVALID_ARGUMENT, `user or pass`)

        return this.getToken().then( token => {
            console.log('token', token)
            const url = `${api.httpUrl(api.path.userRegister)}?_format=hal_json`
            const headers = api.headers({
                "X-CSRF-Token": token,
            })
            const body = {
                _links: {
                    type : {
                        href : api.httpUrl('rest/type/user/user')
                    }
                },
                name:{value: user},
                pass:{value: pass},
                mail:{value: `${user}@rokebi.com`},
            }

            return api.callHttp(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            }, this.toUser)
        })
    }
    */

    resetPw = ({user, pass}) => {

        console.log('reset pw', user, pass)

        if ( _.isEmpty(user) || _.isEmpty(pass)) 
            return api.reject( api.INVALID_ARGUMENT, `test user:${_.isEmpty(user)} pass:${_.isEmpty(pass)}`)

        const url = `${api.httpUrl(api.path.resetPw)}?_format=hal_json`
        const body = {
            name:{value: user},
            pass:{value: pass},
        }

        return api.callHttp(url, {
            method: 'POST',
            body: JSON.stringify(body)
        }, this.toUser)
    }

    // not used
    /*
    signUp2 = ({token, user, pass, email}) => {
        if (_.isEmpty(email) || _.isEmpty(token) || _.isEmpty(user) || _.isEmpty(pass)) 
            return api.reject( api.INVALID_ARGUMENT,
                `test email:${_.isEmpty(email)} token:${_.isEmpty(token)} user:${_.isEmpty(user)} pass:${_.isEmpty(pass)}`)

        const url = `${api.httpUrl(api.path.jsonapi.user)}`
        const headers = api.basicAuth(user, pass, 'vnd.api+json')
        const body = {
            data : {
                type: 'user--user',
                attributes: {
                    name: 'test1'
                }
            }
        }

        return api.callHttp(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }, this.toUser)
    }
    */

    logIn = (user, pass) => {
        if ( _.isEmpty(user) || _.isEmpty(pass)) return api.reject( api.INVALID_ARGUMENT)

        clearCookies()

        return this.getToken().then( token => {

            const url = `${api.httpUrl(api.path.login)}?_format=json`
            const headers = api.headers({
                "X-CSRF-Token": token
            })
            const body = {
                "name": user,
                "pass": pass
            }

            return api.callHttp(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            }, this.toLogin.bind(this, pass))
        })
    }    

    getByFilter = (filter, {token}) => {
        if ( _.isEmpty(token)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.user)}${filter}&include=user_picture` +
            `&fields[user--user]=name,mail&fields[file--file]=uri`
        const headers = api.withToken(token, 'vnd.api+json')

        return api.callHttp(url, {
            method: 'GET',
            headers
        }, this.toUser)
    }

    getByUUID = (uuid, auth) => {
        if ( _.isEmpty(uuid) || _.isEmpty(auth)) return api.reject( api.INVALID_ARGUMENT)
        return this.getByFilter( `/${uuid}`, auth)
    }

    getByUid = (uid, auth) => {
        if ( ( ! _.isNumber(uid) && _.isEmpty(uid)) || _.isEmpty(auth)) return api.reject( api.INVALID_ARGUMENT)
        return this.getByFilter(`?filter[uid][value]=${uid}`, auth)
    }

    getByName = (name, auth) => {
        if ( _.isEmpty(name) || _.isEmpty(auth)) return api.reject( api.INVALID_ARGUMENT)
        return this.getByFilter(`?filter[name][value]=${name}`, auth)
    }

    getByMail = (mail, auth) => {
        if ( _.isEmpty(mail) || _.isEmpty(auth)) return api.reject( api.INVALID_ARGUMENT)
        return this.getByFilter(`?filter[mail][value]=${mail}`, auth)
    }
    
    update = (uuid, {token}, attr) => {
        if ( _.isEmpty(token)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.user, '')}/${uuid}`
        const headers = api.withToken(token, 'vnd.api+json')
        const body = {
            data: {
                type: 'user--user',
                id: uuid,
                attributes: attr
            }
        }

        return api.callHttp(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body)
        }, this.toUser)

    }


    delete = ({uid, token, user, pass}) => {
        if ( _.isEmpty(user) || _.isEmpty(pass) || _.isEmpty(uid) || _.isEmpty(token)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.user)}/${uid}?_format=hal_json`
        const headers = api.basicAuth(user, pass, 'hal+json', {
            "X-CSRF-Token": token
        }) 

        return api.callHttp(url, {
            method: 'DELETE',
            headers,
        }, (resp) => ({
            result: resp.status == '204' ? 0 : api.FAILED
        }), {isJson: false})
    }

    changePicture = ( userId, userPicture, {user, pass, token}) => {
        if ( _.isEmpty(user) || _.isEmpty(pass) || _.isEmpty(token) || 
            _.isEmpty(userId) || _.isEmpty(userPicture)) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.httpUrl(api.path.jsonapi.user, 'en')}/${userId}?include=user_picture`
        const headers = api.basicAuth(user, pass, 'vnd.api+json', {
            "X-CSRF-Token": token,
            'Accept': 'application/vnd.api+json'
        })
        const body = {
            data: {
                type: 'user--user',
                id: userId,
                relationships: {
                    user_picture: {
                        data: {
                            type: 'file--file',
                            id: userPicture.uuid,
                            meta: {
                                width: userPicture.width,
                                height: userPicture.height
                            }
                        }
                    }
                }
            }
        }

        return api.callHttp(url, {
            method: 'patch',
            headers,
            body: JSON.stringify(body)
        }, this.toUser)
    }

    sendSms = ({ user }) => {
        if ( _.isEmpty(user) ) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.rokHttpUrl(api.path.rokApi.auth.verify)}`,
            headers = api.basicAuth(undefined, undefined, 'json'),
            body = {
                mobile: user
            }

        return api.callHttp(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }, (data = {}) => {
            if ( _.size(data.result) > 0 && data.result.code === 0) {
                return api.success();
            }
            else {
                return api.failure(api.FAILED, undefined, (data.result || {}).error);
            }
        })
    }

    confirmSmsCode = ({ user, pass }) => {
        if ( _.isEmpty(user) || _.isEmpty(pass) ) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.rokHttpUrl(api.path.rokApi.auth.confirm)}`,
            headers = api.basicAuth(undefined, undefined, 'json'),
            body = {
                mobile: user,
                pin: pass
            }

        return api.callHttp(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }, (data = {}) => {
            if ( _.size(data.result) > 0 && data.result.code === 0) {
                return api.success( data.id );
            }
            else {
                return api.failure(api.FAILED, undefined, (data.result || {}).error);
            }
        })
    }

    signUp = ({ user, pass, email, mktgOptIn }) => {
        if ( _.isEmpty(user) || _.isEmpty(pass) ) return api.reject( api.INVALID_ARGUMENT)

        const url = `${api.rokHttpUrl(api.path.rokApi.user.create)}`,
        headers = api.basicAuth(undefined, undefined, 'json'),
        body = {
            mobile: user,
            pin: pass,
            email,
            mktgOptIn
        }

        return api.callHttp(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }, (data = {}) => {
            if ( _.size(data.result) > 0 && data.result.code === 0) {
                return api.success( data.id );
            }
            else {
                return api.failure(api.FAILED, undefined, (data.result || {}).error);
            }
        })
    }
}

export default new UserAPI()