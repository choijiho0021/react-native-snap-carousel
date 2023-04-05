/* eslint-disable no-param-reassign */
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {Reducer} from 'react';
import {AnyAction} from 'redux';
import _ from 'underscore';
import {Map as ImmutableMap} from 'immutable';
import {
  RkbGiftImages,
  RkbInviteStatInfo,
  RkbPromotion,
} from '@/redux/api/promotionApi';
import {API} from '@/redux/api';
import {RkbSubscription} from '@/redux/api/subscriptionApi';

const getPromotion = createAsyncThunk(
  'promotion/getPromotion',
  API.default.reloadOrCallApi(
    'cache.promotion',
    undefined,
    API.Promotion.getPromotion,
  ),
);

const getEvent = createAsyncThunk(
  'event/getEvent',
  API.default.reloadOrCallApi('cache.event', undefined, API.Promotion.getEvent),
);

const getPromotionStat = createAsyncThunk(
  'promotion/getPromotionStat',
  API.default.reloadOrCallApi(
    'cache.promotionStat',
    undefined,
    API.Promotion.getStat,
  ),
);

const getGiftBgImages = createAsyncThunk(
  'promotion/getGiftBgImages',
  API.default.reloadOrCallApi(
    'cache.giftBgImages',
    undefined,
    API.Promotion.getGiftBgImages,
  ),
);

const createContent = createAsyncThunk(
  'promotion/createContent',
  API.Promotion.createContent,
);

const buildLink = createAsyncThunk(
  'promotion/buildLink',
  API.Promotion.buildLink,
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
            return giftId;
          }
        }
      }
      return undefined;
    });
  },
);

export interface PromotionModelState {
  promotion: RkbPromotion[];
  popUpPromotionMap?: ImmutableMap<string, RkbPromotion[]>;
  invite?: RkbPromotion;
  stat: RkbInviteStatInfo;
  gift: {
    bg: RkbGiftImages[];
    uuid: string;
    imageUrl: string;
  };
  receive: {
    sender?: string;
    gift?: string;
  };
}

const initialState: PromotionModelState = {
  promotion: [],
  popUpPromotionMap: ImmutableMap(),
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
  receive: {
    sender: undefined,
    gift: undefined,
  },
};

const slice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {
    saveGiftAndRecommender: (state, {payload}) => {
      const {recommender, gift} = payload;
      if (recommender && gift) {
        state.receive.gift = gift;
        state.receive.sender = recommender;
      }
    },
    removeGiftAndRecommender: (state) => {
      state.receive.gift = undefined;
      state.receive.sender = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPromotion.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;
      // invite, gift는 동일한 프로모션에 포함.
      const invite = objects.find((v) => !_.isEmpty(v.rule?.share));
      const giftImage = invite?.rule?.gift;

      const popUpPromotionMap = objects.reduce((acc, cur) => {
        if (cur.rule?.display?.type !== 'banner' && !cur.popUpDisabled) {
          if (acc.has(cur.rule?.display?.routeName)) {
            acc.set(
              cur.rule?.display?.routeName,
              (acc.get(cur.rule?.display?.routeName) || []).concat(cur),
            );
          } else {
            acc.set(cur.rule?.display?.routeName, [cur]);
          }
        }
        return acc;
      }, new Map<string, RkbPromotion[]>());

      if (result === 0) {
        state.promotion = objects || [];
        state.popUpPromotionMap = ImmutableMap(popUpPromotionMap);
        state.invite = invite;
        state.gift.imageUrl = giftImage || '';
      }
    });

    builder.addCase(getPromotionStat.fulfilled, (state, {payload}) => {
      const {result, objects} = payload;

      if (result === 0) {
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

const saveGiftAndRecommender = createAsyncThunk(
  'promotion/saveGiftAndRecommender',
  ({recommender, gift}: {recommender: string; gift: string}, {dispatch}) => {
    dispatch(slice.actions.saveGiftAndRecommender({recommender, gift}));
  },
);

const removeGiftAndRecommender = createAsyncThunk(
  'promotion/saveGiftAndRecommender',
  ({sender, gift}: {sender: string; gift: string}, {dispatch}) => {
    if (sender && gift) dispatch(slice.actions.removeGiftAndRecommender());
  },
);

// const {actions} = slice;
export const actions = {
  ...slice.actions,
  getEvent,
  getPromotion,
  getPromotionStat,
  getGiftBgImages,
  makeContentAndLink,
  saveGiftAndRecommender,
  removeGiftAndRecommender,
};

export type PromotionAction = typeof actions;

export default slice.reducer as Reducer<PromotionModelState, AnyAction>;
