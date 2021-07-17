import {RkbOrder} from '@/submodules/rokebi-utils/api/orderApi';
import {RkbInfo} from '@/submodules/rokebi-utils/api/pageApi';
import {RkbProduct} from '@/submodules/rokebi-utils/api/productApi';
import {AccountAuth} from '@/redux/modules/account';

export type SimpleTextScreenMode = 'text' | 'uri' | 'html';
export type PymMethodScreenMode = 'cart' | 'roaming_product' | 'new_sim';

export type HomeStackParamList = {
  Home: undefined;
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
  SimpleText: {
    key: 'noti' | 'info';
    title: string;
    mode: SimpleTextScreenMode;
    body?: string;
    bodyTitle?: string;
    text?: string;
    rule?: string;
    image?: {
      success?: string;
      failure?: string;
    };
  };
  Contact: undefined;
  ContactBoard: {index: number};
  BoardMsgResp: {key: string; status: 'Closed'};
  Faq: {
    key?: string;
    num?: string;
  };
  Guide: undefined;
  Country: {prodOfCountry: RkbProduct[]};
  Payment: undefined;
  PymMethod: {isPaid: boolean; mode?: PymMethodScreenMode};
  FindAddress: undefined;
  PaymentResult: undefined;
  CodePush: undefined;
  CustomerProfile: undefined;
  AddProfile: undefined;
  PurchaseDetail: {detail: RkbOrder; auth: AccountAuth};
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
  PurchageDetail: undefined;
  Recharge: {mode: string};
  ContactBoard: {index: number};
};
