/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {createSlice} from '@reduxjs/toolkit';

export interface urlParamObj {
  screen?: string;
  stack?: string;
  recommender?: string;
  gift?: string;

  [key: string]: string | undefined;
}

export interface LinkModelState {
  url?: string;
  recommender?: string;
  gift?: string;
  utmParameters?: any;
  deepLinkPath?: string;
  params: urlParamObj;
}

const initialState: LinkModelState = {
  url: undefined,
  recommender: undefined,
  gift: undefined,
  utmParameters: undefined,
  deepLinkPath: undefined,
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
      const {url, recommender, gift, utmParameters, deepLinkPath, params} =
        action.payload || {};
      state.url = url;
      state.recommender = recommender;
      state.gift = gift;
      state.utmParameters = utmParameters;
      state.deepLinkPath = deepLinkPath;
      state.params = params;
    },
  },
});

export const {actions} = slice;
export type LinkAction = typeof actions;
export default slice.reducer as Reducer<LinkModelState, AnyAction>;
