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

export default actions;
