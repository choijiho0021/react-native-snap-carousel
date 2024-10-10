/* eslint-disable no-param-reassign */
import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Contacts from 'react-native-contacts';
import {AnyAction} from 'redux';
import {Reducer} from 'redux-actions';
import moment, {Moment} from 'moment';
import {API} from '@/redux/api';
import {checkEng, checkKor} from '@/constants/CustomTypes';
import {SectionData} from './account';

// 10 items per page
const PAGE_LIMIT = 10;
const PAGE_UPDATE = 0;

export const updateContacts = createAction('rkbTalk/updateContact');
export const updateClickedNumber = createAction('rkbTalk/updateClickedNumber');
export const updateRecordSet = createAction('rkbTalk/updateRecordSet');
const getExpPointInfo = createAsyncThunk(
  'rkbTalk/getExpPointInfo',
  API.TalkApi.getExpPointInfo,
);
const getPointHistory = createAsyncThunk(
  'rkbTalk/getPointHistory',
  API.TalkApi.getPointHistory,
);

export type PointHistory = {
  diff: string;
  expire_at: Moment;
  created: Moment;
  reason: string;
  ref_node: string;
};

export type ExpPointLog = {
  exp: string;
  list: ExpPointHistory[];
  tpnt: string;
};

export type ExpPointHistory = {
  expire_at: Moment;
  point: string;
};

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
  pointHistory: SectionData[];
  expList: ExpPointHistory[];
  expPoint: string;
  selectedNum?: string;
}

const initialState: TalkModelState = {
  point: '0',
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
    updateClickedNumber: (state, action) => {
      state.selectedNum = action.payload;
      return state;
    },
    updateContact: (state, action) => {
      state.contacts = action.payload;
      return state;
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
  extraReducers: (builder) => {
    builder.addCase(getPointHistory.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0) {
        const group = objects?.reduce((acc, cur) => {
          const year = cur.created.format('YYYY');

          const idx = acc.findIndex((elm) => elm.title === year);

          if (idx <= -1) {
            acc.push({title: year, data: [cur] as PointHistory[]});
          } else acc[idx].data?.push(cur);

          return acc;
        }, [] as SectionData[]);

        state.pointHistory = group;
      }

      return state;
    });
    builder.addCase(getExpPointInfo.fulfilled, (state, action) => {
      const {result, objects} = action.payload;

      if (result === 0 && objects) {
        state.expList = (objects?.list || []).map(
          (l) =>
            ({
              ...l,
              expire_at: l.expire_at ? moment.unix(l.expire_at) : undefined,
            } as ExpPointHistory),
        );

        state.expPoint = objects.exp;
        state.point = objects.tpnt;
      }
      return state;
    });
  },
});

export const getContacts = createAsyncThunk(
  'talk/getContact',
  (_, {dispatch}) => {
    return Contacts.getAll()
      .then((contacts) => {
        const sortedContacts = (contacts || []).sort((a, b) => sortName(a, b));
        dispatch(slice.actions.updateContact(sortedContacts));
        return sortedContacts || [];
      })
      .catch((err) => {
        console.warn('Permission to access contacts was denied', err);
        return err;
      });
  },
);

export const actions = {
  ...slice.actions,
  getContacts,
  getPointHistory,
  getExpPointInfo,
  // getTalkPoint,
};

export type TalkAction = typeof actions;

export default slice.reducer as Reducer<TalkModelState, AnyAction>;
