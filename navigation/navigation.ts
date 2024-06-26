import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {Moment} from 'moment';
import {ViewStyle} from 'react-native';
import {RkbOrder} from '@/redux/api/orderApi';
import {RkbInfo} from '@/redux/api/pageApi';
import {BoardMsgStatus} from '@/redux/api/boardApi';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import {
  Currency,
  ProdInfo,
  RkbAddOnProd,
  RkbProduct,
} from '@/redux/api/productApi';
import {RkbReceipt} from '@/screens/ReceiptScreen';
import {GuideOption} from '@/screens/UserGuideScreen/GuideHomeScreen';
import {GuideRegion} from '@/screens/UserGuideScreen/GuideSelectRegionScreen';
import {RkbEventBoard} from '@/redux/api/eventBoardApi';
import {PaymentRule} from '@/redux/modules/product';
import {Fortune} from '@/redux/modules/account';
import {DailyProdFilterList} from '@/components/DailyProdFilter';
import {SocialAuthInfoKind} from '@/components/SocialLogin';

export type SimpleTextScreenMode = 'text' | 'uri' | 'html' | 'noti' | 'page';
export type PymMethodScreenMode =
  | 'cart'
  | 'roaming_product'
  | 'new_sim'
  | 'recharge';
type ContactBoardRouteParam = {index?: number} | undefined;
type EventBoardRouteParam =
  | {index?: number; issue?: RkbEventBoard; nid?: string}
  | undefined;
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
  digital: boolean; // 컨텐츠 - 데이터상품일 경우 true
  memo?: string;
  receipt?: {
    type: 'p' | 'b' | 'n'; // 용도 p-개인, b-사업용 n-발급안함
    idType: 'm' | 'c' | 'b'; // id 종류  m-휴대폰, c-영수증카드, b-사업자등록번호
    id: string; // id 번호
  };

  isPaid?: boolean;
  mode?: string;
  card?: string;
  installmentMonths?: string; // 할부 개월수
  paymentRule?: PaymentRule;
  selected?: string;
  pymMethod?: string;
};

type ChargeAgreementContents = {
  chargeProd: string;
  noticeTitle: string;
  noticeBody: string[];
};

type SimpleTextParams = {
  key: 'noti' | 'info' | string;
  title: string;
  mode?: SimpleTextScreenMode;
  body?: string;
  bodyTitle?: string;
  created?: Moment;
  text?: string;
  rule?: Record<string, string>;
  nid?: number;
  btnStyle?: ViewStyle;
  showIcon?: boolean;
  showCloseModal?: boolean;
  notiType?: string;
  image?: {
    success?: string;
    failure?: string;
  };
};
type PurchaseDetailParams = {orderId: string};

export type HomeStackParamList = {
  Home: undefined;
  Tutorial: {stack: string; screen: string; naviParams: object};
  StoreSearch: undefined;
  Store: undefined;
  Cart: {
    showHeader?: boolean;
  };
  ProductDetail: {
    title?: string;
    img?: string;
    item?: PurchaseItem;
    uuid?: string;
    localOpDetails?: string;
    partnerId?: string;
    desc?: Record<string, string>;
    price?: Currency;
    listPrice?: Currency;
    partner?: string;
    prod?: RkbProduct;
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
  Country: {
    partner: string[];
    type?: string;
    volume?: DailyProdFilterList;
    scroll?: string;
  };
  Payment: PaymentParams;
  PaymentGateway: PaymentParams;
  PymMethod: {isPaid?: boolean; pymPrice?: number; mode?: PymMethodScreenMode};
  FindAddress: undefined;
  PaymentResult: {
    pymResult: boolean;
    status: string;
    pay_method: string;
    card?: string;
    mode?: string;
    errorMsg?: string;
    installmentMonths?: string;
    paymentParams: {
      key: string;
      pg: string;
      token: string;
    };
  };
  CodePush: undefined;
  CustomerProfile: undefined;
  AddProfile: undefined;
  PurchaseDetail: PurchaseDetailParams;
  RegisterMobile: {screen?: string; goBack?: () => void};
  Main: undefined;
  Settings: undefined;
  Auth: {screen: string};
  HeaderTitle: undefined;
  Esim: {
    clickPromotion?: boolean;
    iccid?: string;
    nid?: string;
    subsId?: string;
    actionStr?: string;
  };

  MyPage: undefined;
  Recharge: {mode: string};
  Invite: undefined;
  InvitePromo: undefined;
  GiftGuide: undefined;

  Draft: {orderId: number};
  DraftUs: {orderId: number};
  DraftResult: {isSuccess: boolean};
  CancelOrder: {orderId: number};
  CancelResult: {isSuccess: boolean; orderId: number; prods: ProdInfo[]};

  Gift: {mainSubs: RkbSubscription};
  ChargeHistory: {
    mainSubs: RkbSubscription;
    chargeablePeriod: string;
    isChargeable: boolean;
  };
  Lottery: {count: number; fortune?: Fortune; onPress: (v: number) => void};
  ChargeDetail: {
    data: RkbProduct;
    chargeablePeriod: string;
    prodName?: string;
    subsIccid?: string;
  };
  Charge: {
    chargeableItem: RkbSubscription;
    chargeablePeriod: string;
  };
  ChargeType: {
    mainSubs: RkbSubscription;
    addOnData?: RkbSubscription[];
    chargeablePeriod: string;
    isChargeable: boolean;
    chargedSubs?: RkbSubscription[];
  };
  ChargeAgreement: {
    chargeableItem: RkbSubscription;
    addOnProd?: RkbAddOnProd;
    extensionProd?: RkbProduct;
    title: string;
    contents: ChargeAgreementContents;
    usagePeriod?: {text: string; period: string; format: string};
    status?: string;
    expireTime?: Moment;
    type: 'addOn' | 'extension';
  };
  AddOn: {
    chargeableItem: RkbSubscription;
    status?: string;
    expireTime?: Moment;
    addonProds?: RkbAddOnProd[];
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
  EsimSubs: {};
  CashHistory: {};
  ChangeEmail: undefined;
  SelectCoupon: undefined;
  Coupon: undefined;
  Signup: {
    kind?: SocialAuthInfoKind;
    pin: string;
    mobile: string;
    status?: string;
    email?: string;
    profileImageUrl?: string;
  };
  SimpleTextForAuth: Record<string, string>;
};

export const navigate = (
  navigation: NavigationProp<any>,
  route: RouteProp<ParamListBase, string>,
  returnTab: string,
  {
    tab,
    screen,
    params,
    initial = true, // false : 스택 상단에 해당 화면이 덮어씌워지지 않도록 방지
  }: {tab?: string; screen: string; params?: object; initial?: boolean},
) => {
  navigation.navigate(tab || returnTab, {
    screen,
    initial,
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
  if (route?.params?.returnRoute) {
    const {tab, screen, params = {}} = route?.params?.returnRoute;
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
