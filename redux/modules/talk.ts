/* eslint-disable no-param-reassign */
import {
  createAction,
  createAsyncThunk,
  createSlice,
  RootState,
} from '@reduxjs/toolkit';
import Contacts from 'react-native-contacts';
import {AnyAction} from 'redux';
import {Reducer} from 'redux-actions';
import moment, {Moment} from 'moment';
import _ from 'underscore';
import {API} from '@/redux/api';
import {checkEng, checkKor} from '@/constants/CustomTypes';
import {SectionData} from './account';
import {parseJson, retrieveData, storeData} from '@/utils/utils';

export const updateContacts = createAction('talk/updateContact');
const getExpPointInfo = createAsyncThunk(
  'talk/getExpPointInfo',
  API.TalkApi.getExpPointInfo,
);
const getPointHistory = createAsyncThunk(
  'talk/getPointHistory',
  API.TalkApi.getPointHistory,
);

const getTariff = createAsyncThunk('talk/getTariff', API.TalkApi.getTariff);

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
  tz: string;
  flag: string;
};

export type CallHistory = {
  key: string; // callId
  destination: string;
  duration: number;
  stime: string; // 년/월/일/통화시각
  name?: string; // 연락처 발신ㅅ
  year?: string;
  ccode?: string; // 국가번
};
export interface TalkModelState {
  point: string;
  recordIDSet: Set<string>;
  contacts: any[];
  pointHistory?: SectionData[];
  expList?: ExpPointHistory[];
  expPoint?: string;
  called?: string; // include ccode
  ccode?: string; // country code parsed from 'called number'
  tariff: Record<string, TalkTariff>;
  maxCcodePrefix: number; // max length of country code
  callHistory: SectionData[];
  clickedNum?: string; // same with contact
  clickedName?: string;
  clickedIncCc?: boolean; // if clicked number has cccode
  duration?: number;
}

const makeSectionData = (hist: CallHistory[]) => {
  return hist?.reduce((acc, cur, idx, all) => {
    const year = moment(cur.stime).format('YYYY');
    const title = moment(cur.stime).format('M월 D일') + year;
    const i = (acc || [{}]).findIndex((a) => a?.title === title);
    if (i >= 0) {
      const newData = acc[i]?.data.push(cur);
      return acc.splice(i, 1, newData);
    }
    // 0부터 최신순
    const y = acc[acc?.length - 1]?.title?.slice(-4);
    const d =
      y === year || moment().format('YYYY') === year ? [cur] : [{...cur, year}];
    return acc.concat({
      title,
      data: d,
    });
  }, []);
};

const getOriginNumber = (number: string, ccode?: string) =>
  ccode ? number?.substring(ccode.length) : number;

const updateCalls = async (state: TalkModelState, payload: CallHistory) => {
  const {key, destination, stime = moment()} = payload || {};

  const origin = getOriginNumber(state.called, state?.ccode);
  const isSame = state.clickedIncCc
    ? state?.clickedNum === state.called
    : state?.clickedNum === origin;
  const name = isSame ? state.clickedName : undefined;
  const dest = isSame ? state.clickedNum : state.called;

  const json = await retrieveData('callHistory');
  const hist = parseJson(json);

  let newHistory: CallHistory[] = hist;
  const idx = (hist || []).findIndex((v) => v.key === key);

  if (idx < 0) {
    newHistory = [
      {
        key,
        destination: dest, // 연락처 클릭인경우 클릭한 번호 그대로 사용
        duration: state.duration || 0,
        stime,
        ccode: state.ccode || '',
        name,
      },
    ].concat(hist || []);
  } else {
    // 기존 hist 값 변경
    hist.splice(idx, 1, {...hist[idx], duration: state.duration});
    newHistory = hist;
  }

  storeData('callHistory', JSON.stringify(newHistory));
  return makeSectionData(newHistory);
};

const initialState: TalkModelState = {
  point: '0',
  recordIDSet: new Set(),
  contacts: [],
  tariff: {},
  maxCcodePrefix: 0,
  callHistory: [],
  duration: 0,
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

const loadHistory = async () => {
  const callHist = await retrieveData('callHistory');
  if (callHist) return makeSectionData(parseJson(callHist));
  return [];
};

const trimName = (s?: string) => s?.trimEnd();

const slice = createSlice({
  name: 'talk',
  initialState,
  reducers: {
    delCalledPty: (state) => {
      const len = state.called?.length || 0;
      if (len > 0) {
        state.called = state.called?.substring(0, len - 1);
        state.ccode = findCcode(state);
      }
      return state;
    },
    appendCalledPty: (state, action) => {
      state.called = (state.called || '') + action.payload;
      state.ccode = findCcode(state);
      return state;
    },
    updateCalledPty: (state, action) => {
      state.called = action.payload;
      state.ccode = findCcode(state);
      return state;
    },
    updateClicked: (state, action) => {
      const num = action.payload?.num;

      state.clickedIncCc = undefined;
      state.clickedName = trimName(action.payload?.name);
      if (state.clickedName) {
        if (!state.ccode) {
          state.ccode = '82';
          state.called = state.ccode + num;
          state.clickedIncCc = false;
        } else state.clickedIncCc = true;
      }

      state.clickedNum = num;
      return state;
    },
    updateDuration: (state, action) => {
      state.duration = action.payload;
      return state;
    },
    setCountryCode: (state, action) => {
      if (state.ccode) {
        // replace current calling code
        state.called =
          action.payload + (state.called || '').substring(state.ccode.length);
      } else {
        // add calling code
        state.called = action.payload + (state.called || '');
      }
      state.ccode = action.payload;
      return state;
    },
    updateContact: (state, action) => {
      state.contacts = action.payload;
      return state;
    },
    updateHistory: (state, action) => {
      state.callHistory = action.payload;
      return state;
    },
    updateCcode: (state, action) => {
      if (state.called) {
        if (state.ccode) {
          const origin = getOriginNumber(state.called, state.ccode);
          state.called = action.payload + origin;
        } else state.called = action.payload + state.called;
      } else state.called = action.payload;

      state.ccode = action.payload;
      return state;
    },
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

export const readHistory = createAsyncThunk(
  'talk/readHistory',
  async (_, {dispatch}) => {
    Promise.resolve(loadHistory()).then((h) =>
      dispatch(slice.actions.updateHistory(h)),
    );
  },
);

export const callInitiated = createAsyncThunk(
  'talk/callInitiated',
  async (payload: CallHistory, {dispatch, getState}) => {
    const {talk} = getState() as RootState;
    Promise.resolve(updateCalls(talk, payload)).then((h) =>
      dispatch(slice.actions.updateHistory(h)),
    );
  },
);

export const callChanged = createAsyncThunk(
  'talk/callChanged',
  async (payload: CallHistory, {dispatch, getState}) => {
    const {talk} = getState() as RootState;
    Promise.resolve(updateCalls(talk, payload)).then((h) => {
      dispatch(slice.actions.updateHistory(h));
      dispatch(slice.actions.updateDuration(0));
    });
  },
);

export const updateNumberClicked = createAsyncThunk(
  'talk/updateNumberClicked',
  async ({num, name}: {num: string; name: string}, {dispatch}) => {
    dispatch(slice.actions.updateCalledPty(num));
    dispatch(slice.actions.updateClicked({num, name}));
  },
);

export const actions = {
  ...slice.actions,
  getContacts,
  getPointHistory,
  getExpPointInfo,
  getTariff,
  readHistory,
  callInitiated,
  callChanged,
  updateNumberClicked,
  // getTalkPoint,
};

export type TalkAction = typeof actions;

export default slice.reducer as Reducer<TalkModelState, AnyAction>;
