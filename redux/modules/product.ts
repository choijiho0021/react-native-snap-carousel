import {createAction, handleActions} from 'redux-actions';
import {Map as ImmutableMap} from 'immutable';
import {pender} from 'redux-pender/lib/utils';
import {API} from 'RokebiESIM/submodules/rokebi-utils';
import utils from '../../utils/utils';
import {AppThunk} from '..';

const GET_PROD_LIST = 'rokebi/product/GET_PROD_LIST';
const GET_LOCAL_OP_LIST = 'rokebi/product/GET_LOCAL_OP_LIST';
export const SET_PROD_OF_COUNTRY = 'rokebi/product/SET_PROD_OF_COUNTRY';
export const SET_SORTED_PROD_LIST = 'rokebi/product/SET_SORTED_PROD_LIST';
export const GET_PROD_DETAIL = 'rokebi/product/GET_PROD_DETAIL';

const getProd = createAction(GET_PROD_LIST, API.Product.getProduct);
const getLocalOp = createAction(GET_LOCAL_OP_LIST, API.Product.getLocalOp);
const getProdDetailPage = createAction(
  GET_PROD_DETAIL,
  API.Page.getProductDetails,
);
export const setProdOfCountry = createAction(SET_PROD_OF_COUNTRY);
export const setSortedProdList = createAction(SET_SORTED_PROD_LIST);

interface ProductModelState {
  prodList: ImmutableMap<string, object>;
  localOpList: ImmutableMap<string, object>;
  prodOfCountry: object[];
  sortedProdList: object[];
  detailInfo: string;
  detailCommon: string;
}

export const getProdDetail = (controller): AppThunk => (dispatch, getState) => {
  const {product} = getState();
  if (product.detailInfo === '') return dispatch(getProdDetailPage(controller));
  return new Promise.resolve();
};

createAction(GET_PROD_DETAIL, API.Page.getProductDetails);

export const getProdList = (): AppThunk => (dispatch) => {
  return dispatch(getProd()).then((_) => {
    return dispatch(getLocalOp());
  });
};

export const getProdListWithToast = utils.reflectWithToast(getProdList);

const initialState = {
  prodList: ImmutableMap(),
  localOpList: ImmutableMap(),
  prodOfCountry: [],
  sortedProdList: [],
  detailInfo: '',
  detailCommon: '',
};

export default handleActions(
  {
    ...pender<ProductModelState>({
      type: GET_PROD_DETAIL,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        const details = objects.map((item) => item.body);
        if (result === 0 && details.length > 0) {
          return {
            ...state,
            detailInfo: details[0],
            detailCommon: details.slice(1, details.length).join(''),
          };
        }
        return state;
      },
    }),

    ...pender<ProductModelState>({
      type: GET_PROD_LIST,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;

        if (result === 0 && objects.length > 0) {
          return {
            ...state,
            prodList: ImmutableMap(objects.map((item) => [item.key, item])),
          };
        }
        return state;
      },
    }),

    ...pender<ProductModelState>({
      type: GET_LOCAL_OP_LIST,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;

        if (result === 0 && objects.length > 0) {
          return {
            ...state,
            localOpList: ImmutableMap(objects.map((item) => [item.key, item])),
          };
        }
        return state;
      },
    }),

    // bhtak
    // payload type 정의 필요
    [SET_SORTED_PROD_LIST]: (state, action) => {
      return {
        ...state,
        sortedProdList: action.payload,
      };
    },

    [SET_PROD_OF_COUNTRY]: (state, action) => {
      return {
        ...state,
        prodOfCountry: action.payload,
      };
    },
  },
  initialState,
);
