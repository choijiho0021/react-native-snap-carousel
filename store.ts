import {configureStore} from '@reduxjs/toolkit';
import ReduxThunk from 'redux-thunk';
import reducer from '@/redux/index';

const createDebugger = require('redux-flipper').default; // <-- ADD THIS

const store = configureStore({
  reducer,
  middleware: [ReduxThunk].concat(createDebugger()),
});
export type AppDispatch = typeof store.dispatch;
export default store;
