import {createAction, handleActions} from 'redux-actions';
import _ from 'underscore';
import {pender} from 'redux-pender';
import {API} from 'RokebiESIM/submodules/rokebi-utils';

const GET_INFO_LIST = 'rokebi/info/GET_INFO_LIST';
const GET_HOME_INFO_LIST = 'rokebi/info/GET_HOME_INFO_LIST';

export const getInfoList = createAction(
  GET_INFO_LIST,
  API.Page.getPageByCategory,
);
export const getHomeInfoList = createAction(
  GET_HOME_INFO_LIST,
  API.Page.getPageByCategory,
);

interface InfoModelState {
  infoList: object[];
  homeInfoList: object[];
}

const initialState: InfoModelState = {
  infoList: [],
  homeInfoList: [],
};

export default handleActions(
  {
    ...pender<InfoModelState>({
      type: GET_INFO_LIST,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0 && objects.length > 0) {
          return {
            ...state,
            infoList: objects,
          };
        }
        return state;
      },
    }),

    ...pender<InfoModelState>({
      type: GET_HOME_INFO_LIST,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0 && objects.length > 0) {
          return {
            ...state,
            homeInfoList: objects,
          };
        }
        return state;
      },
    }),
  },
  initialState,
);
