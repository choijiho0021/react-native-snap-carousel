import i18n from './i18n'
import _ from 'underscore'
import AppAlert from '../components/AppAlert';
import moment from 'moment-with-locales-es6'
import * as ToastActions from '../redux/modules/toast'

let UniAsyncStorage = require('@react-native-community/async-storage').default

class Utils {
    constructor() {
        this.dateTimeFmt = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})*$/
        moment.locale(i18n.locale)
    }

    numberToCommaString = (number) => {
        if (number && number.toString()) {
            return  number.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }

        return number;
    }

    dlvCost = (totalPrice) => {
        return (30000 > totalPrice && totalPrice > 0) ? 3000 : 0
    }

    // 숫자만 입력 받기
    stringToNumber = (value) => {
        if (typeof(value) === 'undefined' ) return undefined
        if (typeof(value) === 'number') return value
        if (typeof(value) !== 'string' || _.isEmpty(value)) return undefined

        // const num = value.replace(/[^0-9.]/g, '');
        const num = parseFloat(value.replace(/[^0-9.]/g, ''));
        if (!this.isExist(num)) {
            return undefined
        }

        if ( value.trim().startsWith("-")) return Number(- num)
        return Number(num);
    }

    isExist = (value) => {
        return value !== undefined && value !== null && ! isNaN(value)
    }

    price = (price) => {
        const num = _.isNumber(price) ? price : _.isString(price) ? this.stringToNumber(price) : undefined
        return _.isUndefined(num) ? '' : `${this.numberToCommaString( num)} ${i18n.t('won')}` 
    }

    pricePerDay = (price, days) => {
        return this.price(price) + (days ? ` / ${days} ${i18n.t('day')}` : '')
    }

    toPhoneNumber = (str = "") => {
        if ( _.isEmpty(str) || typeof str !== 'string') return ""

        const num = str.replace(/-/g, '')

        if(num.length == 7){
            return this.toSegmentedString(num, [0,3,7])
        }else if(num.length == 8){
            return this.toSegmentedString(num, [0,4,8])
        }else{
            return this.toSegmentedString(num, [0,3,7,11])
        }

    }

    toICCID = (str, delimiter='-') => {
        return this.toSegmentedString(str, [0,5,10,15,20], delimiter)
    }

    toSegmentedString = (str, seg, delimiter='-') => {
        return _.isArray(seg) && (typeof str === 'string') ? 
            seg.map((v,i,a) => str.substring(v, a[i+1])).filter(n => n.length > 0 ).join(delimiter) : str
    }

    //html5: <br> == <br/>, &lt;br/&gt; == <br/>
    htmlToString = (html) => {
        return html && html.replace(/<br>/ig, '\n\n')
            .replace(/<br\/>/ig, '\n\n')
            .replace(/&lt;br\/&gt;/ig, '\n\n')
            .replace(/&amp;lt;br\/&amp;gt;/ig, '\n\n')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#039;/g, "'")
            .replace(/<\/p>/ig, '\n\n')
            .replace(/<[^>]*>/ig, '')
            .replace(/\&nbsp;/ig, ' ')
    }

    toDateString = (str, fmt = 'LLL') => {
        if ( typeof str === 'string' ) {
            // m[1] == undefined 이면 date 정보 (yyyy-mm-dd) 형식이고, 
            // m[1]이 정의되면, timezone 정보가 없는 경우이므로 UTC timezone flag 'Z'를 추가해서 처리한다.
            const m = str.match(this.dateTimeFmt)
            if ( m && m[1]) str = str + 'Z'
            return moment(str).format(fmt)
        }

        return ''
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

    //두 배열을 비교, 중복된 값을 가진 배열을 리턴하는 함수
    compareArr = (arr1, arr2) => {
        var duplicatedArr = [];
        arr1.map(elm => {
            if (arr2.includes(elm)) {
                duplicatedArr.push(elm)
            }
        })   
        return duplicatedArr
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