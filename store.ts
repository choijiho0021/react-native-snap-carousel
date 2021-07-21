import {configureStore} from '@reduxjs/toolkit';
import reducer from '@/redux/index';
import ReduxThunk from 'redux-thunk';

const store = configureStore({
  reducer,
  middleware: [ReduxThunk] as const,
});
export type AppDispatch = typeof store.dispatch;
export default store;
