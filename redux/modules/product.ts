/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import {API} from '@/redux/api';
import {RkbLocalOp, RkbProduct} from '@/redux/api/productApi';
import {actions as PromotionActions} from './promotion';

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

const getProd = createAsyncThunk('product/getProd', API.Product.getProduct);

const init = createAsyncThunk('product/init', async (_, {dispatch}) => {
  const {category} = API.Product;

  await dispatch(getLocalOp());
  await dispatch(getProd(category.asia));
  await dispatch(getProd(category.europe));
  await dispatch(getProd(category.usaAu));
  await dispatch(getProd(category.multi));
  await dispatch(PromotionActions.getPromotion());
  await dispatch(PromotionActions.getGiftImages());
});
export interface ProductModelState {
  prodList: ImmutableMap<string, RkbProduct>;
  localOpList: ImmutableMap<string, RkbLocalOp>;
  prodOfCountry: RkbProduct[];
  sortedProdList: RkbProduct[][];
  detailInfo: string;
  partnerId: string;
  detailCommon: string;
  ready: boolean;
}

const initialState = {
  prodList: ImmutableMap<string, RkbProduct>(),
  localOpList: ImmutableMap<string, RkbLocalOp>(),
  prodOfCountry: [],
  sortedProdList: [],
  detailInfo: '',
  detailCommon: '',
  partnerId: '',
  ready: false,
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
  init,
};
export type ProductAction = typeof actions;

export default slice.reducer as Reducer<ProductModelState, AnyAction>;
