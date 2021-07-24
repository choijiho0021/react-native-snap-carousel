/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AnyAction} from 'redux';
import {Map as ImmutableMap} from 'immutable';
import {API} from '@/redux/api';
import {RkbLocalOp, RkbProduct} from '@/redux/api/productApi';
import {reflectWithToast, Toast} from './toast';

const getProd = createAsyncThunk('product/getProd', API.Product.getProduct);
const getLocalOp = createAsyncThunk(
  'product/getLocalOp',
  API.Product.getLocalOp,
);
const getProdDetail = createAsyncThunk(
  'product/getProdDetail',
  API.Page.getProductDetails,
);

// const getProdListWithToast = reflectWithToast(getProdList, Toast.NOT_LOADED);

export interface ProductModelState {
  prodList: ImmutableMap<string, RkbProduct>;
  localOpList: ImmutableMap<string, RkbLocalOp>;
  prodOfCountry: RkbProduct[];
  sortedProdList: RkbProduct[][];
  detailInfo: string;
  detailCommon: string;
}

const initialState = {
  prodList: ImmutableMap<string, RkbProduct>(),
  localOpList: ImmutableMap<string, RkbLocalOp>(),
  prodOfCountry: [],
  sortedProdList: [],
  detailInfo: '',
  detailCommon: '',
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
  },

  extraReducers: (builder) => {
    builder.addCase(getProdDetail.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      const details = objects.map((item) => item.body);
      if (result === 0 && details.length > 0) {
        state.detailInfo = details[0];
        state.detailCommon = details.slice(1, details.length).join('');
      }
    });

    builder.addCase(getProd.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects.length > 0) {
        state.prodList = ImmutableMap(objects.map((item) => [item.key, item]));
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
  },
});

export const actions = {
  ...slice.actions,
  getProdDetail,
  getLocalOp,
  getProd,
};
export type ProductAction = typeof actions;

export default slice.reducer as Reducer<ProductModelState, AnyAction>;
