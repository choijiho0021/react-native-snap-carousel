/* eslint-disable no-param-reassign */
import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Contacts from 'react-native-contacts';
import {AnyAction} from 'redux';
import {Reducer} from 'redux-actions';
import moment, {Moment} from 'moment';
import {API} from '@/redux/api';
import {checkEng, checkKor} from '@/constants/CustomTypes';
import {SectionData} from './account';

export const updateContacts = createAction('rkbTalk/updateContact');
export const updateCalledNumber = createAction('rkbTalk/updateCalledNumber');
export const appendCalledNumber = createAction('rkbTalk/appendCalledNumber');
export const updateRecordSet = createAction('rkbTalk/updateRecordSet');
const getExpPointInfo = createAsyncThunk(
  'rkbTalk/getExpPointInfo',
  API.TalkApi.getExpPointInfo,
);
const getPointHistory = createAsyncThunk(
  'rkbTalk/getPointHistory',
  API.TalkApi.getPointHistory,
);

const getTariff = createAsyncThunk('rkbTalk/getTariff', API.TalkApi.getTariff);

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

type ContactName = {
  familyName: string;
  givenName: string;
};

export const sortName = (a: ContactName, b: ContactName) => {
  const nameA = a.familyName + a.givenName;
  const nameB = b.familyName + b.givenName;

  const priorityA = checkKor.test(nameA) ? -2 : checkEng.test(nameA) ? -1 : 0;
  const priorityB = checkKor.test(nameB) ? -2 : checkEng.test(nameB) ? -1 : 0;

  if (priorityA > priorityB) return priorityA;
  if (priorityA === priorityB)
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  return priorityB;
};

export type TalkTariff = {
  // country: string; // kr, jp, ...
  code: string; // country code: 81, 82, etc
  name: string;
  chosung: string;
  mobile: number; // mobile tariff
  wireline: number; // landline tariff
  flag: string;
};

export interface TalkModelState {
  point: string;
  recordIDSet: Set<string>;
  contacts: any[];
  pointHistory?: SectionData[];
  expList?: ExpPointHistory[];
  expPoint?: string;
  called?: string;
  ccode?: string; // country code parsed from 'called number'
  tariff: Record<string, TalkTariff>;
  maxCcodePrefix: number; // max length of country code
}

const initialState: TalkModelState = {
  point: '0',
  recordIDSet: new Set(),
  contacts: [],
  tariff: {},
  maxCcodePrefix: 0,
};

// find matching country coude
const findCcode = (state: TalkModelState) => {
  if (!state.called) {
    return undefined;
  }

  if (!state.ccode || !state.called.startsWith(state.ccode)) {
    for (let i = 1; i <= state.maxCcodePrefix; i++) {
      const prefix = state.called.substring(0, i);
      if (state.tariff.hasOwnProperty(prefix)) {
        return prefix;
      }
    }
    return undefined;
  }

  return state.ccode;
};

const slice = createSlice({
  name: 'talk',
  initialState,
  reducers: {
    deleteCalledNumber: (state) => {
      const len = state.called?.length || 0;
      if (len > 0) {
        state.called = state.called?.substring(0, len - 1);
        state.ccode = findCcode(state);
      }
      return state;
    },
    appendCalledNumber: (state, action) => {
      state.called = (state.called || '') + action.payload;
      state.ccode = findCcode(state);
      return state;
    },
    updateCalledNumber: (state, action) => {
      state.called = action.payload;
      state.ccode = findCcode(state);
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
    builder.addCase(getTariff.fulfilled, (state, action) => {
      state.tariff = action.payload;
      state.maxCcodePrefix = Object.keys(state.tariff).reduce(
        (acc, cur) => Math.max(acc, cur.length),
        0,
      );

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
  getTariff,
  // getTalkPoint,
};

export type TalkAction = typeof actions;

export default slice.reducer as Reducer<TalkModelState, AnyAction>;
