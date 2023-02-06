import {Currency, CurrencyCode} from '@/redux/api/productApi';
import {PaymentInfo} from '@/redux/api/cartApi';

export const createPaymentInfo = ({
  captured,
  paymentType,
  impId,
  mobile,
  profileId,
  deduct,
  memo,
  digital,
  amount,
  currency_code,
}: {
  captured: boolean;
  paymentType: string;
  impId: string;
  mobile?: string;
  profileId?: string;
  deduct?: number;
  memo?: string;
  digital: boolean;
  amount?: number;
  currency_code?: CurrencyCode;
}) => {
  if (amount && !currency_code) {
    // amount, dlvCost 값이 있는데 currency_code가 없으면 에러 처리한다.
    throw Error('Invalid currency code');
  }

  return {
    captured,
    imp_uid: impId,
    merchant_uid: `${mobile}_${new Date().getTime()}`,
    profile_uuid: profileId,
    amount: amount || 0,
    rokebi_cash: deduct,
    digital,
    memo,
    payment_type: paymentType,
    currency_code,
  } as PaymentInfo;
};

export const createPaymentInfoForRokebiCash = ({
  impId,
  mobile,
  profileId,
  deduct,
  digital,
  memo,
}: {
  impId: string;
  mobile?: string;
  profileId?: string;
  deduct?: Currency;
  digital: boolean;
  memo?: string;
}) =>
  createPaymentInfo({
    impId,
    mobile,
    profileId,
    deduct: deduct?.value,
    currency_code: deduct?.currency,
    digital,
    memo,
    captured: true,
    amount: 0,
    paymentType: 'rokebi_cash',
  });
