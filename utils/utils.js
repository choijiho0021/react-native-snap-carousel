import i18n from './i18n'
import { 
    Alert, 
} from 'react-native'
import Constants from 'expo-constants';
import _ from 'underscore'

let UniAsyncStorage
if ( Constants.appOwnership === 'expo') {
    UniAsyncStorage = require('react-native').AsyncStorage
}
else {
    UniAsyncStorage = require('@react-native-community/async-storage').default
}

class Utils {

    numberToCommaString = (number) => {
        if (number && number.toString()) {
            return  number.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }

        return number;
    }

    dlvCost = (totalPrice) => {
        return (totalPrice >= 10000) ? 0 : (totalPrice > 0) ? 3000 : 0
    }

    // 숫자만 입력 받기
    stringToNumber = (value) => {

        if (typeof(value) == 'number') return value
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
        return price ? `${this.numberToCommaString( this.stringToNumber( price))} ${i18n.t('won')}` : ''
    }

    pricePerDay = (price, days) => {
        return this.price(price) + (days ? ` / ${days} ${i18n.t('day')}` : '')
    }

    toPhoneNumber = (str = "") => {
        if ( _.isEmpty(str)) return ""

        const num = str.replace(/-/g, '')
        return this.toSegmentedString(num, [0,3,7,11])
    }

    toICCID = (str, delimiter='-') => {
        return this.toSegmentedString(str, [0,5,10,15,20], delimiter)
    }

    toSegmentedString = (str, seg, delimiter='-') => {
        return _.isArray(seg) && (typeof str === 'string') ? 
            seg.map((v,i,a) => str.substring(v, a[i+1])).filter(n => n.length > 0 ).join(delimiter) : str
    }

    htmlToString = (html) => {
        return html && html.replace(/<br>/ig, '\n\n').replace(/<\/p>/ig, '\n\n').replace(/<[^>]*>/ig, '').replace(/\&nbsp;/ig, ' ')
    }

    storeData = async (key, value) => {
        try {
            await UniAsyncStorage.setItem( key, value)
        } catch (error) {
            // Error saving data
            Alert.alert( i18n.t('error'), error, [ {text: 'OK'} ]);
        }
    }

    retrieveData = async (key) => {
        try {
            return await UniAsyncStorage.getItem(key)
        } catch (error) {
            // Error retrieving data
            Alert.alert( i18n.t('error'), error, [ {text: 'OK'} ]);
        }
    }
    
    removeData = async (key) => {
        try {
            return await UniAsyncStorage.removeItem(key)
        } catch (error) {
            // Error retrieving data
            Alert.alert( i18n.t('error'), error, [ {text: 'OK'} ]);
        }
    }

}

export default new Utils()