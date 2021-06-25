import {API} from '@/submodules/rokebi-utils';
import {RkbPromotion} from '@/submodules/rokebi-utils/api/promotionApi';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

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
export const actions = {getPromotion};

export type PromotionAction = typeof actions;

export default slice.reducer;
