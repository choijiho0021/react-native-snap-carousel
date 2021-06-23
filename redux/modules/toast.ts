import {createAction} from 'redux-actions';
import {List} from 'immutable';
import {Toast} from '@/constants/CustomTypes';
import handleActions from '../handleActions';

const INIT = 'rokebi/toast/INIT';
const PUSH = 'rokebi/toast/PUSH';
const REMOVE = 'rokebi/toast/REMOVE';

export const init = createAction(INIT);
export const push = createAction(PUSH);
export const remove = createAction(REMOVE);

interface ToastModelState {
  messages: List<string>;
}

const initialState: ToastModelState = {
  messages: List(),
};

export default handleActions(
  {
    [INIT]: (state, action) => {
      return initialState;
    },
    [PUSH]: (state, action) => {
      const {messages} = state;
      const newMsg: string = action.payload || Toast.NOT_LOADED;

      if (!messages.contains(newMsg)) {
        return {
          ...state,
          messages: messages.push(newMsg),
        };
      }
      return state;
    },
    [REMOVE]: (state, action) => {
      const {messages} = state;
      return {
        ...state,
        messages: messages.remove(0),
      };
    },
  },
  initialState,
);
