import {createAction, handleActions} from 'redux-actions';
import {pender} from 'redux-pender';
import {API} from '@/submodules/rokebi-utils';
import {AppThunk} from '..';

const UPDATE_PROFILE_ADDRESS = 'rokebi/order/UPDATE_PROFILE_ADDRESS';
const GET_CUSTOMER_PROFILE = 'rokebi/order/GET_CUSTOMER_PROFILE';
const ADD_CUSTOMER_PROFILE = 'rokebi/order/ADD_CUSTOMER_PROFILE';
const UPDATE_CUSTOMER_PROFILE = 'rokebi/order/UPDATE_CUSTOMER_PROFILE';
const DELETE_CUSTOMER_PROFILE = 'rokebi/order/DELETE_CUSTOMER_PROFILE';
const SELECTED_ADDR = 'rokebi/order/SELECTED_ADDR';

// add address list
export const updateProfileAddress = createAction(UPDATE_PROFILE_ADDRESS);
export const getCustomerProfile = createAction(
  GET_CUSTOMER_PROFILE,
  API.Profile.getCustomerProfile,
);
export const addCustomerProfile = createAction(
  ADD_CUSTOMER_PROFILE,
  API.Profile.addCustomerProfile,
);
export const updateCustomerProfile = createAction(
  UPDATE_CUSTOMER_PROFILE,
  API.Profile.updateCustomerProfile,
);
export const delCustomerProfile = createAction(
  DELETE_CUSTOMER_PROFILE,
  API.Profile.delCustomerProfile,
);
export const selectedAddr = createAction(SELECTED_ADDR);

export const actions = {
  updateProfileAddress,
  getCustomerProfile,
  addCustomerProfile,
  updateCustomerProfile,
  delCustomerProfile,
  selectedAddr,
};

export type ProfileAction = typeof actions;

interface ProfileModelState {
  // selectedAddrIdx: undefined,
  selectedAddr?: string;
  profile: object[];
  addr: object;
}

const initialState: ProfileModelState = {
  // selectedAddrIdx: undefined,
  profile: [],
  addr: {},
};

export const profileDelAndGet = (uuid: string, account): AppThunk => (
  dispatch,
  getState,
) => {
  const {
    profile: {profile: pf},
  } = getState();
  const deleted = pf.find((item) => item.uuid === uuid);
  const updateProfile = pf.find((item) => item.uuid !== uuid);

  return dispatch(delCustomerProfile(uuid, account)).then(
    (resp) => {
      if (resp.result === 0) {
        if (deleted && deleted.isBasicAddr && updateProfile) {
          return dispatch(
            updateCustomerProfile(
              {
                ...updateProfile,
                isBasicAddr: true,
              },
              account,
            ),
          ).then((res) => {
            return dispatch(getCustomerProfile(account));
          });
        }
        return dispatch(getCustomerProfile(account));
      }
      throw new Error('Failed to delete Profile');
    },
    (err) => {
      throw err;
    },
  );
};

export const profileAddAndGet = (
  profile,
  defaultProfile,
  account,
): AppThunk => (dispatch) => {
  return dispatch(addCustomerProfile(profile, defaultProfile, account)).then(
    (resp) => {
      return dispatch(getCustomerProfile(account));
    },
    (err) => {
      throw err;
    },
  );
};

const sortProfile = (a, b) => {
  if (a.isBasicAddr) return -1;
  if (b.isBasicAddr) return 1;
  return a.alias.localeCompare(b.alias);
};

export default handleActions(
  {
    // addr uuid
    [SELECTED_ADDR]: (state, action) => {
      return {
        ...state,
        selectedAddr: action.payload,
      };
    },

    [UPDATE_PROFILE_ADDRESS]: (state, action) => {
      console.log('update profile address!! action', action);
      return {
        ...state,
        addr: {
          ...action.payload,
          // provinceCd : findEngAddress.city[provinceNumber]
        },
      };
    },

    ...pender<ProfileModelState>({
      type: GET_CUSTOMER_PROFILE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;

        if (result === 0 && objects.length >= 0) {
          // const list = state.get('profile')
          // const idx = list.findIndex(item => item.isBasicAddr)
          // if(idx>0){
          //   const tmp = Object.assign({}, list[0])
          //   list[0] = list[idx]
          //   list[idx] = tmp
          // }

          // const list = state.get('profile')
          // const idx = list.findIndex(item => item.isBasicAddr)
          // if(idx > 0){

          return {
            ...state,
            profile: objects.sort(sortProfile),
          };
          // }
        }
        return state;
      },
    }),

    ...pender<ProfileModelState>({
      type: ADD_CUSTOMER_PROFILE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;
        const {profile} = state;

        if (result === 0 && objects.length > 0) {
          return {
            ...state,
            profile: objects.concat(profile).sort(sortProfile),
          };
        }
        return state;
      },
    }),

    ...pender<ProfileModelState>({
      type: UPDATE_CUSTOMER_PROFILE,
      onSuccess: (state, action) => {
        const {result, objects} = action.payload;

        if (result === 0 && objects.length > 0) {
          console.log('pender update', objects);

          const {profile} = state;
          const idx = profile.findIndex(
            (item) => item.uuid === objects[0].uuid,
          );
          // TODO : profile[]을 변경하는데, state.update()는 호출이 안됨. 목적이 무엇인지?
          profile[idx] = objects[0];

          // 이전 기본배송지 profile IDX
          const prevIdx = profile.findIndex(
            (item) => item.uuid !== objects[0].uuid && item.isBasicAddr,
          );

          // 현재 배송지를 기본배송지로 update할 경우, 이전 것 false로 변경
          if (objects[0].isBasicAddr && prevIdx >= 0) {
            profile[prevIdx] = {...profile[prevIdx], isBasicAddr: false};
          }

          return {
            ...state,
            profile: profile.sort(sortProfile),
          };
        }
        return state;
      },
    }),
  },
  initialState,
);
