/* eslint-disable no-param-reassign */
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {Reducer} from 'react';
import {AnyAction} from 'redux';
import _ from 'underscore';
import {
  RkbGiftImages,
  RkbInviteStatInfo,
  RkbPromotion,
} from '@/redux/api/promotionApi';
import {API} from '@/redux/api';
import {RkbSubscription} from '../api/subscriptionApi';
import api from '../api/api';

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

const createContent = createAsyncThunk(
  'promotion/createContent',
  API.Promotion.createContent,
);

const buildLink = createAsyncThunk(
  'promotion/buildLink',
  API.Promotion.buildLink,
);

const buildGiftLink = createAsyncThunk(
  'promotion/buildGiftLink',
  API.Promotion.buildGiftLink,
);

const makeContentAndLink = createAsyncThunk(
  'promotion/makeContentAndLink',
  (
    {msg, item, image}: {msg: string; item: RkbSubscription; image: string},
    {dispatch, getState},
  ) => {
    const {
      account: {userId, token},
      promotion: {
        stat: {signupGift},
        gift: {imageUrl},
      },
    } = getState() as RootState;

    if (!userId || !token) return undefined;

    const {uuid, nid} = item;
    // 앱 연결 링크(선물 등록 링크)
    return dispatch(
      buildLink({
        recommender: userId,
        cash: signupGift,
        imageUrl,
        subsId: uuid,
      }),
    ).then(async (rsp) => {
      const link = rsp?.payload;

      // gift content 생성
      if (link) {
        const {payload} = await dispatch(
          createContent({msg, nid, image, token, link}),
        );
        if (payload?.result?.code === 0) {
          const giftId = payload?.objects[0]?.uuid;
          if (giftId) {
            const url = `${api.httpUrl(api.path.gift.web)}/${giftId}`;
            const res = await dispatch(buildGiftLink({link: url, imageUrl}));

            return res?.payload;
          }
        }
      }
      return undefined;
    });
  },
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

    builder.addCase(createContent.fulfilled, (state, {payload}) => {
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
  makeContentAndLink,
};

export type PromotionAction = typeof actions;

export default slice.reducer as Reducer<PromotionModelState, AnyAction>;
