/* eslint-disable no-param-reassign */
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Reducer} from 'react';
import {AnyAction} from 'redux';
import _ from 'underscore';
import {
  RkbGiftImages,
  RkbInviteStatInfo,
  RkbPromotion,
} from '@/redux/api/promotionApi';
import {API} from '@/redux/api';

const getPromotion = createAsyncThunk(
  'promotion/getPromotion',
  API.Promotion.getPromotion,
);

const getPromotionStat = createAsyncThunk(
  'promotion/getPromotionStat',
  API.Promotion.getStat,
);

const getGiftImages = createAsyncThunk(
  'promotion/getGiftImages',
  API.Promotion.getGiftImages,
);

export interface PromotionModelState {
  promotion: RkbPromotion[];
  invite?: RkbPromotion;
  stat: RkbInviteStatInfo;
  giftImages: RkbGiftImages[];
}

const initialState: PromotionModelState = {
  promotion: [],
  invite: undefined,
  stat: {
    inviteCount: '0',
    rokebiCash: '0',
    signupGift: '0',
    recommenderGift: '0',
  },
  giftImages: [],
};

const slice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPromotion.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;
      const invite = objects.find((v) => !_.isEmpty(v.notice?.rule?.share));

      if (result === 0 || result?.code === 0) {
        state.promotion = objects || [];
        state.invite = invite;
      }
    });

    builder.addCase(getPromotionStat.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0 || result?.code === 0) {
        state.stat = objects[0];
      }
    });

    builder.addCase(getGiftImages.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0 || result?.code === 0) {
        state.giftImages = objects;
      }
    });
  },
});

// const {actions} = slice;
export const actions = {
  ...slice.actions,
  getPromotion,
  getPromotionStat,
  getGiftImages,
};

export type PromotionAction = typeof actions;

export default slice.reducer as Reducer<PromotionModelState, AnyAction>;
