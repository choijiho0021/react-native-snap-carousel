import {RkbOrder} from '@/submodules/rokebi-utils/api/orderApi';
import {RkbInfo} from '@/submodules/rokebi-utils/api/pageApi';
import {RkbProduct} from '@/submodules/rokebi-utils/api/productApi';
import {BoardMsgStatus} from '@/submodules/rokebi-utils/api/boardApi';

export type SimpleTextScreenMode = 'text' | 'uri' | 'html';
export type PymMethodScreenMode = 'cart' | 'roaming_product' | 'new_sim';
type ContactBoardRouteParam = {index?: number} | undefined;
type FaqRouteParam = {key?: string; num?: string} | undefined;

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
  ContactBoard: ContactBoardRouteParam;
  BoardMsgResp: {uuid: string; status?: BoardMsgStatus};
  BoardMsgAdd: {key: string; status: BoardMsgStatus};
  Faq: FaqRouteParam;
  Guide: undefined;
  Country: {prodOfCountry: RkbProduct[]};
  Payment: undefined;
  PymMethod: {isPaid?: boolean; mode?: PymMethodScreenMode};
  FindAddress: undefined;
  PaymentResult: undefined;
  CodePush: undefined;
  CustomerProfile: undefined;
  AddProfile: undefined;
  PurchaseDetail: {detail: RkbOrder};
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
  ContactBoard: ContactBoardRouteParam;
};
