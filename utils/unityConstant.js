import i18n from './i18n'
import _ from 'underscore'

class UnityConstant {
    constructor() {
    }

    method(){

       var method = [
            [
                {
                key: 'html5_inicis',
                title: i18n.t('pym:ccard')
                },
                {
                key: 'danal',
                title: i18n.t('pym:mobile')
                }
            ],
            [
                {
                key: 'kakaopay',
                title: i18n.t('pym:kakao')
                },
                {
                key: 'payco',
                title: i18n.t('pym:payco')
                },
            ]
            // [
            //     {
            //         key: 'html5_inicis',
            //         title: i18n.t('pym:ccard')
            //     },
            //     {
            //         key: 'danal',
            //         title: i18n.t('pym:mobile')
            //     },
            //     {
            //         key: 'kakaopay',
            //         title: i18n.t('pym:kakao')
            //     },
            //     {
            //         key: 'payco',
            //         title: i18n.t('pym:payco')
            //     },
            // ],
        ]
        return method
        
    }

}

export default new UnityConstant()