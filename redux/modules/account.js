import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { pender } from 'redux-pender'
import userApi from '../../utils/api/userApi';
import accountApi from '../../utils/api/accountApi';
import _ from 'underscore'
import utils from '../../utils/utils';
import moment from 'moment'
import { batch } from 'react-redux';
import { Platform } from '@unimodules/core';

const SIGN_UP =        'rokebi/account/SIGN_UP'
const UPDATE_ACCOUNT = 'rokebi/account/UPDATE_ACCOUNT'
const RESET_ACCOUNT =  'rokebi/account/RESET_ACCOUNT'
const GET_USER_ID =   'rokebi/account/GET_USER_ID'
const GET_ACCOUNT =   'rokebi/account/GET_ACCOUNT'
const GET_ACCOUNT_BY_UUID =   'rokebi/account/GET_ACCOUNT_BY_UUID'
const ACTIVATE_ACCOUNT =   'rokebi/account/ACTIVATE_ACCOUNT'
export const LOGIN =   'rokebi/account/LOGIN'
const UPLOAD_PICTURE =   'rokebi/account/UPLOAD_PICTURE'
const CHANGE_PICTURE =   'rokebi/account/CHANGE_PICTURE'
const GET_TOKEN = 'rokebi/account/GET_TOKEN'
export const CHANGE_ATTR = 'rokebi/account/CHANGE_ATTR'

export const getToken = createAction(GET_TOKEN, userApi.getToken)
export const updateAccount = createAction(UPDATE_ACCOUNT)
const resetAccount = createAction(RESET_ACCOUNT)
export const signUp = createAction(SIGN_UP)
const logIn = createAction(LOGIN, userApi.logIn)
export const getUserId = createAction(GET_USER_ID, userApi.getByName)
export const getAccount = createAction(GET_ACCOUNT, accountApi.getAccount)
export const getAccountByUUID = createAction(GET_ACCOUNT_BY_UUID, accountApi.getByUUID)
export const activateAccount = createAction(ACTIVATE_ACCOUNT, accountApi.update)
const uploadPicture = createAction(UPLOAD_PICTURE, accountApi.uploadPicture)
const changePicture = createAction(CHANGE_PICTURE, userApi.changePicture)
const changeUserAttr = createAction(CHANGE_ATTR, userApi.update)

export const logout = () => {
  return (dispatch) => {
    utils.removeData( userApi.KEY_ICCID)
    utils.removeData( userApi.KEY_MOBILE)
    utils.removeData( userApi.KEY_PIN)

    batch(() => {
      dispatch(resetAccount())
      // reset 한 후에 token을 다시 읽어 온다.
      dispatch(getToken())
    })
  }
}

export const changeEmail = (mail) => {
  return (dispatch, getState) => {
    const { account } = getState(),
      authObj = auth(account),
      attr = {
        mail, 
        pass: {
          existing: authObj.pass
        }
      }

    return dispatch(changeUserAttr( account.get('userId'), authObj, attr)).then(
      resp => {
        if ( resp.result == 0) {
          return dispatch(updateAccount({email:mail}))
        }

      },
      err => {
        console.log('failed to update email', err)
      }
    )
  }
}

export const changeNotiToken = () => {
  return async (dispatch, getState) => {
    const { account } = getState()
    const fcmToken = Platform.OS == 'android' ? account.get('deviceToken') : ''
    const deviceToken = Platform.OS == 'ios' ? account.get('deviceToken') : ''
    
    const authObj = auth(account),
      attr = {
        field_device_token: deviceToken,
        field_fcm_token: fcmToken
      }

    return dispatch(changeUserAttr( account.get('userId'), authObj, attr)).then(
      resp => {
        if ( resp.result == 0) {
          console.log('Token is updated')
        }
      },
      err => {
        console.log('failed to update noti token', err)
      }
    )
  }
}

export const logInAndGetAccount = (mobile, pin, iccid) => {
  return (dispatch, getState) => {
    return dispatch(logIn(mobile, pin)).then(
      resp => {
        if ( resp.result == 0 && resp.objects.length > 0) {
          const obj = resp.objects[0]

          utils.storeData( userApi.KEY_MOBILE, obj.current_user.name)
          utils.storeData( userApi.KEY_PIN, pin)

          // get ICCID account info
          if ( iccid) {
            dispatch(getAccount(iccid, {token: obj.csrf_token})).then(resp => {
              console.log("resp register",resp)})
          }

          //iccid 산과없이 로그인마다 토큰 업데이트
          return dispatch(getUserId( obj.current_user.name, {token: obj.csrf_token})).then(
            resp => {
              console.log("user resp",resp)
              dispatch(changeNotiToken())
            }
          )
        }
      },
      err => {
        console.log('login failed', err)
      }
    )
  }
}

export const registerMobile = (uuid, mobile) => {
  return (dispatch, getState) => {
    const { account } = getState()
    return dispatch(getAccountByUUID(uuid)).then(
      (resp) => {
        if ( resp.result == 0 && resp.objects.length > 0 ) {
          const accountAttr = {}
          const relation = {}
          const now = moment()

          if ( ! _.isEmpty(mobile) && resp.objects[0].mobile != mobile ) {
            accountAttr.field_mobile = mobile
          }

          if ( _.isEmpty(resp.objects[0].expDate)) {
            accountAttr.field_expiration_date = now.add(1, 'years').format('YYYY-MM-DD')
          }
          
          //activation code는 카드등록시 항상 update
          accountAttr.field_activation_date = now.format()

          relation.field_ref_user_account = {
            data: {
              type: 'user--user',
              id  : account.get('userId')
            }
          }

          console.log('REGISTER', accountAttr, relation, resp.objects[0])

          if ( ! _.isEmpty(accountAttr)) return dispatch(activateAccount(uuid, accountAttr, relation, auth(account))).then(
            resp => {
              if ( resp.result == 0 && resp.objects.length > 0) {
                return dispatch(updateAccount(resp.objects[0]))
              }
            },
            err => {
              console.log('failed to activate account', err)
            }
          )
        }
      },
      err => {
        console.log('failed to get account', err)
      }
    )
  }
}

export const uploadAndChangePicture = (image) => {
  return (dispatch,getState) => {
    const { account } = getState()
    return dispatch(uploadPicture(image, auth(account))).then(
      resp => {
        if (resp.result == 0 && resp.objects.length > 0) {
          return dispatch(changePicture( account.get('userId'), resp.objects[0], auth(account)))
        }
        console.log('Failed to upload picture', resp)
      },
      err => {
        console.log('Failed to upload picture', err)
      })
  }
}

export const auth = (state) => ({
  user: state.get('mobile'),
  pass: state.get('pin'),
  token: state.get('token'),
})

const updateAccountState = (state, payload) => {
    const {expDate, balance, simPartnerId, actDate, userId, simCardImage, simCardName,
      iccid, uuid, nid, uid, mobile, pin, email, token, deviceToken} = payload

    if ( ! _.isEmpty(expDate)) state = state.set('expDate', expDate)
    if ( _.isNumber(balance)) state = state.set('balance', balance)
    if ( _.isNumber(simPartnerId)) state = state.set('simPartnerId', simPartnerId)
    if ( ! _.isEmpty(actDate)) state = state.set('actDate', actDate)
    if ( ! _.isEmpty(userId)) state = state.set('userId', userId)
    if ( ! _.isEmpty(iccid)) state = state.set('iccid', iccid)
    if ( ! _.isEmpty(uuid)) state = state.set('uuid', uuid)
    if ( _.isNumber(nid)) state = state.set('nid', nid)
    if ( _.isNumber(uid)) state = state.set('uid', uid)
    if ( ! _.isEmpty(mobile)) state = state.set('mobile', mobile)
    if ( ! _.isEmpty(pin)) state = state.set('pin', pin)
    if ( ! _.isEmpty(email)) state = state.set('email', email)
    if ( ! _.isEmpty(token)) state = state.set('token', token)
    if ( ! _.isEmpty(deviceToken)) state = state.set('deviceToken', deviceToken)
    if ( ! _.isEmpty(simCardName)) state = state.set('simCardName', simCardName)
    if ( ! _.isEmpty(simCardImage)) state = state.set('simCardImage', simCardImage)

    return state
}

const initialState = Map({
    expDate: undefined,
    balance: undefined,
    email: undefined,
    mobile: undefined,
    token: undefined,
    simPartnerId: undefined,
    actDate: undefined,
    userId: undefined,
    uid: undefined,
    uuid: undefined,
    iccid: undefined,
    nid: undefined,
    pin: undefined,
    loggedIn: false,
    userPicture: undefined,
    userPictureUrl: undefined,
    deviceToken: undefined,
    simCardName: undefined,
    simCardImage: undefined
})

export default handleActions({
  [SIGN_UP] : (state, action) => {
    return state.set('email', action.payload.email)
  },

  [UPDATE_ACCOUNT]: (state, action) => {
    console.log("update dddddd")
    return updateAccountState(state, action.payload)
  },

  [RESET_ACCOUNT]: (state, action) => {
    return initialState
  },

  ... pender({
    type: LOGIN,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        const obj = objects[0]
        return state.set('token', obj.csrf_token)
          .set('mobile', obj.current_user.name)
          .set('uid', obj.current_user.uid)
          .set('pin', obj.pass)
          .set('loggedIn', true)
      }
      return state.set('token', undefined)
        .set('loggedIn', false)
    },
    onFailure: (state, action) => {
      return state.set('token', undefined)
        .set('loggedIn', false)
    }

  }),

  ... pender({
    type: GET_USER_ID,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        return state.set('userId', objects[0].id)
          .set('email', objects[0].mail)
          .set('userPictureUrl', objects[0].userPictureUrl)
      }
      return state
    }
  }),

  ... pender({
    type: GET_ACCOUNT,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        utils.storeData( userApi.KEY_ICCID, objects[0].iccid)
        return updateAccountState(state, objects[0])
      }
      return state
    }
  }),

  ... pender({
    type: UPLOAD_PICTURE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        // update picture file id
        return state.set('userPicture', objects[0])
      }
      return state
    }
  }),

  ... pender({
    type: CHANGE_PICTURE,
    onSuccess: (state, action) => {
      const {result, objects} = action.payload
      if (result == 0 && objects.length > 0) {
        return state.set('userPictureUrl', objects[0].userPictureUrl)
      }
      return state
    }
  }),

  ... pender({
    type: GET_TOKEN,
    onSuccess: (state, action) => {
      return state.set('token', action.payload)
    }
  })
}, initialState)
