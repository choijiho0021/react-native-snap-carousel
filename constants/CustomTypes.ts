import {Map as ImmutableMap} from 'immutable';
import i18n from '@/utils/i18n';

export enum Toast {
  NOT_LOADED = 1,
  NOT_UPDATED = 2,
  NOT_OPENED = 3,
  COPY_SUCCESS = 4,
}

const messageMap = ImmutableMap({
  [Toast.NOT_LOADED]: i18n.t('toast:failedToLoad'),
  [Toast.NOT_UPDATED]: i18n.t('toast:failedToUpdate'),
  [Toast.NOT_OPENED]: i18n.t('toast:failedToOpen'),
  [Toast.COPY_SUCCESS]: i18n.t('toast:copySuccess'),
});

export const mapToMessage = (key: string) => {
  if (key && messageMap.has(key)) {
    return messageMap.get(key);
  }

  return messageMap.get(Toast.NOT_LOADED.toString());
};
