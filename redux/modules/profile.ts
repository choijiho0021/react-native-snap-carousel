/* eslint-disable no-param-reassign */
import {Reducer} from 'redux-actions';
import {AnyAction} from 'redux';
import {createAsyncThunk, createSlice, RootState} from '@reduxjs/toolkit';
import {API} from '@/redux/api';
import {RkbProfile} from '@/redux/api/profileApi';

// add address list
export const getCustomerProfile = createAsyncThunk(
  'profile/getCustomer',
  API.Profile.getCustomerProfile,
);
export const addCustomerProfile = createAsyncThunk(
  'profile/addCustomer',
  API.Profile.addCustomerProfile,
);
export const updateCustomerProfile = createAsyncThunk(
  'profile/updateCustomer',
  API.Profile.updateCustomerProfile,
);
export const delCustomerProfile = createAsyncThunk(
  'profile/delCustomer',
  API.Profile.delCustomerProfile,
);

export interface ProfileModelState {
  // selectedAddrIdx: undefined,
  selectedAddr?: string;
  profile: RkbProfile[];
  addr: object;
  content?: string;
}

const initialState: ProfileModelState = {
  // selectedAddrIdx: undefined,
  profile: [],
  addr: {},
};

const profileDelAndGet = createAsyncThunk(
  'profile/delAndGet',
  ({uuid, token}: {uuid: string; token: string}, {dispatch, getState}) => {
    const {
      account: {uid},
      profile: {profile: pf},
    } = getState() as RootState;

    const deleted = pf.find((item) => item.uuid === uuid);
    const updateProfile = pf.find((item) => item.uuid !== uuid);

    return dispatch(delCustomerProfile({uuid, token})).then(
      ({payload: resp}) => {
        if (resp.result === 0) {
          if (deleted && deleted.isBasicAddr && updateProfile) {
            return dispatch(
              updateCustomerProfile({
                profile: {...updateProfile, isBasicAddr: true},
                token,
              }),
            ).then(() => dispatch(getCustomerProfile({uid, token})));
          }
          return dispatch(getCustomerProfile({uid, token}));
        }
        throw new Error('Failed to delete Profile');
      },
      (err) => {
        throw err;
      },
    );
  },
);

const profileAddAndGet = createAsyncThunk(
  'profile/addAndGet',
  ({profile, token}: {profile: RkbProfile; token: string}, {dispatch}) =>
    dispatch(addCustomerProfile({profile, token})).then(
      () => dispatch(getCustomerProfile({token})),
      (err) => {
        throw err;
      },
    ),
);

const sortProfile = (a: RkbProfile, b: RkbProfile) => {
  if (a.isBasicAddr) return -1;
  if (b.isBasicAddr) return 1;
  return a.alias.localeCompare(b.alias);
};

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // addr uuid
    selectedAddr: (state, action) => {
      state.selectedAddr = action.payload;
    },
    updateProfileAddress: (state, action) => {
      console.log('update profile address!! action', action);
      state.addr = action.payload;
      // provinceCd : findEngAddress.city[provinceNumber]
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCustomerProfile.fulfilled, (state, action) => {
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

        state.profile = objects.sort(sortProfile);
        // }
      }
    });

    builder.addCase(addCustomerProfile.fulfilled, (state, action) => {
      const {result, objects} = action.payload;
      const {profile} = state;

      if (result === 0 && objects.length > 0) {
        state.profile = objects.concat(profile).sort(sortProfile);
      }
    });

    builder.addCase(updateCustomerProfile.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects.length > 0) {
        const {profile} = state;
        const idx = profile.findIndex((item) => item.uuid === objects[0].uuid);
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

        state.profile = profile.sort(sortProfile);
      }
    });
  },
});

export const actions = {
  ...slice.actions,
  getCustomerProfile,
  addCustomerProfile,
  updateCustomerProfile,
  delCustomerProfile,
  profileAddAndGet,
  profileDelAndGet,
};

export type ProfileAction = typeof actions;

export default slice.reducer as Reducer<ProfileModelState, AnyAction>;
