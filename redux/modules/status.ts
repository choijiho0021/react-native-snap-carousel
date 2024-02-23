/* eslint-disable no-param-reassign */
import {AnyAction} from 'redux';
import {Reducer} from 'redux-actions';
import {createSlice} from '@reduxjs/toolkit';

type ActionStatusModelState = {
  pending: Record<string, boolean>;
  fulfilled: Record<string, boolean>;
  rejected: Record<string, boolean>;
};

const initialState: ActionStatusModelState = {
  pending: {},
  fulfilled: {},
  rejected: {},
};

const slice = createSlice({
  name: 'status',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state, action) => {
        const key = action.type.substr(
          0,
          action.type.length - '/pending'.length,
        );
        state.pending[key] = true;
        state.fulfilled[key] = false;
        state.rejected[key] = false;
      },
    );

    builder.addMatcher(
      // matcher can be defined inline as a type predicate function
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        const key = action.type.substr(
          0,
          action.type.length - '/rejected'.length,
        );
        state.rejected[key] = true;
        state.pending[key] = false;
        state.fulfilled[key] = false;
      },
    );

    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled'),
      (state, action) => {
        const key = action.type.substr(
          0,
          action.type.length - '/fulfilled'.length,
        );
        state.fulfilled[key] = true;
        state.pending[key] = false;
        state.rejected[key] = false;
      },
    );
  },
});

export default slice.reducer as Reducer<ActionStatusModelState, AnyAction>;
