import {configureStore} from '@reduxjs/toolkit';
import ReduxThunk from 'redux-thunk';
import reducer from '@/redux/index';

const middlewares = [ReduxThunk];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const store = configureStore({
  reducer,
  middleware: middlewares,
});
export type AppDispatch = typeof store.dispatch;
export default store;
