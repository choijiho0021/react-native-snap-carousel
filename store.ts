import {configureStore} from '@reduxjs/toolkit';
import ReduxThunk from 'redux-thunk';
import reducer from '@/redux/index';
import moment from 'moment';
import utils from '@/redux/api/utils';

// client 로그 수집
// const logMiddleware = (store) => (next) => (action) => {
//   if (!action?.type.includes('log') && !action?.type.includes('pending')) {
//     utils.log(
//       `${moment().tz('Asia/Seoul').format()} ${JSON.stringify(action)}\n`,
//     );
//   }

//   return next(action);
// };

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
