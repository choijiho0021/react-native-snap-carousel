import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {RkbOrder} from '@/redux/api/orderApi';
import {RkbInfo} from '@/redux/api/pageApi';
import {BoardMsgStatus} from '@/redux/api/boardApi';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {RkbProduct} from '@/redux/api/productApi';
import {RkbReceipt} from '@/screens/ReceiptScreen';
import {GuideOption} from '@/screens/UserGuideScreen/GuideHomeScreen';
import {GuideRegion} from '@/screens/UserGuideScreen/GuideSelectRegionScreen';

export type SimpleTextScreenMode = 'text' | 'uri' | 'html' | 'noti';
export type PymMethodScreenMode =
  | 'cart'
  | 'roaming_product'
  | 'new_sim'
  | 'recharge';
type ContactBoardRouteParam = {index?: number} | undefined;
type EventBoardRouteParam = {index?: number; title?: string} | undefined;
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
  dlvCost?: number;
  digital: boolean; // 컨텐츠 - 데이터상품일 경우 true
  memo?: string;

  isPaid?: boolean;
  mode?: string;
  card?: string;
  paymentRule?: Record<string, string>;
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

export type HomeStackParamList = {
  Home: undefined;
  Tutorial: {stack: string; screen: string};
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
  EventBoard: EventBoardRouteParam;
  UserGuide: undefined;
  BoardMsgResp: {uuid: string; status?: BoardMsgStatus; isEvent?: boolean};
  BoardMsgAdd: {key: string; status: BoardMsgStatus};
  Faq: FaqRouteParam;
  Guide: undefined;
  Country: {partner: string[]};
  Payment: PaymentParams;
  PaymentGateway: PaymentParams;
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
  Esim: {clickPromotion?: boolean};

  MyPage: undefined;
  Recharge: {mode: string};
  Invite: undefined;
  GiftGuide: undefined;

  Gift: {mainSubs: RkbSubscription};
  ChargeHistory: {
    mainSubs: RkbSubscription;
    chargedSubs: RkbSubscription[];
    onPressUsage: (subs: RkbSubscription) => Promise<{usage: any; status: any}>;
    chargeablePeriod: string;
    isChargeable: boolean;
  };
  ChargeDetail: {
    data: RkbProduct;
    chargeablePeriod: string;
    prodName?: string;
    subsIccid?: string;
  };
  Charge: {
    mainSubs: RkbSubscription;
    chargeablePeriod: string;
  };
  Receipt: {
    order: RkbOrder;
    receipt: RkbReceipt;
  };
  RedirectHK: {
    iccid: string;
    orderNo: string;
    uuid: string;
    imsi: string;
  };
  SelectCard: {};
  GuideHome: {
    guideOption: GuideOption;
    region: GuideRegion;
  };
};

export const navigate = (
  navigation: NavigationProp<any>,
  route: RouteProp<ParamListBase, string>,
  returnTab: string,
  {tab, screen, params}: {tab?: string; screen: string; params?: object},
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
