const actions = {
  UPDATE_ISREAD: 'UPDATE_ISREAD',
  GET_NOTI_LIST: 'GET_NOTI_LIST',
  SELECT_NOTI: 'SELECT_NOTI',

  getNotiList: (notiList) => ({
    type: actions.GET_NOTI_LIST,
    notiList,
  }),
  updateIsRead: (isread) => ({
    type: actions.UPDATE_ISREAD,
    isread,
  }),

  selectNoti: (uuid) => ({
    type: actions.SELECT_NOTI,
    uuid,
  }),
};

export const initialNoti = () => ({
  notiList: [],
  uuid: undefined,
  isread: undefined,
});

export const notiReducer = (state = initialNoti(), action) => {
  switch (action.type) {
    case actions.GET_NOTI_LIST:
      return {
        ...state,
        notiList: action.notiList,
      };
    case actions.SELECT_NOTI:
      return {
        ...state,
        uuid: action.uuid,
      };

    case actions.UPDATE_ISREAD:
      return {
        ...state,
        isread: action.isread,
      };
  }

  return state;
};
