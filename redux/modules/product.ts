/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import moment from 'moment';
import {API, Country} from '@/redux/api';
import {
  Currency,
  RkbLocalOp,
  RkbProdByCountry,
  RkbProduct,
} from '@/redux/api/productApi';
import {actions as PromotionActions} from './promotion';
import utils from '@/redux/api/utils';
import {retrieveData, storeData} from '@/utils/utils';
import {reloadOrCallApi} from '@/redux/api/api';
import Env from '@/environment';

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

const getProductByCountry = createAsyncThunk(
  'product/getProdByCountry',
  reloadOrCallApi(
    'cache.prodByCountry',
    undefined,
    API.Product.productByCountry,
  ),
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

const getAllProduct = createAsyncThunk(
  'product/getAllProduct',
  reloadOrCallApi('cache.allProd', 'all', API.Product.getProductByLocalOp),
);

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

const init = createAsyncThunk(
  'product/init',
  async (reloadAll: boolean, {dispatch}) => {
    let reload = reloadAll || false;

    if (!reload) {
      const timestamp = await retrieveData(`${cachePrefix}cache.timestamp`);
      if (!timestamp) reload = true;
      else {
        const rsp = await dispatch(getPaymentRule()).unwrap();
        if (rsp?.timestamp_prod > timestamp) reload = true;
      }
    }

    if (reload) {
      storeData(`${cachePrefix}cache.timestamp`, moment().zone(-540).format());
    }

    await dispatch(getLocalOp(reload));
    await dispatch(getProdCountry(reload));
    await dispatch(getProductByCountry(reload));

    await dispatch(PromotionActions.getPromotion(reload));
    await dispatch(PromotionActions.getPromotionStat(reload));
    await dispatch(PromotionActions.getGiftBgImages(reload));
  },
);

const refresh = createAsyncThunk(
  'product/refresh',
  async (param, {dispatch}) => {
    let reload = false;

    const timestamp = await retrieveData(`${cachePrefix}cache.timestamp`);
    if (!timestamp) reload = true;
    else {
      const rsp = await dispatch(getPaymentRule()).unwrap();
      if (rsp?.timestamp_prod > timestamp) reload = true;
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
  weight: number;
  maxDiscount: number;
};

export type ProdDataType = {title: string; data: RkbProduct[]};

export interface ProductModelState {
  prodList: ImmutableMap<string, RkbProduct>; // uuid -> RkbProduct
  localOpList: ImmutableMap<string, RkbLocalOp>;
  detailInfo: string;
  partnerId: string;
  detailCommon: string;
  ready: boolean;
  prodByCountry: RkbProdByCountry[];
  priceInfo: ImmutableMap<string, RkbPriceInfo[][]>;
  prodByLocalOp: ImmutableMap<string, string[]>;
  prodByPartner: ImmutableMap<string, RkbProduct[]>;
  cmiProdByPartner: ImmutableMap<string, RkbProduct[]>;
  prodCountry: string[];
  rule: Record<string, string> & {
    timestamp_prod: string;
    timestamp_dev: string;
    inicis_enabled: string;
  };
  devList: string[];
}

const initialState: ProductModelState = {
  prodList: ImmutableMap(),
  localOpList: ImmutableMap(),
  detailInfo: '',
  detailCommon: '',
  partnerId: '',
  ready: false,
  prodByCountry: [],
  priceInfo: ImmutableMap(),
  prodByLocalOp: ImmutableMap(),
  prodByPartner: ImmutableMap(),
  cmiProdByPartner: ImmutableMap(),
  prodCountry: [],
  rule: {
    timestamp_dev: '',
    timestamp_prod: '',
    inicis_enabled: '1',
  },
  devList: [],
};

const reduceProdByLocalOp = (state, action) => {
  const {result, objects} = action.payload;

  if (result === 0 && objects.length > 0) {
    const group = objects.reduce(
      (acc, cur) =>
        acc.update(cur.partnerId, (prev) =>
          prev ? prev.concat(cur.key) : [cur.key],
        ),
      ImmutableMap<string, string[]>(),
    );

    state.prodByLocalOp = state.prodByLocalOp.merge(group);
    state.prodList = state.prodList.merge(
      ImmutableMap(objects.map((o) => [o.key, o])),
    );

    const prodListbyPartner = group.map((v) =>
      v.map((k) => state.prodList.get(k)),
    );
    state.prodByPartner = state.prodByPartner.merge(prodListbyPartner);
  } else if (action.meta.arg !== 'all') {
    state.prodByPartner = state.prodByPartner.set(action.meta.arg, []);
  }
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    updateProduct: (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects.length > 0) {
        state.prodList = state.prodList.merge(
          ImmutableMap(objects.map((item) => [item.key, item])),
        );
      }
    },
    updatePriceInfo: (state) => {
      state.priceInfo = state.prodByCountry
        .reduce((acc, cur) => {
          // 먼저 category 별로 분리
          const country = cur.country.split(',');
          const elm = {
            ...cur,
            weight: state.localOpList.get(cur.partner)?.weight || 0,
            search: `${cur.country},${Country.getName(
              country,
              'ko',
              state.prodCountry,
            )},${Country.getName(country, 'en', state.prodCountry)}`,
            partnerList: [cur.partner],
            minPrice: utils.stringToCurrency(cur.price),
            maxDiscount: Number(cur.max_discount),
          } as RkbPriceInfo;
          return acc.update(cur.category, (prev) =>
            prev ? prev.concat(elm) : [elm],
          );
        }, ImmutableMap<string, RkbPriceInfo[]>())
        .map((v) => API.Product.toColumnList(v));
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

    builder.addCase(getProd.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects.length > 0) {
        state.prodList = state.prodList.merge(
          ImmutableMap(objects.map((item) => [item.key, item])),
        );
      }
    });

    builder.addCase(getProdBySku.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects.length > 0) {
        state.prodList = state.prodList.merge(
          ImmutableMap(objects.map((item) => [item.key, item])),
        );
      }
    });

    builder.addCase(getProdByUuid.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects.length > 0) {
        state.prodList = state.prodList.merge(
          ImmutableMap(objects.map((item) => [item.key, item])),
        );
      }
    });

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
            search: `${o.country},${Country.getName(
              country,
              'ko',
              state.prodCountry,
            )},${Country.getName(country, 'en', state.prodCountry)}`,
            maxDiscount: Number(o.max_discount),
          };
        });
      }
    });

    builder.addCase(getProductByLocalOp.fulfilled, reduceProdByLocalOp);

    builder.addCase(getAllProduct.fulfilled, reduceProdByLocalOp);

    builder.addCase(init.rejected, (state) => {
      state.ready = false;
    });

    builder.addCase(init.fulfilled, (state) => {
      state.ready = state.prodByCountry.length !== 0;
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
};
export type ProductAction = typeof actions;

export default slice.reducer as Reducer<ProductModelState, AnyAction>;
