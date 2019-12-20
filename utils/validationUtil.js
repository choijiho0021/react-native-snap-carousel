import validate from 'validate.js'
import i18n from './i18n'
import _ from 'underscore'

class ValidationUtil {
    validation = {
        password: {
            presence: {
                message: '^Please enter a password'
            },
            length: {
                minimum: 5,
                message: '^Your password must be at least 5 characters'
            }
        },
        email: {
            presence: {
                message: i18n.t('reg:noEmail')
            },
            email: {
                message: i18n.t('reg:invalidEmail')
            }
        },
        actCode: {
            presence: {
                message: i18n.t('reg:noActCode')
            },
            format: {
                pattern: /^\d{4}$/g,
                message: i18n.t('reg:invalidActCode')
            }
        },
        pin: {
            presence: {
                message: i18n.t('reg:noActCode')
            },
            format: {
                pattern: /^\d{4}$/,
                message: i18n.t('reg:invalidActCode')
            }
        },
        mobile: {
            presence: {
                message: i18n.t('reg:noMobile')
            },
            format: {
                pattern: /^\d{4}-\d{4}$|^\d{3}-\d{4}-\d{4}$/,
                message: i18n.t('reg:invalidMobile')
            }
        },
        addrName: {
            presence: {
                message: i18n.t('purchase:noAddrName')
            },
            length: {
                minimum: 2,
                message: i18n.t('purchase:invalidAddrName')
            }
        },
        // profile
        alias: {
            // presence: true,
            presence: {
                message: i18n.t('addr:noAlias')
            },
            length: {
                minimum: 2,
                message: i18n.t('purchase:invalidAddrName')
            }
        },
        recipient: {
            presence: {
                message: i18n.t('addr:noRecipient')
            },
            length: {
                minimum: 2,
                message: i18n.t('purchase:invalidAddrName')
            }
        },
        recipientNumber: {
            presence: {
                message: i18n.t('addr:noTelepehone')
            },
            length: {
                minimum: 7,
                message: i18n.t('purchase:invalidAddrName')
            }
        },
        addressLine1: {
            presence: {
                message: i18n.t('addr:noAddress')
            },
            length: {
                minimum: 2,
                message: i18n.t('purchase:invalidAddrName')
            }
        },
        addressLine2: {
            presence: {
                message: i18n.t('addr:noAddress')
            },
            length: {
                minimum: 2,
                message: i18n.t('purchase:invalidAddrName')
            }
        },
        detailAddr: {
            presence: {
                message: i18n.t('addr:noDetails')
            },
            length: {
                minimum: 2,
                message: i18n.t('purchase:invalidAddrName')
            }
        },              
    }

    /*
validate.validators.custom = function(value, options, key, attributes) {
  if ( key == 'actCode' && value != options) return i18n.t('reg:invalidActCode')
}
*/
    validate = (key, value, validation) => {
        const val = {
            [key] : value
        }
        return validate(val, validation || { [key]: this.validation[key]})
    }    
    
    validateAll = (val, extraValidation={}) => {
        if ( ! _.isEmpty(val)) {
            Object.keys(val).forEach( key => {
                if (_.isEmpty(extraValidation[key])) extraValidation[key] = this.validation[key]
            })
        }
        return validate(val, extraValidation)
    }
}

export default new ValidationUtil()