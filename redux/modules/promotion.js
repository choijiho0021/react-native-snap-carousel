import {createAction, handleActions} from 'redux-actions';
import {Map} from 'immutable';
import {pender} from 'redux-pender/lib/utils';
import {API} from 'Rokebi/submodules/rokebi-utils';

const GET_PROMOTION_LIST = 'rokebi/product/GET_PROMOTION_LIST';

export const getPromotion = createAction(
  GET_PROMOTION_LIST,
  API.Promotion.getPromotion,
);

const initialState = Map({
  promotion: [],
});

export default handleActions(
  {
    ...pender({
      type: GET_PROMOTION_LIST,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;

        if (result == 0 && objects.length > 0) {
          return state.set('promotion', objects);
        }
        return state;
      },
    }),
  },
  initialState,
);
