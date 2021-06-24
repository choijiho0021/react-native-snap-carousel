import {createAction, handleActions} from 'redux-actions';
import {pender} from 'redux-pender';
import {API} from '@/submodules/rokebi-utils';

const ADD_ICCID = 'rokebi/sim/ADD_ICCID';
export const UPDATE_SIM_PARTNER = 'rokebi/sim/UPDATE_SIM_PARTNER';
export const GET_SIM_CARD_LIST = 'rokebi/sim/GET_SIM_CARD_LIST';

export const addIccid = createAction(ADD_ICCID);
export const updateSimPartner = createAction(
  UPDATE_SIM_PARTNER,
  API.SimCard.getSimPartnerByID,
);
export const getSimCardList = createAction(GET_SIM_CARD_LIST, API.SimCard.get);

export const actions = {
  addIccid,
  updateSimPartner,
  getSimCardList,
};

export type SimAction = typeof actions;

export interface SimModelState {
  iccid?: string;
  simPartner?: string;
  simList: object[];
}

const initialState: SimModelState = {
  simList: [],
};

export default handleActions(
  {
    [ADD_ICCID]: (state, action) => {
      return {
        ...state,
        iccid: action.payload.iccid,
      };
    },

    ...pender<SimModelState>({
      type: GET_SIM_CARD_LIST,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0 && objects.length > 0) {
          return {
            ...state,
            simList: objects,
          };
        }
        return state;
      },
    }),

    ...pender<SimModelState>({
      type: UPDATE_SIM_PARTNER,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        if (result === 0 && objects.length > 0) {
          return {
            ...state,
            simPartner: objects[0],
          };
        }
        return state;
      },
    }),
  },
  initialState,
);
