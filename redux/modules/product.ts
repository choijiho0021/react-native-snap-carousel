/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import moment from 'moment';
import {API} from '@/redux/api';
import {
  Currency,
  DescData,
  RkbLocalOp,
  RkbProdByCountry,
  RkbProdCategory,
  RkbProduct,
} from '@/redux/api/productApi';
import {actions as PromotionActions} from './promotion';
import utils from '@/redux/api/utils';
import {retrieveData, storeData} from '@/utils/utils';
import api, {reloadOrCallApi} from '@/redux/api/api';
import Env from '@/environment';
import {RkbOrderItem} from '../api/cartApi';
import {PurchaseItem} from '../models/purchaseItem';
import {OrderItemType} from '../api/orderApi';
import VersionCheck from 'react-native-version-check';
import {actions as CartActions} from './cart';
import AppAlert from '@/components/AppAlert';
import i18n from '@/utils/i18n';
import {actions as AccountActions} from './account';

const {cachePrefix} = Env.get();

const getDevList = createAsyncThunk(
  'product/getDevList',
  reloadOrCallApi('cache.devList', undefined, API.Device.getDevList),
);

const getPaymentRule = createAsyncThunk(
  'product/getPaymentRule',
  API.Payment.getRokebiPaymentRule,
);

const getLocalOp = createAsyncThunk(
  'product/getLocalOp',
  reloadOrCallApi('cache.localOp', undefined, API.Product.getLocalOp),
);

const getProdCountry = createAsyncThunk(
  'product/getProdCountry',
  reloadOrCallApi('cache.prodCountry', undefined, API.Product.getProdCountry),
);
const getProdDetailCommon = createAsyncThunk(
  'product/getProdDetailCommon',
  API.Page.getProdDetailCommon,
);

const getProdDetailInfo = createAsyncThunk(
  'product/getProdDetailInfo',
  API.Page.getProductDetailsBody,
);
const getProdDesc = createAsyncThunk(
  'product/getProdDesc',
  API.Product.getProductDesc,
);

const getProductByCountry = createAsyncThunk(
  'product/getProdByCountry',
  reloadOrCallApi(
    'cache.prodByCountry',
    undefined,
    API.Product.productByCountry,
  ),
);

const getProductCategory = createAsyncThunk(
  'product/getProdCategory',
  reloadOrCallApi('cache.prodCategory', undefined, API.Product.productCategory),
);

const getProd = createAsyncThunk('product/getProd', API.Product.getProduct);
const getProdBySku = createAsyncThunk(
  'product/getProdBySku',
  API.Product.getProductBySku,
);

const getProdByUuid = createAsyncThunk(
  'product/getProdByUuid',
  API.Product.getProductByUuid,
);

const getProductByLocalOp = createAsyncThunk(
  'product/getProductByLocalOp',
  API.Product.getProductByLocalOp,
);

const getParams = async () => {
  const mobile = await retrieveData(API.User.KEY_MOBILE, true);
  return {
    id: mobile,
    timestamp: moment().unix().toString(),
  };
};

const getAllProduct = createAsyncThunk(
  'product/getAllProduct',
  async (reload: boolean, thunkAPI) => {
    const params = await getParams();

    return reloadOrCallApi(
      'cache.allProd',
      params,
      API.Product.getAllProduct,
    )(reload, thunkAPI);
  },
);

// const getAllProduct = createAsyncThunk(
//   'product/getAllProduct',
//   reloadOrCallApi('cache.allProd', undefined, API.Product.getAllProduct),
// );

const getProdOfPartner = createAsyncThunk(
  'product/getProdOfPartner',
  (partnerId: string[], {dispatch, getState}) => {
    const {
      product: {prodByLocalOp},
    } = getState() as RootState;

    for (let i = 0; i < partnerId.length; i++) {
      if (!prodByLocalOp.has(partnerId[i])) {
        dispatch(getProductByLocalOp(partnerId[i]));
      }
    }
  },
);

export const getDiscountRate = (finalPrice: number, listPrice: number) => {
  return Math.floor(((listPrice - finalPrice) / listPrice) * 100);
};

const init = createAsyncThunk(
  'product/init',
  async (reloadAll: boolean, {dispatch}) => {
    let reload = reloadAll || false;

    if (!reload) {
      const timestamp = await retrieveData(`${cachePrefix}cache.timestamp`);
      const mobile = await retrieveData(API.User.KEY_MOBILE, true);
      if (!timestamp) reload = true;
      else {
        const rsp = await dispatch(
          getPaymentRule({
            id: mobile || '',
            timestamp: moment().unix().toString(),
          }),
        ).unwrap();
        if (
          rsp?.timestamp_prod &&
          moment(rsp?.timestamp_prod).utcOffset(9, true).isAfter(timestamp)
        ) {
          reload = true;
        }
      }
    }

    const results = await Promise.all([
      dispatch(getLocalOp(reload)),
      dispatch(getProdCountry(reload)),
      dispatch(getProductByCountry(reload)),
      dispatch(getProductCategory(reload)),
      dispatch(getAllProduct(reload)),
      dispatch(PromotionActions.getPromotion(reload)),
      dispatch(PromotionActions.getGiftBgImages(reload)),
      dispatch(PromotionActions.getEvent(reload)),
      dispatch(PromotionActions.getPromotionStat()),
    ]);

    const result = results.every((elm) => elm.payload?.result === 0);

    return {reload, result};
  },
);

const refresh = createAsyncThunk(
  'product/refresh',
  async (param, {dispatch}) => {
    let reload = false;

    const timestamp = await retrieveData(`${cachePrefix}cache.timestamp`);
    if (!timestamp) reload = true;
    else {
      const mobile = await retrieveData(API.User.KEY_MOBILE, true);
      const rsp = await dispatch(
        getPaymentRule({
          id: mobile || '',
          timestamp: moment().unix().toString(),
        }),
      ).unwrap();
      if (
        rsp?.timestamp_prod &&
        moment(rsp?.timestamp_prod).utcOffset(9, true).isAfter(timestamp)
      )
        reload = true;
    }

    if (reload) {
      dispatch(init(true));
    } else {
      console.log('@@@ cache is up to date');
    }
  },
);

export type RkbPriceInfo = Partial<RkbProdByCountry> & {
  minPrice: Currency;
  partnerList: string[];
  title: string;
  weight: number;
  maxDiscount: number;
};

export type ProdDataType = {title: string; data: RkbProduct[]};

export type PaymentRule = {
  timestamp_prod: string;
  timestamp_dev: string;
  inicis_enabled: string;
  maintenance: {
    state: string;
    message?: string;
  };
  ccard: [string, string][];
} & Record<string, 'I' | 'T'>;

export interface ProductModelState {
  prodList: ImmutableMap<string, RkbProduct>; // uuid -> RkbProduct
  localOpList: ImmutableMap<string, RkbLocalOp>;
  detailInfo: string;
  partnerId: string;
  detailCommon: string;
  ready: boolean;
  prodByCountry: RkbProdByCountry[];
  prodCategory: ImmutableMap<string, RkbProdCategory>;
  priceInfo: RkbPriceInfo[];
  priceInfoTab: ImmutableMap<string, RkbPriceInfo[][]>;
  prodByLocalOp: ImmutableMap<string, string[]>;
  prodCountry: string[];
  rule: PaymentRule;
  devList: string[];
  descData: ImmutableMap<string, DescData>;
}

const initialState: ProductModelState = {
  descData: ImmutableMap(),
  prodList: ImmutableMap(),
  localOpList: ImmutableMap(),
  detailInfo: '',
  detailCommon: '',
  partnerId: '',
  ready: false,
  prodByCountry: [],
  priceInfo: [],
  priceInfoTab: ImmutableMap(),
  prodByLocalOp: ImmutableMap(),
  prodCountry: [],
  rule: {
    timestamp_dev: '',
    timestamp_prod: '',
    inicis_enabled: '1',
    maintenance: {
      state: '0',
    },
  },
  devList: [],
};

export const refreshProductInfo = (
  resp: any,
  cartItems: RkbOrderItem[],
  dispatch: any,
  cartId?: number,
) => {
  const skuList = resp?.message.split(',');
  if (skuList?.length > 0 && cartId) {
    cartItems
      .filter((elm) => skuList.includes(elm.prod.sku))
      .forEach((elm) => {
        // remove it from the cart
        if (elm.orderItemId) {
          CartActions.cartRemove({
            orderId: cartId,
            orderItemId: elm.orderItemId,
          });
        }
      });
  }

  dispatch(getAllProduct(true));
};

export const handlePaymentError = (
  resp: any,
  navigation: any,
  cartItems: RkbOrderItem[],
  dispatch: any,
  token?: string,
  iccid?: string,
  cartId?: number,
) => {
  let text = 'cart:systemError';
  refreshProductInfo(resp, cartItems, dispatch, cartId);

  if (resp.result === api.E_RESOURCE_NOT_FOUND) {
    text = 'cart:soldOut';
  } else if (resp?.status === api.API_STATUS_CONFLICT) {
    text = 'cart:paymentNotMatch';
  } else if (resp.result === api.E_STATUS_EXPIRED) {
    text = 'cart:unpublishedError';
    // product status is changed.
  } else if (iccid && token) {
    // 결제 실패 통합
    // 캐시 및 포인트 업데이트,
    AccountActions.getAccount({iccid, token});
  }
  AppAlert.info(i18n.t(text), '', () => navigation.popToTop());
};

const reduceProdByLocalOp = (state, action) => {
  const {result, objects} = action.payload;
  const updateAll = action.meta.arg === 'all';

  if (result === 0) {
    if (objects.length > 0) {
      const group = objects.reduce(
        (acc, cur) =>
          acc.update(cur.partnerId, (prev) =>
            prev ? prev.concat(cur.key) : [cur.key],
          ),
        ImmutableMap<string, string[]>(),
      );
      state.prodByLocalOp = updateAll
        ? group
        : state.prodByLocalOp.merge(group);

      const prodList = ImmutableMap(objects.map((o) => [o.key, o]));
      state.prodList = updateAll ? prodList : state.prodList.merge(prodList);
    } else if (!updateAll) {
      // update the product list of given local operator empty
      state.prodByLocalOp = state.prodByLocalOp.set(action.meta.arg, []);
    }
  }
};

const updateProdList = (state, action) => {
  const {result, objects} = action.payload;

  if (result === 0 && objects.length > 0) {
    state.prodList = state.prodList.merge(
      ImmutableMap(objects.map((item) => [item.key, item])),
    );
  }
};

export const checkAndLoadProdList = (
  loading: React.MutableRefObject<boolean>,
  items: RkbOrderItem[] | PurchaseItem[] | OrderItemType[],
  prodList: ImmutableMap<string, RkbProduct>,
  dispatch: any,
) => {
  if (!loading.current && (items?.length || 0) > 0) {
    items.forEach((i) => {
      if (!prodList.has(i?.key || i?.uuid)) {
        dispatch(getProdByUuid(i?.key || i?.uuid));
        loading.current = true;
      }
    });
  }
};

//
const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    updateProduct: updateProdList,
    updatePriceInfo: (state) => {
      const priceInfo = API.Product.toGroupByTitle(
        state.prodByCountry.map((elm) => {
          const cItem = state.prodCategory?.get(elm.categoryItem);
          return {
            ...elm,
            weight: cItem?.weight || 0,
            title: cItem?.name,
            search: cItem?.name,
            partnerList: [elm.partner],
            minPrice: utils.stringToCurrency(elm.price),
            maxDiscount: Number(elm.max_discount),
          } as RkbPriceInfo;
        }),
        state.prodCountry,
      );
      state.priceInfo = priceInfo;

      state.priceInfoTab = priceInfo
        .reduce((acc, cur) => {
          if (cur.category) {
            return acc.update(cur.category, (prev) =>
              prev ? prev.concat(cur) : [cur],
            );
          }
          return acc;
        }, ImmutableMap<string, RkbPriceInfo[]>())
        .map((elm) => API.Product.toColumnList(elm));
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getProdDetailCommon.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      const details = objects.map((item) => item.body);
      if (result === 0 && details.length > 0) {
        // todo : drupal - details에서 상품정보(prod:1)를 제거 후 else 부분 제거 필요
        if (details.length === 2) {
          state.detailCommon = details.join('');
        } else {
          state.detailInfo = details[0] || '';
          state.detailCommon = details.slice(1, details.length).join('');
        }
      }
    });

    builder.addCase(getProdDetailInfo.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      const details = objects.map((item) => item.body);
      const partnerId = objects.map((item) => item.partnerId);
      if (result === 0 && details.length > 0) {
        state.detailInfo = details[0] || '';
        state.partnerId = partnerId[0] || '';
      }
    });

    builder.addCase(getProd.fulfilled, updateProdList);

    builder.addCase(getProdBySku.fulfilled, updateProdList);

    builder.addCase(getProdByUuid.fulfilled, updateProdList);

    builder.addCase(getProdCountry.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects.length > 0) {
        objects.forEach((item) => {
          if (!state.prodCountry.includes(item.keyword)) {
            state.prodCountry.push(item.keyword);
          }
        });
      }
    });

    builder.addCase(getLocalOp.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects.length > 0) {
        state.localOpList = ImmutableMap(
          objects.map((item) => [item.key, item]),
        );
      }
    });

    builder.addCase(getProductByCountry.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0) {
        state.prodByCountry = objects.map((o) => {
          const country = o.country.split(',');
          return {
            ...o,
            country,
            maxDiscount: Number(o.max_discount),
          };
        });
      }
    });

    builder.addCase(getProductCategory.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0) {
        state.prodCategory = ImmutableMap(objects.map((o) => [o.tid, o]));
      }
    });

    builder.addCase(getProductByLocalOp.fulfilled, reduceProdByLocalOp);

    builder.addCase(getAllProduct.fulfilled, reduceProdByLocalOp);

    builder.addCase(init.rejected, (state) => {
      state.ready = false;
    });

    builder.addCase(init.fulfilled, (state, {payload}) => {
      if (payload.reload && payload.result) {
        storeData(
          `${cachePrefix}cache.timestamp`,
          moment().utcOffset(9).format(),
        );
        const ver = VersionCheck.getCurrentVersion();
        storeData('AppVer', ver);
      }
      state.ready =
        state.prodByCountry.length !== 0 && state.prodList?.size !== 0;
    });

    builder.addCase(getPaymentRule.fulfilled, (state, {payload}) => {
      state.rule = payload;
    });

    builder.addCase(getDevList.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;
      if (result === 0) {
        state.devList = objects;
      }
    });

    builder.addCase(getProdDesc.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0) {
        state.descData = state.descData.merge(
          ImmutableMap({
            [objects.uuid]: {
              ...objects,
              body: objects?.body
                ?.replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, '&')
                .replace(/<\/p>\s*<p>|<br\s*\/>/g, ''),
            },
          }),
        );
      }
    });
  },
});

export const actions = {
  ...slice.actions,
  getProdDetailCommon,
  getProdDetailInfo,
  getLocalOp,
  getProdCountry,
  getProd,
  getProdBySku,
  getProductByCountry,
  init,
  refresh,
  getProdOfPartner,
  getProdByUuid,
  getAllProduct,
  getDevList,
  getProdDesc,
};
export type ProductAction = typeof actions;

export default slice.reducer as Reducer<ProductModelState, AnyAction>;
