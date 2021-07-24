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
}) =>
  ({
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
  } as PaymentResult);

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
  deduct?: number;
  dlvCost: number;
  digital: boolean;
  memo?: string;
}) =>
  createPaymentResult({
    impId,
    mobile,
    profileId,
    deduct,
    dlvCost,
    digital,
    memo,
    success: true,
    amount: 0,
    paymentType: 'rokebi_cash',
  });
