/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import AsyncStorage from '@react-native-community/async-storage';
import {API, Country} from '@/redux/api';
import {
  Currency,
  RkbLocalOp,
  RkbProdByCountry,
  RkbProduct,
} from '@/redux/api/productApi';
import {actions as PromotionActions} from './promotion';
import utils from '@/redux/api/utils';

const getLocalOp = createAsyncThunk(
  'product/getLocalOp',
  API.Product.getLocalOp,
);

const getProdCountry = createAsyncThunk(
  'product/getProdCountry',
  API.Product.getProdCountry,
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

const init = createAsyncThunk(
  'product/init',
  async (_, {dispatch, fulfillWithValue}) => {
    const cache: Record<string, string | null> = {};

    const time = await AsyncStorage.getItem('cache.time');
    let result = API.default.E_REQUEST_FAILED;
    if (!time || Date.now() - parseInt(time, 10) > 24 * 3600 * 1000) {
      // it's called for the first time or 1 day after the last call
      const localOp = await dispatch(getLocalOp()).unwrap();
      result = localOp.result;
    }
    if (result === API.default.E_REQUEST_FAILED) {
      // 인터넷이 끊기거나, 최종 호출 후 24시간이 안 지난 경우에는 캐시 데이터를 활용한다.
      cache.localOp = await AsyncStorage.getItem('cache.localOp');
      cache.prodCountry = await AsyncStorage.getItem('cache.prodCountry');
      cache.prodByCountry = await AsyncStorage.getItem('cache.prodByCountry');
    } else {
      // 그외에는 새로 읽는다.
      await dispatch(getProdCountry());
      await dispatch(getProductByCountry());
    }

    await dispatch(PromotionActions.getPromotion());
    await dispatch(PromotionActions.getPromotionStat());
    await dispatch(PromotionActions.getGiftBgImages());

    return fulfillWithValue(cache);
  },
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

        AsyncStorage.setItem(
          'cache.prodCountry',
          JSON.stringify(state.prodCountry),
        );
      }
    });

    builder.addCase(getLocalOp.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects.length > 0) {
        state.localOpList = ImmutableMap(
          objects.map((item) => [item.key, item]),
        );

        AsyncStorage.setItem(
          'cache.localOp',
          JSON.stringify(state.localOpList.toJS()),
        );
        AsyncStorage.setItem('cache.time', Date.now().toString());
      }
    });

    builder.addCase(getProductByCountry.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

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

        AsyncStorage.setItem(
          'cache.prodByCountry',
          JSON.stringify(state.prodByCountry),
        );
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

        const prodListbyPartner = state.prodByLocalOp
          .get(objects[0].partnerId)
          ?.map((p2) => state.prodList.get(p2));

        state.prodByPartner = state.prodByPartner.set(
          objects[0].partnerId,
          prodListbyPartner,
        );
      } else {
        state.prodByPartner = state.prodByPartner.set(action.meta.arg, []);
      }
    });

    builder.addCase(init.rejected, (state) => {
      state.ready = false;
    });
    builder.addCase(init.fulfilled, (state, action) => {
      const {prodByCountry, prodCountry, localOp} = action.payload;
      if (prodByCountry) {
        state.prodByCountry = JSON.parse(prodByCountry);
      }
      if (prodCountry) {
        state.prodCountry = JSON.parse(prodCountry);
      }
      if (localOp) {
        state.localOpList = ImmutableMap(JSON.parse(localOp));
      }

      if (state.prodByCountry.length === 0) {
        state.ready = false;
      } else {
        state.ready = true;
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
  getProdOfPartner,
  getProdByUuid,
};
export type ProductAction = typeof actions;

export default slice.reducer as Reducer<ProductModelState, AnyAction>;
