
import { Map } from 'immutable'
import i18n from '../utils/i18n'

const Toast = {
    NOT_LOADED  : 1,
    NOT_UPDATED : 2,

    messageMap: () => Map({
        [Toast.NOT_LOADED]   : i18n.t('toast:failedToLoad'),
        [Toast.NOT_UPDATED]  : i18n.t('toast:failedToUpdate')
    }),

    mapToMessage: (idx) => {
        if ( idx && Toast.messageMap().has(idx.toString()) ) {
            return Toast.messageMap().get(idx.toString())
        }

        return Toast.messageMap().get(Toast.NOT_LOADED)
    }
}


export { Toast }
