import {configureStore} from '@reduxjs/toolkit';
import reducer from '@/redux/index';
import ReduxThunk from 'redux-thunk';
const createDebugger = require('redux-flipper').default; // <-- ADD THIS

const store = configureStore({
  reducer,
  middleware: [ReduxThunk].concat(createDebugger()),
});
export type AppDispatch = typeof store.dispatch;
export default store;
