import {createAction} from 'redux-actions';
import {Map as ImmutableMap} from 'immutable';
import {pender} from 'redux-pender/lib/utils';
import {API} from '@/submodules/rokebi-utils';
import {reflectWithToast} from '@/utils/utils';
import {RkbLocalOp, RkbProduct} from '@/submodules/rokebi-utils/api/productApi';
import {AppThunk} from '..';
import handleActions from '../handleActions';

const GET_PROD_LIST = 'rokebi/product/GET_PROD_LIST' as const;
const GET_LOCAL_OP_LIST = 'rokebi/product/GET_LOCAL_OP_LIST' as const;
export const SET_PROD_OF_COUNTRY = 'rokebi/product/SET_PROD_OF_COUNTRY' as const;
export const SET_SORTED_PROD_LIST = 'rokebi/product/SET_SORTED_PROD_LIST' as const;
export const GET_PROD_DETAIL = 'rokebi/product/GET_PROD_DETAIL' as const;

const getProd = createAction(GET_PROD_LIST, API.Product.getProduct);
const getLocalOp = createAction(GET_LOCAL_OP_LIST, API.Product.getLocalOp);
const getProdDetailPage = createAction(
  GET_PROD_DETAIL,
  API.Page.getProductDetails,
);
export const setProdOfCountry = createAction(SET_PROD_OF_COUNTRY);
export const setSortedProdList = createAction(SET_SORTED_PROD_LIST);

export interface ProductModelState {
  prodList: ImmutableMap<string, RkbProduct>;
  localOpList: ImmutableMap<string, RkbLocalOp>;
  prodOfCountry: RkbProduct[];
  sortedProdList: RkbProduct[][];
  detailInfo: string;
  detailCommon: string;
}

export const getProdDetail = (controller: AbortController): AppThunk => (
  dispatch,
  getState,
) => {
  const {product} = getState();
  if (product.detailInfo === '') return dispatch(getProdDetailPage(controller));
  return Promise.resolve();
};

createAction(GET_PROD_DETAIL, API.Page.getProductDetails);

export const getProdList = (): AppThunk => async (dispatch) => {
  await Promise.resolve(dispatch(getProd()));
  return dispatch(getLocalOp());
};

export const getProdListWithToast = reflectWithToast(getProdList);

export const actions = {
  setProdOfCountry,
  setSortedProdList,
  getProdDetail,
  getProdList,
  getProdListWithToast,
};
export type ProductAction = typeof actions;

const initialState = {
  prodList: ImmutableMap<string, RkbProduct>(),
  localOpList: ImmutableMap<string, RkbLocalOp>(),
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
