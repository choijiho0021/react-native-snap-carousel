import {createAction, handleActions} from 'redux-actions';
import {pender} from 'redux-pender/lib/utils';
import {API} from 'RokebiESIM/submodules/rokebi-utils';

const GET_PROMOTION_LIST = 'rokebi/product/GET_PROMOTION_LIST';

export const getPromotion = createAction(
  GET_PROMOTION_LIST,
  API.Promotion.getPromotion,
);

interface Promotion {}
export interface PromotionModelState {
  promotion: Promotion[];
}

const initialState: PromotionModelState = {
  promotion: [],
};

export default handleActions(
  {
    ...pender<PromotionModelState>({
      type: GET_PROMOTION_LIST,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;

        if (result === 0 && objects.length > 0) {
          return {
            ...state,
            promotion: objects,
          };
        }
        return state;
      },
    }),
  },
  initialState,
);
