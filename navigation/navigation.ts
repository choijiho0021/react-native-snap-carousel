import {RkbOrder} from '@/submodules/rokebi-utils/api/orderApi';
import {RkbInfo} from '@/submodules/rokebi-utils/api/pageApi';
import {RkbProduct} from '@/submodules/rokebi-utils/api/productApi';
import {AccountAuth} from '@/redux/modules/account';

export type HomeStackParamList = {
  Home: undefined;
  StoreSearch: undefined;
  Cart: undefined;
  ProductDetail: undefined;

  Recharge: undefined;
  RegisterSim: undefined;
  NewSim: undefined;
  Usim: undefined;
  Noti: {
    mode: 'noti' | 'info';
    info?: RkbInfo[];
    title?: string;
  };
  SimpleText: {
    key: string;
    title: string;
    mode: 'noti' | 'info';
    body?: string;
    bodyTitle?: string;
    text?: string;
  };
  Contact: undefined;
  ContactBoard: undefined;
  BoardMsgResp: {key: string; status: 'Closed'};
  Faq: undefined;
  Guide: undefined;
  Country: {prodOfCountry: RkbProduct[]};
  Payment: undefined;
  PymMethod: undefined;
  FindAddress: undefined;
  PaymentResult: undefined;
  CodePush: undefined;
  CustomerProfile: undefined;
  AddProfile: undefined;
  PurchaseDetail: {detail: RkbOrder; auth: AccountAuth};
};
