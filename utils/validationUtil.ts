import validate0 from 'validate.js';
import _ from 'underscore';
import i18n from './i18n';

const validation = {
  password: {
    presence: {
      message: '^Please enter a password',
    },
    length: {
      minimum: 5,
      message: '^Your password must be at least 5 characters',
    },
  },
  email: {
    presence: {
      message: i18n.t('reg:noEmail'),
    },
    email: {
      message: i18n.t('reg:invalidEmail'),
    },
  },
  actCode: {
    presence: {
      message: i18n.t('reg:noActCode'),
    },
    format: {
      pattern: /^\d{4}$/g,
      message: i18n.t('reg:invalidActCode'),
    },
  },
  pin: {
    presence: {
      message: i18n.t('reg:noActCode'),
    },
    format: {
      pattern: /^\d{4}$/,
      message: i18n.t('reg:invalidActCode'),
    },
  },
  mobile: {
    presence: {
      message: i18n.t('reg:noMobile'),
    },
    format: {
      pattern: /^\d{4}-\d{4}$|^\d{3}-\d{4}-\d{4}$/,
      message: i18n.t('reg:invalidMobile'),
    },
  },
  addrName: {
    presence: {
      message: i18n.t('purchase:noAddrName'),
    },
    length: {
      minimum: 2,
      message: i18n.t('purchase:invalidAddrName'),
    },
  },
  // profile
  alias: {
    // presence: true,
    presence: {
      message: i18n.t('addr:noAlias'),
    },
    length: {
      minimum: 2,
      message: i18n.t('addr:invalidAlias'),
    },
  },
  recipient: {
    presence: {
      message: i18n.t('addr:noRecipient'),
    },
    length: {
      minimum: 2,
      message: i18n.t('addr:invalidRecipient'),
    },
  },
  recipientNumber: {
    presence: {
      message: i18n.t('addr:noTelephone'),
    },
    length: {
      minimum: 8,
      message: i18n.t('addr:invalidTelephone'),
    },
  },
  addressLine1: {
    presence: {
      message: i18n.t('addr:noAddress'),
    },
    length: {
      minimum: 2,
      message: i18n.t('addr:invalidAddress'),
    },
  },
  addressLine2: {
    presence: {
      message: i18n.t('addr:noAddress'),
    },
    length: {
      minimum: 2,
      message: i18n.t('addr:invalidAddress'),
    },
  },
  detailAddr: {
    presence: {
      message: i18n.t('addr:noDetails'),
    },
    length: {
      minimum: 2,
      message: i18n.t('addr:invalidDetails'),
    },
  },
  mobileSms: {
    presence: {
      message: i18n.t('reg:noMobile'),
    },
    format: {
      pattern: /^01(?:0|1|[6-9])\d{8}$/,
      message: i18n.t('reg:invalidMobile'),
    },
  },
};

/*
validate.validators.custom = function(value, options, key, attributes) {
  if ( key == 'actCode' && value != options) return i18n.t('reg:invalidActCode')
}
*/

type ValidationRule = typeof validation;
const validate = (
  key: keyof ValidationRule,
  value: string,
  vald?: ValidationRule,
) => {
  const val = {
    [key]: value,
  };
  return validate0(val, vald || {[key]: validation[key]});
};

const validateAll = (val: object, extraValidation?: ValidationRule) => {
  if (!_.isEmpty(val)) {
    Object.keys(val).forEach((key) => {
      if (extraValidation && _.isEmpty(extraValidation[key]))
        extraValidation[key] = validation[key];
    });
  }
  return validate0(val, extraValidation);
};

export default {validate, validateAll};
