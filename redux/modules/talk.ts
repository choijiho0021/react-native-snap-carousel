/* eslint-disable no-param-reassign */
import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Contacts from 'react-native-contacts';
import {AnyAction} from 'redux';
import {Reducer} from 'redux-actions';
import {API} from '@/redux/api';
import {checkEng, checkKor} from '@/constants/CustomTypes';

// 10 items per page
const PAGE_LIMIT = 10;
const PAGE_UPDATE = 0;

export const updateContacts = createAction('rkbTalk/updateContact');
export const updateRecordSet = createAction('rkbTalk/updateRecordSet');
const resetWithoutContacts = createAction('rkbTalk/resetWithoutContacts');
const getLocalOp = createAsyncThunk(
  'rkbTalk/getLocalOp',
  API.Product.getLocalOp,
);

export const sortName = (a, b) => {
  const nameA = a.familyName + a.givenName;
  const nameB = b.familyName + b.givenName;

  const priorityA = checkKor.test(nameA) ? -2 : checkEng.test(nameA) ? -1 : 0;
  const priorityB = checkKor.test(nameB) ? -2 : checkEng.test(nameB) ? -1 : 0;

  if (priorityA > priorityB) return priorityA;
  if (priorityA === priorityB)
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  return priorityB;
};

export interface TalkModelState {
  point: string;
  recordIDSet: Set<string>;
  contacts: any[];
}

const initialState: TalkModelState = {
  point: '0,000',
  recordIDSet: new Set(),
  contacts: [],
};

const slice = createSlice({
  name: 'talk',
  initialState,
  reducers: {
    // set last tab
    // 2개 리스트를 유지한다.
    // pushLastTab: (state, action) => {
    //   const {lastTab} = state;
    //   if (lastTab.first() !== action.payload) {
    //     state.lastTab = lastTab.unshift(action.payload).setSize(2);
    //   }
    // },
    updateContact: (state, action) => {
      console.log('@@ cont act@@', action.payload);
      state.contacts = action.payload;
      // return {...state, contacts: action.payload};
      return state;
      // return {...initialState, contacts: action.payload};
    },
    updateRecordSet: (state, action) => {
      // storeData('recordIDSet', action.payload || '');
      if (action.payload) {
        state.recordIDSet = new Set(action.payload.split(','));
      } else {
        state.recordIDSet = new Set();
      }
    },
    // updateProdListCallTime: (state, action) => {
    //   console.log('updateProdListCallTime : ', action.payload);
    //   if (state.prodList[0]) {
    //     state.prodList[0].callTime = action.payload;
    //   }
    // },
    updateMode: (state, action) => {
      if (action.payload !== undefined) state.mode = action.payload;
    },
    resetWithoutContacts: (state) => {
      // logout때, 통화기록은?
      return {...initialState, contacts: state.contacts};
    },
  },
});

export const getContacts = createAsyncThunk(
  'talk/getContact',
  (_, {dispatch}) => {
    return Contacts.getAll()
      .then((contacts) => {
        const sortedContacts = (contacts || []).sort((a, b) => sortName(a, b));
        console.log('@@@ cont22', sortedContacts);
        dispatch(slice.actions.updateContact(sortedContacts));
        return sortedContacts;
        // dispatch(updateContacts(contacts));
      })
      .catch((err) => {
        console.warn('Permission to access contacts was denied', err);
      });
  },
);

export const actions = {
  ...slice.actions,
  getContacts,
  // getTalkPoint,
};

export type TalkAction = typeof actions;

export default slice.reducer as Reducer<TalkModelState, AnyAction>;
