/* eslint-disable no-param-reassign */
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Reducer} from 'react';
import {AnyAction} from 'redux';
import {RkbPromotion} from '@/redux/api/promotionApi';
import {API} from '@/redux/api';

const getPromotion = createAsyncThunk(
  'promotion/getPromotion',
  API.Promotion.getPromotion,
);
export interface PromotionModelState {
  promotion: RkbPromotion[];
}

const initialState: PromotionModelState = {
  promotion: [],
};

const slice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPromotion.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0) {
        state.promotion = objects || [];
      }
    });
  },
});

// const {actions} = slice;
export const actions = {...slice.actions, getPromotion};

export type PromotionAction = typeof actions;

export default slice.reducer as Reducer<PromotionModelState, AnyAction>;
