import i18n from './i18n'
import _ from 'underscore'
import AppAlert from '../components/AppAlert';
import moment from 'moment-with-locales-es6'
import * as ToastActions from '../redux/modules/toast'
import { UtilsBase } from 'Rokebi/submodules/rokebi-utils'

let UniAsyncStorage = require('@react-native-community/async-storage').default

class Utils extends UtilsBase {
    constructor(value)
    {
        super(value);
    }

    storeData = async (key, value) => {
        try {
            await UniAsyncStorage.setItem( key, value)
        } catch (error) {
            AppAlert.error( i18n.t('util:storeDataFailed') + error)
        }
    }

    retrieveData = async (key) => {
        try {
            return await UniAsyncStorage.getItem(key)
        } catch (error) {
            AppAlert.error( i18n.t('util:retrieveDataFailed') + error)
        }
    }
    
    removeData = async (key) => {
        try {
            return await UniAsyncStorage.removeItem(key)
        } catch (error) {
            AppAlert.error( i18n.t('util:removeDataFailed') + error)
        }
    }

    reflectWithToast = (action, toastType) => (...args) => {
        return (dispatch, getState) => { 
          return dispatch(action(...args)).then(
            resp => {
              if (resp.result !== 0) {
                dispatch(ToastActions.push(toastType))
              }
              return resp
            },
            err => {
              dispatch(ToastActions.push(toastType))
              return err
            }
          )
        }
      }
}

export default new Utils()