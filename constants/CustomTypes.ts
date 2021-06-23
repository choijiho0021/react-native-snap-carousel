import {Map as ImmutableMap} from 'immutable';
import i18n from '@/utils/i18n';

const Toast = {
  NOT_LOADED: 1,
  NOT_UPDATED: 2,
  NOT_OPENED: 3,
  COPY_SUCCESS: 4,

  messageMap: () =>
    ImmutableMap({
      [Toast.NOT_LOADED]: i18n.t('toast:failedToLoad'),
      [Toast.NOT_UPDATED]: i18n.t('toast:failedToUpdate'),
      [Toast.NOT_OPENED]: i18n.t('toast:failedToOpen'),
      [Toast.COPY_SUCCESS]: i18n.t('toast:copySuccess'),
    }),

  mapToMessage: (idx: number) => {
    if (idx && Toast.messageMap().has(idx.toString())) {
      return Toast.messageMap().get(idx.toString());
    }

    return Toast.messageMap().get(Toast.NOT_LOADED.toString());
  },
};

export {Toast};
