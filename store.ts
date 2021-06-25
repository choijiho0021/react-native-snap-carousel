import {configureStore} from '@reduxjs/toolkit';
import reducer from '@/redux/index';
import ReduxThunk from 'redux-thunk';
import penderMiddleware from 'redux-pender';

const store = configureStore({
  reducer,
  middleware: [ReduxThunk, penderMiddleware()] as const,
});
export type AppDispatch = typeof store.dispatch;
export default store;
