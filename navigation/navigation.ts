import {RkbOrder} from '@/redux/api/orderApi';
import {RkbInfo} from '@/redux/api/pageApi';
import {RkbProduct} from '@/redux/api/productApi';
import {BoardMsgStatus} from '@/redux/api/boardApi';
import {PaymentResult} from '@/redux/models/paymentResult';

export type SimpleTextScreenMode = 'text' | 'uri' | 'html';
export type PymMethodScreenMode = 'cart' | 'roaming_product' | 'new_sim';
type ContactBoardRouteParam = {index?: number} | undefined;
type FaqRouteParam = {key?: string; num?: string} | undefined;

export type PaymentParams = {
  pg: string;
  pay_method: string;
  merchant_uid: string;
  name: string;
  amount: number;
  rokebi_cash: number;
  buyer_tel: string;
  buyer_name: string;
  buyer_email: string;
  escrow: boolean;
  app_scheme: string;
  profile_uuid: string;
  dlvCost: number;
  digital: boolean; // 컨텐츠 - 데이터상품일 경우 true
  memo?: string;
};
type SimpleTextParams = {
  key: 'noti' | 'info' | string;
  title: string;
  mode?: SimpleTextScreenMode;
  body?: string;
  bodyTitle?: string;
  text?: string;
  rule?: string;
  image?: {
    success?: string;
    failure?: string;
  };
};
type PurchaseDetailParams = {detail?: RkbOrder};

export type HomeStackParamList = {
  Home: undefined;
  Tutorial: undefined;
  StoreSearch: undefined;
  Cart: undefined;
  ProductDetail: {title?: string; img?: string; localOpDetails?: string};

  Recharge: undefined;
  RegisterSim: undefined;
  NewSim: undefined;
  Usim: undefined;
  Noti: {
    mode: 'noti' | 'info';
    info?: RkbInfo[];
    title?: string;
  };
  SimpleText: SimpleTextParams;
  Contact: undefined;
  ContactBoard: ContactBoardRouteParam;
  BoardMsgResp: {uuid: string; status?: BoardMsgStatus};
  BoardMsgAdd: {key: string; status: BoardMsgStatus};
  Faq: FaqRouteParam;
  Guide: undefined;
  Country: {prodOfCountry: RkbProduct[]};
  Payment: {params: PaymentParams};
  PymMethod: {isPaid?: boolean; mode?: PymMethodScreenMode};
  FindAddress: undefined;
  PaymentResult: {pymResult: PaymentResult; orderResult: object; mode?: string};
  CodePush: undefined;
  CustomerProfile: undefined;
  AddProfile: undefined;
  PurchaseDetail: PurchaseDetailParams;
  RegisterMobile: undefined;
  Main: undefined;
  Settings: undefined;
  Auth: undefined;
  HeaderTitle: undefined;
  Esim: undefined;
};

export type EsimStackParamList = {
  Esim: undefined;
};

export type MyPageStackParamList = {
  MyPage: undefined;
  Auth: undefined;
  Settings: undefined;
  Recharge: {mode: string};
  ContactBoard: ContactBoardRouteParam;
  PurchaseDetail: PurchaseDetailParams;
  SimpleText: SimpleTextParams;
};
