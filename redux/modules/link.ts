/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {createSlice} from '@reduxjs/toolkit';

export interface LinkModelState {
  url?: string;
  recommender?: string;
  gift?: string;
  utmParameters?: any;
}

const initialState: LinkModelState = {
  url: undefined,
  recommender: undefined,
  gift: undefined,
  utmParameters: undefined,
};

const slice = createSlice({
  name: 'link',
  initialState,
  reducers: {
    init: () => {
      return initialState;
    },
    update: (state, action) => {
      const {url, recommender, gift, utmParameters} = action.payload || {};
      state.url = url;
      state.recommender = recommender;
      state.gift = gift;
      state.utmParameters = utmParameters;
    },
  },
});

export const {actions} = slice;
export type LinkAction = typeof actions;
export default slice.reducer as Reducer<LinkModelState, AnyAction>;
