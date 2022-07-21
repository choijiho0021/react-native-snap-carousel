/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import {API} from '@/redux/api';
import {
  Currency,
  RkbLocalOp,
  RkbProdByCountry,
  RkbProduct,
} from '@/redux/api/productApi';
import {actions as PromotionActions} from './promotion';
import Env from '@/environment';
import utils from '@/redux/api/utils';

const {esimCurrency} = Env.get();

const getLocalOp = createAsyncThunk(
  'product/getLocalOp',
  API.Product.getLocalOp,
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
  API.Product.productByCountry,
);

const getProd = createAsyncThunk('product/getProd', API.Product.getProduct);

const getProductByLocalOp = createAsyncThunk(
  'product/getProductByLocalOp',
  API.Product.getProductByLocalOp,
);

const init = createAsyncThunk('product/init', async (_, {dispatch}) => {
  dispatch(getLocalOp());
  dispatch(getProductByCountry());

  // await dispatch(getProd(API.Product.category.asia));
  dispatch(PromotionActions.getPromotion());
  dispatch(PromotionActions.getPromotionStat());
  dispatch(PromotionActions.getGiftBgImages());
});

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

export type RkbPriceInfo = Partial<RkbProdByCountry> & {
  minPrice: Currency;
  partnerList: string[];
  weight: number;
  search: string;
};

export interface ProductModelState {
  prodList: ImmutableMap<string, RkbProduct>; // uuid -> RkbProduct
  localOpList: ImmutableMap<string, RkbLocalOp>;
  prodOfCountry: RkbProduct[];
  sortedProdList: RkbProduct[][];
  detailInfo: string;
  partnerId: string;
  detailCommon: string;
  ready: boolean;
  prodByCountry: RkbProdByCountry[];
  priceInfo: ImmutableMap<string, RkbPriceInfo[][]>;
  prodByLocalOp: ImmutableMap<string, string[]>;
}

const initialState: ProductModelState = {
  prodList: ImmutableMap(),
  localOpList: ImmutableMap(),
  prodOfCountry: [],
  sortedProdList: [],
  detailInfo: '',
  detailCommon: '',
  partnerId: '',
  ready: false,
  prodByCountry: [],
  priceInfo: ImmutableMap(),
  prodByLocalOp: ImmutableMap(),
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSortedProdList: (state, action) => {
      state.sortedProdList = action.payload;
    },
    setProdOfCountry: (state, action) => {
      state.prodOfCountry = action.payload;
    },
    updateProduct: (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects.length > 0) {
        state.prodList = state.prodList.merge(
          ImmutableMap(objects.map((item) => [item.key, item])),
        );
      }
    },
    updatePriceInfo: (state, action) => {
      state.priceInfo = state.prodByCountry
        .reduce((acc, cur) => {
          // 먼저 category 별로 분리
          const elm = {
            ...cur,
            weight: state.localOpList.get(cur.partner)?.weight || 0,
            partnerList: [cur.partner],
            minPrice: {
              value: utils.stringToNumber(cur.price),
              currency: esimCurrency,
            } as Currency,
          } as RkbPriceInfo;
          return acc.update(cur.category, (prev) =>
            prev ? prev.concat(elm) : [elm],
          );
        }, ImmutableMap<string, RkbPriceInfo[]>())
        .map((v) =>
          v
            .reduce((acc, cur) => {
              // grouping by country
              const idx = acc.findIndex((a) => a.country === cur.country);
              if (idx < 0) return acc.concat(cur);
              acc[idx].weight = Math.max(acc[idx].weight, cur.weight);
              acc[idx].partnerList.push(cur.partner);
              return acc;
            }, [] as RkbPriceInfo[])
            .sort((a, b) => b.weight - a.weight)
            .reduce((acc, cur) => {
              // 2단 list로 변환
              if (acc.length === 0) return [[cur]];
              const last = acc[acc.length - 1];
              return last.length <= 1
                ? acc.slice(0, acc.length - 1).concat([last.concat(cur)])
                : acc.concat([[cur]]);
            }, [] as RkbPriceInfo[][]),
        );
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

    builder.addCase(getLocalOp.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects.length > 0) {
        state.localOpList = ImmutableMap(
          objects.map((item) => [item.key, item]),
        );
      }
    });

    builder.addCase(getProductByCountry.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0) {
        state.prodByCountry = objects;
      }
    });

    builder.addCase(getProductByLocalOp.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      if (result === 0 && objects.length > 0) {
        state.prodByLocalOp = state.prodByLocalOp.set(
          objects[0].partnerId,
          objects.map((o) => o.key),
        );
        state.prodList = state.prodList.merge(
          ImmutableMap(objects.map((o) => [o.key, o])),
        );
      }
    });

    builder.addCase(init.rejected, (state, action) => {
      state.ready = false;
    });
    builder.addCase(init.fulfilled, (state, action) => {
      state.ready = true;
    });
  },
});

export const actions = {
  ...slice.actions,
  getProdDetailCommon,
  getProdDetailInfo,
  getLocalOp,
  getProd,
  getProductByCountry,
  init,
  getProdOfPartner,
};
export type ProductAction = typeof actions;

export default slice.reducer as Reducer<ProductModelState, AnyAction>;
