import {createAction, handleActions} from 'redux-actions';
import {pender} from 'redux-pender/lib/utils';
import {API} from '@/submodules/rokebi-utils';
import {RkbPromotion} from '@/submodules/rokebi-utils/api/promotionApi';

const GET_PROMOTION_LIST = 'rokebi/product/GET_PROMOTION_LIST';

export const getPromotion = createAction(
  GET_PROMOTION_LIST,
  API.Promotion.getPromotion,
);

export const actions = {getPromotion};

export type PromotionAction = typeof actions;

export interface PromotionModelState {
  promotion: RkbPromotion[];
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
