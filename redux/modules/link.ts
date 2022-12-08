/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {createSlice} from '@reduxjs/toolkit';

export interface LinkModelState {
  url?: string;
  recommender?: string;
  gift?: string;
  utmParameters?: any;
  params: object;
}

const initialState: LinkModelState = {
  url: undefined,
  recommender: undefined,
  gift: undefined,
  utmParameters: undefined,
  params: {},
};

const slice = createSlice({
  name: 'link',
  initialState,
  reducers: {
    init: () => {
      return initialState;
    },
    update: (state, action) => {
      const {url, recommender, gift, utmParameters, params} =
        action.payload || {};
      state.url = url;
      state.recommender = recommender;
      state.gift = gift;
      state.utmParameters = utmParameters;
      state.params = params;
    },
  },
});

export const {actions} = slice;
export type LinkAction = typeof actions;
export default slice.reducer as Reducer<LinkModelState, AnyAction>;
