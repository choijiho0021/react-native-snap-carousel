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

const getGiftBgImages = createAsyncThunk(
  'promotion/getGiftBgImages',
  API.Promotion.getGiftBgImages,
);

const makeGiftContents = createAsyncThunk(
  'promotion/makeGiftContents',
  API.Promotion.createContent,
);

export interface PromotionModelState {
  promotion: RkbPromotion[];
  invite?: RkbPromotion;
  stat: RkbInviteStatInfo;
  gift: {
    bg: RkbGiftImages[];
    uuid: string;
    imageUrl: string;
  };
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
  gift: {
    bg: [],
    uuid: '',
    imageUrl: '',
  },
};

const slice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPromotion.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;
      // invite, gift는 동일한 프로모션에 포함.
      const invite = objects.find((v) => !_.isEmpty(v.notice?.rule?.share));
      const giftImage = invite?.notice?.rule?.gift;

      if (result === 0 || result?.code === 0) {
        state.promotion = objects || [];
        state.invite = invite;
        state.gift.imageUrl = giftImage || '';
      }
    });

    builder.addCase(getPromotionStat.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0 || result?.code === 0) {
        state.stat = objects[0];
      }
    });

    builder.addCase(getGiftBgImages.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0 || result?.code === 0) {
        state.gift.bg = objects;
      }
    });

    builder.addCase(makeGiftContents.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0 || result?.code === 0) {
        state.gift.uuid = objects[0].uuid;
      }
    });
  },
});

// const {actions} = slice;
export const actions = {
  ...slice.actions,
  getPromotion,
  getPromotionStat,
  getGiftBgImages,
  makeGiftContents,
};

export type PromotionAction = typeof actions;

export default slice.reducer as Reducer<PromotionModelState, AnyAction>;
