import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {RkbOrder} from '@/redux/api/orderApi';
import {RkbInfo} from '@/redux/api/pageApi';
import {RkbProduct} from '@/redux/api/productApi';
import {BoardMsgStatus} from '@/redux/api/boardApi';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {PurchaseItem} from '@/redux/models/purchaseItem';

export type SimpleTextScreenMode = 'text' | 'uri' | 'html' | 'noti';
export type PymMethodScreenMode =
  | 'cart'
  | 'roaming_product'
  | 'new_sim'
  | 'recharge';
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
  profile_uuid?: string;
  dlvCost: number;
  digital: boolean; // 컨텐츠 - 데이터상품일 경우 true
  memo?: string;

  isPaid?: boolean;
  mode?: string;
};

type SimpleTextParams = {
  key: 'noti' | 'info' | string;
  title: string;
  mode?: SimpleTextScreenMode;
  body?: string;
  bodyTitle?: string;
  text?: string;
  rule?: Record<string, string>;
  nid?: number;
  image?: {
    success?: string;
    failure?: string;
  };
};
type PurchaseDetailParams = {detail?: RkbOrder};

type TutorialParams = {popUp: () => void};

export type HomeStackParamList = {
  Home: undefined;
  Tutorial: TutorialParams;
  StoreSearch: undefined;
  Store: undefined;
  Cart: undefined;
  ProductDetail: {
    title?: string;
    img?: string;
    item?: PurchaseItem;
    uuid?: string;
    localOpDetails?: string;
    partnerId?: string;
    desc?: Record<string, string>;
  };
  ProductDetailOp: {
    title: string;
    desc1: string;
    desc2: string;
    apn: string;
  };
  RegisterSim: {back: string; title: string};
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
  UserGuide: undefined;
  BoardMsgResp: {uuid: string; status?: BoardMsgStatus};
  BoardMsgAdd: {key: string; status: BoardMsgStatus};
  Faq: FaqRouteParam;
  Guide: undefined;
  Country: {partner: string[]};
  Payment: PaymentParams;
  PymMethod: {isPaid?: boolean; pymPrice?: number; mode?: PymMethodScreenMode};
  FindAddress: undefined;
  PaymentResult: {pymResult: boolean; mode?: string};
  CodePush: undefined;
  CustomerProfile: undefined;
  AddProfile: undefined;
  PurchaseDetail: PurchaseDetailParams;
  RegisterMobile: {screen: string};
  Main: undefined;
  Settings: undefined;
  Auth: {screen: string};
  HeaderTitle: undefined;
  Esim: undefined;
  SubsDetail: {detail?: RkbSubscription};

  MyPage: undefined;
  Recharge: {mode: string};
  Invite: undefined;
  GiftGuide: undefined;

  Gift: {item: RkbSubscription};
};

export const navigate = (
  navigation: NavigationProp<any>,
  route: RouteProp<ParamListBase, string>,
  returnTab: string,
  {
    tab,
    screen,
    params,
    closeKey,
  }: {tab?: string; screen: string; params?: object; closeKey?: string},
) => {
  navigation.navigate(tab || returnTab, {
    screen,
    params: {
      ...params,
      returnRoute: {
        tab: returnTab,
        screen: route.name,
      },
    },
  });
};

export const goBack = (
  navigation: NavigationProp<any>,
  route: RouteProp<ParamListBase, string>,
) => {
  navigation.goBack();
  if (route.params?.returnRoute) {
    const {tab, screen, params = {}} = route.params?.returnRoute;
    if (tab) {
      navigation.navigate(tab, {
        screen,
        params: {
          ...params,
          fromRoute: route.name,
        },
      });
    }
  }
};
