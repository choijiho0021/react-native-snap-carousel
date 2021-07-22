import validate0 from 'validate.js';
import i18n, {i18nEvent} from './i18n';

export type ValidationRule = {
  [x: string]: {
    presence: {message: string};
    length?: {
      minimum: number;
      message: string;
    };
    email?: {
      message: string;
    };
    format?: {
      pattern?: RegExp;
      message: string;
    };
  };
};

let validation: ValidationRule = {};

i18nEvent.on('loaded', () => {
  // do localization related stuff…
  validation = {
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
  console.log('@@@ set validation rule', validation);
});

export type ValidationKey =
  | 'password'
  | 'email'
  | 'actCode'
  | 'pin'
  | 'mobile'
  | 'addrName'
  | 'alias'
  | 'recipient'
  | 'recipientNumber'
  | 'addressLine1'
  | 'addressLine2'
  | 'detailAddr'
  | 'mobileSms';
/*
validate.validators.custom = function(value, options, key, attributes) {
  if ( key == 'actCode' && value != options) return i18n.t('reg:invalidActCode')
}
*/

export type ValidationResult =
  | {
      [x: string]: [string];
    }
  | undefined;

const validate = (
  key: keyof ValidationRule,
  value: string,
  vald?: ValidationRule,
): ValidationResult => {
  const val = {
    [key]: value,
  };
  return validate0(val, vald || {[key]: validation[key]});
};

const validateAll = (
  val: object,
  extraValidation?: ValidationRule,
): ValidationResult => {
  const vald = Object.fromEntries(
    Object.keys(val).map((k) => [
      k,
      validation[k] || (extraValidation ? extraValidation[k] : undefined),
    ]),
  );

  return validate0(val, vald);
};

export default {validate, validateAll};
