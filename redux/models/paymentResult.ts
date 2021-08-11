import {Currency, CurrencyCode} from '@/redux/api/productApi';

export type PaymentResult = {
  success: boolean;
  imp_uid: string;
  merchant_uid: string;
  profile_uuid?: string;
  amount: number;
  rokebi_cash: number;
  dlvCost: number;
  digital: boolean;
  memo?: string;
  payment_type: string;
  currency_code: CurrencyCode;
};

export const createPaymentResult = ({
  success,
  paymentType,
  impId,
  mobile,
  profileId,
  deduct,
  memo,
  dlvCost,
  digital,
  amount,
  currency_code,
}: {
  success: boolean;
  paymentType: string;
  impId: string;
  mobile?: string;
  profileId?: string;
  deduct?: number;
  memo?: string;
  dlvCost: number;
  digital: boolean;
  amount?: number;
  currency_code?: CurrencyCode;
}) => {
  if ((amount || dlvCost) && !currency_code) {
    // amount, dlvCost 값이 있는데 currency_code가 없으면 에러 처리한다.
    throw Error('Invalid currency code');
  }

  return {
    success,
    imp_uid: impId,
    merchant_uid: `mid_${mobile}_${new Date().getTime()}`,
    profile_uuid: profileId,
    amount: amount || 0,
    rokebi_cash: deduct,
    dlvCost,
    digital,
    memo,
    payment_type: paymentType,
    currency_code,
  } as PaymentResult;
};

export const createPaymentResultForRokebiCash = ({
  impId,
  mobile,
  profileId,
  deduct,
  dlvCost,
  digital,
  memo,
}: {
  impId: string;
  mobile?: string;
  profileId?: string;
  deduct?: Currency;
  dlvCost: Currency;
  digital: boolean;
  memo?: string;
}) =>
  createPaymentResult({
    impId,
    mobile,
    profileId,
    deduct: deduct?.value,
    dlvCost: dlvCost?.value,
    currency_code: deduct?.currency,
    digital,
    memo,
    success: true,
    amount: 0,
    paymentType: 'rokebi_cash',
  });
